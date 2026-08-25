import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../../services/auth';
import { Router } from '@angular/router';

@Component({
  selector: 'app-profil',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './profil.html',
  styleUrls: ['./profil.css']
})
export class ProfilComponent implements OnInit {
  passwordForm: FormGroup;
  user: any;
  message: string = '';
  isSuccess: boolean = false;

  constructor(private fb: FormBuilder, private authService: AuthService, private router: Router, private cdr: ChangeDetectorRef) {
    this.passwordForm = this.fb.group({
      ancien_mdp: ['', Validators.required],
      nouveau_mdp: ['', [Validators.required, Validators.minLength(6)]],
      confirmation_mdp: ['', Validators.required]
    }, { validator: this.checkPasswords });
  }

  ngOnInit() {
    this.authService.currentUser$.subscribe(u => {
      this.user = u;
    });
  }

  // Validateur pour s'assurer que les deux nouveaux mots de passe correspondent
  checkPasswords(group: FormGroup) {
    const pass = group.get('nouveau_mdp')?.value;
    const confirmPass = group.get('confirmation_mdp')?.value;
    return pass === confirmPass ? null : { notSame: true };
  }

  onUpdatePassword() {
    if (this.passwordForm.valid) {
      // Sécurité : on récupère l'ID peu importe s'il s'appelle 'id' ou 'id_utilisateur'
      const userId = this.user.id_utilisateur || this.user.id;

      const data = {
        id_utilisateur: userId, 
        ancien_mdp: this.passwordForm.value.ancien_mdp,
        nouveau_mdp: this.passwordForm.value.nouveau_mdp
      };

      this.authService.changePassword(data).subscribe({
        next: (res) => {
          this.isSuccess = true;
          this.message = res.message;
          this.passwordForm.reset();
          this.cdr.detectChanges();
        },
        error: (err) => {
          this.isSuccess = false;
          this.message = err.error.error || 'Une erreur est survenue.';
          this.cdr.detectChanges();
        }
      });
    }
  }

  onDeleteAccount() {
    if (confirm("RGPD - Sécurité : Es-tu sûr de vouloir supprimer définitivement ton compte et toutes tes données ? Cette action est irréversible.")) {
      const userId = this.user.id_utilisateur || this.user.id;

      if (!userId) {
        alert("Erreur : Impossible de récupérer votre identifiant de compte.");
        return;
      }

      this.authService.deleteAccount(userId).subscribe({
        next: () => {
          alert("Compte supprimé avec succès. Vos données ont été effacées.");
          this.authService.logout();
          this.router.navigate(['/register']);
        },
        error: (err) => {
          alert("Erreur lors de la suppression du compte.");
          console.error(err);
        }
      });
    }
  }
}