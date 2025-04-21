import {
    Component, OnInit, AfterViewInit, OnDestroy, OnChanges, SimpleChanges,
    Input, ElementRef, ViewChild
  } from '@angular/core';
  import * as d3 from 'd3';
  import { sankey, sankeyJustify } from 'd3-sankey';
  
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
    private _rawData: any = {};
  
    computedHeight: number = 0;
  
    @Input()
    set rawData(data: any) {
      this._rawData = data;
      if (data && Object.keys(data).length > 0) {
        this.reset();
        this._prepareData();
        this._createScales();
        this._buildChart();
        if (this.autoStart) {
          this.start();
        }
      }
    }
    get rawData(): any {
      return this._rawData;
    }
  
    @Input() timeSeriesData: any = {};
    @Input() groupKeys: string[] = []; // e.g., ["Access Granted", "Access Denied"]
    // totalAnimationDuration in milliseconds – default 60000 ms (1 min)
    @Input() totalAnimationDuration: number = 120000;
    @Input() width = 800;
    @Input() height = 500;
    @Input() margin = { top: 10, right: 130, bottom: 10, left: 10 };
    @Input() padding = 20;
    @Input() curve = 0.6;
    @Input() psize = 7;
    @Input() speed = 0.7;
    @Input() density = 7;
    @Input() routeAlign: 'top' | 'middle' = 'middle';
  
    private svg?: d3.Selection<SVGSVGElement, unknown, null, undefined>;
    private g?: d3.Selection<SVGGElement, unknown, null, undefined>;
  
    private sankeyData: any;
    private routes: any[] = [];
    private leaves: any[] = [];
    private cache: Record<string, { points: { x: number; y: number }[] }> = {};
  
    // Array holding all targets (from rawData or timeSeriesData)
    private targetsAbsolute: any[] = [];
    // Total particles (cumulative sum of all target values)
    private totalParticles = 0;
  
    // Particle animation
    private particles: any[] = [];
    private running = false;
    private tickFrame = 0;
    private bandHeight = 0;
  
    // D3 scales
    private colorScale!: d3.ScaleOrdinal<string, string>;
  
    // For time series data: cumulative targets per node/group
    private cumulativeTargets: Record<string, any> = {};
  
    // Particle counter for cycling slot assignment
    private particleCounter = 0;
  
    constructor() { }
  
    ngOnInit(): void { }
    ngAfterViewInit(): void { }
  
    ngOnChanges(changes: SimpleChanges): void {
      // When totalAnimationDuration changes (after initial load)
      if (changes['totalAnimationDuration'] && !changes['totalAnimationDuration'].firstChange) {
        console.log("New totalAnimationDuration:", this.totalAnimationDuration);
        // Option 1: Update speeds for particles already in motion
        const newSlotDurationMs = this.totalAnimationDuration / 24;
        this.particles.forEach(particle => {
          const slotIndex = particle.slot;
          const desiredFinishTimeMs = (slotIndex + 1) * newSlotDurationMs;
          const totalSlotFrames = desiredFinishTimeMs / (1000 / 60);
          // You can choose to preserve the original randomFactor by storing it in the particle.
          const randomFactor = 0.9 + Math.random() * 0.2;
          particle.speed = (particle.length / totalSlotFrames) * randomFactor;
        });
        // Option 2: Fully reset the animation so that new particles are created with the updated speed
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
  
    // ----------------------------------------------------
    // Animation control
    // ----------------------------------------------------
    public start(): void {
      this.running = true;
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
  
    // ----------------------------------------------------
    // Animation update loop
    // ----------------------------------------------------
    private update(): void {
      this.tickFrame++;
      this._addParticlesMaybe(this.tickFrame);
      this._updateCounters();
  
      if (!this.g) return;
      const allParticles = this.particles;
      const sel = this.g.select('.particles-container')
        .selectAll<SVGRectElement, any>('.particle')
        .data(allParticles, d => d.id);
  
      // ENTER: create new particle elements
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
          const routePoints = this.cache[d.target.path].points;
          const lastIndex = routePoints.length - 1;
  
          // If the particle has reached the end of the path:
          if (d.pos >= lastIndex) {
            d.pos = lastIndex;
            const finalPoint = routePoints[lastIndex];
            d3.select(nodes[i])
              .attr("x", finalPoint.x)
              .attr("y", finalPoint.y - this.psize / 2)
              .attr("width", this.psize * 2)
              .attr("height", this.psize * 0.4);
          } else {
            // Otherwise, interpolate its position
            const idx = Math.floor(d.pos);
            const coo = routePoints[idx];
            const nextCoo = routePoints[idx + 1];
            if (coo && nextCoo) {
              const delta = d.pos - idx;
              const x = coo.x + (nextCoo.x - coo.x) * delta;
              const y = coo.y + (nextCoo.y - coo.y) * delta;
              d3.select(nodes[i])
                .attr("x", x)
                .attr("y", y - this.psize / 2)
                .attr("width", this.psize)
                .attr("height", this.psize);
            }
          }
        });
  
      sel.exit().remove();
    }
  
    // ----------------------------------------------------
    // Build the diagram
    // ----------------------------------------------------
    private _buildChart(): void {
      const container = this.chartContainer.nativeElement;
      this.svg = d3.select(container)
        .append('svg')
        .attr('width', this.width)
        .attr('height', this.height);
  
      // Calculate extra vertical space and center the chart vertically
      const extraSpace = this.height - this.computedHeight;
      this.g = this.svg.append('g')
        .attr('transform', `translate(${this.margin.left}, ${this.margin.top + extraSpace / 2})`);
  
      // Draw the route paths
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
  
      // Container for particles
      this.g.append('g').attr('class', 'particles-container');
  
      // Add node labels
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
  
      // Add counters for each leaf and group
      const counterSel = this.g.selectAll('.counter')
        .data(this.leaves)
        .enter()
        .append('g')
        .attr('class', 'counter')
        .attr('transform', d => `translate(${this.width - this.margin.left}, ${d.node.y0})`);
  
      counterSel.each((leaf, i, nodes) => {
        const sel = d3.select(nodes[i]);
        sel.selectAll('.group')
          .data(this.groupKeys)
          .enter()
          .append('g')
          .attr('class', 'group')
          .attr('transform', (groupKey, idx) => `translate(${-idx * 60}, 0)`)
          .attr('text-anchor', 'end')
          .style('font-family', 'Menlo')
          .each((groupKey, j, groupNodes) => {
            if (i === 0) {
              d3.select(groupNodes[j])
                .append('text')
                .attr('dominant-baseline', 'hanging')
                .attr('fill', '#999')
                .style('font-size', 9)
                .style('text-transform', 'uppercase')
                .style('letter-spacing', 0.7)
                .style('transform', 'translate(0 , -20px)')
                .text(groupKey);
            }
          })
          .call(g => g.append('text')
            .attr('class', 'absolute')
            .attr('fill', d => this.colorScale(d))
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
    }
  
    // ----------------------------------------------------
    // Data Preparation
    // ----------------------------------------------------
    private _prepareData(): void {
      if (Object.keys(this.timeSeriesData).length > 0) {
        Object.keys(this.timeSeriesData).forEach(nodeName => {
          this.cumulativeTargets[nodeName] = {};
          this.groupKeys.forEach(group => {
            let cumulative = 0;
            this.cumulativeTargets[nodeName][group] = this.timeSeriesData[nodeName].map((slot: any) => {
              cumulative += slot[group] || 0;
              return cumulative;
            });
          });
        });
        this.totalParticles = d3.sum(Object.keys(this.cumulativeTargets), nodeName => {
          return d3.sum(this.groupKeys, group => {
            const arr = this.cumulativeTargets[nodeName][group];
            return arr[arr.length - 1] || 0;
          });
        });
        this.targetsAbsolute = [];
        Object.keys(this.timeSeriesData).forEach(nodeName => {
          this.timeSeriesData[nodeName].forEach((slot: any, idx: number) => {
            const slotTime = slot.time || slot.Time || '';
            this.groupKeys.forEach(group => {
              this.targetsAbsolute.push({
                name: nodeName,
                time: slotTime,
                slot: idx,
                group: group,
                value: slot[group] || 0,
                generated: 0
              });
            });
          });
        });
      } else {
        const hierarchy = this._buildHierarchy(this._rawData);
        const leavesArr = hierarchy.leaves();
        this.targetsAbsolute = leavesArr.flatMap(leaf => {
          const d = leaf?.data;
          return d?.groups?.map((g: any) => ({
            name: d.name,
            path: d.path,
            group: g.key,
            value: g.value
          }));
        });
        this.totalParticles = d3.sum(this.targetsAbsolute, d => d?.value);
      }
  
      const { nodes, links } = this._buildNodeLinkArrays(this._rawData);
      const dataForSankey = {
        nodes: nodes.map(n => ({ ...n, fixedValue: 1 })),
        links: links.map(l => ({ ...l, value: 0 }))
      };
  
      const hierarchy = this._buildHierarchy(this._rawData);
      const leavesCount = hierarchy.leaves().length;
      this.bandHeight = 80 - this.padding / 2;
  
      const computedHeight = this.margin.top + this.margin.bottom +
        leavesCount * (this.bandHeight + this.padding / 2) +
        this.padding / 2;
  
      this.computedHeight = computedHeight;
      this.height = Math.max(this.height, computedHeight);
  
      const sk = sankey<any, any>()
        .nodeId(d => d.name)
        .nodeAlign(sankeyJustify)
        .nodeWidth(
          (this.width - this.margin.left - this.margin.right) /
          (hierarchy.height + 1) * this.curve
        )
        .nodePadding(this.padding)
        .extent([
          [0, 0],
          [this.width - this.margin.left - this.margin.right,
           this.height - this.margin.top - this.margin.bottom]
        ]);
      this.sankeyData = sk(dataForSankey);
      this.routes = this._buildRoutes(this.sankeyData);
      const sankeyLeaves = this.sankeyData.nodes.filter((n: any) => n.sourceLinks.length === 0);
      this.leaves = sankeyLeaves.map((n: any) => ({
        node: n,
        targets: this.targetsAbsolute.filter(t => t?.name === n?.name)
      }));
  
      // Assign target paths
      this.targetsAbsolute.forEach(t => {
        const matchingNode = this.sankeyData.nodes.find((n: any) => n.name === t.name);
        if (matchingNode) {
          t.path = matchingNode.path || matchingNode.data?.path || '';
        }
        if (!t.path) {
          t.path = `/Trucks/${t.name}`;
        }
      });
    }
  
    private _createScales(): void {
      this.colorScale = d3.scaleOrdinal<string>()
        .domain(this.groupKeys)
        .range(["#FFCC33", "#33CCFF"]);
    }
  
    // ----------------------------------------------------
    // Helpers to build hierarchy, nodes, links, routes
    // ----------------------------------------------------
    private _buildHierarchy(rawObj: any) {
      const isLeaf = (obj: any) => this.groupKeys.every(k => typeof obj[k] === 'number');
      function getChildren(nodeObj: any) {
        const { name, ...rest } = nodeObj;
        if (isLeaf(rest)) return undefined;
        return Object.entries(rest).map(([k, v]: [string, any]) => ({ name: k, ...v }));
      }
      const rootObj = { name: 'Trucks', ...rawObj };
      const root = d3.hierarchy(rootObj, getChildren.bind(this));
      const absolutePath = (d: d3.HierarchyNode<any>): string =>
        d.parent ? absolutePath(d.parent) + '/' + d.data.name : '/' + d.data.name;
      root.each(d => {
        const nodeData: any = {
          name: d.data.name,
          path: absolutePath(d)
        };
        if (isLeaf(d.data)) {
          nodeData.groups = this.groupKeys.map(k => ({
            key: k,
            value: d.data[k] || 0
          }));
        }
        d.data = nodeData;
      });
      return root;
    }
  
    private _buildNodeLinkArrays(rawObj: any) {
      const isLeaf = (obj: any) => this.groupKeys.every(k => typeof obj[k] === 'number');
      const nodes = new Set<string>(['Trucks']);
      const links: Array<{ source: string; target: string }> = [];
      function walk(source: string, sourceObj: any) {
        for (const name in sourceObj) {
          links.push({ source, target: name });
          if (!isLeaf(sourceObj[name])) {
            walk(name, sourceObj[name]);
          }
          nodes.add(name);
        }
      }
      walk('Trucks', rawObj);
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
      return walk(root);
    }
  
    private _sankeyLinkCustom(nodes: any[]): string {
      if (!this.g) return '';
      const offset = (this.routeAlign === 'top') ? 0 : this.bandHeight / 2;
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
            n.x1 + w / 2, n.y0 + offset,
            n.x1 + w / 2, next.y0 + offset,
            next.x0, next.y0 + offset
          );
        }
      });
      const pathStr = pathGen.toString();
      // Use a temporary path to sample points along the route
      const tmpPath = this.g.append('path')
        .attr('d', pathStr)
        .attr('visibility', 'hidden');
      const totalLength = (tmpPath.node() as SVGPathElement).getTotalLength();
      const points: { x: number; y: number }[] = [];
      for (let l = 0; l < totalLength; l++) {
        const pt = (tmpPath.node() as SVGPathElement).getPointAtLength(l);
        points.push({ x: pt.x, y: pt.y });
      }
      const lastNode = nodes[nodes.length - 1];
      const computedEndpoint = { x: lastNode.x1, y: lastNode.y0 + offset };
      points.push(computedEndpoint);
      const routeKey = '/' + nodes.map((n: any) => n.name).join('/');
      this.cache[routeKey] = { points };
      tmpPath.remove();
      return pathStr;
    }
  
    // ----------------------------------------------------
    // Particle generation & counters
    // ----------------------------------------------------
    private _addParticlesMaybe(frame: number): void {
      const elapsedMs = (frame / 60) * 1000;
      const slotDurationMs = this.totalAnimationDuration / 24; // e.g., if totalAnimationDuration is 60000, then each slot is 2500 ms
      const currentSlot = Math.min(Math.floor(elapsedMs / slotDurationMs), 23);
      const needed = Math.round(Math.random() * this.density);
  
      for (let i = 0; i < needed; i++) {
        const eligibleTargets = this.targetsAbsolute.filter(t => t.value > 0);
        if (eligibleTargets.length === 0) break;
        const target = eligibleTargets[Math.floor(Math.random() * eligibleTargets.length)];
        if (!target.path || !this.cache[target.path]) continue;
        if (target.generated === undefined) target.generated = 0;
        if (target.generated >= target.value) continue;
  
        const length = this.cache[target.path].points.length;
        const slotIndex = (target.slot !== undefined) ? target.slot : (this.particleCounter % 24);
        this.particleCounter++;
  
        const desiredFinishTimeMs = (slotIndex + 1) * slotDurationMs;
        const totalSlotFrames = desiredFinishTimeMs / (1000 / 60);
        const randomFactor = 0.9 + Math.random() * 0.2;
        const particleSpeed = (length / totalSlotFrames) * randomFactor;
  
        // Create particle (all particles start from offset 0)
        const particle = {
          id: `${frame}_${i}`,
          speed: particleSpeed,
          color: this.colorScale(target.group),
          offset: 0,
          pos: 0,
          createdAt: frame,
          length,
          target,
          slot: slotIndex
        };
        this.particles.push(particle);
        target.generated++;
      }
    }
  
    private _updateCounters(): void {
      if (!this.g) return;
      this.g.selectAll<SVGGElement, any>('.counter')
        .each((leaf, i, nodes) => {
          const sel = d3.select(nodes[i]);
          sel.selectAll<SVGGElement, any>('.group')
            .each((groupKey, j, groupNodes) => {
              const count = this.particles.filter(
                p =>
                  p.target.name === leaf.node.name &&
                  p.target.group === groupKey &&
                  p.pos >= (p.length - 1)
              ).length;
              d3.select(groupNodes[j]).select('.absolute').text(count);
              d3.select(groupNodes[j]).select('.percent')
                .text(d3.format('.0%')(count / this.totalParticles));
            });
        });
    }
  }
  

