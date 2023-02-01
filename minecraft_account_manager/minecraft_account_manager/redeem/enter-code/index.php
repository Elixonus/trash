<?php

session_start();

if(isset($_SESSION['code']))
{
    header('Location: ../?code='.$_SESSION['code']);
}

?>

<!DOCTYPE HTML>
<html>
    <head>
        <title>Redeem Code</title>
        <link rel="shortcut icon" type="image/png" href="/favicon.ico">
        <link rel="stylesheet" href="../../bootstrap.css">
    </head>
    
    <body>
        <div class="container text-center">
            <br>
            <img id="minecraft" src="../../minecraft.png" class="img-fluid col-md-5 center-block">
            <form action="../">
                <div class="form-group w-50 mx-auto">
                    <label class="text-white shadow-sm">Code:</label>
                    <input id="code" class="form-control text-center text-white border-white shadow" name="code" spellcheck="false" autofocus>
                </div>
                <button id="redeem" type="submit" class="btn text-white border-white shadow">Redeem</button>
            </form>
        </div>
        
        <style>
            
            body
            {
                background-image: url("../../dirt.jpg");
                background-size: 100px;
            }
            
            #minecraft
            {
                float: none;
            }
            
            #code
            {
                background-image: url("../../stone.jpg");
                background-size: 100px;
            }
            
            #redeem
            {
                background-image: url("../../grass.jpg");
                background-size: 100px;
                transition: filter 0.25s;
            }
            
            #redeem:hover
            {
                filter: brightness(80%);
            }
            
            
        </style>
        
        <script>
        
            const code = document.getElementById("code");
            const redeem = document.getElementById("redeem");
        
            updateCode();
        
            code.oninput = function()
            {
                updateCode();
            };
            
            function updateCode()
            {
                code.value = code.value.toUpperCase().replace(/[^0-9A-Z]/g, "");
                
                if(code.value.length === 25)
                {
                    redeem.removeAttribute("disabled");
                    redeem.removeAttribute("title");
                    redeem.removeAttribute("style");
                    redeem.setAttribute("style", "animation-play-state: running;");
                }
                
                else
                {
                    redeem.setAttribute("disabled", "");
                    redeem.setAttribute("title", "Code should be 25 characters long");
                    redeem.setAttribute("style", "pointer-events: none; animation-play-state: paused;");
                }
            }
            
        </script>
    </body>
</html>