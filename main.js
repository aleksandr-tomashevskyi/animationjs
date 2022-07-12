'use strict'

const boxElements = document.querySelectorAll(".box");
// const boxWidth = boxElement.offsetWidth;
// const boxHeight = boxElement.offsetHeight;
// let boxInitXPos = 0;
// let boxInitYPos = 0;
// let boxVelocityX = 0.1;
// let boxVelocityY = 0.2;
// let boxXPos;
// let boxYPos;
// let startTimeX = (new Date()).getTime();
// let currentTimeX = (new Date()).getTime() - startTimeX;
// let startTimeY = (new Date()).getTime();
// let currentTimeY = (new Date()).getTime() - startTimeY;
let containerWidth = window.innerWidth;
let containerHeight = window.innerHeight;
let generatedInitPositionsX = [];
let generatedInitPositionsY = [];

class box{
   constructor(index, className, height, width, velocityY, velocityX, initPosX, initPosY, startTimeX, startTimeY, posX, posY, currentTimeX, currentTimeY){
      this.index = index;
      this.className = className;
      this.height = height;
      this.width = width;
      this.velocityY = velocityY;
      this.velocityX = velocityX;
      this.initPosX = initPosX;
      this.initPosY = initPosY;
      this.startTimeX = startTimeX;
      this.startTimeY = startTimeY;
      this.posX = posX;
      this.posY = posY;
      this.currentTimeX = currentTimeX
      this.currentTimeY = currentTimeY
   }
}

// let redBox = new box(boxElement.offsetHeight, boxElement.offsetWidth, 0.1, 0.2, 0, 0, (new Date()).getTime(), (new Date()).getTime());

function generateAndRoundVelocity(){
   return Number((Math.random()*0.1)+0.1).toFixed(2);
}

function initPosSetX(){
   let newIter;
   newIter = Math.round((Math.random()*0.5*containerWidth));
   let newIterChecked = generatedInitPositionsX.find((element) => {
      return Math.abs(element - newIter) < 150;
   })
   if(!newIterChecked){
      return newIter;
   } else{
      initPosSetX()
   }
}
function initPosSetY(){
   let newIter;
   newIter = Math.round((Math.random()*0.5*containerWidth));
   let newIterChecked = generatedInitPositionsY.find((element) => {
      return Math.abs(element - newIter) < 200;
   })
   if(!newIterChecked){
      return newIter;
   } else{
      initPosSetY()
   }
}

function generateInitPosX(){
   let newIter;
   if(generatedInitPositionsX){
      newIter = initPosSetX();
   } else{
      newIter = Math.round((Math.random()*0.5*containerWidth))
   }
   return newIter;
}
function generateInitPosY(){
   let newIter;
   if(generatedInitPositionsY){
      newIter = initPosSetY();
   } else{
      newIter = Math.round((Math.random()*0.5*containerWidth))
   }
   return newIter;
}

console.log(generateInitPosX())
console.log(generateInitPosY())

let boxes = [];

function boxInstance(el, i){
   let newClassName = `box-${i}`;
   el.classList.toggle(newClassName);
   let varNameIndex = `${i}`;
   boxes.push(new box(i, newClassName, el.offsetHeight, el.offsetWidth, generateAndRoundVelocity(), generateAndRoundVelocity(), generateInitPosX(), generateInitPosY(), (new Date()).getTime(), (new Date()).getTime()));
   
   // boxes.push(eval('box'+ varNameIndex))
}

boxElements.forEach(boxInstance)
console.log(boxes)


// let boxes = [new box(boxElement.offsetHeight, boxElement.offsetWidth, 0.1, 0.2, 0, 0, (new Date()).getTime(), (new Date()).getTime()), new box(boxElement.offsetHeight, boxElement.offsetWidth, 0.1, 0.2, 80, 120, (new Date()).getTime(), (new Date()).getTime()), new box(boxElement.offsetHeight, boxElement.offsetWidth, 0.1, 0.2, 300, 500, (new Date()).getTime(), (new Date()).getTime()), new box(boxElement.offsetHeight, boxElement.offsetWidth, 0.1, 0.2, 150, 180, (new Date()).getTime(), (new Date()).getTime())]

