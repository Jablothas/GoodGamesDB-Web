<?php
if($rtyp == "playtime") {
    // *******************************************************************************
    // Variables
    // Absolute paths to steam api          -> /f file; /p path
    // *******************************************************************************
    $pGameLst = "http://api.steampowered.com/ISteamApps/GetAppList/v0002/?key=STEAMKEY&format=json";
    $pProfile = "https://api.steampowered.com/IPlayerService/GetOwnedGames/v0001/" .
    "?key=7BBA04785020E53FF7BE2129FFFD1B64&steamid=76561198064631353&format=json";
    $fProfile = "profile.json";
    $fGameLst = "games.json";
    $playtime = 0; // return value
    $appid = 0;
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
    if($appid == 0 || $appid == null) $appid = findAppid($game, $games_json);
    // get playtime finally
    $playtime = getPlaytime($appid, $profile_json);
    // print $playtime;
    $output = $playtime . "-" . $appid;
    //print $output;
    echo json_encode($output);
}


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
?>