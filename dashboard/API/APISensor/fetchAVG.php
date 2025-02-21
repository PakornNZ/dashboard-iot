<?php

require '../connectDB.php';



                $query = $conn->prepare("WITH hours AS (
                                            SELECT generate_series(
                                            DATE_TRUNC('hour', NOW()) - INTERVAL '23 hours',
                                            DATE_TRUNC('hour', NOW()),
                                            INTERVAL '1 hour'
                                            ) AS hour
                                        )
                                        SELECT 
                                            h.hour, 
                                            ROUND(COALESCE(AVG(s.data_temp), NULL), 1) AS avg_temp,
                                            ROUND(COALESCE(AVG(s.data_hum), NULL), 1) AS avg_hum,
                                            ROUND(COALESCE(AVG(s.data_light), NULL), 1) AS avg_light,
                                            ROUND(COALESCE(AVG(s.data_water), NULL), 1) AS avg_water,
                                            ROUND(COALESCE(AVG(s.data_ph), NULL), 1) AS avg_ph
                                        FROM hours h
                                        LEFT JOIN public.data_sensor s 
                                            ON DATE_TRUNC('hour', s.data_time) = h.hour
                                        WHERE s.data_time >= NOW() - INTERVAL '24 hours' OR s.data_time IS NULL
                                        GROUP BY h.hour
                                        ORDER BY h.hour");
                $query->execute();
                $data = $query->fetchAll(PDO::FETCH_ASSOC);

echo json_encode($data);
?>