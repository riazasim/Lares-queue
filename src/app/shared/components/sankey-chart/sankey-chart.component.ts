import {
  Component, OnInit, AfterViewInit, OnDestroy, OnChanges, SimpleChanges,
  Input, ElementRef, ViewChild
} from '@angular/core';
import * as d3 from 'd3';
import { sankey, sankeyJustify } from 'd3-sankey';

interface TransactionEvent {
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

interface SimulationData {
  _id: string;
  earlyArrivals: number;
  lateArrivals: number;
  onTimeArrivals: number;
  noShows: number;
  expired: number;
  waitingQueue: number;
  simulationResults: any;
  events: TransactionEvent[];
  scenario: string;
  tenants: string[];
  accessPoint: string;
  processId: string;
  timeSlots: any;
  __v: number;
  createdAt: string;
  updatedAt: string;
}

@Component({
  selector: 'app-sankey-chart',
  template: `<div #chartContainer class="sankey-chart-container"></div>`,
  styles: [`
    .sankey-chart-container {
      margin: 10px;
    }
  `]
})
export class SankeyChartComponent implements OnInit, AfterViewInit, OnDestroy, OnChanges {
  @ViewChild('chartContainer', { static: true }) chartContainer!: ElementRef;
  @Input() autoStart: boolean = true;
  private _simulationDataArray: SimulationData[] = [];

  computedHeight: number = 0;

  @Input()
  set simulationDataArray(data: SimulationData[]) {
    this._simulationDataArray = data || [];
    if (data && data.length > 0) {
      this.reset();
      this._prepareData();
      this._createScales();
      this._buildChart();
      if (this.autoStart) {
        this.start();
      }
    }
  }
  get simulationDataArray(): SimulationData[] {
    return this._simulationDataArray;
  }

  @Input() labels: string[] = ['Granted', 'Denied'];
  @Input() eventTypes: string[] = ['early_arrival', 'access_granted', 'waiting', 'rescheduled', 'expired'];
  @Input() colors: Record<string, string> = {
    early_arrival: '#FACC15',
    access_granted: '#14B8A6',
    waiting: '#14B8A6',
    rescheduled: '#3B82F6',
    expired: '#3B82F6'
  };
  @Input() totalAnimationDuration: number = 120000;
  @Input() width = 800;
  @Input() height = 500;
  @Input() margin = { top: 10, right: 130, bottom: 10, left: 10 };
  @Input() padding = 20;
  @Input() curve = 0.6;
  @Input() psize = 7;
  @Input() speed = 0.25;
  @Input() density = 7;
  @Input() routeAlign: 'top' | 'middle' = 'middle';

  private svg?: d3.Selection<SVGSVGElement, unknown, null, undefined>;
  private g?: d3.Selection<SVGGElement, unknown, null, undefined>;

  private sankeyData: any;
  private routes: any[] = [];
  private leaves: any[] = [];
  private cache: Record<string, { points: { x: number; y: number }[] }> = {};

  private totalParticles = 0;

  private particles: any[] = [];
  private running = false;
  private tickFrame = 0;
  private bandHeight = 0;

  private colorScale!: d3.ScaleOrdinal<string, string>;

  private particleCounter = 0;

  private animationStartTime: number = 0;
  private simulationStartTime: Date = new Date();
  private simulationEndTime: Date = new Date();
  private timeScale!: d3.ScaleLinear<number, number>;

  private particleGenerationSchedule: any[] = [];

  private outcomeCounters: Record<string, { granted: number; denied: number }> = {};

  // New properties for fixed timing
  private totalAnimationFrames: number = 0;
  private fixedTravelFrames: number = 60; // Standard travel time for all particles

  constructor() { }

