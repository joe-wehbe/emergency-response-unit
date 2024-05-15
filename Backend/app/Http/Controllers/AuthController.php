<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Str;

use App\Models\User;
use App\Models\Login_request;
use App\Models\Login_attempt;

use Carbon\Carbon;
use Exception;

class AuthController extends Controller{
    
    // REGISTER PAGE
    public function register(Request $request){
        if($request->isERU == "yes"){
            $validator = Validator::make($request->all(), [
                'first_name' => 'required',
                'last_name' => 'required',
                'student_id' => 'required',
                'phone_number' => 'required',
                'major' => 'required',
                'lau_email' => 'required',
                'password' => 'required'
            ]);   
            if (!$validator->fails()){
                $user = User::with('rank')->where("lau_email", $request->lau_email)->first();

                if (!$user) {
                    $password_errors = $this->validatePassword($request->input('password'));

                    if(empty($password_errors)){

                        if($request->confirmation == $request->password){
                            $newUser = User::create([
                                'first_name' => $request->input('first_name'),
                                'last_name' => $request->input('last_name'),
                                'student_id' => $request->input('student_id'),
                                'phone_number' => $request->input('phone_number'),
                                'major' => $request->input('major'),
                                'lau_email' => $request->input('lau_email'),
                                'password' => Hash::make($request->input('password')),
                            ]);
                            $login_request = new Login_request();
                            $login_request->email = $newUser->lau_email;
                            $login_request->save();
    
                            $token = $newUser->createToken('auth_token')->plainTextToken;
                            return response()->json(['status' => 'Success', 'token' => $token, 'id' => $newUser->id]);
                        }
                        else{
                            return response()->json(['status' => 'Password not confirmed',]);
                        }
                    }else{
                        $errors = $password_errors;
                        return response()->json(['status' => 'Invalid password', 'errors' => $errors,]);
                    }
                }else{
                    return response()->json(['status' => 'Account exists',]);
                }
            }else{
                return response()->json(['status' => 'Missing fields', 'errors' => $validator->errors()], 400);
            }
        }
        else if($request->isERU == "no"){
            $validator = Validator::make($request->all(), [
                'first_name' => 'required',
                'last_name' => 'required',
                'lau_email' => 'required',
                'password' => 'required'
            ]);   
            if (!$validator->fails()) {
                $user = User::with('rank')->where("lau_email", $request->lau_email)->first();

                if (!$user) {
                    $password_errors = $this->validatePassword($request->input('password'));

                    if(empty($password_errors)){

                        if($request->confirmation == $request->password){
                            $newUser = User::create([
                            'first_name' => $request->input('first_name'),
                            'last_name' => $request->input('last_name'),
                            'lau_email' => $request->input('lau_email'),
                            'password' => Hash::make($request->input('password')),
                            ]);
                            $token = $newUser->createToken('auth_token')->plainTextToken;
                            return response()->json(['status' => 'Success', 'token' => $token, 'id' => $newUser->id]);
                        }
                        else{
                            return response()->json(['status' => 'Password not confirmed',]);
                        }
                    }else{
                        $errors = $password_errors;
                        return response()->json(['status' => 'Invalid password', 'errors' => $errors,]);
                    }
                }else{
                    return response()->json(['status' => 'Account exists',]);
                }
            }else{
                return response()->json(['status' => 'Missing fields'], 200);
            }
        }
    }

    private function validatePassword($password){
        $errors = array();

        if (strlen($password) < 8) {
            $errors[] = 'Password must be at least 8 characters long.';
        }

        if (!preg_match('/[a-z]/', $password)) {
            $errors[] = 'Password must contain at least one lowercase letter.';
        }

        if (!preg_match('/[A-Z]/', $password)) {
            $errors[] = 'Password must contain at least one uppercase letter.';
        }

        if (!preg_match('/\d/', $password)) {
            $errors[] = 'Password must contain at least one digit.';
        }
        return $errors;
    }

    // LOGIN PAGE
    public function login(Request $request) {
        $user = User::with('rank')->where("lau_email", $request->lau_email)->first();
    
        if (!$user || !Hash::check($request->password, $user->password)) {
            $this->addFailedLoginAttempt($request->lau_email);
        
            if ($this->hasExceededLoginAttempts($request->lau_email)) {
                $last_attempt = Login_attempt::where('email', $request->lau_email)->orderBy('created_at', 'desc')->first();
                $last_attempt_time = Carbon::parse($last_attempt->created_at);
                $diff_in_hours = $last_attempt_time->diffInHours(Carbon::now());
        
                if ($diff_in_hours < 24) {
                    return response()->json(["status" => "Login attempts exceeded"]);
                } 
                else {
                    $this->resetLoginAttempts($request->lau_email);
                }
            }
            return response()->json(["status" => "Invalid credentials"]);
        }
        else{
            $this->resetLoginAttempts($request->lau_email);
            $token = $user->createToken('authToken')->plainTextToken;

            if ($request->remember_me) {
                $user->remember_token = Str::random(60);
                $user->save();
            }
        
            $response = [
                "user_id" => $user->id,
                "first_name" => $user->first_name,
                "last_name" => $user->last_name,
                "student_id" =>$user->student_id,
                "lau_email" => $user->lau_email,
                "rank" => $user->rank,
                "profile_picture" => $user->profile_picture,
                "user_type" => $user->user_type,
                "token" => $token,
                "remember_token" => $user->remember_token
            ];
        
            $response["status"] = 'Login successful';
            return response()->json($response);
        }
    }
    
    private function hasExceededLoginAttempts($lau_email){
        $total_attempts = Login_attempt::where('email', $lau_email)->count();
        return $total_attempts >= 5;
    }

    private function resetLoginAttempts($lau_email){
        Login_attempt::where('email', $lau_email)->delete();
    }

    private function addFailedLoginAttempt($lau_email){
        Login_attempt::create([
            'attempt_time' => Carbon::now()->format('H:i:s'),
            'attempt_date' => Carbon::now()->format('Y-m-d'),
            'email' => $lau_email,
        ]);
    }

    public function autoLogin(Request $request) {
        try{
            $rememberToken = $request->input('rememberToken');
            $user = User::where('remember_token', $rememberToken)->first();
    
            if ($user) {
                return response()->json(['status' => 'Login successful']);
            }
            else{
                return response()->json(['error' => 'User not found'], 404);
            }  
        } catch (Exception $exception) {
            return response()->json(['error' => $exception->getMessage()], 500);
        }
    }

    // LOGOUT
    public function logout(Request $request){
        try{
            $user = User::where("lau_email", $request->lau_email)->first();

            if($user){
                $user->tokens()->delete();
                $user->remember_token = null;
                $user->save();
                return response()->json(["status" => "Logged out",]);
            }
            else{
                return response()->json(['error' => 'User not found'], 404);
            }
        } catch (Exception $exception) {
            return response()->json(['error' => $exception->getMessage()], 500);
        }
    } 
}
