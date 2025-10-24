<?php
require 'vendor/autoload.php';

session_start();

// إعداد بيانات الاعتماد
$client = new Google_Client();
$client->setClientId('668553959423-4j0co13pl18pm4hs42pdiougdm8m9j7o.apps.googleusercontent.com'); // استبدل بـ Client ID الخاص بك
$client->setClientSecret('668553959423-4j0co13pl18pm4hs42pdiougdm8m9j7o.apps.googleusercontent.com'); // استبدل بـ Client Secret الخاص بك
$client->setRedirectUri('https://mohamedeed324vcvg-sys.github.io/Ahmed-abo-Mostafa-20/'); // URI إعادة التوجيه

// الحصول على رمز التفويض
if (isset($_GET['code'])) {
    $token = $client->fetchAccessTokenWithAuthCode($_GET['code']);
    $client->setAccessToken($token['access_token']);

    // الحصول على معلومات المستخدم
    $oauth2 = new Google_Service_Oauth2($client);
    $userInfo = $oauth2->userinfo->get();

    // عرض معلومات المستخدم
    echo 'اسم المستخدم: ' . $userInfo->name . '<br>';
    echo 'البريد الإلكتروني: ' . $userInfo->email . '<br>';
    echo 'صورة الملف الشخصي: <img src="' . $userInfo->picture . '"><br>';
} else {
    echo 'فشل تسجيل الدخول';
}
?>
