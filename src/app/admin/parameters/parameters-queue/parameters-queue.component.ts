import { Component, ElementRef, ViewChild, OnInit, HostListener, EventEmitter, Output, ChangeDetectorRef } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Color, LegendPosition, ScaleType } from '@swimlane/ngx-charts';
import { debounceTime, distinctUntilChanged } from 'rxjs';
import { ParametersQueueService } from 'src/app/core/services/parameters-queue.service';
import { handleError } from 'src/app/shared/utils/error-handling.function';
import { numDecimal } from 'src/app/shared/utils/num-decimal.function';
import { createRequiredValidators } from 'src/app/shared/validators/generic-validators';

@Component({
  selector: 'app-parameters-queue',
  templateUrl: './parameters-queue.component.html',
  styleUrls: ['./parameters-queue.component.scss']
})
export class ParametersQueueComponent implements OnInit {
  queueForm: FormGroup;
  orderRandomizationForm: FormGroup;
  @ViewChild('slider') slider: ElementRef<HTMLInputElement>;
  @Output() nextTab = new EventEmitter<void>();
  public readonly legendPosition: LegendPosition = LegendPosition.Right;
  private minRange = -12;
  private maxRange = 4;
  private totalRange = this.maxRange - this.minRange;
  booking: any;
  queueSettings: any;
  minValue = this.valueToPercent(-3);
  maxValue = this.valueToPercent(1);
  numDecimalUtil = numDecimal;
  activeHandle: 'min' | 'max' | null = null;
  rangeNumbers = Array.from({ length: 17 }, (_, i) => i - 12);
  series = [
    { name: "Early", value: 0, color: "#FFD700" },
    { name: "Late", value: 0, color: "#1E90FF" },
    { name: "Not Arrived", value: 0, color: "#FF4081" },
    { name: "On Time", value: 0, color: "#20C997" }
  ];
  totalTrucks: number = 0;
  // totalTrucks: number = this.series.reduce((sum, item) => sum + item.value, 0);
  colorScheme: Color = {
    domain: this.series.map(item => item.color),
    name: 'customScheme',
    selectable: true,
    group: ScaleType.Ordinal
  };

  constructor(
    private fb: FormBuilder,
    private parametersQueueService: ParametersQueueService,
    private snackBar: MatSnackBar,
    private cd: ChangeDetectorRef) { }

  ngOnInit() {
    this.initForm();
  }

  initData() {
    this.initForm();
    this.getParameterQueueSetting();
  }

  initForm(): void {
    this.queueForm = this.fb.group({
      accessWindow: this.fb.group({
        start: [this.percentToValue(this.minValue), [...createRequiredValidators()]],
        end: [this.percentToValue(this.maxValue), [...createRequiredValidators()]],
      }),
      arrivalConformity: this.fb.group({
        early: [0, [...createRequiredValidators(), Validators.max(100), Validators.min(0)]],
        late: [0, [...createRequiredValidators(), Validators.max(100), Validators.min(0)]],
        notArrived: [0, [...createRequiredValidators(), Validators.max(100), Validators.min(0)]],
        onTime: [0, [...createRequiredValidators(), Validators.max(100), Validators.min(0)]],
      }),
      orderRandomization: this.fb.group({
        MPS: [0, [...createRequiredValidators(), Validators.max(100), Validators.min(0)]],
        WPS: [0, [...createRequiredValidators(), Validators.max(100), Validators.min(0)]],
      })
    });

    this.queueForm.get('accessWindow.start')?.valueChanges.subscribe(startTime => {
      this.minValue = this.valueToPercent(startTime);
    });

    this.queueForm.get('accessWindow.end')?.valueChanges.subscribe(endTime => {
      this.maxValue = this.valueToPercent(endTime);
    });

    this.queueForm.valueChanges.pipe(
      debounceTime(500),
      distinctUntilChanged()
    ).subscribe(values => {
      this.updateFields(values);
      this.checkErrors();
    });

    this.queueForm.get('mostProbableScenario')?.valueChanges.subscribe(value => {
      const newMin = value + 1;
      const worstCaseControl = this.queueForm.get('worstCaseScenario');
      if (worstCaseControl) {
        worstCaseControl.setValidators([...createRequiredValidators(), Validators.max(100), Validators.min(newMin)]);
        worstCaseControl.updateValueAndValidity();
      }
    });
  }

  getParameterQueueSetting() {
    this.parametersQueueService.getBookingCounts().subscribe({
      next: (response) => {
        this.booking = response;
        this.totalTrucks = this.booking; // Set totalTrucks to booking
        this.series[3].value = this.totalTrucks;
        this.updateChartData(this.queueForm.value);
        console.log('Booking Loaded:', this.booking);
      },
      error: (error) => console.error('Failed to load queue settings:', error)
    });
  }

  // SLider related methods

  generateIndexLabels(): string[] {
    const labels = [];
    for (let i = -12; i <= 4; i++) {
      labels.push(i.toString());
    }
    return labels;
  }

