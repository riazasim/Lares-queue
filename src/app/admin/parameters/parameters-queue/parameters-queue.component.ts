import { Component, ElementRef, ViewChild, OnInit, HostListener } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { Color, LegendPosition, ScaleType } from '@swimlane/ngx-charts';

@Component({
  selector: 'app-parameters-queue',
  templateUrl: './parameters-queue.component.html',
  styleUrls: ['./parameters-queue.component.scss']
})
export class ParametersQueueComponent implements OnInit {
  @ViewChild('slider') slider: ElementRef<HTMLInputElement>;
  public readonly legendPosition: LegendPosition = LegendPosition.Right;
  private minRange = -12;  // New Minimum Value
  private maxRange = 4;    // New Maximum Value
  private totalRange = this.maxRange - this.minRange; // Total Range

  minValue = this.valueToPercent(-3); // Initial Min Handle at -3
  maxValue = this.valueToPercent(1);  // Initial Max Handle at 1
  activeHandle: 'min' | 'max' | null = null;
  mostProbable: number = 30;
  worstCase: number = 70;
  rangeNumbers = Array.from({ length: 17 }, (_, i) => i - 12); // Generates numbers from -12 to 4
  // colorScheme: Color = {
  //   domain: ['#5AA454', '#A10A28', '#C7B42C', '#AAAAAA'],
  //   group: 'Ordinal',
  //   selectable: true,
  // }  
  series = [
    { name: "Early", value: 820, color: "#FFD700" }, // Yellow
    { name: "Late", value: 328, color: "#1E90FF" },  // Blue
    { name: "Not Arrived", value: 163, color: "#FF4081" }, // Pink
    { name: "On Time", value: 1967, color: "#20C997" } // Green
  ];

  constructor(private router: Router, private route: ActivatedRoute) {}

  ngOnInit() {}

  generateIndexLabels(): string[] {
    const labels = [];
    for (let i = -12; i <= 4; i++) {
      labels.push(i.toString());  // Directly use the index as the label
    }
    return labels;
  }

  getTooltipPosition(value: number): string {
    const threshold = 10; // Adjust this threshold based on your slider width
    if (value <= threshold) {
      return 'tooltip-left';
    } else if (value >= 100 - threshold) {
      return 'tooltip-right';
    }
    return '';
  }

  totalTrucks: number = this.series.reduce((sum, item) => sum + item.value, 0);

  colorScheme: Color = {
    domain: this.series.map(item => item.color),
    name: 'customScheme',
    selectable: true,
    group: ScaleType.Ordinal
  };

  pieChartLabel(series: any[], name: string): string {
    const item = series.find(data => data.name === name);
    return item ? item.value.toString() : name;
  }

  onSelect(event: any) {
    console.log(event);
  }

  valueToPercent(value: number): number {
    return ((value - this.minRange) / this.totalRange) * 100;
  }

  // Converts percentage (0 to 100) to real value (-12 to +4)
  percentToValue(percent: number): number {
    return Math.round(this.minRange + (percent / 100) * this.totalRange);
  }

  @HostListener('document:mousemove', ['$event'])
  onMouseMove(event: MouseEvent) {
    if (!this.activeHandle) return;

    const container = document.getElementById('slider-container')!;
    const rect = container.getBoundingClientRect();
    let percent = ((event.clientX - rect.left) / rect.width) * 100;
    percent = Math.max(0, Math.min(percent, 100));

    if (this.activeHandle === 'min' && percent > this.maxValue) {
      percent = this.maxValue;
    } else if (this.activeHandle === 'max' && percent < this.minValue) {
      percent = this.minValue;
    }

    if (this.activeHandle === 'min') {
      this.minValue = percent;
    } else {
      this.maxValue = percent;
    }
  }

  @HostListener('document:mouseup')
  onMouseUp() {
    this.activeHandle = null;
  }

  startDrag(event: MouseEvent, handle: 'min' | 'max') {
    this.activeHandle = handle;
    event.preventDefault(); // Prevent default drag behavior
  }

  // Get the actual value for display
  get minValueDisplay(): number {
    return this.percentToValue(this.minValue);
  }

  get maxValueDisplay(): number {
    return this.percentToValue(this.maxValue);
  }

  next() {
    this.router.navigate(['../queue'], { relativeTo: this.route });
  }
}
