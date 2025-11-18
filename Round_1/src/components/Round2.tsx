import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from './ui/card';
import { CheckCircle } from 'lucide-react';

const ROWS = 3;
const COLS = 3;
const TOTAL = ROWS * COLS;
const WORMHOLE_IMG =
  'https://images.unsplash.com/photo-1483729558449-99ef09a8c325?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80';

function indexToPos(idx: number) {
  return { r: Math.floor(idx / COLS), c: idx % COLS };
}
function areAdjacent(a: number, b: number) {
  const pa = indexToPos(a);
  const pb = indexToPos(b);
  const dr = Math.abs(pa.r - pb.r);
  const dc = Math.abs(pa.c - pb.c);
  return (dr === 1 && dc === 0) || (dr === 0 && dc === 1);
}

export function Round2() {
  const solved = Array.from({ length: TOTAL }, (_, i) => i);
  const [tiles, setTiles] = useState<number[]>(solved.slice());
  const [emptyIndex, setEmptyIndex] = useState<number>(TOTAL - 1);
  const [solvedState, setSolvedState] = useState(false);

  useEffect(() => {
    // shuffle with legal moves to ensure solvable
    const shuffleMoves = 100;
    let arr = solved.slice();
    let empty = TOTAL - 1;
    for (let i = 0; i < shuffleMoves; i++) {
      const neighbors = arr.map((_, idx) => idx).filter((idx) => areAdjacent(idx, empty));
      const moveTo = neighbors[Math.floor(Math.random() * neighbors.length)];
      const tmp = arr[moveTo];
      arr[moveTo] = arr[empty];
      arr[empty] = tmp;
      empty = moveTo;
    }
    setTiles(arr);
    setEmptyIndex(empty);
    setSolvedState(arr.every((v, i) => v === i));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const onTileClick = (idx: number) => {
    if (areAdjacent(idx, emptyIndex)) {
      const newTiles = tiles.slice();
      newTiles[emptyIndex] = newTiles[idx];
      newTiles[idx] = TOTAL - 1; // empty tile value
      setTiles(newTiles);
      setEmptyIndex(idx);
      setSolvedState(newTiles.every((v, i) => v === i));
    }
  };

  return (
    <Card className="bg-slate-800/50 border-purple-700/50">
      <CardHeader>
        <CardTitle className="text-purple-300">Round 2: Puzzle Question</CardTitle>
        <CardDescription className="text-slate-400">Solve the sliding puzzle to unlock the next task.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="p-4 bg-slate-900/40 rounded-lg border border-slate-700/30">
          <h4 className="text-slate-200 font-medium mb-2">Question</h4>
          <p className="text-sm text-slate-300 mb-3">
            In Interstellar, what natural phenomenon allows the astronauts to travel to another galaxy?
          </p>
          <ul className="text-sm text-slate-300 space-y-1 mb-4 list-none">
            <li>A. Black hole</li>
            <li>B. Wormhole</li>
            <li>C. Supernova</li>
            <li>D. Time machine</li>
          </ul>
          <p className="text-xs text-slate-500 italic mb-2">
            The correct option is B. Wormhole — the answer is represented as the sliding puzzle below. Solve it to continue.
          </p>

          {/* Sliding puzzle grid */}
          <div
            className="mx-auto grid gap-1"
            style={{ gridTemplateColumns: `repeat(${COLS}, 120px)`, width: `${COLS * 120 + (COLS - 1) * 4}px` }}
          >
            {tiles.map((tileValue, idx) => {
              const isEmpty = tileValue === TOTAL - 1;
              const pos = indexToPos(tileValue);
              const bgPosX = (pos.c / (COLS - 1)) * 100;
              const bgPosY = (pos.r / (ROWS - 1)) * 100;
              return (
                <div
                  key={idx}
                  onClick={() => !isEmpty && onTileClick(idx)}
                  className={`w-30 h-30 rounded overflow-hidden cursor-pointer select-none ${isEmpty ? 'bg-slate-800' : ''}`}
                  style={{
                    width: 120,
                    height: 120,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    backgroundImage: isEmpty ? undefined : `url(${WORMHOLE_IMG})`,
                    backgroundSize: `${COLS * 100}% ${ROWS * 100}%`,
                    backgroundPosition: `${bgPosX}% ${bgPosY}%`,
                    border: isEmpty ? '1px dashed rgba(148,163,184,0.1)' : undefined,
                  }}
                />
              );
            })}
          </div>

          {solvedState ? (
            <div className="mt-4 p-3 bg-green-900/20 rounded border border-green-700/30 flex items-center gap-3">
              <CheckCircle className="w-5 h-5 text-green-400" />
              <div>
                <div className="text-sm text-green-300">Puzzle solved — Next task unlocked.</div>
                <a
                  href="#next-task"
                  className="inline-block mt-2 px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded"
                >
                  Open next task →
                </a>
              </div>
            </div>
          ) : (
            <div className="mt-4 text-xs text-slate-400">Click tiles adjacent to the empty space to slide them. Solve the image to unlock the next task.</div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
