/*
Changes ... when user presses Q it starts the music and the timer
When they press space it jumps to the next line as usual
  (EXPRESS UNITS IN PERCENTAGE OF IMAGE WIDTH/HEIGHT)
When they press Zkey it records the time since the start of the music
and the x,y position of the mouse in terms of percentage of image width/HEIGHT
and it stores this info in a list.

When they press W. It stops the music and stores the list on the disk in local memory.

Playback -- when they press P it reads the positions and draws the position on the screen.
Pressing P again stops it..

*/
console.log("in scoreapp!");

startTime = new Date();
startTime = startTime.getTime();

notes =  [{"action":"cursor","time":"0","x":323,"y":250,"yoff":-50},{"action":"cursor","time":"1","x":323,"y":250,"yoff":-50},{"action":"cursor","time":"2100","x":344,"y":250,"yoff":-50},{"action":"cursor","time":"3472","x":374,"y":250,"yoff":-50},{"action":"cursor","time":"3976","x":413,"y":250,"yoff":-50},{"action":"cursor","time":"4953","x":441,"y":250,"yoff":-50},{"action":"cursor","time":"5868","x":463,"y":250,"yoff":-50},{"action":"cursor","time":"6448","x":481,"y":250,"yoff":-50},{"action":"cursor","time":"6996","x":511,"y":250,"yoff":-50},{"action":"cursor","time":"7540","x":538,"y":250,"yoff":-50},{"action":"cursor","time":"7992","x":560,"y":250,"yoff":-50},{"action":"cursor","time":"8696","x":590,"y":250,"yoff":-50},{"action":"cursor","time":"9008","x":615,"y":250,"yoff":-50},{"action":"cursor","time":"9480","x":648,"y":250,"yoff":-50},{"action":"cursor","time":"9928","x":666,"y":250,"yoff":-50},{"action":"cursor","time":"10316","x":694,"y":250,"yoff":-50},{"action":"cursor","time":"10760","x":719,"y":250,"yoff":-50},{"action":"cursor","time":"11212","x":745,"y":250,"yoff":-50},{"action":"cursor","time":"11764","x":776,"y":250,"yoff":-50},{"action":"cursor","time":"12720","x":798,"y":250,"yoff":-50}];

thePartCanvas =  document.getElementById("thePart");
thePartCanvas.width = window.innerWidth;
thePartCanvas.height = window.innerHeight-50;

initialPartModel = {
  xOffset:0,
  yOffset:0,
  cursorHorizPos:0,
  boxWidth:25,
  wideBoxWidth:2000,
  boxHeight:100,
  boxY:250,
  boxX:0,
  curX:0,
  curY:0,
  leftOffset:100,
  lineShift:200
};

partModel = Object.assign({},initialPartModel);
audio = document.getElementsByTagName("audio")[0];
//audio.playbackRate=0.5;
//audio.play();

var paused = false;
var pauseTime = 0;

function keydownListener(event){
  if (event.code=="KeyQ") {
    audio.play();
    startTime = (new Date()).getTime();
    oldnotes = notes;
    notes=[];
    addNote();
    addNote();
    console.dir(event);
  }else if (event.code=="KeyW"){
    //console.log("hit W");
    //console.dir(notes);
    console.log(JSON.stringify(notes));
    audio.pause();
    audio.currentTime=0;
    audio.load();
    audio.playbackRate = parseFloat($("#playbackRate").val());
  } else if (event.code=="KeyZ"){
    addNote()
  } else if (event.code=="KeyX"){
    paused = true;
    audio.pause();
    var now = new Date();
    pauseTime = now.getTime();
    console.log(now);
    console.log(pauseTime);
  } else if (event.code=="Space"){
    var p2 = partModel.yOffset -  partModel.lineShift ;
    changeOffset(1,20,partModel.yOffset, p2)
    drawPart();
    console.log("****** Changing the offset!!");
    lastyOffset = partModel.yOffset;
    var now = new Date();
    var t = now.getTime()-startTime;
    note = {action:'shift',time:t,offset:partModel.yOffset};
    console.dir(note);
    notes.push(note);
  }else {
    console.dir(event);
  }
  }

