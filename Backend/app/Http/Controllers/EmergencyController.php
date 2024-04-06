<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

use App\Models\User;
use App\Models\Assessment;
use App\Models\Emergency;

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
        try {
            $emergencies = Emergency::with('medic')
                ->where('status', 1)
                ->orderBy('created_at', 'desc')
                ->get();
            
            if($emergencies->isEmpty()){
                return response()->json(['message' => 'No ongoing emergencies'], 200);
            }
    
            $emergenciesWithLastAssessments = [];
            foreach ($emergencies as $emergency) {
                $lastAssessment = $emergency->assessments()->latest()->first();
                $emergenciesWithLastAssessments[] = [
                    'emergency' => $emergency,
                    'last_assessment' => $lastAssessment
                ];
            }
            return response()->json(['emergencies' => $emergenciesWithLastAssessments], 200);
        } catch (Exception $exception) {
            return response()->json(['error' => $exception->getMessage()], 500);
        }
    }

    public function getEndedEmergencies(){
        try{
            $emergencies = Emergency::with('medic')
            ->where('status', 0)
            ->where('case_report', 0)
            ->orderBy('created_at', 'desc')
            ->get();

            if($emergencies->isEmpty()){
                return response()->json(['message' => 'No ended emergencies'], 200);
            }
            else{
                return response()->json(['emergencies' => $emergencies], 200);
            }
        } catch (Exception $exception) {
            return response()->json(['error' => $exception->getMessage()], 500);
        }
    }

    public function deleteEmergency($emergencyId){
        try{
            $emergency = Emergency::find($emergencyId);

            if($emergency){
                Assessment::where('emergency_id', $emergencyId)->delete();
                $emergency->delete();
                
                return response()->json(['message' => 'Emergency deleted successfully'], 201);    
            }
            else{
                return response()->json(['error' => 'Emergency not found'], 404);
            }
        } catch (Exception $exception) {
            return response()->json(['error' => $exception->getMessage()], 500);
        }
    }
    
    // EMERGENCY DETAILS PAGE
    public function getEmergency($id){
        try {
            $emergency = Emergency::with('medic')->find($id);
            
            if($emergency){
                return response()->json(['emergency' => $emergency], 200);
            }
            else{
                return response()->json(['error' => 'Emergency not found'], 404);
            }
        } catch (Exception $exception) {
            return response()->json(['error' => $exception->getMessage()], 500);
        }
    }

    public function getEmergencyAssessments($id){
        try{
            $emergency = Emergency::find($id);

            if($emergency){
                $assessments = Assessment::where('emergency_id', $id)->get();
                return response()->json(['assessments' => $assessments], 200);
            }
            else{
                return response()->json(['error' => 'Emergency not found'], 404);
            }
        } catch (Exception $exception) {
            return response()->json(['error' => $exception->getMessage()], 500);
        }
    }

    // ON SCENE PAGE
    public function getNoResponseEmergencies(){
        try{
            $emergencies = Emergency::whereNull('medic_id')->where('status', 1)->orderByDesc('created_at')->get();
    
            if($emergencies->isEmpty()){
                return response()->json(['message' => 'No emergencies without response'], 200);
            }
            else{
                return response()->json(['emergencies' => $emergencies], 200);
            }
        } catch (Exception $exception) {
            return response()->json(['error' => $exception->getMessage()], 500);
        }
    }
    
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
        } catch (Exception $exception) {
            return response()->json(['error' => $exception->getMessage()], 500);
        }
    }

    // MEDIC EMERGENCY DETAILS PAGE
    public function getEmergencyWithLastAssessment($id){
        try{
            $emergency = Emergency::with('medic')->find($id);

            if($emergency){
                $lastAssessment = $emergency->assessments()->latest()->first();
                return response()->json(['emergency' => $emergency,'last_assessment' => $lastAssessment], 200);
            }
            else{
                return response()->json(['error' => 'Emergency not found'], 404);
            }
        } catch (Exception $exception) {
            return response()->json(['error' => $exception->getMessage()], 500);
        }
    }

    public function addEmergencyDetails(Request $request){
        $request->validate([
            'id' => 'required'
        ]);
        try{
            $emergency = Emergency::find($request->id);

            if($emergency){

                $fields = ['patient_name', 'patient_lau_id', 'medic_description', 'patient_condition'];

                foreach($fields as $field){
                    if($request->$field != null && $request->$field != -1){
                        $emergency->$field = $request->$field;
                    }else{
                        $emergency->$field = null;
                    }
                }
                $emergency->save();
                return response()->json(['message' => 'Emergency details added successfully'], 200);
            }
            else{
                return response()->json(['error' => 'Emergency not found'], 404);
            }
        } catch (Exception $exception) {
            return response()->json(['error' => $exception->getMessage()], 500);
        }
    }
    
    public function addAssessment(Request $request){
        $request->validate([
            'emergency_id' => 'required',
        ]);
        try{
            $emergency = Emergency::find($request->emergency_id);
    
            if($emergency){
                $assessment = new Assessment();
                $assessment->emergency_id = $request->emergency_id;
                $assessment->blood_pressure = $request->blood_pressure;
                $assessment->pupils_reaction = $request->pupils_reaction;
                
                $vitals = ['heart_rate', 'oxygen_saturation', 'temperature', 'respiration_rate', 'capillary_refill_time', 'hemoglucotest'];
        
                foreach ($vitals as $vital) {
                    if ($request->$vital != -1) {
                        $assessment->$vital = $request->$vital;
                    }
                    else{
                        $assessment->$vital = null;
                    }
                }
                $assessment->save();
                return response()->json(['message' => 'Assessment added successfully'], 201);
            }
            else{
                return response()->json(['error' => 'Emergency not found'], 404);
            }
        } catch (Exception $exception) {
            return response()->json(['error' => $exception->getMessage()], 500);
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
                return response()->json(['error' => 'Emergency not found'], 404);
            }
        } catch (Exception $exception) {
            return response()->json(['error' => $exception->getMessage()], 500);
        }
    }

    public function getAllEmergenciesWithLastAssessment(){
        try {
            $emergencies = Emergency::with('medic')
            ->where('status', 0)
            ->where('case_report', 1)
            ->orderBy('created_at', 'desc')
            ->get();
            
            if($emergencies->isEmpty()){
                return response()->json(['message' => 'No emergency records'], 200);
            }
    
            $emergenciesWithLastAssessments = [];
            foreach ($emergencies as $emergency) {
                $lastAssessment = $emergency->assessments()->latest()->first();
                $emergenciesWithLastAssessments[] = [
                    'emergency' => $emergency,
                    'last_assessment' => $lastAssessment
                ];
            }
            return response()->json(['emergencies' => $emergenciesWithLastAssessments], 200);
        } catch (Exception $exception) {
            return response()->json(['error' => $exception->getMessage()], 500);
        }
    }
}
