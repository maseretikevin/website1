<?php
$name = $_POST['name'];
$email = $_POST['email'];
$subject = $_POST['subject'];
$message = $_POST['message'];
$recipient = "maseretikevin@gmail.com";

$mailHeader = "From " . $name . " Email <" . $email . ">\r\n";
mail($recipient, $subject, $message, $mailHeader)
or die("error");
