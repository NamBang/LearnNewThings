var socket = io();
socket.on('connect', () => {
    var mess = {};
    mess.type = "index";
    mess.username = getCookie('username');
    socket.emit('type', mess);
    // display_account_info(message.account, message.email);
    socket.on('sensor_data', function (mess) {
        console.log(mess);
        for(i=0; i<4; i++){
          if(mess.value[i]){
            var message = mess.value[i];
            console.log(message);
            if(message.temperature && message.temperature != " NAN" && message.temperature != "0" && message.temperature != 'nan') {
                add_implement('temperature-low',message.temperature + "°C", message.id);
            }else remove_implement('temperature-low'+message.id);
            if(message.humidity && message.humidity != " NAN" && message.humidity !="0" && message.humidity != "nan"){
                add_implement('tint',message.humidity + " %", message.id);
            }else remove_implement('tint' + message.id);
            if (message.gas && message.gas != -1) {
                add_implement('fire', message.gas, message.id);
            } else remove_implement('fire' + message.id);
            if(message.pressure && message.pressure != -1) {
                add_implement('tachometer-alt',message.pressure + "Pa", message.id);
            }else remove_implement('tachometer-alt' + message.id);
            if(message.rain && message.rain != -1) {
  	        if(message.rain=1)
                add_implement('cloud-sun-rain',"Khong mua", message.id);
                else add_implement('cloud-sun-rain',"Co mua", message.id);
            }else remove_implement('cloud-sun-rain' + message.id);
          }else {
            remove_implement('temperature' + String(95+i));
            remove_implement('tint' + String(95+i));
            remove_implement('fire' + String(95+i));
            remove_implement('tachometer-alt' + String(95+i));
            remove_implement('cloud-sun-rain' + String(95+i));
          }
        } 
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

function addId(){
    window.location.href = window.location.protocol + '//' + window.location.host + "/html/idGateway.html";

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
