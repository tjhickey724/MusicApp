/*
Next changes --
Add eventhandler for when the screen size changes...
Make the distances be percentages of the image width
This will scale easily as the screen size changes.
We won't always see the full length of the document but we will
always see the full width...

Somethings are only needed for the Recording

*/


//PLAYBACK CODE
console.log("in scoreapp!");

animation={altus:animationAltus,cantus:animationCantus,bassus:animationBassus,tenor:animationTenor};

//$('input[type="range"]').rangeslider();
//theSlider = $('input[type="range"]');
$('#timeSlider').rangeslider();
theSlider = $('#timeSlider');
startTime = new Date();
startTime = startTime.getTime();


//notes =  [{"action":"cursor","time":"0","x":323,"y":250,"yoff":-50},{"action":"cursor","time":"1","x":323,"y":250,"yoff":-50},{"action":"cursor","time":"2100","x":344,"y":250,"yoff":-50},{"action":"cursor","time":"3472","x":374,"y":250,"yoff":-50},{"action":"cursor","time":"3976","x":413,"y":250,"yoff":-50},{"action":"cursor","time":"4953","x":441,"y":250,"yoff":-50},{"action":"cursor","time":"5868","x":463,"y":250,"yoff":-50},{"action":"cursor","time":"6448","x":481,"y":250,"yoff":-50},{"action":"cursor","time":"6996","x":511,"y":250,"yoff":-50},{"action":"cursor","time":"7540","x":538,"y":250,"yoff":-50},{"action":"cursor","time":"7992","x":560,"y":250,"yoff":-50},{"action":"cursor","time":"8696","x":590,"y":250,"yoff":-50},{"action":"cursor","time":"9008","x":615,"y":250,"yoff":-50},{"action":"cursor","time":"9480","x":648,"y":250,"yoff":-50},{"action":"cursor","time":"9928","x":666,"y":250,"yoff":-50},{"action":"cursor","time":"10316","x":694,"y":250,"yoff":-50},{"action":"cursor","time":"10760","x":719,"y":250,"yoff":-50},{"action":"cursor","time":"11212","x":745,"y":250,"yoff":-50},{"action":"cursor","time":"11764","x":776,"y":250,"yoff":-50},{"action":"cursor","time":"12720","x":798,"y":250,"yoff":-50}];

thePartCanvas =  document.getElementById("thePart");
thePartCanvas.width = window.innerWidth;
thePartCanvas.height = window.innerHeight-50;

imagesize=
{cantus:{width:2551, height:3450},
 altus:{width:2549, height:3749},
 tenor:{width:2549, height:3751},
 bassus:{width:2548, height:3749},
 };


initialPartModel = {
  xOffset:0,
  yOffset:0,
  boxWidth:0.015,
  wideBoxWidth:2000,
  boxHeight:0.1,
  boxY:0.2,
  boxX:0,

  notes:[],
  startTime:0, // when the current song started playing
  currentTime:0, //milliseconds since the beginning of the song
  position:0, // the position in the list of notes
  note:{},  // the last note processed
  nextNote:{}, // the next note to process
};
// Notes have the form:
// {"action":"cursor","time":"0","x":355,"y":250,"yoff":92}

partModel = Object.assign({},initialPartModel);
//partModel.boxHeight = Math.round(partModel.boxHeight/100.0*thePartCanvas.height);
//partModel.boxWidth  = Math.round(partModel.boxWidth /100.0*thePartCanvas.width);

audio = document.getElementsByTagName("audio")[0];
//audio.playbackRate=0.5;
//audio.play();




function playIt(){
  partModel.notes = notes;
  partModel.position=0;
  partModel.startTime = (new Date()).getTime();
  audio.play();
  running=true;
  playLoop();
}

