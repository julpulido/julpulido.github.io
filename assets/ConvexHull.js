var container = document.querySelector("#contentContainer");
var canvas = document.getElementById("theCanvas");
var ctx = canvas.getContext("2d");
var buttStart = document.getElementById("buttStart");
var canvasPos = document.getElementById("theCanvas").getBoundingClientRect();
var bodyRect = document.body.getBoundingClientRect();



container.addEventListener("click",setClickPosition, false);
buttStart.addEventListener("click",convH);




class Point{
  constructor(ID,x,y){
    this.ID = ID;
    this.x = x;
    this.y = y;

  }
    
}


function convH(e){
  var points = [];
  var dots = document.querySelectorAll(".dot");
  canvasPos = document.getElementById("theCanvas").getBoundingClientRect();

  for(var i = 0 ; i< dots.length;i++){
    points.push(new Point(i,dots[i].getBoundingClientRect().x,dots[i].getBoundingClientRect().y));
  }
  if(dots.length == 1){
    return 0;
  }
  if(dots.length == 2){
    drawLine(points[0],points[1],"black");
    return 0;
  }
  
  points.sort(comparePoints) ;

  // Choose the upper points
  var upperPoints=[];
  if(points.length != 0){
    upperPoints.push(points[0]);
  }
  for (var i =1; i<points.length;i++ ){
    if(points[i].x != upperPoints[i-1] ){
      upperPoints.push(points[i]);
    }

  }
  
  // Choose the lower points
  points.reverse();
  var lowerPoints=[];
  if(points.length != 0){
    lowerPoints.push(points[0]);
  }
  for (var i =1; i<points.length;i++ ){
    if(points[i].x != upperPoints[i-1] ){
      lowerPoints.push(points[i]);
    }
  }

  // Convex hull for upper points
  var blackPath = [];
  var arrayFrames = [];
  
  
  
  blackPath.push(upperPoints[0]);
  blackPath.push(upperPoints[1]);
  drawPath(Array.from(blackPath));
  
  

  for(var i =2; i< upperPoints.length ; i++ ){
    arrayFrames.push([Array.from(blackPath),upperPoints[i]]);  
   
    
    while(!turnRight(blackPath[blackPath.length-2],blackPath[blackPath.length-1],upperPoints[i])){
      blackPath.pop();
       
      if(blackPath.length == 1 ){break;}
      else{ arrayFrames.push([Array.from(blackPath),upperPoints[i]]);}
    }    
    blackPath.push(upperPoints[i]);

  }
  arrayFrames.push([Array.from(blackPath),upperPoints[upperPoints.length-1]]);
   
  
  
  

  // Convex Hull for lower points

  
  
  blackPath.push(lowerPoints[1]);
  arrayFrames.push([Array.from(blackPath),lowerPoints[1]]);
  


  for(var i =2; i< lowerPoints.length ; i++ ){
    arrayFrames.push([Array.from(blackPath),lowerPoints[i]]);  
   
    
    while(!turnRight(blackPath[blackPath.length-2],blackPath[blackPath.length-1],lowerPoints[i])){
      blackPath.pop();
       
      if(blackPath.length == 1 ){break;}
      else{ arrayFrames.push([Array.from(blackPath),lowerPoints[i]]);}
    }    
    blackPath.push(lowerPoints[i]);

  }
  arrayFrames.push([Array.from(blackPath),lowerPoints[lowerPoints.length-1]]);

  //start animation
  setTimeout(loop,500,arrayFrames,0);
}

function loop(arrayFrames,t){
  
  
  if(t<arrayFrames.length){
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawPath(arrayFrames[t][0]);
    drawLine(arrayFrames[t][0][arrayFrames[t][0].length-1],arrayFrames[t][1],"red");
    setTimeout(loop,500,arrayFrames,t+1);
  }
  

}


function clearCanvas(){
  ctx.clearRect(0, 0, canvas.width, canvas.height);

}

function turnRight(point1,point2,point3){
  var a1= point2.x- point1.x;
  var a2= point2.y- point1.y;
  var b1= point3.x- point2.x;
  var b2= point3.y- point2.y;
  if(a1 * b2 - a2 * b1 >= 0 ){return true;}
  else {return false;}

  
}

 

function comparePoints(a,b){
  if(a.x < b.x || (a.x==b.x && b.y < a.y )){ return -1;}
  if(b.x < a.x || (a.x==b.x && b.y > a.y  )) {return 1;}
  return 0;

}

function drawPath(points){
  ctx.beginPath();
  ctx.moveTo(points[0].x - canvasPos.x +4,points[0].y - canvasPos.y +4);
  for(var i=1; i<points.length ; i++){
    ctx.lineTo(points[i].x - canvasPos.x +4,points[i].y - canvasPos.y +4);
  }
  ctx.strokeStyle = "#000000";
  ctx.stroke();



}

function drawLine(point1, point2,color){
  ctx.beginPath();
  ctx.moveTo(point1.x - canvasPos.x +4 ,point1.y - canvasPos.y +4);
  ctx.lineTo(point2.x - canvasPos.x +4 ,point2.y - canvasPos.y +4);

  if(color == "red"){ ctx.strokeStyle = "#FF0000"; ctx.stroke(); }
  else {ctx.strokeStyle = "#000000"; ctx.stroke(); }
  
  

}







function setClickPosition(e){
    parentPosition = getPosition(e.currentTarget);
   
    // the 4 is withPoint/2 heightPoint/2
    xPosition = e.clientX - parentPosition.x - 4;
    yPosition = e.clientY - parentPosition.y - 4;
    var theDiv = document.getElementById("listOfPoints");

    // append a new point with the mouse  position

    var divPoint = document.createElement("div");
    divPoint.className = "dot";
    divPoint.id = "point" + document.getElementById("listOfPoints").childElementCount;
    
    divPoint.style.left = xPosition + "px";
    divPoint.style.top = yPosition + "px";
    theDiv.appendChild(divPoint);
}


function getPosition(el) {
    var xPos = 0;
    var yPos = 0;
   
    while (el) {
      if (el.tagName == "BODY") {
        // deal with browser quirks with body/window/document and page scroll
        var xScroll = el.scrollLeft || document.documentElement.scrollLeft;
        var yScroll = el.scrollTop || document.documentElement.scrollTop;
   
        xPos += (el.offsetLeft - xScroll + el.clientLeft);
        yPos += (el.offsetTop - yScroll + el.clientTop);
      } else {
        // for all other non-BODY elements
        xPos += (el.offsetLeft - el.scrollLeft + el.clientLeft);
        yPos += (el.offsetTop - el.scrollTop + el.clientTop);
      }
   
      el = el.offsetParent;
    }
    return {
      x: xPos,
      y: yPos
    };
  }