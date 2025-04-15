import { Component, ChangeDetectionStrategy, HostListener } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
    selector: 'app-home',
    templateUrl: './home.component.html',
    styleUrls: ['./home.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class HomeComponent {
    constructor(
        private readonly router: Router,
        private readonly route: ActivatedRoute,
    ) { }

    next() {
        this.router.navigate(['../parameters'], { relativeTo: this.route });
    }

}
