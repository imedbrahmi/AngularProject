import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, FormArray, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { AuthService } from '../auth/auth.service';
import { StorageService } from '../services/storage.service';

interface PortfolioProject {
  id: string;
  title: string;
  description: string;
  imageUrl: string;
  technologies: string;
  link: string;
}

@Component({
  selector: 'app-editor-portfolio',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './editor-portfolio.component.html',
  styleUrls: ['./editor-portfolio.component.css']
})
export class EditorPortfolioComponent implements OnInit {
  portfolioForm: FormGroup;
  isEditing: boolean = false;
  documentId: string | null = null;
  userEmail: string = '';

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private route: ActivatedRoute,
    private authService: AuthService,
    private storageService: StorageService
  ) {
    this.portfolioForm = this.fb.group({
      title: ['', Validators.required],
      projects: this.fb.array([]),
      contactInfo: this.fb.group({
        name: ['', Validators.required],
        email: ['', [Validators.required, Validators.email]],
        message: ['', Validators.required]
      })
    });
  }

  ngOnInit(): void {
    // Récupérer l'email de l'utilisateur connecté
    const email = this.authService.getUserEmail();
    if (email) {
      this.userEmail = email;
    } else {
      this.router.navigate(['/login']);
      return;
    }

    // Vérifier si on est en mode édition
    this.route.queryParams.subscribe(params => {
      if (params['id']) {
        this.loadExistingPortfolio(params['id']);
      } else {
        this.addProject(); // Ajouter un projet vide par défaut
      }
    });
  }

  private loadExistingPortfolio(id: string): void {
    const document = this.storageService.getDocumentById(id);
    if (document && document.type === 'portfolio') {
      this.isEditing = true;
      this.documentId = id;
      this.portfolioForm.patchValue({
        title: document.title,
        contactInfo: document.data.contactInfo
      });

      // Charger les projets
      if (document.data.projects) {
        document.data.projects.forEach((project: PortfolioProject) => {
          this.projects.push(this.createProjectForm(project));
        });
      }
    }
  }

  get projects() {
    return this.portfolioForm.get('projects') as FormArray;
  }

  get contactInfo() {
    return this.portfolioForm.get('contactInfo') as FormGroup;
  }

  createProjectForm(project?: PortfolioProject): FormGroup {
    return this.fb.group({
      id: [project?.id || crypto.randomUUID()],
      title: [project?.title || '', Validators.required],
      description: [project?.description || '', Validators.required],
      imageUrl: [project?.imageUrl || ''],
      technologies: [project?.technologies || '', Validators.required],
      link: [project?.link || '']
    });
  }

  addProject() {
    this.projects.push(this.createProjectForm());
  }

  removeProject(index: number) {
    this.projects.removeAt(index);
  }

  onProjectImageSelected(event: Event, index: number) {
    const file = (event.target as HTMLInputElement).files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e: any) => {
        const projectForm = this.projects.at(index);
        if (projectForm) {
          projectForm.patchValue({ imageUrl: e.target.result });
        }
      };
      reader.readAsDataURL(file);
    }
  }

  previewPortfolio() {
    if (this.portfolioForm.valid) {
      const portfolioData = this.portfolioForm.value;
      this.router.navigate(['/portfolio-preview'], { state: { portfolioData } });
    } else {
      this.portfolioForm.markAllAsTouched();
      alert('Veuillez remplir correctement tous les champs obligatoires !');
    }
  }

  onSubmit() {
    if (this.portfolioForm.valid) {
      const portfolioData = {
        type: 'portfolio' as const,
        title: this.portfolioForm.get('title')?.value || 'Mon Portfolio',
        data: {
          ...this.portfolioForm.value,
          projects: this.projects.value.map((project: any) => ({
            ...project,
            imageUrl: project.imageUrl || ''
          }))
        }
      };

      if (this.isEditing && this.documentId) {
        this.storageService.updateDocument(this.documentId, portfolioData);
      } else {
        this.storageService.addDocument(portfolioData);
      }

      this.router.navigate(['/dashboard']);
    } else {
      this.portfolioForm.markAllAsTouched();
      alert('Veuillez remplir correctement tous les champs obligatoires !');
    }
  }
}