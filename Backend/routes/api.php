<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AdminController;

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
        Route::group(["prefix" => "user"], function(){
           //write the route of the apis in the user controller here 
        });
    
        Route::group(["prefix" => "emergency"], function(){
           
           //write the route of the apis in the emergency controller here 

        });
    
        Route::group(["prefix" => "admin"], function(){
             //write the route of the apis in the admin controller here 
             Route::post("delete_announcement", [AdminController::class, "deleteAnnouncement"]);
             Route::post("delete_user", [AdminController::class, "deleteUser"]);
             Route::post("add_faq", [AdminController::class, "deleteFaq"]);
             Route::post("delete_faq", [AdminController::class, "deleteFaq"]);
        });

});

