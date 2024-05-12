import React, { useState, useRef, useEffect } from "react";
import { useInterval } from "./useInterval";
import {useNavigate} from 'react-router-dom'
import axios from 'axios';
import './index.css';
import {
  CANVAS_SIZE,
  SNAKE_START,
  APPLE_START,
  SCALE,
  SPEED,
  DIRECTIONS
} from "./constants";

const SnakeGame = () => {

  const nav = useNavigate();
  const canvasRef = useRef();
  const [snake, setSnake] = useState(SNAKE_START);
  const [render, setRender] = useState(false);
  const [render2, setRender2] = useState(false);
  const [apple, setApple] = useState(APPLE_START);
  const [appleEaten, setappleEaten] = useState(0);
  const [dir, setDir] = useState([0, -1]);
  const [speed, setSpeed] = useState(null);
  const [gameOver, setGameOver] = useState(false);
  const idUser = localStorage.getItem('idUser');
  useInterval(() => gameLoop(), speed);

  const endGame = async () => {
    setSpeed(null);
    setGameOver(true);
    try{    
      await axios.get(`http://localhost:3001/game/${idUser}/${appleEaten}`);
    }
    catch(e){
      console.log(e.message);
    }
  };

  const [data, setData] = useState(null);
  const [loader, setLoader] = useState(true);

  const fetchData = async () => {
    try{
      setLoader(true);
      const resp = await axios.get(`http://localhost:3001/gameAllData`);
      if(resp.status === 200){
        setData(resp.data);
        setLoader(false);

      }
      else{
        setData([]);
        setLoader(false);

      }
    }
    catch(e){
      setData([]);
      setLoader(false);

      console.log(e.message);
    }
    
  };

  useEffect(()=>{
    fetchData();
  }, []);

  useEffect(()=>{
    fetchData();
  }, [gameOver]);

  useEffect(()=>{
    setTimeout(()=>{
      setRender2(true);
    }, 500);
  }, []);
 

  const moveSnake = ({ keyCode }) =>
    keyCode >= 37 && keyCode <= 40 && setDir(DIRECTIONS[keyCode]);

  const createApple = () =>
    apple.map((_a, i) => Math.floor(Math.random() * (CANVAS_SIZE[i] / SCALE)));

  const checkCollision = (piece, snk = snake) => {
    if (
      piece[0] * SCALE >= CANVAS_SIZE[0] ||
      piece[0] < 0 ||
      piece[1] * SCALE >= CANVAS_SIZE[1] ||
      piece[1] < 0
    )
      return true;

    for (const segment of snk) {
      if (piece[0] === segment[0] && piece[1] === segment[1]) return true;
    }
    return false;
  };

  const checkAppleCollision = newSnake => {
    if (newSnake[0][0] === apple[0] && newSnake[0][1] === apple[1]) {
      let newApple = createApple();
      while (checkCollision(newApple, newSnake)) {
        newApple = createApple();
      }
      setappleEaten(appleEaten+1);
      setApple(newApple);
      return true;
    }
    return false;
  };

  const gameLoop = () => {
    const snakeCopy = JSON.parse(JSON.stringify(snake));
    const newSnakeHead = [snakeCopy[0][0] + dir[0], snakeCopy[0][1] + dir[1]];
    snakeCopy.unshift(newSnakeHead);
    if (checkCollision(newSnakeHead)) endGame();
    if (!checkAppleCollision(snakeCopy)) snakeCopy.pop();
    setSnake(snakeCopy);
  };

  const startGame = () => {
    setappleEaten(0);
    setSnake(SNAKE_START);
    setApple(APPLE_START);
    setDir([0, -1]);
    setSpeed(SPEED);
    setGameOver(false);
  };

  useEffect(() => {
    const context = canvasRef.current.getContext("2d");
    context.setTransform(SCALE, 0, 0, SCALE, 0, 0);
    context.clearRect(0, 0, window.innerWidth, window.innerHeight);
    context.fillStyle = "#e4e6eb";
    snake.forEach(([x, y]) => context.fillRect(x, y, 1, 1));
    context.fillStyle = "red";
    context.fillRect(apple[0], apple[1], 1, 1);
  }, [snake, apple, gameOver]);

  return (
    <div className="pageSnakeGame">
      {
        !render && 
        <div className={!render ? "sfvuuosdv showsfvuuosdv" : "sfvuuosdv"}>
        <div className="caseuozfo">
          <div className={render2 ? "zusefud showzusefud" : "zusefud"}>
            <h1>
            <span>🕹️</span>&nbsp;Online Snake Game 
            </h1>
            <br /><br />
            <div className="contBik">
              <button
                onClick={()=>{
                  nav('/');
                }}
              >
                <i className="fa-solid fa-arrow-left"></i>&nbsp;&nbsp;&nbsp;&nbsp;Back Home
              </button>
              <button
                onClick={()=>{
                  setRender(true);
                }}
              >
                Play Now&nbsp;&nbsp;&nbsp;&nbsp;<i className="fa-solid fa-arrow-right"></i>
              </button>
            </div>
            <br /><br/>
            <h1 className="zuisdfwhi">
              <span>🏆</span>&nbsp;Leader Board
            </h1>
            <br />
            <div className="participants">
            {
              loader ? <div className="uozsuofduosdf">
                Loading...
              </div>
              :
              <>
              {
                data.length === 0 ? "No one has played yet.. Be the first!"
                :
                <>
                {
                  data.map((score, index)=>{
                    return(
                      <div onClick={()=>{
                        nav(`/profile/${score.player}`)
                      }} className="rowPpp">
                          <div className="uosuodfuofduo">
                            {
                              index === 0 ? "🥇" : index === 1 ? "🥈" : "🥉"
                            }
                          </div>
                          <div className="caseiooui">
                            <img src={score.picture} alt="" />
                            {score.fullName}
                          </div>
                          <div className="uzrfuozfuozuof">
                            {score.score}&nbsp;🍎
                          </div>
                      </div>
                   
                    )
                  })
                }
                </>
              }
              </>
            }
            </div>
          </div>  
        </div>
        <div className="caseuozfo caseuozfocaseuozfo">
        </div>  
      </div>
      }
      <div className={render && "addZIndex"}  role="button" tabIndex="0" onKeyDown={e => moveSnake(e)}>
        <h1 className="uiqduqduf">
          Score : <span>{appleEaten}&nbsp;🍎</span>
          {gameOver && <div className="Gameover">GAME OVER!</div>}
        </h1>
        <br />
        <canvas
          className={gameOver ? "zuifuidq showzuifuidqblack" : "zuifuidq"}
          ref={canvasRef}
          width={`${CANVAS_SIZE[0]}px`}
          height={`${CANVAS_SIZE[1]}px`}
        />
        <div className="contBik">

              <button
                onClick={()=>{
                  setappleEaten(0)
                  setRender(false);
                  setSnake(SNAKE_START);
                  setApple(APPLE_START);
                  setDir([0, -1]);
                  setSpeed(null);
                  setGameOver(false);
                }}
              >
                Exit
              </button>
              <button onClick={startGame}>Start</button>

            </div>
      </div>
      
    </div>
  );
};

export default SnakeGame;