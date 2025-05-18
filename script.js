const svLink = "https://gchsedjronrenjwafuyb.supabase.co";
const ap = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImdjaHNlZGpyb25yZW5qd2FmdXliIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDc1NDgwNDQsImV4cCI6MjA2MzEyNDA0NH0.O76q9gHvB6frsGQNdDoNrfHOOox9WDh5kxa4AORNwKw";
const reqTest = "https://gchsedjronrenjwafuyb.supabase.co/functions/v1/hyper-handler";

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

getKQ();

loadTT();