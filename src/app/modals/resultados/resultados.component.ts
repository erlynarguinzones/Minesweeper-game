import { NgIf } from '@angular/common';
import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-resultados',
  standalone: true,
  imports: [NgIf],
  templateUrl: './resultados.component.html',
  styleUrl: './resultados.component.css',
})
export class ResultadosComponent {
  resultado: string = '';
  constructor(
    public dialogRef: MatDialogRef<ResultadosComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    if (data) {
      this.resultado = data.message;
    }
  }

  reintentar(): void {
    this.dialogRef.close('reiniciar');
  }
  terminar(): void {
    this.dialogRef.close('terminar');
  }

  salir() {
    this.dialogRef.close('salir');
  }
  cancelar() {
    this.dialogRef.close('cancelar');
  }
}
