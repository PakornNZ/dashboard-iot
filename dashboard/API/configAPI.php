<?php
header('Content-Type: text/javascript');

$dotenv = parse_ini_file(__DIR__ . '/.env');

$API_IP = $dotenv['API_IP'];
$API_PATH = $dotenv['API_PATH'];

echo "const API_BASE_URL = '$API_IP$API_PATH';";
?>