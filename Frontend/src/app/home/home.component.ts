import { Component } from '@angular/core';
import { RouterLink } from "@angular/router";

@Component({
  selector: 'app-home',
  imports: [RouterLink],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent {
  categories = [
    {
      name: 'Home Appliances',
      image: '/category1.png',
      color: 'lightblue'
    },
    {
      name: 'Furniture',
      image: '/category2.png',
      color: 'lightgreen'
    },
    {
      name: 'Accessories',
      image: '/category3.png',
      color: 'lightyellow'
    },
    {
      name: 'Fashion',
      image: '/category4.png',
      color: 'lightpink'
    },
    {
      name: 'Arts & Crafts',
      image: '/category5.png',
      color: 'lightcoral'
    },
    {
      name: 'Beauty',
      image: '/category6.png',
      color: 'lightgray'
    }
  ]
}
