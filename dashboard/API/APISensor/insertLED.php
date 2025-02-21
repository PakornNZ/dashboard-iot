<?php

require '../connectDB.php';


if ($_SERVER["REQUEST_METHOD"] == "POST") {
    $data = json_decode(file_get_contents('php://input'), true);
    $state = $data['state'];
    $query = $conn->prepare("UPDATE sensor_control 
                            SET sensor_status = :state
                            WHERE sensor_id IN (1,2)");
    $query->bindValue(':state', $state, PDO::PARAM_STR);

    if ($query->execute()) {
        echo json_encode(["status" => "success"]);
    } else {
        echo json_encode(["status" => "error", "message" => "Failed to insert data"]);
    }
}
?>