function addNote(){
  var now = new Date();
  if (paused){
    // start music
    audio.play()
    // update the startTime ...
    console.log(now);
    pauseDuration = now.getTime() - pauseTime;
    console.log("paused for "+pauseDuration);
    console.log("old startTime "+startTime);
    startTime = startTime + pauseDuration;
    console.log("new startTime "+startTime);
    // set paused to be false
    paused = false;
  }
  //console.dir(lastMouseEvent);
  var t = now.getTime()-startTime;
  console.dir(lastMouseEvent);
  var note = {action:'cursor',time:(t*audio.playbackRate).toFixed(), x:lastMouseEvent.offsetX, y: 250, yoff: partModel.yOffset};
  console.log("adding a new note!! -- "+JSON.stringify(note));
  notes.push(note);
}

document.addEventListener("keydown",keydownListener);
/*
  document.addEventListener('keydown',
        function(event){
          switch( event.keyCode ) {
            // you can lookup the key codes at this site http://keycode.info/
            case 32:
              var p2 = partModel.yOffset -  partModel.lineShift ;
              changeOffset(1,20,partModel.yOffset, p2)
              drawPart();
              break;
          }
        }
      );
*/

lastMouseEvent = null;

document.addEventListener("mousemove",function(event){
  lastMouseEvent = event;
  //console.dir(event);
})

function drawPart(){
  ctx = thePartCanvas.getContext("2d");
  ctx.fillStyle="blue";

  image = document.getElementById("source");
  ctx.drawImage(image,
    partModel.xOffset,
    partModel.yOffset,
    window.innerWidth,
    window.innerWidth*1.77);

  ctx.strokeStyle = 'blue';
  //ctx.fillRect(0,250,40,10);

  backgroundColor = "rgba(112,66,20,0.2)";
  foregroundColor = "rgba(255,215,0,0.2)";
  leftColor = "rgba(255,255,255,0.0)";
  //console.dir(partModel);
  ctx.fillStyle = leftColor;
  ctx.fillRect(
    partModel.boxX-partModel.boxWidth/2,
    partModel.boxY-partModel.boxHeight/2,
    partModel.wideBoxWidth,
    partModel.boxHeight);

    ctx.fillStyle = foregroundColor;
    ctx.fillRect(
      partModel.boxX-partModel.boxWidth/2,
      partModel.boxY-partModel.boxHeight/2,
      partModel.boxWidth,
      partModel.boxHeight);

    ctx.fillStyle = backgroundColor;
    ctx.fillRect(
      0,
      0,
      partModel.boxX-partModel.boxWidth/2,
      thePartCanvas.height);

    ctx.fillStyle = backgroundColor;
    ctx.fillRect(
        partModel.boxX-partModel.boxWidth/2,
        0,
        2000,
        partModel.boxY-partModel.boxHeight/2);

    ctx.fillStyle = backgroundColor;
    ctx.fillRect(
            partModel.boxX-partModel.boxWidth/2,
            partModel.boxY+partModel.boxHeight/2,
            2000,
            window.innerHeight);

}




partSelect = $("#part");
partSelect.change(function(event){
  $("#leftOffset").val(  ((partModel.leftOffset/thePartCanvas.width)*1000).toFixed()/10 );
  $("#lineShift" ).val(  ((partModel.lineShift/thePartCanvas.height)*1000).toFixed()/10 );
  $("#boxHeight" ).val(  ((partModel.boxHeight/thePartCanvas.height)*1000).toFixed()/10 );
  partModel = Object.assign({},initialPartModel);
  console.dir(this);
  console.log("selecting part");
  var image = document.getElementById("source");
  image.src= "images/"+(partSelect.val());
  ctx = thePartCanvas.getContext("2d");
  image = document.getElementById("source");
  ctx.drawImage(image,0,0,window.innerWidth,window.innerWidth*4/3);

  drawPart();
  //var thePartCanvas =  document.getElementById("thePart");
  //var ctx = thePartCanvas.getContext("2d");

  //ctx.drawImage(image,xOffset,yOffsetwindow.innerWidth,window.innerWidth*4/3);
})
saveButton = $("#save");
saveButton.click(function(event){
  zz = localStorage.getItem("archive");
  alert(zz);
  if (zz==null) {
    archive="[]";
    localStorage.setItem("archive",[]);
    zz="[]"
  }
  newArchive = eval(zz);
  newArchive.push(notes);
  localStorage.setItem("archive",JSON.stringify(newArchive));
  localStorage.setItem("animation",JSON.stringify(notes));
})

