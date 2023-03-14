const cg = 9.8;
const pw = 3;

let run = true;

let time = 0;

let dmp = 2;

let frq = 2;
let amp = 2;

let sins = [{
    frq: 0,
    amp: 0,
    phs: 0
}];

let plt = {
    pos: {
        x: 0,
        y: 0
    },
    vel: {
        x: 0,
        y: 0
    },
    acc: {
        x: 0,
        y: 0
    }
};

let nods = [];

let lnks = [];

let pins = [];

let lods = [];

setLab();

window.setInterval(function()
{
    if(run === true)
    {
        for(let s = 0; s < 100; s++)
        {
            doPhys(1 / (100 * 24));
        }
    }
}, 1000 / 24);

function doPhys(dlt)
{
    plt.pos.x = 0;
    plt.pos.y = 0;

    plt.vel.x = 0;
    plt.vel.y = 0;
    
    plt.acc.x = 0;
    plt.acc.y = 0;

    for(let s = 0; s < sins.length; s++)
    {
        let sin = sins[s];

        plt.pos.x += sin.amp * Math.sin(2 * Math.PI * (sin.frq * time + sin.phs));
        plt.vel.x += 2 * Math.PI * sin.frq * sin.amp * Math.cos(2 * Math.PI * (sin.frq * time + sin.phs));
        plt.acc.x -= 4 * Math.PI * Math.PI * sin.frq * sin.frq * sin.amp * Math.sin(2 * Math.PI * (sin.frq * time + sin.phs));
    }

    for(let p = 0; p < pins.length; p++)
    {
        let pin = pins[p];

        pin.nod.pos.x = plt.pos.x + pin.rpos.x;
        pin.nod.pos.y = plt.pos.y + pin.rpos.y;

        pin.nod.vel.x = plt.vel.x;
        pin.nod.vel.y = plt.vel.y;

        pin.nod.acc.x = plt.acc.x;
        pin.nod.acc.y = plt.acc.y;

        pin.nod.frc.x = pin.nod.mass * pin.nod.acc.x;
        pin.nod.frc.y = pin.nod.mass * pin.nod.acc.y;
    }

    for(let n = 0; n < nods.length; n++)
    {
        let nod = nods[n];

        nod.frc.x = 0;
        nod.frc.y = -cg * nod.mass;
    }

    for(let l = 0; l < lnks.length; l++)
    {
        let lnk = lnks[l];

        let vec = {
            x: lnk.nod2.pos.x - lnk.nod1.pos.x,
            y: lnk.nod2.pos.y - lnk.nod1.pos.y
        };
        let len = Math.hypot(vec.x, vec.y);
        let dsp = len - lnk.rlen;
        let vel = vec.x * (lnk.nod2.vel.x - lnk.nod1.vel.x) + vec.y * (lnk.nod2.vel.y - lnk.nod1.vel.y);

        if(dsp > 0.1)
        {
            lnk.cstf = 20000;
        }

        else
        {
            lnk.cstf = 5000;
        }

        let frc = -(lnk.cstf * dsp + lnk.cdmp * vel);
        let uvec = {
            x: vec.x / len,
            y: vec.y / len
        };

        if(isPind(lnk.nod1) === false)
        {
            lnk.nod1.frc.x -= uvec.x * frc;
            lnk.nod1.frc.y -= uvec.y * frc;
        }
        
        if(isPind(lnk.nod2) === false)
        {
            lnk.nod2.frc.x += uvec.x * frc;
            lnk.nod2.frc.y += uvec.y * frc;
        }
    }

    for(let l = 0; l < lods.length; l++)
    {
        let lod = lods[l];

        lod.nod.frc.x += lod.frc.x;
        lod.nod.frc.y += lod.frc.y;
    }

    for(let n = 0; n < nods.length; n++)
    {
        let nod = nods[n];

        if(isPind(nod) === false)
        {
            let acc = {
                x: nod.acc.x,
                y: nod.acc.y
            };

            nod.acc.x = nod.frc.x / nod.mass;
            nod.acc.y = nod.frc.y / nod.mass;

            nod.pos.x += nod.vel.x * dlt + 0.5 * nod.acc.x * dlt * dlt;
            nod.pos.y += nod.vel.y * dlt + 0.5 * nod.acc.y * dlt * dlt;

            nod.vel.x += 0.5 * (acc.x + nod.acc.x) * dlt;
            nod.vel.y += 0.5 * (acc.y + nod.acc.y) * dlt;
        }
    }

    time += dlt;
}

window.requestAnimationFrame(doAnim);

function doAnim()
{
    doView();

    doPlot();

    window.requestAnimationFrame(doAnim);
}

const canvXray = document.getElementById("canvas-xray");

