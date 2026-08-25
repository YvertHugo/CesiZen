import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../../services/auth';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './login.html',
  styleUrls: ['./login.css']
})
export class LoginComponent {
  loginForm: FormGroup;
  message: string = '';
  isSuccess: boolean = false;

  constructor(private fb: FormBuilder, private authService: AuthService, private router: Router) {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      mot_de_passe: ['', Validators.required],
    });
  }

  onSubmit() {
    if (this.loginForm.valid) {
      this.authService.login(this.loginForm.value).subscribe({
        next: (response) => {
          this.isSuccess = true;
          this.message = 'Connexion réussie ! Redirection...';
          
          // On sauvegarde la session (Token + Infos User)
          this.authService.saveSession(response.token, response.user);
          this.loginForm.reset();

          // LA REDIRECTION : On redirige immédiatement (ou après 1 seconde) vers les articles
          setTimeout(() => {
            this.router.navigate(['/informations']);
          }, 1000);
        },
        error: (err) => {
          this.isSuccess = false;
          this.message = err.error.error || 'Erreur de connexion.';
        }
      });
    }
  }
}