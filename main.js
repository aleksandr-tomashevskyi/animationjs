'use strict'

const boxElements = document.querySelectorAll(".box");
const boxContainersElements = document.querySelectorAll(".box-container")
// let containerWidth = window.innerWidth; //legacy
// let containerHeight = window.innerHeight; //legacy
let generatedInitPositionsX = [];
let generatedInitPositionsY = [];
let boxes = [];
let boxContainers = [];


class box{
   constructor(index, parentIndex, className, height, width, velocityY, velocityX, initPosX, initPosY, startTimeX, startTimeY, posX, posY, currentTimeX, currentTimeY){
      this.index = index;
      this.parentIndex = parentIndex;
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
      this.currentTimeX = currentTimeX;
      this.currentTimeY = currentTimeY
   }
}

class boxContainer{
   constructor(index, name, height, width, offsetX, offsetY){
      this.index = index;
      this.name = name;
      this.height = height;
      this.width = width;
      this.offsetX = offsetX;
      this.offsetY = offsetY
   }
}

function containerResizeCheck(){
   boxContainers.forEach((el) =>{
      if(el.height != boxContainersElements[el.index].offsetHeight || el.width != boxContainersElements[el.index].offsetWidth || el.offsetX != getContainerXPos(boxContainersElements[el.index]) || el.offsetY != getContainerYPos(boxContainersElements[el.index])){
         el.height = boxContainersElements[el.index].offsetHeight;
         el.width = boxContainersElements[el.index].offsetWidth;
         el.offsetX = getContainerXPos(boxContainersElements[el.index]);
         el.offsetY = getContainerYPos(boxContainersElements[el.index])
         console.log("Container has been resized")
      }
   })
}

function getContainerXPos(el){
   return el.getBoundingClientRect().left
}
function getContainerYPos(el){
   return el.getBoundingClientRect().top + document.documentElement.scrollTop
};


function generateAndRoundVelocity(){
   return Number((Math.random()*0.1)+0.1).toFixed(2);
}

function checkCollision(redBox, el, containerWidth, containerHeight){ //check collisions function for initial positions only
   let checkResult = false;
   if(redBox.parentIndex == el.parentIndex){
      if(redBox.index != el.index){
         if(((redBox.initPosX + redBox.width >= el.initPosX && redBox.initPosX <= el.initPosX + el.width) && redBox.initPosY + redBox.height >= el.initPosY && redBox.initPosY <= el.initPosY + el.height)){
            console.log("Check for container failed")
            checkResult = true;
         }
         if(redBox.initPosX + redBox.width >= containerWidth || redBox.initPosX <= 0 || redBox.initPosY + redBox.height >= containerHeight|| redBox.initPosY <= 0){
            console.log("Check for container failed")
            checkResult = true;
         }
      }
   }
   return checkResult;
}

function generateInitPos(containerParam){
   return Math.round((Math.random()*containerParam*0.85));   
}

function boxInstance(el, parentIndex){
   // let containerWidth = el.parentElement;
   let newClassName = `box-${boxes.length}`;
   el.classList.toggle(newClassName);
   // let varNameIndex = `${i}`;
   boxes.push(new box(boxes.length, parentIndex, newClassName, el.offsetHeight, el.offsetWidth, generateAndRoundVelocity(), generateAndRoundVelocity(), generateInitPos(boxContainers[parentIndex].width), generateInitPos(boxContainers[parentIndex].width), Date.now(), Date.now()));
}

function boxContainerInstance(el, i){
   let childrenBoxes = el.querySelectorAll('.box');
   let newClassName = `box-container-${i}`;
   el.classList.toggle(newClassName);
   boxContainers.push(new boxContainer(i, newClassName, el.offsetHeight, el.offsetWidth, getContainerXPos(el), getContainerYPos(el)))
   childrenBoxes.forEach((el) => boxInstance(el, i)); //creating box instances for each box container
}

