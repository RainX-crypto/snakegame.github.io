// Game Constant and Variables
let inputDir={x: 0, y: 0};  //When game starts , thhe snake will be static and pressing a keyboard button will start him
const foodSound= new Audio('resources/eating.mp3');
const gameOverSound= new Audio('resources/died.mp3');
const musicSound= new Audio('resources/background.mp3');
const moveSound=new Audio('resources/move.mp3');
let speed=5;            // SPEED NEEDED FOR FPS
let lastPaintTime=0;   //LAST  TIME THE SCREEN WAS PAINTED
let snakeArr=[   //THIS IS AN SNAKE ARRAY, THIS CURRENTLY HAS ONLY ONE VALUE SINCE ITS THE SNAKE STARTING POINT, BUT THIS WILL GET POPOULATED WITH OTHER VALUES AS THE SNAKE GROWS
    {x: 13, y:15}
]
food={x:6, y:5};
let score=0;

//Game Functions
function main(ctime){
    window.requestAnimationFrame(main);
    if((ctime-lastPaintTime)/1000 < 1/speed){    // TO CONTROL FPS SPEED
        return;
    }
    lastPaintTime=ctime;   //UPDATING
    gameEngine();     
}

function isCollide(snake) {    //COLLISION CHECKER(HIT ON WALL OR SNAKE BUMPS ON ITSELF)
    for (let i = 1; i < snake.length; i++) {
        if(snake[i].x===snake[0].x && snake[i].y===snake[0].y){   //SNAKE HIT ITSELF
            return true;
        }
    }
    if(snake[0].x>=18 || snake[0].x<=0 || snake[0].y>=18 || snake[0].y<=0){   //Boundary conditions of box
        return true;
    }
}

function gameEngine(){
    //PART 1 (UPDATING THE SNAKE VARIABLE)
    if(isCollide(snakeArr)){
        musicSound.pause();
        gameOverSound.play();
        inputDir={x:0 , y:0};   // RESETTING DIRECTION AGAIN
        alert("Game Over, Potato Gamer -_-. Press any key to play Again.");
        snakeArr=[{x: 13, y:15}];   //RESETTING THE SNAKE ARRAY AGAIN.
        musicSound.play();
        score=0;   //RESETTING SCORE
    }

    //If food is eaten., increment score and again randomise food position
    if(snakeArr[0].y==food.y && snakeArr[0].x==food.x){
        foodSound.play();
        score+=1;
        if(score>highscoreval){
            highscoreval=score;
            localStorage.setItem("hiscore",JSON.stringify(highscoreval));
            hiscoreBox.innerHTML="Hi-Score: "+highscoreval;
        }
        scoreBox.innerHTML="Score: "  + score;   //Changing the innerHTML and updating it
        snakeArr.unshift({x: snakeArr[0].x+inputDir.x, y: snakeArr[0].y+inputDir.y });   //add elements to the starting of the array
        let a=1;
        let b=17;
        food={x:Math.round(a+(b-a)*Math.random()),y:Math.round(a+(b-a)*Math.random())};  //Generating random number between a and b and thus randomising food position
    }

    //Moving the snake
    for (let i = snakeArr.length-2; i>=0; i--) {  //Iterating on the snake body from the second last since we will shift the segments
        snakeArr[i+1]={...snakeArr[i]};    // This is a new object with snakeArr[i] to not make it a referencing problem
    }
    snakeArr[0].x+=inputDir.x; //THIS PUSHES THE HEAD TO THE DIRECTION TO THAT POSITION
    snakeArr[0].y+=inputDir.y;


    //PART 2 (DISPLAY THE SNAKE AND FOOD)

    //Displaying the snake
    board.innerHTML=""; //FLUSHING THE INNER HTML(CLEAN SLATING)
    snakeArr.forEach((e,index)=>{
        SnakeElement=document.createElement('span');      //CREATING SNAKE
        SnakeElement.style.gridRowStart= e.y;            //VERTICAL IS y
        SnakeElement.style.gridColumnStart= e.x;  
        if(index==0){
            SnakeElement.classList.add('head');          //HORIZONTAL IS x
        }       
        else{
            SnakeElement.classList.add('snake');        // CSS TARGET
        }                  
        board.appendChild(SnakeElement);                 // HTML TARGET
    })

    //Displaying the food
    FoodElement=document.createElement('div');         //CREATTNG FOOD
    FoodElement.style.gridRowStart= food.y;            //VERTICAL IS y
    FoodElement.style.gridColumnStart= food.x;         //HORIZONTAL IS x
    FoodElement.classList.add('food');                 // CSS TARGET
    board.appendChild(FoodElement);                    // HTML TARGET
}


//Main logic
let hiscore=localStorage.getItem("hiscore");
if(hiscore===null){
    highscoreval=0;
    localStorage.setItem("hiscore",JSON.stringify(highscoreval));
}
else{
    highscoreval=JSON.parse(hiscore);
    hiscoreBox.innerHTML="Hi-Score: "+ hiscore;
}

window.requestAnimationFrame(main);
window.addEventListener('keydown',e=>{
    musicSound.play();
    inputDir={x: 0 ,y: 1};  //Game Started as soon as any key pressed
    moveSound.play(); // This is sound played when you press a button to move the snake, moveSound is the var name...
    switch (e.key) {
        case "ArrowUp":
            inputDir.x=0;
            inputDir.y=-1;
            break;
        
        case "ArrowDown":
            inputDir.x=0;
            inputDir.y=1;
            break;
        
        case "ArrowLeft":
            inputDir.x=-1;
            inputDir.y=0;
            break;
    
        case "ArrowRight":
            inputDir.x=1;
            inputDir.y=0;
            break;
            
        default:
            break;
    }
});
