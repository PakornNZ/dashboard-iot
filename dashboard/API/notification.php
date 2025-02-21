<?php

use PHPMailer\PHPMailer\PHPMailer;
use PHPMailer\PHPMailer\Exception;

require_once __DIR__ . '/vendor/autoload.php';
require 'connectDB.php';
$dotenv = parse_ini_file(__DIR__ . '/.env');

if ($_SERVER["REQUEST_METHOD"] == "POST") {
    $data = json_decode(file_get_contents('php://input'), true);
    $dht = $data['dht'];
    $ldr = $data['ldr'];
    $water = $data['water'];
    $flow = $data['flow'];
    $lit = number_format($data['lit'], 2);
    $pH = $data['ph'];
    $pH_v = number_format($data['ph_v'], 2);
    $temp = $data['temp'];


                        $query = $conn->prepare("SELECT sensor_id, notic_status FROM notification ORDER BY notic_id ASC");
                        $query->execute();
                        $result = $query->fetchAll(PDO::FETCH_ASSOC);


    if ($dht === false && $result[0]['notic_status'] === false) {
        $sendDHT = true;
        $query = $conn->prepare("UPDATE notification 
                                SET previous_time = notic_time,
                                    notic_time = CURRENT_TIMESTAMP,
                                    notic_status = TRUE
                                WHERE notic_id IN (1, 7)");
        $query->execute();
    } else {
        $sendDHT = false;
        if ($dht === true && $result[0]['notic_status'] === true) {
            $query = $conn->prepare("UPDATE notification 
                                    SET previous_time = notic_time,
                                        notic_time = CURRENT_TIMESTAMP,
                                        notic_status = FALSE
                                    WHERE notic_id = 1");
            $query->execute();
        }
    }

    if ($ldr === false && $result[1]['notic_status'] === false) {
        $sendLDR = true;
        $query = $conn->prepare("UPDATE notification 
                                SET previous_time = notic_time,
                                    notic_time = CURRENT_TIMESTAMP,
                                    notic_status = TRUE
                                WHERE notic_id = 2");
        $query->execute();
    } else {
        $sendLDR = false;
        if ($ldr === true && $result[1]['notic_status'] === true) {
            $query = $conn->prepare("UPDATE notification 
                                    SET previous_time = notic_time,
                                        notic_time = CURRENT_TIMESTAMP,
                                        notic_status = FALSE
                                    WHERE notic_id = 2");
            $query->execute();
        }
    }

    if ($water === false && $result[2]['notic_status'] === false) {
        $sendWATER = true;
        $query = $conn->prepare("UPDATE notification 
                                SET previous_time = notic_time,
                                    notic_time = CURRENT_TIMESTAMP,
                                    notic_status = TRUE
                                WHERE notic_id IN (3, 4)");
        $query->execute();
    } else {
        $sendWATER = false;
        if ($water === true && $result[2]['notic_status'] === true) {
            $query = $conn->prepare("UPDATE notification 
                                    SET previous_time = notic_time,
                                        notic_time = CURRENT_TIMESTAMP,
                                        notic_status = FALSE
                                    WHERE notic_id = 3");
            $query->execute();
        }
    }

    if ($flow === false && $result[3]['notic_status'] === false) {
        $sendFLOW = true;
        $query = $conn->prepare("UPDATE notification 
                                SET previous_time = notic_time,
                                    notic_time = CURRENT_TIMESTAMP,
                                    notic_status = TRUE
                                WHERE notic_id = 4");
        $query->execute();
    } else {
        $sendFLOW = false;
        if ($flow === true && $result[3]['notic_status'] === true) {
            $query = $conn->prepare("UPDATE notification 
                                    SET previous_time = notic_time,
                                        notic_time = CURRENT_TIMESTAMP,
                                        notic_status = FALSE
                                    WHERE notic_id = 4");
            $query->execute();
        }
    }

    if ($pH === false && $result[4]['notic_status'] === false) {
        $sendph = true;
        $query = $conn->prepare("UPDATE notification 
                                SET previous_time = notic_time,
                                    notic_time = CURRENT_TIMESTAMP,
                                    notic_status = TRUE
                                WHERE notic_id IN (5, 6)");
        $query->execute();
    } else {
        $sendph = false;
        if ($pH === true && $result[4]['notic_status'] === true) {
            $query = $conn->prepare("UPDATE notification 
                                    SET previous_time = notic_time,
                                        notic_time = CURRENT_TIMESTAMP,
                                        notic_status = FALSE
                                    WHERE notic_id = 5");
            $query->execute();
        }
    }

    if (!($pH_v > 5 && $pH_v < 9) && $pH && $result[5]['notic_status'] === false) {
        $sendph_v = true;
        $query = $conn->prepare("UPDATE notification 
                                SET previous_time = notic_time,
                                    notic_time = CURRENT_TIMESTAMP,
                                    notic_status = TRUE
                                WHERE notic_id = 6");
        $query->execute();
    } else {
        $sendph_v = false;
        if (($pH_v > 5 && $pH_v < 9) && $result[5]['notic_status'] === true) {
            $query = $conn->prepare("UPDATE notification 
                                    SET previous_time = notic_time,
                                        notic_time = CURRENT_TIMESTAMP,
                                        notic_status = FALSE
                                    WHERE notic_id = 6");
            $query->execute();
        }
    }

    if ($temp > 40 && $result[6]['notic_status'] === false) {
        $sendTemp = true;
        $query = $conn->prepare("UPDATE notification 
                                SET previous_time = notic_time,
                                    notic_time = CURRENT_TIMESTAMP,
                                    notic_status = TRUE
                                WHERE notic_id = 7");
        $query->execute();
    } else {
        $sendTemp = false;
        if ($temp < 30 && $result[6]['notic_status'] === true) {
            $query = $conn->prepare("UPDATE notification 
                                    SET previous_time = notic_time,
                                        notic_time = CURRENT_TIMESTAMP,
                                        notic_status = FALSE
                                    WHERE notic_id = 7");
            $query->execute();
        }
    }

    if ($sendDHT || $sendLDR || $sendWATER || $sendFLOW || $sendTemp || $sendph || $sendph_v) {
        try {
            $mail = new PHPMailer(true);
            $mail->isSMTP();
            $mail->Host = 'smtp.gmail.com';
            $mail->SMTPAuth = true;
            $mail->SMTPSecure = PHPMailer::ENCRYPTION_SMTPS;
            $mail->Port = 465;
            $mail->Username = $dotenv['EMAIL_USER'];
            $mail->Password = $dotenv['EMAIL_PASS'];
            $mail->setFrom('pakorn.sk@rmuti.ac.th', 'NAF Dashboard');
            $mail->CharSet = 'UTF-8';

            $mail->isHTML(true);
            $mail->addAddress('pakornnz005@gmail.com');
            $mail->addAddress('jetsada.sc@rmuti.ac.th');
            $mail->addAddress('nattawat.pg@rmuti.ac.th');

            $mail->Subject = 'ตรวจพบความผิดปกติจากโรงเรือน';
            $mail->Body = '
                <div style="font-family: Kanit light; padding: 20px; border-radius: 10px; background: #f4f4f4;">
                    <h2 style="color: white; background-color: #6f9bcb; padding: 10px; text-align: center; border-radius: 5px;">
                        พบความผิดปกติ!!
                    </h2>
                    <br>';
            
            if ($sendDHT) {
                $mail->Body .= '
                    <div style="color: #ff6161; font-size: 22px; font-weight: bold; margin-bottom: 10px;">
                        🔴 เซ็นเซอร์วัดอุณหภูมิและความชื้นไม่ทำงาน
                    </div>';
            }
            
            if ($sendTemp) {
                $mail->Body .= '
                    <div style="color: #ff6161; font-size: 22px; font-weight: bold; margin-bottom: 10px;">
                        🔴 อุณหภูมิเกิน อาจเกิดเพลิงไหม้
                    </div>
                    <div style="color:#ff6161; font-weight:bold; text-align:center; margin-top:10px; background-color: #eaeaea; padding:20px; border-radius:10px;">
                        <span style="font-size: 80px; margin: 0;">' . $temp . ' </span>
                        <span style="font-size: 25px; margin: 0;">°C</span>
                    </div>';
            }

            if ($sendLDR) {
                $mail->Body .= '
                    <div style="color: #ff6161; font-size: 22px; font-weight: bold; margin-bottom: 10px;">
                        🔴 เซ็นเซอร์วัดแสงไม่ทำงาน
                    </div>';
            }
            
            if ($sendWATER) {
                $mail->Body .= '
                    <div style="color: #ff6161; font-size: 22px; font-weight: bold; margin-bottom: 10px;">
                        🔴 เซ็นเซอร์วัดการไหลของน้ำไม่ทำงาน
                    </div>';
            }

            if ($sendFLOW) {
                $mail->Body .= '
                    <div style="color: #ff6161; font-size: 22px; font-weight: bold; margin-bottom: 10px;">
                        🔴 พบการรั่วของน้ำ
                    </div>
                    <div style="color:#ff6161; font-weight:bold; text-align:center; margin-top:10px; background-color: #eaeaea; padding:20px; border-radius:10px;">
                        <span style="font-size: 80px; margin: 0;">' . $lit . ' </span>
                        <span style="font-size: 25px; margin: 0;">L/min</span>
                    </div>';
            }

            if ($sendph) {
                $mail->Body .= '
                    <div style="color: #ff6161; font-size: 22px; font-weight: bold; margin-bottom: 10px;">
                        🔴 เซ็นเซอร์วัดค่า pH ไม่ทำงาน
                    </div>';
            }
            
            if ($sendph_v) {
                $mail->Body .= '
                    <div style="color: #ff6161; font-size: 22px; font-weight: bold; margin-bottom: 10px;">
                        🔴 ค่า pH ไม่ได้ตามมาตรฐาน
                    </div>
                    <div style="color:#ff6161; font-weight:bold; text-align:center; margin-top:10px; background-color: #eaeaea; padding:20px; border-radius:10px;">
                        <span style="font-size: 80px; margin: 0;">' . $pH_v . ' </span>
                        <span style="font-size: 25px; margin: 0;">pH</span>
                    </div>';
            }

            $mail->Body .= '</div>';
            $mail->send();
            echo json_encode(["status" => "success"]);
        } catch (Exception $e) {
            echo json_encode(["error" => "Mailer Error: " . $mail->ErrorInfo]);
        }
    } else {
        echo json_encode([["status" => "update"]]);
    }
} else {
    echo json_encode(["error" => "Invalid Request"]);
}

?>