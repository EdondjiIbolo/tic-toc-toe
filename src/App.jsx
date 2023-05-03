import { useState } from "react"
import confetti from 'canvas-confetti'
const TURNOS = {
  X: '❌',
  O: '⚪'
}


const Square = ({children ,isSelected, updateBoard , index})=>{
  const className = `square ${isSelected ? 'is-selected' : ''}`

  const handleClick = ()=>{
    updateBoard(index);
  }
  return(
    <div className={className} onClick={handleClick}>
      {children}
    </div>
  )
}
const winnerCombo = [
  [0,1,2],
  [3,4,5],
  [6,7,8],
  [0,3,6],
  [1,4,7],
  [2,5,8],
  [0,4,8],
  [2,4,6]]

function App() {
  const [board , setBoard] = useState(()=> {
    const getByLocalStorage = window.localStorage.getItem('board')
    return getByLocalStorage ? JSON.parse(getByLocalStorage) : Array(9).fill(null)})
  const [turn , setTurn] = useState(()=> {
    const getByLocalStorageTurn = window.localStorage.getItem('turn')
    return getByLocalStorageTurn ? JSON.parse(getByLocalStorageTurn) : TURNOS.X 
  })
  const [winner , setWinner] = useState(null) 
/* utilizaremos null como  que no hay ganador  es decir modo de inicio .  y el false como empate , es decir al terminar la partida */
  const resetGame = ()=>{
    setBoard(Array(9).fill(null))
    

    window.localStorage.removeItem('board')
    window.localStorage.removeItem('turn')
    setWinner(null)
  }
  const checkEndGame = (newBoard) =>{
    return newBoard.every(square=> square!== null)
  }
  const checkWinner = (boardToCheck)=>{
    for(const combo of winnerCombo){
      const [a,b,c] = combo
      if(
        boardToCheck[a] &&
        boardToCheck[a]===boardToCheck[b]&&
        boardToCheck[a]===boardToCheck[c]
      ){
        return boardToCheck[a]
      }
    }
    return  null
  }


  const updateBoard = (index)=>{
    // no actualizar si ya contiene un dato o tenemos un ganador
    if(board[index] || winner) return
    // actualizar tablero
    const newBoard = [...board]
    newBoard[index] = turn
    setBoard(newBoard)
    // camciar el turno
    const newTurn = turn === TURNOS.X ? TURNOS.O : TURNOS.X
    // guardar mitad de la partida
    window.localStorage.setItem('board', JSON.stringify(newBoard))
    window.localStorage.setItem('turn', JSON.stringify(newTurn))
    setTurn(newTurn);
    const newWinner = checkWinner(newBoard)
    if (newWinner){
      confetti()
      setWinner(newWinner)
    } else if(checkEndGame(newBoard)){
      setWinner(false) //empate
    }
  }
  return (
   
  <main className="board">    
    <h1 className="title"> Juego de tres en raya</h1>
    <button onClick={resetGame}>Reiniciar el juego</button>
    <section className="game">
      {
        board.map((_, index)=>{
         return (
            <Square
            key={index}
            index={index}
            updateBoard={updateBoard}>
              {board[index]}
            </Square>
          )
        })
      }
    </section>
    <section className="turn">
      <Square isSelected={turn===TURNOS.X}>
        {TURNOS.X}
      </Square>
      <Square isSelected={turn===TURNOS.O}>
        {TURNOS.O}
      </Square>
    </section>
    {winner!==null &&
      (
      <section className="winner">
        <div className="text">
          <h2>
            {
              winner === false
              ? 'Empate':  ' Ha ganado'
            }
          </h2>

          <header className="win">
            {winner && <Square>{winner}</Square>}
          </header>
          <footer>
            <button onClick={resetGame}>
              Empezar de nuevo</button>
          </footer>
        </div>
      </section>
      )
    }
    

  </main>
  )
 
}

export default App
