import { Component, Input, Output, EventEmitter } from '@angular/core';
import { ButtonComponent } from '../button/button.component';
import {NgIf} from '@angular/common';

@Component({
  selector: 'app-modal',
  templateUrl: './modal.component.html',
  standalone: true,
  imports: [
    ButtonComponent,
    NgIf
  ],
  styleUrls: ['./modal.component.css']
})
export class ModalComponent {
  @Input() title: string = '';
  @Input() message: string = '';
  @Input() confirmButtonText: string = 'OK';
  @Input() cancelButtonText: string = 'Cancel';
  @Input() extraButtonText: string = 'Extra';
  @Input() showCloseButton: boolean = true;
  @Input() showCancelButton: boolean = true;
  @Input() showExtraButton: boolean = false;

  @Output() confirm = new EventEmitter<void>();
  @Output() cancel = new EventEmitter<void>();
  @Output() extra = new EventEmitter<void>();

  closeModal(): void {
    const modalElement = document.getElementById('appModal');
    if (modalElement) {
      modalElement.classList.remove('show');
      modalElement.setAttribute('aria-hidden', 'true');
      modalElement.style.display = 'none';
    }
  }

  showModal(): void {
    const modalElement = document.getElementById('appModal');
    if (modalElement) {
      modalElement.classList.add('show');
      modalElement.setAttribute('aria-hidden', 'false');
      modalElement.style.display = 'block';
    }
  }

  hideModal(): void {
    this.closeModal();
  }

  onConfirm(): void {
    this.confirm.emit();
    this.closeModal();
  }

  onCancel(): void {
    this.cancel.emit();
    this.closeModal();
  }

  onExtra(): void {
    this.extra.emit();
  }
}
