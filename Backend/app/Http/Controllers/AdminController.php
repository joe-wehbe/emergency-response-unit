<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\Log;
use App\Models\Announcement;
use App\Models\User;
use App\Models\Medical_faq;
use App\Models\Extension;
use App\Models\Login_request;
use App\Models\Shift;
use App\Models\User_has_shift;
use App\Models\Cover_request;
use App\Models\Rank;
use App\Models\Emergency;
use Illuminate\Support\Facades\DB;
use App\Models\Semester;
use Exception;

class AdminController extends Controller{

    public function updateSemesterDates(Request $request){

        $request-> validate([
            'id' => 'required',
            'start_date' => 'required',
            'end_date' => 'required'
        ]);

        try{
            $semester = Semester::find($request->id);

            if($semester){
                $semester->start_date = $request->start_date;
                $semester->end_date = $request->end_date;
                $semester->save();
                return response()->json(['message' => 'Semester dates updated successfully'], 201);    
            }
            else{
                $semester = new Semester();
                $semester->start_date = $request->start_date;
                $semester->end_date = $request->end_date;
                $semester->save();
                return response()->json(['message' => 'Semster not found, created a new one'], 201);    
            }
        }  catch (Exception $exception) {
            return response()->json(['error' => $exception->getMessage()], 500);
        }
    }
    
    // MANAGE MEMBERS TAB
    public function addMember(Request $request){
        $request->validate([
            'lau_email' => 'required'
        ]);

        try {
            $user = User::where('lau_email', $request->input('lau_email'))->first();

            if ($user) {
                $user->user_type = 1;
                $user->save();
                return response()->json(['message' => 'Member added successfully']);
               
            } else {
                return response()->json(['message' => 'User not registered yet']);
            }
        } catch (Exception $exception) {
            return response()->json(['error' => $exception->getMessage()], 500);
        }
    }

    public function removeMember(Request $request){
        $request->validate([
            'id' => 'required',
        ]);

        try {
            $user = User::find($request->id);

            if($user){
                $user->user_type = 2;    
                $user->save();
                return response()->json(['message' => 'User removed successfully'], 200);
            }
            else{
                return response()->json(['error' => 'User not found'], 404);
            } 
        } catch (Exception $exception) {
            return response()->json(['error' => $exception->getMessage()], 500);
        }
    }

    function deleteUser(Request $request){

        try {
            $user = User::where('id', $request->input('user_id'))->first();
            $admin = User::where('id', $request->input('admin_id'))->first();

            if (!$admin) {
                return response()->json([
                    'status' => 'Error',
                    'message' => 'Admin not found'
                ]);
            }

            if (!in_array($admin->user_rank, [3, 4, 5, 7])) {
                return response()->json([
                    'status' => 'Error',
                    'message' => 'User is not an admin'
                ]);
            }

            if (!$user) {
                return response()->json([
                    'status' => 'Error',
                    'message' => 'User not found'
                ]);
            }

            $user->delete();

            return response()->json([
                'status' => 'success',
                'message' => 'User deleted successfully'
            ]);
        } 
        catch (Exception $exception) {
            return response()->json([
                'status' => 'Error',
                'message' => 'An error occurred while deleting the user',
                'error' => $exception->getMessage()
            ]);
        }
    }

    public function changeRank(Request $request){
        $request->validate([
            'user_id' => 'required',
            'rank_id' => 'required',
        ]);

        try {
            $user = User::find($request->user_id);

            if($user){
                $rank = Rank::find($request->rank_id);

                if($rank){
                    $user->user_rank = $request->rank_id;    
                    $user->save();
                    return response()->json(['message' => 'Rank updated successfully'], 200);
                }else{
                    return response()->json(['error' => 'Rank not found'], 404);
                }
            }else{
                return response()->json(['error' => 'User not found'], 404);
            }
        } catch (Exception $exception) {
            return response()->json(['error' => $exception->getMessage()], 500);
        }
    }