  getTooltipPosition(value: number): string {
    const threshold = 10;
    if (value <= threshold) {
      return 'tooltip-left';
    } else if (value >= 100 - threshold) {
      return 'tooltip-right';
    }
    return '';
  }


  valueToPercent(value: number): number {
    return ((value - this.minRange) / this.totalRange) * 100;
  }

  // Converts percentage (0 to 100) to real value (-12 to +4)
  percentToValue(percent: number): number {
    return Math.round(this.minRange + (percent / 100) * this.totalRange) < 0 ? Math.round(this.minRange + (percent / 100) * this.totalRange) * -1 : Math.round(this.minRange + (percent / 100) * this.totalRange);
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
      this.queueForm.patchValue({ accessWindow: { start: this.percentToValue(percent) } });
    } else {
      this.maxValue = percent;
      this.queueForm.patchValue({ accessWindow: { end: this.percentToValue(percent) } });
    }
  }

  @HostListener('document:mouseup')
  onMouseUp() {
    this.activeHandle = null;
  }

  startDrag(event: MouseEvent, handle: 'min' | 'max') {
    this.activeHandle = handle;
    event.preventDefault();
  }

  get minValueDisplay(): number {
    return this.percentToValue(this.minValue);
  }

  get maxValueDisplay(): number {
    return this.percentToValue(this.maxValue);
  }

  // Chart related methods

  updateFields(values: any) {
    const totalPercentage = 100;
    let filledTotal = ['early', 'late', 'notArrived'].reduce((acc, key) => {
      return acc + (values.arrivalConformity[key] ? parseInt(values.arrivalConformity[key], 10) : 0);
    }, 0);

    if (filledTotal > totalPercentage) {
      alert('The total percentage cannot exceed 100%. Please adjust the values.');
      return;
    }

    let remaining = totalPercentage - filledTotal;
    if (remaining >= 0) {
      this.queueForm.patchValue({
        arrivalConformity: { onTime: remaining }
      }, { emitEvent: false });
    } else {
      alert('The total percentage exceeds 100%. Please adjust the values.');
      return;
    }
    this.updateChartData(values);
  }

  updateChartData(values: any) {
    console.log(values)
    const totalPercentage = 100;
    let filledTotal = ['early', 'late', 'notArrived'].reduce((acc, key) => acc + (values.arrivalConformity[key] ? parseInt(values.arrivalConformity[key], 10) : 0), 0);
    let remaining = totalPercentage - filledTotal;

    this.series = [
      { name: "Early", value: Math.round(this.totalTrucks * (values.arrivalConformity.early / 100)), color: "#FFD700" },
      { name: "Late", value: Math.round(this.totalTrucks * (values.arrivalConformity.late / 100)), color: "#1E90FF" },
      { name: "Not Arrived", value: Math.round(this.totalTrucks * (values.arrivalConformity.notArrived / 100)), color: "#FF4081" },
      { name: "On Time", value: Math.round(this.totalTrucks * (remaining / 100)), color: "#20C997" }
    ];

    this.colorScheme = {
      domain: this.series.map(s => s.color),
      name: 'customScheme',
      selectable: true,
      group: ScaleType.Ordinal
    };

    this.cd.detectChanges();
  }

  checkErrors() {
    const mostProbableControl = this.queueForm.get('orderRandomization.MPS');
    const worstCaseControl = this.queueForm.get('orderRandomization.WPS');
    if (!mostProbableControl || !worstCaseControl) return;

    const mostProbableValue = mostProbableControl.value;
    const worstCaseValue = worstCaseControl.value;

    if (
      mostProbableControl.invalid &&
      (mostProbableControl.hasError('max') || mostProbableControl.hasError('min'))
    ) {
      alert('Most Probable Scenario value must be between 0 and 50.');
    }

    if (
      worstCaseControl.invalid &&
      (worstCaseControl.hasError('max') || worstCaseControl.hasError('min') || worstCaseValue <= mostProbableValue)
    ) {
      alert('Worst Case Scenario value must be greater than Most Probable Scenario.');
    }
  }

  updateWorstCaseScenario() {
    const mostProbable = parseInt(this.orderRandomizationForm.get('orderRandomization.MPS')?.value, 10) || 0;
    const remaining = 100 - mostProbable;
    this.orderRandomizationForm.patchValue({
      worstCaseScenario: remaining >= 0 ? remaining : 0
    }, { emitEvent: false });
  }

  next() {
    // const parameterQueueData = { ...this.queueForm.getRawValue(), ...this.orderRandomizationForm.getRawValue() };
    const parameterQueueData = this.queueForm.getRawValue();
    this.parametersQueueService.setParams(parameterQueueData).subscribe({
      next: () => {
        this.nextTab.emit();
      },
      error: (error: any) => {
        console.error('Error during creation:', error);
        handleError(this.snackBar, error);
      }
    });
  }
}
