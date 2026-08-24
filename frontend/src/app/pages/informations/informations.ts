import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ContenuService } from '../../services/contenu';

@Component({
  selector: 'app-informations',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './informations.html',
  styleUrls: ['./informations.css']
})
export class InformationsComponent implements OnInit {
  articles: any[] = [];
  chargement: boolean = true;

  constructor(
  private contenuService: ContenuService, 
  private cdr: ChangeDetectorRef // <-- Ajout ici
) {}

  // Se lance automatiquement à l'ouverture de la page
  ngOnInit() {
    this.contenuService.getContenus().subscribe({
      next: (data) => {
        this.articles = data;
        this.chargement = false;
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error('Erreur lors du chargement des articles', err);
        this.chargement = false;
        this.cdr.detectChanges();
      }
    });
  }
}