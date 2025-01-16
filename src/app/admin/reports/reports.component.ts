import { Component, ChangeDetectionStrategy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
    selector: 'app-reports',
    templateUrl: './reports.component.html',
    styleUrls: ['./reports.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class ReportsComponent {
    constructor( 
        private readonly router: Router,
        private readonly route: ActivatedRoute,
    ) {}

    startAgain(){
        this.router.navigate(['../home'], { relativeTo: this.route });
    }
    finish(){
        this.router.navigate(['../home'], { relativeTo: this.route });
    }
   
}
