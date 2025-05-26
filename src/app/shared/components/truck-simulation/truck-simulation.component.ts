import {
  Component,
  ElementRef,
  ViewChild,
  OnInit,
  OnDestroy,
  ChangeDetectorRef,
  Input
} from '@angular/core';
import * as d3 from 'd3';

interface TruckEvent {
  truckId: number;
  tenant: string;
  event: 'early_arrival' | 'access_granted' | 'waiting' | 'rescheduled' | 'expired' | 'checkout' | 'no_show';
  timestamp: string;
  action: string;
  queueLength: number;
  queueCount: number;
  firstArrivalTime: string;
  accessPointEndTime: string;
  accessPointStartTime: string;
  waitingTime: number;
  _id: string;
}

interface TruckParticle {
  id: number;
  x: number;
  y: number;
  targetX: number;
  targetY: number;
  color: string;
  category: 'early' | 'ontime' | 'late';
  event: string;
  status: 'waiting' | 'processing' | 'granted' | 'denied' | 'completed';
  timestamp: Date;
}

@Component({
  selector: 'app-truck-simulation',
  templateUrl: './truck-simulation.component.html',
  styleUrls: ['./truck-simulation.component.scss']
})
export class TruckSimulationComponent implements OnInit, OnDestroy {
  @ViewChild('svgElement', { static: true }) svgElement!: ElementRef;
  @Input() truckEvents: TruckEvent[] = [];

  // Simulation properties
  simulationDuration = 60; // seconds
  isPlaying = false;
  isPaused = false;
  currentStatus = 'Idle';
  processedCount = 0;
  grantedCount = 0;
  deniedCount = 0;

  // D3 elements
  private svg: any;
  private width = 0;
  private height = 0;
  public trucks: TruckParticle[] = [];
  private animationTimer: any;
  private currentTruckIndex = 0;

  // Simulation settings
  private readonly ACCESS_POINT_X = 400;
  private readonly QUEUE_START_X = 50;
  private readonly GRANTED_EXIT_X = 600;
  private readonly DENIED_EXIT_X = 600;
  private readonly LANE_Y = 200;
  private readonly GRANTED_Y = 150;
  private readonly DENIED_Y = 250;
  private readonly TRUCK_RADIUS = 8;
  private readonly TRUCK_SPACING = 30;

  constructor(private cd: ChangeDetectorRef) { }

  ngOnInit(): void {
    this.initializeSimulation();
    this.setupSampleData();
  }

  ngOnDestroy(): void {
    if (this.animationTimer) {
      clearInterval(this.animationTimer);
    }
  }

  private initializeSimulation(): void {
    const element = this.svgElement.nativeElement;
    this.width = element.clientWidth || 800;
    this.height = element.clientHeight || 400;

    this.svg = d3.select(element)
      .attr('width', this.width)
      .attr('height', this.height);

    this.drawStaticElements();
  }

