<?php

session_start();

if(!isset($_SESSION['isLoggedIn']))
{
    header('Location: ./login');
    exit();
}

if(isset($_GET['code']) && !empty($_GET['code']))
{
    $code = $_GET['code'];
    $codePath = "../codes/$code";
    
    if(file_exists($codePath))
    {
        unlink("$codePath/data.json");
        
        if(file_exists("$codePath/activated"))
        {
            unlink("$codePath/activated");
        }
        
        rmdir($codePath);
        header("Location: ./?code=$code\&delete");
        exit();
    }
}

header("Location: ./");

?>