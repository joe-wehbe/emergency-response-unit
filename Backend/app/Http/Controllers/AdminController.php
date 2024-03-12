<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
use App\Models\Announcement;
use App\Models\User;
use App\Models\Medical_faq;
use App\Models\Extension;
use App\Models\Login_request;
use App\Models\Shift;
use App\Models\User_has_shift;
use App\Models\Cover_request;
use Illuminate\Support\Facades\Log;


use Illuminate\Database\Eloquent\ModelNotFoundException;
use Exception;


class AdminController extends Controller
{
    function deleteAnnouncement(Request $request)
    {

        //validate the params 
        $request->validate([
            'announcement_id' => 'required|integer',
            'admin_id' => 'required|integer'
        ]);

        $announcement = Announcement::where('id', $request->input('announcement_id'))->first();

        $admin = User::where('id', $request->input('admin_id'))->first();

        //check if announcement exists
        if (!$announcement) {
            return response()->json([
                'status' => 'Error',
                'message' => 'Announcement not found'
            ]);
        }

        //check if admin exists 
        if (!$admin) {
            return response()->json([
                'status' => 'Error',
                'message' => 'Admin not found'
            ]);
        }

        //check if user who initiated request is an admin 
        if (!in_array($admin->user_rank, [3, 4, 5, 7])) {
            return response()->json([
                'status' => 'Error',
                'message' => 'User is not an admin'
            ]);
        }

        //check if the user who initiated the request is the one who posted the announcement
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

    function deleteUser(Request $request)
    {

        try {
            $user = User::where('id', $request->input('user_id'))->first();
            $admin = User::where('id', $request->input('admin_id'))->first();

            //check if admin exists 
            if (!$admin) {
                return response()->json([
                    'status' => 'Error',
                    'message' => 'Admin not found'
                ]);
            }

            //check if user who initiated request is an admin 
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
        } catch (\Exception $e) {
            return response()->json([
                'status' => 'Error',
                'message' => 'An error occurred while deleting the user',
                'error' => $e->getMessage()
            ]);
        }
    }

    function addFaq(Request $request)
    {
        $admin = User::where('id', $request->input('admin_id'))->first();

        //checking admin authorities 
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

        // Check if the FAQ type is valid 
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

    function deleteFaq(Request $request)
    {
        $request->validate([
            'admin_id' => 'required|integer',
            'faq_id' => 'required|integer'
        ]);

        $faq = Medical_faq::where('id', $request->input('faq_id'))->first();

        $admin = User::where('id', $request->input('admin_id'))->first();


        if (!$faq) {
            return response()->json([
                'status' => 'Error',
                'message' => 'FAQ not found'
            ]);
        }

        //checking admin authorities 
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


        $faq->delete();
        return response()->json([
            'status' => 'Success',
            'message' => 'FAQ deleted successfully'
        ]);
    }

    function addExtension(Request $request)
    {
        $admin = User::where('id', $request->input('admin_id'))->first();

        //checking admin authorities 
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

    function deleteExtension(Request $request)
    {
        $request->validate([
            'admin_id' => 'required|integer',
            'extension_id' => 'required|integer'
        ]);

        $extension = Extension::where('id', $request->input('extension_id'))->first();

        $admin = User::where('id', $request->input('admin_id'))->first();


        if (!$extension) {
            return response()->json([
                'status' => 'Error',
                'message' => 'Extension not found'
            ]);
        }

        //checking admin authorities 
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


        $extension->delete();
        return response()->json([
            'status' => 'Success',
            'message' => 'Extension deleted successfully'
        ]);
    }

    function getLoginRequests()
    {
        $requests = Login_request::all();
        if ($requests->isEmpty()) {
            return response()->json([
                'message' => 'No login entries in the db yet'
            ]);
        } else {
            return response()->json($requests);
        }
    }

    function acceptRequest(Request $request)
    {

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

    function rejectRequest(Request $request)
    {
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

        $loginRequest->delete();

        return response()->json([
            'status' => 'Success',
            'message' => 'Request rejected successfully'
        ]);
    }

    function getAttendanceRecords()
    {
        $records = Shift::all();
        if ($records->isEmpty()) {
            return response()->json([
                'message' => 'No shifts in the db yet'
            ]);
        } else {
            $shiftData = [];

            foreach ($records as $shift) {
                $shiftId = $shift->id;

                $userShifts = User_has_shift::where('shift_id', $shiftId)->select('user_id', 'shift_status', 'checkin_time', 'missed_attendance')->get();
                $coverRequests = Cover_request::where('shift_id', $shiftId)->select('request_status', 'covered_by', 'reason')->get();

                foreach ($userShifts as $key => $userShift) {
                    $user = User::where('id', $userShift->user_id)->first(['first_name', 'last_name']);
                    $userShift->user = $user;
                }


                foreach ($coverRequests as $key => $cover) {
                    $covered_by_user = User::where('id', $cover->covered_by)->first(['first_name', 'last_name']);
                    $cover->covered_by_user = $covered_by_user;
                }

                $shiftData[$shiftId] = [
                    'shift' => $shift,
                    'user_shifts' => $userShifts,
                    'cover_requests' => $coverRequests
                ];
            }

            return response()->json($shiftData);
        }
    }

    public function changeRank($userId, $rankId)
    {
        try {
            $user = User::findOrFail($userId);

            $user->user_rank = $rankId;
            $user->save();

            return response()->json(['message' => 'Rank updated successfully'], 200);
        } catch (ModelNotFoundException $exception) {
            return response()->json(['error' => 'User not found'], 404);
        }
    }

    public function removeMember($userId)
    {

        try {
            $user = User::findOrFail($userId);

            $user->user_type = 1;
            $user->save();

            return response()->json(['message' => 'User removed successfully'], 200);
        } catch (ModelNotFoundException $exception) {
            return response()->json(['error' => 'User not found'], 404);
        }
    }

    public function getUserShifts($userId)
    {

        try {
            User::findOrFail($userId);
            $shifts = User_has_shift::where('user_id', $userId)->get();
            return response()->json(['Shifts' => $shifts], 200);
        } catch (ModelNotFoundException $exception) {
            return response()->json(['error' => 'User not found'], 404);
        }
    }

    public function addMember(Request $request)
    {

        $request->validate([
            'id' => 'required'
        ]);

        try {
            $user = User::find($request->id);

            if ($user) {
                $user->user_type = 2;
                $user->save();
                return response()->json(['message' => 'Member added successfully']);
            } else {
                return response()->json(['message' => 'User not found']);
            }
        } catch (Exception $exception) {
            return response()->json(['error' => 'Failed to add member'], 500);
        }
    }

    public function addAnnouncement(Request $request)
    {
        // Validate input data
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
        } catch (\Exception $e) {
            return response()->json(['error' => 'Failed to add announcement']);
        }
    }

    public function deleteShift(Request $request)
    {
        $request->validate([
            'shift_id' => 'required|integer',
            'user_id' => 'required|integer'
        ]);


        try {

            $user = User::find($request->user_id);
            if ($user) {
                $shift = User_has_shift::find($request->shift_id);
                if ($shift) {
                    $shift->delete();
                    return response()->json(['message' => 'Shift deleted successfully']);
                } else {
                    return response()->json(['error' => 'Shift not found']);
                }
            } else {
                return response()->json(['error' => 'User not found']);
            }
        } catch (\Exception $e) {
            return response()->json(['error' => 'Failed to delete shift']);
        }
    }

    public function addShift(Request $request)
    {
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
            return response()->json(['error' => 'An error occurred'], 500);
        }
    }
}
