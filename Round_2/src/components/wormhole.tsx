import React, { useState, useEffect } from "react";

// Customizable puzzle image
const WORMHOLE_IMAGE = "https://images.unsplash.com/photo-1462331940025-496dfbfc7564?auto=format&fit=crop&w=800&q=80";

type BoardState = number[]; // Array of tile indices (0 is empty)

function isSolved(board: BoardState): boolean {
  return board.every((v, i) => v === i);
}

// Utility to check if tileIndex is adjacent to emptyIndex in 3x3 grid
function isAdjacent(tileIdx: number, emptyIdx: number): boolean {
  const row = (idx: number) => Math.floor(idx / 3);
  const col = (idx: number) => idx % 3;
  const [tr, tc] = [row(tileIdx), col(tileIdx)];
  const [er, ec] = [row(emptyIdx), col(emptyIdx)];
  return (
    (tr === er && Math.abs(tc - ec) === 1) ||
    (tc === ec && Math.abs(tr - er) === 1)
  );
}

// Shuffles a solvable board using valid moves
function shuffleBoard(board: BoardState, moves: number = 30): BoardState {
  let b = [...board];
  let emptyIdx = b.indexOf(0);
  for (let m = 0; m < moves; m++) {
    const neighbors = [emptyIdx - 1, emptyIdx + 1, emptyIdx - 3, emptyIdx + 3]
      .filter(idx =>
        idx >= 0 &&
        idx < 9 &&
        isAdjacent(idx, emptyIdx)
      );
    const moveIdx = neighbors[Math.floor(Math.random() * neighbors.length)];
    [b[emptyIdx], b[moveIdx]] = [b[moveIdx], b[emptyIdx]];
    emptyIdx = moveIdx;
  }
  return b;
}

