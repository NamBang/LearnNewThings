const PORT = 8000;
var assert = require('assert');
var express = require('express');
var cookieParser = require('cookie-parser');
var app = express();
app.use(express.static(__dirname + '/'));
var ip = require('ip');
var http = require('http');					//#include thu vien http -
var socketio = require('socket.io');			//#include thu vien socketio
var server = http.createServer(app);
var io = socketio(server);
var MongoClient = require('mongodb').MongoClient;
var url = "mongodb://localhost:27017/linux-gateway";
var nodemailer = require('nodemailer');
let data = { "id": -1, "t": " NAN", "h": " NAN", "g": -1, "p": -1, "r": -1 };
let mail_flag = 1;
let myObj = {};
myObj.value=[];
myObj.value[1]={};
const option = {
  service: 'gmail',
  port: 465,
  secure: false,
  auth: {
    user: 'gateway.iot2020@gmail.com', // email hoặc username
    pass: 'singuyen1' // password
  }, tls: {
    rejectUnauthorized: false
  }
};
var transporter = nodemailer.createTransport(option);

transporter.verify(function (error, success) {
  // Nếu có lỗi.
  if (error) {
    console.log(error);
  } else { //Nếu thành công.
    console.log('Kết nối thành công!');
  }
});

var mail = {
  from: 'gateway.iot2020@gmail.com', // Địa chỉ email của người gửi
  to: 'nambangn@gmail.com', // Địa chỉ email của người gửi
  subject: 'Thư được gửi bằng Node.js', // Tiêu đề mail
  text: 'bangoccho', // Nội dung mail dạng text
  html: '<h1>Toidicode.com</h1>' // Nội dung mail dạng html
};
//Tiến hành gửi email


MongoClient.connect(url, function (err, db) {
  if (err) throw err;
  console.log("Database created!");
  // push_mess();
  db.close();
});

server.listen(PORT, function () {
  console.log("Server running at address: " + ip.address() + ":" + PORT)
})

app.get('/', function (req, res) {
  res.sendfile('html/login.html');
});
var allWebClients = [];
var mqtt = require('mqtt')
var mqtt_client = mqtt.connect('mqtt://test.mosquitto.org')

mqtt_client.on('connect', function () {
  mqtt_client.subscribe('data_rf', function (err) {
    if (!err) {
      console.log("subscribe data_rf success");
    } else { console.log("subscribe data_rf error: " + err); }
  })

  mqtt_client.subscribe('data_lora', function (err) {
    if (!err) {
      console.log("subscribe data_lora success");
    } else { console.log("subscribe data_lora error: " + err); }
  })

  mqtt_client.subscribe('data_bl', function (err) {
    if (!err) {
      console.log("subscribe data_bl success");
    } else { console.log("subscribe data_bl error: " + err); }
  })

  mqtt_client.subscribe('data_wifi', function (err) {
    if (!err) {
      console.log("subscribe data_wifi success");
    } else { console.log("subscribe data_wifi error: " + err); }
  })

})

function enable_mail() {
  mail_flag = 1;
}

function isJson(str){
  try {
   JSON.parse(str);
  } catch (e) {
    return false;
  }
  return true
}

function isDate(x){
  try {
   x.getMonth();
  } catch (e) {
    return false;
  }
  return true
}


