import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { RouterLink } from "@angular/router";
import { FooterComponent } from "../shared/components/footer/footer.component";

interface Review {
  name: string;
  rating: number;
  comment: string;
  img: string;
  top: number;
  left: number;
  rotate: number;
  delay: number;
}

@Component({
  selector: 'app-home',
  imports: [RouterLink, CommonModule, FooterComponent, FooterComponent],
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

  reviews: Review[] = [];

  ngOnInit() {
    const baseReviews = [
      {
        name: "Rahul Sharma",
        rating: 5,
        comment: "Amazing quality! Totally worth it.",
        img: "https://i.pravatar.cc/100?img=1"
      },
      {
        name: "Priya Mehta",
        rating: 4,
        comment: "Delivery was fast and smooth.",
        img: "https://i.pravatar.cc/100?img=2"
      },
      {
        name: "Aman Verma",
        rating: 5,
        comment: "Best purchase this year!",
        img: "https://i.pravatar.cc/100?img=3"
      },
      {
        name: "Sneha Kapoor",
        rating: 3,
        comment: "Good but can improve.",
        img: "https://i.pravatar.cc/100?img=4"
      },
      {
        name: "Rohit Jain",
        rating: 5,
        comment: "Loved it. Highly recommended!",
        img: "https://i.pravatar.cc/100?img=5"
      },
      {
        name: "Neha Singh",
        rating: 4,
        comment: "Nice design and build quality.",
        img: "https://i.pravatar.cc/100?img=6"
      },
      {
        name: "Arjun Patel",
        rating: 5,
        comment: "Absolutely loved the quality and design!",
        img: "https://i.pravatar.cc/100?img=7"
      },
      {
        name: "Kavya Nair",
        rating: 4,
        comment: "Very comfortable and stylish.",
        img: "https://i.pravatar.cc/100?img=8"
      },
      {
        name: "Vikram Singh",
        rating: 5,
        comment: "Exceeded my expectations completely.",
        img: "https://i.pravatar.cc/100?img=9"
      },
      {
        name: "Ananya Gupta",
        rating: 4,
        comment: "Good value for money, would buy again.",
        img: "https://i.pravatar.cc/100?img=10"
      },
      {
        name: "Karan Malhotra",
        rating: 3,
        comment: "Product is decent but delivery was delayed.",
        img: "https://i.pravatar.cc/100?img=11"
      },
      {
        name: "Isha Sharma",
        rating: 5,
        comment: "Superb finish and great customer service!",
        img: "https://i.pravatar.cc/100?img=12"
      },
      {
        name: "Rakesh Kumar",
        rating: 4,
        comment: "Nice build quality and easy to use.",
        img: "https://i.pravatar.cc/100?img=13"
      },
      {
        name: "Pooja Desai",
        rating: 5,
        comment: "Highly recommended, totally worth it!",
        img: "https://i.pravatar.cc/100?img=14"
      },
      {
        name: "Aditya Roy",
        rating: 4,
        comment: "Looks premium and works perfectly.",
        img: "https://i.pravatar.cc/100?img=15"
      },
      {
        name: "Meera Joshi",
        rating: 5,
        comment: "Loved the experience, will order again.",
        img: "https://i.pravatar.cc/100?img=16"
      }
    ];

    const expanded = [...baseReviews, ...baseReviews];

    this.reviews = expanded.map((review, index) => ({
      ...review,
      top: Math.random() * 80,
      left: Math.random() * 80,
      rotate: Math.random() * 10 - 5,
      delay: index * 0.3
    }));
  }

  getStars(rating: number): string {
    return "★".repeat(rating) + "☆".repeat(5 - rating);
  }
}
