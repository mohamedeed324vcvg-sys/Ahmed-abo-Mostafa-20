<?php
require 'vendor/autoload.php';

session_start();

// إعداد بيانات الاعتماد
$client = new Google_Client();
$client->setClientId('668553959423-4j0co13pl18pm4hs42pdiougdm8m9j7o.apps.googleusercontent.com'); // استبدل بـ Client ID الخاص بك
$client->setClientSecret('668553959423-4j0co13pl18pm4hs42pdiougdm8m9j7o.apps.googleusercontent.com'); // استبدل بـ Client Secret الخاص بك
$client->setRedirectUri('https://mohamedeed324vcvg-sys.github.io/Ahmed-abo-Mostafa-20/'); // URI إعادة                 
$client->addScope('email');
$client->addScope('profile');

// إنشاء رابط تسجيل الدخول
$loginUrl = $client->createAuthUrl();
?>

<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>تسجيل الدخول باستخدام Google</title>
</head>
<body>
    <a href="<?php echo htmlspecialchars($loginUrl); ?>">تسجيل الدخول باستخدام Google</a>
</body>
</html>