// import {
//     Component, OnInit, AfterViewInit, OnDestroy, OnChanges, SimpleChanges,
//     Input, ElementRef, ViewChild
// } from '@angular/core';
// import * as d3 from 'd3';
// import { sankey, sankeyJustify } from 'd3-sankey';

// @Component({
//     selector: 'app-sankey-chart',
//     template: `<div #chartContainer class="sankey-chart-container"></div>`,
//     styles: [`
//       .sankey-chart-container {
//         margin: 10px;
//       }
//     `]
// })
// export class SankeyChartComponent implements OnInit, AfterViewInit, OnDestroy, OnChanges {

//     @ViewChild('chartContainer', { static: true }) chartContainer!: ElementRef;
//     @Input() autoStart: boolean = true;
//     private _rawData: any = {};
//     computedHeight: number;
//     @Input()
//     set rawData(data: any) {
//         this._rawData = data;
//         if (data && Object.keys(data).length > 0) {
//             this.reset();
//             this._prepareData();
//             this._createScales();
//             this._buildChart();
//             if (this.autoStart) {
//                 this.start();
//             }
//         }
//     }
//     get rawData(): any {
//         return this._rawData;
//     }

//     // Time series data may use "time" or "Time"
//     @Input() timeSeriesData: any = {};
//     @Input() groupKeys: string[] = []; // e.g., ["Access Granted", "Access Denied"]
//     @Input() totalAnimationDuration = 60000; // in ms
//     @Input() width = 800;
//     @Input() height = 500;
//     @Input() margin = { top: 10, right: 130, bottom: 10, left: 10 };
//     @Input() padding = 20;
//     @Input() curve = 0.6;
//     @Input() psize = 7;
//     @Input() speed = 0.7;
//     @Input() density = 7;
//     @Input() routeAlign: 'top' | 'middle' = 'middle';