mqtt_client.on('message', function (topic, message) {
  console.log(message.toString())
  if(isJson(message)){
  data = JSON.parse(message);
  }
  if (data != null) {
  switch (data.id) {
    case 95:
      myObj.value[0] = {};
      myObj.value[0].id = "LoRa";
      myObj.value[0].temperature = data.t;
      myObj.value[0].humidity = data.h;
      myObj.value[0].pressure = data.p;
      myObj.value[0].gas = data.g;
      myObj.value[0].rain = data.r;
      var msg_to_node = {
        'NodeId': 12,
        'Fan': 13,
        'Humidity': 13,
        'Light': 13,
        'Light_Hex': 23,
        'Pump': 28
    };
    mqtt_client.publish('addID', JSON.stringify(msg_to_node));      
      break;
    case 96:
      myObj.value[1].id = "RF";
      if(data.t)
        myObj.value[1].temperature = data.t;
      if(data.h)
        myObj.value[1].humidity = data.h;
      if(data.p)
        myObj.value[1].pressure = data.p;
      if(data.g)
        myObj.value[1].gas = data.g;
      if(data.r)
        myObj.value[1].rain = data.r;
      break;
    case 97:
      myObj.value[2] = {};
      myObj.value[2].id = "Bluetooth";
      myObj.value[2].temperature = data.t;
      myObj.value[2].humidity = data.h;
      myObj.value[2].pressure = data.p;
      myObj.value[2].gas = data.g;
      myObj.value[2].rain = data.r;
      break;
    case 94:
      myObj.value[3] = {};
      myObj.value[3].id = "Wifi";
      myObj.value[3].temperature = data.t;
      myObj.value[3].humidity = data.h;
      myObj.value[3].pressure = data.p;
      myObj.value[3].gas = data.g;
      myObj.value[3].rain = data.r;
    }
  }
    myObj.date = new Date();
  if (data.g > 900 && mail_flag) {
    transporter.sendMail(mail, function (error, info) {
      if (error) { // nếu có lỗi
        console.log(error);
      } else { //nếu thành công
        console.log('Email sent: ' + info.response);
        mail_flag = 0;
        setTimeout(enable_mail, 60000);
      }
    });
  }
})


function push_mess() {
    allWebClients.forEach(function (socket) {
      socket.emit("sensor_data", myObj);
    })
}

function insert_data() {
  MongoClient.connect(url, function (err, client) {
    assert.equal(null, err);
    var db = client.db('linux-gateway');
    db.collection("myCollection").insertOne(myObj, function (err, res) {
      if (err) throw err;
      console.log(myObj);
      myObj={};
      myObj.value=[];
      myObj.value[1]={};
    });
    client.close();
  });
}

function collect_data() {
  MongoClient.connect(url, function (err, client) {
    assert.equal(null, err);
    var db = client.db('linux-gateway');
    db.collection("chartCollection").insertOne(myObj, function (err, res) {
      if (err) throw err;
      console.log("1 document inserted");
    });
    client.close();
  });
}

