import { Component, ElementRef, Input, ViewChild } from '@angular/core';

@Component({
  selector: 'app-template1',
  templateUrl: './template1.component.html',
  styleUrls: ['./template1.component.css'],
  standalone: true
})
export class Template1Component {
  @Input() formData!: any;
  @Input() profileImageUrl!: string;
  @ViewChild('templateRef') templateRef!: ElementRef;
}
