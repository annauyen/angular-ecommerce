import { NgFor } from '@angular/common';
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { BrowserModule } from '@angular/platform-browser';

@Component({
  selector: 'app-product-reviews',
  standalone: true,
  imports: [
    MatCardModule,
    MatIconModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatSelectModule,
    ReactiveFormsModule, NgFor],
  templateUrl: './product-reviews.component.html',
  styleUrl: './product-reviews.component.scss'
})
export class ProductReviewsComponent {
  reviews = [
    { name: 'Alice', comment: 'Great product!', rating: 5 },
    { name: 'Bob', comment: 'Satisfactory quality.', rating: 4 },
  ];

  reviewForm: FormGroup;

  constructor(private fb: FormBuilder) {
    this.reviewForm = this.fb.group({
      name: ['', Validators.required],
      comment: ['', Validators.required],
      rating: [5, Validators.required],
    });
  }

  addReview() {
    if (this.reviewForm.valid) {
      this.reviews.push(this.reviewForm.value);
      this.reviewForm.reset({ rating: 5 });
    }
  }

  getStars(rating: number): number[] {
    return Array(rating).fill(0);
  }

}
