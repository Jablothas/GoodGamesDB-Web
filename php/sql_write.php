<?php
// Retrieve data from the POST request
$data = json_decode(file_get_contents("php://input"), true);

// Access the variables from the data object
$cover = $data['cover'];
$title = $data['title'];
$location = $data['location'];
$replay = $data['replay'];
$status = $data['status'];
$steamAppid = $data['steamAppid'];
$date_start = $data['date_start'];
$date_end = $data['date_end'];
$playtime = $data['playtime'];
$note = $data['note'];
$gameplay = $data['gameplay'];
$narrative = $data['narrative'];
$quality = $data['quality'];
$sound = $data['sound'];
$content = $data['content'];
$pacing = $data['pacing'];
$balance = $data['balance'];
$ui_ux = $data['ui_ux'];
$impression = $data['impression'];
$sum = $data['sum'];

// Perform operations with the received data, for example, store it in a database
// ...

// Send a response back to the client (if needed)
echo "Data received successfully. Sum is "  . $sum;
?>