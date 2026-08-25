import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ContenuService {
  private apiUrl = 'http://localhost:3000/api/contenus';

  constructor(private http: HttpClient) { }

  // La méthode pour récupérer les articles (déjà présente)
  getContenus(): Observable<any[]> {
    return this.http.get<any[]>(this.apiUrl);
  }

  // LA MÉTHODE MANQUANTE À AJOUTER :
  addContenu(article: any): Observable<any> {
    return this.http.post<any>(this.apiUrl, article);
  }
}