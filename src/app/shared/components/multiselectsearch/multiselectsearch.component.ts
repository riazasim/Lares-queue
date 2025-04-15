import { Component, ElementRef, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { FormControl } from '@angular/forms';
import { MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';
import { MatChipInputEvent } from '@angular/material/chips';
import { map, Observable, startWith } from 'rxjs';
import { COMMA, ENTER } from '@angular/cdk/keycodes';
import { LocationModel } from 'src/app/core/models/location.model';
import { IconProp } from '@fortawesome/fontawesome-svg-core';

/**
 * This components receives an array of objects
 * 
 * @return {number[]} an array of ids from objects
 */
@Component({
  selector: 'app-multiselectsearch',
  templateUrl: './multiselectsearch.component.html',
  styleUrls: ['./multiselectsearch.component.scss']
})
export class MultiselectsearchComponent implements OnInit {
  @Input() data: any[] = [];
  @Input() field: string;
  @Input() entries: any[] = [];
  @Input() placeholder: string;
  @Input()
  public leftIcon: IconProp | undefined;
  @Input()
  public rightIcon: IconProp | undefined;
  separatorKeysCodes: number[] = [ENTER, COMMA];
  fruitCtrl = new FormControl('');
  filteredFruits: Observable<any[]>;
  items: any[] = []
  @Output() setValue : EventEmitter<number[]> = new EventEmitter<number[]>();

  @ViewChild('fruitInput') fruitInput: ElementRef<HTMLInputElement>;

  constructor() {
    this.filteredFruits = this.fruitCtrl.valueChanges.pipe(
      startWith(null as any),
      map((name: string | null) => (name ? this._filter(name) : this.data.slice())),
    );
  }

  ngOnInit(): void {
    if (this.entries) {
      this.items = [...this.entries]
    }
  }

  add(event: MatChipInputEvent): void {
    const value: LocationModel = event.value as any

    // Add our fruit
    if (value && value.id) {
      this.items.push(value);
    }

    // Clear the input value
    event.chipInput!.clear();

    this.fruitCtrl.setValue(null);
    if (this.items.length) {
      this.setValue.emit(this.items.map(el => el.id));
    }
  }

  remove(index: number): void {

    if (index >= 0) {
      this.items.splice(index, 1);
    }
  }

  selected(event: MatAutocompleteSelectedEvent): void {
    if (!this.items.find(el => el.id === event.option.value.id)) {
      this.items.push(event.option.value);
    }
    this.fruitInput.nativeElement.value = '';
    this.fruitCtrl.setValue(null);
    if (this.items.length) {
      this.setValue.emit(this.items.map(el => el.id));
    }
  }

  private _filter(value: string): LocationModel[] {
    if (typeof value === 'string') {
      const filterValue = value.toLowerCase();
  
      return this.data.filter(item => item[this.field].toLowerCase().includes(filterValue));
    }

    return this.data
  }
}
