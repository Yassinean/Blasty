import {Component, HostListener, OnInit} from '@angular/core';
import { RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import {animate, state, style, transition, trigger} from "@angular/animations";

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl:'./header.component.html',
  animations: [
    trigger("slideInOut", [
      state(
        "in",
        style({
          height: "*",
          opacity: 1,
        }),
      ),
      state(
        "out",
        style({
          height: "0",
          opacity: 0,
          overflow: "hidden",
        }),
      ),
      transition("in => out", [animate("200ms ease-in-out")]),
      transition("out => in", [animate("200ms ease-in-out")]),
    ]),
  ],
})
export class HeaderComponent implements OnInit{
  isMobileMenuOpen = false
  isScrolled = false

  constructor() {}

  ngOnInit(): void {}

  @HostListener("window:scroll", [])
  onWindowScroll() {
    this.isScrolled = window.pageYOffset > 20
  }

  toggleMobileMenu() {
    this.isMobileMenuOpen = !this.isMobileMenuOpen
  }
}
