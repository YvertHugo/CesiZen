import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router'; // 1. Ajoute l'import du Router
import { AuthService } from '../../services/auth';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './register.html',
  styleUrls: ['./register.css']
})
export class RegisterComponent {
  registerForm: FormGroup;
  message: string = '';
  isSuccess: boolean = false;

  // 2. Injecte le Router dans ton constructeur
  constructor(
    private fb: FormBuilder, 
    private authService: AuthService,
    private router: Router 
  ) {
    this.registerForm = this.fb.group({
      nom: ['', Validators.required],
      prenom: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      mot_de_passe: ['', [Validators.required, Validators.minLength(6)]]
    });
  }

  onSubmit() {
    if (this.registerForm.valid) {
      this.authService.register(this.registerForm.value).subscribe({
        next: (response) => {
          this.isSuccess = true;
          this.message = 'Inscription réussie ! Redirection...';
          this.registerForm.reset();

          // 3. LA REDIRECTION : On attend 1,5 seconde pour laisser le temps de lire le message vert
          setTimeout(() => {
            this.router.navigate(['/login']);
          }, 1000);
        },
        error: (err) => {
          this.isSuccess = false;
          this.message = err.error.error || "Une erreur est survenue lors de l'inscription.";
        }
      });
    }
  }
}