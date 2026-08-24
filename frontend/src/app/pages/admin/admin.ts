import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators, FormsModule } from '@angular/forms'; // Ajout de FormsModule
import { ContenuService } from '../../services/contenu';
import { AuthService } from '../../services/auth';

@Component({
  selector: 'app-admin',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, FormsModule], // <-- Assure-toi d'ajouter FormsModule ici
  templateUrl: './admin.html',
  styleUrls: ['./admin.css']
})
export class AdminComponent implements OnInit {
  articleForm: FormGroup;
  users: any[] = [];
  articleMessage: string = '';
  isSuccess: boolean = false;

  // Variables pour la gestion de l'édition d'utilisateur
  editingUserId: number | null = null;
  editedUser: any = {};

  constructor(
    private fb: FormBuilder,
    private contenuService: ContenuService,
    private authService: AuthService,
    private cdr: ChangeDetectorRef
  ) {
    this.articleForm = this.fb.group({
      titre: ['', Validators.required],
      description: ['', Validators.required],
      contenu: ['', Validators.required]
    });
  }

  ngOnInit() {
    this.loadUsers();
  }

  loadUsers() {
    this.authService.getAllUsers().subscribe({
      next: (data) => {
        this.users = data;
        this.cdr.detectChanges();
      }
    });
  }

  onSubmitArticle() {
    if (this.articleForm.valid) {
      this.contenuService.addContenu(this.articleForm.value).subscribe({
        next: (res: any) => {
          this.isSuccess = true;
          this.articleMessage = res.message;
          this.articleForm.reset();
          this.cdr.detectChanges();
        },
        error: () => {
          this.isSuccess = false;
          this.articleMessage = "Erreur lors de l'ajout.";
          this.cdr.detectChanges();
        }
      });
    }
  }

  onDeleteUser(id: number) {
    if (confirm("Confirmer la suppression de cet utilisateur ?")) {
      this.authService.adminDeleteUser(id).subscribe({
        next: () => {
          alert("Utilisateur supprimé !");
          this.loadUsers();
        }
      });
    }
  }

  // Activer le mode édition pour une ligne
  startEdit(user: any) {
    this.editingUserId = user.id_utilisateur;
    // On fait une copie de l'utilisateur pour ne pas modifier l'original directement en cas d'annulation
    this.editedUser = { ...user };
    this.cdr.detectChanges();
  }

  // Annuler l'édition
  cancelEdit() {
    this.editingUserId = null;
    this.editedUser = {};
    this.cdr.detectChanges();
  }

  // Enregistrer les modifications en BDD
  onSaveUser() {
    if (this.editingUserId) {
      const dataToSave = {
        nom: this.editedUser.nom,
        prenom: this.editedUser.prenom,
        email: this.editedUser.email,
        id_role: Number(this.editedUser.id_role) // On s'assure que c'est un nombre pour SQLite
      };

      this.authService.adminUpdateUser(this.editingUserId, dataToSave).subscribe({
        next: (res) => {
          alert(res.message);
          this.editingUserId = null; // Quitte le mode édition
          this.loadUsers(); // Recharge le tableau mis à jour
        },
        error: (err) => {
          alert("Erreur lors de la modification de l'utilisateur.");
          console.error(err);
        }
      });
    }
  }
}