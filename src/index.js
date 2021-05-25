import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';

class Board extends React.Component {
  renderSquare(i) {
    return (
      <Square
        value={this.props.squares[i]}
        onClick={() => this.props.onClick(i)}
        isHighlight={ this.props.winLine.includes(i) }
        key={i}
      />
    );
  }

  render() {
    const boardSquares = [[0, 1, 2], [3, 4, 5], [6, 7, 8]];
    return (
      <div>
        { 
          boardSquares.map((rowSquares, i) => {
            return(
              <div className="board-row" key={i}>
                {
                  rowSquares.map((square) =>{
                    return(this.renderSquare(square))
                  })
                }
              </div>
            )
          })
        }
      </div>
    );
  }
}

class Game extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      history: [{
        squares: Array(9).fill(null)
      }],
      stepNumber: 0,
      oIsNext: true,
      prevCount: 1
    };
  }

  handleClick(i) {
    const history = this.state.history.slice(0, this.state.stepNumber + 1);
    const current = history[history.length - 1];
    const squares = current.squares.slice();

    if (calculateWinner(squares) || squares[i]) {
      return;
    }
    squares[i] = this.state.oIsNext ? 'O' : 'X';
    this.setState({
      history: history.concat([{
        squares: squares
      }]),
      stepNumber: history.length,
      oIsNext: !this.state.oIsNext,
      prevCount: this.state.prevCount
    });
  }

  jumpTo(step) {
    this.setState({
      stepNumber: step,
      oIsNext: (step % 2) === 0,
      prevCount: this.state.prevCount + 1
    })
  }

  jumpToNext(step) {
    this.setState({
      stepNumber: step,
      oIsNext: (step % 2) === 0,
      prevCount: this.state.prevCount - 1
    })
  }

  prev_btn(stepNumber) {
    if( this.state.stepNumber > 0 && this.state.stepNumber < 9 ) {
      return(
        <button onClick={() => this.jumpTo(stepNumber-1)}>&lt;</button>
      );
    }else{
      return(
        <button>&lt;</button>
      );
    }
  }

  next_btn(stepNumber) {
    if( this.state.stepNumber < 9 && this.state.prevCount > 1 ) {
      return(
        <button onClick={() => this.jumpToNext(stepNumber+1)}>&gt;</button>
      );        
    }else{
      return(
        <button>&gt;</button>
      );
    }
  }

  render() {
    const history = this.state.history;
    const current = history[this.state.stepNumber];
    const winner = calculateWinner(current.squares);
    const moves = history.map((step, move) => {
      const desc = move ? '' : 'Re Start';
      return(
        <li key={move}>
          { move === 0 ? 
            <button onClick={() => this.jumpTo(move)} className="history">
              { desc }
            </button> 
            : ""
          }
        </li>
      );
    });
    
    let status;
    let winLine = [];
    if (winner) {
      status = 'Winner: ' + winner.player;
      winLine = winner.line;
    } else {
      status = 'Next player: ' + (this.state.oIsNext ? 'O' : 'X');
      if( this.state.stepNumber === 9) {
        status = "Draw";
        winLine = [0,1,2,3,4,5,6,7,8]
      }
    }
    
    return (
      <div className="game">
        <div className="game-board">
          <div className="game-cap">{status}</div>
          <Board
            squares={current.squares}
            onClick={(i) => this.handleClick(i)}
            winLine={winLine}
          />
        </div>
        <div className="game-info">
          <ol>{moves}</ol>
          <ol>{this.prev_btn(this.state.stepNumber)}</ol>
          <ol>{this.next_btn(this.state.stepNumber)}</ol>
        </div>
      </div>
    );
  }
}

// ========================================

ReactDOM.render(
  <Game />,
  document.getElementById('root')
);

function Square(props) {
  return (
    <button 
      className={ props.isHighlight ? "square highlight-color" : "square" }
      onClick={props.onClick}
    >
      {props.value}
    </button>
  );
}

function calculateWinner(squares) {
  const lines = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6],
  ];
  for (let i = 0; i < lines.length; i++) {
    const [a, b, c] = lines[i];
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      return { player: squares[a], line: [a, b, c] };
    }
  }
  return null;
}
