<?php

require '../connectDB.php';



                $query = $conn->prepare("SELECT 
                                        MAX(data_temp) AS maxtemp,
                                        MAX(data_hum) AS maxhumi,
                                        MAX(data_light) AS maxlight,
                                        MAX(data_water) AS maxwater,
                                        MAX(data_ph) AS maxPH
                                        FROM data_sensor WHERE data_time >= NOW() - INTERVAL '24 hours'");
                $query->execute();
                $data = $query->fetch(PDO::FETCH_ASSOC);

echo json_encode($data);
?>