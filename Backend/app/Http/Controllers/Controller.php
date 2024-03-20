<?php

namespace App\Http\Controllers;

use Illuminate\Foundation\Auth\Access\AuthorizesRequests;
use Illuminate\Foundation\Validation\ValidatesRequests;
use Illuminate\Routing\Controller as BaseController;
use Carbon\Carbon;
use App\Models\Shift;
use App\Models\User_has_shift;

class Controller extends BaseController
{
    use AuthorizesRequests, ValidatesRequests;

    public static function updateShiftStatus(){

        $currentTime = Carbon::now();
        $currentDay = $currentTime->englishDayOfWeek;

        $currentShift = Shift::where('day', $currentDay)
                            ->whereTime('time_start', '<=', $currentTime)
                            ->whereTime('time_end', '>=', $currentTime)
                            ->first();

        $currentShiftId = $currentShift->id;
        $shifts = User_has_shift::all();

        foreach($shifts as $shift){
            if($shift->shift_id == $currentShiftId){
                $shift->shift_status = 1;
            }
            else{
                $shift->shift_status = 0;
            }
            $shift->save();
        }
        return response()->json(['message' => 'Shift status updated successfully'], 200);
    }
}
