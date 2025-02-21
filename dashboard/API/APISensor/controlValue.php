<?php

require '../connectDB.php';

if ($_SERVER["REQUEST_METHOD"] == "POST") {
    $data = json_decode(file_get_contents('php://input'), true);
    $fan = $data['fan'];

    $query = $conn->prepare("UPDATE control SET control = :fan WHERE control_id = 1");
    $query->bindValue(':fan', $fan, PDO::PARAM_INT);

    if ($query->execute()) {
        echo json_encode(["status" => "success", "fan" => $fan]);
    } else {
        echo json_encode(["status" => "error", "message" => "Failed to update data"]);
    }
} else {
    echo json_encode(["error" => "Not Have Insert."]);
}
?>