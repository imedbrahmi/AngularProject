import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AuthService } from '../auth/auth.service';
import { RouterModule } from '@angular/router';
import { StorageService, Document } from '../services/storage.service';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {
  cvs: Document[] = [];
  portfolios: Document[] = [];
  recentActivity: { type: string; message: string; date: Date }[] = [];

  constructor(
    private router: Router,
    private authService: AuthService,
    private storageService: StorageService
  ) {}

  ngOnInit(): void {
    // S'abonner aux changements des documents
    this.storageService.getDocuments().subscribe(documents => {
      this.loadDocuments();
      this.updateRecentActivity();
    });
  }

  private loadDocuments(): void {
    this.cvs = this.storageService.getDocumentsByType('cv');
    this.portfolios = this.storageService.getDocumentsByType('portfolio');
  }

  private updateRecentActivity(): void {
    const allDocuments = [...this.cvs, ...this.portfolios];
    this.recentActivity = allDocuments
      .sort((a, b) => b.updatedAt.getTime() - a.updatedAt.getTime())
      .slice(0, 3)
      .map(doc => ({
        type: doc.type,
        message: `${doc.type === 'cv' ? 'CV' : 'Portfolio'} "${doc.title}" mis à jour`,
        date: doc.updatedAt
      }));
  }

  createNewCV(): void {
    this.router.navigate(['/choose-template']);
  }

  createNewPortfolio(): void {
    this.router.navigate(['/editor-portfolio']);
  }

  editDocument(id: string, type: 'cv' | 'portfolio'): void {
    if (type === 'cv') {
      this.router.navigate(['/cv-editor'], { queryParams: { id } });
    } else {
      this.router.navigate(['/editor-portfolio'], { queryParams: { id } });
    }
  }

  deleteDocument(id: string, type: 'cv' | 'portfolio'): void {
    if (confirm('Êtes-vous sûr de vouloir supprimer ce document ?')) {
      if (this.storageService.deleteDocument(id)) {
        this.loadDocuments();
        this.updateRecentActivity();
      } else {
        alert('Erreur lors de la suppression du document');
      }
    }
  }

  getTimeAgo(date: Date): string {
    const now = new Date();
    const diff = now.getTime() - new Date(date).getTime();
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);

    if (days > 0) return `Il y a ${days} jour${days > 1 ? 's' : ''}`;
    if (hours > 0) return `Il y a ${hours} heure${hours > 1 ? 's' : ''}`;
    if (minutes > 0) return `Il y a ${minutes} minute${minutes > 1 ? 's' : ''}`;
    return 'À l\'instant';
  }

  logout() {
    this.authService.logout();
    this.router.navigate(['/login']);
  }

  get userName(): string {
    const email = this.authService.getUserEmail();
    if (email) {
      const user = this.authService.getUser(email);
      return user?.name || 'Utilisateur';
    }
    return 'Guest';
  }
}
