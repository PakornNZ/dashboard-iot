let stateLED1 = false;
let stateLED2 = false;
let stateDHT = false;
let stateFAN = false;
let stateLDR = false;
let statePH = false;
let stateWATER = false;
let stateFlow = false;
let valueFAN = 0;

function fetchSensorControl(sensor) {
    let statusFetch;
    let checkbox = document.getElementById(`${sensor}-btn`);
    checkbox.disabled = true;
    
    if (sensor == "led1") {
        statusFetch = !stateLED1;
        stateLED1 = statusFetch;
    } else if (sensor == "led2") {
        statusFetch = !stateLED2;
        stateLED2 = statusFetch;
    }
    fetch(`${API_BASE_URL}fetchSensor.php`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({sensor: sensor, status: statusFetch})
    })
    .then(response => response.json())
    .then(data => {
        console.log(data);
        fetchSensorStatus();
    })
    .catch(error => console.error("Error:", error))
    .finally(() => {
        checkbox.disabled = false;
    });
}

async function fetchSensorStatus() {
    fetch(`${API_BASE_URL}fetchSensor.php`)
    .then(response => response.json())
    .then(data => {
        stateLED1 = data.led1.status;
        stateLED2 = data.led2.status;
        stateDHT = data.dht.status;
        stateFAN = data.fan.status;
        valueFAN = data.fan.value;
        stateLDR = data.ldr.status;
        statePH = data.ph.status;
        stateWATER = data.water.status;
        stateFlow = data.flow.status;
        updateButtonStatus();
    })
    .catch(error => console.error("Error:", error));
}

function updateButtonStatus() {
    document.getElementById("led1-btn").checked = stateLED1;
    document.getElementById("led2-btn").checked = stateLED2;

    let tempStatus = document.querySelector("#tempChart")?.parentElement.querySelector(".gauge-status div");
    let humStatus = document.querySelector("#humChart")?.parentElement.querySelector(".gauge-status div");
    let ldrStatus = document.querySelector("#ldrChart")?.parentElement.querySelector(".gauge-status div");
    let waterStatus = document.querySelector("#waterChart")?.parentElement.querySelector(".gauge-status div");
    let pHStatus = document.querySelector("#pHChart")?.parentElement.querySelector(".gauge-status div");
    tempStatus.style.backgroundColor = stateDHT ? "#28f321" : "#ff0000";
    humStatus.style.backgroundColor = stateDHT ? "#28f321" : "#ff0000";
    ldrStatus.style.backgroundColor = stateLDR ? "#28f321" : "#ff0000";
    waterStatus.style.backgroundColor = stateWATER ? "#28f321" : "#ff0000";
    pHStatus.style.backgroundColor = statePH ? "#28f321" : "#ff0000";

    let fanInput = document.getElementById("fan-input");
    fanInput.placeholder = "Active temp " + valueFAN + "°C";
    let fan = document.querySelector(".fan");
    if (fan) {
        if (stateFAN) {
            fan.style.animation = "spin 2s linear infinite";
        } else {
            fan.style.animation = "none";
        }
    }
}