//     private svg?: d3.Selection<SVGSVGElement, unknown, null, undefined>;
//     private g?: d3.Selection<SVGGElement, unknown, null, undefined>;

//     private sankeyData: any;
//     private routes: any[] = [];
//     private leaves: any[] = [];
//     private cache: Record<string, { points: { x: number; y: number }[] }> = {};

//     // Array holding all targets (from rawData or timeSeriesData)
//     private targetsAbsolute: any[] = [];
//     // Total particles (cumulative sum of all target values)
//     private totalParticles = 0;

//     // Particle animation
//     private particles: any[] = [];
//     private running = false;
//     private tickFrame = 0;
//     private bandHeight = 0;

//     // D3 scales
//     private colorScale!: d3.ScaleOrdinal<string, string>;
//     private speedScale!: d3.ScaleLinear<number, number>;
//     private offsetScale!: d3.ScaleLinear<number, number>;

//     // For time series data: cumulative targets per node/group
//     private cumulativeTargets: Record<string, any> = {};

//     // Particle counter for cycling slot assignment
//     private particleCounter = 0;

//     constructor() { }

//     ngOnInit(): void { }
//     ngAfterViewInit(): void { }
//     ngOnChanges(changes: SimpleChanges): void { }
//     ngOnDestroy(): void { this.stop(); }