function doView()
{
    let ctxXray = canvXray.getContext("2d", { alpha: false });

    ctxXray.save();

    ctxXray.clearRect(0, 0, 800, 600);

    ctxXray.fillStyle = "#8ff";
    ctxXray.fillRect(0, 0, 800, 600);

    ctxXray.scale(100, 100);
    ctxXray.translate(4, 3);
    ctxXray.scale(1, -1);

    if(time < 100)
    {
        ctxXray.beginPath();
        ctxXray.arc(0, 0.1 * time - 3, 0.5, 0, 2 * Math.PI);
        ctxXray.fillStyle = "#ff0";
        ctxXray.fill();
        ctxXray.lineWidth = 0.05;
        ctxXray.strokeStyle = "#f80";
        ctxXray.stroke();
    }

    ctxXray.fillStyle = "#0f0";
    ctxXray.fillRect(-4, -3, 8, 1.5);
    ctxXray.beginPath();
    ctxXray.moveTo(-4, -1.5);
    ctxXray.lineTo(4, -1.5);
    ctxXray.lineWidth = 0.05;
    ctxXray.strokeStyle = "#000";
    ctxXray.stroke();

    ctxXray.translate(0, -2);

    ctxXray.beginPath();
    ctxXray.rect(plt.pos.x - 0.5 * pw, plt.pos.y - 0.5, pw, 0.5);
    ctxXray.fillStyle = "#842";
    ctxXray.fill();
    ctxXray.lineWidth = 0.05;
    ctxXray.strokeStyle = "#000";
    ctxXray.stroke();

    for(let l = 0; l < lnks.length; l++)
    {
        let lnk = lnks[l];
        let len = Math.hypot(lnk.nod1.pos.x - lnk.nod2.pos.x, lnk.nod1.pos.y - lnk.nod2.pos.y);

        ctxXray.beginPath();
        ctxXray.moveTo(lnk.nod1.pos.x, lnk.nod1.pos.y);
        ctxXray.lineTo(lnk.nod2.pos.x, lnk.nod2.pos.y);

        ctxXray.lineWidth = 0.05 * (lnk.rlen / len);
        ctxXray.strokeStyle = "#000";
        ctxXray.stroke();
    }

    for(let n = 0; n < nods.length; n++)
    {
        let nod = nods[n];

        ctxXray.beginPath();
        ctxXray.arc(nod.pos.x, nod.pos.y, 0.1, 0, 2 * Math.PI);
        ctxXray.fillStyle = "#fff";
        ctxXray.fill();
        ctxXray.lineWidth = 0.05;
        ctxXray.strokeStyle = "#000";
        ctxXray.stroke();
    }

    for(let l = 0; l < lods.length; l++)
    {
        let lod = lods[l];
        
        ctxXray.save();

        ctxXray.translate(lod.nod.pos.x, lod.nod.pos.y);
        ctxXray.rotate(Math.atan2(lod.frc.y, lod.frc.x));

        ctxXray.beginPath();
        ctxXray.moveTo(0, 0);
        ctxXray.lineTo(-0.2, 0.2);
        ctxXray.lineTo(-0.2, 0.06);
        ctxXray.lineTo(-0.6, 0.08);
        ctxXray.lineTo(-0.6, -0.08);
        ctxXray.lineTo(-0.2, -0.06);
        ctxXray.lineTo(-0.2, -0.2);
        ctxXray.closePath();
        ctxXray.fillStyle = "#ff0";
        ctxXray.fill();
        ctxXray.lineWidth = 0.05;
        ctxXray.strokeStyle = "#000";
        ctxXray.stroke();
    
        ctxXray.restore();
    }

    ctxXray.restore();
}


function doPlot()
{

}

function isPind(nod)
{
    for(let p = 0; p < pins.length; p++)
    {
        let pin = pins[p];

        if(pin.nod === nod)
        {
            return true;
        }
    }

    return false;
}

function setTimeStrt()
{
    run = true;
}

function setTimeStop()
{
    run = false;
}

function setDmpLow()
{
    dmp = 1;
    setLab();
}

function setDmpMed()
{
    dmp = 2;
    setLab();
}

function setDmpHigh()
{
    dmp = 3;
    setLab();
}

function setFrqLow()
{
    frq = 1;
    setLab();
}

function setFrqMed()
{
    frq = 2;
    setLab();
}

function setFrqHigh()
{
    frq = 3;
    setLab();
}

function setAmpLow()
{
    amp = 1;
    setLab();
}

function setAmpMed()
{
    amp = 2;
    setLab();
}

function setAmpHigh()
{
    amp = 3;
    setLab();
}

