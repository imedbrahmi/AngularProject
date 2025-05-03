import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule, FormArray } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import autoTable from 'jspdf-autotable';
import { Template1Component } from './templates/template1/template1.component';
import { Template2Component } from './templates/template2/template2.component';
import { Template3Component } from './templates/template3/template3.component';
import html2pdf from 'html2pdf.js';
import { StorageService } from '../services/storage.service';

// Déclaration du module html2pdf.js
declare module 'html2pdf.js';

@Component({
  selector: 'app-cv-editor',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule, Template1Component, Template2Component, Template3Component],
  templateUrl: './cv-editor.component.html',
  styleUrls: ['./cv-editor.component.css']
})
export class CvEditorComponent implements OnInit {
  cvForm: FormGroup;
  selectedTemplate: string = 'template1';
  isEditing: boolean = false;
  documentId: string | null = null;
  profileImageUrl: string = '';

  @ViewChild('templateComponent', { read: ElementRef }) templateComponent!: ElementRef;

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private storageService: StorageService
  ) {
    this.cvForm = this.fb.group({
      title: ['', Validators.required],
      name: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      phone: ['', [
        Validators.required,
        Validators.pattern('^[0-9]{8}$'),
        this.onlyNumbersValidator()
      ]],
      address: ['', Validators.required],
      birthday: ['', Validators.required],
      education: ['', Validators.required],
      languages: ['', Validators.required],
      experience: ['', Validators.required],
      skills: ['', Validators.required],
      summary: ['', Validators.required]
    });
  }

  // Validateur personnalisé pour n'accepter que des chiffres
  onlyNumbersValidator() {
    return (control: any) => {
      const value = control.value;
      if (value && !/^\d+$/.test(value)) {
        return { onlyNumbers: true };
      }
      return null;
    };
  }

  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      if (params['template']) {
        this.selectedTemplate = params['template'];
      }
      if (params['id']) {
        this.loadExistingCV(params['id']);
      }
    });
  }

  private loadExistingCV(id: string): void {
    const document = this.storageService.getDocumentById(id);
    if (document && document.type === 'cv') {
      this.isEditing = true;
      this.documentId = id;
      this.cvForm.patchValue(document.data);
      if (document.data.profileImageUrl) {
        this.profileImageUrl = document.data.profileImageUrl;
      }
    }
  }

  onSubmit(): void {
    if (this.cvForm.valid) {
      const cvData = {
        type: 'cv' as const,
        title: this.cvForm.get('title')?.value || 'Mon CV',
        data: {
          ...this.cvForm.value,
          profileImageUrl: this.profileImageUrl
        }
      };

      if (this.isEditing && this.documentId) {
        this.storageService.updateDocument(this.documentId, cvData);
      } else {
        this.storageService.addDocument(cvData);
      }

      this.router.navigate(['/dashboard']);
    } else {
      this.cvForm.markAllAsTouched();
      alert('Veuillez remplir correctement tous les champs obligatoires !');
    }
  }

  onFileSelected(event: any) {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e: any) => {
        this.profileImageUrl = e.target.result;
      };
      reader.readAsDataURL(file);
    }
  }

  generatePDF() {
    if (this.cvForm.valid && this.templateComponent) {
      const element = this.templateComponent.nativeElement;
      const opt = {
        margin: 1,
        filename: 'mon-cv.pdf',
        image: { type: 'jpeg', quality: 0.98 },
        html2canvas: { scale: 2 },
        jsPDF: { unit: 'in', format: 'letter', orientation: 'portrait' }
      };

      html2pdf().set(opt).from(element).save();
    } else {
      alert('Veuillez remplir correctement tous les champs avant de générer le PDF !');
    }
  }
}