  ngOnInit(): void { }
  ngAfterViewInit(): void { }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['totalAnimationDuration'] && !changes['totalAnimationDuration'].firstChange) {
      this.reset();
      this._prepareData();
      this._createScales();
      this._buildChart();
      this.start();
    }
  }

  ngOnDestroy(): void {
    this.stop();
  }

  public start(): void {
    this.running = true;
    this.animationStartTime = performance.now();
    this.totalAnimationFrames = (this.totalAnimationDuration / 1000) * 60; // 60 FPS
    this._createParticleGenerationSchedule();
    const loop = () => {
      if (!this.running) return;
      this.update();
      requestAnimationFrame(loop);
    };
    requestAnimationFrame(loop);
  }

  public stop(): void {
    this.running = false;
  }

  public startAgain(): void {
    this.reset();
    this._prepareData();
    this._createScales();
    this._buildChart();
    this.start();
  }

  public reset(): void {
    this.stop();
    this.tickFrame = 0;
    this.particles = [];
    this.animationStartTime = 0;
    this.particleGenerationSchedule = [];
    this.outcomeCounters = {};
    if (this.g) {
      this.g.selectAll('.particle').remove();
      this.g.selectAll('.absolute').text(0);
      this.g.selectAll('.percent').text('0%');
    }
    if (this.svg) {
      this.svg.remove();
      this.svg = undefined;
    }
    this.cache = {};
    this.routes = [];
    this.leaves = [];
  }

  private _createParticleGenerationSchedule(): void {
    this.particleGenerationSchedule = [];
    if (!this._simulationDataArray || this._simulationDataArray.length === 0) {
      console.warn('No simulation data available.');
      return;
    }

    const allEvents: { event: TransactionEvent, accessPoint: string }[] = [];
    const eventIds = new Set<string>();
    this._simulationDataArray.forEach(simData => {
      if (simData.events) {
        simData.events
          .filter(event => !['checkout', 'no_show'].includes(event.event))
          .forEach(event => {
            if (!eventIds.has(event._id)) {
              eventIds.add(event._id);
              allEvents.push({ event, accessPoint: simData.accessPoint });
            } else {
              console.warn(`Duplicate event ID ${event._id} skipped for accessPoint ${simData.accessPoint}`);
            }
          });
      }
    });

    if (allEvents.length === 0) {
      console.warn('No valid events found after filtering.');
      return;
    }

    // Sort events by timestamp
    allEvents.sort((a, b) => new Date(a.event.timestamp).getTime() - new Date(b.event.timestamp).getTime());

    if (!allEvents[0]?.event?.timestamp || !allEvents[allEvents.length - 1]?.event?.timestamp) {
      console.error('Invalid timestamps in events. Using fallback dates.');
      this.simulationStartTime = new Date();
      this.simulationEndTime = new Date(this.simulationStartTime.getTime() + this.totalAnimationDuration);
    } else {
      this.simulationStartTime = new Date(allEvents[0].event.timestamp);
      this.simulationEndTime = new Date(allEvents[allEvents.length - 1].event.timestamp);
    }

    // Calculate generation frames - ensure last particle finishes exactly at totalAnimationFrames
    const maxGenerationFrame = this.totalAnimationFrames - this.fixedTravelFrames;

    this.timeScale = d3.scaleLinear()
      .domain([this.simulationStartTime.getTime(), this.simulationEndTime.getTime()])
      .range([0, maxGenerationFrame]);

    allEvents.forEach((eventData, index) => {
      const event = eventData.event;
      const accessPoint = eventData.accessPoint;
      let generationFrame = Math.floor(this.timeScale(new Date(event.timestamp).getTime()));

      // Ensure generation frame is within bounds
      generationFrame = Math.max(0, Math.min(generationFrame, maxGenerationFrame));

      const outcome = event.event === 'access_granted' ? 'Granted' : 'Denied';
      const pathKey = `/Trucks/${accessPoint}`;

      if (!this.cache[pathKey]) {
        console.warn(`No path found for accessPoint ${accessPoint}. Particle will be skipped.`);
        return;
      }

      // Use fixed travel time and calculate speed based on path length
      const pathLength = this.cache[pathKey].points.length;
      const speed = pathLength / this.fixedTravelFrames * this.speed;

      this.particleGenerationSchedule.push({
        frame: generationFrame,
        event: event,
        accessPoint: accessPoint,
        outcome: outcome,
        speed: speed,
        particleIndex: index,
        pathKey: pathKey,
        generated: false,
        completionFrame: generationFrame + this.fixedTravelFrames
      });
    });

    // Sort by completion frame to ensure proper timing
    this.particleGenerationSchedule.sort((a, b) => a.completionFrame - b.completionFrame);
  }

  private update(): void {
    this.tickFrame++;
    this._addParticlesFromSchedule(this.tickFrame);
    this._updateCounters();

    // Check if animation should complete
    if (this.tickFrame >= this.totalAnimationFrames) {
      this.stop();
      return;
    }

    if (!this.g) return;

    // Remove particles that have completed their journey
    this.particles = this.particles.filter(particle => {
      const localT = this.tickFrame - particle.createdAt;
      return localT * particle.speed < particle.length;
    });

    const allParticles = this.particles;
    const sel = this.g.select('.particles-container')
      .selectAll<SVGRectElement, any>('.particle')
      .data(allParticles, d => d.id);

    sel.enter()
      .append('rect')
      .attr('class', 'particle')
      .attr('opacity', 0.7)
      .attr('fill', d => d.color)
      .attr('width', this.psize)
      .attr('height', this.psize)
      .merge(sel as any)
      .each((d, i, nodes) => {
        const localT = this.tickFrame - d.createdAt;
        d.pos = localT * d.speed;
        const routePoints = this.cache[d.pathKey]?.points;

        if (!routePoints) return;

        const lastIndex = routePoints.length - 1;

        if (d.pos >= lastIndex) {
          d.pos = lastIndex;
          const finalPoint = routePoints[lastIndex];
          d3.select(nodes[i])
            .attr('x', finalPoint.x)
            .attr('y', finalPoint.y - this.psize / 2)
            .attr('width', this.psize * 2)
            .attr('height', this.psize * 0.4);
        } else {
          const idx = Math.floor(d.pos);
          const coo = routePoints[idx];
          const nextCoo = routePoints[idx + 1];
          if (coo && nextCoo) {
            const delta = d.pos - idx;
            const x = coo.x + (nextCoo.x - coo.x) * delta;
            const y = coo.y + (nextCoo.y - coo.y) * delta;
            d3.select(nodes[i])
              .attr('x', x)
              .attr('y', y - this.psize / 2)
              .attr('width', this.psize)
              .attr('height', this.psize);
          }
        }
      });

    sel.exit().remove();
  }

  private _addParticlesFromSchedule(frame: number): void {
    const scheduledParticles = this.particleGenerationSchedule.filter(
      scheduled => scheduled.frame <= frame && !scheduled.generated
    );
    scheduledParticles.forEach(scheduled => {
      scheduled.generated = true;
      this._generateScheduledParticle(scheduled, frame);
    });
  }

  private _generateScheduledParticle(scheduled: any, currentFrame: number): void {
    const event = scheduled.event;
    const pathKey = scheduled.pathKey;

    if (!this.cache[pathKey] || !this.cache[pathKey].points) {
      console.warn(`Path not found for ${pathKey}, event ID: ${event._id}`);
      return;
    }

    const particle = {
      id: `${event._id}_${scheduled.particleIndex}`,
      speed: scheduled.speed,
      color: this.colorScale(event.event),
      offset: 0,
      pos: 0,
      createdAt: currentFrame,
      length: this.cache[pathKey].points.length,
      pathKey: pathKey,
      event: event,
      accessPoint: scheduled.accessPoint,
      outcome: scheduled.outcome,
      scheduledIndex: scheduled.particleIndex,
      completionFrame: scheduled.completionFrame
    };

    this.particles.push(particle);
    this.particleCounter++;
  }

  private _buildChart(): void {
    const container = this.chartContainer.nativeElement;
    this.svg = d3.select(container)
      .append('svg')
      .attr('width', this.width)
      .attr('height', this.height);

    const extraSpace = this.height - this.computedHeight;
    this.g = this.svg.append('g')
      .attr('transform', `translate(${this.margin.left}, ${this.margin.top + extraSpace / 2})`);

    this.g.append('g')
      .attr('class', 'routes')
      .attr('fill', 'none')
      .attr('stroke-opacity', 0.1)
      .attr('stroke', '#eee')
      .selectAll('path')
      .data(this.routes)
      .enter()
      .append('path')
      .attr('d', d => this._sankeyLinkCustom(d))
      .attr('stroke-width', this.bandHeight);

    this.g.append('g').attr('class', 'particles-container');

    this.g.selectAll('.label')
      .data(this.sankeyData.nodes)
      .enter()
      .append('g')
      .attr('class', 'label')
      .attr('transform', (d: any) => `translate(${d.x1 - this.bandHeight / 2}, ${d.y0 + this.bandHeight / 2})`)
      .attr('dominant-baseline', 'middle')
      .attr('text-anchor', 'end')
      .call(g => g.append('text')
        .attr('stroke', 'white')
        .attr('stroke-width', 3)
        .text((d: any) => d.name)
      )
      .call(g => g.append('text')
        .attr('fill', '#444')
        .text((d: any) => d.name)
      );

    const counterSel = this.g.selectAll('.counter')
      .data(this.leaves)
      .enter()
      .append('g')
      .attr('class', 'counter')
      .attr('transform', d => `translate(${this.width - this.margin.left}, ${d.node.y0})`);

    counterSel.each((leaf, i, nodes) => {
      const sel = d3.select(nodes[i]);
      sel.selectAll('.group')
        .data(this.labels)
        .enter()
        .append('g')
        .attr('class', 'group')
        .attr('transform', (label, idx) => `translate(${-idx * 60}, 0)`)
        .attr('text-anchor', 'end')
        .style('font-family', 'Menlo')
        .each((label, j, groupNodes) => {
          if (i === 0) {
            d3.select(groupNodes[j])
              .append('text')
              .attr('dominant-baseline', 'hanging')
              .attr('fill', '#999')
              .style('font-size', 9)
              .style('text-transform', 'uppercase')
              .style('letter-spacing', 0.7)
              .style('transform', 'translate(0 , -20px)')
              .text(label);
          }
        })
        .call(g => g.append('text')
          .attr('class', 'absolute')
          .attr('fill', '#444')
          .attr('font-size', 20)
          .attr('dominant-baseline', 'middle')
          .attr('y', this.bandHeight / 2 - 2)
          .text(0)
        )
        .call(g => g.append('text')
          .attr('class', 'percent')
          .attr('dominant-baseline', 'hanging')
          .attr('fill', '#999')
          .attr('font-size', 9)
          .attr('y', this.bandHeight / 2 + 9)
          .text('0%')
        );
    });

    const infoGroup = this.g.append('g')
      .attr('class', 'simulation-info-group')
      .attr('transform', `translate(10, -30)`);

    infoGroup.append('text')
      .attr('class', 'simulation-info')
      .attr('x', 0)
      .attr('y', 0)
      .attr('text-anchor', 'start')
      .attr('fill', '#666')
      .style('font-family', 'Menlo')
      .style('font-size', '12px')
      .text(`Access Points: ${this._simulationDataArray.length}`);

    infoGroup.append('text')
      .attr('class', 'progress-info')
      .attr('x', 0)
      .attr('y', 15)
      .attr('text-anchor', 'start')
      .attr('fill', '#666')
      .style('font-family', 'Menlo')
      .style('font-size', '10px')
      .text('Progress: 0%');

    const legendGroup = this.g.append('g')
      .attr('class', 'legend-group')
      .attr('transform', `translate(10, ${this.height - this.margin.top - this.margin.bottom - 100})`);

    legendGroup.append('text')
      .attr('x', 0)
      .attr('y', -10)
      .attr('fill', '#666')
      .style('font-size', '11px')
      .style('font-weight', 'bold')
      .text('Event Types:');

    legendGroup.selectAll('.legend-item')
      .data(this.eventTypes)
      .enter()
      .append('g')
      .attr('class', 'legend-item')
      .attr('transform', (d, i) => `translate(0, ${i * 15})`)
      .each((eventType, i, nodes) => {
        const group = d3.select(nodes[i]);
        group.append('rect')
          .attr('width', 10)
          .attr('height', 10)
          .attr('fill', this.colors[eventType]);
        group.append('text')
          .attr('x', 15)
          .attr('y', 8)
          .attr('fill', '#666')
          .style('font-size', '10px')
          .text(eventType.replace('_', ' '));
      });
  }

  private _prepareData(): void {
    if (!this._simulationDataArray || this._simulationDataArray.length === 0) return;

    this.outcomeCounters = {};
    this._simulationDataArray.forEach(simData => {
      this.outcomeCounters[simData.accessPoint] = { granted: 0, denied: 0 };
    });

    this.totalParticles = 0;
    const eventIds = new Set<string>();
    this._simulationDataArray.forEach(simData => {
      if (simData.events) {
        simData.events
          .filter(event => !['checkout', 'no_show'].includes(event.event))
          .forEach(event => {
            if (!eventIds.has(event._id)) {
              eventIds.add(event._id);
              this.totalParticles++;
            }
          });
      }
    });
    const accessPoints = Array.from(new Set(this._simulationDataArray.map(simData => simData.accessPoint)));
    const { nodes, links } = this._buildNodeLinkArrays();
    const dataForSankey = {
      nodes: nodes.map(n => ({ ...n, fixedValue: 1 })),
      links: links.map(l => ({ ...l, value: 1 }))
    };

    this.bandHeight = Math.min(80, Math.max(40, 120 / Math.max(1, accessPoints.length)));

    const computedHeight = this.margin.top + this.margin.bottom +
      accessPoints.length * (this.bandHeight + this.padding / 2) +
      this.padding / 2;

    this.computedHeight = computedHeight;
    this.height = Math.max(this.height, computedHeight);

    const sk = sankey<any, any>()
      .nodeId(d => d.name)
      .nodeAlign(sankeyJustify)
      .nodeWidth(
        (this.width - this.margin.left - this.margin.right) / 2 * this.curve
      )
      .nodePadding(this.padding)
      .extent([
        [0, 0],
        [this.width - this.margin.left - this.margin.right,
        this.height - this.margin.top - this.margin.bottom]
      ]);

    this.sankeyData = sk(dataForSankey);

    this.sankeyData.nodes.forEach((node: any) => {
      node.path = node.name === 'Trucks' ? '/Trucks' : `/Trucks/${node.name}`;
    });

    this.routes = this._buildRoutes(this.sankeyData);

    const accessPointNodes = this.sankeyData.nodes.filter((n: any) => n.name !== 'Trucks');
    this.leaves = accessPointNodes.map((n: any) => ({
      node: n,
      accessPoint: n.name
    }));
  }

  private _createScales(): void {
    this.colorScale = d3.scaleOrdinal<string>()
      .domain(this.eventTypes)
      .range(this.eventTypes.map(et => this.colors[et] || '#999999'));
  }

  private _buildNodeLinkArrays(): { nodes: Array<{ name: string }>, links: Array<{ source: string, target: string }> } {
    const nodes = new Set<string>(['Trucks']);
    const links: Array<{ source: string, target: string }> = [];

    const accessPoints = Array.from(new Set(this._simulationDataArray.map(simData => simData.accessPoint)));
    accessPoints.forEach(ap => {
      links.push({ source: 'Trucks', target: ap });
      nodes.add(ap);
    });

    return {
      nodes: Array.from(nodes).map(name => ({ name })),
      links
    };
  }

  private _buildRoutes(sankeyData: any): any[] {
    function walk(n: any): any[] {
      const subroutes = n.sourceLinks.flatMap((d: any) => walk(d.target));
      return subroutes.length ? subroutes.map((r: any) => [n, ...r]) : [[n]];
    }
    const root = sankeyData.nodes.find((x: any) => x.targetLinks.length === 0);
    const routes = walk(root);
    return routes;
  }

  private _sankeyLinkCustom(nodes: any[]): string {
    if (!this.g) return '';
    const offset = this.routeAlign === 'top' ? 0 : this.bandHeight / 2;
    const pathGen = d3.path();
    nodes.forEach((n, i) => {
      if (i === 0) {
        pathGen.moveTo(n.x0, n.y0 + offset);
      }
      pathGen.lineTo(n.x1, n.y0 + offset);
      const next = nodes[i + 1];
      if (next) {
        const w = next.x0 - n.x1;
        pathGen.bezierCurveTo(
          n.x1 + w * 0.6, n.y0 + offset,
          n.x1 + w * 0.6, next.y0 + offset,
          next.x0, next.y0 + offset
        );
      }
    });

    const pathStr = pathGen.toString();
    const tmpPath = this.g.append('path')
      .attr('d', pathStr)
      .attr('visibility', 'hidden');

    const totalLength = (tmpPath.node() as SVGPathElement).getTotalLength();
    const points: { x: number; y: number }[] = [];
    const step = Math.max(2, Math.floor(totalLength / 50));

    for (let l = 0; l < totalLength; l += step) {
      const pt = (tmpPath.node() as SVGPathElement).getPointAtLength(l);
      points.push({ x: pt.x, y: pt.y });
    }

    const lastNode = nodes[nodes.length - 1];
    points.push({ x: lastNode.x1, y: lastNode.y0 + offset });

    const routeKey = '/' + nodes.map((n: any) => n.name).join('/');
    this.cache[routeKey] = { points };
    tmpPath.remove();

    return pathStr;
  }

  private _updateCounters(): void {
    if (!this.g) return;

    const progress = Math.min(this.tickFrame / this.totalAnimationFrames, 1);

    // this.g.select('.progress-info')
    //   .text(`Progress: ${d3.format('.1%')(progress)} | Particles: ${this.particles.length} | Frame: ${this.tickFrame}/${this.totalAnimationFrames}`);

    // Reset counters
    Object.keys(this.outcomeCounters).forEach(ap => {
      this.outcomeCounters[ap] = { granted: 0, denied: 0 };
    });

    // Count completed particles
    this.particles.forEach(p => {
      if (p.pos >= (p.length - 1)) {
        if (p.outcome === 'Granted') {
          this.outcomeCounters[p.accessPoint].granted++;
        } else {
          this.outcomeCounters[p.accessPoint].denied++;
        }
      }
    });

    // Also count particles that have been removed (completed their journey)
    this.particleGenerationSchedule
      .filter(scheduled => scheduled.generated && scheduled.completionFrame <= this.tickFrame)
      .forEach(scheduled => {
        if (scheduled.outcome === 'Granted') {
          this.outcomeCounters[scheduled.accessPoint].granted++;
        } else {
          this.outcomeCounters[scheduled.accessPoint].denied++;
        }
      });

    this.g.selectAll<SVGGElement, any>('.counter')
      .each((leaf, i, nodes) => {
        const sel = d3.select(nodes[i]);
        const accessPoint = leaf.accessPoint;
        const counters = this.outcomeCounters[accessPoint] || { granted: 0, denied: 0 };
        const total = counters.granted + counters.denied;

        sel.selectAll('.group')
          .each((label, j, groupNodes) => {
            const count = label === 'Granted' ? counters.granted : counters.denied;
            const percentage = total > 0 ? count / total : 0;

            d3.select(groupNodes[j]).select('.absolute')
              .text(count);
            d3.select(groupNodes[j]).select('.percent')
              .text(d3.format('.0%')(percentage));
          });
      });
  }
}