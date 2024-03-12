<?php

namespace App\Http\Controllers;

use App\Models\Cover_request;
use App\Models\User;
use App\Models\Shift;
use Carbon\Carbon;
use App\Models\User_has_shift;
use App\Models\Announcement;
use Illuminate\Http\Request;
use Illuminate\Database\Eloquent\ModelNotFoundException;
use Exception;

class UserController extends Controller
{
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
}
