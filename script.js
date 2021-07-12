/*

AI Logic:
1) If you go first - put your X/O in the corner but if you go second and opponent puts their move in any other place but the corner - winning is almost impossible so put your X/O in the middle to force a draw
2) Win in one move
3) Block opponent's move if they are about to win
4) Play somewhere you can potentially win (there is 3 empty spots in any of the 3 directions)
5) Random move

*/

let boardState = []; // declaring an array - don't need a size
let btnArray = [];
let table = document.getElementById("board"); // getting the board from html file
let AIMove = 1;
let playerMove = 2;
let current;
let gameType;
for(let i = 0; i < 3; i++) {
    let row = table.insertRow(); // inserting rows
    boardState.push([]);  // .push - inserting something into array - creating a 2D array
    btnArray.push([]);
    for(let j = 0; j < 3; j++) { // inserting columns 
        let cell = row.insertCell();
        let button = document.createElement("button"); // inserting buttons
        btnArray[i].push(button); // adding 3 buttons for each row 
        button.className = "boardButton";
        button.x = j;   // assigning coordinates
        button.y = i;
        button.onclick = click; // calling the click function once a button is clicked
        cell.appendChild(button); // puts button inside the cell
        boardState[i].push(0); // initially array is full of 0's
    }
}

let resetBtn = document.getElementById("reset");
let singleBtn = document.getElementById("singlePlayer");
let multiBtn = document.getElementById("multiPlayer");
resetBtn.className = "options";
singleBtn.className = "options";
multiBtn.className = "options";

functionality(true);

function functionality(disable){ // enabling/disabling the board
  for (let i=0; i<3; i++){
    for (let j=0; j<3; j++){
      btnArray[i][j].disabled = disable;
    }
  }
}

function randomMove(){
  let emptySpot = [];
  let count=0;
  for (let i=0; i<3; i++){
    for (let j=0; j<3; j++){
      if (boardState[j][i] == 0){
        emptySpot.push([j, i]);
        count++;
      }
    }
  }
  randNum = Math.floor(Math.random() * count);
  if (count == 0){
    return false;
  }
  return emptySpot[randNum];
}

function singlePlayer(){
  functionality(false);
  gameType = "S";
  let name = window.prompt("Do you want to be X or O?: ");
  if (name == "X"){
    playerMove = 1;
    AIMove = 2;
  } else{
    playerMove = 2;
    AIMove = 1;
  }
  let move = window.prompt("Do you want to go first (Y/N)?: ");
  while (move != "Y" && move != "N"){
    alert("Invalid input!");
    move = window.prompt("Do you want to go first (Y/N)?: ");
  }
    
  //while (move != "Y" && move != "N"){
  if (move == "Y"){
    if (playerMove == 1){
      current = 0; // 1 is X
    } else{
      current = 1; // 0 is O
    }
  } else {
    if (AIMove == 1){
      current = 0; // 0 is O
    } else{
      current = 1; // 1 is X
    }
  }  
  //}
  
  if(move == "N") {
      playAIMove();
  }
}

function multiPlayer() {
  functionality(false);
  gameType = "M";
  let name = window.prompt("Which player wants to go first (X/O)?: ");
  while(name != "X" && name != "O") {
    if (name == "X"){
      current = 0;
    } else if (name == "O"){
      current = 1;
    } else {
      alert("Invalid input!");
      name = window.prompt("Which player wants to go first (X/O)?: ");
    }
  }
}

// returns true if valid, else returns false
function isValid(row, col) {
  let valid = false;
  if (row < 3 && col < 3 && row >= 0 && col >= 0){
    valid = true;
  } 
  return valid;
}

function checkDirection(col, row, deltaCol, deltaRow, turn) {
  if(isValid(col + (2*deltaCol), row + (2*deltaRow)) == true) {  // checking down vertically
    if(boardState[col + deltaCol][row + deltaRow] == turn && boardState[col + (2*deltaCol)][row + (2*deltaRow)] == 0) {
      return [col + (2*deltaCol), row + (2*deltaRow)]; // returns the furthest coordinate from current element
    } else if(boardState[col + deltaCol][row + deltaRow] == 0 && boardState[col + (2*deltaCol)][row + (2*deltaRow)] == turn) {
      return [col + deltaCol, row + deltaRow];
    }
  }
  return false;
}

// if letter is AI, win in one move
// if letter is player, block in one move
function winBlock(turn) {
  let turn1;
  if(turn == 0) turn1 = AIMove; 
  else turn1 = turn; // if false - proceed to win or block
  for(let i = 0; i < 3; i++) {
    for(let j = 0; j < 3; j++) {
      if(boardState[j][i] == turn1) {
        if(checkDirection(j, i, 1, 0, turn) != false) { // down
          return checkDirection(j, i, 1, 0, turn);
        } else if(checkDirection(j, i, 0, 1, turn) != false) { // checking right
          return checkDirection(j, i, 0, 1, turn); 
        } else if(checkDirection(j, i, 1, 1, turn) != false) { // diagonally top to bottom right
          return checkDirection(j, i, 1, 1, turn); 
        } else if(checkDirection(j, i, -1, 0, turn) != false) { // up
          return checkDirection(j, i, -1, 0, turn); 
        } else if (checkDirection(j, i, -1, -1, turn) != false){ // diagonally bottom right to top left
          return checkDirection(j, i, -1, -1, turn);
        } else if (checkDirection(j, i, 0, -1, turn) != false){ // checking left
          return checkDirection(j, i, 0, -1, turn);
        } else if (checkDirection(j, i, -1, 1, turn) != false){ // diagonally bottom left to top right
          return checkDirection(j, i, -1, 1, turn); 
        } else if (checkDirection(j, i, 1, -1, turn) != false){ // diagonally top right to bottom left
          return checkDirection(j, i, 1, -1, turn); 
        }
      }
    }
  }
  //console.log("returns false");
  return false;
}