function checkInitsForCollisions(){
   let checkResult = true;
   boxes.forEach((redBox)=>{
      boxes.forEach((el, i)=>{
         if(checkCollision(redBox, el, boxContainers[redBox.parentIndex].width, boxContainers[redBox.parentIndex].height)){
            redBox.initPosX = generateInitPos(boxContainers[redBox.parentIndex].width);
            redBox.initPosY = generateInitPos(boxContainers[redBox.parentIndex].height);
            checkResult = false;
            console.log(`Iteration ${i} failed check`)
         }
      })
   })
   return checkResult;
}


function init(){
   boxContainersElements.forEach(boxContainerInstance);
   while(!checkInitsForCollisions()){
      checkInitsForCollisions()
   }
   boxes.forEach((redBox) =>{
      boxElements[redBox.index].style.transform=`translate(${redBox.initPosX}px, ${redBox.initPosY}px)`;
   })
}

init();

function collisionToContainer(redBox, timestamp){
   if(redBox.posX + redBox.width >= boxContainers[redBox.parentIndex].width  || redBox.posX <= 1){
      let modifier;
      if(redBox.posX + redBox.width >= boxContainers[redBox.parentIndex].width){
         modifier = -2;
      } else{
         modifier = 2;
      }
      redBox.initPosX = redBox.posX + modifier;
      redBox.startTimeX = timestamp;
      redBox.velocityX = redBox.velocityX * (-1);
   }
   if(redBox.posY + redBox.height >= boxContainers[redBox.parentIndex].height || redBox.posY <= 1){
      let modifier;
      if(redBox.posY + redBox.height >= boxContainers[redBox.parentIndex].height){
         modifier = -2;
      } else{
         modifier = 2;
      }
      // console.log("collision Y detected")
      redBox.initPosY = redBox.posY + modifier;
      redBox.startTimeY = timestamp;
      redBox.velocityY = redBox.velocityY * (-1);
   }
}

function collisionToOthers(redBox, timestamp){
   boxes.forEach((el) =>{
      if(redBox.parentIndex == el.parentIndex){
         if(redBox.index != el.index){
            if(((redBox.posX + redBox.width >= el.posX && redBox.posX <= el.posX + el.width) && redBox.posY + redBox.height >= el.posY && redBox.posY <= el.posY + el.height)){
               if(Math.abs(redBox.posX - el.posX) < Math.abs(redBox.posY - el.posY)){
                  let modifier;
                  if(redBox.posY + redBox.height >= el.posY && redBox.posY + redBox.height < el.posY + el.height){
                     modifier = -2;
                  } else{
                     modifier = 2;
                  }
                  redBox.initPosY = redBox.posY + modifier;
                  redBox.startTimeY = timestamp;
                  redBox.velocityY = redBox.velocityY * (-1);
                  
               } else{
                  let modifier;
                  if(redBox.posX + redBox.width >= el.posX && redBox.posX + redBox.width < el.posX + el.width){
                     modifier = -2;
                  } else{
                     modifier = 2;
                  }
                  redBox.initPosX = redBox.posX + modifier;
                  redBox.startTimeX = timestamp;
                  redBox.velocityX = redBox.velocityX * (-1);
               }
            }
         }
      }
   })
}

function boxMovement(){
   containerResizeCheck();
   console.log(timeFreezer)
   boxes.forEach((redBox) =>{
      redBox.currentTimeX = Date.now() - redBox.startTimeX - timeFreezer; 
      redBox.currentTimeY = Date.now() - redBox.startTimeY - timeFreezer; 
      redBox.posX = redBox.initPosX + (redBox.velocityX*redBox.currentTimeX);
      redBox.posY = redBox.initPosY + (redBox.velocityY*redBox.currentTimeY);
      collisionToContainer(redBox, (Date.now() - timeFreezer));
      collisionToOthers(redBox, (Date.now() - timeFreezer));
      boxElements[redBox.index].style.transform=`translate(${redBox.posX}px, ${redBox.posY}px)`;
   })
   window.requestAnimationFrame(boxMovement)
}

let timeFreezer = 0;
let timeStopStamp = 0;

function visibilityChange(){
   if(document.hidden){
      timeStopStamp = Date.now();
      window.cancelAnimationFrame(boxMovement)
   } else{
      timeFreezer = timeFreezer + Date.now() - timeStopStamp;
   }
}

window.requestAnimationFrame(boxMovement)

window.addEventListener("visibilitychange", visibilityChange)


