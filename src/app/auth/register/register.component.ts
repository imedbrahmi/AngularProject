import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../auth.service'; // Importation du service d'authentification

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [ReactiveFormsModule,RouterModule], // Importation des modules nécessaires pour les formulaires réactifs
  templateUrl: './register.component.html'
})
export class RegisterComponent {
  registerForm: FormGroup;

  constructor(private fb: FormBuilder, private router: Router, private authService: AuthService) {
    // Initialisation du formulaire d'inscription avec des validations
    this.registerForm = this.fb.group({
      name: ['', Validators.required], // Validation du nom
      email: ['', [Validators.required, Validators.email]], // Validation de l'email
      password: ['', Validators.required] // Validation du mot de passe
    });
  }

  // Méthode pour soumettre le formulaire d'inscription
  onSubmit(): void {
    if (this.registerForm.valid) {
      // Envoi des données à l'authService pour l'inscription
      const result = this.authService.register(this.registerForm.value);
  
      if (result.success) {
        alert(result.message); // Message de succès
        this.router.navigate(['/login']); // Redirection vers la page de connexion
      } else {
        alert(result.message); // Message d'erreur si l'email est déjà pris
      }
    }
  }
}
