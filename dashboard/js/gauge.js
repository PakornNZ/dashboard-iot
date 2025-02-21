let data = {};
let API_BASE_URL = "";

proxyAPI();

async function proxyAPI() {
    try {
        let res = await fetch("./API/proxyAPI.php");
        API_BASE_URL = await res.json();
        startUpdating();
    } catch (error) {
        console.error("Error:", error);
    }
}

async function startUpdating() {
    await fetchData();
    await fetchSensorStatus();
    setTimeout(startUpdating, 5000);
}

function feedTemp(callback) {
    let tick = { plot0: data.temp ?? 0 };
    callback(JSON.stringify(tick));
}

function feedHum(callback) {
    let tick = { plot0: data.hum ?? 0 };
    callback(JSON.stringify(tick));
}

function feedLdr(callback) {
    let tick = { plot0: data.light ?? 0 };
    callback(JSON.stringify(tick));
}

function feedWater(callback) {
    let tick = { plot0: data.water ?? 0 };
    callback(JSON.stringify(tick));
}

function feedPH(callback) {
    let tick = { plot0: data.ph ?? 0 };
    callback(JSON.stringify(tick));
}

async function fetchData() {
    try {
        let response = await fetch(`${API_BASE_URL}fetchData.php`);
        data = await response.json();
        console.log(data);
        return data;
    } catch (error) {
        console.error("Error:", error);
        return {};
    }
}

let ConfigTemp = {
    type: "gauge",
    globals: {
        fontSize: 12,
        'background-color': 'transparent'
    },
    plot: {
        size: '100%',
        valueBox: {
            placement: 'center',
            color: 'gray',
            text: '%v',
            fontSize: 25,
            rules: [
                { rule: '%v >= 35', text: '%v °C<br>🔥 Very Hot' },
                { rule: '%v < 35 && %v >= 28', text: '%v °C<br>☀️ Warm' },
                { rule: '%v < 28 && %v >= 25', text: '%v °C<br>🌤️ Cool' },
                { rule: '%v < 25', text: '%v °C<br>❄️ Cold' }
            ]
        }
    },
    scaleR: {
        aperture: 180,
        minValue: 0,
        maxValue: 60,
        step: 10,
        center: {
            visible: false
        },
        tick: {
            visible: false
        },
        item: {
            offsetR: 0,
            rules: [
                {
                    rule: '%i == 9',
                    offsetX: 15
                }
            ]
        },
        ring: {
            size: 20,
            rules: [
                { rule: '%v <= 15', backgroundColor: '#FFC100' },
                { rule: '%v > 15 && %v <= 30', backgroundColor: '#FF8A08' },
                { rule: '%v > 30 && %v <= 40', backgroundColor: '#FF6500' },
                { rule: '%v > 40', backgroundColor: '#C40C0C' }
            ]
        }
    },
    refresh: {
        type: "feed",
        transport: "js",
        url: "feedTemp()",
        interval:1000
    },
    series: [{
        values: [0],
        backgroundColor: '#8F1D14',
        indicator: [5, 5, 5, 5, 0.75],
        animation:{  
            effect:2,
            sequence:4,
            speed: 3000
        },
    }]
};

let ConfigHum = {
    type: "gauge",
    globals: {
        fontSize: 12,
        'background-color': 'transparent'
    },
    plot: {
        size: '100%',
        valueBox: {
            placement: 'center',
            color: 'gray',
            text: '%v %',
            fontSize: 25,
            rules: [
                { rule: '%v >= 65', text: '%v %<br>💦 Humid' }, 
                { rule: '%v < 65 && %v >= 35', text: '%v %<br>😊 Optimal' }, 
                { rule: '%v < 35', text: '%v %<br>🌵 Dry' } 
            ]
        }
    },
    scaleR: {
        aperture: 180,
        minValue: 0,
        maxValue: 100,
        step: 10,
        center: {
            visible: false
        },
        tick: {
            visible: false
        },
        item: {
            offsetR: 0,
            rules: [
                {
                    rule: '%i == 9',
                    offsetX: 15
                }
            ]
        },
        ring: {
            size: 20,
            rules: [
                { rule: '%v < 35', backgroundColor: '#B2DFDB' }, 
                { rule: '%v >= 35 && %v < 65', backgroundColor: '#4FC3F7' }, 
                { rule: '%v >= 65', backgroundColor: '#1565C0' } 
            ]
        }
    },
    refresh: {
        type: "feed",
        transport: "js",
        url: "feedHum()",
        interval:1000
    },
    series: [{
        values: [0],
        backgroundColor: '#393E46',
        indicator: [5, 5, 5, 5, 0.75],
        animation:{  
            effect:2,
            sequence:4,
            speed: 3000
        },
    }]
};

