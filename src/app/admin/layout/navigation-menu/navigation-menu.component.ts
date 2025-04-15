import { Component, Input, OnChanges, OnInit, SimpleChanges, ViewChild } from '@angular/core';
import { MatStepper } from '@angular/material/stepper';
import { NavigationEnd, Router } from '@angular/router';
import { BehaviorSubject } from 'rxjs';
import { ToggleNavigationMenuService } from 'src/app/core/services/toggle-navigation-menu.service';

@Component({
    selector: 'navigation-menu',
    templateUrl: './navigation-menu.component.html',
    styleUrls: ['./navigation-menu.component.scss']
})
export class NavigationMenuComponent implements OnInit {
    @ViewChild('stepper') stepper!: MatStepper
    isCollapsed: boolean;
    activeRoutes: Set<string> = new Set();
    activeRoute: BehaviorSubject<string> = new BehaviorSubject("");

    @Input() logoSrc: string | null = 'assets/images/q-logo.svg';
    constructor(private router: Router, private toggleService: ToggleNavigationMenuService) { }

    ngOnInit(): void {
        // Check stored collapse state
        this.isCollapsed = this.toggleService.getItem() || false;

        // Initialize active route with current URL
    this.activeRoute.next(this.router.url);
    this.activeRoutes.add(this.router.url);

        // Track active route
        this.router.events.subscribe(event => {
            if (event instanceof NavigationEnd) {
                if (event.urlAfterRedirects === "/en/home?finish=true") {
                    this.activeRoutes.clear()
                    this.router.navigateByUrl("/en/home")
                }
                this.activeRoute.next(event.urlAfterRedirects);
                this.activeRoutes.add(event.urlAfterRedirects);

            }
        });
    }

    onStepChange(route: any): void {
        if (this.activeRoutes.has(route)) {
            this.router.navigateByUrl(route)
        }
    }

    toggleCollapse() {
        this.isCollapsed = !this.isCollapsed;
        this.toggleService.setItem(this.isCollapsed);
    }
}

