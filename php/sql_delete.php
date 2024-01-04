<?php
$data = json_decode(file_get_contents("php://input"), true);
$db = new SQLite3('../data.db');
deleteRecord($db, $data);

function deleteRecord($db, $data) {
    $record_id = $data["record_id"];
    $deleteRecordsSQL = $db->prepare("DELETE FROM records WHERE record_id = :record_id");
    $deleteRecordsSQL->bindParam(':record_id', $record_id);
    $result = $deleteRecordsSQL->execute();
    if ($result) {
        $response = array("title" => "Record deleted successfully");
    } else {
        $response = array("title" => "Failed to delete record");
    }
    $deleteRecordsSQL->close();
    header('Content-Type: application/json');
    echo json_encode($response);
}
?>