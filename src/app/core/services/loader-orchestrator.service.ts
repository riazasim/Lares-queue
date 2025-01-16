import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';


@Injectable({
  providedIn: 'root'
})
export class LoaderOrchestratorService {

  private readonly showLoaderSubject = new Subject<boolean>();

  public showLoader(): void {
    this.showLoaderSubject.next(true);
  }

  public hideLoader(): void {
    this.showLoaderSubject.next(false);
  }

  public getLoaderStatus(): Observable<boolean> {
    return this.showLoaderSubject.asObservable();
  }

}