export default function InterstellarChallenge({
  onComplete,
}: {
  onComplete: () => void;
}) {
  const [quizSolved, setQuizSolved] = useState(false);
  const [board, setBoard] = useState<BoardState>(
    [0, 1, 2, 3, 4, 5, 6, 7, 8]
  );
  const [moves, setMoves] = useState(0);
  const [showHint, setShowHint] = useState(false);

  // Shuffle board on puzzle start
  useEffect(() => {
    if (quizSolved) {
      setBoard(shuffleBoard([0, 1, 2, 3, 4, 5, 6, 7, 8], 50));
      setMoves(0);
    }
  }, [quizSolved]);

  useEffect(() => {
    if (quizSolved && isSolved(board)) {
      setTimeout(() => {
        onComplete?.();
      }, 600);
    }
  }, [board, quizSolved, onComplete]);

  // The cropped position style for each tile
  const getTileStyle = (idx: number) => ({
    objectPosition: `${(idx % 3) * 50}% ${(Math.floor(idx / 3)) * 50}%`,
    objectFit: 'cover'
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#25213A] via-[#391A3B] to-[#181622] flex items-center justify-center p-4">
      <div className="rounded-2xl bg-[#23203a] shadow-xl border border-purple-700/40 px-8 py-8 max-w-xl w-full">
        <div className="mb-6">
          <h2 className="text-purple-400 text-2xl font-bold mb-1">
            Round 2: Interstellar Challenge
          </h2>
          <div className="text-slate-300 mb-2 text-lg">
            Answer the question by solving the sliding puzzle
          </div>
        </div>
        {/* Progress Indicator */}
        <div className="flex gap-2 mb-4">
          {["Quiz", "Puzzle", "Unlock"].map((stage, i) => (
            <div
              key={i}
              className={`h-2 w-16 rounded-full transition-all 
                ${quizSolved
                  ? i === 2
                    ? isSolved(board)
                      ? "bg-green-400"
                      : "bg-purple-500"
                    : i === 0
                    ? "bg-green-400"
                    : "bg-purple-500"
                  : i === 0
                  ? "bg-amber-400"
                  : "bg-slate-700"}`}
            />
          ))}
        </div>

        {/* Quiz */}
        {!quizSolved && (
          <div className="rounded-lg bg-[#241c39] p-6 mb-6 text-left shadow">
            <div className="text-lg font-bold text-white mb-4">
              In Interstellar, what natural phenomenon allows the astronauts to travel to another galaxy?
            </div>
            {["Black hole", "Wormhole", "Supernova", "Time machine"].map(
              (option, idx) => (
                <button
                  key={option}
                  className={`w-full text-left py-2 px-4 mb-2 rounded-lg text-base font-medium transition ${
                    idx === 1
                      ? "bg-purple-900 text-purple-100 border border-green-500"
                      : "bg-[#20203A] text-purple-300 border border-transparent"
                  } hover:bg-purple-800`}
                  onClick={() => idx === 1 && setQuizSolved(true)}
                >
                  <span className="font-bold mr-2">
                    {String.fromCharCode(65 + idx)}.
                  </span>
                  {option}
                  {quizSolved && idx === 1 && (
                    <span className="ml-2 text-green-400 font-bold">✓</span>
                  )}
                </button>
              )
            )}
            <div className="rounded-lg bg-[#161325] mt-3 p-3 text-purple-300 text-base">
              <span className="font-bold text-white">Your Task:</span> Solve the wormhole sliding puzzle below to confirm your answer and unlock the next task!
            </div>
          </div>
        )}

        {/* Puzzle */}
        {quizSolved && (
          <>
            <div className="text-purple-300 text-lg font-bold mb-1">Wormhole Puzzle</div>
            <div className="text-slate-400 mb-4">
              Click tiles adjacent to the empty space to slide them
            </div>
            <div className="flex gap-4 flex-wrap mb-5">
              <button
                onClick={() => {
                  setBoard(shuffleBoard([0, 1, 2, 3, 4, 5, 6, 7, 8], 50));
                  setMoves(0);
                }}
                className="bg-purple-500 hover:bg-purple-600 text-white py-2 px-4 rounded-lg font-semibold"
              >
                &#x21bb; Reset Puzzle
              </button>
              <button
                onClick={() => setShowHint((h) => !h)}
                className="bg-white text-purple-700 border border-purple-700 py-2 px-4 rounded-lg font-semibold"
              >
                Show Hint
              </button>
              <div className="ml-auto text-right text-purple-300 text-xl font-bold flex flex-col justify-center items-end">
                <span>{moves}</span>
                <span className="text-base font-normal text-purple-400">moves</span>
              </div>
            </div>
            {/* Puzzle Tiles */}
            <div className="mx-auto bg-[#19162A] p-4 rounded-2xl inline-block shadow-lg mb-5">
              <div className="grid grid-cols-3 gap-2">
                {board.map((tileIdx, idx) =>
                  tileIdx === 0 ? (
                    // Empty space
                    <div
                      key={idx}
                      className="w-24 h-24 bg-[#171325] border-2 border-[#262051] rounded-md"
                    />
                  ) : (
                    <button
                      key={tileIdx}
                      className="w-24 h-24 bg-[#241c39] rounded-md relative overflow-hidden flex items-center justify-center border-2 border-[#262051] focus:outline-none"
                      onClick={() => {
                        // Move logic
                        const emptyIdx = board.indexOf(0);
                        if (isAdjacent(idx, emptyIdx)) {
                          const newBoard = [...board];
                          [newBoard[emptyIdx], newBoard[idx]] = [
                            newBoard[idx],
                            newBoard[emptyIdx],
                          ];
                          setBoard(newBoard);
                          setMoves((m) => m + 1);
                        }
                      }}
                      tabIndex={0}
                      aria-label={`Move tile ${tileIdx}`}
                    >
                      <img
                        src={WORMHOLE_IMAGE}
                        alt={`Tile ${tileIdx}`}
                        className="w-full h-full object-cover opacity-80"
                        style={getTileStyle(tileIdx - 1)}
                      />
                      <span className="absolute top-1 left-1 bg-[#171325] px-2 py-1 rounded text-xs text-purple-200 font-bold shadow-lg">
                        {tileIdx}
                      </span>
                    </button>
                  )
                )}
              </div>
            </div>
            {showHint && (
              <div className="mt-3 mb-3 p-3 bg-purple-700/30 text-white rounded text-base">
                Hint: Restore the tile order (1-8) to match the reference image!
              </div>
            )}
            {/* Reference Image */}
            <div className="mt-2 text-purple-300">
              Reference image:
              <img
                src={WORMHOLE_IMAGE}
                alt="Reference wormhole"
                className="mt-2 rounded-xl w-[350px] h-[200px] object-cover border border-[#262051] mx-auto shadow"
              />
            </div>
            {isSolved(board) && (
              <div className="mt-4 p-4 bg-green-600/80 text-white text-lg rounded-xl shadow font-bold">
                Puzzle solved! Proceed to the next round.
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
