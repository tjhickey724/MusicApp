/*
Next changes --
Add eventhandler for when the screen size changes...
Make the distances be percentages of the image width
This will scale easily as the screen size changes.
We won't always see the full length of the document but we will
always see the full width...

Somethings are only needed for the Recording

*/

//rate CODE
console.log("in scoreapp!");

animation={
  altus:animationAltus,
  cantus:animationCantus,
  bassus:animationBassus,
  tenor:animationTenor,
  score:animationScore};

boxSize = {
  altus:0.12,
  cantus:0.12,
  bassus:0.12,
  tenor:0.12,
  score:0.23
}

pieceFolder="zirlerMotet"

$('input[type="range"]').rangeslider({
  onInit: function() {
    console.log("init");
  },
  onSlide: function(pos, value) {
    console.log("pos="+pos+" val="+val);
    if (!running) {
      startTime = new Date();
      startTime = startTime.getTime();
      playIt()
    }
  }
}).on('input', function() {
  //console.log("val="+this.value);
  partModel.startTime -= (this.value - partModel.currentTime)
  video.currentTime = this.value/1000.0;

});




theSlider = $('#timeSlider');





thePartCanvas =  document.getElementById("thePart");
thePartCanvas.width = partdiv.offsetWidth;
thePartCanvas.height = window.innerHeight;
//thePartCanvas.width = window.innerWidth;
//thePartCanvas.height = window.innerHeight-50;

imagesizeZirler=
{cantus:{width:2551, height:3450},
 altus:{width:2549, height:3749},
  tenor:{width:2549, height:3751},
 bassus:{width:2548, height:3749},
 //score:{width:1800,height:6600}
 score:{width:1073, height:6548}
 };

 imagesizeOrto=
 {cantus:{width:1650, height:1275},
  altus:{width:1650, height:1275},
   tenor:{width:1650, height:1275},
  bassus:{width:1650, height:1275},
  //score:{width:1800,height:6600}
  score:{width:1140, height:2812}
  };

  imagesize = imagesizeZirler



initialPartModel = {
  xOffset:0,
  yOffset:0,
  boxWidth:0.015,
  wideBoxWidth:4000,
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




 video = document.getElementsByTagName("video")[0];





function playIt(){


  audio = document.getElementsByTagName("audio")[0];
  //video.muted=true;
  //video.play();
  //audio.play();
  running=true;
  playLoop();
}

function updateModel(){
// update the boxX and yOffset fields of the partModel based on the time
// also increase position if so needed...
  c1 = (new Date()).getTime() - partModel.startTime;
  c = c1 - 333;
  totalsecs = Math.floor(c1/1000)
  mins = Math.floor(totalsecs/60)
  secs = totalsecs%60
  $("#theTime").html(mins+":"+(secs<10?"0":"")+secs)
  theSlider.val(c1);


  p = partModel.position;
  n1 = partModel.notes[p]
  n2 = partModel.notes[p+1]

  if (partModel.notes.length<p) {
    running=false;
    return;
  }

  while (c > n2.time){ //switch to the next note!
    p=p+1;
    partModel.position = p;
    n1 = partModel.notes[p]
    n2 = partModel.notes[p+1]
  }
  while (c < n1.time & p>1){
    p=p-1;
    partModel.position = p;
    n1 = partModel.notes[p]
    n2 = partModel.notes[p+1]
  }
  if (p==partModel.notes.length-1) {
    running=false;
    return;
  }

  //console.log(JSON.stringify([n1,n2]))

  partModel.currentTime =c1;
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
  var thePart = theCurrentPart;
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
    case "score":
        aspect = imagesize.score.height/imagesize.score.width;
        break;
    default: console.log("unknown part: '"+ thePart+"'");
  }
  ctx.drawImage(image,
    partModel.xOffset*w,
    partModel.yOffset*w,
    partdiv.offsetWidth,
    Math.round(partdiv.offsetWidth*aspect)
    //window.innerWidth,
    //Math.round(window.innerWidth*aspect)
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
          4000,
          window.innerHeight);
}

function drawTopBox(ctx){
  var w = thePartCanvas.width+0.0;
  ctx.fillRect(
      (partModel.boxX-partModel.boxWidth/2)*w,
      0,
      4000,
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


function selectThePart(part){
  thePartCanvas.width = partdiv.offsetWidth;
  //thePartCanvas.height = window.innerHeight-50;


  //partModel = Object.assign({},initialPartModel);
  console.dir(this);
  console.log("selecting part");
  var image = document.getElementById("source");
  image.src= "pieces/zirlerMotet/images/"+(part+".jpg");
  ctx = thePartCanvas.getContext("2d");
  image = document.getElementById("source");
  ctx.drawImage(image,0,0,window.innerWidth,window.innerWidth*4/3);

  drawPart();

  notes = animation[part];
  partModel.notes =notes;
  maxtime = notes[notes.length-1].time;
  attributes = {min:0,max:maxtime,step:1}
  theSlider.attr("max",maxtime).change();
  console.log('maxtime='+maxtime);
  console.log("attr-max="+theSlider.attr("max"));

}




function initPart (event){
thePartCanvas.width = partdiv.offsetWidth;
thePartCanvas.height = window.innerHeight;
  //thePartCanvas.width = window.innerWidth;
  //thePartCanvas.height = window.innerHeight-50;
  //partModel = Object.assign({},initialPartModel);

  ctx = thePartCanvas.getContext("2d");
  image = document.getElementById("source");
  ctx.drawImage(image,0,0,window.innerWidth,window.innerWidth*4/3);
}





theCurrentPart = "Score";


function switchPart(part){
  theCurrentPart = part;
  selectThePart(part);
  initPart();
  drawPart();
}

function switchVideo(part){
$(".musicvideo").attr("width","0%");
$("#"+part).attr("width","100%");
//$("#"+part).attr("padding","-20px");
//$("#"+part).attr("margin","-20px");
 video = document.getElementById(part);
}


function startApp(part){
  video.muted=true
  //video.currentTime=0
  partModel.position=0
  switchVideo(part);
  switchPart(part);
  video.muted=false;
  video.play();

  console.log("setting the video time!"+video.currentTime+" "+partModel.currentTime/1000.0)
  video.currentTime = partModel.currentTime/1000.0;


  //video.currentTime = partModel.currentTime;
  //console.log("videoTime="+video.currentTime)


  playIt();
}

testing = true;

function keydownListener(event){
  if (event.code=="KeyC") {
    startApp("cantus")
  } else if (event.code=="KeyA") {
    startApp("altus")
  } else if (event.code=="KeyT") {
    startApp("tenor")
  } else if (event.code=="KeyB") {
    startApp("bassus")
  } else if (event.code=="KeyS") {
    startApp("score")
  }
}

document.addEventListener("keydown",keydownListener);

startTime = new Date();
startTime = startTime.getTime();
partModel = Object.assign({},initialPartModel);
switchPart("score")
switchVideo("score")
partModel.startTime = (new Date()).getTime()+340;  // maybe move this!!

//var vpromise = video.play();
//vpromise.then(function(){
//  console.log("setting video time again!")
//  video.currentTime = partModel.currentTime})

notes = animation["score"];
partModel.notes = notes;
partModel.position=0;


function changePiece(){
  pieceFolder=$("#thePiece").val();
  console.dir("Changing to "+pieceFolder);

}

startApp("score");
