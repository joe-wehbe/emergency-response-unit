<?php

namespace App\Http\Controllers;

use App\Models\Cover_request;
use App\Models\User;
use Carbon\Carbon;
use App\Models\User_has_shift;
use App\Models\Announcement;
use Illuminate\Http\Request;
use Illuminate\Database\Eloquent\ModelNotFoundException;
use Illuminate\Support\Facades\Validator;

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

    public function editTags(Request $request, $id)
    {
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

    public function requestCover(Request $request, $userId, $shiftId)
    {
        $request->validate([
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

    public function markAttendance($userId)
    {
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

    public function getAllUsers()
    {
        try {
            $users = User::all();
            return response()->json(['users' => $users], 200);
        } catch (\Exception $e) {
            return response()->json(['error' => 'Failed to fetch users'], 500);
        }
    }

    public function getAllAnnouncements()
    {
        try {
            $announcements = Announcement::all();
            return response()->json(['announcements' => $announcements], 200);
        } catch (\Exception $e) {
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

}
