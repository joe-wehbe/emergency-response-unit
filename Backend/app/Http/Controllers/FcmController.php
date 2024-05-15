<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

use App\Models\User;

use Exception;

class FcmController extends Controller {

    public function saveFcmToken(Request $request){
        $request-> validate([
            'id' => 'required',
            'fcm_token' => 'required'
        ]);
        try {
            $user = User::where('id', $request->id)->first();

            if($user){
                $user->fcm_token = $request->fcm_token;
                $user->save();
                return response()->json(['message' => 'FCM token saved successfully'], 200);
            }
            else{
                return response()->json(['error' => 'User not found'], 404);
            }
        } catch (Exception $exception) {
            return response()->json(['error' => $exception->getMessage()], 500);
        }
    }

    public function getDispatchersFcmTokens($id){
        try {
            $dispatchersTokens = User::whereIn('user_rank', [1, 5, 6])
                                ->whereNotIn("id", [$id])
                                ->pluck('fcm_token')
                                ->toArray();   
            if(empty($dispatchersTokens)){
                return response()->json(['message' => 'No dispatchers tokens found'], 200);
            }
            else{
                return response()->json(['dispatchersTokens' => $dispatchersTokens], 200);
            }
        } catch (Exception $exception) {
            return response()->json(['error' => $exception->getMessage()], 500);
        }
    }

    public function getMedicsFcmTokens($id){
        try {
            $medicsTokens = User::whereIn('user_rank', [2, 4, 6])
                                ->whereNotIn("id", [$id])
                                ->pluck('fcm_token')
                                ->toArray();   
            if(empty($medicsTokens)){
                return response()->json(['message' => 'No medics tokens found'], 200);
            }
            else{
                return response()->json(['medicsTokens' => $medicsTokens], 200);
            }
        } catch (Exception $exception) {
            return response()->json(['error' => $exception->getMessage()], 500);
        }
    }

    public function getAdminsFcmTokens($id){
        try {
            $adminsTokens = User::whereIn('user_rank', [3, 4, 5])
                                ->whereNotIn("id", [$id])
                                ->pluck('fcm_token')
                                ->toArray();   
            if(empty($adminsTokens)){
                return response()->json(['message' => 'No admins tokens found'], 200);
            }
            else{
                return response()->json(['adminsTokens' => $adminsTokens], 200);
            }
        } catch (Exception $exception) {
            return response()->json(['error' => $exception->getMessage()], 500);
        }
    }

    public function getOnShiftFcmTokens($id){
        try{
            $usersOnShift = User::whereHas('hasShift', function ($query) {
                $query->where('shift_status', 1);
            })->whereNotIn("id", [$id])->with('hasShift')->get()->pluck('fcm_token');            

            if(empty($usersOnShift)){
                return response()->json(['message' => 'No on shift tokens found'], 200);
            }
            else{
                return response()->json(['onShiftTokens' => $usersOnShift], 200);
            }
        } catch (Exception $exception) {
            return response()->json(['error' => $exception->getMessage()], 500);
        }
    }

    public function getAllFcmTokens($id){
        try {
            $tokens = User::whereNotIn("id", [$id])->pluck('fcm_token')->toArray();   
            if(empty($tokens)){
                return response()->json(['message' => 'No tokens found'], 200);
            }
            else{
                return response()->json(['tokens' => $tokens], 200);
            }
        } catch (Exception $exception) {
            return response()->json(['error' => $exception->getMessage()], 500);
        }
    }
}
