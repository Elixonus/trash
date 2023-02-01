<!DOCTYPE HTML>
<html>
    <head>
        <title>Redeem Code</title>
        <link rel="shortcut icon" type="image/png" href="/favicon.ico">
        <link rel="stylesheet" href="../bootstrap.css">
    </head>
    
    <body>
        <div class="container text-center">
            <br>
            <img id="minecraft" class="img-fluid col-md-5 center-block" src="../minecraft.png">
            <form>
                <div class="form-group w-50 mx-auto">
                    <label class="text-white shadow-sm">Email:</label>
                    <input class="form-control text-center text-white border-white shadow" id="email" readonly onclick="highlight(this);">
                </div>
                <div class="form-group w-50 mx-auto">
                    <label class="text-white shadow-sm">Password:</label>
                    <input class="form-control text-center text-white border-white shadow" id="password" readonly onclick="highlight(this);">
                </div>
            </form>
            <a id="redeem" href="../clear-session.php?session=code&url=./redeem/enter-code">Redeem another code</a>
            <p id="offer">Promo: If you leave a <b>positive feedback</b> you will receive one extra code <b>FOR FREE </b><span class="badge badge-secondary">New</span></p>
        </div>
        
        <style>
            
            body
            {
                background-image: url("../dirt.jpg");
                background-size: 100px;
            }
            
            #minecraft
            {
                float: none;
            }
            
            input
            {
                background-image: url("../stone.jpg");
                background-size: 100px;
            }
            
            #redeem
            {
                color: #ffffff;
            }
            
            #offer
            {
                animation: color 1.5s infinite alternate;
            }
            
            @keyframes color
            {
                from
                {
                    color: #ffffff;
                }
                
                to
                {
                    color: #99ff99;
                }
            }
            
        </style>

        <script>
        
            const data = <?php

session_start();
$isCodeCorrect = false;

if(isset($_GET['code']))
{
    $code = preg_replace('/[^0-9A-Z]/', '', strtoupper($_GET['code']));
    $codePath = '../codes/'.$code;
    
    if(file_exists($codePath) && $code !== '')
    {
        $isCodeCorrect = true;
        $_SESSION['code'] = $code;
        
        $data = json_decode(file_get_contents($codePath.'/data.json'));
        $isActivated = file_exists($codePath.'/activated');
        
        if(!$isActivated)
        {
            file_put_contents($codePath.'/activated', '');
        }
        
        echo json_encode(array('email' => $data -> email, 'password' => $data -> password));
    }
}

if(!$isCodeCorrect)
{
    if(isset($_SESSION['code']))
    {
        unset($_SESSION['code']);
    }
    
    header('Location: ./enter-code');
    exit();
}

?>;
            
            document.getElementById("email").value = data.email;
            document.getElementById("password").value = data.password;

            function highlight(field)
            {
                field.focus();
                field.select();
            }
            
        </script>
    </body>
</html>