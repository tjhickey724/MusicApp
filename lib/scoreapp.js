console.log("in scoreapp!");

thePartCanvas =  document.getElementById("thePart");
thePartCanvas.width = window.innerWidth;
thePartCanvas.height = window.innerHeight-50;

initialPartModel = {
  xOffset:0,
  yOffset:0,
  cursorHorizPos:0,
  boxWidth:25,
  wideBoxWidth:2000,
  boxHeight:200,
  boxY:250,
  boxX:0,
  curX:0,
  curY:0,
  leftOffset:200,
  lineShift:220
};

partModel = Object.assign({},initialPartModel);
audio = document.getElementsByTagName("audio")[0];
//audio.play();
document.addEventListener("keydown",function(event){
  if (event.code=="KeyQ") {
    audio.play();
    console.dir(event);
  }else if (event.code=="KeyW"){
    console.log("hit W");
    audio.pause();
    audio.currentTime=0;
    audio.load();
  }
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
  $("#leftOffset").val(partModel.leftOffset);
  $("#lineShift").val(partModel.lineShift);
  $("#boxHeight").val(partModel.boxHeight);
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

copyButton = $("#copy");
copyButton.click(function(event){
  initialPartModel.leftOffset = parseInt($("#leftOffset").val());
  initialPartModel.lineShift = parseInt($("#lineShift").val());
  initialPartModel.boxHeight = parseInt($("#boxHeight").val());
  partModel = Object.assign({},initialPartModel);
  ctx = thePartCanvas.getContext("2d");
  image = document.getElementById("source");
  ctx.drawImage(image,0,0,window.innerWidth,window.innerWidth*4/3);
})


$("#thePart").mousemove(function(event){
  partModel.boxX = Math.max(partModel.leftOffset,event.offsetX);
  drawPart()

})

$("#thePart").mousedown(function(event){
  var p2 = partModel.yOffset+  250 - event.offsetY;
  changeOffset(1,20,partModel.yOffset, p2)
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
