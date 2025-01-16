import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { BehaviorSubject } from 'rxjs';

@Component({
    selector: 'app-list-management-list',
    templateUrl: './list-management-list.component.html',
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class ListManagementListComponent implements OnInit {
    isLoading$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(true);
    displayedColumns = ['name', 'type', 'description', 'actions'];

    dataSource: any[] = [];

    constructor(private readonly router: Router,
        private readonly route: ActivatedRoute,) { }

    ngOnInit(): void { }

    redirectAddList(): void {
        this.router.navigate(['../add'], { relativeTo: this.route });
    }
}
