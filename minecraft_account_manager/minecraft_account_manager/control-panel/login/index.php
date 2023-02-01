<?php

session_start();

if(isset($_SESSION['isLoggedIn']))
{
    header('Location: ../');
    exit();
}

?>

<!DOCTYPE HTML>
<html>
    <head>
        <title>Login</title>
        <link rel="shortcut icon" type="image/png" href="/favicon.ico">
    </head>
    
    <body>
        <form action="./authenticate.php" method="post">
            <label>Password</label>
            <input type="password" placeholder="Enter Password" name="password" required>
            <br>
            <button type="submit">Login</button>
        </form>
    </body>
</html>