import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import autoTable from 'jspdf-autotable';
import { Template1Component } from './templates/template1/template1.component';
import { Template2Component } from './templates/template2/template2.component';
import { Template3Component } from './templates/template3/template3.component';

@Component({
  selector: 'app-cv-editor',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule, Template1Component, Template2Component, Template3Component],
  templateUrl: './cv-editor.component.html',
  styleUrls: ['./cv-editor.component.css']
})
export class CvEditorComponent implements OnInit {
  cvForm: FormGroup;
  selectedTemplate: string = '';
  profileImageUrl: string = 'img/profile.jpg';

  fields = [
    { name: 'name', label: 'Nom complet', type: 'text', error: 'Le nom est requis' },
    { name: 'email', label: 'Email', type: 'email', error: 'Un email valide est requis' },
    { name: 'phone', label: 'Téléphone', type: 'text', error: 'Le numéro est requis' },
    { name: 'address', label: 'Adresse', type: 'text', error: 'L’adresse est requise' },
    { name: 'birthday', label: 'Date de naissance', type: 'date', error: 'La date est requise' },
    { name: 'education', label: 'Formation', type: 'textarea', error: 'La formation est requise' },
    { name: 'languages', label: 'Langues', type: 'textarea', error: 'Les langues sont requises' },
    { name: 'experience', label: 'Expérience professionnelle', type: 'textarea', error: 'L’expérience est requise' },
    { name: 'skills', label: 'Compétences', type: 'textarea', error: 'Les compétences sont requises' }
  ];

  @ViewChild('templateComponent', { read: ElementRef }) templateComponent!: ElementRef;

  constructor(private fb: FormBuilder, private route: ActivatedRoute) {
    this.cvForm = this.fb.group({
      name: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      phone: ['', Validators.required],
      address: ['', Validators.required],
      birthday: ['', Validators.required],
      education: ['', Validators.required],
      languages: ['', Validators.required],
      experience: ['', Validators.required],
      skills: ['', Validators.required]
    });
  }

  ngOnInit() {
    this.route.queryParams.subscribe(params => {
      this.selectedTemplate = params['template'];
    });
  }

  onSubmit() {
    if (this.cvForm.valid) {
      console.log(this.cvForm.value);
    } else {
      alert('Veuillez remplir correctement tous les champs !');
    }
  }

  onFileSelected(event: any) {
    const file = event.target.files[0];
    if (file) {
      this.profileImageUrl = URL.createObjectURL(file);
    }
  }

  generatePDF() {
    if (!this.templateComponent) {
      alert('Aucun modèle sélectionné pour le téléchargement.');
      return;
    }

    const element = this.templateComponent.nativeElement;

    html2canvas(element, { scale: 2, useCORS: true }).then(canvas => {
      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF('p', 'mm', 'a4');
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = (canvas.height * pdfWidth) / canvas.width;

      pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
      pdf.save('mon_cv.pdf');
    });
  }
}
