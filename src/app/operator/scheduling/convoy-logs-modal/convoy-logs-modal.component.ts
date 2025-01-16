import { animate, style, transition, trigger } from '@angular/animations';
import { ChangeDetectionStrategy, Component, Input, OnChanges } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatSidenav } from '@angular/material/sidenav';
import { BehaviorSubject } from 'rxjs';
import { PlanningService } from 'src/app/core/services/planning.service';
import { OpenImageModalComponent } from 'src/app/shared/components/open-image-modal/open-image-modal.component';
import { MatTableDataSource } from '@angular/material/table';
import html2canvas from 'html2canvas';
import jspdf from 'jspdf';

@Component({
    selector: 'convoy-logs-modal',
    templateUrl: './convoy-logs-modal.component.html',
    styleUrls: ['./convoy-logs-modal.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
    animations: [
        trigger('slideOut', [
            transition(':leave', [
                animate('200ms ease-in', style({ transform: 'translateX(-100%)' }))
            ])
        ]),
        trigger('slideIn', [
            transition(':enter', [
                style({ transform: 'translateX(-100%)' }),
                animate('200ms ease-in', style({ transform: 'translateX(0%)' }))
            ])
        ])
    ]
})
export class ConvoyLogsModal implements OnChanges {
    isLoading$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
    @Input() id: number;
    @Input() modal: string;
    @Input() sidenav: MatSidenav;
    @Input() planning$: BehaviorSubject<any | null>;
    userIds: any[] = [];
    planning: any;
    shipmentLogs: any[];
    step$: BehaviorSubject<number> = new BehaviorSubject<number>(1);
    displayedColumns: string[] = ['select', 'name'];
    transferData: any[];
    dataSource: MatTableDataSource<any>
    selection: any;
    userRole : string;
    selectedRole : string;

    constructor(
        private readonly planningService: PlanningService,
        private readonly dialog: MatDialog,
        private window: Window
    ) {}

    printPage(){
        this.window.print();
    }

    convertToPDF(){  
        var data = document.getElementById('content')!;
        html2canvas(data).then(canvas => {  
            var imgWidth = 208;   
            var pageHeight = 295;    
            var imgHeight = canvas.height * imgWidth / canvas.width;  
            var heightLeft = imgHeight;  
    
            const contentDataURL = canvas.toDataURL('image/png')  
            let pdf = new jspdf('p', 'mm', 'a4'); // A4 size page of PDF  
            var position = 0;  
            pdf.addImage(contentDataURL, 'PNG', 0, position, imgWidth, imgHeight)  
            pdf.save('SID-logs.pdf');   
        });  
    }

    ngOnChanges(): void {
        this.retrieveLogHistory();
    }

    openImageModal(image: string): void {
        this.dialog.open(OpenImageModalComponent, {
            data: image
        });
    }

    retrieveLogHistory(): void {
        this.planningService.convoyLogs(this.id).subscribe(response => {
            this.planning = response[0].attributes
            this.isLoading$.next(false);
        })
    }

}

