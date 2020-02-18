var socket = io();
socket.on('connect', () => {
    var mess = {};
    mess.type = "index";
    mess.username = getCookie('username');
    socket.emit('type', mess);
    // display_account_info(message.account, message.email);
    socket.on('sensor_data', function (message) {
        if(message.temperature.value && message.temperature.value != " NAN") {
            add_implement('temperature-low',message.temperature.value + "°C", message.temperature.id);
            console.log("add temp");
        }else remove_implement('temperature'+message.temperature.id);
        if(message.humidity.value && message.humidity.value != " NAN") {
            add_implement('tint',message.humidity.value + " %", message.humidity.id);
            console.log("add temp");
        }else remove_implement('tint' + message.humidity.id);
        if (message.gas.value && message.gas.value != -1) {
            add_implement('fire', message.gas.value, message.gas.id);
            console.log("add temp");
        } else remove_implement('fire' + message.gas.id);
        if(message.pressure.value && message.pressure.value != -1) {
            add_implement('tachometer-alt',message.pressure.value + "Pa", message.pressure.id);
            console.log("add temp");
        }else remove_implement('tachometer-alt' + message.pressure.id);
        if(message.rain.value && message.rain.value != -1) {
            add_implement('cloud-sun-rain',message.rain.value, message.rain.id);
            console.log("add temp");
        }else remove_implement('cloud-sun-rain' + message.rain.id);
    })
    socket.on("data_user", function (mess) {
        document.getElementById("user").innerHTML = mess.username;
        document.getElementById("email").innerHTML = mess.email;
    })
})

function add_implement(implement_type, data_sensor, id) {
    if (document.getElementById(implement_type + id) != null)
        remove_implement(implement_type + id);
    var div = document.createElement('div');
    div.innerHTML = "<div class=\"vault-item-thumbnail\"> \
                        <i class=\"fas fa-" + implement_type + " aria-hidden=\"true\"></i> \
                    </div> \
                    <div class=\"vault-item-info\"> \
                        <i class=\"vault-item-name\"> "+ data_sensor +" </i> \
                        <i class=\"vault-item-summary\"> nodeId:"+ id + " </i> \
                    </div>";
    div.setAttribute('class', 'vault-item ' + implement_type + '-item');
    div.setAttribute('id', implement_type+id);
    div.setAttribute('tabindex', '0');
    document.getElementById("items_container").appendChild(div);

}

function remove_implement(id) {
    if (document.getElementById(id) != null)
        document.getElementById(id).remove();
}

function logout() {
    document.cookie = "username=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
    window.location.href = window.location.protocol + '//' + window.location.host;
}

function move_chart() {
    window.location.href = window.location.protocol + '//' + window.location.host + "/html/chart.html";
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
