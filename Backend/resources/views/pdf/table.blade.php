<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">

    <title>Emergency Records PDF</title>
    <style>
        body {
            font-family: 'Arial', sans-serif;
            padding: 10px;
            margin: 0;
            box-sizing: border-box;
            position: relative;
        }

        .date-right {
            position: absolute;
            right: 20px;
            top: 20px;
            margin-top: -30px;
        }

        table {
            width: 100%;
            border-collapse: collapse;
            table-layout: fixed;
        }

        th,
        td {
            border: 1px solid #ddd;
            padding: 3px;
            text-align: center;
            font-size: 10px;
            overflow-wrap: break-word;
            word-wrap: break-word;
        }

        th {
            background-color: #f2f2f2;
            font-weight: bold;
        }

        h1,
        h2 {
            text-align: center;
        }

        h1 {
            font-size: 16px;
        }

        h2 {
            font-size: 14px;
        }

        .section-header {
            background-color: #f9f9f9;
        }

        .wide-col {
            width: 15%;
        }

        .narrow-col {
            width: 10%;
        }

        .desc-col {
            width: 20%;
        }

        .title {
            padding: 5px;
        }

        .asses-table {
            margin-bottom: 20px;
        }
    </style>

</head>

<body>
    <div class="date-right">{{ date('Y-m-d') }}</div>
    <h1>Emergency Records</h1>
    {{-- <h2>between {{ $fromDate }} and {{ $toDate }}</h2> --}}
    @foreach ($emergencies as $emergency)
        <table>
            <thead>
                <tr>
                    <th class = "title" colspan="12">Emergency Details</th>
                </tr>
                <tr>
                    <th class="narrow-col">Date</th>
                    <th class="wide-col">Name</th>
                    <th class="wide-col">Location</th>
                    <th class="wide-col">Reporter Desc.</th>
                    <th class="wide-col">LAU ID</th>
                    <th class="desc-col">Medic Desc.</th>
                    <th class="narrow-col">Condition</th>
                    <th class="wide-col">History</th>
                    <th class="wide-col">Treatment Admin.</th>
                    <th class="narrow-col">Consultation</th>
                    <th class="wide-col">Equipment</th>
                    <th class="wide-col">Issues</th>
                </tr>
            </thead>
            <tbody>
                <tr>
                    <td>{{ $emergency->created_at ?? 'N/A' }}</td>
                    <td>{{ $emergency->patient_name }}</td>
                    <td>{{ $emergency->location ?? 'N/A' }}</td>
                    <td>{{ $emergency->reporter_description ?? 'N/A' }}</td>
                    <td>{{ $emergency->patient_lau_id ?? 'N/A' }}</td>
                    <td>{{ $emergency->medic_description ?? 'N/A' }}</td>
                    <td>{{ $emergency->patient_condition ?? 'N/A' }}</td>
                    <td>{{ $emergency->history ?? 'N/A' }}</td>
                    <td>{{ $emergency->treatment_administration ?? 'N/A' }}</td>
                    <td>{{ $emergency->consultation ?? 'N/A' }}</td>
                    <td>{{ $emergency->equipment ?? 'N/A' }}</td>
                    <td>{{ $emergency->issues ?? 'N/A' }}</td>
                </tr>
            </tbody>
        </table>
        @if (isset($assessments[$emergency->id]) && count($assessments[$emergency->id]) > 0)
            <table class = "asses-table">
                <thead>
                    <tr class="section-header">
                        <th class="title" colspan="10">Assessments</th>
                    </tr>
                    <tr>
                        <th class="narrow-col">#</th>
                        <th class="narrow-col">Date</th>
                        <th class="narrow-col">Heart Rate</th>
                        <th class="narrow-col">Blood Pressure</th>
                        <th class="narrow-col">Oxygen Saturation</th>
                        <th class="narrow-col">Temperature</th>
                        <th class="narrow-col">Respiration Rate</th>
                        <th class="narrow-col">Capillary Refill Time</th>
                        <th class="narrow-col">Hemoglucotest</th>
                        <th class="narrow-col">Pupils Reaction</th>
                    </tr>
                </thead>
                <tbody>
                    @php $count = 1; @endphp
                    @foreach ($assessments[$emergency->id] as $assessment)
                        <tr>
                            <td>{{ $count++ }}</td>
                            <td>{{ $assessment->created_at ?? 'N/A' }}</td>
                            <td>{{ $assessment->heart_rate ?? 'N/A' }}</td>
                            <td>{{ $assessment->blood_pressure ?? 'N/A' }}</td>
                            <td>{{ $assessment->oxygen_saturation ?? 'N/A' }}</td>
                            <td>{{ $assessment->temperature ?? 'N/A' }}</td>
                            <td>{{ $assessment->respiration_rate ?? 'N/A' }}</td>
                            <td>{{ $assessment->capillary_refill_time ?? 'N/A' }}</td>
                            <td>{{ $assessment->hemoglucotest ?? 'N/A' }}</td>
                            <td>{{ $assessment->pupils_reaction ?? 'N/A' }}</td>
                        </tr>
                    @endforeach
                </tbody>
            </table>
        @endif
    @endforeach

    <br>

</body>


</html>