//     // ----------------------------------------------------
//     // Animation control
//     // ----------------------------------------------------
//     public start(): void {
//         this.running = true;
//         const loop = () => {
//             if (!this.running) return;
//             this.update();
//             requestAnimationFrame(loop);
//         };
//         requestAnimationFrame(loop);
//     }

//     public stop(): void {
//         this.running = false;
//     }

//     public startAgain(): void {
//         this.reset()
//         this._prepareData();
//         this._createScales();
//         this._buildChart();
//         this.start();
//     }

//     public reset(): void {
//         this.stop();
//         this.tickFrame = 0;
//         this.particles = [];
//         if (this.g) {
//             this.g.selectAll('.particle').remove();
//             this.g.selectAll('.absolute').text(0);
//             this.g.selectAll('.percent').text('0%');
//         }
//         if (this.svg) {
//             this.svg.remove();
//             this.svg = undefined;
//         }
//         this.cache = {};
//         this.routes = [];
//         this.leaves = [];
//     }

//     // ----------------------------------------------------
//     // Animation update loop
//     // ----------------------------------------------------
//     private update(): void {
//         this.tickFrame++;
//         this._addParticlesMaybe(this.tickFrame);
//         this._updateCounters();

//         if (!this.g) return;
//         const allParticles = this.particles;
//         const sel = this.g.select('.particles-container')
//             .selectAll<SVGRectElement, any>('.particle')
//             .data(allParticles, d => d.id);

