<?php

namespace App\Http\Controllers;

use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\Hash;
use Illuminate\Http\Request;
use Illuminate\Database\Eloquent\ModelNotFoundException;

use App\Models\Cover_request;
use App\Models\User;
use App\Models\Login_request;
use App\Models\Shift;
use App\Models\User_has_shift;
use App\Models\Announcement;
use App\Models\Extension;
use App\Models\Medical_faq;
use App\Models\Emergency;
use App\Models\Login_attempt;
use App\Models\Semester;

use Carbon\Carbon;
use Exception;

class UserController extends Controller{

    // REGISTER PAGE
    function register(Request $request){
        $validator = Validator::make($request->all(), [
            'lau_email' => 'required',
            'first_name' => 'required',
            'last_name' => 'required',
            'password' => 'required',
            'user_type' => 'required',
        ]);

        if ($validator->fails()) {
            $errors = $validator->errors();
            return response()->json([
                'status' => 'Invalid input',
                'errors' => $errors,
            ]);
        }

        $password_errors = $this->validatePassword($request->input('password'));

        if (!empty ($password_errors)) {
            $status = 'Invalid password';
            $errors = $password_errors;
            return response()->json([
                'status' => $status,
                'errors' => $errors,
            ]);
        }

        $check_user = User::where('lau_email', '=', $request->input('lau_email'))->first();

        if ($check_user) {
            return response()->json([
                'status' => 'Email already has an account',
            ]);
        } else {
            if ($request->input('user_type') == '2') {
                $newUser = User::create([
                    'lau_email' => $request->input('lau_email'),
                    'first_name' => $request->input('first_name'),
                    'last_name' => $request->input('last_name'),
                    'password' => Hash::make($request->input('password')),
                    'user_type' => $request->input('user_type'),
                ]);
                $token = $newUser->createToken('auth_token')->plainTextToken;

                return response()->json([
                    'status' => 'Member registered successfully',
                    'token' => $token,
                ]);

            } else if ($request->input('user_type') == '1') {
                $check_user = Login_request::where("email", $request->lau_email)->first();

                if ($check_user) {
                    if ($check_user->status == '1') {
                        $newMember = User::create([
                            'lau_email' => $request->input('lau_email'),
                            'first_name' => $request->input('first_name'),
                            'last_name' => $request->input('last_name'),
                            'password' => Hash::make($request->input('password')),
                            'user_type' => $request->input('user_type'),
                            'student_id' => $request->input('student_id'),
                            'major' => $request->input('major'),
                            'phone_number' => $request->input('phone_number'),
                        ]);

                        $token = $newMember->createToken('auth_token')->plainTextToken;
                        return response()->json([
                            'status' => 'Member registered successfully',
                            'token' => $token,
                        ]);

                    } else if ($check_user->status == '0') {
                        return response()->json([
                            'status' => 'Request still pending',
                        ]);
                    } else if ($check_user->status == '2') {
                        return response()->json([
                            'status' => 'Request rejected',
                        ]);
                    }
                } else {
                    $request_login = Login_Request::create([
                        'email' => $request->input('lau_email'),
                        'status' => 0,
                    ]);
                    return response()->json([
                        'status' => 'Login request sent to admin',
                    ]);
                }
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
    function login(Request $request){
        $check_user = User::where("lau_email", $request->lau_email)->first();

        if (!$check_user) {
            return response()->json([
                "status" => "Invalid credentials",
            ]);
        }

        if ($this->hasExceededLoginAttempts($request->lau_email)) {
            $last_attempt = Login_attempt::where('email', '=', $request->lau_email)->orderBy('created_at', 'desc')->first();
            $now = Carbon::now();
            $last_attempt_time = Carbon::parse($last_attempt->created_at);
            $diff_in_hours = $last_attempt_time->diffInHours($now);

            if ($diff_in_hours >= 24) {
                $this->resetLoginAttempts($request->lau_email);
            } else {
                return response()->json([
                    "status" => "Too many failed login attempts",
                ]);
            }
        }

        if (Hash::check($request->password, $check_user->password)) {
            $this->resetLoginAttempts($request->lau_email);
            $token = $check_user->createToken('authToken')->plainTextToken;
            $user_id = $check_user->id;
            return response()->json([
                "status" => 'Login successful',
                "token" => $token,
                "user_id" => $user_id,
                "user_type" => $check_user->user_type,
            ]);
        } else {
            $this->addFailedLoginAttempt($request->lau_email);
            return response()->json([
                "status" => "Invalid credentials",
            ]);
        }
    }

    private function hasExceededLoginAttempts($lau_email){
        $total_attempts = Login_attempt::where('email', '=', $lau_email)->count();
        return ($total_attempts >= 5);
    }

    private function resetLoginAttempts($lau_email){
        Login_attempt::where('email', '=', $lau_email)->delete();
    }

    private function addFailedLoginAttempt($lau_email){
        Login_attempt::create([
            'attempt_time' => Carbon::now()->format('H:i:s'),
            'attempt_date' => Carbon::now()->format('Y-m-d'),
            'email' => $lau_email,
        ]);
    }

    // LOGOUT
    function logout(Request $request){
        auth()->user()->tokens()->delete();
        return response()->json([
            "status" => "Logged out",
        ]);
    }

    // REPORT PAGE
    public function apply(Request $request){
        $request->validate([
            'user_id' => 'required',
            'student_id' => 'required',
            'phone_number' => 'required',
            'major' => 'required',
        ]);

        try {
            $user = User::find($request->user_id);

            if ($user) {
                $user->student_id = $request->student_id;
                $user->phone_number = $request->phone_number;
                $user->major = $request->major;
                $user->save();

                $login_request = new Login_request();
                $login_request->email = $user->lau_email;
                $login_request->save();

                return response()->json(['message' => 'User applied successfully'], 201);

            } else {
                return response()->json(['error' => 'User not found'], 404);
            }
        }  catch (Exception $exception) {
            return response()->json(['error' => $exception->getMessage()], 500);
        }
    }

    // PROFILE PAGE
    public function getUserInfo($id){
        try {
            $user = User::with('rank')->findOrFail($id);
            return response()->json(['User' => $user], 200);
        }  catch (Exception $exception) {
            return response()->json(['error' => $exception->getMessage()], 500);
        }
    }

    public function getUserShifts($userId){
        try {
            $user = User::find($userId);
    
            if($user){
                $shifts = User_has_shift::with("shift")->where('user_id', $userId)->get();            
                return response()->json(['Shifts' => $shifts], 200);
            }
            else{
                return response()->json(['error' => 'User not found'], 404);
            }
    
        } catch (Exception $exception) {
            return response()->json(['error' => $exception->getMessage()], 500);
        }
    }

    public function editBio(Request $request){
        $request->validate([
            'id' => 'required',
        ]);

        try {
            $user = User::find($request->id);

            if ($user) {
                $user->bio = $request->bio;
                $user->save();
                return response()->json(['message' => 'Bio updated'], 200);
            } else {
                return response()->json(['error' => 'User not found'], 404);
            }

        }  catch (Exception $exception) {
            return response()->json(['error' => $exception->getMessage()], 500);
        }
    }

    public function editTags(Request $request){
        $request->validate([
            'id' => 'required',
        ]);

        try {
            $user = User::find($request->id);

            if ($user) {
                $user->tags = $request->tags;
                $user->save();
                return response()->json(['message' => 'Tags updated'], 200);
            } else {
                return response()->json(['error' => 'User not found'], 404);
            }

        }  catch (Exception $exception) {
            return response()->json(['error' => $exception->getMessage()], 500);
        }
    }

    public function requestCover(Request $request){
        $request->validate([
            'user_id' => 'required',
            'shift_id' => 'required',
            'reason' => 'required',
        ]);

        try {
            $user = User::find($request->user_id);

            if ($user) {
                $shift = Shift::find($request->shift_id);

                if ($shift) {
                    $coverRequest = new Cover_request();
                    $coverRequest->user_id = $request->user_id;
                    $coverRequest->shift_id = $request->shift_id;
                    $coverRequest->reason = $request->reason;
                    $coverRequest->request_status = 1;
                    $coverRequest->save();

                    return response()->json(['message' => 'Cover request added successfully'], 201);
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

    public function getSemester(){
        try {
            $semester = Semester::get();

            if($semester){
                return response()->json(['Semester' => $semester], 200);
            }
            else{
                return response()->json(['message' => 'No semesters found'], 200);
            }
        } catch (Exception $exception) {
            return response()->json(['error' => $exception->getMessage()], 500);
        }
    }

    public function markAttendance(Request $request){
        $request->validate([
            'user_id' => 'required',
        ]);

        try {
            $user = User::find($request->user_id);

            if ($user) {
                $userShifts = User_has_shift::where('user_id', $request->user_id)->get();
                $attendanceMarked = false;

                foreach ($userShifts as $shift) {
                    if ($shift->shift_status == 1) {
                        $shift->attended = 1;
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
            } else {
                return response()->json(['error' => 'User not found'], 404);
            }
        }  catch (Exception $exception) {
            return response()->json(['error' => $exception->getMessage()], 500);
        }
    }

    // COMMUNITY PAGE
    public function getAllUsers(){
        try {
            $users = User::with("rank")->get();
            return response()->json(['users' => $users], 200);
        }  catch (Exception $exception) {
            return response()->json(['error' => $exception->getMessage()], 500);
        }
    }

    // ANNOUNCEMENTS PAGE
    public function getAllAnnouncements(){
        try {
            $announcements = Announcement::with('admin')->join('users', 'announcements.admin_id', '=', 'users.id')
                ->select('announcements.*', 'users.first_name as admin_first_name', 'users.last_name as admin_last_name')
                ->get();
    
            return response()->json(['announcements' => $announcements], 200);
        }  catch (Exception $exception) {
            return response()->json(['error' => $exception->getMessage()], 500);
        }
    }
    

    // COVER REQUESTS PAGE
    public function getAllCoverRequests(){
        try {
            $coverRequests = Cover_request::with(['user' => function ($query) {
                $query->with('rank');
            }])->with("shift")->where('request_status', 0)->get();
            return response()->json(['coverRequests' => $coverRequests], 200);
        }  catch (Exception $exception) {
            return response()->json(['error' => $exception->getMessage()], 500);
        }
    }

    public function getShiftCoverRequests($shiftId){
        try {
            $coverRequestsCount = Cover_request::where('shift_id', $shiftId)->count();
            
            return response()->json(['coverRequestsCount' => $coverRequestsCount], 200);
        }  catch (Exception $exception) {
            return response()->json(['error' => $exception->getMessage()], 500);
        }
    }
    

    public function acceptCoverRequest(Request $request){
        $request->validate([
            'id' => 'required',
            'covered_by' => 'required',
        ]);
        try {
            $coverRequest = Cover_request::findOrFail($request->id);
            $coverRequest->request_status = 1;
            $coverRequest->covered_by = $request->covered_by;
            $coverRequest->save();

            return response()->json(['message' => 'Cover request accepted'], 200);
        }  catch (Exception $exception) {
            return response()->json(['error' => $exception->getMessage()], 500);
        }
    }

    // CASE REPORTS PAGE
    public function addCaseReport(Request $request){
        $request->validate([
            'id' => 'required|integer',
            'history' => 'required|string',
            'treatment_administration' => 'required',
            'transportation' => 'required',
            'equipment' => 'required',
            'status' => 'required|integer',
            'issues' => 'required|integer',
            'case_report' => 'required|boolean',
        ]);

        try {
            $case_form = Emergency::find($request->id);

            if ($case_form) {
                $case_form->history = $request->history;
                $case_form->treatment_administration = $request->treatment_administration;
                $case_form->transportation = $request->transportation;
                $case_form->equipment = $request->equipment;
                $case_form->status = $request->status;
                $case_form->issues = $request->issues;
                $case_form->case_report = 1;
                $case_form->save();
                return response()->json(['message' => 'Case report for the emergency added successfully'], 201);
            } else {
                return response()->json(['error' => 'Emergency not found'], 404);
            }
        }  catch (Exception $exception) {
            return response()->json(['error' => $exception->getMessage()], 500);
        }
    }

    // EXTENSIONS PAGE
    public function getExtensions(){
        try {
            $extensions = Extension::all();
            return response()->json(['extensions' => $extensions], 200);
        }  catch (Exception $exception) {
            return response()->json(['error' => $exception->getMessage()], 500);
        }
    }

    // MEDICAL FAQs PAGE
    public function getMedicalFaqs($id){
        try {
            $faqs = Medical_Faq::where('type', $id)->get();
            return response()->json(['medicalFAQ' => $faqs], 200);
        } catch (ModelNotFoundException $exception) {
            return response()->json(['error' => 'Medical FAQ not found'], 404);
        } catch (Exception $exception) {
            return response()->json(['error' => 'Failed to fetch medical FAQ'], 500);
        }
    }
}
