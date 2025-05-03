import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { AuthService } from '../../auth/auth.service';

interface PortfolioProject {
  id: string;
  title: string;
  description: string;
  imageUrl: string;
  technologies: string;
  link: string;
}

@Component({
  selector: 'app-portfolio-preview',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './portfolio-preview.component.html',
  styleUrls: ['./portfolio-preview.component.css']
})
export class PortfolioPreviewComponent implements OnInit {
  projects: PortfolioProject[] = [];
  contactInfo = {
    name: '',
    email: '',
    message: ''
  };

  constructor(private router: Router, private authService: AuthService) {
    const navigation = this.router.getCurrentNavigation();
    if (navigation?.extras.state) {
      const portfolioData = navigation.extras.state as { portfolioData: { projects: PortfolioProject[] } };
      this.projects = portfolioData.portfolioData.projects.map(project => ({
        ...project,
        id: project.id || Math.random().toString(36).substr(2, 9) // Générer un ID si non existant
      }));
    }
  }

  ngOnInit() {
    if (this.projects.length === 0) {
      // Rediriger vers l'éditeur si aucun projet n'est disponible
      this.router.navigate(['/editor-portfolio']);
    }

    const email = this.authService.getUserEmail(); // ✅ dynamique

    if (email) {
      const saved = localStorage.getItem(`${email}_userPortfolio`);
      if (saved) {
        this.projects = JSON.parse(saved);
      }

      const contact = localStorage.getItem(`${email}_userContact`);
      if (contact) {
        this.contactInfo = JSON.parse(contact);
      }
    } else {
      alert('Aucun utilisateur connecté.');
    }
  }
}
