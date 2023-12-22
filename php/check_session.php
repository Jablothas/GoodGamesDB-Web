<?php
include_once 'session_manager.php';

// Validate the user session
if (isUserAuthenticated()) {
    echo 'valid';
} else {
    echo 'invalid';
}
?>