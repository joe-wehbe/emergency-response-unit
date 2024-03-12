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
            Route::get('{id}/get-user-info', [UserController::class, 'getUserInfo']);
            Route::put('edit-bio', [UserController::class, 'editBio']);
            Route::put('edit-tags', [UserController::class, 'editTags']);
            Route::post('request-cover', [UserController::class, 'requestCover']);
            Route::put('mark-attendance', [UserController::class, 'markAttendance']);
            Route::get('/get-all-users', [UserController::class, 'getAllUsers']);
            Route::get('/get-all-announcements', [UserController::class, 'getAllAnnouncements']);

        });

        // EMERGENCY CONTROLLER APIs
        Route::group(["prefix" => "emergency"], function(){
           Route::post("report-emergency", [EmergencyController::class, "reportEmergency"]);
           Route::get('get-ongoing-emergencies', [EmergencyController::class, 'getOngoingEmergencies']);
           Route::get('get-ended-emergencies', [EmergencyController::class, 'getEndedEmergencies']);
           Route::get('get-emergency/{id}', [EmergencyController::class, 'getEmergency']);
           Route::put('accept-emergency', [EmergencyController::class, 'acceptEmergency']);
           Route::put('add-emergency-details', [EmergencyController::class, "addEmergencyDetails"]);
           Route::post("add-assessment", [EmergencyController::class, "addAssessment"]);
           Route::put('end-emergency', [EmergencyController::class, 'endEmergency']);
        });

        // ADMIN CONTROLLER APIs
        Route::group(["prefix" => "admin"], function(){
            Route::get("get_login_requests", [AdminController::class, "getLoginRequests"]);
            Route::get("get_attendance_records", [AdminController::class, "getAttendanceRecords"]);
            Route::post("accept_login_request", [AdminController::class, "acceptRequest"]);
            Route::post("reject_login_request", [AdminController::class, "rejectRequest"]);
            Route::post("delete_announcement", [AdminController::class, "deleteAnnouncement"]);
            Route::post("delete_user", [AdminController::class, "deleteUser"]);
            Route::post("add_faq", [AdminController::class, "addFaq"]);
            Route::post("delete_faq", [AdminController::class, "deleteFaq"]);
            Route::post("add_extension", [AdminController::class, "addExtension"]);
            Route::post("delete_extension", [AdminController::class, "deleteExtension"]);    

            Route::put("change-rank", [AdminController::class, "changeRank"]);     
            Route::put("remove-member", [AdminController::class, "removeMember"]);    
            Route::get("get-user-shifts/{id}", [AdminController::class, "getUserShifts"]);
        });
});

