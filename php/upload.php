<?php
// Check if the file was uploaded without errors
if (isset($_FILES['image']) && $_FILES['image']['error'] === UPLOAD_ERR_OK) {
    $uploadDir = '../img/covers/';
    
    // Generate a random name for the image
    $randomName = uniqid('cover_') . '.' . pathinfo($_FILES['image']['name'], PATHINFO_EXTENSION);

    // Move the uploaded file to the destination directory with the random name
    move_uploaded_file($_FILES['image']['tmp_name'], $uploadDir . $randomName);

    // Return the random name for JavaScript to use
    echo $randomName;
} else {
    // Handle errors
    echo 'Error uploading image. Error code: ' . $_FILES['image']['error'];
}
?>