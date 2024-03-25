<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\UserController;
use App\Http\Controllers\AdminController;
use App\Http\Controllers\EmergencyController;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider and all of them will
| be assigned to the "api" middleware group. Make something great!
|
*/

Route::middleware('auth:sanctum')->get('/user', function (Request $request) {
    return $request->user();
});

Route::group(["prefix" => "v0.1"], function(){
    // USER CONTROLLER APIs
    Route::group(["prefix" => "user"], function(){
        Route::post("register", [UserController::class, "register"]);
        Route::post("login", [UserController::class, "login"]);
        Route::post("logout", [UserController::class, "logout"]);
        Route::put("apply", [UserController::class, "apply"]);
        Route::get('{id}/get-user-info', [UserController::class, 'getUserInfo']);
        Route::put('edit-bio', [UserController::class, 'editBio']);
        Route::put('edit-tags', [UserController::class, 'editTags']);
        Route::post('request-cover', [UserController::class, 'requestCover']);
        Route::put('mark-attendance', [UserController::class, 'markAttendance']);
        Route::get('get-all-users', [UserController::class, 'getAllUsers']);
        Route::get('get-all-announcements', [UserController::class, 'getAllAnnouncements']);
        Route::get('get-all-cover-requests', [UserController::class, 'getAllCoverRequests']);
        Route::put('accept-cover-request', [UserController::class, 'acceptCoverRequest']);
        Route::get('get-no-report-emergencies', [UserController::class, 'getNoReportEmergencies']);
        Route::get('get-extensions', [UserController::class, 'getExtensions']);
        Route::get('{id}/get-medical-faqs', [UserController::class, 'getMedicalFaqs']);
        Route::put('add-case-report', [UserController::class, 'addCaseReport']);
    });
    // EMERGENCY CONTROLLER APIs
    Route::group(["prefix" => "emergency"], function(){
        Route::post("report-emergency", [EmergencyController::class, "reportEmergency"]);
        Route::get('get-ongoing-emergencies', [EmergencyController::class, 'getOngoingEmergencies']);
        Route::get('get-ended-emergencies', [EmergencyController::class, 'getEndedEmergencies']);
        Route::delete('delete-emergency/{id}', [EmergencyController::class, 'deleteEmergency']);
        Route::get('get-emergency/{id}', [EmergencyController::class, 'getEmergency']);
        Route::get('get-emergency-assessments/{id}', [EmergencyController::class, 'getEmergencyAssessments']);
        Route::get('get-no-response-emergencies', [EmergencyController::class, 'getNoResponseEmergencies']);
        Route::put('accept-emergency', [EmergencyController::class, 'acceptEmergency']);
        Route::put('add-emergency-details', [EmergencyController::class, "addEmergencyDetails"]);
        Route::post("add-assessment", [EmergencyController::class, "addAssessment"]);
        Route::put('end-emergency', [EmergencyController::class, 'endEmergency']);
    });
    // ADMIN CONTROLLER APIs
    Route::group(["prefix" => "admin"], function(){
        Route::put("add-member", [AdminController::class, "addMember"]);    
        Route::put("remove-member", [AdminController::class, "removeMember"]);    
        Route::delete("delete-user", [AdminController::class, "deleteUser"]);
        Route::put("change-rank", [AdminController::class, "changeRank"]);     
        Route::get("get-user-shifts/{id}", [AdminController::class, "getUserShifts"]);
        Route::post("add-shift", [AdminController::class, "addShift"]);    
        Route::delete("delete-shift", [AdminController::class, "deleteShift"]);   
        Route::post("add-announcement", [AdminController::class, "addAnnouncement"]);   
        Route::delete("delete-announcement", [AdminController::class, "deleteAnnouncement"]);
        Route::post("add-faq", [AdminController::class, "addFaq"]);
        Route::delete("delete-faq", [AdminController::class, "deleteFaq"]);
        Route::post("add-extension", [AdminController::class, "addExtension"]);
        Route::delete("delete-extension", [AdminController::class, "deleteExtension"]);    
        Route::get("get-attendance-records", [AdminController::class, "getAttendanceRecords"]);
        Route::get("get-login-requests", [AdminController::class, "getLoginRequests"]);
        Route::put("accept-login-request", [AdminController::class, "acceptRequest"]);
        Route::put("reject-login-request", [AdminController::class, "rejectRequest"]);
        Route::get('get-emergency-records', [AdminController::class, 'getEmergencyRecords']);    
        Route::get('get-members', [AdminController::class, 'getMembers']);    
    });
});