  private drawStaticElements(): void {
    // Clear existing elements
    this.svg.selectAll('*').remove();

    // Draw queue lane
    this.svg.append('rect')
      .attr('x', this.QUEUE_START_X)
      .attr('y', this.LANE_Y - 15)
      .attr('width', this.ACCESS_POINT_X - this.QUEUE_START_X)
      .attr('height', 30)
      .attr('fill', 'none')
      .attr('stroke', '#333')
      .attr('stroke-width', 2)
      .attr('stroke-dasharray', '5,5');

    // Draw access point
    this.svg.append('rect')
      .attr('x', this.ACCESS_POINT_X - 10)
      .attr('y', this.LANE_Y - 25)
      .attr('width', 20)
      .attr('height', 50)
      .attr('fill', '#333')
      .attr('rx', 5);

    this.svg.append('text')
      .attr('x', this.ACCESS_POINT_X)
      .attr('y', this.LANE_Y + 40)
      .attr('text-anchor', 'middle')
      .attr('font-weight', 'bold')
      .text('Access Point');

    // Draw granted path
    this.svg.append('line')
      .attr('x1', this.ACCESS_POINT_X + 10)
      .attr('y1', this.LANE_Y)
      .attr('x2', this.GRANTED_EXIT_X)
      .attr('y2', this.GRANTED_Y)
      .attr('stroke', '#28a745')
      .attr('stroke-width', 3)
      .attr('marker-end', 'url(#arrowGreen)');

    // Draw denied path
    this.svg.append('line')
      .attr('x1', this.ACCESS_POINT_X + 10)
      .attr('y1', this.LANE_Y)
      .attr('x2', this.DENIED_EXIT_X)
      .attr('y2', this.DENIED_Y)
      .attr('stroke', '#dc3545')
      .attr('stroke-width', 3)
      .attr('marker-end', 'url(#arrowRed)');

    // Add arrow markers
    const defs = this.svg.append('defs');

    const arrowGreen = defs.append('marker')
      .attr('id', 'arrowGreen')
      .attr('viewBox', '0 0 10 10')
      .attr('refX', 5)
      .attr('refY', 3)
      .attr('markerWidth', 6)
      .attr('markerHeight', 6)
      .attr('orient', 'auto');

    arrowGreen.append('path')
      .attr('d', 'M0,0 L0,6 L9,3 z')
      .attr('fill', '#28a745');

    const arrowRed = defs.append('marker')
      .attr('id', 'arrowRed')
      .attr('viewBox', '0 0 10 10')
      .attr('refX', 5)
      .attr('refY', 3)
      .attr('markerWidth', 6)
      .attr('markerHeight', 6)
      .attr('orient', 'auto');

    arrowRed.append('path')
      .attr('d', 'M0,0 L0,6 L9,3 z')
      .attr('fill', '#dc3545');

    // Add labels
    this.svg.append('text')
      .attr('x', this.GRANTED_EXIT_X + 20)
      .attr('y', this.GRANTED_Y)
      .attr('text-anchor', 'start')
      .attr('font-weight', 'bold')
      .attr('fill', '#28a745')
      .text('GRANTED');

    this.svg.append('text')
      .attr('x', this.DENIED_EXIT_X + 20)
      .attr('y', this.DENIED_Y)
      .attr('text-anchor', 'start')
      .attr('font-weight', 'bold')
      .attr('fill', '#dc3545')
      .text('DENIED');
  }

  private setupSampleData(): void {
    // Create sample truck events if none provided
    if (this.truckEvents.length === 0) {
      this.truckEvents = this.generateSampleTruckEvents(20);
    }

    this.prepareTrucks();
  }

  private generateSampleTruckEvents(count: number): TruckEvent[] {
    const events: ('early_arrival' | 'access_granted' | 'waiting' | 'rescheduled' | 'expired')[] =
      ['early_arrival', 'access_granted', 'waiting', 'rescheduled', 'expired'];
    const tenants = ['Aliqua Labore labor', 'Beta Corp', 'Gamma Industries', 'Delta Ltd', 'Epsilon Co'];

    return Array.from({ length: count }, (_, i) => {
      const randomEvent = events[Math.floor(Math.random() * events.length)];
      const timestamp = new Date(Date.now() + i * 5000).toISOString();

      return {
        truckId: 160 + i,
        tenant: tenants[Math.floor(Math.random() * tenants.length)],
        event: randomEvent,
        timestamp,
        action: `Action for truck ${160 + i}`,
        queueLength: 40 - i,
        queueCount: 2,
        firstArrivalTime: timestamp,
        accessPointEndTime: timestamp,
        accessPointStartTime: timestamp,
        waitingTime: Math.floor(Math.random() * 300),
        _id: `id_${i}`
      };
    });
  }

