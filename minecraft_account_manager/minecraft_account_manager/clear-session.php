<?php

if(isset($_GET['session']) && isset($_GET['url']))
{
    session_start();
    $session = $_GET['session'];
    unset($_SESSION[$session]);
    $url = $_GET['url'];
    header("Location: $url");
}

?>