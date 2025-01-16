import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { MatStepper } from '@angular/material/stepper';
import { NavigationEnd, Router } from '@angular/router';
import { ToggleNavigationMenuService } from 'src/app/core/services/toggle-navigation-menu.service';

@Component({
  selector: 'navigation-menu',
  templateUrl: './navigation-menu.component.html',
  styleUrls: ['./navigation-menu.component.scss']
})
export class NavigationMenuComponent implements OnInit {
  @ViewChild('stepper') stepper!: MatStepper
  isCollapsed: boolean;
  activeRoute: string;

  @Input() logoSrc: string | null = 'assets/images/q-logo.svg';
  constructor(private router: Router, private toggleService: ToggleNavigationMenuService) {}

  ngOnInit(): void {
    // Check stored collapse state
    this.isCollapsed = this.toggleService.getItem() || false;

    // Track active route
    this.router.events.subscribe(event => {
      if (event instanceof NavigationEnd) {
        this.activeRoute = event.url;
      }
    });
  }

  onStepChange(event: any): void {
    const routes = [
      'home',
      'parameters',
      'queue',
      'simulation',
      'reports'
    ];

    console.log('Navigating to:', routes[event.selectedIndex]); // Debugging

    if (routes[event.selectedIndex]) {
      this.router.navigate(['/admin', routes[event.selectedIndex]]);
    }
  }

  toggleCollapse() {
    this.isCollapsed = !this.isCollapsed;
    this.toggleService.setItem(this.isCollapsed);
  }
}

