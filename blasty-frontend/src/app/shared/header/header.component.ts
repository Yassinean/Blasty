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
  isAuthenticated = true;

  constructor() {}

  ngOnInit(): void {
    this.isAuthenticated = !!localStorage.getItem('authToken');
  }

  @HostListener("window:scroll", [])
  onWindowScroll() {
    this.isScrolled = window.pageYOffset > 20
  }

  toggleMobileMenu() {
    this.isMobileMenuOpen = !this.isMobileMenuOpen
  }

  logout() {
    // Remove token from localStorage and update authentication state
    localStorage.removeItem('authToken'); // Replace 'authToken' with your actual token key
    this.isAuthenticated = false; // Update authentication state
    // Optionally, redirect the user to another route, like home or login
    window.location.href = '/auth/login'; // Redirect to login or home after logout
  }
}
