const svLink = "https://gchsedjronrenjwafuyb.supabase.co";
const ap = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImdjaHNlZGpyb25yZW5qd2FmdXliIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDc1NDgwNDQsImV4cCI6MjA2MzEyNDA0NH0.O76q9gHvB6frsGQNdDoNrfHOOox9WDh5kxa4AORNwKw";

const sb = supabase.createClient(svLink, ap);

async function loadTT() {
    const { data, error } = await sb
    .from("DSTrungThuong")
    .select("*");

    if (error) {
        console.error(error);
    } else {
        console.log(data);
    }

    return data;
}

async function getKQ() {
    const bodyData = {
        name: 'khoa', 
    };

    const response = await fetch('https://gchsedjronrenjwafuyb.supabase.co/functions/v1/get-result', {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(bodyData)
    });

    if (!response.ok) {
        console.error("Lỗi khi gọi function:", response.statusText);
        return;
    }

    const data = await response.json();
    console.log("Kết quả từ function:", data);
    return data;
}

function getRotationAngle(el) {
    const style = window.getComputedStyle(el);
    const transform = style.getPropertyValue("transform");

    if (transform === "none") return 0;

    // Matrix: matrix(a, b, c, d, tx, ty)
    const values = transform.match(/matrix\(([^)]+)\)/);
    if (!values) return 0;

    const parts = values[1].split(",").map(parseFloat);
    const [a, b] = parts;

    // angle in radians → degrees
    const angle = Math.round(Math.atan2(b, a) * (180 / Math.PI));
    return (angle + 360) % 360; // normalize to 0–359
}

//getKQ();

function addItem(arr) {
    const aglPerItem = 360 / arr.length;
    const wheel = document.querySelector('.wheel');
    const wheelR = wheel.getBoundingClientRect().width * .85 / 2 - 50;

    wheel.innerHTML = "";
    // wheel.innerHTML = "<div class='spinBtn' onclick='spinClick();'>Spin</div>";

    const colors = [
        'rgb(255, 82, 82)',
        'rgb(255, 193, 7)',
        'rgb(76, 175, 80)',
        'rgb(33, 150, 243)',
        'rgb(156, 39, 176)',
        'rgb(255, 87, 34)',
        'rgb(0, 188, 212)',
        'rgb(205, 220, 57)'
    ];

    const clen = colors.length;

    if (arr.length == 1) {
        const item = document.createElement('div');
        item.className = "item";
        item.style.mask = 'none';
        item.style.webkitMask = 'none';
        item.innerHTML = '<p>' + arr[0] + '</p>';
        item.style.backgroundColor = colors[0];

        wheel.append(item);

        const apItem = document.querySelector('.wheel .item:nth-child(2) p');

        const apItemRect = apItem.getBoundingClientRect();

        //apItem.style.fontSize = (apItemRect.height * wheelR / apItemRect.width) + "px";
        apItem.style.transform = "scale(" + wheelR / apItemRect.width + ")";

        return;
    }
    
    arr.forEach((e, i) => {
        const item = document.createElement('div');
        item.className = "item";
        item.style.setProperty('--angle', aglPerItem + 'deg');
        item.innerHTML = '<p>' + e.trung_thuong_txt + '</p>';
        item.TTId = e.id;
        item.style.backgroundColor = colors[i % clen];

        wheel.append(item);

        const apItem = document.querySelector('.wheel .item:nth-child(' + (i + 1) + ') p');
        console.log(i, apItem);
        const apItemRect = apItem.getBoundingClientRect();

        //apItem.style.fontSize = (apItemRect.height * wheelR / apItemRect.width) + "px";

        document.querySelector('.wheel .item:nth-child(' + (i + 1) + ')').style.transform = "rotate(" + (i * aglPerItem) + "deg)";
    });
}

function searchByContent(txt) {
    let r;

    document.querySelectorAll('.wheel .item').forEach(e => {
        if (e.children[0].innerHTML === txt) {
            r = e;
        }
    });

    return r;
}

function spinClick() {
    if (spin) return;
    spin = true;
    spinv = 1000 + agls;
    // spina = setAglAc(document.querySelectorAll('.wheel .item')[1], agl, spinv, 10);
    spinAni = setAglAc(searchByContent(tar), agl, spinv, 10, RAFT);
    console.log('spin', spin);
}

function modAgl(a) {
    if (a < 0) {
        return a % 360 + 360;
    } else {
        return a % 360;
    }
}

function getRe() {
    const wheel = document.getElementsByClassName('wheel')[0];
    const aglPerItem = 360 / wheel.childElementCount;
    const wagl = getRotationAngle(wheel);
    let r;

    Array.from(wheel.children).forEach(e => {
        const iagl = modAgl(getRotationAngle(e) - 90 + wagl);
        //console.log(iagl);
        if (iagl <= aglPerItem / 2 || iagl >= 360 - aglPerItem / 2) {
            r =  e;
        }
    });

    return r;
}

function showRe(e) {
    const mescon = document.getElementsByClassName('mess-con')[0];
    const mes = document.querySelector('.mesBox #output');

    mescon.style.display = 'flex';
    mes.innerHTML = e.children[0].innerHTML;

    document.querySelector('.mesBox #code').innerHTML = "Mã trúng thưởng:" + code;
}

function findEl(text) {
    let el = document.querySelectorAll('.wheel .item p');
    let ri;

    el.forEach((e, i) => {
        if (e.innerHTML === text) {
            ri = i;
        }
    });

    return ri;
}

function setAglAc(tar, agl, agls, loop, sst) {
    const aglPerItem = 360 / wheel.childElementCount;
    const tarWheelAgl = 360 - (getRotationAngle(tar) - 90) + 360 * loop + (Math.random() - .5) * aglPerItem;
    const a =  -agls / (2 * (tarWheelAgl - agl) / agls);

    return (t) => {
        const localt = (t - sst) / 1000;

        if (a * localt + agls <= 0)  {
            showRe(getRe())
            return tarWheelAgl;
        }

        return a * localt ** 2 / 2 + agls * localt + agl;
    }
}

let st;
let RAFT;
let spinAni;
let agl = 0;
let agls = 20;
let oldt = 0;
let scl = 0;
let sclt = 1;
let spina = -200;
let spinv;
let spin = false;
let tar;
let code;
const wheel = document.querySelector('.wheel');

function rotate(t) {
    // console.log(t);
    if (st === undefined) {
        st = t;
        requestAnimationFrame(rotate);
        return;
    }

    RAFT = t;

    const deltaT = (t - oldt) / 1000;

    if (spin) agl = spinAni(t);
    else agl += agls * deltaT;
    
    scl = 1 - (1 - Math.min((t - st) / (sclt * 1000), 1)) ** 2;

    oldt = t;

    wheel.style.transform = 'rotate(' + agl + 'deg) scale(' + scl + ')';

    requestAnimationFrame(rotate);
}

function hideLoading() {
    const loadDot = document.querySelector('.loading');

    loadDot.classList.add('hide');
}

let pro = 1;
const proc = 2;

function showPro() {
    document.querySelector(`.loading .bar .pro:nth-child(${pro})`).style.width = (100 / proc * pro) + "%";
    pro++;
}

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

async function main() {
    addItem(await loadTT());

    showPro();

    const rep = await getKQ();

    showPro();

    hideLoading();

    tar = rep.tt;

    code = rep.maTT;

    requestAnimationFrame(rotate);
}

main();