var rails1 = [[0, 250], [20, 40], [30, 30], [40, 40], [50, 60], [100, 140], [150, 180], [200, 200], [220, 180], [250, 50], [270, 20], [300, 0], [350, 20], [500, 300]];
var rails2 = [[0, 250], [10, 248], [20, 245], [40, 235], [70, 210], [100, 150], [130, 90], [150, 60], [170, 40], [190, 30], [210, 25], [250, 23], [400, 23], [500, 23]];
var rails3 = [[0, 250], [250, 125], [500, 50]];

var mass = 10;
var rollerCoaster = document.getElementById("rollerCoaster");
var ctxRollerCoaster = rollerCoaster.getContext("2d");
var rails = rails1;
var bars = document.getElementById("bars");

var energyGraph = document.getElementById("energyGraph");
var ctxEnergyGraph = energyGraph.getContext("2d");
ctxEnergyGraph.translate(50, 50);

ctxRollerCoaster.translate(0, 150);
ctxRollerCoaster.scale(1, -1);
ctxRollerCoaster.translate(0, -150);

function render()
{
    var patternBars = ctxRollerCoaster.createPattern(bars, "repeat");
    ctxRollerCoaster.fillStyle = "#34aeeb";
    ctxRollerCoaster.fillRect(0, 0, 500, 300);
    
    ctxRollerCoaster.strokeStyle = "#000000";
    ctxRollerCoaster.lineWidth = 3;
    ctxRollerCoaster.fillStyle = patternBars;
    ctxRollerCoaster.beginPath();
    ctxRollerCoaster.moveTo(rails[0][0], rails[0][1]);
    
    for(var n = 1; n < rails.length; n++)
    {
        ctxRollerCoaster.lineTo(rails[n][0], rails[n][1]);
    }
    
    ctxRollerCoaster.stroke();
    ctxRollerCoaster.lineTo(rails[rails.length - 1][0], 0);
    ctxRollerCoaster.lineTo(rails[0][0], 0);
    ctxRollerCoaster.closePath();
    ctxRollerCoaster.fill();
    
}

window.onload = function()
{
    render();
    
    window.setInterval(function()
    {
        var parse = parseInt(document.getElementById("x").value);
        
        if(isNaN(parse))
        {
            parse = 0;
        }
        
        document.getElementById("x").value = parse + 1;
        render();
        calculate();
    }, 1000 / 30);
}

function calculate()
{
    var x = parseInt(document.getElementById("x").value);
    
    if(x < rails[0][0] || x > rails[rails.length - 1][0])
    {
        return;
    }
    
    var y;
    
    for(var n = 1; n < rails.length; n++)
    {
        let rx = rails[n][0];
        let ry = rails[n][1];

        if(x < rx)
        {
            y = interpolateLinear(rails[n - 1][1], ry, (x - rails[n - 1][0]) / (rx - rails[n - 1][0]));
        }
        
        else if(x === rx)
        {
            y = ry;
        }
        
        else
        {
            continue;
        }
        
        var v = Math.sqrt(2 * 9.88 * Math.abs(y - rails[0][1]));
        var a = Math.atan2(ry - rails[n - 1][1], rx - rails[n - 1][0]);        
        break;
    }
    
    var kineticEnergy = Math.round(100 * (mass * Math.pow(v, 2) / 2)) / 100;
    var potentialEnergy = Math.round(100 * (mass * 9.88 * y)) / 100;
    var mechanicalEnergy = kineticEnergy + potentialEnergy;
    
    document.getElementById("kinetic").innerHTML = "Kinetic Energy = 1/2 * mv^2 = " + kineticEnergy + "J";
    document.getElementById("potential").innerHTML = "Potential Energy = mgh = " + potentialEnergy + "J";
    document.getElementById("mechanical").innerHTML = "Mechanical Energy = Kinetic Energy + Potential Energy = " + mechanicalEnergy + "J";
    document.getElementById("velocity").innerHTML = "Velocity = " + Math.round(100 * v) / 100 + " m/s";
    
    ctxEnergyGraph.fillStyle = "#ffffff";
    ctxEnergyGraph.fillRect(-energyGraph.width / 2, -energyGraph.width / 2, energyGraph.width, energyGraph.height);
    ctxEnergyGraph.fillStyle = "#ff0000";
    ctxEnergyGraph.beginPath();
    ctxEnergyGraph.arc(0, 0, 50, 0, 2 * Math.PI * (kineticEnergy / mechanicalEnergy));
    ctxEnergyGraph.lineTo(0, 0);
    ctxEnergyGraph.fill();
    
    ctxEnergyGraph.fillStyle = "#0000ff";
    ctxEnergyGraph.beginPath();
    ctxEnergyGraph.arc(0, 0, 50, 2 * Math.PI * (kineticEnergy / mechanicalEnergy), 2 * Math.PI);
    ctxEnergyGraph.lineTo(0, 0);
    ctxEnergyGraph.fill();
    
    render();
    ctxRollerCoaster.fillStyle = "#ff0000";
    ctxRollerCoaster.fillRect(x - 5, y - 5, 10, 10);
    
    ctxRollerCoaster.strokeStyle = "#ffff00";
    ctxRollerCoaster.beginPath();
    ctxRollerCoaster.translate(x, y);
    ctxRollerCoaster.rotate(a);
    ctxRollerCoaster.moveTo(0, 0);
    ctxRollerCoaster.lineTo(v, 0);
    ctxRollerCoaster.lineTo(v - 10, -10);
    ctxRollerCoaster.lineTo(v, 0);
    ctxRollerCoaster.lineTo(v - 10, 10);
    ctxRollerCoaster.stroke();
    ctxRollerCoaster.rotate(-a);
    ctxRollerCoaster.translate(-x, -y);
}

function interpolateLinear(startingValue, endingValue, t)
{
    return (startingValue + (endingValue - startingValue) * t);
}
