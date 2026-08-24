import { Component, OnDestroy, ChangeDetectorRef } from '@angular/core'; // 1. On ajoute ChangeDetectorRef ici
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-respiration',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './respiration.html',
  styleUrls: ['./respiration.css']
})
export class RespirationComponent implements OnDestroy {
  enCours: boolean = false;
  instruction: string = 'Prêt à commencer ?';
  tempsRestant: number = 5;
  phase: 'inspirer' | 'expirer' = 'inspirer';
  interval: any;

  // 2. On injecte le détective de changement dans le constructeur
  constructor(private cdr: ChangeDetectorRef) {}

  demarrer() {
    this.enCours = true;
    this.phase = 'inspirer';
    this.instruction = 'Inspirez...';
    this.tempsRestant = 5;
    this.cdr.detectChanges(); // On force l'affichage du départ

    this.interval = setInterval(() => {
      this.tempsRestant--;

      if (this.tempsRestant === 0) {
        this.phase = this.phase === 'inspirer' ? 'expirer' : 'inspirer';
        this.instruction = this.phase === 'inspirer' ? 'Inspirez...' : 'Expirez...';
        this.tempsRestant = 5; 
      }

      // 3. LA LIGNE MAGIQUE : On force Angular à mettre à jour le texte et le chrono TOUTES LES SECONDES
      this.cdr.detectChanges(); 
    }, 1000);
  }

  arreter() {
    this.enCours = false;
    this.instruction = 'Exercice terminé.';
    clearInterval(this.interval);
    this.cdr.detectChanges(); // On force l'affichage de la fin
  }

  ngOnDestroy() {
    if (this.interval) clearInterval(this.interval);
  }
}