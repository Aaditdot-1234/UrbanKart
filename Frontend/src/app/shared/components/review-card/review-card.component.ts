import { Component, Input } from '@angular/core';
import { Reviews } from '../../../models/reviews';
import { DatePipe, TitleCasePipe } from '@angular/common';

@Component({
  selector: 'app-review-card',
  imports: [DatePipe, TitleCasePipe],
  templateUrl: './review-card.component.html',
  styleUrl: './review-card.component.css'
})
export class ReviewCardComponent {
  @Input() review!: Omit<Reviews, 'product'>;
}