<?php
// Retrieve data from the POST request
$data = json_decode(file_get_contents("php://input"), true);
$db = new SQLite3('../data.db');
updateData($db, $data);

function updateData($db, $data) {
    // Extract data from the input array
    $record_id = $data["record_id"];
    $score_id = $data["score_id"];
    $cover = $data['cover'];
    $title = $data['title'];
    $locationName = $data['location'];  // Assuming you have location name in the data
    $replay = strtoupper($data['replay']);
    $status = strtoupper($data['status']);
    $steamAppid = $data['steamAppid'];
    $date_start = $data['date_start'];
    if ($data['date_end'] == null || '') {
        $date_end = "9999-01-01";
    } else {
        $date_end = $data['date_end'];
    }
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
    if ($status == "PLAYING") {
        $sum = 0;
    } else {
        $sum = $data['sum'];
    }

    // Update SQL statement for the score table
    $updateScoreSQL = $db->prepare("
        UPDATE score 
        SET 
            name = :score_name,
            gameplay = :gameplay,
            presentation = :presentation,
            narrative = :narrative,
            quality = :quality,
            sound = :sound,
            content = :content,
            pacing = :pacing,
            balance = :balance,
            ui_ux = :ui_ux,
            impression = :impression,
            sum_target = :sum_target,
            sum_total = :sum_total
        WHERE score_id = :score_id
    ");

    // Bind parameters for score table
    $updateScoreSQL->bindParam(':score_name', $title);
    $updateScoreSQL->bindParam(':gameplay', $gameplay);
    $updateScoreSQL->bindParam(':presentation', $narrative);
    $updateScoreSQL->bindParam(':narrative', $narrative);
    $updateScoreSQL->bindParam(':quality', $quality);
    $updateScoreSQL->bindParam(':sound', $sound);
    $updateScoreSQL->bindParam(':content', $content);
    $updateScoreSQL->bindParam(':pacing', $pacing);
    $updateScoreSQL->bindParam(':balance', $balance);
    $updateScoreSQL->bindParam(':ui_ux', $ui_ux);
    $updateScoreSQL->bindParam(':impression', $impression);
    $updateScoreSQL->bindValue(':sum_target', 100); // sum_target is always 100
    $updateScoreSQL->bindParam(':sum_total', $sum);
    $updateScoreSQL->bindParam(':score_id', $score_id);

    // Execute the SQL statement for score table
    $updateScoreSQL->execute();

    // Update SQL statement for the records table
    $updateRecordsSQL = $db->prepare("
        UPDATE records 
        SET 
            name = :title,
            location = :location,
            type = :type,
            date_start = :date_start,
            date_end = :date_end,
            playtime = :playtime,
            steam_appid = :steam_appid,
            score = :score,
            cover_img_path = :cover,
            note = :note,
            status = :status,
            replay = :replay
        WHERE record_id = :record_id
    ");

    // Retrieve location_id from the locations table
    $locationID = getLocationID($db, $locationName);

    // Bind parameters for records table (including the retrieved score ID and location ID)
    $updateRecordsSQL->bindParam(':title', $title);
    $updateRecordsSQL->bindParam(':location', $locationID);
    $updateRecordsSQL->bindValue(':type', "FULL");
    $updateRecordsSQL->bindParam(':date_start', $date_start);
    $updateRecordsSQL->bindParam(':date_end', $date_end);
    $updateRecordsSQL->bindParam(':playtime', $playtime);
    $updateRecordsSQL->bindParam(':steam_appid', $steamAppid);
    $updateRecordsSQL->bindParam(':score', $score_id);  // Use the retrieved score ID
    $updateRecordsSQL->bindParam(':cover', $cover);
    $updateRecordsSQL->bindParam(':note', $note);
    $updateRecordsSQL->bindParam(':status', $status);
    $updateRecordsSQL->bindParam(':replay', $replay);
    $updateRecordsSQL->bindParam(':record_id', $record_id);

    // Execute the SQL statement for records table
    $updateRecordsSQL->execute();

    // Close the statements to free up resources
    $updateScoreSQL->close();
    $updateRecordsSQL->close();

    echo "Operation should be successful!";
}

// Function to retrieve location_id based on location name
function getLocationID($db, $locationName) {
    $stmt = $db->prepare("SELECT location_id FROM locations WHERE name = :name");
    $stmt->bindParam(':name', $locationName);
    $result = $stmt->execute();
    $row = $result->fetchArray(SQLITE3_ASSOC);
    $locationID = $row['location_id'];
    $stmt->close();
    return $locationID;
}
?>