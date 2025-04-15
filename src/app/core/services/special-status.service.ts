import { Injectable } from '@angular/core';
import { SpecialStatusModel } from '../models/special-status.model';
import { BehaviorSubject, Subscription } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SpecialStatusService {
  private data: SpecialStatusModel[];
  subscription: Subscription;
  public specialStatusSource: BehaviorSubject<SpecialStatusModel[]> = new BehaviorSubject<SpecialStatusModel[]>([
    {
      id: '1',
      name: 'Howard Owen',
      status: true,
      address: '123 Main St',
      phone: '123-456-7890',
      email: 'test@mail.com'
    },
    {
      id: '2',
      name: 'Howard Owen2',
      status: true,
      address: '123 Main St',
      phone: '123-456-7890',
      email: 'test@mail.com'
    },
  ]);

  constructor() {
    this.subscription = this.specialStatusSource.subscribe(el => this.data = el)

  }

  ngOnInit() {
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

  create(status: SpecialStatusModel) {
    const item: SpecialStatusModel = {
      ...status,
      id: (Number(this.data.length) + 1).toString()
    };
    this.data.push(item);
    this.specialStatusSource.next(this.data)
  }

  edit(data: SpecialStatusModel) {
    for(let i = 0; i < this.data.length; i++) {
      if(data.id === this.data[i].id) {
        this.data[i] = data;
      }
    }
    this.specialStatusSource.next(this.data)
  }

  delete(id: string) {
    this.data = this.data.filter(el => el.id !== id);
    this.specialStatusSource.next(this.data);
  }

  deleteByName(name: string) {
    this.data = this.data.filter(el => el.name !== name);
    this.specialStatusSource.next(this.data);
  }

  getStatusById(id: string) {
    for(let i = 0; i < this.data.length; i++) {
      if(id === this.data[i].id) {
        return this.data[i];
      }
    }
    return null;
  }

  get() {
    return this.specialStatusSource.asObservable();
  }
}