    public function getUserShifts($userId){
        try {
            $user = User::find($userId);
    
            if($user){
                $shifts = User_has_shift::where('user_id', $userId)
                ->join('shifts', 'user_has_shifts.shift_id', '=', 'shifts.id')
                ->get();
            
                return response()->json(['Shifts' => $shifts], 200);
            }
            else{
                return response()->json(['error' => 'User not found'], 404);
            }
    
        } catch (Exception $exception) {
            return response()->json(['error' => $exception->getMessage()], 500);
        }
    }

    public function addShift(Request $request){
        $request->validate([
            'user_id' => 'required',
            'shift_id' => 'required',
        ]);

        try {
            $user = User::find($request->user_id);

            if ($user) {
                $shift = Shift::find($request->shift_id);

                if ($shift) {
                    $user_has_shift = new User_has_shift();
                    $user_has_shift->user_id = $request->user_id;
                    $user_has_shift->shift_id = $request->shift_id;
                    $user_has_shift->save();

                    return response()->json(['message' => 'Shift added successfully'], 201);

                } else {
                    return response()->json(['error' => 'Shift not found'], 404);
                }
            } else {
                return response()->json(['error' => 'User not found'], 404);
            }
        }  catch (Exception $exception) {
            return response()->json(['error' => $exception->getMessage()], 500);
        }
    }

    public function deleteShift($shift_id, $user_id){
      
        try {
            $user = User::find($user_id);

            if ($user) {
                $shift = User_has_shift::find($shift_id);

                if ($shift) {
                    $shift->delete();
                    return response()->json(['message' => 'Shift deleted successfully']);
                } else {
                    return response()->json(['error' => 'Shift not found']);
                }
            } else {
                return response()->json(['error' => 'User not found']);
            }
        }  catch (Exception $exception) {
            return response()->json(['error' => $exception->getMessage()], 500);
        }
    }

    // MANAGE ANNOUNCEMENTS TAB
    public function addAnnouncement(Request $request){
        $validator = Validator::make($request->all(), [
            'admin_id' => 'required|exists:users,id',
            'importance' => 'required|string',
            'description' => 'required|string',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'status' => 'Error',
                'error' => $validator->errors()->first()
            ]);
        }

