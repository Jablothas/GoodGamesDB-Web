<?php
session_start();

function authenticateUser($password) {
    // Replace this with your actual password check logic
    $correctPassword = "intheEnd12147!";

    if ($password == $correctPassword) {
        $_SESSION["authenticated"] = true;
        $_SESSION["login_time"] = time(); // Add the login timestamp
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
    $sessionTimeout = 60 * 60; // 15 minutes in seconds
    $currentTime = time();

    // Check if the session has expired
    return isset($_SESSION["login_time"]) && ($currentTime - $_SESSION["login_time"] > $sessionTimeout);
}
?>