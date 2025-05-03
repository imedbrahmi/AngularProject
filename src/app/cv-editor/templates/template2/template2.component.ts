import { Component, ElementRef, Input, ViewChild } from '@angular/core';

@Component({
  selector: 'app-template2',
  templateUrl: './template2.component.html',
  styleUrls: ['./template2.component.css'],
  standalone: true
})
export class Template2Component {
  @Input() formData!: any;
  @Input() profileImageUrl!: string;
  @ViewChild('templateRef') templateRef!: ElementRef;
}