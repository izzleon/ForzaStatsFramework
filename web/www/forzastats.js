// -------------------------    Vars    -------------------------

// for getDiagrLineColor function
var color_count = 0;


// Stores diagram data
var data = {
    rpm: [0],
    speed: [0],
    gear: [0],
};


// diagram datasets
var datasets = [];

// diagram scales
var scales = {
    x: {
        ticks: {
            display: false
        }
    }
};


// -------------------------    Filling innitial data    -------------------------

for (const key in data) {
    if (Object.hasOwnProperty.call(data, key)) {
        const element = data[key];

        // create dataset
        datasets[key] = {
            label: key,
            data: data[key],
            borderColor: [
                getDiagrLineColor(),
            ],
            fill: false,
            tension: 0.1,
            yAxisID: 'y' + key,
        };

        // create scale
        scales['y' + key] = {
            beginAtZero: true,
        }

        for (let index = 0; index < 200; index++) {
            element[index] = 0;
        }

    }
}


// -------------------------    Chart Setup    -------------------------

var ctx = document.getElementById('StatsChart').getContext('2d');
var StatsChart = new Chart(ctx, {
    type: 'line',
    data: {
        labels: data.rpm,
        datasets: datasets,
    },
    options: {
        scales: scales,
        animation: {
            duration: 0
        },
        responsive: true,
        maintainAspectRatio: false,
    }
});


// -------------------------    AJAX REQUEST    -------------------------

const xmlhttp = new XMLHttpRequest();

xmlhttp.onload = function () {
    updateData(JSON.parse(this.responseText));
}

setInterval(() => {
    xmlhttp.open("GET", "/data.json", true);
    xmlhttp.send();
}, 10);


// -------------------------    MAIN UPDATE LOGIC    -------------------------

function updateData(forza_data) {

    // store new values
    data.rpm.push((forza_data.car.currentEngineRpm > 0) ? Math.floor(forza_data.car.currentEngineRpm) : 0);
    data.speed.push((forza_data.car.speed > 0) ? (Math.floor(forza_data.car.speed) * 3.6).toFixed(0) : 0);
    data.gear.push((forza_data.car.gear > 0) ? forza_data.car.gear : 0);

    for (const key in data) {
        if (Object.hasOwnProperty.call(data, key)) {
            const element = data[key];

            // if stored values are more than 300, delete first one
            if (element.length > 300) {
                element.shift();
            }

            // update stats tags html
            document.getElementById('stats_' + key).innerHTML = element[element.length - 1];
        }
    }

    document.getElementById('stats_car_name').innerHTML = forza_data.car.brand + " " + forza_data.car.model
    document.getElementById('stats_car_info').innerHTML = forza_data.car.class + " " + forza_data.car.performanceIndex + " " + forza_data.car.drivetrainType;

    document.getElementById('stats_misc').innerHTML = JSON.stringify(forza_data, null, 4);

    StatsChart.data.labels = data.rpm;
    StatsChart.data.datasets = [];

    for (const key in data) {
        if (Object.hasOwnProperty.call(data, key)) {
            StatsChart.data.datasets.push(datasets[key]);
        }
    }

    StatsChart.update();
}


// -------------------------    helperfunctions    -------------------------

function getDiagrLineColor() {
    let colors = ['rgba(255, 99, 132, 1)', 'rgba(99, 255, 132, 1)', 'rgba(30, 99, 255, 1)'];
    return colors[color_count++];
}