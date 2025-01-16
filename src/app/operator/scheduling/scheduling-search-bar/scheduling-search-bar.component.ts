import { ChangeDetectionStrategy, Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';
import { FormControl } from '@angular/forms';
import { BehaviorSubject, debounceTime, distinctUntilChanged, switchMap } from 'rxjs';

export enum FilterTypeENum {
  sId = 1,
  truckLicensePlateFront = 2,
  truckLicensePlateBack = 3,
  dockName = 4,
  status = 5,
  timeSlot = 6
}

export type FilterModel = {
  prev?: FilterTypeENum, 
  curr: FilterTypeENum
}

@Component({
  selector: 'app-scheduling-search-bar',
  templateUrl: './scheduling-search-bar.component.html',
  styles: [':host { width: 100%; }'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SchedulingSearchBarComponent implements OnInit, OnChanges {
  searchValue: FormControl = new FormControl();
  @Input() isLoading: boolean;
  @Input() disabled: boolean;
  @Output() emitFilterChange: EventEmitter<{ key: FilterModel, value: string }> = new EventEmitter();
  @Output() 
  readonly selectedFilter$: BehaviorSubject<FilterModel> = new BehaviorSubject<FilterModel>({ curr: FilterTypeENum.sId });
  constructor() {}

  ngOnInit(): void {
    this.searchValue.valueChanges.pipe(
      debounceTime(500),
      distinctUntilChanged(),
      switchMap((value) => {

        this.emitFilterChange.emit({ key: this.selectedFilter$.getValue(), value })
        return value;
      })
    ).subscribe();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (this.disabled || this.isLoading) {
      this.searchValue.disable();
    } else {
      this.searchValue.enable();
    }
  }

  setFilter(filter: FilterTypeENum): void {
    const prev = this.selectedFilter$.getValue().curr;
    const curr = filter;

    this.selectedFilter$.next({ prev, curr });
    this.emitFilterChange.emit({ key: { prev, curr }, value: this.searchValue.value });
  }
}
