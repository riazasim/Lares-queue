import { Component, OnInit, ViewChild } from '@angular/core';
import { WorstCaseComponent } from './worst-case/worst-case.component';

@Component({
  selector: 'app-showcase',
  templateUrl: './showcase.component.html',
  styleUrls: ['./showcase.component.scss']
})
export class ShowcaseComponent implements OnInit {
  @ViewChild(WorstCaseComponent) worstCaseComponent!: WorstCaseComponent;
  selectedIndex = 0;

  constructor() {}

  ngOnInit(): void {}

  onTabChange(index: number): void {
    this.selectedIndex = index;
    if (index === 1) {
      this.worstCaseComponent?.initData();
    }
  }
}
