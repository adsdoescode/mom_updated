import { useState, useEffect } from "react";
import { Button } from "./ui/button";
import { Card } from "./ui/card";
import { Shuffle, RotateCcw, Eye, EyeOff, ArrowRight } from "lucide-react";

const GRID_SIZE = 3;
const TILE_COUNT = GRID_SIZE * GRID_SIZE;
const EMPTY_TILE = TILE_COUNT - 1;

// Space-themed image
const PUZZLE_IMAGE = "https://images.unsplash.com/photo-1720141069840-5d04d315afbe?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtYXJzJTIwcm92ZXIlMjBzcGFjZWNyYWZ0fGVufDF8fHx8MTc2MzkwNTIwOHww&ixlib=rb-4.1.0&q=80&w=1080";

type Tile = number;
type Board = Tile[];

// Generate solved board
const createSolvedBoard = (): Board => {
  return Array.from({ length: TILE_COUNT }, (_, i) => i);
};

// Check if board is solvable
const isSolvable = (board: Board): boolean => {
  let inversions = 0;
  const flatBoard = board.filter(tile => tile !== EMPTY_TILE);

  for (let i = 0; i < flatBoard.length; i++) {
    for (let j = i + 1; j < flatBoard.length; j++) {
      if (flatBoard[i] > flatBoard[j]) {
        inversions++;
      }
    }
  }

  const emptyRow = Math.floor(board.indexOf(EMPTY_TILE) / GRID_SIZE);

  if (GRID_SIZE % 2 === 1) {
    return inversions % 2 === 0;
  } else {
    return (inversions + emptyRow) % 2 === 1;
  }
};

// Shuffle board
const shuffleBoard = (board: Board): Board => {
  let newBoard: Board;
  do {
    newBoard = [...board].sort(() => Math.random() - 0.5);
  } while (!isSolvable(newBoard) || JSON.stringify(newBoard) === JSON.stringify(createSolvedBoard()));
  return newBoard;
};

// Check if puzzle is solved
const isSolved = (board: Board): boolean => {
  return board.every((tile, index) => tile === index);
};

// Get valid moves
const getValidMoves = (board: Board, emptyIndex: number): number[] => {
  const moves: number[] = [];
  const row = Math.floor(emptyIndex / GRID_SIZE);
  const col = emptyIndex % GRID_SIZE;

  // Up
  if (row > 0) moves.push(emptyIndex - GRID_SIZE);
  // Down
  if (row < GRID_SIZE - 1) moves.push(emptyIndex + GRID_SIZE);
  // Left
  if (col > 0) moves.push(emptyIndex - 1);
  // Right
  if (col < GRID_SIZE - 1) moves.push(emptyIndex + 1);

  return moves;
};

interface SlidingPuzzleProps {
  onComplete: () => void;
}

