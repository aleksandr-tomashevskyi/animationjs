'use strict'

const boxElements = document.querySelectorAll(".box");
const boxContainersElements = document.querySelectorAll(".box-container")
// let containerWidth = window.innerWidth;
// let containerHeight = window.innerHeight;
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
function getContainerXPos(el){
   return el.getBoundingClientRect().left
}
function getContainerYPos(el){
   return el.getBoundingClientRect().top + document.documentElement.scrollTop
};


function generateAndRoundVelocity(){
   return Number((Math.random()*0.1)+0.1).toFixed(2);
}

function checkCollision(redBox, el, containerWidth, containerHeight){
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

function generateInitPos(containerParam){
   return Math.round((Math.random()*containerParam*0.85));   
}

function boxInstance(el, parentIndex){
   // let containerWidth = el.parentElement;
   let newClassName = `box-${boxes.length}`;
   el.classList.toggle(newClassName);
   // let varNameIndex = `${i}`;
   boxes.push(new box(boxes.length, parentIndex, newClassName, el.offsetHeight, el.offsetWidth, generateAndRoundVelocity(), generateAndRoundVelocity(), generateInitPos(boxContainers[parentIndex].width), generateInitPos(boxContainers[parentIndex].width), (new Date()).getTime(), (new Date()).getTime()));
}

function boxContainerInstance(el, i){
   let childrenBoxes = el.querySelectorAll('.box');
   console.log(el.querySelectorAll('.box'));
   let newClassName = `box-container-${i}`;
   el.classList.toggle(newClassName);
   boxContainers.push(new boxContainer(i, newClassName, el.offsetHeight, el.offsetWidth, getContainerXPos(el), getContainerYPos(el)))
   childrenBoxes.forEach((el) => boxInstance(el, i)); //creating box instances for each box container
}

function checkInitsForCollisions(){
   let checkResult = true;
   console.log(boxes)
   boxes.forEach((redBox, iR)=>{
      console.log("check")
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


console.log("This is the boxElements", boxElements)
function init(){
   boxContainersElements.forEach(boxContainerInstance);
   while(!checkInitsForCollisions()){
      checkInitsForCollisions()
   }
   boxes.forEach((redBox) =>{
      console.log(redBox)
      boxElements[redBox.index].style.transform=`translate(${redBox.initPosX}px, ${redBox.initPosY}px)`;
      console.log(boxContainers[redBox.parentIndex].offsetY)
   })
}

init();
console.log("Boxes array:", boxContainers);


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
   if(redBox.posX + redBox.width >= boxContainers[redBox.parentIndex].width  || redBox.posX <= 1){
      let modifier;
      if(redBox.posX + redBox.width >= boxContainers[redBox.parentIndex].width){
         modifier = -2;
      } else{
         modifier = 2;
      }
      redBox.initPosX = redBox.posX + modifier;
      redBox.startTimeX = (new Date()).getTime();
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
      redBox.startTimeY = (new Date()).getTime();
      redBox.velocityY = redBox.velocityY * (-1);
   }
}

function collisionToOthers(redBox){
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
                  redBox.startTimeY = (new Date()).getTime();
                  redBox.velocityY = redBox.velocityY * (-1);
                  console.log("collision Y detected")
                  
               } else{
                  let modifier;
                  if(redBox.posX + redBox.width >= el.posX && redBox.posX + redBox.width < el.posX + el.width){
                     modifier = -2;
                  } else{
                     modifier = 2;
                  }
                  redBox.initPosX = redBox.posX + modifier;
                  redBox.startTimeX = (new Date()).getTime();
                  redBox.velocityX = redBox.velocityX * (-1);
                  console.log("collision X detected")
               }
            }
         }
      }
   })
   
}

window.setInterval(boxMovement, 30);