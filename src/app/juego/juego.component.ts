import { Component } from '@angular/core';

import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { ResultadosComponent } from '../modals/resultados/resultados.component';

interface Cell {
  mine: boolean;
  revealed: boolean;
  adjacentMines: number;
  pennant: boolean;
}

@Component({
  selector: 'app-juego',
  templateUrl: './juego.component.html',
  styleUrl: './juego.component.css',
})
export class JuegoComponent {
  board: Cell[][] = [];
  rows: number = 10;
  cols: number = 10;
  mines: number = 20;
  remainingMines: number = this.mines;
  reboot: boolean = false;
  freeCells = this.rows * this.cols - this.mines;
  revealedCells: number = 0;

  constructor(private dialog: MatDialog, private router: Router) {}

  ngOnInit() {
    this.initializeBoard();
  }

  initializeBoard() {
    // Inicializar el tablero
    this.reboot = false;
    this.remainingMines = this.mines;
    this.revealedCells = 0;

    this.board = Array.from({ length: this.rows }, () =>
      Array.from({ length: this.cols }, () => ({
        mine: false,
        revealed: false,
        adjacentMines: 0,
        pennant: false,
      }))
    );

    // Colocar minas
    let placedMines = 0;
    while (placedMines < this.mines) {
      const row = Math.floor(Math.random() * this.rows);
      const col = Math.floor(Math.random() * this.cols);
      if (!this.board[row][col].mine) {
        this.board[row][col].mine = true;
        placedMines++;
      }
    }

    // Calcular minas adyacentes
    for (let i = 0; i < this.rows; i++) {
      for (let j = 0; j < this.cols; j++) {
        if (!this.board[i][j].mine) {
          this.board[i][j].adjacentMines = this.countAdjacentMines(i, j);
        }
      }
    }
  }

  countAdjacentMines(row: number, col: number): number {
    let count = 0;
    for (let i = -1; i <= 1; i++) {
      for (let j = -1; j <= 1; j++) {
        const newRow = row + i;
        const newCol = col + j;
        if (
          newRow >= 0 &&
          newRow < this.rows &&
          newCol >= 0 &&
          newCol < this.cols
        ) {
          if (this.board[newRow][newCol].mine) {
            count++;
          }
        }
      }
    }
    return count;
  }

  revealCell(row: number, col: number) {
    if (this.board[row][col].revealed) return;
    if (this.board[row][col].pennant) return;
    this.board[row][col].revealed = true;
    if (!this.board[row][col].mine) {
      this.reboot = true;
    }
    if (!this.board[row][col].mine) {
      this.revealedCells++;
      if (this.revealedCells == this.freeCells) {
        const dialogRef = this.dialog.open(ResultadosComponent, {
          data: { message: 'Ganaste' },
        });

        dialogRef.afterClosed().subscribe((result) => {
          if (result === 'reiniciar') {
            this.initializeBoard();
          }

          if (result === 'terminar') {
            this.router.navigate(['/']);
          }
        });
      }
    }

    if (this.board[row][col].mine) {
      setTimeout(() => {
        // se revelan todas las minas
        for (let i = 0; i < this.rows; i++) {
          for (let j = 0; j < this.cols; j++) {
            if (this.board[i][j].mine) {
              this.board[i][j].revealed = true;
            }
          }
        }
        const dialogRef = this.dialog.open(ResultadosComponent, {
          data: { message: 'Perdiste' },
        });

        dialogRef.afterClosed().subscribe((result) => {
          if (result === 'reiniciar') {
            this.initializeBoard();
          }

          if (result === 'terminar') {
            this.router.navigate(['/']);
          }
        });
      }, 500);
    }

    if (
      this.board[row][col].adjacentMines === 0 &&
      !this.board[row][col].mine
    ) {
      this.revealAdjacentCells(row, col);
    }
  }

  markPennant(event: MouseEvent, row: number, col: number) {
    event.preventDefault();
    if (this.remainingMines === 0 && !this.board[row][col].pennant) return;
    if (this.board[row][col].revealed) return;
    this.board[row][col].pennant = !this.board[row][col].pennant;
    if (this.board[row][col].pennant) {
      this.remainingMines--;
    } else {
      this.remainingMines++;
    }
  }

  revealAdjacentCells(row: number, col: number) {
    for (let i = -1; i <= 1; i++) {
      for (let j = -1; j <= 1; j++) {
        const newRow = row + i;
        const newCol = col + j;

        if (
          newRow >= 0 &&
          newRow < this.rows &&
          newCol >= 0 &&
          newCol < this.cols
        ) {
          if (!this.board[newRow][newCol].revealed) {
            this.revealCell(newRow, newCol);
          }
        }
      }
    }
  }

  resetGame() {
    this.initializeBoard();
  }

  atras() {
    if (this.reboot) {
      const dialogRef = this.dialog.open(ResultadosComponent, {
        data: { message: 'salir' },
      });

      dialogRef.afterClosed().subscribe((result) => {
        if (result === 'salir') {
          this.router.navigate(['/']);
        }
      });
    } else {
      this.router.navigate(['/']);
    }
  }
}
