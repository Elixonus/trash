<?php

session_start();

if(!isset($_SESSION['isLoggedIn']))
{
    header('Location: ./login');
    exit();
}

$characters = array(0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 'A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z');

if(isset($_POST['email']) && !empty($_POST['email']) && isset($_POST['password']) && !empty($_POST['password']))
{
    $email = $_POST['email'];
    $password = $_POST['password'];
    $code = generateCode();
    $codesPath = '../codes';
    $codes = scandir($codesPath);
    array_splice($codes, 0, 2);
    
    for($n = 0; $n < count($codes); $n++)
    {
        if($code === $codes[$n])
        {
            $code = generateCode();
            $n = 0;
        }
    }
    
    mkdir($codesPath.'/'.$code);
    file_put_contents($codesPath.'/'.$code.'/data.json', json_encode(array('email' => $email, 'password' => $password)));
    header("Location: ./?code=$code&generate");
}

function generateCode()
{
    $code = '';
    global $characters;
    
    for($n = 0; $n < 25; $n++)
    {
        $code .= $characters[mt_rand(0, count($characters) - 1)];
    }
    
    return $code;
}

?>