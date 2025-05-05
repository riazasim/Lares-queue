import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ToggleNavigationMenuService {

  constructor() { }

  setItem(value: boolean) {
    return localStorage.setItem('isCollapsed', JSON.stringify(value));
  }

  getItem(){
    return JSON.parse(<string>localStorage.getItem("isCollapsed"));
  }
}
