import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { RegisterService } from '../services/register.service';
import { ModalComponent } from '../modal/modal.component';
import { NgIf } from '@angular/common';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    ModalComponent,
    NgIf
  ],
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {
  registerForm: FormGroup;
  errorMessage: string = '';
  modalTitle: string = '';
  modalMessage: string = '';

  @ViewChild(ModalComponent) modal!: ModalComponent;

  constructor(private fb: FormBuilder, private registerService: RegisterService, private router: Router) {
    this.registerForm = this.fb.group({
      username: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required],
      confirmPassword: ['', Validators.required]
    });
  }

  ngOnInit(): void {}

  onUsernameBlur(): void {
    const username = this.registerForm.get('username')?.value;
    if (username) {
      this.registerService.checkUsernameExists(username).subscribe({
        next: response => {
          if (response.status === 200) {
            this.errorMessage = 'Username already exists.';
          } else {
            this.errorMessage = '';
          }
        },
        error: error => {
          if (error.status === 404) {
            this.errorMessage = '';
          } else {
            this.errorMessage = 'An unexpected error occurred.';
          }
        }
      });
    }
  }

  onSubmit(): void {
    if (this.registerForm.invalid) {
      return;
    }

    const { username, email, password, confirmPassword } = this.registerForm.value;

    if (password !== confirmPassword) {
      this.errorMessage = 'Passwords do not match. Please try again.';
      return;
    }

    this.registerService.checkUsernameExists(username).subscribe({
      next: response => {
        if (response.status === 200) {
          this.errorMessage = 'Username already exists.';
        } else {
          this.registerUser(username, email, password);
        }
      },
      error: error => {
        if (error.status === 404) {
          this.registerUser(username, email, password);
        } else {
          this.errorMessage = 'An unexpected error occurred.';
        }
      }
    });
  }

  registerUser(username: string, email: string, password: string): void {
    this.registerService.registerUser(username, email, password).subscribe({
      next: response => {
        this.showModal('Success', 'User registered successfully!', () => {
          this.registerService.loginAfterRegister(username, password).subscribe({
            next: loginResponse => {
              const token = loginResponse.headers.get('Authorization');
              if (token && token.startsWith('Bearer ')) {
                const tokenWithoutPrefix = token.substring(7);
                localStorage.setItem('authToken', tokenWithoutPrefix);
                localStorage.setItem('username', username);
                this.router.navigate(['']);
              } else {
                this.errorMessage = 'Login failed';
              }
            },
            error: () => this.errorMessage = 'Login failed'
          });
        });
      },
      error: error => {
        if (error.status === 400) {
          this.errorMessage = 'Missing username, email, or password.';
        } else if (error.status === 409) {
          this.errorMessage = 'Username already exists.';
        } else if (error.status === 500) {
          this.errorMessage = 'Internal server error. Please try again later.';
        } else {
          this.errorMessage = 'An unexpected error occurred.';
        }
      }
    });
  }

  showModal(title: string, message: string, callback?: () => void): void {
    this.modalTitle = title;
    this.modalMessage = message;
    this.modal.showModal();
    if (callback) {
      this.modal.confirm.subscribe(callback);
    }
  }

  handleModalConfirm() {
    this.modal.hideModal();
  }
}
