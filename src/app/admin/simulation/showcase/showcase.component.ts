import { ChangeDetectorRef, Component, OnInit, OnDestroy } from '@angular/core';
import { BehaviorSubject, Subject, Subscription, interval } from 'rxjs';
import { switchMap, takeUntil } from 'rxjs/operators';
import { ActivatedRoute, Router } from '@angular/router';
import { SimulationService } from 'src/app/core/services/simulation.service';

@Component({
  selector: 'app-showcase',
  templateUrl: './showcase.component.html',
  styleUrls: ['./showcase.component.scss']
})
export class ShowcaseComponent implements OnInit, OnDestroy {
  probableScenario: any[] = [];
  worstScenario: any[] = [];
  simulation: any[] = [];
  selectedIndex = 0;

  isLoading$ = new BehaviorSubject<boolean>(false);
  isCheckingProgress$ = new BehaviorSubject<boolean>(false);

  private stopPolling$ = new Subject<void>();
  private progressSubscription: Subscription | null = null;

  tabsData = [
    {
      tabName: 'MOST PROBABLE SCENARIO',
      tabHeaders: { Headers: ['Most probable scenario'] }
    },
    {
      tabName: 'WORST CASE SCENARIO',
      tabHeaders: { Headers: ['Worst case scenario'] }
    }
  ];

  constructor(
    private readonly simulationService: SimulationService,
    private cdr: ChangeDetectorRef,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.loadScenarioData();
  }

  ngOnDestroy(): void {
    this.stopPolling$.next();
    this.stopPolling$.complete();
    this.progressSubscription?.unsubscribe();
  }

  loadScenarioData(): void {
    this.isLoading$.next(true);

    // Destroy old data before fetching
    this.simulation = [];
    this.cdr.detectChanges(); // Clear view

    const type = this.selectedIndex === 0 ? 'PROBABLE_CASE' : 'WORST_CASE';
    const data = { queue: { queueSimulationType: type } };

    this.simulationService.getSimulation(data).subscribe({
      next: (response) => {
        const attributes = response;
        if (!attributes) {
          console.error('Unexpected response:', response);
          return;
        }

        this.probableScenario = Array.isArray(attributes.probableScenario) ? attributes.probableScenario : [];
        this.worstScenario = Array.isArray(attributes.worstScenario) ? attributes.worstScenario : [];

        this.simulation = this.selectedIndex === 0 ? this.probableScenario : this.worstScenario;

        this.cdr.detectChanges();
        this.isLoading$.next(false);
      },
      error: (error) => {
        console.error('Failed to load simulation:', error);
        this.isLoading$.next(false);
      }
    });
  }

  onTabChange(index: number): void {
    this.selectedIndex = index;
    this.loadScenarioData(); // fetch fresh data on tab switch
  }

  // Progress polling
  checkSimulationProgress() {
    const type = this.selectedIndex === 0 ? 'PROBABLE_CASE' : 'WORST_CASE';
    const payload = { queue: { queueSimulationType: type } };
    return this.simulationService.checkSimulationProgress(payload);
  }

  pollSimulationProgress(): void {
    this.progressSubscription = interval(30000)
      .pipe(
        takeUntil(this.stopPolling$),
        switchMap(() => this.checkSimulationProgress())
      )
      .subscribe({
        next: (response) => {
          if (response?.data?.attributes?.simulationStatus === 'completed') {
            this.isCheckingProgress$.next(false);
            this.stopPolling$.next();
            this.router.navigate(['../showcase'], {
              relativeTo: this.route,
              queryParams: { tenantId: 'yourTenantIdHere' }
            });
          }
        },
        error: (error) => {
          console.error('Simulation progress check failed:', error);
          this.isCheckingProgress$.next(false);
          this.stopPolling$.next();
        }
      });
  }
}