//         // ENTER: create new particle elements
//         sel.enter()
//             .append('rect')
//             .attr('class', 'particle')
//             .attr('opacity', 0.7)
//             .attr('fill', d => d.color)
//             .attr('width', this.psize)
//             .attr('height', this.psize)
//             .merge(sel as any)
//             .each((d, i, nodes) => {
//                 const localT = this.tickFrame - d.createdAt;
//                 d.pos = localT * d.speed;
//                 const routePoints = this.cache[d.target.path].points;
//                 const lastIndex = routePoints.length - 1;

//                 if (d.pos >= lastIndex) {
//                     d.pos = lastIndex;
//                     const finalPoint = routePoints[lastIndex];
//                     d3.select(nodes[i])
//                         .attr("x", finalPoint.x)
//                         .attr("y", finalPoint.y + d.offset - this.psize / 2)
//                         // Increase width and reduce height for a more pronounced, flatter band
//                         .attr("width", this.psize * 2)  // increased from 1.5 to 2
//                         .attr("height", this.psize * 0.4);  // reduced height
//                 } else {
//                     const idx = Math.floor(d.pos);
//                     const coo = routePoints[idx];
//                     const nextCoo = routePoints[idx + 1];
//                     if (coo && nextCoo) {
//                         const delta = d.pos - idx;
//                         const x = coo.x + (nextCoo.x - coo.x) * delta;
//                         const y = coo.y + (nextCoo.y - coo.y) * delta;
//                         const squeezeFactor = Math.max(0, this.psize - (routePoints[lastIndex].x - x));
//                         const h = Math.max(2, this.psize - squeezeFactor);
//                         const dx = squeezeFactor / 2;
//                         d3.select(nodes[i])
//                             .attr("x", x - dx)
//                             .attr("y", y + d.offset - this.psize / 2)
//                             .attr("width", this.psize + squeezeFactor)
//                             .attr("height", h);
//                     }
//                 }
//             });
//         sel.exit().remove();
//     }


//     // ----------------------------------------------------
//     // Build the diagram
//     // ----------------------------------------------------
//     private _buildChart(): void {
//         const container = this.chartContainer.nativeElement;
//         this.svg = d3.select(container)
//             .append('svg')
//             .attr('width', this.width)
//             .attr('height', this.height);

//         // Calculate extra vertical space and center the chart vertically
//         const extraSpace = this.height - this.computedHeight;
//         this.g = this.svg.append('g')
//             .attr('transform', `translate(${this.margin.left}, ${this.margin.top + extraSpace / 2})`);

//         // Draw the route paths
//         this.g.append('g')
//             .attr('class', 'routes')
//             .attr('fill', 'none')
//             .attr('stroke-opacity', 0.1)
//             .attr('stroke', '#eee')
//             .selectAll('path')
//             .data(this.routes)
//             .enter()
//             .append('path')
//             .attr('d', d => this._sankeyLinkCustom(d))
//             .attr('stroke-width', this.bandHeight);

//         // Container for particles
//         this.g.append('g').attr('class', 'particles-container');

