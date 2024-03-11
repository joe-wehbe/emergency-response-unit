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
            Route::put('{id}/edit-bio', [UserController::class, 'editBio']);
            Route::put('{id}/edit-tags', [UserController::class, 'editTags']);
            Route::post('{userId}/request-cover/{shiftId}', [UserController::class, 'requestCover']);
            Route::post('{id}/mark-attendance', [UserController::class, 'markAttendance']);
            Route::get('', [UserController::class, 'getAllUsers']);

        });

        // EMERGENCY CONTROLLER APIs
        Route::group(["prefix" => "emergency"], function(){
           Route::post("report-emergency", [EmergencyController::class, "reportEmergency"]);
           Route::post('add-emergency-details/{id}', [EmergencyController::class, "addEmergencyDetails"]);
           Route::post("add-assessment/{emergencyId}", [EmergencyController::class, "addAssessment"]);
           Route::get('get-ongoing-emergencies', [EmergencyController::class, 'getOngoingEmergencies']);
           Route::get('get-ended-emergencies', [EmergencyController::class, 'getEndedEmergencies']);
           Route::get('get-emergency/{id}', [EmergencyController::class, 'getEmergency']);
           Route::post('accept-emergency/{emergencyId}/medic/{medicId}', [EmergencyController::class, 'acceptEmergency']);
           Route::post('end-emergency/{id}/', [EmergencyController::class, 'endEmergency']);
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

            Route::put("change-rank/{userId}/{rankId}", [AdminController::class, "changeRank"]);     
            Route::put("remove-member/{id}", [AdminController::class, "removeMember"]);    
            Route::get("get-user-shifts/{id}", [AdminController::class, "getUserShifts"]);
        });
});

