<?php

use App\Http\Controllers\FcmController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\UserController;
use App\Http\Controllers\AdminController;
use App\Http\Controllers\EmergencyController;
use App\Http\Controllers\AuthController;
use App\Http\Middleware\AdminMiddleware;

Route::middleware('auth:sanctum')->get('/user', function (Request $request) {
    return $request->user();
});

Route::group(["prefix" => "v0.1"], function () {

    // AUTHENTICATION CONTROLLER APIs
    Route::group(["prefix" => "auth"], function () {
        Route::post("register", [AuthController::class, "register"]);
        Route::post("login", [AuthController::class, "login"]);
        Route::post('auto-login', [AuthController::class, 'autoLogin']);
        Route::post('logout', [AuthController::class, 'logout']);
    });

    Route::group(["middleware" => "auth:sanctum"], function () {
        // USER CONTROLLER APIs
        Route::group(["prefix" => "user"], function () {
            Route::get('get-applications-permission', [UserController::class, 'getApplicationsPermission']);
            Route::put("apply", [UserController::class, "apply"]);
            Route::get('get-user-info/{id}', [UserController::class, 'getUserInfo']);
            Route::get("get-user-shifts/{id}", [UserController::class, "getUserShifts"]);
            Route::get("get-request-status/{email}", [UserController::class, "getRequestStatus"]);
            Route::post("edit-profile-picture", [UserController::class, "editProfilePicture"]);
            Route::put("remove-profile-picture/{id}", [UserController::class, "removeProfilePicture"]);
            Route::put('edit-bio', [UserController::class, 'editBio']);
            Route::put('edit-tags', [UserController::class, 'editTags']);
            Route::get('get-semester', [UserController::class, 'getSemester']);
            Route::post('request-cover', [UserController::class, 'requestCover']);
            Route::put('mark-attendance', [UserController::class, 'markAttendance']);
            Route::get('get-all-members/{id}', [UserController::class, 'getAllMembers']);
            Route::get('get-users-on-shift', [UserController::class, 'getUsersOnShift']);
            Route::get('get-all-announcements/{id}', [UserController::class, 'getAllAnnouncements']);
            Route::get('get-announcements-count/{rank}', [UserController::class, 'getAnnouncementsCount']);
            Route::get('get-all-cover-requests/{id}', [UserController::class, 'getAllCoverRequests']);
            Route::get('get-cover-requests-count/{id}', [UserController::class, 'getCoverRequestsCount']);
            Route::put('accept-cover-request', [UserController::class, 'acceptCoverRequest']);
            Route::get('get-extensions', [UserController::class, 'getExtensions']);
            Route::get('get-medical-faqs/{type}', [UserController::class, 'getMedicalFaqs']);
            Route::put('add-case-report', [UserController::class, 'addCaseReport']);
        });

        // EMERGENCY CONTROLLER APIs
        Route::group(["prefix" => "emergency"], function () {
            Route::post("report-emergency", [EmergencyController::class, "reportEmergency"]);
            Route::get('check-medic-response/{id}', [EmergencyController::class, 'checkMedicResponse']);
            Route::get('get-ongoing-emergencies', [EmergencyController::class, 'getOngoingEmergencies']);
            Route::get('get-ongoing-emergencies-count', [EmergencyController::class, 'getOngoingEmergenciesCount']);
            Route::get('get-ended-emergencies', [EmergencyController::class, 'getEndedEmergencies']);
            Route::delete('delete-emergency/{id}', [EmergencyController::class, 'deleteEmergency']);
            Route::get('get-emergency/{id}', [EmergencyController::class, 'getEmergency']);
            Route::get('get-emergency-assessments/{id}', [EmergencyController::class, 'getEmergencyAssessments']);
            Route::get('get-no-response-emergencies', [EmergencyController::class, 'getNoResponseEmergencies']);
            Route::put('accept-emergency', [EmergencyController::class, 'acceptEmergency']);
            Route::get("find-ongoing-emergency/{id}", [EmergencyController::class, "findOngoingEmergencyByMedicId"]);
            Route::get('get-emergency-with-last-assessment/{id}', [EmergencyController::class, 'getEmergencyWithLastAssessment']);
            Route::put('add-emergency-details', [EmergencyController::class, "addEmergencyDetails"]);
            Route::post("add-assessment", [EmergencyController::class, "addAssessment"]);
            Route::put('end-emergency', [EmergencyController::class, 'endEmergency']);
            Route::get('get-all-emergencies-with-last-assessment', [EmergencyController::class, 'getAllEmergenciesWithLastAssessment']);
            Route::get('get-all-case-reports', [EmergencyController::class, 'getAllCaseReports']);
            Route::get('get-case-reports-count', [EmergencyController::class, 'getCaseReportsCount']);
        });

        // ADMIN CONTROLLER APIs
        Route::group(["middleware" => ["auth:sanctum", AdminMiddleware::class]], function () {
            Route::group(["prefix" => "admin"], function () {
                Route::put("update-semester-dates", [AdminController::class, "updateSemesterDates"]);
                Route::put("remove-member", [AdminController::class, "removeMember"]);
                Route::put("change-rank", [AdminController::class, "changeRank"]);
                Route::get("get-user-shifts/{id}", [AdminController::class, "getUserShifts"]);
                Route::post("add-shift", [AdminController::class, "addShift"]);
                Route::delete("delete-shift/{user_id}/{shift_id}", [AdminController::class, "deleteShift"]);
                Route::post("add-announcement", [AdminController::class, "addAnnouncement"]);
                Route::delete("delete-announcement/{id}", [AdminController::class, "deleteAnnouncement"]);
                Route::post("add-faq", [AdminController::class, "addFaq"]);
                Route::delete("delete-faq/{id}", [AdminController::class, "deleteFaq"]);
                Route::post("add-extension", [AdminController::class, "addExtension"]);
                Route::delete("delete-extension/{id}", [AdminController::class, "deleteExtension"]);
                Route::get("get-attendance-records", [AdminController::class, "getAttendanceRecords"]);
                Route::get("get-signup-requests", [AdminController::class, "getSignupRequests"]);
                Route::put("modify-applications-permission", [AdminController::class, "modifyApplicationsPermission"]);
                Route::put("accept-signup-request/{id}", [AdminController::class, "acceptSignupRequest"]);
                Route::put("reject-signup-request/{id}", [AdminController::class, "rejectSignupRequest"]);
                Route::get('get-emergency-records', [AdminController::class, 'getEmergencyRecords']);
                Route::get('get-admins', [AdminController::class, 'getAdmins']);
                Route::get('get-shift-covers-count/{userId}/{shiftId}', [AdminController::class, 'getShiftCoversCount']);
                Route::get('download-emergency-records', [AdminController::class, 'downloadEmergencyRecords']);
            });
        });

        // FCM CONTROLLER APIs
        Route::group(["prefix" => "fcm"], function () {
            Route::put("save-fcm-token", [FcmController::class, "saveFcmToken"]);
            Route::get("get-dispatchers-fcm-tokens/{id}", [FcmController::class, "getDispatchersFcmTokens"]);
            Route::get("get-medics-fcm-tokens/{id}", [FcmController::class, "getMedicsFcmTokens"]);
            Route::get("get-admins-fcm-tokens/{id}", [FcmController::class, "getAdminsFcmTokens"]);
            Route::get("get-on-shift-fcm-tokens/{id}", [FcmController::class, "getOnShiftFcmTokens"]);
            Route::get("get-all-fcm-tokens/{id}", [FcmController::class, "getAllFcmTokens"]);
        });
    });
});
