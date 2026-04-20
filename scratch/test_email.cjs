const SCRIPT_URL = "https://script.google.com/macros/s/AKfycbw0Q0G0boiiuMZI7ryu5iwFFqYq0tFwsLhdTgzW1O4QOYl21H1oBFtrnnZg_F_WAk2PTQ/exec";

const testData = {
  vol_name: "Antigravity Test",
  office_name: "Test Office",
  district: "coimbatore",
  block: "pollachi",
  audit_date: "2026-04-21",
  audit_time: "02:00",
  b_0: 'yes',
  b_0_notes: 'Automated test'
};

async function testSubmit() {
  console.log("Sending test submission to:", SCRIPT_URL);
  try {
    const response = await fetch(SCRIPT_URL, {
      method: 'POST',
      body: JSON.stringify(testData),
      headers: { 'Content-Type': 'application/json' }
    });
    console.log("Status:", response.status);
    const json = await response.json();
    console.log("Response JSON:", json);
  } catch (err) {
    console.error("Test failed:", err);
  }
}

testSubmit();
