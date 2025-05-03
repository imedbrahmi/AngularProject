import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-choose-template',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './choose-template.component.html',
  styleUrls: ['./choose-template.component.css']
})
export class ChooseTemplateComponent {
  templates = [
    { name: 'Template 1', img: 'img/template1.png', value: 'template1' },
    { name: 'Template 2', img: 'img/template2.jpg', value: 'template2' },
    { name: 'Template 3', img: 'img/template3.PNG', value: 'template3' }
  ];
  
  constructor(private router: Router) {}

  onSelectTemplate(template: any) {
    // Rediriger vers la page cv-editor avec le template sélectionné
    this.router.navigate(['/cv-editor'], { queryParams: { template: template.value } });
  }
}
