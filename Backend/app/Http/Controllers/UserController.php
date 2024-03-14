<?php

namespace App\Http\Controllers;

use App\Models\Cover_request;
use App\Models\User;
use App\Models\Shift;
use Carbon\Carbon;
use App\Models\User_has_shift;
use App\Models\Announcement;
use App\Models\Extension;
use App\Models\Medical_faq;
use App\Models\Emergency;
use Illuminate\Http\Request;
use Illuminate\Database\Eloquent\ModelNotFoundException;
use Exception;

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
    public function getUserInfo($id)
    {
        try {
            $user = User::findOrFail($id);
            return response()->json(['User' => $user], 200);
        } catch (ModelNotFoundException $exception) {
            return response()->json(['error' => 'User not found'], 404);
        }
    }

    public function editBio(Request $request){

        $request-> validate([
            'id' => 'required',
            'bio' => 'required|string',        
        ]);

        try {
            $user = User::find($request->id);

            if($user){
                $user->bio = $request->bio;
                $user->save();
                return response()->json(['message' => 'Bio updated'], 200);
            }
            else{
                return response()->json(['error' => 'User not found'], 404);
            }

        }catch (Exception $exception) {
            return response()->json(['error' => 'An error occurred'], 500);
        }
    }

    public function editTags(Request $request){
        $request-> validate([
            'id' => 'required',
            'tags' => 'required|string',        
        ]);

        try {
            $user = User::find($request->id);

            if($user){
                $user->tags = $request->tags;
                $user->save();
                return response()->json(['message' => 'Tags updated'], 200);
            }
            else{
                return response()->json(['error' => 'User not found'], 404);
            }

        }catch (Exception $exception) {
            return response()->json(['error' => 'An error occurred'], 500);
        }
    }

    public function requestCover(Request $request){
        $request-> validate([
            'user_id' => 'required',
            'shift_id' => 'required',
            'reason' => 'required',
        ]);

        try{
            $user = User::find($request->user_id);

            if($user){

                $shift = Shift::find($request->shift_id);

                if($shift){
                    $coverRequest = new Cover_request();
                    $coverRequest->user_id = $request->user_id;
                    $coverRequest->shift_id = $request->shift_id;
                    $coverRequest->reason = $request->reason;
                    $coverRequest->request_status = 1;
                    $coverRequest->save();
            
                    return response()->json(['message' => 'Cover request added successfully'], 201); 
                }
                else{
                    return response()->json(['error' => 'Shift not found'], 404);
                }
            }
            else{
                return response()->json(['error' => 'User not found'], 404);
            }
        }catch (Exception $exception) {
            return response()->json(['error' => 'An error occurred'], 500);
        }
    }

    public function markAttendance(Request $request){
        $request-> validate([
            'user_id' => 'required',
        ]);
        
        try {
            $user = User::find($request->user_id);

            if($user){

                $userShifts = User_has_shift::where('user_id', $request->user_id)->get();
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
            }
            else{
                return response()->json(['error' => 'User not found'], 404); 
            }

        }catch (Exception $exception) {
            return response()->json(['error' => 'An error occurred'], 500);
        }
    }

    public function getAllUsers()
    {
        try {
            $users = User::all();
            return response()->json(['users' => $users], 200);
        } catch (Exception $exception) {
            return response()->json(['error' => 'Failed to fetch users'], 500);
        }
    }

    public function getAllAnnouncements()
    {
        try {
            $announcements = Announcement::all();
            return response()->json(['announcements' => $announcements], 200);
        } catch (Exception $exception) {
            return response()->json(['error' => 'Failed to fetch announcements'], 500);
        }
    }

    public function getAnnouncement($id)
    {
        try {
            $announcement = Announcement::findOrFail($id);
            return response()->json(['announcement' => $announcement], 200);
        } catch (ModelNotFoundException $exception) {
            return response()->json(['error' => 'Announcement not found'], 404);
        } catch (\Exception $e) {
            return response()->json(['error' => 'Failed to fetch announcement'], 500);
        }
    }

    public function getAllCoverRequests()
    {
        try {
            $coverRequests = Cover_request::all();
            return response()->json(['coverRequests' => $coverRequests], 200);
        } catch (\Exception $e) {
            return response()->json(['error' => 'Failed to fetch cover requests'], 500);
        }
    }

    public function acceptCoverRequest(Request $request)
    {
        $request->validate([
            'id' => 'required', //id of the cover request
            'covered_by' => 'required',
        ]);
        try {
            $coverRequest = Cover_request::findOrFail($request->id);
            $coverRequest->request_status = 1; //if request accepted becomes 1
            $coverRequest->covered_by = $request->covered_by;
            $coverRequest->save();

            return response()->json(['message' => 'Cover request accepted'], 200);
        } catch (ModelNotFoundException $exception) {
            return response()->json(['error' => 'Cover request not found'], 404);
        }
    }

    public function getExtensions()
    {
        try {
            $extensions = Extension::all();
            return response()->json(['extensions' => $extensions], 200);
        } catch (\Exception $e) {
            return response()->json(['error' => 'Failed to fetch extensions'], 500);
        }
    }

    public function getMedicalFaqs($id)
    {
        try {
            $medicalFAQ = Medical_faq::findOrFail($id);

            return response()->json(['medicalFAQ' => $medicalFAQ], 200);
        } catch (ModelNotFoundException $exception) {
            return response()->json(['error' => 'Medical FAQ not found'], 404);
        } catch (\Exception $e) {
            return response()->json(['error' => 'Failed to fetch medical FAQ'], 500);
        }
    }
    
    public function addCaseReport(Request $request){
        $request-> validate([
            'id' => 'required|integer',
            'history' => 'required|string',
            'treatment_administration' => 'required',
            'transportation' => 'required',
            'equipment' => 'required',
            'status' => 'required|integer',
            'issues' => 'required|integer',
            'case_report' => 'required|boolean',

        ]);

        try{
            $case_form = Emergency::find($request->id);

            if($case_form){
             
                $case_form->history = $request->history;
                $case_form->treatment_administration = $request->treatment_administration;
                $case_form->transportation = $request->transportation;
                $case_form->equipment = $request->equipment;
                $case_form->status = $request->status;
                $case_form->issues = $request->issues;
                $case_form->case_report = 1;
                $case_form->save();
                return response()->json(['message' => 'Case report for the emergency added successfully'], 201);
            }
            else{
                return response()->json(['error' => 'Emergency not found'], 404);
            }
        }catch (Exception $exception) {
            return response()->json(['error' => 'An error occurred'], 500);
        }
    }
    
    public function getEmergencyRecords(){
        $emergencies = Emergency::where('case_report', 1)->get();
        return response()->json(['emergency records' => $emergencies], 200);
    }

}
