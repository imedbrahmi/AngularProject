import { Routes } from '@angular/router';
import { RegisterComponent } from './auth/register/register.component';
import { ChooseTemplateComponent } from './choose-template/choose-template.component';
import { EditorPortfolioComponent } from './editor-portfolio/editor-portfolio.component';
import { PortfolioPreviewComponent } from './portfolio/portfolio-preview/portfolio-preview.component';
import { HomeComponent } from './home/home.component';
import { authGuard } from './guards/auth.guard';

export const routes: Routes = [
  { path: '', component: HomeComponent, pathMatch: 'full' },
  { path: 'register', loadComponent: () => import('./auth/register/register.component').then(m => m.RegisterComponent)},
  { path: 'login', loadComponent: () => import('./auth/login/login.component').then(m => m.LoginComponent) },
  
  // Routes protégées
  { 
    path: 'dashboard', 
    loadComponent: () => import('./dashboard/dashboard.component').then(m => m.DashboardComponent),
    canActivate: [authGuard]
  },
  { 
    path: 'cv-editor', 
    loadComponent: () => import('./cv-editor/cv-editor.component').then(m => m.CvEditorComponent),
    canActivate: [authGuard]
  },
  { 
    path: 'choose-template', 
    component: ChooseTemplateComponent,
    canActivate: [authGuard]
  },
  { 
    path: 'editor-portfolio', 
    component: EditorPortfolioComponent,
    canActivate: [authGuard]
  },
  { 
    path: 'portfolio-preview', 
    component: PortfolioPreviewComponent,
    canActivate: [authGuard]
  }
];
