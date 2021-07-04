let boardState = []; // declaring an array - don't need a size
let table = document.getElementById("board"); // getting the board from html file
let name = window.prompt("Which player wants to go first?: ");
if (name == "X"){
  current = 0;
} else{
  current = 1;
}

for(let i = 0; i < 3; i++) {
    let row = table.insertRow(); // inserting rows
    boardState.push([]);  // .push - inserting something into array - creating a 2D array
    for(let j = 0; j < 3; j++) { // inserting columns 
        let cell = row.insertCell();
        let button = document.createElement("button"); // inserting buttons
        button.x = j;   // assigning coordinates
        button.y = i;
        button.onclick = click; // calling the click function once a button is clicked
        cell.appendChild(button); // puts button inside the cell
        boardState[i].push(0); // initially array is full of 0's
    }
}

function solveRowCol(rowCol) {
  let turn;
  let x;
  let win;
  for (let i=0; i<3; i++){
    win = 1;
    x = 0;
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
  } else if (win1 == 3 || win2 == 3 || win3 == 3){
    confirm("O won!");
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
    solve();
}
/*
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
} */