function updateModel(){
// update the boxX and yOffset fields of the partModel based on the time
// also increase position if so needed...
  c = (new Date()).getTime() - partModel.startTime;
  //console.log("c="+c);
  //console.log("sliderval="+theSlider.val());
  theSlider.val(c);
  //console.log("sliderval="+theSlider.val());
  //console.log("slidermax="+theSlider.attr("max"))
  p = partModel.position;
  n1 = partModel.notes[p]
  n2 = partModel.notes[p+1]
  //console.log("c="+c+" t="+n1.time);
  if (c > n2.time){ //switch to the next note!
    p=p+1;
    partModel.position = p;
    n1 = partModel.notes[p]
    n2 = partModel.notes[p+1]
    //console.log("SWITCHING TO NEXT NOTE "+JSON.stringify(n1));
  }
  if (p==partModel.notes.length-1) {
    running=false;
    return;
  }

  //console.log(JSON.stringify([n1,n2]))

  partModel.currentTime =c;
  t2 = c-n1.time;
  t1 = n2.time-c;
  t = n2.time-n1.time;
  partModel.boxX = (t1*n1.x + t2*n2.x)/t;
  partModel.yOffset = (t1*n1.yoff + t2*n2.yoff)/t;
  //console.log("x1="+n1.x+" x2="+n2.x+ "\nc="+c+
  //            " t1="+t1+" t2="+t2+" t="+t +
  //            " x="+partModel.boxX+" o="+partModel.yOffset);

}
running = true;

function playLoop(){
  if (!running) {return;}
  drawPart();
  updateModel();
  window.requestAnimationFrame(playLoop);
}


// DRAWING THE VIEW USING THE MODEL

function drawPart(){
  ctx = thePartCanvas.getContext("2d");
  ctx.fillStyle="blue";

  drawImage(ctx);


  ctx.strokeStyle = 'blue';
  //ctx.fillRect(0,250,40,10);

  backgroundColor = "rgba(112,66,20,0.2)";
  foregroundColor = "rgba(255,215,0,0.2)";
  leftColor = "rgba(255,255,255,0.0)";
  //console.dir(partModel);

    //console.log("bh="+boxHeight+" bw="+boxWidth);
    ctx.fillStyle = leftColor;
    drawHighlightBox(ctx);

    ctx.fillStyle = foregroundColor;
    drawRightBox(ctx);

    ctx.fillStyle = backgroundColor;
    drawLeftBox(ctx);
    drawTopBox(ctx);
    drawBottomBox(ctx);

}

function drawImage(ctx){
  image = document.getElementById("source");
  var w = thePartCanvas.width+0.0;
  var thePart = $("#part").val();
  var aspect = 1.0;
  switch (thePart){
    case "altus":
        aspect = imagesize.altus.height/imagesize.altus.width;
        break;
    case "cantus":
        aspect = imagesize.cantus.height/imagesize.cantus.width;
        break;
    case "tenor":
        aspect = imagesize.tenor.height/imagesize.tenor.width;
        break;
    case "bassus":
        aspect = imagesize.bassus.height/imagesize.bassus.width;
        break;
    default: console.log("unknown part: "+ thePart);
  }
  ctx.drawImage(image,
    partModel.xOffset*w,
    partModel.yOffset*w,
    window.innerWidth,
    Math.round(window.innerWidth*aspect)
  );
}

function drawHighlightBox(ctx){
  var w = thePartCanvas.width+0.0;
  ctx.fillRect(
    (partModel.boxX-partModel.boxWidth/2)*w,
    (partModel.boxY-partModel.boxHeight/2)*w,
    partModel.wideBoxWidth*w,
    partModel.boxHeight*w);
}

function drawRightBox(ctx){
  var w = thePartCanvas.width+0.0;
  ctx.fillRect(
    (partModel.boxX-partModel.boxWidth/2)*w,
    (partModel.boxY-partModel.boxHeight/2)*w,
    partModel.boxWidth*w,
    partModel.boxHeight*w);
}

function drawBottomBox(ctx){
  var w = thePartCanvas.width+0.0;
  ctx.fillRect(
          (partModel.boxX-partModel.boxWidth/2)*w,
          (partModel.boxY+partModel.boxHeight/2)*w,
          2000,
          window.innerHeight);
}
function drawTopBox(ctx){
  var w = thePartCanvas.width+0.0;
  ctx.fillRect(
      (partModel.boxX-partModel.boxWidth/2)*w,
      0,
      2000,
      (partModel.boxY-partModel.boxHeight/2)*w);
}

