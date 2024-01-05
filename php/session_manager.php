<?php
session_start();

function authenticateUser($password) {
    $correctPassword = "intheEnd12147!";

    if ($password == $correctPassword) {
        $_SESSION["authenticated"] = true;
        $_SESSION["login_time"] = time(); 
        return true;
    } else {
        return false;
    }
}

function isUserAuthenticated() {
    return isset($_SESSION["authenticated"]) && $_SESSION["authenticated"] === true;
}

function validateSession() {
    if (!isUserAuthenticated() || isSessionExpired()) {
        header("Location: index.php");
        exit;
    }
}

function isSessionExpired() {
    $sessionTimeout = 60 * 60 * 12;
    $currentTime = time();

    // Check if the session has expired
    return isset($_SESSION["login_time"]) && ($currentTime - $_SESSION["login_time"] > $sessionTimeout);
}
?>