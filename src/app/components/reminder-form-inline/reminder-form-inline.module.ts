import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReminderFormInlineComponent } from './reminder-form-inline.component';


@NgModule({
  declarations: [ReminderFormInlineComponent],
  exports: [ReminderFormInlineComponent],
  imports: [
    CommonModule,
  ]
})
export class ReminderFormInlineModule { }
