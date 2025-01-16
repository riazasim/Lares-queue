import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { StatusListService } from '../../../core/services/status-list.service';
import { StatusListModel, StatusTypeEnum } from '../../../core/models/status-list.model';
import { BehaviorSubject } from 'rxjs';
import { createRequiredValidators } from 'src/app/shared/validators/generic-validators';

@Component({
  selector: 'app-status-add-edit',
  templateUrl: './status-add-edit.component.html',
})
export class StatusAddEditComponent implements OnInit {
  isLoading$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(true);
  statusForm: FormGroup;
  statusLists: StatusListModel[] = [];
  status: StatusListModel | null;
  id: number;
  isSid: boolean;
  statusType: StatusTypeEnum = StatusTypeEnum.UNKNOWN;

  constructor(private fb: FormBuilder,
              private route: ActivatedRoute,
              private router: Router,
              private statusListService: StatusListService) {
  }

  ngOnInit(): void {
    this.decideStatus();
    this.subscribeForQueryParams();
  }

  subscribeForQueryParams(): void {
    this.id = this.route.snapshot.params['id'];
    // console.log(this.id)
    if (this.id) {
      switch (this.statusType) {
        case StatusTypeEnum.SID:
          this.statusListService.getSid(this.id).subscribe(response => {
            this.initForm(response);
            this.isLoading$.next(false);
          })
          break;
        case StatusTypeEnum.GOODS:
          this.statusListService.getGoods(this.id).subscribe(response => {
            this.initForm(response);
            this.isLoading$.next(false);
          })
          break;
      }
    } else {
      this.initForm();
      this.isLoading$.next(false);
    }
  }

  initForm(data: StatusListModel = <StatusListModel>{}): void {
    const color = this.id && data?.color.startsWith('#') ? data.color :
                  this.id && !data.color.startsWith('#') ? this.transformHex(data.color) : '';
    this.statusForm = this.fb.group({
      name: this.fb.control(data?.name || '', [...createRequiredValidators()]),
      color: this.fb.control(color, [...createRequiredValidators()]),
      description: this.fb.control(data?.description || '', [...createRequiredValidators()]),
    });
  }

  transformHex(stringColor: string) {
    const ctx = document.createElement('canvas').getContext('2d');
    (ctx as any).fillStyle = stringColor;
    return (ctx as any).fillStyle;
  }

  saveList(): void {
    this.isLoading$.next(true);
    if (this.id) {
      switch (this.statusType) {
        case StatusTypeEnum.SID:
          this.statusListService.editSid(this.id, this.statusForm.getRawValue()).subscribe(() => {
            this.isLoading$.next(false);
            this.router.navigate(['../../success'], { relativeTo: this.route });
          });
          break;
        case StatusTypeEnum.GOODS:
          this.statusListService.editGoods(this.id, this.statusForm.getRawValue()).subscribe(() => {
            this.isLoading$.next(false);
            this.router.navigate(['../../success'], { relativeTo: this.route });
          });
          break;
      }
    } else {
      switch (this.statusType) {
        case StatusTypeEnum.SID:
          this.statusListService.createSid(this.statusForm.getRawValue()).subscribe(() => {
            this.isLoading$.next(false);
            this.router.navigate(['../success'], { relativeTo: this.route });
          });
          break;
        case StatusTypeEnum.GOODS:
          this.statusListService.createGoods(this.statusForm.getRawValue()).subscribe(() => {
            this.isLoading$.next(false);
            this.router.navigate(['../success'], { relativeTo: this.route });
          });
          break;
      }
    }

  }

  private decideStatus(): void {
    const isSid = this.route.snapshot.queryParams['type'] === 'sid';
    const isGoods = this.route.snapshot.queryParams['type'] === 'goods';
    this.statusType = StatusTypeEnum.SID;
    // switch(true) {
    //   case isSid: this.statusType = StatusTypeEnum.SID; break;
    //   case isGoods: this.statusType = StatusTypeEnum.GOODS; break;
    //   default: this.statusType = StatusTypeEnum.UNKNOWN; break;
    // }
  }

}

