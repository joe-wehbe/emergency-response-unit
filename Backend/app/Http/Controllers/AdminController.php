<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Announcement;
use App\Models\User;

class AdminController extends Controller
{
    function deleteAnnouncement(Request $request) {

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
        if ($admin->user_type != 3) {
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

    function deleteUser(Request $request) {

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
        if ($admin->user_type != 3) {
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
}
