<?php

header("Content-Type: application/json");
$dotenv = parse_ini_file(__DIR__ . '/.env');

$API_PATH = $dotenv['API_PATH'];

echo json_encode($API_PATH);

?>