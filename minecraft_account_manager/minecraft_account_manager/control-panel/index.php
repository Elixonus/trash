<?php

session_start();

if(!isset($_SESSION['isLoggedIn']))
{
    header('Location: ./login');
    exit();
}

?>

<!DOCTYPE HTML>
<html>
    <head>
        <title>Control Panel</title>
        <link rel="shortcut icon" type="image/png" href="/favicon.ico">
    </head>
    
    <body>
        <h3>
            
<?php

if(isset($_GET['code']))
{
    if(isset($_GET['generate']))
    {
        echo 'The code is: '.$_GET['code'];
    }
    
    else if(isset($_GET['delete']))
    {
        echo 'The code has been deleted';
    }
}

?></h3>
        <form action="./generate.php" method="post">
            <label>Email</label>
            <input type="email" placeholder="Enter Email" name="email" required>
            <br>
            <label>Password</label>
            <input type="text" placeholder="Enter Password" name="password" required>
            <br>
            <button type="submit">Generate</button>
            <br>
            <a href="./logout">Logout</a>
        </form>
        
        <table><tr><th>Time Generated</th><th>Code</th><th>Activated</th><th>Time Activated</th><th>Email</th><th>Password</th><th>Delete</th></tr><?php

date_default_timezone_set('America/Los_Angeles');

$codesPath = '../codes';
$codes = scandir($codesPath);
array_splice($codes, 0, 2);
$codesBuffer = array();

for($n = 0; $n < count($codes); $n++)
{
    array_push($codesBuffer, $codes[$n]);
}

$codes = array();

for($n = 0; $n < count($codesBuffer); $n++)
{
    $codes = array_merge($codes, array($codesBuffer[$n] => filemtime($codesPath.'/'.$codesBuffer[$n].'/data.json')));
}

arsort($codes);

foreach($codes as $code => $time)
{
    $codePath = "$codesPath/$code";
    $activated = 'false';
    
    if(file_exists($codePath.'/activated'))
    {
        $activated = 'true';
        $timeActivated = date('F d Y H:i:s.', filemtime($codePath.'/activated'));
    }
    
    else
    {
        $timeActivated = 'null';
    }
    
    $data = json_decode(file_get_contents($codePath.'/data.json')); // optimize
    $timeGenerated = date('F d Y H:i:s.', $time);
    echo "<tr><td>$timeGenerated</td><td>$code</td><td>$activated</td><td>$timeActivated</td><td>$data->email</td><td>$data->password</td><td><a href=\"./delete.php?code=$code\">Delete</a></td></tr>";
    
} ?>
        
        <style>
            
            table, th, td
            {
                border: 1px solid black;
            }
            
        </style>
    </body>
</html>