  private prepareTrucks(): void {
    // Sort events by timestamp
    const sortedEvents = [...this.truckEvents]
      .filter(event => !['checkout', 'no_show'].includes(event.event))
      .sort((a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime());

    this.trucks = sortedEvents.map((event, index) => {
      const category = this.getTruckCategory(event);
      const color = this.getTruckColor(category);

      return {
        id: event.truckId,
        x: this.QUEUE_START_X - (index + 1) * this.TRUCK_SPACING,
        y: this.LANE_Y,
        targetX: this.QUEUE_START_X - (index + 1) * this.TRUCK_SPACING,
        targetY: this.LANE_Y,
        color,
        category,
        event: event.event,
        status: 'waiting',
        timestamp: new Date(event.timestamp)
      };
    });
  }

  private getTruckCategory(event: TruckEvent): 'early' | 'ontime' | 'late' {
    const eventTime = new Date(event.timestamp);
    const accessStartTime = new Date(event.accessPointStartTime);
    const timeDiff = eventTime.getTime() - accessStartTime.getTime();

    if (timeDiff < -300000) return 'early'; // 5 minutes early
    if (timeDiff > 300000) return 'late';   // 5 minutes late
    return 'ontime';
  }

  private getTruckColor(category: 'early' | 'ontime' | 'late'): string {
    switch (category) {
      case 'early': return '#28a745';
      case 'ontime': return '#007bff';
      case 'late': return '#dc3545';
    }
  }

  start(): void {
    if (this.trucks.length === 0) return;

    this.isPlaying = true;
    this.isPaused = false;
    this.currentStatus = 'Running';
    this.currentTruckIndex = 0;
    this.processedCount = 0;
    this.grantedCount = 0;
    this.deniedCount = 0;

    const intervalTime = (this.simulationDuration * 1000) / this.trucks.length;

    this.renderTrucks();

    this.animationTimer = setInterval(() => {
      if (this.currentTruckIndex < this.trucks.length) {
        this.processTruck(this.trucks[this.currentTruckIndex]);
        this.currentTruckIndex++;
      } else {
        this.stop();
      }
    }, intervalTime);

    this.cd.detectChanges();
  }

  pause(): void {
    if (!this.isPlaying) return;

    this.isPlaying = false;
    this.isPaused = true;
    this.currentStatus = 'Paused';

    if (this.animationTimer) {
      clearInterval(this.animationTimer);
    }

    this.cd.detectChanges();
  }

  resume(): void {
    if (!this.isPaused) return;

    this.isPlaying = true;
    this.isPaused = false;
    this.currentStatus = 'Running';

    const remainingTrucks = this.trucks.length - this.currentTruckIndex;
    if (remainingTrucks > 0) {
      const intervalTime = (this.simulationDuration * 1000) / this.trucks.length;

      this.animationTimer = setInterval(() => {
        if (this.currentTruckIndex < this.trucks.length) {
          this.processTruck(this.trucks[this.currentTruckIndex]);
          this.currentTruckIndex++;
        } else {
          this.stop();
        }
      }, intervalTime);
    }

    this.cd.detectChanges();
  }

  reset(): void {
    this.stop();
    this.currentTruckIndex = 0;
    this.processedCount = 0;
    this.grantedCount = 0;
    this.deniedCount = 0;
    this.currentStatus = 'Idle';

    this.prepareTrucks();
    this.renderTrucks();
    this.cd.detectChanges();
  }

  private stop(): void {
    this.isPlaying = false;
    this.isPaused = false;
    this.currentStatus = 'Completed';

    if (this.animationTimer) {
      clearInterval(this.animationTimer);
    }

    this.cd.detectChanges();
  }

  private processTruck(truck: TruckParticle): void {
    // Move truck to access point
    truck.status = 'processing';
    truck.targetX = this.ACCESS_POINT_X;

    // Determine if access is granted or denied
    const isGranted = truck.event === 'access_granted';

    setTimeout(() => {
      if (isGranted) {
        truck.status = 'granted';
        truck.targetX = this.GRANTED_EXIT_X;
        truck.targetY = this.GRANTED_Y;
        this.grantedCount++;
      } else {
        truck.status = 'denied';
        truck.targetX = this.DENIED_EXIT_X;
        truck.targetY = this.DENIED_Y;
        this.deniedCount++;
      }

      this.processedCount++;
      this.updateTruckPositions();
      this.cd.detectChanges();

      // Move remaining trucks forward in queue
      setTimeout(() => {
        this.moveQueueForward();
      }, 1000);

    }, 1000);

    this.updateTruckPositions();
  }

  private moveQueueForward(): void {
    this.trucks.forEach((truck, index) => {
      if (truck.status === 'waiting' && index > this.currentTruckIndex) {
        truck.targetX = this.QUEUE_START_X + (this.currentTruckIndex - index) * this.TRUCK_SPACING;
      }
    });
    this.updateTruckPositions();
  }

  private renderTrucks(): void {
    const truckSelection = this.svg.selectAll('.truck')
      .data(this.trucks, (d: any) => d.id);

    truckSelection.enter()
      .append('circle')
      .attr('class', 'truck')
      .attr('r', this.TRUCK_RADIUS)
      .attr('cx', (d: any) => d.x)
      .attr('cy', (d: any) => d.y)
      .attr('fill', (d: any) => d.color)
      .attr('stroke', '#333')
      .attr('stroke-width', 2);

    truckSelection.exit().remove();
  }

  private updateTruckPositions(): void {
    this.svg.selectAll('.truck')
      .data(this.trucks, (d: any) => d.id)
      .transition()
      .duration(1000)
      .attr('cx', (d: any) => d.targetX)
      .attr('cy', (d: any) => d.targetY)
      .each(function (d: any) {
        d.x = d.targetX;
        d.y = d.targetY;
      });
  }
}