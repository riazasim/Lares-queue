import { BreakpointObserver } from '@angular/cdk/layout';
import { ChangeDetectionStrategy, Component, OnInit, HostListener } from '@angular/core';
import { Color, LegendPosition, ScaleType } from '@swimlane/ngx-charts';
import { BehaviorSubject } from 'rxjs';
import { StatsService } from 'src/app/core/services/stats.service';

interface pieData {
    name: string;
    value: number;
    color: string;
}

@Component({
    selector: 'app-dashboard',
    templateUrl: './dashboard.component.html',
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class DashboardComponent implements OnInit {
    innerWidth: any;
    isLoading$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(true);
    dashboardData: any;
    sidsByStatus: pieData[] = [];
    timeBreakDown: pieData[] = [];
    public readonly showLabels = true;
    public readonly animations = true;
    public readonly timeline = true;

    readonly showLegend$: BehaviorSubject<boolean> = new BehaviorSubject(true);
    public readonly legendPosition: LegendPosition = LegendPosition.Right;
    public view: [number, number];

    @HostListener('window:resize', ['$event'])
    onResize(event: any) {
        this.updateView();
    }

    constructor(private readonly bpo: BreakpointObserver,
                private readonly statService: StatsService) { }

    ngOnInit(): void {
        this.updateView();
        this.getDashboardData();
    }

    updateView() {
        this.innerWidth = window.innerWidth;
        if (this.innerWidth <= 768) {
            this.view = [this.innerWidth - 100, 320];
        } else if (this.innerWidth > 768 && this.innerWidth <= 1024) {
            this.view = [this.innerWidth - 150, 320];
        } else {
            this.view = [(this.innerWidth / 2) - 150, 320];
        }
    }

    getDashboardData() {
        this.statService.getDashboardStats().subscribe({
            next: response => {
                this.dashboardData = response;
                this.sidsByStatus = this.dashboardData?.sidsByStatus?.map((status: any) => ({
                    name: `${status.statusName} (${status.statusEvent})`,
                    value: status.count || 0,
                    color: status.statusColor
                })) || [];
                
                this.timeBreakDown = this.dashboardData?.timeBreakDown?.map((status: any) => ({
                    name: status.name,
                    value: status.time || 0,
                    color: status.color
                })) || [];
                
                this.isLoading$.next(false);
            },
            error: () => {
                this.sidsByStatus = [];
                this.timeBreakDown = [];
                this.isLoading$.next(false);
            }
        });
    }

    get customColors() {
        return (name: string): string => {
            const item = this.sidsByStatus.find(data => data.name === name) || this.timeBreakDown.find(data => data.name === name);
            return item ? item.color : '#000';
        };
    }
}
