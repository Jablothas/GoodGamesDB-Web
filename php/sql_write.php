<?php
// Retrieve data from the POST request
$data = json_decode(file_get_contents("php://input"), true);
$db = new SQLite3('../data.db');
insert_new($db, $data);

function insert_new($db, $data) {
    // Extract data from the input array
    $record_id = $data["record_id"];
    $score_id = $data["score_id"];
    $cover = $data['cover'];
    $title = $data['title'];
    // $title = str_replace("'", "´", $title); !!! MAYBE NEEDED SOMEDAY CAUSE OF SQL ERROR
    $locationName = $data['location'];  // Assuming you have location name in the data
    $replay = strtoupper($data['replay']);
    $status = strtoupper($data['status']);
    $steamAppid = $data['steamAppid'];
    $date_start = $data['date_start'];
    if($data['date_end'] == null || '') {
        $date_end = "9999-01-01";
    }
    else {
        $date_end = $data['date_end'];
    }
    $playtime = $data['playtime'];
    $note = $data['note'];
    $gameplay = $data['gameplay'];
    $presentation = $data['presentation'];
    $narrative = $data['narrative'];
    $quality = $data['quality'];
    $sound = $data['sound'];
    $content = $data['content'];
    $pacing = $data['pacing'];
    $balance = $data['balance'];
    $ui_ux = $data['ui_ux'];
    $impression = $data['impression'];
    if($status == "PLAYING") {
        $sum = 0;
    }
    else {
        $sum = $data['sum'];
    }
    

    // Prepare SQL statement for insertion into the score table
    $insertScoreSQL = $db->prepare("
        INSERT INTO score (
            name,
            gameplay,
            presentation,
            narrative,
            quality,
            sound,
            content,
            pacing,
            balance,
            ui_ux,
            impression,
            sum_target,
            sum_total
        ) VALUES (
            :score_name,
            :gameplay,
            :presentation,
            :narrative,
            :quality,
            :sound,
            :content,
            :pacing,
            :balance,
            :ui_ux,
            :impression,
            :sum_target,
            :sum_total
        )
    ");

    // Bind parameters for score table
    $insertScoreSQL->bindParam(':score_name', $title);
    $insertScoreSQL->bindParam(':gameplay', $gameplay);
    $insertScoreSQL->bindParam(':presentation', $presentation);
    $insertScoreSQL->bindParam(':narrative', $narrative);
    $insertScoreSQL->bindParam(':quality', $quality);
    $insertScoreSQL->bindParam(':sound', $sound);
    $insertScoreSQL->bindParam(':content', $content);
    $insertScoreSQL->bindParam(':pacing', $pacing);
    $insertScoreSQL->bindParam(':balance', $balance);
    $insertScoreSQL->bindParam(':ui_ux', $ui_ux);
    $insertScoreSQL->bindParam(':impression', $impression);
    $insertScoreSQL->bindValue(':sum_target', 100); // sum_target is always 100
    $insertScoreSQL->bindParam(':sum_total', $sum);

    // Execute the SQL statement for score table
    $insertScoreSQL->execute();

    // Retrieve the last inserted row ID from the score table
    $scoreID = $db->lastInsertRowID();

    // Retrieve location_id from the locations table
    $locationID = getLocationID($db, $locationName);

    // Prepare SQL statement for insertion into the records table
    $insertRecordsSQL = $db->prepare("
        INSERT INTO records (
            name, 
            location, 
            type,
            date_start, 
            date_end,
            playtime,
            steam_appid,
            score,
            cover_img_path,
            note,
            status,
            replay
        ) VALUES (
            :title,
            :location,
            :type,
            :date_start,
            :date_end,
            :playtime,
            :steam_appid,
            :score,
            :cover,
            :note,
            :status,
            :replay
        )
    ");

    // Bind parameters for records table (including the retrieved score ID and location ID)
    $insertRecordsSQL->bindParam(':title', $title);
    $insertRecordsSQL->bindParam(':location', $locationID);
    $insertRecordsSQL->bindValue(':type', "FULL");
    $insertRecordsSQL->bindParam(':date_start', $date_start);
    $insertRecordsSQL->bindParam(':date_end', $date_end);
    $insertRecordsSQL->bindParam(':playtime', $playtime);
    $insertRecordsSQL->bindParam(':steam_appid', $steamAppid);
    $insertRecordsSQL->bindParam(':score', $scoreID);  // Use the retrieved score ID
    $insertRecordsSQL->bindParam(':cover', $cover);
    $insertRecordsSQL->bindParam(':note', $note);
    $insertRecordsSQL->bindParam(':status', $status);
    $insertRecordsSQL->bindParam(':replay', $replay);

    // Execute the SQL statement for records table
    $insertRecordsSQL->execute();

    // Close the statements to free up resources
    $insertScoreSQL->close();
    $insertRecordsSQL->close();

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