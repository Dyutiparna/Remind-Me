/*
 * Licensed to the Apache Software Foundation (ASF) under one
 * or more contributor license agreements.  See the NOTICE file
 * distributed with this work for additional information
 * regarding copyright ownership.  The ASF licenses this file
 * to you under the Apache License, Version 2.0 (the
 * "License"); you may not use this file except in compliance
 * with the License.  You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an
 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 * KIND, either express or implied.  See the License for the
 * specific language governing permissions and limitations
 * under the License.
 */
 var info = null;
var app = {
    // Application Constructor
    initialize: function() {
        document.addEventListener('deviceready', this.onDeviceReady.bind(this), false);
    },

    // deviceready Event Handler
    //
    // Bind any cordova events here. Common events are:
    // 'pause', 'resume', etc.
    onDeviceReady: function() {
            this.receivedEvent('deviceready');
            console.log(navigator.notification);
            navigator.notification.vibrate(3000);
            if(!localStorage.getItem("rp_data"))
            {
              var rp_data = {data: []};
              localStorage.setItem("rp_data", JSON.stringify(rp_data));
            }

            info = JSON.parse(localStorage.getItem("rp_data"));
    },
    

    // Update DOM on a Received Event
    receivedEvent: function(id) {
        console.log('cordova ' , cordova.file);
        /*if(!window.localStorage.getItem('reminder'))
            window.localStorage.setItem('reminder','{"text":"wake me up"}');
        else
            alert(window.localStorage.getItem('reminder'));*/
    }
};


/*function createFile() {
   
    if(!window.localStorage.getItem('reminder'))
            window.localStorage.setItem('reminder','{"text":"wake me up"}');
        else
            alert(window.localStorage.getItem('reminder'));*/
   /*var type = window.TEMPORARY;
   var size = 5*1024*1024;
   window.resolveLocalFileSystemURL(type, size, successCallback, errorCallback)

   function successCallback(fs) {
      fs.root.getFile('log.txt', {create: true, exclusive: true}, function(fileEntry) {
         alert('File creation successfull!')
      }, errorCallback);
   }

   function errorCallback(error) {
      alert("ERROR: " + error.code)
   }
}*/

/*function removeFile() {
   var type = window.TEMPORARY;
   var size = 5*1024*1024;
   window.resolveLocalFileSystemURL(type, size, successCallback, errorCallback)

   function successCallback(fs) {
      fs.root.getFile('log.txt', {create: false}, function(fileEntry) {

         fileEntry.remove(function() {
            alert('File removed.');
         }, errorCallback);
      }, errorCallback);

   }

   function errorCallback(error) {
      alert("ERROR: " + error.code)
   }
}*/ 
function saveFile()
{
  var date = document.getElementById('myDate').value;
  var time = document.getElementById('myTime').value;
  var message = document.getElementById('noteInput').value;
  if(date === '' || time === '' || message === '')
  {
      alert("You missed something.");
  }
 else
    alert("Reminder set!");

  
  var schedule_time = new Date((date + " " + time).replace(/-/g, "/")).getTime();
    schedule_time = new Date(schedule_time);

    var id = info ? info.data.length : 0;
    var title = "Reminder";
    cordova.plugins.notification.local.hasPermission(function(granted){
      if(granted == true)
      {
        schedule(id, title, message, schedule_time);
      }
      else
      {
        cordova.plugins.notification.local.registerPermission(function(granted) {
            if(granted == true)
            {
              schedule(id, title, message, schedule_time);
            }
            else
            {
              navigator.notification.alert("Reminder cannot be added because app doesn't have permission");
            }
        });
      }
    });
}

function schedule(id, title, message, schedule_time)
{
    cordova.plugins.notification.local.schedule({
        id: id,
        title: title,
        message: message,
        at: schedule_time
    });

    var array = [id, title, message, schedule_time];
    info.data[info.data.length] = array;
    localStorage.setItem("rp_data", JSON.stringify(info));

    navigator.notification.alert("Reminder added successfully");
}

function createFile()
{
  var content;
  content = document.getElementById('my_text').value;
  var blob = new Blob([content],{type:'text/plain'});
  cordova.file.dataDirectory = "file:///storage/emulated/0/android/data/com.example.hello/files/";

  resolveLocalFileSystemURL(cordova.file.dataDirectory,function(dir){
       dir.getFile("log.txt",{create:true},function(file){

            file.createWriter(function(writer){
                  writer.seek(writer.length);
                  writer.write(blob);
            })

        });
  })
}

function readFile(){
  resolveLocalFileSystemURL(cordova.file.dataDirectory+"log.txt",function(dir){

    dir.file(function(file){
       var reader = new FileReader();

        reader.onloadend = function(){
          console.log("Text is ", this.result)
        }

        reader.readAsText(file)
    })

  })
}

app.initialize();

