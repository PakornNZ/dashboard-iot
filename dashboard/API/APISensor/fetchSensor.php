<?php

require '../connectDB.php';

if ($_SERVER["REQUEST_METHOD"] == "POST") {
    $data = json_decode(file_get_contents('php://input'), true);
    if (!$data) {
        echo json_encode(["status" => "error", "message" => "Invalid JSON input", "rawData" => $rawData]);
        exit;
    }
    $sensor = $data["sensor"];
    $status = $data["status"];
    
    $query = $conn->prepare("UPDATE sensor_control 
                            SET sensor_status = :status
                            WHERE sensor_name = :sensor");
    $query->bindValue(':sensor', $sensor, PDO::PARAM_STR);
    $query->bindValue(':status', (int)$status, PDO::PARAM_BOOL);

    if ($query->execute()) {
        echo json_encode(["status" => "success", "sensor" => $sensor, "status" => (bool)$status]);
    } else {
        echo json_encode(["status" => "error", "message" => "Failed to insert data"]);
    }
} else if ($_SERVER["REQUEST_METHOD"] == "GET") {
    $query = $conn->prepare("SELECT sensor_name, sensor_status FROM sensor_control ORDER BY sensor_id ASC");
    $query->execute();
    $result = $query->fetchAll(PDO::FETCH_ASSOC);

    $query = $conn->prepare("SELECT control FROM control");
    $query->execute();
    $resultValue = $query->fetch(PDO::FETCH_ASSOC);

    if ($result) {
        $response = [
            "led1" => [
                "status" => (bool)$result[0]['sensor_status'] ?? false
            ],
            "led2" => [
                "status" => (bool)$result[1]['sensor_status'] ?? false
            ],
            "dht" => [
                "status" => (bool)$result[2]['sensor_status'] ?? false
            ],
            "fan" => [
                "status" => (bool)$result[3]['sensor_status'] ?? false,
                "value" => $resultValue['control']
            ],
            "ldr" => [
                "status" => (bool)$result[4]['sensor_status'] ?? false
            ],
            "water" => [
                "status" => (bool)$result[5]['sensor_status'] ?? false
            ],
            "flow" => [
                "status" => (bool)$result[6]['sensor_status'] ?? false
            ],
            "ph" => [
                "status" => (bool)$result[7]['sensor_status'] ?? false
            ]
        ];
        echo json_encode($response);
    } else {
        echo json_encode([
            "led1" => [
                "status" => false
            ],
            "led2" => [
                "status" => false
            ],
            "dht" => [
                "status" => false
            ],
            "fan" => [
                "status" => false,
                "value" => $resultValue['control']
            ],
            "ldr" => [
                "status" => false
            ],
            "water" => [
                "status" => false
            ],
            "flow" => [
                "status" => false
            ],
            "ph" => [
                "status" => false
            ]
        ]);
    }
} else {
    echo json_encode(["error" => "Invalid Request"]);
}
?>