//         // Add node labels
//         this.g.selectAll('.label')
//             .data(this.sankeyData.nodes)
//             .enter()
//             .append('g')
//             .attr('class', 'label')
//             .attr('transform', (d: any) => `translate(${d.x1 - this.bandHeight / 2}, ${d.y0 + this.bandHeight / 2})`)
//             .attr('dominant-baseline', 'middle')
//             .attr('text-anchor', 'end')
//             .call(g => g.append('text')
//                 .attr('stroke', 'white')
//                 .attr('stroke-width', 3)
//                 .text((d: any) => d.name)
//             )
//             .call(g => g.append('text')
//                 .attr('fill', '#444')
//                 .text((d: any) => d.name)
//             );

//         // Add counters for each leaf and group
//         const counterSel = this.g.selectAll('.counter')
//             .data(this.leaves)
//             .enter()
//             .append('g')
//             .attr('class', 'counter')
//             .attr('transform', d => `translate(${this.width - this.margin.left}, ${d.node.y0})`);

//         counterSel.each((leaf, i, nodes) => {
//             const sel = d3.select(nodes[i]);
//             sel.selectAll('.group')
//                 .data(this.groupKeys)
//                 .enter()
//                 .append('g')
//                 .attr('class', 'group')
//                 .attr('transform', (groupKey, idx) => `translate(${-idx * 60}, 0)`)
//                 .attr('text-anchor', 'end')
//                 .style('font-family', 'Menlo')
//                 .each((groupKey, j, groupNodes) => {
//                     if (i === 0) {
//                         d3.select(groupNodes[j])
//                             .append('text')
//                             .attr('dominant-baseline', 'hanging')
//                             .attr('fill', '#999')
//                             .style('font-size', 9)
//                             .style('text-transform', 'uppercase')
//                             .style('letter-spacing', 0.7)
//                             .style('transform', 'translate(0 , -20px')
//                             .text(groupKey);
//                     }
//                 })
//                 .call(g => g.append('text')
//                     .attr('class', 'absolute')
//                     .attr('fill', d => this.colorScale(d))
//                     .attr('font-size', 20)
//                     .attr('dominant-baseline', 'middle')
//                     .attr('y', this.bandHeight / 2 - 2)
//                     .text(0)
//                 )
//                 .call(g => g.append('text')
//                     .attr('class', 'percent')
//                     .attr('dominant-baseline', 'hanging')
//                     .attr('fill', '#999')
//                     .attr('font-size', 9)
//                     .attr('y', this.bandHeight / 2 + 9)
//                     .text('0%')
//                 );
//         });
//     }


//     // ----------------------------------------------------
//     // Data Preparation
//     // ----------------------------------------------------
//     private _prepareData(): void {
//         if (Object.keys(this.timeSeriesData).length > 0) {
//             Object.keys(this.timeSeriesData).forEach(nodeName => {
//                 this.cumulativeTargets[nodeName] = {};
//                 this.groupKeys.forEach(group => {
//                     let cumulative = 0;
//                     this.cumulativeTargets[nodeName][group] = this.timeSeriesData[nodeName].map((slot: any) => {
//                         cumulative += slot[group] || 0;
//                         return cumulative;
//                     });
//                 });
//             });
//             this.totalParticles = d3.sum(Object.keys(this.cumulativeTargets), nodeName => {
//                 return d3.sum(this.groupKeys, group => {
//                     const arr = this.cumulativeTargets[nodeName][group];
//                     return arr[arr.length - 1] || 0;
//                 });
//             });
//             this.targetsAbsolute = [];
//             Object.keys(this.timeSeriesData).forEach(nodeName => {
//                 this.timeSeriesData[nodeName].forEach((slot: any, idx: number) => {
//                     const slotTime = slot.time || slot.Time || '';
//                     this.groupKeys.forEach(group => {
//                         this.targetsAbsolute.push({
//                             name: nodeName,
//                             time: slotTime,
//                             slot: idx,
//                             group: group,
//                             value: slot[group] || 0,
//                             generated: 0
//                         });
//                     });
//                 });
//             });
//         } else {
//             const hierarchy = this._buildHierarchy(this.rawData);
//             const leavesArr = hierarchy.leaves();
//             this.targetsAbsolute = leavesArr.flatMap(leaf => {
//                 const d = leaf?.data;
//                 return d?.groups?.map((g: any) => ({
//                     name: d.name,
//                     path: d.path,
//                     group: g.key,
//                     value: g.value
//                 }));
//             });
//             this.totalParticles = d3.sum(this.targetsAbsolute, d => d?.value);
//         }

//         const { nodes, links } = this._buildNodeLinkArrays(this.rawData);
//         const dataForSankey = {
//             nodes: nodes.map(n => ({ ...n, fixedValue: 1 })),
//             links: links.map(l => ({ ...l, value: 0 }))
//         };