function drawLeftBox(ctx){
  var w = thePartCanvas.width+0.0;
  ctx.fillRect(
    0,
    0,
    (partModel.boxX-partModel.boxWidth/2)*w,
    thePartCanvas.height*w);
}


// RECORDING code


// This is the controller code
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
    running=false;
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
  } else {
    console.dir(event);
  }
  }

document.addEventListener("keydown",keydownListener);


function addNote(){
  var now = new Date();
  if (paused){
    audio.play()
    pauseDuration = now.getTime() - pauseTime;
    startTime = startTime + pauseDuration;
    paused = false;
  }
  var t = now.getTime()-startTime;
  var w = thePartCanvas.width+0.0;
  var note =
  {action:'cursor',
     time:(t*audio.playbackRate).toFixed(),
        x:lastMouseEvent.offsetX/w,
        y: partModel.boxY,
        yoff: partModel.yOffset
      };
  notes.push(note);
}




lastMouseEvent = null;

document.addEventListener("mousemove",function(event){
  lastMouseEvent = event;
})





partSelect = $("#part");
partSelect.change(function(event){
  thePartCanvas.width = window.innerWidth;
  thePartCanvas.height = window.innerHeight-50;

  $("#boxHeight" ).val(  partModel.boxHeight );
  partModel = Object.assign({},initialPartModel);
  console.dir(this);
  console.log("selecting part");
  var image = document.getElementById("source");
  image.src= "pieces/zirlerMotet/images/"+(partSelect.val()+".jpg");
  ctx = thePartCanvas.getContext("2d");
  image = document.getElementById("source");
  ctx.drawImage(image,0,0,window.innerWidth,window.innerWidth*4/3);

  drawPart();

  notes = animation[partSelect.val()];
  maxtime = notes[notes.length-1].time;
  attributes = {min:0,max:maxtime,step:1}
  theSlider.attr("max",maxtime);
  console.log('maxtime='+maxtime);
  console.log("attr-max="+theSlider.attr("max"));

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
  alert("Cut/Paste the following code "+
     "into the appropriate file in the animations folder:\n\n" +
    JSON.stringify(notes));
})

initPartButton = $("#initPart");
initPartButton.click(initPart);

function initPart (event){
  //notes = eval(localStorage.getItem("animation"));
  playbackMode=false;
  thePartCanvas.width = window.innerWidth;
  thePartCanvas.height = window.innerHeight-50;
  // read in the fields and use them to set the partModel

  initialPartModel.boxHeight = parseFloat($("#boxHeight").val());
  audio.playbackRate = parseFloat($("#playbackRate").val());
  console.log("playbackRate is "+audio.playbackRate);
  partModel = Object.assign({},initialPartModel);
  console.log(JSON.stringify(initialPartModel))
  console.log(JSON.stringify(partModel));
  ctx = thePartCanvas.getContext("2d");
  image = document.getElementById("source");
  ctx.drawImage(image,0,0,window.innerWidth,window.innerWidth*4/3);
}

playbackButton = $("#playback");
playbackButton.click(function(event){
  playbackMode = true;
  playIt();
});

// Recording
playbackMode = false;

$("#thePart").mousemove(function(event){
  thePartCanvas.width = window.innerWidth;
  thePartCanvas.height = window.innerHeight-50;
})

$("#thePart").mousemove(function(event){
  if (playbackMode) return;
  var w = thePartCanvas.width+0.0;
  partModel.boxX = event.offsetX/w;
  drawPart()

})


// Recenter the screen if the user clicks the mouse

$("#thePart").mousedown(function(event){
  if (playbackMode) return;
  var w = thePartCanvas.width+0.0;
  var p2 = partModel.yOffset + partModel.boxY -(event.offsetY)/w;
  //changeOffset(1,20,partModel.yOffset, p2)
  lastyOffset = partModel.yOffset;
  partModel.yOffset = p2;
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
