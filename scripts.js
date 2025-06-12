"use strict";
const { PI: π, E: e, sin, cos, pow, abs } = Math;

let c, ctx, W, H;
let paused = false;
let fc = 0; // frame count
let fid = 0; // frame id
let r = 0;
let θ = 0;
let scf = 30; // scale factor
let x = 0;
let y = 0;
let tempx = 0;
let tempy = 0;
let infoBtn;

const setup = () => {
    c = document.getElementById("Canvas");
    ctx = c.getContext("2d");

    // canvas full screen and HD
    [W, H] = setSize(c, ctx);

    window.onresize = () => {
        [W, H] = setSize(c, ctx);
        fc = 0;
    };

    infoBtn = document.getElementById("Info");
    infoBtn.onclick = () => alert(
        "Parametric butterfly.\n\n" +
        "1) Click anywhere on canvas to pause / unpause.\n" +
        "2) Double click to clear canvas.\n" +
        "3) Use slider to change the size of the butterfly curve.\n\n" +
        "Equation: r = e^sin(θ) - 2cos(4θ) + sin^5((2θ - π)/24)"
    );

    const scaleSlider = document.getElementById("scaleSlider");
    scaleSlider.oninput = (e) => {
        scf = parseInt(e.target.value);
    };

    c.onclick = () => {
        paused ? window.requestAnimationFrame(animate) : window.cancelAnimationFrame(fid);
        paused = !paused;
    };

    c.ondblclick = () => {
        clear(ctx);
        fc = 0;
    };

    window.requestAnimationFrame(animate);
};

const animate = () => {
    ctx.fillStyle = ctx.strokeStyle = `rgb(
        ${abs(sin(fc / 360)) * 255},
        ${abs(sin(fc / 360 + π / 6)) * 255}, 
        ${abs(sin(fc / 360 - π / 6)) * 255}
    )`;

    ctx.save();
    ctx.translate(W / 2, H / 2);

    tempx = x;
    tempy = y;

    r = pow(e, sin(θ)) - 2 * cos(4 * θ) + pow(sin((2 * θ - π) / 24), 5);
    r *= scf;
    x = r * cos(θ);
    y = -r * sin(θ);

    line(ctx, x, y, tempx, tempy);
    ctx.restore();

    θ = fc / 60;
    fc++;
    fid = window.requestAnimationFrame(animate);
};

const clear = (ctx, color = "rgba(0, 0, 0, 1)", w = window.innerWidth, h = window.innerHeight) => {
    ctx.fillStyle = color;
    ctx.fillRect(0, 0, w, h);
};

const line = (ctx, x1, y1, x2, y2) => {
    ctx.beginPath();
    ctx.moveTo(x1, y1);
    ctx.lineTo(x2, y2);
    ctx.stroke();
};

const setSize = (c, ctx, w = window.innerWidth, h = window.innerHeight, pd = devicePixelRatio) => {
    // canvas apparent size
    c.style.width = `${w}px`;
    c.style.height = `${h}px`;

    // canvas actual size
    c.width = w * pd;
    c.height = h * pd;

    // reset transform before applying new scale
    ctx.setTransform(1, 0, 0, 1, 0, 0); // reset scaling
    ctx.scale(pd, pd);

    return [w, h];
};

window.onload = setup;