let ConfigLdr = {
    type: "gauge",
    globals: {
        fontSize: 12,
        'background-color': 'transparent'
    },
    plot: {
        size: '100%',
        valueBox: {
            placement: 'center',
            color: 'gray',
            text: '%v',
            fontSize: 25,
            rules: [
                { rule: '%v <= 100', text: '%v Lux<br>🌑 Dark' },
                { rule: '%v > 100 && %v <= 500', text: '%v Lux<br>🌒 Dim' },
                { rule: '%v > 500 && %v <= 1500', text: '%v Lux<br>🌓 Optimal' },
                { rule: '%v > 1500 && %v <= 2500', text: '%v Lux<br>🌔 Bright' },
                { rule: '%v > 2500', text: '%v Lux<br>🌕 Very Bright' }
            ]
        }
    },
    scaleR: {
        aperture: 180,
        minValue: 0,
        maxValue: 4096,
        step: 2,
        center: {
            visible: false
        },
        tick: {
            visible: false
        },
        item: {
            offsetR: 0,
            rules: [
                {
                    rule: '%i == 9',
                    offsetX: 15
                }
            ]
        },
        ring: {
            size: 20,
            rules: [
                { rule: '%v <= 912', backgroundColor: '#89A8B2' },
                { rule: '%v > 912 && %v <= 1824', backgroundColor: '#B3C8CF' },
                { rule: '%v > 1824 && %v <= 2736', backgroundColor: '#E5E1DA' },
                { rule: '%v > 2736 && %v <= 3648', backgroundColor: '#F1F0E8' },
                { rule: '%v > 3648', backgroundColor: '#FFF' }
            ]
        }
    }, 
    refresh: {
        type: "feed",
        transport: "js",
        url: "feedLdr()",
        interval:1000
    },
    series: [{
        values: [0],
        backgroundColor: '#393E46',
        indicator: [5, 5, 5, 5, 0.75],
        animation:{  
            effect:2,
            sequence:4,
            speed: 3000
        },
    }]
};

let ConfigWater = {
    type: "gauge",
    globals: {
        fontSize: 12,
        'background-color': 'transparent'
    },
    plot: {
        size: '100%',
        valueBox: {
            placement: 'center',
            color: 'gray',
            text: '%v',
            fontSize: 25,
            rules: [
                { rule: '%v > 20', text: '%v L/min<br>🌊 Strong Flow' }, 
                { rule: '%v > 10 && %v <= 20', text: '%v L/min<br>💦 Moderate Flow' },
                { rule: '%v <= 10', text: '%v L/min<br>💧 Low Flow' } 
            ]
        }
    },
    scaleR: {
        aperture: 180,
        minValue: 0,
        maxValue: 30,
        step: 10,
        center: {
            visible: false
        },
        tick: {
            visible: false
        },
        item: {
            offsetR: 0,
            rules: [
                {
                    rule: '%i == 9',
                    offsetX: 15
                }
            ]
        },
        ring: {
            size: 20,
            rules: [
                { rule: '%v < 10', backgroundColor: '#B3E5FC' },
                { rule: '%v >= 10 && %v < 20', backgroundColor: '#4FC3F7' }, 
                { rule: '%v >= 20', backgroundColor: '#0288D1' } 
            ]
        }
    },
    refresh: {
        type: "feed",
        transport: "js",
        url: "feedWater()",
        interval:1000
    },
    series: [{
        values: [0],
        backgroundColor: '#393E46',
        indicator: [5, 5, 5, 5, 0.75],
        animation:{  
            effect:2,
            sequence:4,
            speed: 3000
        },
    }]
};

let ConfigPH = {
    type: "gauge",
    globals: {
        fontSize: 12,
        'background-color': 'transparent'
    },
    plot: {
        size: '100%',
        valueBox: {
            placement: 'center',
            color: 'gray',
            text: '%v',
            fontSize: 25,
            rules: [
                { rule: '%v > 20', text: 'pH %v<br>Acidic' }, 
                { rule: '%v > 10 && %v <= 20', text: 'pH %v<br>Natural' },
                { rule: '%v <= 10', text: 'pH %v<br>Alkaline' } 
            ]
        }
    },
    scaleR: {
        aperture: 180,
        minValue: 0,
        maxValue: 14,
        step: 3,
        center: {
            visible: false
        },
        tick: {
            visible: false
        },
        item: {
            offsetR: 0,
            rules: [
                {
                    rule: '%i == 9',
                    offsetX: 15
                }
            ]
        },
        ring: {
            size: 20,
            rules: [
                { rule: '%v < 3', backgroundColor: '#FFD2A0' },
                { rule: '%v >= 3 && %v < 6', backgroundColor: '#EFB6C8' }, 
                { rule: '%v >= 6 && %v < 9', backgroundColor: '#A888B5' }, 
                { rule: '%v >= 9', backgroundColor: '#8174A0' } 
            ]
        }
    },
    refresh: {
        type: "feed",
        transport: "js",
        url: "feedPH()",
        interval:1000
    },
    series: [{
        values: [0],
        backgroundColor: '#393E46',
        indicator: [5, 5, 5, 5, 0.75],
        animation:{  
            effect:2,
            sequence:4,
            speed: 3000
        },
    }]
};

zingchart.render({
    id: 'tempChart',
    data: ConfigTemp,
    height: 300,
    width: '100%'
});

zingchart.render({
    id: 'humChart',
    data: ConfigHum,
    height: 300,
    width: '100%'
});

zingchart.render({
    id: 'ldrChart',
    data: ConfigLdr,
    height: 300,
    width: '100%'
});

zingchart.render({
    id: 'waterChart',
    data: ConfigWater,
    height: 300,
    width: '100%'
});

zingchart.render({
    id: 'pHChart',
    data: ConfigPH,
    height: 300,
    width: '100%'
});


