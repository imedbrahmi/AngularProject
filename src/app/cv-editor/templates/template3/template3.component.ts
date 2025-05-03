import { Component, ElementRef, Input, ViewChild } from '@angular/core';

@Component({
  selector: 'app-template3',
  templateUrl: './template3.component.html',
  styleUrls: ['./template3.component.css'],
  standalone: true
})
export class Template3Component {
  @Input() formData!: any;
  @Input() profileImageUrl!: string;
  @ViewChild('templateRef') templateRef!: ElementRef;
}
