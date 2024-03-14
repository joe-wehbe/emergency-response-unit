<?php

namespace App\Http\Controllers;

use App\Models\Cover_request;
use App\Models\User;
use Carbon\Carbon;
use App\Models\User_has_shift;
use Illuminate\Http\Request;
use Illuminate\Database\Eloquent\ModelNotFoundException;
use Illuminate\Support\Facades\Validator;

class UserController extends Controller
{

    function login(Request $request){
        $check_user = User::where("lau_email", $request->lau_email)->first();
    
        // Checks if the user exists in the database
        if(!$check_user) {
            return response()->json([
                "status" => "Invalid credentials",
            ]);
        }
    
        // Check if the user has exceeded the maximum number of login attempts
        if ($this->hasExceededLoginAttempts($credentials->lau_email)) {
            // Check the last login attempt time
            $last_attempt = login_attempt::where('lau_email', '=', $request->lau_email)->orderBy('created_at', 'desc')->first();
            $now = Carbon::now();
            $last_attempt_time = Carbon::parse($last_attempt->created_at);
            $diff_in_hours = $last_attempt_time->diffInHours($now);
    
            // If the last login attempt was more than 24 hours ago, clear the login attempts and allow the user to log in
            if ($diff_in_hours >= 24) {
                $this->resetLoginAttempts($request->lau_email);
            } else {
                return response()->json([
                    "status" => "Too many failed login attempts",
                ]);
            }

    }

     // Checks if the password is correct
     if(Hash::check($request->password, $check_user->password)){
        $this->resetLoginAttempts($request->lau_email);
        // Creates a new token for the user
        $token = $check_user->createToken('authToken')->plainTextToken;
        $user_id = $check_user->id;
        return response()->json([
            "status" => 'Login successful',
            "token" => $token,
            "user_id" => $user_id,
            "user_type" => $check_user->user_type,

        ]);
    } else {
        // Adds a failed login attempt to the database if the user has inputted the wrong password
        $this->addFailedLoginAttempt($request->lau_email);
        return response()->json([
            "status" => "Invalid credentials",
        ]);
    }
}

//private functions used for login 
private function hasExceededLoginAttempts($lau_email) {
    $total_attempts = login_attempt::where('lau_email', '=', $lau_email)->count();
    return ($total_attempts >= 5);
}

private function resetLoginAttempts($lau_email) {
    login_attempt::where('lau_email', '=', $lau_email)->delete();
}

private function addFailedLoginAttempt($lau_email) {
    login_attempt::create([
        'login_attempt_time' => Carbon::now()->format('H:i:s'),
        'login_attempt_date' => Carbon::now()->format('Y-m-d'),
        'lau_email' => $lau_email,
    ]);
}




    function logout(Request $request){
        auth()->user()->tokens()->delete();
        return response()->json([
            "status" => "Logged out",
        ]);
    }

    // PROFILE PAGE
    public function getUserInfo($id){
        try {
            $user = User::findOrFail($id);
            return response()->json(['User' => $user], 200);
        } catch (ModelNotFoundException $exception) {
            return response()->json(['error' => 'User not found'], 404);
        }
    }

    public function editBio(Request $request, $id)
    {
        $validator = Validator::make($request->all(), [
            'bio' => 'required|string',
        ]);

        if ($validator->fails()) {
            return response()->json(['error' => $validator->errors()], 400);
        }

        try {
            $user = User::findOrFail($id);
            $user->bio = $request->bio;
            $user->save();
            return response()->json(['message' => 'Bio updated'], 200);
        } catch (ModelNotFoundException $exception) {
            return response()->json(['error' => 'User not found'], 404);
        }
    }

    public function editTags(Request $request, $id){
        $validator = Validator::make($request->all(), [
            'tags' => 'required|string',
        ]);

        if ($validator->fails()) {
            return response()->json(['error' => $validator->errors()], 400);
        }

        try {
            $user = User::findOrFail($id);
            $user->tags = $request->tags;
            $user->save();
            return response()->json(['message' => 'Tags updated'], 200);
        } catch (ModelNotFoundException $exception) {
            return response()->json(['error' => 'User not found'], 404);
        }
    }

    public function requestCover(Request $request, $userId, $shiftId){
        $request-> validate([
            'reason' => 'required',
        ]);

        $coverRequest = new Cover_request();
        $coverRequest->user_id = $userId;
        $coverRequest->shift_id = $shiftId;
        $coverRequest->reason = $request->reason;
        $coverRequest->request_status = 1;
        $coverRequest->save();

        return response()->json(['message' => 'Cover Request added successfully'], 201); 
    }

    public function markAttendance($userId){
        try {
            User::findOrFail($userId);
            $userShifts = User_has_shift::where('user_id', $userId)->get();
            $attendanceMarked = false;
    
            foreach ($userShifts as $shift) {
                if ($shift->shift_status == 1) {
                    $shift->missed_attendance = 0;
                    $shift->checkin_time = Carbon::now();
                    $shift->save();
                    
                    $attendanceMarked = true;
                    break;
                }
            }
    
            if ($attendanceMarked) {
                return response()->json(['message' => 'User attendance marked successfully'], 200);
            } else {
                return response()->json(['message' => 'No shifts with status 1 found'], 200);
            }
        } catch (ModelNotFoundException $exception) {
            return response()->json(['error' => 'User not found'], 404);
        }
    }
}
