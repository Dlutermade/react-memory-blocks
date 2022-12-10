import { useState } from "react";
import "./App.css";

type TCell = {
  row: number;
  col: number;
};

function App() {
  const [grid, setGrid] = useState([
    [0, 3, 0, 1],
    [1, 2, 2, 0],
    [0, 3, 0, 0],
  ]);

  const [revealedGrid, setRevealedGrid] = useState(
    Array(grid.length)
      .fill("")
      .map(() => Array(grid[0].length).fill(false))
  );

  const [previousClick, setPreviousClick] = useState<TCell | undefined>();

  const handleCardClicked = (rowIdx: number, colIdx: number) => () => {
    if (revealedGrid[rowIdx][colIdx]) return;

    const clickedNumber = grid[rowIdx][colIdx];
    const newRevealedGrid = [...revealedGrid];

    newRevealedGrid[rowIdx][colIdx] = true;

    setRevealedGrid(newRevealedGrid);

    if (previousClick) {
      const previousClickNumber = grid[previousClick.row][previousClick.col];

      if (previousClickNumber !== clickedNumber) {
        setTimeout(() => {
          newRevealedGrid[rowIdx][colIdx] = false;
          newRevealedGrid[previousClick.row][previousClick.col] = false;
          // 必須創建新物件 因為內建是Object.is 去判斷比較是否需要更新
          setRevealedGrid([...newRevealedGrid]);
        }, 1000);
      } else {
        const hasWon = revealedGrid.flat().every((element) => element);
        if (hasWon) {
          // 避免賭塞 state更新 Queue
          setTimeout(() => alert("you won"));
        }
      }
    }

    setPreviousClick(
      previousClick
        ? undefined
        : {
            row: rowIdx,
            col: colIdx,
          }
    );
  };

  return (
    <div className="App">
      <div className="grid">
        {grid.map((row, rowIndex) => (
          <div className="row" key={rowIndex}>
            {row.map((number, colIndex) => (
              <div
                className={
                  "card " + (revealedGrid[rowIndex][colIndex] ? "ravealed" : "")
                }
                key={colIndex}
                onClick={handleCardClicked(rowIndex, colIndex)}
              >
                {revealedGrid[rowIndex][colIndex] ? number : ""}
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}

export default App;
