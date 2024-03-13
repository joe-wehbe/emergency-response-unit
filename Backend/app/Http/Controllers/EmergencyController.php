<?php

namespace App\Http\Controllers;

use App\Models\User;
use App\Models\Assessment;
use App\Models\Emergency;
use Illuminate\Http\Request;
use Illuminate\Database\Eloquent\ModelNotFoundException;
use Exception;

class EmergencyController extends Controller
{

    // REPORT EMERGENCY PAGE 
    public function reportEmergency(Request $request){
        $request-> validate([
            'location' => 'required',
            'reporter_description' => 'required'
        ]);

        $emergency = new Emergency();
        $emergency->location = $request->location;
        $emergency->reporter_description = $request->reporter_description;
        $emergency->save();

        return response()->json(['message' => 'Emergency added successfully'], 201);    
    }

    // STANDBY PAGE
    public function getOngoingEmergencies(){
        $emergencies = Emergency::where('status', 1)->get();
        return response()->json(['emergencies' => $emergencies], 200);
    }

    public function getEndedEmergencies(){
        $emergencies = Emergency::where('status', 0)->get();
        return response()->json(['emergencies' => $emergencies], 200);
    }

    public function getEmergency($id){
        try {
            $emergency = Emergency::findOrFail($id);
            return response()->json(['emergency' => $emergency], 200);
        } catch (ModelNotFoundException $exception) {
            return response()->json(['error' => 'Emergency not found'], 404);
        }
    }

    // ON SCENE PAGE
    public function acceptEmergency(Request $request){
        $request-> validate([
            'id' => 'required',
            'medic_id' => 'required'
        ]);

        try{
            $emergency = Emergency::find($request->id);    

            if($emergency){
                $user = User::find($request->medic_id);

                if($user){
                    if($user->user_rank == 2 || $user->user_rank == 4|| $user->user_rank == 6 || $user->user_rank == 7){
                        $emergency->medic_id = $request->medic_id;
                        $emergency->save();
                        return response()->json(['message' => 'Emergency accepted'], 200);
                    }
                    else{
                        return response()->json(['message' => 'User is not a medic'], 200);
                    }
                }else{
                    return response()->json(['error' => 'Medic not found'], 404);
                }
            }else{
                return response()->json(['error' => 'Emergency not found'], 404);
            }
        }
        catch (Exception $exception) {
            return response()->json(['error' => 'An error occurred'], 500);
        }
    }

    public function addEmergencyDetails(Request $request){
        $request->validate([
            'id' => 'required',
            'patient_id' => 'required',
            'medic_description' => 'required',
            'patient_condition' => 'required',
        ]);

        try{
            $emergency = Emergency::find($request->id);

            if($emergency){
                $patient = User::find($request->patient_id);

                if($patient){
                    $emergency->patient_id = $request->patient_id;
                    $emergency->medic_description = $request->medic_description;
                    $emergency->patient_condition = $request->patient_condition;
                    $emergency->save();
                    return response()->json(['message' => 'Emergency details added successfully'], 200);
                }
                else{
                    return response()->json(['error' => 'Patient not found'], 404);
                }
            }
            else{
                return response()->json(['error' => 'Emergency not found'], 404);
            }
        }catch (Exception $exception) {
            return response()->json(['error' => 'An error occurred'], 500);
        }
    }
    
    public function addAssessment(Request $request){
        $request-> validate([
            'emergency_id' => 'required',
            'heart_rate' => 'required',
            'blood_pressure' => 'required',
            'oxygen_saturation' => 'required',
            'temperature' => 'required',
            'respiration_rate' => 'required',
            'capillary_refill_time' => 'required',
            'hemoglucotest' => 'required',
            'pupils_reaction' => 'required',
        ]);

        try{
            $emergency = Emergency::find($request->emergency_id);

            if($emergency){
                $assessment = new Assessment();
                $assessment->emergency_id = $request->emergency_id;
                $assessment->heart_rate = $request->heart_rate;
                $assessment->blood_pressure = $request->blood_pressure;
                $assessment->oxygen_saturation = $request->oxygen_saturation;
                $assessment->temperature = $request->temperature;
                $assessment->respiration_rate = $request->respiration_rate;
                $assessment->capillary_refill_time = $request->capillary_refill_time;
                $assessment->hemoglucotest = $request->hemoglucotest;
                $assessment->pupils_reaction = $request->pupils_reaction;
                $assessment->save();
                return response()->json(['message' => 'Assessment added successfully'], 201);
            }
            else{
                return response()->json(['error' => 'Emergency not found'], 404);
            }
        }catch (Exception $exception) {
            return response()->json(['error' => 'An error occurred'], 500);
        }
    }

    public function endEmergency(Request $request){
        $request-> validate([
            'id' => 'required'
        ]);

        try{
            $emergency = Emergency::find($request->id);

            if($emergency){
                $emergency->status = 0;
                $emergency->save();
                return response()->json(['message' => 'Emergency ended']);
            }
            else{
                return response()->json(['message' => 'Emergency not found']);
            }

        }catch (Exception $exception) {
            return response()->json(['error' => 'An error occurred'], 500);
        }
    }
    
    public function getNoReportEmergencies(){
        $emergencies = Emergency::where('case_report', 0)->get(); //0 means unfilled case report
        return response()->json(['emergencies' => $emergencies], 200);  
    }

    

}
