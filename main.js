'use strict'

const boxElements = document.querySelectorAll(".box");
let containerWidth = window.innerWidth;
let containerHeight = window.innerHeight;
let generatedInitPositionsX = [];
let generatedInitPositionsY = [];
let boxes = [];


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
   let newVelocity = Number((Math.random()*0.1)+0.1).toFixed(2);
   return newVelocity;
}

function checkCollision(redBox, el){
   let checkResult = false;
   if(redBox.index != el.index){
      if(((redBox.initPosX + redBox.width >= el.initPosX && redBox.initPosX <= el.initPosX + el.width) && redBox.initPosY + redBox.height >= el.initPosY && redBox.initPosY <= el.initPosY + el.height)){
         checkResult = true;
      }
      if(redBox.initPosX + redBox.width >= containerWidth || redBox.initPosX <= 0 || redBox.initPosY + redBox.height >= containerHeight|| redBox.initPosY <= 0){
         console.log("Check for container failed")
         checkResult = true;
      }
   }
   return checkResult;
}

// function initPosSetX(width, height, posIterY){
//    let newIter;
//    let newIterChecked;
//    newIter = Math.round((Math.random()*containerWidth));
//    return newIter;
// }
// function initPosSetY(height){
//    let newIter;
//    newIter = Math.round((Math.random()*containerHeight));
//    return newIter;
// }

function generateInitPos(containerParam){
   return Math.round((Math.random()*containerParam));   
}



function boxInstance(el, i){
   let newClassName = `box-${i}`;
   el.classList.toggle(newClassName);
   let varNameIndex = `${i}`;
   boxes.push(new box(i, newClassName, el.offsetHeight, el.offsetWidth, generateAndRoundVelocity(), generateAndRoundVelocity(), generateInitPos(containerWidth), generateInitPos(containerHeight), (new Date()).getTime(), (new Date()).getTime()));
}

function checkInitsForCollisions(){
   let checkResult = true;
   console.log(boxes)
   boxes.forEach((redBox, iR)=>{
      console.log("check")
      boxes.forEach((el, i)=>{
         if(checkCollision(redBox, el)){
            redBox.initPosX = generateInitPos(containerWidth);
            redBox.initPosY = generateInitPos(containerHeight);
            checkResult = false;
            console.log(`Iteration ${i} failed check`)
         }
      })
   })
   return checkResult;
}


function init(){
   boxElements.forEach(boxInstance);
   while(!checkInitsForCollisions()){
      checkInitsForCollisions()
   }
   console.log(boxes)
   boxes.forEach((redBox) =>{
      console.log(redBox)
      boxElements[redBox.index].style.transform=`translate(${redBox.initPosX}px, ${redBox.initPosY}px)`;
   })
}

init();


function boxMovement(){
   boxes.forEach((redBox) =>{
      redBox.currentTimeX = (new Date()).getTime() - redBox.startTimeX; 
      redBox.currentTimeY = (new Date()).getTime() - redBox.startTimeY; 
      redBox.posX = redBox.initPosX + (redBox.velocityX*redBox.currentTimeX);
      redBox.posY = redBox.initPosY + (redBox.velocityY*redBox.currentTimeY);
      collisionToContainer(redBox);
      collisionToOthers(redBox);
      boxElements[redBox.index].style.transform=`translate(${redBox.posX}px, ${redBox.posY}px)`;
   })
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

function collisionToOthers(redBox){
   boxes.forEach((el) =>{
      if(redBox.index != el.index){
         if(((redBox.posX + redBox.width >= el.posX && redBox.posX <= el.posX + el.width) && redBox.posY + redBox.height >= el.posY && redBox.posY <= el.posY + el.height)){
            if(Math.abs(redBox.posX - el.posX) < Math.abs(redBox.posY - el.posY)){
               let modifier;
               if(redBox.posY + redBox.height >= el.posY && redBox.posY + redBox.height < el.posY + el.height){
                  modifier = -4;
               } else{
                  modifier = 4;
               }
               redBox.initPosY = redBox.posY + modifier;
               redBox.startTimeY = (new Date()).getTime();
               redBox.velocityY = redBox.velocityY * (-1);
               
            } else{
               let modifier;
               if(redBox.posX + redBox.width >= el.posX && redBox.posX + redBox.width < el.posX + el.width){
                  modifier = -4;
               } else{
                  modifier = 4;
               }
               redBox.initPosX = redBox.posX + modifier;
               redBox.startTimeX = (new Date()).getTime();
               redBox.velocityX = redBox.velocityX * (-1);
            }
         }
      }
   })
   
}

window.setInterval(boxMovement, 30);