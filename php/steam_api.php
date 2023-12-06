<?php
// *******************************************************************************
// Variables
// Absolute paths to steam api          -> /f file; /p path
// *******************************************************************************
$game = "";
$pGameLst = "http://api.steampowered.com/ISteamApps/GetAppList/v0002/?key=STEAMKEY&format=json";
$pProfile = "https://api.steampowered.com/IPlayerService/GetOwnedGames/v0001/" .
"?key=7BBA04785020E53FF7BE2129FFFD1B64&steamid=76561198064631353&format=json";
$fProfile = "profile.json";
$fGameLst = "games.json";
$playtime = 0; // return value
$appid = 0;

if(isset($_GET['data1'])) {
    // Retrieve the value of the 'data1' parameter
    $game = $_GET['data1'];
}


// *******************************************************************************
// Prepare data if not exist
// *******************************************************************************
// Download profile file from steam to local
if(file_exists($fProfile)) {
    //echo $fProfile . " already exists <br>";
} 
else {
    file_put_contents($fProfile,file_get_contents($pProfile));
    //echo $fProfile . " created. <br>";
}

// Download games file from steam to local
if(file_exists($fGameLst)) {
    //echo $fGameLst . " already exists <br>";
}
else {
    file_put_contents($fGameLst,file_get_contents($pGameLst));
    //echo $fGameLst .  " created. <br>";
}
// *******************************************************************************
// Build obj list of all games played
// *******************************************************************************
$profile_json = file_get_contents($fProfile);
$games_json = file_get_contents($fGameLst);
// if there isn't an appid in the database already, we need to find it first
writeToLog("function findAppid(): appid:" . $appid . " | game: " . $game . "");
if($appid == 0 || $appid == null) $appid = findAppid($game, $games_json);
// get playtime finally
$playtime = getPlaytime($appid, $profile_json);
// print $playtime;
$output = "playtime: " . $playtime . " | appid: " . $appid . " | name of game: " . $game;
//print $output;
echo json_encode($output);

// Additional support-functions: ----------------------------------------<

// *******************************************************************************
// Find the correct appid from game title
// *******************************************************************************
function findAppid($name, $json) {
    $appid = "";
    $data = json_decode($json, true);
    // Parse through json array
    $applist = $data["applist"];
    $apps = $applist["apps"];
    $i = 0;
    foreach($apps as $app) {
        if($app["name"] == $name) {
            writeToLog("app-loop(): appid:" . $app["appid"]);
            $appid = $app["appid"];
            break;
        }
        $i++;
    }
    return $appid;
}

// *******************************************************************************
// Find the playtime by searching for appid
// *******************************************************************************
function getPlaytime($appid, $json) {
    $playtime = 0;
    $data = json_decode($json, true);
    $response = $data["response"];
    $games = $response["games"];
    //print_r($games);
    $i = 0;
    foreach($games as $game) {
        if ($game["appid"] == $appid) {
            $playtime = intval($game['playtime_forever']);
        }
        $i += 1;
    }
    return intval($playtime / 60);
}

function getAllProfileGames() {
    $myfile = fopen("gameslst.txt", "a"); 
    $games_json = file_get_contents("games.json");
    $profile_json = file_get_contents("profile.json");
  
    // enconde games_json
    $data = json_decode($games_json, true);
    $applist = $data["applist"];
    $apps = $applist["apps"];
  
    // encode profile_json
    $data = json_decode($profile_json, true);
    $response = $data["response"];
    $games = $response["games"];
  
    // find for each appid the game and store in gameslst.txt
    foreach($games as $game) {
      foreach($apps as $app) {
        if($app["appid"] == $game["appid"]) {
          fwrite($myfile, $app["name"] . "\n");
        }
      }
    }
  }

function writeToLog($message) {
    $logFile = 'php_log.txt';
    $logEntry = date('[Y-m-d H:i:s]') . ' ' . $message . PHP_EOL;
    $file = fopen($logFile, 'a');
    fwrite($file, $logEntry);
    // Close the file
    fclose($file);
}


?>

