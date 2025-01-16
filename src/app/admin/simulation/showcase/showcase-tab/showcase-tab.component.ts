import { AfterViewInit, Component, ElementRef, Input, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import * as d3 from 'd3';

@Component({
  selector: 'app-showcase-tab',
  templateUrl: './showcase-tab.component.html',
  styleUrls: ['./showcase-tab.component.scss']
})
export class ShowcaseTabsComponent implements AfterViewInit{
  @ViewChild('sigmoidSvg', { static: true }) svgElement!: ElementRef;
  @Input() Headers: any[] = [];
  @Input() Classes: any[] = [];
  sliderValue: number = 300; // Default slider value
  hours: string = '05'; // Initial hours
  minutes: string = '00'; // Initial minutes
  constructor(
    private readonly router: Router,
            private readonly route: ActivatedRoute,
  ) { }

  ngAfterViewInit() {
    this.drawSigmoidAnimation();
  }

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

  drawSigmoidAnimation() {
    // Data Generation Functions
    function sigmoid(xFrom: number, xTo: number, yFrom: number, yTo: number, scale = 5, n = 100) {
      const x = d3.range(-scale, scale, (2 * scale) / n);
      const y = x.map(v => Math.exp(v) / (Math.exp(v) + 1));
      return x.map((v, i) => ({
        x: ((v + scale) / (scale * 2)) * (xTo - xFrom) + xFrom,
        y: y[i] * (yTo - yFrom) + yFrom,
      }));
    }

    function generateData(nPoints = 50) {
      return Array.from({ length: nPoints }, () => ({
        from: 4,
        to: Math.floor(Math.random() * (4 - 1 + 1) + 1),
        color: Math.random() > 0.5 ? "A" : "B",
      }));
    }

    // Initialize Variables
    const nPoints = 50;
    const data = generateData(nPoints);
    const width = 800, height = 300;
    const svg = d3.select(this.svgElement.nativeElement)
      .attr("width", width)
      .attr("height", height);

    // Map through data to create points
    const pointData = data.flatMap((d, idx) => {
      const sig = sigmoid(0, 1, d.from, d.to, 10, 50);
      return sig.map((point, time) => ({
        ...point,
        color: d.color,
        time: time + idx,
        id: idx,
        y: point.y + (Math.random() * 0.5 - 0.25), // Random offset for y
      }));
    });

    // Create scales
    const xScale = d3.scaleLinear().domain([0, 1]).range([50, width - 50]);
    const yScale = d3.scaleLinear().domain([0, 4]).range([height - 50, 50]);

    // Bind data to points
    const dots = svg.selectAll("circle")
      .data(pointData)
      .enter()
      .append("circle")
      .attr("cx", d => xScale(d.x))
      .attr("cy", d => yScale(d.y))
      .attr("r", 5)
      .attr("fill", d => (d.color === "A" ? "#facc15" : "#3b82f6"))
      .style("opacity", 0);

    // Animation Logic
    const maxTime = d3.max(pointData, d => d.time)!;
    let currentTime = 0;

    function animate() {
      dots.filter(d => d.time === currentTime)
        .transition()
        .duration(200)
        .style("opacity", 1)
        .attr("cx", d => xScale(d.x))
        .attr("cy", d => yScale(d.y));

      currentTime++;
      if (currentTime <= maxTime) {
        requestAnimationFrame(animate);
      }
    }

    // Start Animation
    animate();

    // Optional: Add Labels for counts
    function addLabels(frameTime: number) {
      const count = pointData.filter(d => d.time <= frameTime).length;
      svg.selectAll(".label")
        .data([count])
        .join("text")
        .attr("class", "label")
        .attr("x", 10)
        .attr("y", 30)
        .text(`Follow the lives of ${count} squares`)
        .style("font-size", "20px")
        .style("fill", "black");
    }

    // Call addLabels periodically during animation
    setInterval(() => addLabels(currentTime), 200);
  }

next(){
  this.router.navigate(['../../reports'], { relativeTo: this.route });
}

}
