import { useEffect, useState } from "react";
import "./App.css";

const BIRD_SIZE = 20;
const GAME_HEIGHT = 500;
const GAME_WIDTH = 500;
const GAP = 120;
const OBSTACLE_WIDTH = 50;
const GRAVITY = 4;
const JUMP_HEIGHT = 50;
const OBSTACLE_SPEED = 10;

function App() {
  const [startGame, setStartGame] = useState(false);
  const [birdPosition, setBirdPosition] = useState(GAME_HEIGHT / 2);
  const [obstacleHeight, setObstacleHeight] = useState(100);
  const [obstacleLeft, setObstacleLeft] = useState(GAME_WIDTH - OBSTACLE_WIDTH);
  const [score, setScore] = useState(0);
  const [highScore, setHighScore] = useState(0);
  const [gameOver, setGameOver] = useState(false);

  // Obstacle movement
  useEffect(() => {
    if (!startGame) return;

    const obstacleInterval = setInterval(() => {
      setObstacleLeft((prev) => {
        if (prev > -OBSTACLE_WIDTH) return prev - OBSTACLE_SPEED;

        // Reset obstacle & randomize height
        setObstacleHeight(Math.floor(Math.random() * (GAME_HEIGHT - GAP)));
        setScore((s) => s + 1);
        return GAME_WIDTH - OBSTACLE_WIDTH;
      });
    }, 24);

    return () => clearInterval(obstacleInterval);
  }, [startGame]);

  // Gravity
  useEffect(() => {
    if (!startGame) return;

    const gravityInterval = setInterval(() => {
      setBirdPosition((prev) =>
        prev < GAME_HEIGHT - BIRD_SIZE ? prev + GRAVITY : prev
      );
    }, 24);

    return () => clearInterval(gravityInterval);
  }, [startGame]);

  // Collision detection
  useEffect(() => {
    if (!startGame) return;

    const hasCollided =
      obstacleLeft < BIRD_SIZE + 50 && // account for bird's X-position
      obstacleLeft > 0 &&
      (birdPosition < obstacleHeight ||
        birdPosition > obstacleHeight + GAP);

    if (hasCollided || birdPosition >= GAME_HEIGHT - BIRD_SIZE) {
      setStartGame(false);
      setGameOver(true);

      // Update high score
      setHighScore((prev) => (score > prev ? score : prev));
    }
  }, [startGame, birdPosition, obstacleHeight, obstacleLeft, score]);

  // Keyboard controls (Spacebar to jump)
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.code === "Space" && startGame) {
        setBirdPosition((prev) =>
          prev - JUMP_HEIGHT > 0 ? prev - JUMP_HEIGHT : 0
        );
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [startGame]);

  // Restart game
  const start = () => {
    setBirdPosition(GAME_HEIGHT / 2);
    setObstacleHeight(100);
    setObstacleLeft(GAME_WIDTH - OBSTACLE_WIDTH);
    setScore(0);
    setGameOver(false);
    setStartGame(true);
  };

  const bottomObstacleHeight = GAME_HEIGHT - (obstacleHeight + GAP);

  return (
    <div className="App">
      <div
        onClick={() =>
          startGame &&
          setBirdPosition((prev) =>
            prev - JUMP_HEIGHT > 0 ? prev - JUMP_HEIGHT : 0
          )
        }
        style={{
          overflow: "hidden",
          position: "relative",
          backgroundImage: "url('/background.png')",
          backgroundSize: "cover",
          backgroundRepeat: "no-repeat",
          backgroundPosition: "center",

          width: `${GAME_WIDTH}px`,
          height: `${GAME_HEIGHT}px`,
        }}
      >
        {/* Top Obstacle */}
        <div
          style={{
            position: "absolute",
            top: 0,
            left: obstacleLeft,
            width: OBSTACLE_WIDTH,
            height: obstacleHeight,
            backgroundColor: "green",
          }}
        />
        {/* Bottom Obstacle */}
        <div
          style={{
            position: "absolute",
            top: obstacleHeight + GAP,
            left: obstacleLeft,
            width: OBSTACLE_WIDTH,
            height: bottomObstacleHeight,
            backgroundColor: "green",
          }}
        />
        {/* Bird */}
        {/* Bird */}
<img
  src="/bird.png"
  alt="bird"
  style={{
    position: "absolute",
    width: `${BIRD_SIZE * 2}px`, // slightly bigger than 20px
    height: `${BIRD_SIZE * 2}px`,
    top: birdPosition,
    left: 50,
  }}
/>


        {/* Game Over Overlay */}
        {gameOver && (
          <div
            style={{
              position: "absolute",
              top: 0,
              left: 0,
              width: "100%",
              height: "100%",
              backgroundColor: "rgba(0,0,0,0.6)",
              color: "white",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              fontSize: "24px",
              fontWeight: "bold",
            }}
          >
            <p>Game Over</p>
            <p>Final Score: {score}</p>
            <p>High Score: {highScore}</p>
            <button
              style={{
                padding: "10px 20px",
                fontSize: "18px",
                marginTop: "10px",
                cursor: "pointer",
                borderRadius: "8px",
              }}
              onClick={start}
            >
              Restart
            </button>
          </div>
        )}
      </div>

      {!gameOver && (
        <>
          <h2>Score: {score}</h2>
          <h3>High Score: {highScore}</h3>
          {!startGame && <button onClick={start}>Start Game</button>}
          <p>Press <b>Space</b> or Click to Jump</p>
        </>
      )}
    </div>
  );
}

export default App;
