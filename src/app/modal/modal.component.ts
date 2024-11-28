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
  @Input() showCloseButton: boolean = true; // New input property

  @Output() confirm = new EventEmitter<void>();
  @Output() cancel = new EventEmitter<void>();

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
}
