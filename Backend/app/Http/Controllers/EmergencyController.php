<?php

namespace App\Http\Controllers;

use App\Models\Assessment;
use App\Models\Emergency;
use Illuminate\Http\Request;
use Illuminate\Database\Eloquent\ModelNotFoundException;

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
    public function acceptEmergency($emergencyId, $medicId)
    {
        try{
            $emergency = Emergency::findOrFail($emergencyId);    
            $emergency->medic_id = $medicId;
            $emergency->save();
            return response()->json(['message' => 'Emergency accepted'], 200);
        }
        catch (ModelNotFoundException $exception) {
            return response()->json(['error' => 'Emergency not found'], 404);
        }
    }

    public function addEmergencyDetails(Request $request, $id){
        $request->validate([
            'patient_id' => 'required',
            'medic_description' => 'required',
            'patient_condition' => 'required',
        ]);
    
        $emergency = Emergency::findOrFail($id);
        
        $emergency->patient_id = $request->patient_id;
        $emergency->medic_description = $request->medic_description;
        $emergency->patient_condition = $request->patient_condition;

        $emergency->save();
    
        return response()->json(['message' => 'Emergency details added successfully'], 200);
    }
    
    public function addAssessment(Request $request, $emergencyId){
        $request-> validate([

            'heart_rate' => 'required',
            'blood_pressure' => 'required',
            'oxygen_saturation' => 'required',
            'temperature' => 'required',
            'respiration_rate' => 'required',
            'capillary_refill_time' => 'required',
            'hemoglucotest' => 'required',
            'pupils_reaction' => 'required',
        ]);

        $assessment = new Assessment();

        $assessment->emergency_id = $emergencyId;
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

    public function endEmergency($id){
        try{
            $emergency = Emergency::findOrFail($id);
            $emergency->status = 0;
            $emergency->save();
            return response()->json(['message' => 'Emergency ended']);
        }catch (ModelNotFoundException $exception){
            return response()->json(['error' => 'Emergency not found'], 404);
        }
    }
    
    public function getNoReportEmergencies(){
        $emergencies = Emergency::where('case_report', 0)->get(); //0 means unfilled case report
        return response()->json(['emergencies' => $emergencies], 200);  
    }

    

}
