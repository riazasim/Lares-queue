import { Component, ViewChild } from '@angular/core';
import { MapInfoWindow } from '@angular/google-maps';
import { BehaviorSubject } from 'rxjs';
import { OrganizationService } from 'src/app/core/services/organization.service';

declare var google: any;
@Component({
    selector: 'app-map',
    templateUrl: 'map.component.html',
    styleUrl: './map.component.scss'
})
export class MapComponent {
    map: google.maps.Map;
    @ViewChild(MapInfoWindow) infoWindow: MapInfoWindow | undefined;
    transportMode: any;
    myMarkerPositions: any[] = [];
    otherMarkerPositions: any[] = [];
    display: any;
    searchQuery: string = '';
    isLoading$: BehaviorSubject<boolean> = new BehaviorSubject(false);
    dataSource: any[] = [];
    marker: any;
    filters: any = { statusFilters: [], timeFilter: {} };

    center: google.maps.LatLngLiteral = {
        lat: 45.9432,
        lng: 24.9668,
    };
    zoom = 7;
    imageUrl = 'https://angular.io/assets/images/logos/angular/angular.svg';
    searchCard: google.maps.LatLngBoundsLiteral = {
        east: 10,
        north: 10,
        south: -10,
        west: -10,
    };


    constructor(
        private readonly organizationService: OrganizationService,
    ) { 
        this.getTransportMode();
    }

    getTransportMode() {
        this.transportMode = this.organizationService.getAppMode();
    }

    retrieveMapData(results: any): void {
        if (results.length <= 0) {
            this.myMarkerPositions = [];
            this.otherMarkerPositions = [];
        }
        else {
            this.myMarkerPositions = [];
            this.otherMarkerPositions = [];
            results.forEach((item: any) => {
                if (item && item.sidCoordinates) {
                    const coordinates = item.sidCoordinates.split(',');
                    const markerPosition = new google.maps.LatLng(parseFloat(coordinates[0]), parseFloat(coordinates[1]));
                    if (item.isOrgOwner) this.myMarkerPositions.push({ position: markerPosition, title: item?.ship?.name });
                    else this.otherMarkerPositions.push({ position: markerPosition, title: item?.ship?.name });
                }
            });
        }
        // this.isLoading$.next(true);
        // let data = {
        //     "start": 0,
        //     "length": 5,
        //     "filters": ["","","",filters.statusFilters,"","","",filters.timeFilter],
        //     "order": [{"dir": "DESC", "column": 0}]
        // }
        // this.microService.getMicroPlanningConvoyes(data).subscribe({
        // next: response => {
        //     this.dataSource = response.items;
        //     this.markerPositions = [];
        //     this.dataSource.forEach(item => {
        //         if (item && item.sidCoordinates) {
        //             const coordinates = item.sidCoordinates.split(',');
        //             const markerPosition = new google.maps.LatLng(parseFloat(coordinates[0]), parseFloat(coordinates[1]));
        //             this.markerPositions.push({position : markerPosition , title : item?.ship?.name});
        //         }
        //     });
        // const d2 = new google.maps.LatLng(parseFloat('37.4239163'), parseFloat('-122.0947209'));
        // this.markerPositions.push(d2);
        // if(this.markerPositions.length > 0){
        //     this.markerPositions.forEach(position => {
        //         this.marker = new google.maps.Marker({
        //             map: this.map,
        //             position: position,
        //             title: 'Marker Title'
        //         });
        //     });
        // }
        // else{
        //     console.log('marker:', this.marker)
        // }
        //         this.cd.detectChanges();
        //         this.isLoading$.next(false);
        //     },
        //     error: ()=>{
        //         this.isLoading$.next(false);
        //     }
        // });
    }

    mapLoading(ev: any) {
        this.isLoading$.next(ev)
    }

}