export function SlidingPuzzle({ onComplete }: SlidingPuzzleProps) {
  const [board, setBoard] = useState<Board>(createSolvedBoard());
  const [moves, setMoves] = useState(0);
  const [isImageLoaded, setIsImageLoaded] = useState(false);
  const [solved, setSolved] = useState(false);

  useEffect(() => {
    const img = new Image();
    img.src = PUZZLE_IMAGE;
    img.onload = () => {
      setIsImageLoaded(true);
      // Auto shuffle after image loads
      setTimeout(() => handleShuffle(), 500);
    };
  }, []);

  const handleShuffle = () => {
    setBoard(shuffleBoard(createSolvedBoard()));
    setMoves(0);
    setSolved(false);
  };

  const handleTileClick = (index: number) => {
    if (solved) return;

    const emptyIndex = board.indexOf(EMPTY_TILE);
    const validMoves = getValidMoves(board, emptyIndex);

    if (validMoves.includes(index)) {
      const newBoard = [...board];
      [newBoard[emptyIndex], newBoard[index]] = [newBoard[index], newBoard[emptyIndex]];
      setBoard(newBoard);
      setMoves(moves + 1);

      if (isSolved(newBoard)) {
        setSolved(true);
      }
    }
  };

  const getTileStyle = (tile: number) => {
    const row = Math.floor(tile / GRID_SIZE);
    const col = tile % GRID_SIZE;
    const tileSize = 100 / GRID_SIZE;

    return {
      backgroundImage: `url(${PUZZLE_IMAGE})`,
      backgroundSize: `${GRID_SIZE * 100}%`,
      backgroundPosition: `${col * tileSize}% ${row * tileSize}%`,
    };
  };

  const emptyIndex = board.indexOf(EMPTY_TILE);
  const validMoves = getValidMoves(board, emptyIndex);

  return (
    <div className="max-w-7xl mx-auto">
      <div className="text-center mb-8">
        <h1 className="text-white mb-2 text-8xl font-bold">Space Sliding Puzzle</h1>
        <p className="text-purple-300 text-lg">Click tiles adjacent to the empty space to move them</p>
      </div>

      <div className="flex flex-col gap-12 items-center justify-center">
        {/* Main Puzzle */}
        <div className="flex-shrink-0">
          <Card className="p-6 bg-slate-900/50 border-purple-500/30 backdrop-blur">
            <div className="flex items-center justify-between mb-4">
              <div className="text-white">
                <div>Moves: <span className="text-purple-300">{moves}</span></div>
                {solved && (
                  <div className="text-green-400 mt-1 font-bold">🎉 Puzzle Solved!</div>
                )}
              </div>
              <div className="flex gap-2">
                <Button
                  size="sm"
                  onClick={handleShuffle}
                  className="bg-purple-600 hover:bg-purple-700 text-white"
                >
                  <Shuffle className="size-4 mr-2" />
                  Shuffle
                </Button>
              </div>
            </div>

            {isImageLoaded ? (
              <div
                className="grid gap-1 bg-slate-800 p-1 rounded-lg"
                style={{
                  gridTemplateColumns: `repeat(${GRID_SIZE}, 1fr)`,
                  width: "min(500px, 90vw)",
                  aspectRatio: "1",
                }}
              >
                {board.map((tile, index) => (
                  <div
                    key={index}
                    onClick={() => handleTileClick(index)}
                    className={`
                      relative rounded overflow-hidden transition-all duration-200
                      ${tile === EMPTY_TILE
                        ? "bg-slate-950/80"
                        : "cursor-pointer hover:scale-105 hover:shadow-lg hover:shadow-purple-500/50"
                      }
                      ${validMoves.includes(index) && tile !== EMPTY_TILE
                        ? "ring-2 ring-purple-400/50"
                        : ""
                      }
                      ${solved && tile !== EMPTY_TILE ? "ring-2 ring-green-400" : ""}
                    `}
                    style={tile !== EMPTY_TILE ? getTileStyle(tile) : {}}
                  >
                    {tile !== EMPTY_TILE && (
                      <div className="absolute inset-0 flex items-center justify-center">
                        <span className="text-white bg-black/60 px-3 py-1 rounded backdrop-blur-sm">
                          {tile + 1}
                        </span>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <div className="w-[500px] h-[500px] flex items-center justify-center bg-slate-800 rounded-lg">
                <div className="text-purple-300">Loading puzzle...</div>
              </div>
            )}
          </Card>
        </div>

        {/* Reference Image - Stacked Below */}
        <div className="flex-shrink-0">
          <Card className="p-4 bg-slate-900/50 border-purple-500/30 backdrop-blur">
            <div className="flex items-center justify-center mb-2">
              <h3 className="text-white font-medium text-xl">Target Image</h3>
            </div>
            <div className="w-[200px] aspect-square rounded-lg overflow-hidden border border-purple-500/20 bg-slate-800 mx-auto">
              <img
                src={PUZZLE_IMAGE}
                alt="Reference"
                className="w-full h-full object-cover"
              />
            </div>
          </Card>
        </div>
      </div>

      {/* Solved Button Area */}
      {solved && (
        <div className="mt-8 flex justify-center animate-in fade-in slide-in-from-bottom-4 duration-500">
          <Button
            onClick={onComplete}
            className="bg-amber-500 hover:bg-amber-600 text-slate-900 px-24 py-8 text-3xl font-bold shadow-lg shadow-amber-900/20"
            size="lg"
          >
            🚀 Proceed to Next Mission
          </Button>
        </div>
      )}

      <div className="mt-8 text-center text-purple-300 text-sm">
        <p>💡 Tiles with a purple ring can be moved</p>
      </div>
    </div>
  );
}
