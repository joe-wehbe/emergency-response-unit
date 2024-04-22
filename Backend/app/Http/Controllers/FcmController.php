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

    public function getMedicsFcmTokens(){
        try {
            $medicsTokens = User::whereIn('user_rank', [2, 4, 6])->pluck('fcm_token')->toArray();            
            if(empty($medicsTokens)){
                return response()->json(['message' => 'No medics token found'], 200);
            }
            else{
                return response()->json(['medicsToken' => $medicsTokens], 200);
            }
    
        } catch (Exception $exception) {
            return response()->json(['error' => $exception->getMessage()], 500);
        }
    }
}
