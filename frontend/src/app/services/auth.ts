import { Injectable, Inject, PLATFORM_ID } from '@angular/core'; // 1. Ajoute Inject et PLATFORM_ID ici
import { isPlatformBrowser } from '@angular/common'; // 2. Ajoute isPlatformBrowser ici
import { HttpClient } from '@angular/common/http';
import { Observable, BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = 'http://localhost:3000/api/utilisateurs';
  
  private currentUserSubject = new BehaviorSubject<any>(null);
  public currentUser$ = this.currentUserSubject.asObservable();

  // 3. Modifie le constructeur pour injecter l'identifiant de plateforme
  constructor(
    private http: HttpClient,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {
    // 4. On vérifie qu'on est bien sur le navigateur avant de toucher au localStorage
    if (isPlatformBrowser(this.platformId)) {
      const savedUser = localStorage.getItem('cesizen_user');
      if (savedUser) {
        this.currentUserSubject.next(JSON.parse(savedUser));
      }
    }
  }

  register(userData: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/register`, userData);
  }

  login(credentials: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/login`, credentials);
  }

  saveSession(token: string, user: any) {
    if (isPlatformBrowser(this.platformId)) {
      localStorage.setItem('cesizen_token', token);
      localStorage.setItem('cesizen_user', JSON.stringify(user));
    }
    this.currentUserSubject.next(user);
  }

  logout() {
    if (isPlatformBrowser(this.platformId)) {
      localStorage.removeItem('cesizen_token');
      localStorage.removeItem('cesizen_user');
    }
    this.currentUserSubject.next(null);
  }

  changePassword(data: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/change-password`, data);
  }

  deleteAccount(id_utilisateur: number): Observable<any> {
    return this.http.post(`${this.apiUrl}/delete-account`, { id_utilisateur });
  }

  getAllUsers(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}`);
  }

  adminDeleteUser(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`);
  }

  adminUpdateUser(id: number, userData: any): Observable<any> {
    return this.http.put(`${this.apiUrl}/${id}`, userData);
  }
}