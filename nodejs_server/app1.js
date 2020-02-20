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
let data = { "id": 95, "t": "", "h": " NAN", "g": -1, "p": -1, "r": -1 };
let mail_flag = 1;
let myObj = {};
myObj.value=[];
myObj.value[1]={};
fake1=[28,28,28,29,30,32,32,33,33,33,30,29,28,27,25,24,25,25,25,26,26,27,27,28,29,29,30,32,32,33,33,34,34,32,31,30,29,28,27,27,27,26,27,26,25,27,27]
fake2=[27,28,28,30,31,33,33,35,35,35,33,30,29,28,26,25,24,24,24,26,26,28,27,28,29,29,31,33,33,34,35,35,36,33,32,31,29,28,27,26,25,25,25,24,25,26,27]
fake3=[56,55,55,55,53,51,49,48,48,50,55,59,61,61,62,62,63,63,63,62,62,63,61,60,59,59,59,55,52,49,48,48,46,49,55,55,60,61,62,63,62,61,62,62,61,57,57]
fake4=[58,57,56,56,53,50,48,47,45,50,55,59,61,62,63,64,64,64,64,65,63,63,61,60,58,58,57,54,51,49,47,47,44,48,52,55,60,61,62,63,62,63,62,62,61,60,60]

MongoClient.connect(url, function (err, db) {
  if (err) throw err;
  console.log("Database created!");

  db.close();
});
var i=46;
function a(){
console.log(i);
    data.id=95;
    data.t = fake2[i];
    data.h = fake4[i];
    add(i);

    data.id=97;
    data.t = fake1[i];
    data.h = fake3[i];
    add(i);
    if(i>0)
    insert_data();
    i--;
}

server.listen(PORT, function () {
  console.log("Server running at address: " + ip.address() + ":" + PORT)
})

app.get('/', function (req, res) {
  res.sendfile('html/login.html');
});
function add(x) {
  if (data != null) {
  switch (data.id) {
    case 95:
      myObj.value[0] = {};
      myObj.value[0].id = data.id;
      myObj.value[0].temperature = data.t;
      myObj.value[0].humidity = data.h;
      myObj.value[0].pressure = data.p;
      myObj.value[0].gas = data.g;
      myObj.value[0].rain = data.r;
      break;
    case 96:
      myObj.value[1].id = data.id;
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
      myObj.value[2].id = data.id;
      myObj.value[2].temperature = data.t;
      myObj.value[2].humidity = data.h;
      myObj.value[2].pressure = data.p;
      myObj.value[2].gas = data.g;
      myObj.value[2].rain = data.r;
      break;
      }
  }
    myObj.date = new Date();
    myObj.date.setHours(myObj.date.getHours()-x-14);
}



function insert_data() {
  MongoClient.connect(url, function (err, client) {
    assert.equal(null, err);
    var db = client.db('linux-gateway');
    db.collection("chartCollection").insertOne(myObj, function (err, res) {
      if (err) throw err;
      console.log(myObj);
      myObj=null;
      myObj={};
      myObj.value=[];
      myObj.value[1]={};
    });
    client.close();
  });
}


//setInterval(function () { collect_data(); }, 3600000);
//setInterval(function () { push_mess(); }, 5000);
setInterval(function () { a();}, 500)
