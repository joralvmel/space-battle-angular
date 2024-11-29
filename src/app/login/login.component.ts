import { Component, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { ModalComponent } from '../modal/modal.component';
import { NgIf } from '@angular/common';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  standalone: true,
  imports: [ModalComponent, ReactiveFormsModule, NgIf, ReactiveFormsModule],
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  loginForm: FormGroup;
  errorMessage: string = '';
  modalTitle: string = '';
  modalMessage: string = '';

  @ViewChild(ModalComponent) modal!: ModalComponent;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) {
    this.loginForm = this.fb.group({
      username: ['', Validators.required],
      password: ['', Validators.required],
    });
  }

  loginUser() {
    if (this.loginForm.valid) {
      const username = this.loginForm.get('username')?.value.trim();
      const password = this.loginForm.get('password')?.value.trim();

      this.authService.login(username, password).subscribe({
        next: (response) => {
          const token = response.headers.get('Authorization');
          if (token && token.startsWith('Bearer ')) {
            localStorage.setItem('token', token);
            this.modalTitle = 'Login Successful';
            this.modalMessage = 'You have successfully logged in.';
            this.modal.showModal();
          } else {
            this.errorMessage = 'Login failed';
          }
        },
        error: (error) => this.handleError(error),
      });
    }
  }

  handleModalConfirm() {
    this.modal.hideModal();
    this.router.navigate(['']);
  }

  private handleError(error: any) {
    console.error('Login error:', error);
    if (error.status === 400) {
      this.errorMessage = 'No username or password provided.';
    } else if (error.status === 401) {
      this.errorMessage = 'Invalid username/password.';
    } else if (error.status === 500) {
      this.errorMessage = 'Internal server error.';
    } else {
      this.errorMessage = 'Unexpected error occurred.';
    }
  }
}
