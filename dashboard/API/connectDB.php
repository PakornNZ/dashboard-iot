<?php

ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);

$dotenv = parse_ini_file(__DIR__ . '/.env');

header("Access-Control-Allow-Origin: http://172.25.11.118");
header("Content-Type: application/json; charset=UTF-8");

$host = $dotenv['HOST'];
$port = $dotenv['PORT'];
$dbname = $dotenv['DBNAME'];
$user = $dotenv['USER'];
$password = $dotenv['PASSWORD'];

$pdo = "pgsql:host=$host;port=$port;dbname=$dbname;";
$conn = new PDO($pdo, $user, $password, [PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION]);

?>