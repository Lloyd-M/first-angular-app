import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

@Component({
  selector: 'app-alert',
  templateUrl: './alert.component.html',
  styleUrls: ['./alert.component.css'],
})
export class AlertComponent implements OnInit {
  @Input() alertMessage: string;
  @Output() alertClose = new EventEmitter<void>();
  constructor() {}

  ngOnInit(): void {}

  onClose() {
    this.alertClose.emit();
  }
}
