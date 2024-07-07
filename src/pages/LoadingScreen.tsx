import React, { useState, useEffect, useCallback } from 'react';
import styled from 'styled-components';
import { colors } from '../globalStyle';

const LoadingContainer = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background-color: #1C0221;
  display: flex;
  justify-content: center;
  align-items: center;

  .loadingText{
    position: absolute;
    /* center */
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    font-family: "Nasalization";
    font-size: 2em;
    color: ${colors.light};
    background-color: ${colors.primary}ee;
    padding: .5em 1em;
    border-radius: .5em;

    display: flex;
    flex-direction: column;
    align-items: center;
    gap: .5em;
    small{
      font-size: .7em;
      color: ${colors.light}99;
      white-space: nowrap;
    }
  }
`;

const Grid = styled.div<{ $columns: number }>`
  display: grid;
  grid-template-columns: repeat(${props => props.$columns}, 1fr);
  gap: 1px;
  width: 100%;
  height: 100%;
`;

const Cell = styled.div<{ $alive: string }>`
  background-color: ${props => props.$alive=="true" ? colors.light : colors.primary};
  transition: background-color 0.3s ease;
`;



const LoadingScreen: React.FC = () => {
  const [gridSize, setGridSize] = useState({ rows: 0, cols: 0 });
  const [grid, setGrid] = useState<boolean[][]>([]);

  const initializeGrid = useCallback(() => {
    const rows = Math.floor(window.innerHeight / 20);
    const cols = Math.floor(window.innerWidth / 20);
    setGridSize({ rows, cols });

    const newGrid = Array(rows).fill(null).map(() => 
      Array(cols).fill(null).map(() => Math.random() > 0.7)
    );
    setGrid(newGrid);
  }, []);

  useEffect(() => {
    initializeGrid();
    window.addEventListener('resize', initializeGrid);
    return () => window.removeEventListener('resize', initializeGrid);
  }, [initializeGrid]);

  const countNeighbors = (row: number, col: number): number => {
    let count = 0;
    for (let i = -1; i <= 1; i++) {
      for (let j = -1; j <= 1; j++) {
        if (i === 0 && j === 0) continue;
        const newRow = (row + i + gridSize.rows) % gridSize.rows;
        const newCol = (col + j + gridSize.cols) % gridSize.cols;
        if (grid[newRow][newCol]) count++;
      }
    }
    return count;
  };

  const updateGrid = useCallback(() => {
    const newGrid = grid.map((row, i) =>
      row.map((cell, j) => {
        const neighbors = countNeighbors(i, j);
        if (cell) {
          return neighbors === 2 || neighbors === 3;
        } else {
          return neighbors === 3;
        }
      })
    );
    setGrid(newGrid);
  }, [grid, gridSize]);

  useEffect(() => {
    const interval = setInterval(updateGrid, 200);
    return () => clearInterval(interval);
  }, [updateGrid]);


  const handleCellClick = (row: number, col: number) => {
    const newGrid = grid.map((rowArr, i) =>
      rowArr.map((cell, j) => {
        if (Math.abs(row - i) <= 1 && Math.abs(col - j) <= 1) {
          return true;
        }
        return cell;
      })
    );
    setGrid(newGrid);
  };

  return (
    <LoadingContainer>
      <span className="loadingText">
        Loading...
        <small>Click to create life</small>
      </span>
      <Grid $columns={gridSize.cols}>
        {grid.flatMap((row, i) =>
          row.map((cell, j) => (
            <Cell
              key={`${i}-${j}`}
              $alive={cell.toString()}
              onClick={() => handleCellClick(i, j)}
            />
          ))
        )}
      </Grid>
    </LoadingContainer>
  );
};

export default LoadingScreen;
