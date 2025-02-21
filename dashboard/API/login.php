<?php
session_start();

require 'connectDB.php';

$response = ['status' => 'failed'];

if ($_SERVER["REQUEST_METHOD"] == "POST") {
    $username = $_POST['username'];
    $password = $_POST['password'];

    $query = $conn->prepare("SELECT * FROM users WHERE user_name = :username");
    $query->bindParam(':username', $username, PDO::PARAM_STR);
    $query->execute();
    $user = $query->fetch(PDO::FETCH_ASSOC);

    if ($user) {
        if ($password == $user['user_password']) {
            $_SESSION['userID'] = $user['user_id'];
            $response['status'] = 'success';
        }
    }
}

echo json_encode($response);
?>