//         const hierarchy = this._buildHierarchy(this.rawData);
//         const leavesCount = hierarchy.leaves().length;
//         this.bandHeight = 80 - this.padding / 2;

//         // Compute the height based on data
//         const computedHeight = this.margin.top + this.margin.bottom +
//             leavesCount * (this.bandHeight + this.padding / 2) +
//             this.padding / 2;

//         // Store computed height for centering and use the larger value (e.g., provided height of 500)
//         this.computedHeight = computedHeight;
//         this.height = Math.max(this.height, computedHeight);

//         const sk = sankey<any, any>()
//             .nodeId(d => d.name)
//             .nodeAlign(sankeyJustify)
//             .nodeWidth(
//                 (this.width - this.margin.left - this.margin.right) /
//                 (hierarchy.height + 1) * this.curve
//             )
//             .nodePadding(this.padding)
//             .extent([
//                 [0, 0],
//                 [this.width - this.margin.left - this.margin.right,
//                 this.height - this.margin.top - this.margin.bottom]
//             ]);
//         this.sankeyData = sk(dataForSankey);
//         this.routes = this._buildRoutes(this.sankeyData);
//         const sankeyLeaves = this.sankeyData.nodes.filter((n: any) => n.sourceLinks.length === 0);
//         this.leaves = sankeyLeaves.map((n: any) => ({
//             node: n,
//             targets: this.targetsAbsolute.filter(t => t?.name === n?.name)
//         }));

//         // Assign target paths – fallback if not found
//         this.targetsAbsolute.forEach(t => {
//             const matchingNode = this.sankeyData.nodes.find((n: any) => n.name === t.name);
//             if (matchingNode) {
//                 t.path = matchingNode.path || matchingNode.data?.path || '';
//             }
//             if (!t.path) {
//                 t.path = `/Trucks/${t.name}`;
//             }
//         });
//     }


//     private _createScales(): void {
//         this.colorScale = d3.scaleOrdinal<string>()
//             .domain(this.groupKeys)
//             .range(["#FFCC33", "#33CCFF"]);
//         this.speedScale = d3.scaleLinear()
//             .range([this.speed, this.speed + 0.5]);
//         // Make offset symmetric so that the average offset is 0
//         this.offsetScale = d3.scaleLinear()
//             .range([-this.bandHeight / 2, this.bandHeight / 2]);
//     }


//     // ----------------------------------------------------
//     // Helpers to build hierarchy, nodes, links and routes
//     // ----------------------------------------------------
//     private _buildHierarchy(rawObj: any) {
//         const isLeaf = (obj: any) => this.groupKeys.every(k => typeof obj[k] === 'number');
//         function getChildren(nodeObj: any) {
//             const { name, ...rest } = nodeObj;
//             if (isLeaf(rest)) return undefined;
//             return Object.entries(rest).map(([k, v]: [string, any]) => ({ name: k, ...v }));
//         }
//         const rootObj = { name: 'Trucks', ...rawObj };
//         const root = d3.hierarchy(rootObj, getChildren.bind(this));
//         const absolutePath = (d: d3.HierarchyNode<any>): string =>
//             d.parent ? absolutePath(d.parent) + '/' + d.data.name : '/' + d.data.name;
//         root.each(d => {
//             const nodeData: any = {
//                 name: d.data.name,
//                 path: absolutePath(d)
//             };
//             if (isLeaf(d.data)) {
//                 nodeData.groups = this.groupKeys.map(k => ({
//                     key: k,
//                     value: d.data[k] || 0
//                 }));
//             }
//             d.data = nodeData;
//         });
//         return root;
//     }

//     private _buildNodeLinkArrays(rawObj: any) {
//         const isLeaf = (obj: any) => this.groupKeys.every(k => typeof obj[k] === 'number');
//         const nodes = new Set<string>(['Trucks']);
//         const links: Array<{ source: string; target: string }> = [];
//         function walk(source: string, sourceObj: any) {
//             for (const name in sourceObj) {
//                 links.push({ source, target: name });
//                 if (!isLeaf(sourceObj[name])) {
//                     walk(name, sourceObj[name]);
//                 }
//                 nodes.add(name);
//             }
//         }
//         walk('Trucks', rawObj);
//         return {
//             nodes: Array.from(nodes).map(name => ({ name })),
//             links
//         };
//     }

//     private _buildRoutes(sankeyData: any): any[] {
//         function walk(n: any): any[] {
//             const subroutes = n.sourceLinks.flatMap((d: any) => walk(d.target));
//             return subroutes.length ? subroutes.map((r: any) => [n, ...r]) : [[n]];
//         }
//         const root = sankeyData.nodes.find((x: any) => x.targetLinks.length === 0);
//         return walk(root);
//     }