function playAIMove(firstMove) {
  let move;
  if(firstMove == true) {
    move = AIFirstMove();
  } else {
    move = winBlock(AIMove); // win - if win, stop here 
    if(move == false) {
      move = winBlock(playerMove); // block
    }
    if(move == false) {
      move = winBlock(0);
    }
    if (move == false){
      move = randomMove();
      if (move == false){
        confirm("It's a tie!");
        reset();
        current = !current;
      }
    }
  }
  //console.log("move", move);
  boardState[move[0]][move[1]] = AIMove;
  if(AIMove == 1) {
    btnArray[move[0]][move[1]].innerHTML = "X"
  } else {
    btnArray[move[0]][move[1]].innerHTML = "O";
  }
  
  btnArray[move[0]][move[1]].disabled = true;


  current = !current;
}

function AIFirstMove(current){
  let empty = true;
  let cornerArray = [[0, 0], [0, 2], [2, 0], [2, 2]];
  let randNum;
  if(current == 0) current = 2;
  if(current == AIMove){
    randNum = Math.floor(Math.random() * 4);
    return [[cornerArray[randNum][0]], [cornerArray[randNum][1]]]
  } else {
      if (boardState[1][1] == 0){
        return [1, 1];
    } else { // if center is taken
      randNum = Math.floor(Math.random() * 4);
      return[[cornerArray[randNum][0]], [cornerArray[randNum][1]]];    
    }
  }
}

function solveRowCol(rowCol) {
  let turn;
  let x;
  let win;
  for (let i=0; i<3; i++){
    win = 1;
    x = 0;
    turn = 0;
    if (rowCol == 0){ // horizontal
      if (boardState[i][0] != 0){
        turn = boardState[i][0];
        x = 1;
      }
    } else{ // vertical
      if (boardState[0][i] != 0){
        turn = boardState[0][i];
        x = 1;
      }
    }
    if(x == 1) {
      for (let j=0; j<3; j++){
        if( ((rowCol == 0) && (boardState[i][j] != turn)) || ((rowCol == 1) && (boardState[j][i] != turn)) ) {
          win = 0;  // cannot win
          break;
        }
      }
    }
    if(turn == 1 && win == 1){ 
      win = 2;
    } else if(turn == 2 && win == 1) { 
      win = 3;
    }
    if(win == 2 || win == 3) return win;
  }
  return 0; // win must be 0 b/c no chance of winning 
}

function solve() {
  let win1 = 1;
  let win2 = solveRowCol(0);
  let win3 = solveRowCol(1);
  let turn;
  
  // checking diagonally 
  if (boardState[0][0] != 0){
    turn = boardState[0][0];
    if(boardState[0][0] != turn || boardState[1][1] != turn || boardState[2][2] != turn) {
      win1 = 0;
    }
  }
  if(boardState[0][2] != 0) {
    turn = boardState[0][2];
    if(boardState[0][2] != turn || boardState[1][1] != turn || boardState[2][0] != turn) {
      win1 = 0;
    }
  }
  if(turn == 1 && win1 == 1) { 
    win1 = 2;
  } else if(turn == 2 && win1 == 1) { 
    win1 = 3;
  } else {
    win1 = 0;
  }

  if (win1 == 2 || win2 == 2 || win3 == 2){
    confirm("X won!");
    reset();
  } else if (win1 == 3 || win2 == 3 || win3 == 3){
    confirm("O won!");
    reset();
  }
  
  let over = 1;
  for(let i = 0; i < 3; i++) {
    for(let j = 0; j < 3; j++) {
      if(boardState[j][i] == 0) {
        over = 0;
      }
    }
  }
  if(over == 1) {
    confirm("It's a tie!");
    reset();
  }
}

function click() {
    console.log(this.x, this.y); // printing x and y coordinates
    if(current == 1) {
        current = 0;
    } else {
        current = 1;
    }
    if(current == 1) {
      this.innerHTML = "X";
      boardState[this.y][this.x] = 1; // turns entry from 0 to 1
    } else {
      this.innerHTML = "O";
      boardState[this.y][this.x] = 2; // turns entry from 0 to 2
    }
    //this.innerHTML = "X"; // makes button become X once its clicked on
    console.log(boardState);  // printing board array
    this.disabled = true; // disables a button after it's clicked on
    setTimeout(solve, 100);
    if (gameType == "S"){
      let count = 0;
      for(let i = 0; i < 3; i++) {
        for(let j = 0; j < 3; j++) {
          if(boardState[j][i] != 0) {
            count++; // counting how many moves have been played on the board
          }
        }
      }
      if(count == 1 || count == 0) {
        playAIMove(true);
      } else {
        playAIMove(false);
      }
  }
}



function reset() {
  for (let i=0; i<3; i++){
    for (let j=0; j<3; j++){
      boardState[i][j] = 0;
    }
  }
  
  for(let row of table.children[0].children) {
    for(let cell of row.children) {
      cell.children[0].innerHTML = "";
      cell.children[0].disabled = false;
    }
  }

}

