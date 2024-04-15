<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\DB;

use App\Models\Announcement;
use App\Models\User;
use App\Models\Medical_faq;
use App\Models\Extension;
use App\Models\Login_request;
use App\Models\Shift;
use App\Models\User_has_shift;
use App\Models\Rank;
use App\Models\Semester;
use App\Models\Cover_request;

use Exception;

class AdminController extends Controller{

    // ADMIN PANEL
    public function updateSemesterDates(Request $request){
        $request->validate([
            'id' => 'required',
            'start_date' => 'required',
            'end_date' => 'required'
        ]);
        try {
            $semester = Semester::find($request->id);

            if ($semester) {
                $semester->start_date = $request->start_date;
                $semester->end_date = $request->end_date;
                $semester->save();
                return response()->json(['message' => 'Semester dates updated successfully'], 201);
            } 
            else {
                $semester = new Semester();
                $semester->start_date = $request->start_date;
                $semester->end_date = $request->end_date;
                $semester->save();
                return response()->json(['message' => 'Semster not found, created a new one'], 201);
            }
        } catch (Exception $exception) {
            return response()->json(['error' => $exception->getMessage()], 500);
        }
    }

    // MANAGE MEMBERS TAB
    public function removeMember(Request $request){
        $request->validate([
            'id' => 'required',
        ]);

        try {
            $user = User::find($request->id);

            if ($user) {
                $loginRequest = Login_request::where("email", $user->lau_email)->first();

                if($loginRequest){
                    $loginRequest->delete();
                }
                $user->user_type = 2;
                $user->user_rank = null;
                $user->save();

                return response()->json(['message' => 'User removed successfully'], 200);
            } else {
                return response()->json(['error' => 'User not found'], 404);
            }
        } catch (Exception $exception) {
            return response()->json(['error' => $exception->getMessage()], 500);
        }
    }

    public function changeRank(Request $request){
        $request->validate([
            'user_id' => 'required',
            'rank_id' => 'required',
        ]);

        try {
            $user = User::find($request->user_id);

            if ($user) {
                $rank = Rank::find($request->rank_id);

                if ($rank) {
                    $user->user_rank = $request->rank_id;
                    $user->save();
                    return response()->json(['message' => 'Rank updated successfully'], 200);
                } else {
                    return response()->json(['error' => 'Rank not found'], 404);
                }
            } else {
                return response()->json(['error' => 'User not found'], 404);
            }
        } catch (Exception $exception) {
            return response()->json(['error' => $exception->getMessage()], 500);
        }
    }

    public function getShiftCoversCount($userId, $shiftId){
        try {
            $coverRequestsCount = Cover_request::where('user_id', $userId)->where('shift_id', $shiftId)->count();
            return response()->json(['coverRequestsCount' => $coverRequestsCount], 200);
        }  catch (Exception $exception) {
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
        } catch (Exception $exception) {
            return response()->json(['error' => $exception->getMessage()], 500);
        }
    }

    public function deleteShift($user_id, $shift_id){
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
        } catch (Exception $exception) {
            return response()->json(['error' => $exception->getMessage()], 500);
        }
    }

    // MANAGE ANNOUNCEMENTS TAB
    public function addAnnouncement(Request $request){
        $validator = Validator::make($request->all(), [
            'admin_id' => 'required',
            'importance' => 'required|string',
            'description' => 'required|string',
            'visible_to' => 'required'
        ]);

        if ($validator->fails()) {
            return response()->json(['status' => 'Error', 'error' => $validator->errors()->first()]);
        }

        try {
            $announcement = new Announcement();
            $announcement->fill($request->all());
            $announcement->save();
            return response()->json(['message' => 'Announcement added successfully']);

        } catch (Exception $exception) {
            return response()->json(['error' => $exception->getMessage()], 500);
        }
    }

    public function deleteAnnouncement($id){
        try{
            $announcement = Announcement::where('id', $id)->first();

            if ($announcement) {
                $announcement->delete();
                return response()->json(['message' => 'Announcement deleted successfully'], 200);
            }
            else{
                return response()->json(['error' => 'Announcement not found'], 404);
            }
        } catch (Exception $exception) {
            return response()->json(['error' => $exception->getMessage()], 500);
        }
    }

    // MANAGE FAQs TAB
    public function addFaq(Request $request){
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

        Medical_faq::create([
            'type' => $request->input('type'),
            'question' => $request->input('question'),
            'answer' => $request->input('answer'),
        ]);

        return response()->json([
            'status' => 'Success',
            'message' => 'FAQ added successfully'
        ]);
    }

    public function deleteFaq($id){
        $faq = Medical_faq::where('id', $id)->first();

        if (!$faq) {
            return response()->json([
                'status' => 'Error',
                'message' => 'FAQ not found'
            ]);
        }
        $faq->delete();

        return response()->json([
            'status' => 'Success',
            'message' => 'FAQ deleted successfully'
        ]);
    }

    // MANAGE EXTENSIONS TAB
    public function addExtension(Request $request){
        User::where('id', $request->input('admin_id'))->first();

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

        Extension::create([
            'name' => $request->input('name'),
            'number' => $request->input('number'),
        ]);

        return response()->json([
            'status' => 'Success',
            'message' => 'Extension added successfully'
        ]);
    }

    public function deleteExtension($id){
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

    // ATTENDANCE RECORDS TAB
    public function getAttendanceRecords(){
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
                ->select('user_id', 'attended')
                ->get();

                $coverRequests = DB::table('cover_requests')
                ->where('shift_id', $shiftId)
                ->select('user_id', 'shift_id', 'covered_by')
                ->get();

                foreach ($userShifts as $userShift) {
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
                    'day' => $shift->day,
                    'user_shifts' => $userShifts,
                    'cover_requests' => $coverRequests
                ];
            }
            return response()->json(['shifts' => $shiftData], 200);
        }
    }
    
    // SIGNUP REQUESTS TAB
    public function getSignupRequests(){
        $requests = Login_request::with('user')->where('status', 0)->get();
        if ($requests->isEmpty()) {
            return response()->json(['message' => 'No signup requests']);
        } else {
            return response()->json(['requests' => $requests], 200);
        }
    }

    public function acceptSignupRequest(Request $request){
        $request->validate([
            'request_id' => 'required|integer',
        ]);

        try{
            $loginRequest = Login_request::where('id', $request->request_id)->first();

            if($loginRequest){
                $user = User::where('lau_email', $loginRequest->email)->first();

                if($user){
                    $loginRequest->status = 1;
                    $user->user_type = 1;
                    $user->user_rank = 1;
                    $loginRequest->save();
                    $user->save();
                }
                else{
                    return response()->json(['error' => 'User not found'], 404);
                }
            }
            else{
                return response()->json(['error' => 'Signup request not found'], 404);
            }
        } catch (Exception $exception) {
            return response()->json(['error' => $exception->getMessage()], 500);
        }
    }

    public function rejectSignupRequest(Request $request){
        $request->validate([
            'request_id' => 'required|integer',
        ]);

        try{
            $loginRequest = Login_request::where('id', $request->request_id)->first();

            if($loginRequest){
                $user = User::where('lau_email', $loginRequest->email)->first();

                if($user){
                    $loginRequest->status = 2;
                    $loginRequest->save();
                    $user->save();
                }
                else{
                    return response()->json(['error' => 'User not found'], 404);
                }
            }
            else{
                return response()->json(['error' => 'Signup request not found'], 404);
            }
        } catch (Exception $exception) {
            return response()->json(['error' => $exception->getMessage()], 500);
        }
    }
}