//     private _sankeyLinkCustom(nodes: any[]): string {
//         if (!this.g) return '';
//         const offset = (this.routeAlign === 'top') ? 0 : this.bandHeight / 2;
//         const pathGen = d3.path();
//         nodes.forEach((n, i) => {
//             if (i === 0) {
//                 pathGen.moveTo(n.x0, n.y0 + offset);
//             }
//             pathGen.lineTo(n.x1, n.y0 + offset);
//             const next = nodes[i + 1];
//             if (next) {
//                 const w = next.x0 - n.x1;
//                 pathGen.bezierCurveTo(
//                     n.x1 + w / 2, n.y0 + offset,
//                     n.x1 + w / 2, next.y0 + offset,
//                     next.x0, next.y0 + offset
//                 );
//             }
//         });
//         const pathStr = pathGen.toString();
//         // Append the temporary path to the group (this.g) so that its coordinate space matches your drawn elements
//         const tmpPath = this.g.append('path')
//             .attr('d', pathStr)
//             .attr('visibility', 'hidden');
//         const totalLength = (tmpPath.node() as SVGPathElement).getTotalLength();
//         const points: { x: number; y: number }[] = [];
//         for (let l = 0; l < totalLength; l++) {
//             const pt = (tmpPath.node() as SVGPathElement).getPointAtLength(l);
//             points.push({ x: pt.x, y: pt.y });
//         }
//         // Instead of using the temporary path's last point,
//         // compute the endpoint directly from the nodes data.
//         // The drawn endpoint is (lastNode.x1, lastNode.y0 + offset)
//         const lastNode = nodes[nodes.length - 1];
//         const computedEndpoint = { x: lastNode.x1, y: lastNode.y0 + offset };
//         points.push(computedEndpoint);

//         const routeKey = '/' + nodes.map((n: any) => n.name).join('/');
//         this.cache[routeKey] = { points };

//         tmpPath.remove();
//         return pathStr;
//     }





//     // ----------------------------------------------------
//     // Particle generation & counters
//     // ----------------------------------------------------
//     private _addParticlesMaybe(frame: number): void {
//         const elapsedMs = (frame / 60) * 1000;
//         const slotDurationMs = this.totalAnimationDuration / 24; // e.g., 60000/24 = 2500 ms per slot
//         const currentSlot = Math.min(Math.floor(elapsedMs / slotDurationMs), 23);
//         const needed = Math.round(Math.random() * this.density);

//         for (let i = 0; i < needed; i++) {
//             const eligibleTargets = this.targetsAbsolute.filter(t => t.value > 0);
//             if (eligibleTargets.length === 0) break;
//             const target = eligibleTargets[Math.floor(Math.random() * eligibleTargets.length)];
//             if (!target.path || !this.cache[target.path]) continue;
//             if (target.generated === undefined) target.generated = 0;
//             if (target.generated >= target.value) continue;

//             const length = this.cache[target.path].points.length;
//             // Use a cycling counter to assign a slot so that particles cover the full range of speeds
//             const slotIndex = (target.slot !== undefined) ? target.slot : (this.particleCounter % 24);
//             this.particleCounter++;

//             // For slot 0, finish time is 2500 ms; for slot 23, finish time is 60000 ms (or adjusted accordingly)
//             const desiredFinishTimeMs = (slotIndex + 1) * slotDurationMs;
//             const totalSlotFrames = desiredFinishTimeMs / (1000 / 60);
//             const randomFactor = 0.9 + Math.random() * 0.2;
//             const particleSpeed = (length / totalSlotFrames) * randomFactor;

//             const particle = {
//                 id: `${frame}_${i}`,
//                 speed: particleSpeed,
//                 color: this.colorScale(target.group),
//                 offset: this.offsetScale(Math.random()),
//                 pos: 0,
//                 createdAt: frame,
//                 length,
//                 target,
//                 slot: slotIndex // for debugging if needed
//             };
//             this.particles.push(particle);
//             target.generated++;
//         }
//     }

//     private _updateCounters(): void {
//         if (!this.g) return;
//         this.g.selectAll<SVGGElement, any>('.counter')
//             .each((leaf, i, nodes) => {
//                 const sel = d3.select(nodes[i]);
//                 sel.selectAll<SVGGElement, any>('.group')
//                     .each((groupKey, j, groupNodes) => {
//                         const count = this.particles.filter(
//                             p =>
//                                 p.target.name === leaf.node.name &&
//                                 p.target.group === groupKey &&
//                                 p.pos >= (p.length - 1)
//                         ).length;
//                         d3.select(groupNodes[j]).select('.absolute').text(count);
//                         d3.select(groupNodes[j]).select('.percent')
//                             .text(d3.format('.0%')(count / this.totalParticles));
//                     });
//             });
//     }
// }
