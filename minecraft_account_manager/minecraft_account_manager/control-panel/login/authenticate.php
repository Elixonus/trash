<?php

if(isset($_POST['password']))
{
    $password = $_POST['password'];
}

else
{
    $password = '';
}

if($password === 'skynet3628800')
{
    session_start();
    $_SESSION['isLoggedIn'] = true;
    header('Location: ../');
}

else
{
    header('Location: ./');
}

?>