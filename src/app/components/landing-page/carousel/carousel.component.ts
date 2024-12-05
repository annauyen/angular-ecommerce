import { NgFor } from '@angular/common';
import { Component } from '@angular/core';

@Component({
  selector: 'app-carousel',
  standalone: true,
  imports: [NgFor],
  templateUrl: './carousel.component.html',
  styleUrl: './carousel.component.scss',
})
export class CarouselComponent {
  slides = [
    {
      image: 'assets/images/carousel/1.png',
      caption: 'First Slide',
      description: 'Description of first slide',
    },
    {
      image: 'assets/images/carousel/2.png',
      caption: 'Second Slide',
      description: 'Description of second slide',
    },
    {
      image: 'assets/images/carousel/3.png',
      caption: 'Third Slide',
      description: 'Description of third slide',
    },
  ];
}
