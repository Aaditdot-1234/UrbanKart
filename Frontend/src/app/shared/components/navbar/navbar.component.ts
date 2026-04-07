import { Component, HostListener } from '@angular/core';
import { RouterLink } from "@angular/router";

@Component({
  selector: 'app-navbar',
  imports: [RouterLink],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.css'
})
export class NavbarComponent {
  onHover: boolean = false;
  isScrolled: boolean = false;

  @HostListener('window:scroll', [])
  onWindowScroll() {
    const scroll = 50;
    this.isScrolled = window.scrollY > scroll;
  }

  @HostListener('window:mouseenter', [])
  onMouseEnter() {
    this.onHover = true;
  }

  @HostListener('window:mouseleave', [])
  onMouseLeave() {
    this.onHover = false;
  }
}
