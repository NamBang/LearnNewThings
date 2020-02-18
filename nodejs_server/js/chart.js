//import { getDefaultSettings } from "http2";

var socket = io();

var temChart = document.getElementById("tem").getContext("2d");
var humChart = document.getElementById("hum").getContext("2d");
var rainChart = document.getElementById("rain").getContext("2d");


socket.on('connect', () => {
    var mess = {};
    mess.type = "chart";
    socket.emit('type', mess);
    socket.on('draw_chart', function (data_chart) {
        var ChartTem = new Chart(temChart, {
            type: 'line',
            data: {
                labels: ["0h", "1h", "2h", "3h", "4h", "5h", "6h", "7h", "8h", "9h", "10h", "11h", "12h", "13h", "14h", "15h", "16h", "17h", "18h", "19h", "20h", "21h", "22h", "23h"],
                datasets: [{
                    label: 'Tempature',
                    data: data_chart.temperature,
                    backgroundColor: "rgba(75,192,192,0.4)",
                    borderColor: "rgba(75,192,192,1)",
                    borderCapStyle: 'butt',
                    borderDash: [],
                    borderDashOffset: 0.0,
                    borderJoinStyle: 'miter',
                    pointBackgroundColor: "rgba(75,192,192,1)",
                    pointBorderWidth: 1,
                    pointHoverRadius: 5,
                    pointHoverBackgroundColor: "rgba(75,192,192,1)",
                    pointHoverBorderColor: "rgba(75,192,192,1)",
                    pointHoverBorderWidth: 2,
                    pointRadius: 1,
                    pointHitRadius: 1,
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                scales: {
                    yAxes: [{
                        ticks: {
                            beginAtZero: true
                        }
                    }]
                }
            }
        });

        var CharHum = new Chart(humChart, {
            type: 'line',
            data: {
                labels: ["0h", "1h", "2h", "3h", "4h", "5h", "6h", "7h", "8h", "9h", "10h", "11h", "12h", "13h", "14h", "15h", "16h", "17h", "18h", "19h", "20h", "21h", "22h", "23h"],
                datasets: [{
                    label: 'Humidity',
                    data: data_chart.humidity,
                    backgroundColor: "rgba(75,192,192,0.4)",
                    borderColor: "rgba(75,192,192,1)",
                    borderCapStyle: 'butt',
                    borderDash: [],
                    borderDashOffset: 0.0,
                    borderJoinStyle: 'miter',
                    pointBackgroundColor: "rgba(75,192,192,1)",
                    pointBorderWidth: 1,
                    pointHoverRadius: 5,
                    pointHoverBackgroundColor: "rgba(75,192,192,1)",
                    pointHoverBorderColor: "rgba(75,192,192,1)",
                    pointHoverBorderWidth: 2,
                    pointRadius: 1,
                    pointHitRadius: 1,
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                scales: {
                    yAxes: [{
                        ticks: {
                            beginAtZero: true
                        }
                    }]
                }
            }
        });

        var CharRain = new Chart(rainChart, {
            type: 'line',
            data: {
                labels: ["ngày 1", "2", "3", "4", "5", "6", "7", "8", "9", "10", "11", "12", "13", "14", "15", "16", "17", "18", "19", "20", "21", "22", "23", "24", "25", "26", "27", "28", "29", "30"],
                datasets: [{
                    label: 'rain',
                    data: data_chart.rain,
                    backgroundColor: "rgba(75,192,192,0.4)",
                    borderColor: "rgba(75,192,192,1)",
                    borderCapStyle: 'butt',
                    borderDash: [],
                    borderDashOffset: 0.0,
                    borderJoinStyle: 'miter',
                    pointBackgroundColor: "rgba(75,192,192,1)",
                    pointBorderWidth: 1,
                    pointHoverRadius: 5,
                    pointHoverBackgroundColor: "rgba(75,192,192,1)",
                    pointHoverBorderColor: "rgba(75,192,192,1)",
                    pointHoverBorderWidth: 2,
                    pointRadius: 1,
                    pointHitRadius: 1,
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                scales: {
                    yAxes: [{
                        ticks: {
                            beginAtZero: true
                        }
                    }]
                }
            }
        });

    })

})

function getDate() {
    let date = {};
    date.y = document.getElementById("date").value.substr(0, 4);
    date.m = document.getElementById("date").value.substr(5, 2);
    date.d = document.getElementById("date").value.substr(8, 2);
    console.log(date);
    socket.emit("rq_chart", date);
}

function move_home() {
    window.location.href = window.location.protocol + '//' + window.location.host + "/html/index.html";
}

function getCookie(name) {
    var nameEQ = name + "=";
    //alert(document.cookie);
    var ca = document.cookie.split(';');
    for (var i = 0; i < ca.length; i++) {
        var c = ca[i];
        while (c.charAt(0) == ' ') c = c.substring(1);
        if (c.indexOf(nameEQ) != -1) return c.substring(nameEQ.length, c.length);
    }
    return null;
}
