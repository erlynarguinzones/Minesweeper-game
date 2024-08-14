// juego.module.ts
import { CommonModule, NgClass, NgFor } from '@angular/common';
import { NgModule } from '@angular/core';
import { MatDialogModule } from '@angular/material/dialog';
import { JuegoRoutingModule } from './juego-routing.module';
import { JuegoComponent } from './juego.component';

@NgModule({
  declarations: [JuegoComponent],
  imports: [CommonModule, JuegoRoutingModule, NgFor, NgClass, MatDialogModule],
  exports: [JuegoComponent],
})
export class JuegoModule {}