function setLab()
{
    time = 0;

    if(frq === 1)
    {
        sins[0].frq = 0.2;

        if(amp === 1)
        {
            sins[0].amp = 0.5;
        }

        else if(amp === 2)
        {
            sins[0].amp = 1;
        }

        else if(amp === 3)
        {
            sins[0].amp = 2;
        }
    }

    else if(frq === 2)
    {
        sins[0].frq = 1;

        if(amp === 1)
        {
            sins[0].amp = 0.1;
        }

        else if(amp === 2)
        {
            sins[0].amp = 0.2;
        }

        else if(amp === 3)
        {
            sins[0].amp = 0.4;
        }
    }

    else if(frq === 3)
    {
        sins[0].frq = 5;

        if(amp === 1)
        {
            sins[0].amp = 0.01;
        }

        else if(amp === 2)
        {
            sins[0].amp = 0.02;
        }

        else if(amp === 3)
        {
            sins[0].amp = 0.08;
        }
    }

    doPhys(0);

    nods = [];

    for(let x = 0; x < 4; x++)
    {
        for(let y = 0; y < 8; y++)
        {
            let nod = {
                mass: 1,
                pos: {
                    x: plt.pos.x + 2 * (x / (4 - 1) - 0.5),
                    y: plt.pos.y + 4 * y / (8 - 1)
                },
                vel: {
                    x: 0,
                    y: 0
                },
                acc: {
                    x: 0,
                    y: 0
                },
                frc: {
                    x: 0,
                    y: 0
                }
            };
    
            nods.push(nod);
        }
    }

    let cdmp = 0;

    if(dmp === 1)
    {
        cdmp = 5;
    }

    else if(dmp === 2)
    {
        cdmp = 20;
    }

    else if(dmp === 3)
    {
        cdmp = 80;
    }

    lnks = [];

    for(let x = 0; x < (4 - 1); x++)
    {
        for(let y = 0; y < 8; y++)
        {
            let nod1 = nods[8 * x + y];
            let nod2 = nods[8 * (x + 1) + y];

            let lnk = {
                nod1: nod1,
                nod2: nod2,
                rlen: Math.hypot(nod1.pos.x - nod2.pos.x, nod1.pos.y - nod2.pos.y),
                cstf: 5000,
                cdmp: cdmp
            };

            lnks.push(lnk);
        }
    }

    for(let x = 0; x < 4; x++)
    {
        for(let y = 0; y < (8 - 1); y++)
        {
            let nod1 = nods[8 * x + y];
            let nod2 = nods[8 * x + (y + 1)];

            let lnk = {
                nod1: nod1,
                nod2: nod2,
                rlen: Math.hypot(nod1.pos.x - nod2.pos.x, nod1.pos.y - nod2.pos.y),
                cstf: 5000,
                cdmp: cdmp
            };

            lnks.push(lnk);
        }
    }

    for(let x = 0; x < (4 - 1); x++)
    {
        for(let y = 0; y < (8 - 1); y++)
        {
            let nod1 = nods[8 * x + y];
            let nod2 = nods[8 * (x + 1) + (y + 1)];

            let lnk = {
                nod1: nod1,
                nod2: nod2,
                rlen: Math.hypot(nod1.pos.x - nod2.pos.x, nod1.pos.y - nod2.pos.y),
                cstf: 5000,
                cdmp: cdmp
            };

            lnks.push(lnk);
        }
    }

    pins = [];

    for(let x = 0; x < 4; x++)
    {
        let nod = nods[8 * x];

        pins.push({
            nod: nod,
            rpos: {
                x: nod.pos.x - plt.pos.x,
                y: nod.pos.y - plt.pos.y
            }
        });
    }

    lods = [{
        nod: nods[7],
        frc: {
            x: 0,
            y: -220
        }
    }];

    doPhys(0);
}

const btnTimeStrt = document.getElementById("button-time-start");
const btnTimeStop = document.getElementById("button-time-stop");
const btnDmpLow = document.getElementById("button-dampening-low");
const btnDmpMed = document.getElementById("button-dampening-medium");
const btnDmpHigh = document.getElementById("button-dampening-high");
const btnFrqLow = document.getElementById("button-frequency-low");
const btnFrqMed = document.getElementById("button-frequency-medium");
const btnFrqHigh = document.getElementById("button-frequency-high");
const btnAmpLow = document.getElementById("button-amplitude-low");
const btnAmpMed = document.getElementById("button-amplitude-medium");
const btnAmpHigh = document.getElementById("button-amplitude-high");


btnTimeStrt.onclick = setTimeStrt;
btnTimeStop.onclick = setTimeStop;
btnDmpLow.onclick = setDmpLow;
btnDmpMed.onclick = setDmpMed;
btnDmpHigh.onclick = setDmpHigh;
btnFrqLow.onclick = setFrqLow;
btnFrqMed.onclick = setFrqMed;
btnFrqHigh.onclick = setFrqHigh;
btnAmpLow.onclick = setAmpLow;
btnAmpMed.onclick = setAmpMed;
btnAmpHigh.onclick = setAmpHigh;