copyButton = $("#copy");
copyButton.click(function(event){
  notes = eval(localStorage.getItem("animation"));
  playbackMode=false;
  initialPartModel.leftOffset = (parseFloat($("#leftOffset").val())*thePartCanvas.width/100).toFixed();
  initialPartModel.lineShift = (parseFloat($("#lineShift").val()) * thePartCanvas.height/100).toFixed();
  initialPartModel.boxHeight = (parseFloat($("#boxHeight").val()) * thePartCanvas.height/100).toFixed();
  audio.playbackRate = parseFloat($("#playbackRate").val());
  console.log("playbackRate is "+audio.playbackRate);
  partModel = Object.assign({},initialPartModel);
  console.log(JSON.stringify(initialPartModel))
  console.log(JSON.stringify(partModel));
  ctx = thePartCanvas.getContext("2d");
  image = document.getElementById("source");
  ctx.drawImage(image,0,0,window.innerWidth,window.innerWidth*4/3);
})

playbackButton = $("#playback");
playbackButton.click(function(event){
  playbackMode = true;
  startTime=(new Date()).getTime();
  position=0;
  audio.playbackRate = 1.0
  audio.play();
  playTune();
});

playbackMode = false;

function playTune(){
  note = notes[position];
  //partModel.boxX = note.x;
  //partModel.boxY = note.y;
  //tmpOff = note.yoff;
  partModel.yOffset = note.yoff;
  console.log("drawpart "+partModel.yOffset);
  drawPart();


  t = (new Date()).getTime() - startTime;
  console.log("time is "+t+" for note "+JSON.stringify(note))
  //oldNotes = note[position];
  position = position+1;
  note = notes[position];

  t1 = parseInt(note.time);
  console.log(t1+ " "+ t + " "+ (t1-t));
  changeBoxX(0,60*(t1-t)/1000,partModel.boxX,note.x)
  console.dir(note);console.log(position);
  console.log("changeYoff"+","+0+","+(60*(t1-t)/1000)+","+partModel.yoff+","+note.yoff)
  changeYoff(0,60*(t1-t)/1000,partModel.yoff,note.yoff)

  //partModel.yOffset = tmpOff;

  if (playbackMode)
      setTimeout(playTune,t1  - t);
}


$("#thePart").mousemove(function(event){
  if (playbackMode) return;
  partModel.boxX = Math.max(partModel.leftOffset,event.offsetX);
  drawPart()

})

lastyOffest=0;

$("#thePart").mousedown(function(event){
  if (playbackMode) return;
  var p2 = partModel.yOffset+  250 - event.offsetY;
  changeOffset(1,20,partModel.yOffset, p2)
  lastyOffset = partModel.yOffset;
  drawPart();
})

function changeOffset(step,steps,start,finish){
  partModel.yOffset += (finish-start)/steps;

  drawPart();
  if (step>=steps) {
    partModel.yOffset = finish;
  } else {
    window.requestAnimationFrame(function(){changeOffset(step+1,steps,start,finish)})
  }
}

function changeBoxX(step,steps,start,finish){
  partModel.boxX += (finish-start)/steps;
  //console.log("partModel.boxX="+partModel.boxX);
  drawPart();
  if (step>=steps) {
    partModel.boxX = finish;
  } else {
    window.requestAnimationFrame(function(){changeBoxX(step+1,steps,start,finish)})
  }
}

function changeYoff(step,steps,start,finish){
  partModel.yOffset += (finish-start)/steps;
  //console.log("partModel.yOffset="+partModel.yOffset);
  drawPart();
  if (step>=steps) {
    partModel.yoff = finish;
  } else {
    window.requestAnimationFrame(function(){changeYoff(step+1,steps,start,finish)})
  }
}
