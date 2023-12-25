<?php
include_once 'php/session_manager.php';

// Check if the form is submitted
if ($_SERVER["REQUEST_METHOD"] == "POST") {
    $submittedPassword = $_POST["password"];

    if (authenticateUser($submittedPassword)) {
        header("Location: main.php");
        exit;
    } else {
        $errorMessage = "Incorrect password. Please try again.";
    }
}
?>

<!DOCTYPE html>
<html>
<head>
<link rel="icon" type="image/x-icon" href="img/favicon.ico" />
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>GoodGamesDB Web</title>
<link rel="stylesheet" href="css/submit.css">
</head>
<body>
    <div>
        <br><br><img src="img/logo-big.png" style="vertical-align:middle;margin:0px 20px"><br><br><font color="white"><b>GoodGamesDB Web</b></font>
    </div>
    <div><br>
        <form method="post" action="index.php">
            <input type="password" id="password" name="password"><br>
            <button type="submit" class="btn">Let's go</button>
        </form>
        </div>
        <div>
        </div>
    </div>
</body>
</html>