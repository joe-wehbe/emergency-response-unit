<?php

namespace App\Http\Controllers;

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
use App\Models\Semester;

use Carbon\Carbon;
use Exception;

class UserController extends Controller{

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

    public function getRequestStatus($email){
        try {
            $request = Login_request::where('email', $email)->first();
    
            if ($request) {
                $status = $request->status;

                if ($status == 0) {
                    return response()->json(['status' => 'pending'], 200);
                } elseif ($status == 1) {
                    return response()->json(['status' => 'accepted'], 200);
                } elseif ($status == 2) {
                    return response()->json(['status' => 'rejected'], 200);
                } else {
                    return response()->json(['status' => 'unknown'], 200);
                }
            } else {
                return response()->json(['message' => 'No signup request'], 200);
            }
        } catch (Exception $exception) {
            return response()->json(['error' => $exception->getMessage()], 500);
        }
    }

    // PROFILE PAGE
    public function getUserInfo($id){
        try {
            $user = User::with('rank')->find($id);

            if($user){
                return response()->json(['User' => $user], 200);
            }
            else{
                return response()->json(['error' => 'User not found'], 404);
            }
        }  catch (Exception $exception) {
            return response()->json(['error' => $exception->getMessage()], 500);
        }
    }

    public function getUserShifts($userId){ // ALSO IMPLEMENTED IN ADMIN CONTROLLER (ADJUST)
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

    // EDIT PROFILE PAGE
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

    // COMMUNITY PAGE
    public function getAllUsers(){
        try {
            $users = User::with("rank")->where("user_type", 1)->get();
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

    public function acceptCoverRequest(Request $request){
        $request->validate([
            'id' => 'required',
            'covered_by' => 'required',
        ]);
        try {
            $coverRequest = Cover_request::find($request->id);
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
            'patient_name' => 'required',
            'location' => 'required',
            'patient_condition' => 'required',
            'history' => 'required|string',
            'treatment_administration' => 'required',
            'transportation' => 'required',
            'equipment' => 'required',
            'consultation' => 'required',
            'issues' => 'required',
        ]);

        try {
            $case_form = Emergency::find($request->id);

            if ($case_form) {
                $case_form->id = $request->id;
                $case_form->patient_name = $request->patient_name;
                $case_form->location = $request->location;
                $case_form->patient_condition = $request->patient_condition;
                $case_form->history = $request->history;
                $case_form->treatment_administration = $request->treatment_administration;
                $case_form->transportation = $request->transportation;
                $case_form->equipment = $request->equipment;
                $case_form->consultation = $request->consultation;
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
    public function getMedicalFaqs($type){
        try {
            $faqs = Medical_Faq::where('type', $type)->get();
            return response()->json(['medicalFAQ' => $faqs], 200);
        } catch (ModelNotFoundException $exception) {
            return response()->json(['error' => 'Medical FAQ not found'], 404);
        } catch (Exception $exception) {
            return response()->json(['error' => 'Failed to fetch medical FAQ'], 500);
        }
    }









    // UNKNOWN
    public function getShiftCoverRequests($shiftId){
        try {
            $coverRequestsCount = Cover_request::where('shift_id', $shiftId)->count();
            
            return response()->json(['coverRequestsCount' => $coverRequestsCount], 200);
        }  catch (Exception $exception) {
            return response()->json(['error' => $exception->getMessage()], 500);
        }
    }
}
