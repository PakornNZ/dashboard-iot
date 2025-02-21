<?php

require '../connectDB.php';

$query = $conn->prepare("SELECT * FROM data_sensor ORDER BY data_time DESC LIMIT 1");
$query->execute();
$data = $query->fetch(PDO::FETCH_ASSOC);

if ($data) {
    $time1 = new DateTime($data['data_time']);
    $dataTime = $time1->format('H:i:s');
    $dataDate = $time1->format('d-m-Y');

    $response = [
        "temp" => isset($data['data_temp']) ? (float)$data['data_temp'] : null,
        "hum" => isset($data['data_hum']) ? (float)$data['data_hum'] : null,
        "light" => isset($data['data_light']) ? (int)$data['data_light'] : null,
        "water" => isset($data['data_water']) ? (float)$data['data_water'] : null,
        "ph" => isset($data['data_ph']) ? (float)$data['data_ph'] : null,
        "dateTime" => [
            "time" => $dataTime,
            "date" => $dataDate
        ]
    ];
    echo json_encode($response);
    
}
?>