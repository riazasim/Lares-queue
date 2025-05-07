import { Component, ChangeDetectionStrategy, HostListener } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { HomeService } from 'src/app/core/services/home.service';

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
        private readonly homeService: HomeService
    ) {
        homeService.checkExpiration().subscribe({
            next: (res) => {
                if (res.isExpired) {
                    this.getNewProcessId();
                }
            },
            error: () => {
                this.getNewProcessId()
            }
        })
    }

    getNewProcessId() {
        this.homeService.getProcessId().subscribe({
            next: (res) => {
                localStorage.setItem('processId', res.processId);
                localStorage.setItem('token', res.token);
            },
            error: () => {
                console.error('Failed to get process id');
            }
        });
    }

    next() {
        this.router.navigate(['../parameters'], { relativeTo: this.route });
    }

}
