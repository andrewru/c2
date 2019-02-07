import "./styles.css";
import Two from "two.js";

document.getElementById("app").innerHTML = `
<a id='proceed'>Proceed</a> | <a id='play'>Play</a> | <a id='stop'>Stop</a>
<div id='canvas'>
  
</div>
`;

var SIZE = 100;

const WIDTH = 800;
const HEIGHT = 800;

let RADIUS = WIDTH / (2 * SIZE);

var params = { width: WIDTH, height: HEIGHT };

class Board {
  constructor() {
    this.elem = document.getElementById("canvas");
    this.canvas = new Two(params).appendTo(this.elem);
    let rawArray = Array(SIZE).fill(Array(SIZE).fill(false));
    this.state = rawArray.map(row =>
      row.map(cell => (Math.random() > 0.5 ? true : false))
    );
    this.circles = rawArray
      .reduce((memo, row) => memo.concat(row))
      .map((cell, pos) => {
        const i = Math.floor(pos / SIZE);
        const n = pos % SIZE;
        return this.canvas.makeCircle(
          (i + 0.5) * 2 * RADIUS,
          (n + 0.5) * 2 * RADIUS,
          RADIUS
        );
      });
  }

  next(id = 0) {
    let newState = [Array(SIZE).fill(false)].
    this.state = this.state.map((row, i, allCells) =>
      row.map((cell, n) => {
        let count = 0;
        count += allCells[i][n - 1] ? 1 : 0;
        count += allCells[i][n + 1] ? 1 : 0;
        if (allCells[i - 1]) {
          count += allCells[i - 1][n] ? 1 : 0;
          count += allCells[i - 1][n - 1] ? 1 : 0;
          count += allCells[i - 1][n + 1] ? 1 : 0;
        }
        if (allCells[i + 1]) {
          count += allCells[i + 1][n] ? 1 : 0;
          count += allCells[i + 1][n - 1] ? 1 : 0;
          count += allCells[i + 1][n + 1] ? 1 : 0;
        }
        return (cell && count === 2) || count === 3 || (!cell && count === 3);
      })
    );
  }

  render(id = 0) {
    //this.canvas.clear();
    this.state.forEach((row, i) => {
      row.forEach((cell, n) => {
        let circle = this.circles[i * SIZE + n];
        circle.fill = cell ? "#00FF00" : "#FFFFFF";
      });
    });
    this.canvas.update();
  }
}

let board = new Board();
board.render();

let proceedButton = document.getElementById("proceed");

proceedButton.onclick = () => {
  stopped = true;
  board.next();
  board.render();
};

let stopped = false;

let playButton = document.getElementById("play");

playButton.onclick = () => {
  const advance = () => {
    board.next();
    board.render();
    if (!stopped) {
      setTimeout(advance, 0);
    }
  };

  stopped = false;
  advance();
};

let stopButton = document.getElementById("stop");

stopButton.onclick = () => {
  stopped = true;
};
