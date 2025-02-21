<?php

require '../connectDB.php';

$data = json_decode(file_get_contents("php://input"), true);

if ($data) {
    $temp = $data['temp'] ?? null;
    $hum = $data['hum'] ?? null;
    $light = $data['light'] ?? null;
    $wt = $data['flow'] ?? null;
    $pH = $data['pH'] ?? null;
    $dht = $data['statusDHT'];
    $relay = $data['statusRL'];
    $ldr = $data['statusLDR'];
    $water = $data['statusWT'];
    $flow = $data['statusFlow'];
    $pHss = $data['statusPH'];

    try {
        $conn->beginTransaction();

        $query = $conn->prepare("INSERT INTO data_sensor (data_temp, data_hum, data_light, data_water, data_ph) VALUES (:temp, :hum, :light, :wt, :pH)");
        $query->bindValue(':temp', $temp, is_null($temp) ? PDO::PARAM_NULL : PDO::PARAM_STR);
        $query->bindValue(':hum', $hum, is_null($hum) ? PDO::PARAM_NULL : PDO::PARAM_STR);
        $query->bindValue(':light', $light, is_null($light) ? PDO::PARAM_NULL : PDO::PARAM_INT);
        $query->bindValue(':wt', $wt, is_null($wt) ? PDO::PARAM_NULL : PDO::PARAM_STR);
        $query->bindValue(':pH', $pH, is_null($pH) ? PDO::PARAM_NULL : PDO::PARAM_STR);
        $query->execute();

        $query = $conn->prepare("UPDATE sensor_control 
                                SET sensor_status = :dht 
                                WHERE sensor_id = 3");
        $query->bindValue(':dht', (int)$dht, PDO::PARAM_BOOL);
        $query->execute();
        
        $query = $conn->prepare("UPDATE sensor_control
                                SET sensor_status = :relay 
                                WHERE sensor_id = 4");
        $query->bindValue(':relay', (int)$relay, PDO::PARAM_BOOL);
        $query->execute();

        $query = $conn->prepare("UPDATE sensor_control
                                SET sensor_status = :ldr
                                WHERE sensor_id = 5");
        $query->bindValue(':ldr', (int)$ldr, PDO::PARAM_BOOL);
        $query->execute();

        $query = $conn->prepare("UPDATE sensor_control
                                SET sensor_status = :water
                                WHERE sensor_id = 6");
        $query->bindValue(':water', (int)$water, PDO::PARAM_BOOL);
        $query->execute();

        $query = $conn->prepare("UPDATE sensor_control
                                SET sensor_status = :flow
                                WHERE sensor_id = 7");
        $query->bindValue(':flow', (int)$flow, PDO::PARAM_BOOL);
        $query->execute();

        $query = $conn->prepare("UPDATE sensor_control
                                SET sensor_status = :pHss
                                WHERE sensor_id = 8");
        $query->bindValue(':pHss', (int)$pHss, PDO::PARAM_BOOL);
        $query->execute();
        
        $conn->commit();
        echo json_encode(["status" => "success"]);
    } catch (Exception $e) {
        $conn->rollBack();
        echo json_encode(["status" => "error", "message" => $e->getMessage()]);
    }
} else {
    echo json_encode(["status" => "error", "message" => "Invalid JSON input"]);
}
?>