import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { tap, catchError } from 'rxjs';

interface LoginResponse {
  token: string;
  user: {
    id: number;
    email: string;
    name: string;
  };
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private isAuthenticatedSubject = new BehaviorSubject<boolean>(false);
  isAuthenticated$ = this.isAuthenticatedSubject.asObservable();
  /*private apiUrl = 'http://localhost:3000/api'; // Remplacez par votre URL d'API

  constructor(private http: HttpClient) {
    // Vérifier si l'utilisateur est déjà connecté au chargement
    const token = localStorage.getItem('token');
    console.log(token)
    if (token) {
      this.isAuthenticatedSubject.next(true);
    }
  }*/

  login(email: string, password: string): Observable<LoginResponse> {
    // Pour le développement, on accepte n'importe quel email/mot de passe
    // À remplacer par l'appel API réel en production
    const mockResponse: LoginResponse = {
      token: 'mock-jwt-token',
      user: {
        id: 1,
        email: email,
        name: 'Test User'
      }
    };

    return of(mockResponse).pipe(
      tap(response => {
        localStorage.setItem('token', response.token);
        localStorage.setItem('user', JSON.stringify(response.user));
        this.isAuthenticatedSubject.next(true);
      }),
      catchError(error => {
        console.error('Login error:', error);
        throw error;
      })
    );
  }

  logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    this.isAuthenticatedSubject.next(false);
  }

  isAuthenticated(): boolean {
    return this.isAuthenticatedSubject.value;
  }

  getCurrentUser() {
    const user = localStorage.getItem('user');
    return user ? JSON.parse(user) : null;
  }
}
