import { ChangeDetectorRef, Component, ElementRef, HostListener, Input, OnInit, QueryList, SimpleChanges, ViewChild, ViewChildren } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { BehaviorSubject, interval, Subject, Subscription, switchMap, takeUntil } from 'rxjs';
import { SimulationService } from 'src/app/core/services/simulation.service';
import { NumberCounterComponent } from 'src/app/shared/components/number-counter/number-counter.component';
import { NumberTickerComponent } from 'src/app/shared/components/number-ticker/number-ticker.component';
import { ProgressBarComponent } from 'src/app/shared/components/progress-bar/progress-bar.component';
import { SankeyChartComponent } from 'src/app/shared/components/sankey-chart/sankey-chart.component';

interface TimeSlot {
    time: string;
    value: number;
}
@Component({
    selector: 'app-worst-case',
    templateUrl: './worst-case.component.html',
    styleUrls: ['./worst-case.component.scss']
})
export class WorstCaseComponent implements OnInit {
    @ViewChild(SankeyChartComponent) sankey!: SankeyChartComponent;
    @ViewChild(ProgressBarComponent) progress!: ProgressBarComponent;
    @ViewChildren(NumberTickerComponent) numberTickers!: QueryList<NumberTickerComponent>;
    @ViewChildren(NumberCounterComponent) numberCounters!: QueryList<NumberCounterComponent>;
    @Input() Headers: any[] = [];
    @Input() Classes: any[] = [];
    // @Input() simulation: any;
    @Input() key!: number;
    isLoading$ = new BehaviorSubject<boolean>(false);
    isCheckingProgress$ = new BehaviorSubject<boolean>(false);
    private stopPolling$ = new Subject<void>();
    private progressSubscription: Subscription | null = null;
    defaultTickerValue: TimeSlot[] = [
        { time: '00:00', value: 0 },
        { time: '01:00', value: 0 },
        { time: '02:00', value: 0 },
        { time: '03:00', value: 0 },
        { time: '04:00', value: 0 },
        { time: '05:00', value: 0 },
        { time: '06:00', value: 0 },
        { time: '07:00', value: 0 },
        { time: '08:00', value: 0 },
        { time: '09:00', value: 0 },
        { time: '10:00', value: 0 },
        { time: '11:00', value: 0 },
        { time: '12:00', value: 0 },
        { time: '13:00', value: 0 },
        { time: '14:00', value: 0 },
        { time: '15:00', value: 0 },
        { time: '16:00', value: 0 },
        { time: '17:00', value: 0 },
        { time: '18:00', value: 0 },
        { time: '19:00', value: 0 },
        { time: '20:00', value: 0 },
        { time: '21:00', value: 0 },
        { time: '22:00', value: 0 },
        { time: '23:00', value: 0 }
    ]
    probableScenario: any[] = [];
    worstScenario: any[] = [];
    simulation: any[] = [];
    tenantId: number | null = null;
    sliderValue: number = 300;
    hours: string = '05';
    minutes: string = '00';
    width = window.innerWidth - 420;
    // simulation: any;
    data: BehaviorSubject<any> = new BehaviorSubject<any>({});
    timedData: BehaviorSubject<any> = new BehaviorSubject<any>({});
    totalAccessGranted$: BehaviorSubject<TimeSlot[]> = new BehaviorSubject<TimeSlot[]>([]);
    totalProcessedTrucks$: BehaviorSubject<TimeSlot[]> = new BehaviorSubject<TimeSlot[]>([]);
    totalOutsideTrucks$: BehaviorSubject<TimeSlot[]> = new BehaviorSubject<TimeSlot[]>([]);
    totalInsideTrucks$: BehaviorSubject<TimeSlot[]> = new BehaviorSubject<TimeSlot[]>([]);
    isStarted: boolean = true;
    totalEarlyTrucks$: BehaviorSubject<TimeSlot[]> = new BehaviorSubject<TimeSlot[]>([]);
    totalLateTrucks$: BehaviorSubject<TimeSlot[]> = new BehaviorSubject<TimeSlot[]>([]);
    totalNotArrivedTrucks$: BehaviorSubject<TimeSlot[]> = new BehaviorSubject<TimeSlot[]>([]);
    totalQueueLength$: BehaviorSubject<TimeSlot[]> = new BehaviorSubject<TimeSlot[]>([]);
    totalQueueSpeed$: BehaviorSubject<TimeSlot[]> = new BehaviorSubject<TimeSlot[]>([]);
    outsideQueueLength: number = 0;
    totalOnTimeTrucks$: BehaviorSubject<TimeSlot[]> = new BehaviorSubject<TimeSlot[]>([]);
    selectedAnimationDuration: number = 120000;
    rawData = new BehaviorSubject({
        Early: { "Granted": 120, "Denied": 45 },
        Late: { "Granted": 60, "Denied": 30 },
        Expired: { "Granted": 30, "Denied": 15 },
        "On time": { "Granted": 300, "Denied": 150 }
    })
    animationDuration = [
        { id: 1, name: '1 min', value: 60000 },
        { id: 2, name: '2 min', value: 120000 },
        { id: 3, name: '3 min', value: 180000 },
        { id: 4, name: '4 min', value: 240000 },
        { id: 5, name: '5 min', value: 300000 },
    ]

    @HostListener('window:resize', ['$event'])
    onResize(event: any) {
        this.width = window.innerWidth - 420;
    }