function boxMovement(){
   boxes.forEach((redBox) =>{
      redBox.currentTimeX = (new Date()).getTime() - redBox.startTimeX; 
      redBox.currentTimeY = (new Date()).getTime() - redBox.startTimeY; 
      redBox.posX = redBox.initPosX + (redBox.velocityX*redBox.currentTimeX);
      redBox.posY = redBox.initPosY + (redBox.velocityY*redBox.currentTimeY);
      boxElements[redBox.index].style.transform=`translate(${redBox.posX}px, ${redBox.posY}px)`;
      collisionToContainer(redBox);
      collisionToOthers(redBox);
   })
   // redBox.currentTimeX = (new Date()).getTime() - redBox.startTimeX; 
   // redBox.currentTimeY = (new Date()).getTime() - redBox.startTimeY; 
   // redBox.posX = redBox.initPosX + (redBox.velocityX*redBox.currentTimeX)
   // redBox.posY = redBox.initPosY + (redBox.velocityY*redBox.currentTimeY);
   // boxElement.style.transform=`translate(${redBox.posX}px, ${redBox.posY}px)`;
   // collisionToContainer()
}

function collisionToContainer(redBox){
   if(redBox.posX + redBox.width >= (containerWidth)|| redBox.posX <= 0){
      // console.log("collision X detected")
      redBox.initPosX = redBox.posX;
      redBox.startTimeX = (new Date()).getTime();
      redBox.velocityX = redBox.velocityX * (-1);
   }
   if(redBox.posY + redBox.height >= (containerHeight)|| redBox.posY <= 0){
      // console.log("collision Y detected")
      redBox.initPosY = redBox.posY;
      redBox.startTimeY = (new Date()).getTime();
      redBox.velocityY = redBox.velocityY * (-1);
   }
}

// (redBox.posX <= el.posX + el.width && redBox.posX + redBox.width <= el.posX + el.width  && redBox.posY <= el.posY +el.height && redBox.posY + redBox.height <= el.posY + el.height)

function collisionToOthers(redBox){
   boxes.forEach((el) =>{
      if(redBox.index != el.index){
         if(((redBox.posX + redBox.width >= el.posX && redBox.posX <= el.posX + el.width && redBox.posX) && redBox.posY + redBox.height >= el.posY && redBox.posY <= el.posY + el.height)){
            if(Math.abs(redBox.posX - el.posX) < Math.abs(redBox.posY - el.posY)){
               redBox.initPosY = redBox.posY;
               redBox.startTimeY = (new Date()).getTime();
               redBox.velocityY = redBox.velocityY * (-1);
            } else{
               redBox.initPosX = redBox.posX;
               redBox.startTimeX = (new Date()).getTime();
               redBox.velocityX = redBox.velocityX * (-1);
            }
         }
         // if(el.posX + el.width >= redBox.posX && el.posX + el.width<= redBox.posX + redBox.width && el.posY + el.height >= redBox.posY && el.posY + el.height <= redBox.posY + redBox.height){
         //    if(el.posX + el.width >= redBox.posX || el.posX <= redBox.posX + redBox.width){
         //       console.log("collision X detected")
         //       el.initPosY = el.posY;
         //       el.startTimeY = (new Date()).getTime();
         //       el.velocityY = el.velocityY * (-1);
         //    }
         //    if(el.posY + el.height >= redBox.posY || el.posY <= redoBox.posY + redBox.height){
         //       console.log("collision Y detected")
         //       el.initPosX = el.posX;
         //       el.startTimeX = (new Date()).getTime();
         //       el.velocityX = el.velocityX * (-1);
         //    }
         // }
         // if(((redBox.posY + redBox.height) >= el.posY) && redBox.posY + redBox.height <= el.posY + el.height){
         //    console.log("collision Y detected")
         //    // redBox.initPosY = redBox.posY;
         //    // redBox.startTimeY = (new Date()).getTime();
         //    // redBox.velocityY = redBox.velocityY * (-1);
         // }
      }
   })
   
}


// function boxMovement(){
//    currentTimeX = (new Date()).getTime() - startTimeX; 
//    currentTimeY = (new Date()).getTime() - startTimeY; 
//    boxXPos = boxInitXPos + (boxVelocityX*currentTimeX)
//    boxYPos = boxInitYPos + (boxVelocityY*currentTimeY);
//    boxElement.style.transform=`translate(${boxXPos}px, ${boxYPos}px)`;
//    collisionToContainer()
// }

// function collisionToContainer(){
//    if(boxXPos + boxWidth >= containerWidth || boxXPos <= 0){
//       boxInitXPos = boxXPos;
//       startTimeX = (new Date()).getTime();
//       boxVelocityX = boxVelocityX * (-1);
//    }
//    if(boxYPos + boxHeight >= containerHeight || boxYPos <= 0){
//       boxInitYPos = boxYPos;
//       startTimeY = (new Date()).getTime();
//       boxVelocityY = boxVelocityY * (-1);
//       console.log(boxVelocityY)
//    }
// }

window.setInterval(boxMovement, 20);