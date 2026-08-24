import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { RouterOutlet, RouterLink, Router } from '@angular/router'; 
import { CommonModule } from '@angular/common';
import { AuthService } from './services/auth';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, RouterLink, CommonModule],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App implements OnInit {
  user: any = null;

  constructor(private authService: AuthService, private router: Router, private cdr: ChangeDetectorRef) {}

  ngOnInit() {
    this.authService.currentUser$.subscribe(currentUser => {
      this.user = currentUser;
      
      // AJOUTE CETTE LIGNE TEMPORAIRE :
      console.log("Contenu de l'utilisateur dans la Navbar :", currentUser);
      
      this.cdr.detectChanges();
    });
  }

  onLogout() {
    this.authService.logout();
    this.router.navigate(['/login']); // Redirection automatique
  }
}