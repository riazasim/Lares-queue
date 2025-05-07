import { Component, OnInit, ViewChild } from '@angular/core';
import { WorstCaseComponent } from './worst-case/worst-case.component';

@Component({
  selector: 'app-showcase',
  templateUrl: './showcase.component.html',
  styleUrls: ['./showcase.component.scss']
})
export class ShowcaseComponent implements OnInit {
  selectedIndex = 0;

  constructor() { }

  ngOnInit(): void { }

  onTabChange(index: number): void {
    this.selectedIndex = index;
  }
}
