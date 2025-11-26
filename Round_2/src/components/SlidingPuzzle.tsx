import { useState, useEffect } from "react";
import { Button } from "./ui/button";
import { Card } from "./ui/card";
import { RadioGroup, RadioGroupItem } from "./ui/radio-group";
import { Label } from "./ui/label";
import { Check } from "lucide-react";

const GRID_SIZE = 3;
const TILE_COUNT = GRID_SIZE * GRID_SIZE;
const EMPTY_TILE = TILE_COUNT - 1;
const PUZZLE_IMAGE =
  "https://images.unsplash.com/photo-1720141069840-5d04d315afbe?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtYXJzJTIwcm92ZXIlMjBzcGFjZWNyYWZ0fGVufDF8fHx8MTc2MzkwNTIwOHww&ixlib=rb-4.1.0&q=80&w=1080";

const options = [
  { id: "A", text: " Black hole" },
  { id: "B", text: " Wormhole" },
  { id: "C", text: " Supernova" },
  { id: "D", text: " Time machine" },
];

const CORRECT_OPTION_ID = "B";

type Tile = number;
type Board = Tile[];

const isBoardEqual = (a: Board, b: Board) => a.every((v, i) => v === b[i]);
const createSolvedBoard = (): Board =>
  Array.from({ length: TILE_COUNT }, (_, i) => i);

const fisherYatesShuffle = (arr: number[]) => {
  let array = [...arr];
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
};

const isSolvable = (board: Board): boolean => {
  let inversions = 0;
  const flatBoard = board.filter((tile) => tile !== EMPTY_TILE);
  for (let i = 0; i < flatBoard.length; i++) {
    for (let j = i + 1; j < flatBoard.length; j++) {
      if (flatBoard[i] > flatBoard[j]) inversions++;
    }
  }
  const emptyRow = Math.floor(board.indexOf(EMPTY_TILE) / GRID_SIZE);
  return GRID_SIZE % 2 === 1
    ? inversions % 2 === 0
    : (inversions + emptyRow) % 2 === 1;
};

const shuffleBoard = (board: Board): Board => {
  let newBoard: Board;
  do {
    newBoard = fisherYatesShuffle(board);
  } while (!isSolvable(newBoard) || isBoardEqual(newBoard, createSolvedBoard()));
  return newBoard;
};

const isSolved = (board: Board): boolean =>
  board.every((tile, index) => tile === index);

const getValidMoves = (emptyIndex: number): number[] => {
  const moves: number[] = [];
  const row = Math.floor(emptyIndex / GRID_SIZE);
  const col = emptyIndex % GRID_SIZE;
  if (row > 0) moves.push(emptyIndex - GRID_SIZE);
  if (row < GRID_SIZE - 1) moves.push(emptyIndex + GRID_SIZE);
  if (col > 0) moves.push(emptyIndex - 1);
  if (col < GRID_SIZE - 1) moves.push(emptyIndex + 1);
  return moves;
};

interface SlidingPuzzleProps {
  onComplete: () => void;
  isCompleted?: boolean;
}

