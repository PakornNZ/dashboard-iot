<?php
session_start();

if (isset($_SESSION['userID'])) {
    echo json_encode(['status' => 1]);
} else {
    echo json_encode(['status' => 0]);
}
?>