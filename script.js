const svLink = "https://gchsedjronrenjwafuyb.supabase.co";
const ap = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImdjaHNlZGpyb25yZW5qd2FmdXliIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDc1NDgwNDQsImV4cCI6MjA2MzEyNDA0NH0.O76q9gHvB6frsGQNdDoNrfHOOox9WDh5kxa4AORNwKw";
const reqTest = "https://gchsedjronrenjwafuyb.supabase.co/functions/v1/hyper-handler";

//const sb = supabase.createClient(svLink, ap);

async function loadTT() {
    const { data, error } = await sb
    .from("DSTrungThuong")
    .select("*");

    if (error) {
        console.error(error);
    } else {
        console.log(data);
    }
}

async function getKQ() {
    const bodyData = {
        name: 'khoa', 
    };

    const response = await fetch(reqTest, {
        method: "POST",
        headers: {
        "Content-Type": "application/json",
        // Nếu function yêu cầu auth, thêm header Authorization:
        // "Authorization": "Bearer YOUR_SUPABASE_ANON_OR_ACCESS_TOKEN"
        },
        body: JSON.stringify(bodyData)
    });

    if (!response.ok) {
        console.error("Lỗi khi gọi function:", response.statusText);
        return;
    }

    const data = await response.json();
    console.log("Kết quả từ function:", data);
}

//getKQ();

//loadTT();

function addItem(arr) {
    const aglPerItem = 360 / arr.length;
    const wheel = document.querySelector('.wheel');
    const wheelR = wheel.getBoundingClientRect().width * .85 / 2 - 50;

    wheel.innerHTML = "";
    // wheel.innerHTML = "<div class='spinBtn' onclick='spinClick();'>Spin</div>";

    const colors = [
        'rgb(255, 82, 82)',   // đỏ tươi
        'rgb(255, 193, 7)',   // vàng sáng
        'rgb(76, 175, 80)',   // xanh lá sáng
        'rgb(33, 150, 243)',  // xanh dương sáng
        'rgb(156, 39, 176)',  // tím
        'rgb(255, 87, 34)',   // cam
        'rgb(0, 188, 212)',   // cyan
        'rgb(205, 220, 57)'   // vàng chanh
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
        item.innerHTML = '<p>' + e + '</p>';
        item.style.backgroundColor = colors[i % clen];

        wheel.append(item);

        const apItem = document.querySelector('.wheel .item:nth-child(' + (i + 1) + ') p');
        console.log(i, apItem);
        const apItemRect = apItem.getBoundingClientRect();

        //apItem.style.fontSize = (apItemRect.height * wheelR / apItemRect.width) + "px";

        document.querySelector('.wheel .item:nth-child(' + (i + 1) + ')').style.transform = "rotate(" + (i * aglPerItem) + "deg)";
    });
}

addItem(['cc', 'cl', '1', '2', 'gygyrdrdrdrdrdrdrdg3']); 

let agl = 0;
let agls = 20;
let oldt = 0;
let scl = 0;
let sclt = 1;
let spina = -200;
let spinv;
let spin = false;

function spinClick() {
    spin = true;
    spinv = 1000 + agls;
    console.log('spin', spin);
}

function showRe() {
    
}

function rotate(t) {
    const wheel = document.querySelector('.wheel');
    const deltaT = (t - oldt) / 1000;

    // if (spin) spinv += spina * deltaT;

    if (spinv <= 0) {
        spinv = 0;
    } else {
        if (spin) spinv += spina * deltaT;
    }

    agl += (spin ? spinv : agls) * deltaT;
    scl = 1 - (1 - Math.min(t / (sclt * 1000), 1)) ** 2;

    oldt = t;

    wheel.style.transform = 'rotate(' + agl + 'deg) scale(' + scl + ')';

    requestAnimationFrame(rotate);
}

requestAnimationFrame(rotate);