setInterval(function () { collect_data(); }, 3600000);
setInterval(function () { push_mess(); }, 3000);
setInterval(function () { insert_data();}, 60000)
io.on('connection', function (socket) {	//'connection' (1) nay khac gi voi 'connection' (2)
  console.log("Connected"); //In ra windowm console la da co mot Socket mqtt_client ket noi thanh cong.
  allWebClients.push(socket);
  socket.on('type', function (msg) {
    switch (msg.type) {
      case 'login':
        console.log("sideptrai");
        socket.on('seasion-info', function (message) {
          MongoClient.connect(url, function (err, client) {
            assert.equal(null, err);

            var querryObj = { 'username': message.username };
            var db = client.db('linux-gateway');
            db.collection("user").findOne(querryObj, function (err, result) {
              assert.equal(null, err);
              var dataObject = {};
              if ((result) && (result.seasionKey == message.seasion)) {
                dataObject.seasionStatus = true;
                dataObject.userInfo = message;
                socket.emit('queryLogin', dataObject);
                console.log(dataObject);
              } else {
                dataObject.seasionKeyStatus = false;
                socket.emit('queryLogin', dataObject);
              }
              client.close();
            });
          });
        })
        socket.on('login-info', function (message) {
          checkLoginAccount(message.username, message.pass, (seasionKeyObject) => {
            socket.emit('login-request', seasionKeyObject);
          });
        });
        socket.on('signup-info', function (message) {
          MongoClient.connect(url, function (err, client) {
            assert.equal(null, err);
            var db = client.db('linux-gateway');
            db.collection("user").insert({
              username: message.username,
              pass: message.pass,
              email: message.email,
            })
            client.close();
          });
        });
        break;
      case 'index':
        MongoClient.connect(url, function (err, client) {
          assert.equal(null, err);
          var querryObj = { 'username': msg.username };
          var db = client.db('linux-gateway');
          db.collection("user").findOne(querryObj, function (err, result) {
            assert.equal(null, err);
            var dataObject = {};
            if (result) {
              dataObject.username = msg.username;
              dataObject.email = result.email;
              socket.emit('data_user', dataObject);
            }
            client.close();
          });
        });
        break;
      case 'chart':
        MongoClient.connect(url, function (err, client) {
          assert.equal(null, err);
          var querryObj = { 'username': msg.username };
          var db = client.db('linux-gateway');
          db.collection("user").findOne(querryObj, function (err, result) {
            assert.equal(null, err);
            var dataObject = {};
            if (result) {
              dataObject.username = msg.username;
              dataObject.email = result.email;
              socket.emit('data_user', dataObject);
            }
            client.close();
          });
        });

        socket.on("rq_chart", function (mess) {
          MongoClient.connect(url, function (err, client) {
            assert.equal(null, err);
            var db = client.db('linux-gateway');
            db.collection("chartCollection").find({}).toArray(function (err, result) {
              if (err) throw err;
              let data_chart = [];
	      data_chart[0] = {};
	      data_chart[1] = {};
 	      data_chart[2] = {};
              data_chart[0].temperature = [];
              data_chart[0].humidity = [];
              data_chart[0].rain = [];
              data_chart[1].temperature = [];
              data_chart[1].humidity = [];
              data_chart[1].rain = [];
              data_chart[2].temperature = [];
              data_chart[2].humidity = [];
              data_chart[2].rain = [];
              console.log(result)   
              result.forEach(function(obj) {
               if(isDate(obj.date)) { 
                if(("0" + (obj.date.getMonth() + 1)).slice(-2) == mess.m) {
                  if(obj.value[0])
		    data_chart[0].rain[obj.date.getDate() - 1] = obj.value[0].rain;
                  if(obj.value[1])
                    data_chart[1].rain[obj.date.getDate() - 1] = obj.value[1].rain;
                  if(obj.value[2])
                    data_chart[2].rain[obj.date.getDate() - 1] = obj.value[2].rain;
                  if(obj.date.getDate() == mess.d) {
                    if(obj.value[0])
                      data_chart[0].temperature[obj.date.getHours() - 1] = obj.value[0].temperature;
                    if(obj.value[1])
                      data_chart[1].temperature[obj.date.getHours() - 1] = obj.value[1].temperature;
                    if(obj.value[2])
                      data_chart[2].temperature[obj.date.getHours() - 1] = obj.value[2].temperature;
                    if(obj.value[0])
                      data_chart[0].humidity[obj.date.getHours() - 1] = obj.value[0].humidity;
                    if(obj.value[1])
                      data_chart[1].humidity[obj.date.getHours() - 1] = obj.value[1].humidity;
                    if(obj.value[2])
                      data_chart[2].humidity[obj.date.getHours() - 1] = obj.value[2].humidity;
                  }
                }
                }
              })
              console.log(data_chart);
              socket.emit('draw_chart', data_chart);
            });
            client.close();
          });
        })
        break;
    }
  });
  socket.on('disconnect', function () {
    console.log('Got disconnect!');
    var i = allWebClients.indexOf(socket);
    allWebClients.splice(i, 1);
  });
})

function checkLoginAccount(username, password, callback) {
  var resultObject = {};
  MongoClient.connect(url, function (err, client) {
    assert.equal(null, err);

    var querryObj = { 'username': username };
    var db = client.db('linux-gateway');
    db.collection("user").findOne(querryObj, function (err, result) {
      assert.equal(null, err);

      if ((result) && (result.pass == password)) {
        resultObject.accountAvailability = true;

        // Generate Seasion key
        var str = "";
        for (; str.length < 32; str += Math.random().toString(36).substr(2));
        resultObject.seasionKey = str.substr(0, 32); 8

        var updateValue = {
          $set: {
            'seasionKey': resultObject.seasionKey,
          }
        };

        console.log(updateValue);
        db.collection("user").updateOne(querryObj, updateValue, function (err, res) {
          assert.equal(null, err);
          console.log("MONGO: 1 document updated");
          client.close();
        })
        callback(resultObject);
      } else {
        resultObject.accountAvailability = false;
        callback(resultObject);
      }

      client.close();
    });
  });
}


