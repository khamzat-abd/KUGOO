<?php
$user_phone = htmlspecialchars($_POST['userphone']);

$token = "5767548488:AAEoOZZjKpX8A1DYlweqNrNsOtTc_DQL-Lc";
$chat_id = "-869102162";

$formData = array(
  "Телефон: " => $user_phone
);

foreach($formData as $key => $value) {
  $text .= $key . "<b>" . urlencode($value) . "</b>" . "%0A";
}

$sendToTelegram = fopen("https://api.telegram.org/bot{$token}/sendMessage?chat_id={$chat_id}&text={$text}&parse_mode=html", "r");

if ($sendToTelegram) {
  echo "Success";
} else {
  echo "Error";
}