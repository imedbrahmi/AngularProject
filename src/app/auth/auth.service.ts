import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private sessionKey = 'isLoggedIn';      // Clé pour vérifier si un user est connecté
  private currentEmailKey = 'currentUser'; // Clé pour stocker l'email connecté

  // Enregistrer un nouvel utilisateur
  register(user: { name: string; email: string; password: string }): { success: boolean; message: string } {
    const existingUser = localStorage.getItem(user.email);

    if (existingUser) {
      return { success: false, message: 'Cet email est déjà enregistré' };
    }

    localStorage.setItem(user.email, JSON.stringify(user));
    localStorage.setItem(this.sessionKey, 'true');
    localStorage.setItem(this.currentEmailKey, user.email); // stocker email au moment de l'inscription
    return { success: true, message: 'Inscription réussie' };
  }

  // Connexion utilisateur
  login(email: string, password: string): boolean {
    const savedUser = JSON.parse(localStorage.getItem(email) || '{}');

    if (savedUser && savedUser.email === email && savedUser.password === password) {
      localStorage.setItem(this.sessionKey, 'true');
      localStorage.setItem(this.currentEmailKey, email); // stocker email au moment du login
      return true;
    }

    return false;
  }

  // Déconnexion
  logout() {
    localStorage.setItem(this.sessionKey, 'false');
    localStorage.removeItem(this.currentEmailKey);
  }

  // Vérifier si connecté
  isLoggedIn(): boolean {
    return localStorage.getItem(this.sessionKey) === 'true';
  }

  // Récupérer utilisateur par email
  getUser(email: string) {
    return JSON.parse(localStorage.getItem(email) || '{}');
  }

  // Récupérer email connecté
  getUserEmail(): string | null {
    if (this.isLoggedIn()) {
      return localStorage.getItem(this.currentEmailKey) || null;
    }
    return null;
  }
}