        try {
            $announcement = new Announcement();
            $announcement->fill($request->all());
            $announcement->save();

            return response()->json(['message' => 'Announcement added successfully']);
        }  catch (Exception $exception) {
            return response()->json(['error' => $exception->getMessage()], 500);
        }
    }

    function deleteAnnouncement(Request $request){
        $request->validate([
            'announcement_id' => 'required|integer',
            'admin_id' => 'required|integer'
        ]);

        $announcement = Announcement::where('id', $request->input('announcement_id'))->first();
        $admin = User::where('id', $request->input('admin_id'))->first();

        if (!$announcement) {
            return response()->json([
                'status' => 'Error',
                'message' => 'Announcement not found'
            ]);
        }

        if (!$admin) {
            return response()->json([
                'status' => 'Error',
                'message' => 'Admin not found'
            ]);
        }

        if (!in_array($admin->user_rank, [3, 4, 5, 7])) {
            return response()->json([
                'status' => 'Error',
                'message' => 'User is not an admin'
            ]);
        }

        if ($admin->id != $announcement->admin_id) {
            return response()->json([
                'status' => 'Error',
                'message' => 'User does not match admin ID of poster'
            ]);
        }

        $announcement->delete();
        return response()->json([
            'status' => 'Success',
            'message' => 'Announcement deleted successfully'
        ]);
    }

    function getAdmins(){
        $admins = User::whereIn('user_rank', [3, 4, 5]) 
        ->get();

return response()->json(['admins' => $admins], 200);
    }

    function getOngoingShifts(){
    $userDetails = User::join('user_has_shifts', 'users.id', '=', 'user_has_shifts.user_id')
                        ->where('user_has_shifts.shift_status', '1')
                        ->get(['users.id', 'users.first_name', 'users.last_name', 'users.user_rank', 'users.profile_picture']); 

    return response()->json(['users_with_ongoing_shifts' => $userDetails], 200);
    }

    // MANAGE FAQs TAB
    function addFaq(Request $request){
       /* $admin = User::where('id', $request->input('admin_id'))->first();

        if (!$admin) {
            return response()->json([
                'status' => 'Error',
                'message' => 'Admin not found'
            ]);
        }

        if (!in_array($admin->user_rank, [3, 4, 5, 7])) {
            return response()->json([
                'status' => 'Error',
                'message' => 'User is not an admin'
            ]);
        }*/

        $validator = Validator::make($request->all(), [
            'type' => 'required|string',
            'question' => 'required|string',
            'answer' => 'required|string',

        ]);

        if ($validator->fails()) {
            return response()->json([
                'status' => 'Error',
                'message' => $validator->errors()->first()
            ]);
        }

        $validTypes = ['Patient Assessment', 'Vital Signs', 'Cardio', 'Respiration', 'Neuro', 'Blsd', 'Trauma', 'Bleeding'];
        if (!in_array($request->type, $validTypes)) {
            return response()->json([
                'status' => 'Error',
                'message' => 'No such FAQ section exists'
            ]);
        }

        $faq = Medical_faq::create([
            'type' => $request->input('type'),
            'question' => $request->input('question'),
            'answer' => $request->input('answer'),
        ]);

        return response()->json([
            'status' => 'Success',
            'message' => 'FAQ added successfully'
        ]);
    }

    function deleteFaq($id){
    

        $faq = Medical_faq::where('id', $id)->first();

        if (!$faq) {
            return response()->json([
                'status' => 'Error',
                'message' => 'FAQ not found'
            ]);
        }

        /*if (!$admin) {
            return response()->json([
                'status' => 'Error',
                'message' => 'Admin not found'
            ]);
        }

        if (!in_array($admin->user_rank, [3, 4, 5, 7])) {
            return response()->json([
                'status' => 'Error',
                'message' => 'User is not an admin'
            ]);
        }*/

        $faq->delete();
        return response()->json([
            'status' => 'Success',
            'message' => 'FAQ deleted successfully'
        ]);
    }

    // MANAGE EXTENSIONS TAB
    function addExtension(Request $request){
        $admin = User::where('id', $request->input('admin_id'))->first();

       /* if (!$admin) {
            return response()->json([
                'status' => 'Error',
                'message' => 'Admin not found'
            ]);
        }

        if (!in_array($admin->user_rank, [3, 4, 5, 7])) {
            return response()->json([
                'status' => 'Error',
                'message' => 'User is not an admin'
            ]);
        }*/

        $validator = Validator::make($request->all(), [
            'name' => 'required|string',
            'number' => 'required|integer',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'status' => 'Error',
                'message' => $validator->errors()->first()
            ]);
        }

        $extension = Extension::create([
            'name' => $request->input('name'),
            'number' => $request->input('number'),
        ]);

        return response()->json([
            'status' => 'Success',
            'message' => 'Extension added successfully'
        ]);
    }

    function deleteExtension($id){

        $extension = Extension::where('id', $id)->first();

        if (!$extension) {
            return response()->json([
                'status' => 'Error',
                'message' => 'Extension not found'
            ]);
        }


        $extension->delete();
        return response()->json([
            'status' => 'Success',
            'message' => 'Extension deleted successfully'
        ]);
    }

    // EMERGENY RECORDS TAB
    public function getEmergencyRecords(){
        $emergencies = Emergency::where('case_report', 1)->get();
        return response()->json(['emergency records' => $emergencies], 200);
    }

    function getAttendanceRecords()
    {
        $shifts = Shift::all();
    
        if ($shifts->isEmpty()) {
            return response()->json([
                'message' => 'No shifts in the database yet'
            ]);
        } else {
            $shiftData = [];
    
            foreach ($shifts as $shift) {
                $shiftId = $shift->id;
    
                $userShifts = DB::table('user_has_shifts')
                    ->where('shift_id', $shiftId)
                    ->select('user_id',  'attended')
                    ->get();
    
                $coverRequests = DB::table('cover_requests')
                    ->where('shift_id', $shiftId)
                    ->select('user_id', 'shift_id', 'covered_by')
                    ->get();
    
                foreach ($userShifts as $userShift) {
                    $userShift->attended = $userShift->attended;
                    $userShift->user_name = DB::table('users')
                        ->where('id', $userShift->user_id)
                        ->value(DB::raw('CONCAT(first_name, " ", last_name)'));
                }
    
                foreach ($coverRequests as $coverRequest) {
                    $coverRequest->covered_by_user_name = DB::table('users')
                        ->where('id', $coverRequest->covered_by)
                        ->value(DB::raw('CONCAT(first_name, " ", last_name)'));
                }
    
                $shiftData[$shiftId] = [
                    'time_start' => $shift->time_start,
                    'time_end' => $shift->time_end,
                    'date' => $shift->date,
                    'user_shifts' => $userShifts,
                    'cover_requests' => $coverRequests
                ];
            }
    
            return response()->json($shiftData);
        }
    }
    // LOGIN REQUESTS TAB
    function getLoginRequests(){
        $requests = Login_request::all();
        if ($requests->isEmpty()) {
            return response()->json([
                'message' => 'No login entries in the db yet'
            ]);
        } else {
            return response()->json($requests);
        }
    }

    function acceptRequest(Request $request){

        $request->validate([
            'request_id' => 'required|integer',
            'admin_id' => 'required|integer'
        ]);

        $loginRequest = Login_Request::where('id', $request->input('request_id'))->first();
        $admin = User::where('id', $request->input('admin_id'))->first();

        if (!$admin) {
            return response()->json([
                'status' => 'Error',
                'message' => 'Admin not found'
            ]);
        }

        if (!in_array($admin->user_rank, [3, 4, 5, 7])) {
            return response()->json([
                'status' => 'Error',
                'message' => 'User is not an admin'
            ]);
        }

        if (!$loginRequest) {
            return response()->json([
                'status' => 'Error',
                'message' => 'Login Request not found'
            ]);
        }

        if ($loginRequest->status == 1) {
            return response()->json([
                'status' => 'Error',
                'message' => 'Request has already been accepted'
            ]);
        }

        $loginRequest->status = 1;
        $loginRequest->save();
        return response()->json([
            'status' => 'Success',
            'message' => 'Request accepted successfully'
        ]);
    }

    function getMembers(){
        $members = User::where('user_type', 1)->get();
        if ($members->isEmpty()) {
            return response()->json([
                'message' => 'No ERU members in the db yet'
            ]);
        } else {
            return response()->json($members);
        }
    }

    function rejectRequest(Request $request){
        $request->validate([
            'request_id' => 'required|integer',
            'admin_id' => 'required|integer'
        ]);

        $loginRequest = Login_request::where('id', $request->input('request_id'))->first();
        $admin = User::where('id', $request->input('admin_id'))->first();

        if (!$admin) {
            return response()->json([
                'status' => 'Error',
                'message' => 'Admin not found'
            ]);
        }

        if (!in_array($admin->user_rank, [3, 4, 5, 7])) {
            return response()->json([
                'status' => 'Error',
                'message' => 'User is not an admin'
            ]);
        }

        if (!$loginRequest) {
            return response()->json([
                'status' => 'Error',
                'message' => 'Request not found'
            ]);
        }

        $loginRequest->status = 2;
        $loginRequest->save();
        return response()->json([
            'status' => 'Success',
            'message' => 'Request rejected successfully'
        ]);
    }
}