export function SlidingPuzzle({ onComplete, isCompleted = false }: SlidingPuzzleProps) {
  const [board, setBoard] = useState<Board>(isCompleted ? createSolvedBoard() : createSolvedBoard());
  const [moves, setMoves] = useState(0);
  const [isImageLoaded, setIsImageLoaded] = useState(false);
  const [imageLoadError, setImageLoadError] = useState(false);
  const [solved, setSolved] = useState(false);

  const [quizPassed, setQuizPassed] = useState(false);
  const [selectedAnswer, setSelectedAnswer] = useState("");
  const [feedback, setFeedback] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [showHint, setShowHint] = useState(false);

  useEffect(() => {
    const img = new window.Image();
    img.src = PUZZLE_IMAGE;
    img.onload = () => {
      setIsImageLoaded(true);
      if (!isCompleted) {
        setTimeout(() => handleShuffle(), 500);
      } else {
        setSolved(true);
        setQuizPassed(true);
        setSelectedAnswer(CORRECT_OPTION_ID);
        setSubmitted(true);
      }
    };
    img.onerror = () => setImageLoadError(true);
  }, [isCompleted]);

  const handleShuffle = () => {
    setBoard(shuffleBoard(createSolvedBoard()));
    setMoves(0);
    setSolved(false);
  };

  const solvePuzzle = () => {
    if (solved) return;
    const solvedBoard = createSolvedBoard();
    setBoard(solvedBoard);
    setSolved(true);
  };

  const handleTileClick = (index: number) => {
    if (solved) return;
    const emptyIndex = board.indexOf(EMPTY_TILE);
    const validMoves = getValidMoves(emptyIndex);
    if (validMoves.includes(index)) {
      const newBoard = [...board];
      [newBoard[emptyIndex], newBoard[index]] = [
        newBoard[index],
        newBoard[emptyIndex],
      ];
      setBoard(newBoard);
      setMoves((m) => m + 1);
      if (isSolved(newBoard)) setSolved(true);
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

  const handleSubmitAnswer = () => {
    if (!selectedAnswer) return;
    setSubmitted(true);

    if (selectedAnswer === CORRECT_OPTION_ID) {
      setQuizPassed(true);
      setFeedback("");
    } else {
      setQuizPassed(false);
      setFeedback("Incorrect answer. Please try again.");
    }
  };

  const emptyIndex = board.indexOf(EMPTY_TILE);
  const validMoves = getValidMoves(emptyIndex);

  const hintText =
    "The empty space should be in the bottom-right corner when solved. Work on positioning the top row first, then the middle row, and finally the bottom row.";

  return (
    <div className="flex flex-col items-center gap-8 w-full">
      {!quizPassed && !isCompleted && (
        <Card className="w-full max-w-2xl mx-auto px-8 py-10 bg-gradient-to-br from-[#1b1138] via-[#151a3a] to-[#0b1022] border border-slate-800/80 shadow-[0_0_40px_rgba(15,23,42,0.9)]">
          <div className="mb-6">
            <h2 className="text-2xl font-semibold text-white leading-snug">
              In Interstellar, what natural phenomenon allows the astronauts to
              travel to another galaxy?
            </h2>
          </div>

          <RadioGroup
            value={selectedAnswer}
            onValueChange={(val) => {
              if (quizPassed) return;
              setSelectedAnswer(val);
              setFeedback("");
              setSubmitted(false);
            }}
            className="space-y-3"
          >
            {options.map((option) => {
              const isSelected = selectedAnswer === option.id;
              const isCorrectOption = option.id === CORRECT_OPTION_ID;
              const showAsCorrect = submitted && isCorrectOption && isSelected;
              const showAsWrong = submitted && isSelected && !isCorrectOption;

              let containerStyle: React.CSSProperties = {
                cursor: 'pointer',
              };

              if (showAsCorrect) {
                containerStyle = {
                  backgroundColor: 'rgba(34, 197, 94, 0.2)',
                  borderColor: '#22c55e',
                  borderWidth: '2px',
                  borderStyle: 'solid',
                  cursor: 'pointer',
                };
              } else if (showAsWrong) {
                containerStyle = {
                  backgroundColor: 'rgba(239, 68, 68, 0.2)',
                  borderColor: '#ef4444',
                  borderWidth: '2px',
                  borderStyle: 'solid',
                  cursor: 'pointer',
                };
              } else if (isSelected && !submitted) {
                containerStyle = {
                  backgroundColor: 'rgba(202, 138, 4, 0.25)',
                  borderColor: '#ca8a04',
                  borderWidth: '2px',
                  borderStyle: 'solid',
                  cursor: 'pointer',
                };
              }

              return (
                <div
                  key={option.id}
                  onClick={() => {
                    if (quizPassed) return;
                    setSelectedAnswer(option.id);
                    setFeedback("");
                    setSubmitted(false);
                  }}
                  className="relative flex items-center w-full px-5 py-4 rounded-lg transition-all duration-200 hover:bg-white/5"
                  style={containerStyle}
                >
                  <span className="text-xl font-bold mr-4 text-white">{option.id}.</span>

                  <Label
                    htmlFor={option.id}
                    className="text-base text-white cursor-pointer flex-1"
                  >
                    {option.text}
                  </Label>

                  <RadioGroupItem
                    value={option.id}
                    id={option.id}
                    className="hidden"
                    style={{ display: 'none', visibility: 'hidden', opacity: 0, width: 0, height: 0, position: 'absolute' }}
                  />

                  {showAsCorrect && (
                    <Check className="w-5 h-5 text-green-400 ml-3" />
                  )}
                </div>
              );
            })}
          </RadioGroup>

          {feedback && (
            <div className="text-red-400 text-center mt-4 font-medium">
              {feedback}
            </div>
          )}

          <div className="text-center mt-8">
            <Button
              onClick={handleSubmitAnswer}
              disabled={!selectedAnswer || quizPassed}
              className="w-full max-w-md py-6 text-2xl font-bold rounded-lg transition-all shadow-lg shadow-amber-900/20 bg-amber-500 hover:bg-amber-600 text-slate-900 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Submit Answer
            </Button>
          </div>
        </Card>
      )}

      {(quizPassed || isCompleted) && (
        <Card className="w-full max-w-2xl mx-auto p-8 bg-gradient-to-br from-[#24103B] via-[#213057] to-[#122352] border-border backdrop-blur">
          <div className="flex items-center justify-between mb-4">
            <div>
              <span className="text-white text-6xl font-bold">
                {moves}
              </span>
              <span className="text-white ml-2 text-4xl">moves</span>
            </div>
          </div>

          {!isCompleted && (
            <div className="flex gap-3 mb-3">
              <Button
                onClick={handleShuffle}
                className="bg-purple-600 hover:bg-purple-700 text-white font-semibold px-4"
                size="sm"
              >
                Reset Puzzle
              </Button>
              <Button
                onClick={solvePuzzle}
                disabled={solved}
                className="bg-amber-500 hover:bg-amber-600 text-white font-semibold px-4 disabled:opacity-50 disabled:cursor-not-allowed"
                size="sm"
              >
                Solve Puzzle
              </Button>
              <Button
                onClick={() => setShowHint((h) => !h)}
                className={`font-semibold px-4 transition-colors ${showHint
                  ? "bg-[#33ccbe]/80 text-white hover:bg-[#33ccbe]/60"
                  : "bg-[#33ccbe] text-white hover:bg-[#33ccbe]/80"
                  }`}
                size="sm"
              >
                {showHint ? "Hide Hint" : "Show Hint"}
              </Button>
            </div>
          )}

          {showHint && (
            <div
              className="rounded-xl border mb-4 flex items-center gap-2 p-4 justify-center"
              style={{
                background: "#33ccbe",
                borderColor: "#33ccbe",
                color: "#fff",
                fontWeight: "bold",
                fontSize: "1.1rem",
                boxShadow: "0 0 10px 2px #33ccbe33",
              }}
            >
              <span
                className="inline-flex items-center justify-center font-bold mr-2"
                style={{
                  background: "#22a993",
                  color: "#fff",
                  borderRadius: "100%",
                  width: "28px",
                  height: "28px",
                }}
              >
                ?
              </span>
              <span>{hintText}</span>
            </div>
          )}

          <div className="flex flex-row items-center justify-center w-full mb-2">
            <div className="flex items-center justify-center">
              {isImageLoaded && !imageLoadError ? (
                <div
                  className="grid gap-2 p-2 rounded-lg bg-[#151f38]"
                  style={{
                    gridTemplateColumns: `repeat(${GRID_SIZE}, 1fr)`,
                    width: "min(330px, 95vw)",
                    aspectRatio: "1",
                  }}
                >
                  {board.map((tile, index) => (
                    <div
                      key={index}
                      onClick={() => handleTileClick(index)}
                      className={`
                        relative rounded transition-all duration-200 overflow-hidden border border-white/20
                        ${tile === EMPTY_TILE
                          ? "bg-[#131931] opacity-70"
                          : "cursor-pointer hover:scale-105"
                        }
                        ${validMoves.includes(index) && tile !== EMPTY_TILE
                          ? "ring-2 ring-purple-400/80"
                          : ""
                        }
                        ${solved && tile !== EMPTY_TILE
                          ? "ring-2 ring-green-400"
                          : ""
                        }
                      `}
                      style={tile !== EMPTY_TILE ? getTileStyle(tile) : {}}
                    >
                      {tile !== EMPTY_TILE && (
                        <span className="absolute top-2 left-2 text-white text-xl font-bold px-3 py-1 bg-black/50 backdrop-blur-md border border-white/10 rounded-lg shadow-[0_4px_6px_-1px_rgba(0,0,0,0.3),0_2px_4px_-1px_rgba(0,0,0,0.1)]">
                          {tile + 1}
                        </span>
                      )}
                    </div>
                  ))}
                </div>
              ) : imageLoadError ? (
                <div className="h-[330px] flex items-center justify-center bg-[#151f38] rounded-lg text-purple-300">
                  Image failed to load. Please check your connection.
                </div>
              ) : (
                <div className="h-[330px] flex items-center justify-center bg-[#151f38] rounded-lg text-purple-300">
                  Loading puzzle...
                </div>
              )}
            </div>
          </div>

          {solved && (
            <div className="mt-8 flex justify-center animate-in fade-in slide-in-from-bottom-4 duration-500">
              <Button
                onClick={onComplete}
                className="w-full max-w-md py-6 text-2xl font-bold rounded-lg transition-all shadow-lg shadow-amber-900/20 bg-amber-500 hover:bg-amber-600 text-slate-900"
                size="lg"
              >
                Proceed to Next Mission
              </Button>
            </div>
          )}
        </Card>
      )}
    </div>
  );
}