    constructor(
        private readonly simulationService: SimulationService,
        private cdr: ChangeDetectorRef,
        private readonly router: Router,
        private readonly route: ActivatedRoute,
    ) { }


    ngOnInit(): void { }

    ngOnDestroy(): void {
        this.stopPolling$.next();
        this.stopPolling$.complete();
        this.progressSubscription?.unsubscribe();
    }

    ngOnChanges(changes: SimpleChanges): void {
        if (changes['key']) {
            this.loadScenarioData();
        }
    }

    changeSpeed(ev: any) {
        this.selectedAnimationDuration = Number(ev.target.value);
        console.log('Selected Animation Duration:', this.selectedAnimationDuration);
    }


    startAnimation() {
        if (this.sankey && this.progress) {
            this.isStarted = true;
            this.sankey.start();
            this.progress.resume();
        }
    }

    resetAnimation() {
        if (this.sankey && this.progress) {
            this.isStarted = true;
            this.sankey.startAgain();
            this.progress.start();
        }
    }

    stopAnimation() {
        if (this.sankey && this.progress) {
            this.isStarted = false;
            this.sankey.stop();
            this.progress.pause();
        }
    }


    timeSeriesData: BehaviorSubject<any> = new BehaviorSubject<any>({})

    updateSlider() {
        const totalMinutes = this.sliderValue;
        const hours = Math.floor(totalMinutes / 60);
        const minutes = totalMinutes % 60;

        this.hours = hours < 10 ? `0${hours}` : `${hours}`;
        this.minutes = minutes < 10 ? `0${minutes}` : `${minutes}`;
    }

    generateTimeLabels(): string[] {
        const labels = [];
        for (let i = 0; i <= 24; i++) {
            labels.push(i < 10 ? `0${i}:00` : `${i}:00`);
        }
        return labels;
    }

    getSliderPosition(): string {
        return `calc((100% / 1440) * ${this.sliderValue} - 2em)`;
    }

    loadScenarioData(): void {
        this.isLoading$.next(true);
        this.cdr.detectChanges();
        const data = { scenario: "wps" };
        this.simulationService.getSimulation(data).subscribe({
            next: (response) => {
                this.simulation = response;
                this.transformData(this.simulation);
                this.cdr.detectChanges();
                this.isLoading$.next(false);
            },
            error: (error) => {
                console.error('Failed to load simulation:', error);
                this.isLoading$.next(false);
            }
        });
    }


    transformData(simulationData: any[]) {
        const transformedData: any = {}
        const transformedTimedData: any = {};
        simulationData?.forEach(item => {
            if (!transformedTimedData[item.accessPoint]) {
                transformedTimedData[item.accessPoint] = [];
            }
            if (!transformedData[item.accessPoint]) {
                transformedData[item.accessPoint] = {
                    Denied: item.simulationResults.denied,
                    Granted: item.simulationResults.granted
                }
            }
            transformedData[item.accessPoint].Denied += item.simulationResults.denied
            transformedData[item.accessPoint].Granted += item.simulationResults.granted
            Object.entries(item.timeSlots).forEach(([key, value]: any) => {
                transformedTimedData[item.accessPoint].push({
                    "Time": key,
                    "Granted": value.granted || 0,
                    "Denied": value.denied || 0
                })
                this.totalAccessGranted$.value.push({
                    time: key,
                    value: Number(value?.granted) || 0
                });
                this.outsideQueueLength += (Number(value?.outsideQueueLength) || 0) / 1000;
                this.outsideQueueLength = parseFloat(this.outsideQueueLength.toFixed(2));
                this.totalProcessedTrucks$.value.push({
                    time: key,
                    value: Number(value?.granted) + Number(value?.denied) || 0
                })
                this.totalOutsideTrucks$.value.push({
                    time: key,
                    value: Number(value?.currentQueue) || 0
                })
                this.totalInsideTrucks$.value.push({
                    time: key,
                    value: Number(value?.internalQueue) || 0
                })
                this.totalEarlyTrucks$.value.push({
                    time: key,
                    value: Number(value?.earlyArrivals) || 0
                })
                this.totalLateTrucks$.value.push({
                    time: key,
                    value: Number(value?.lateArrivals) || 0
                })
                this.totalNotArrivedTrucks$.value.push({
                    time: key,
                    value: Number(value?.expired) || 0
                })
                this.totalOnTimeTrucks$.value.push({
                    time: key,
                    value: Number(value?.onTimeArrivals) || 0
                })
                this.totalQueueLength$.value.push({
                    time: key,
                    value: (Number(value?.currentQueue) * 20) / 1000 || 0
                })
                this.totalQueueSpeed$.value.push({
                    time: key,
                    value: ((Number(value?.currentQueue) * 20) / 1000) / 3600 || 0
                })
            })
            console.log(item)
        })

        this.data.next(transformedData)
        this.timedData.next(transformedTimedData)

        if (this.data.value && this.sankey && this.progress) {
            this.progress?.start()
        }
        if (this.data.value && this.sankey && this.numberTickers && this.numberCounters) {
            this.numberTickers.forEach(ticker => ticker.play());
            this.numberCounters.forEach(ticker => ticker.play())
        }

    }

    labels = ["Denied", "Granted"]

    next() {
        this.router.navigate(['../../reports'], { relativeTo: this.route });
    }

}


