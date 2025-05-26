import { CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IconicInputWrapperComponent } from './components/input-wrapper/iconic-input-wrapper.component';
import { IconicPasswordWrapperComponent } from './components/password-wrapper/iconic-password-wrapper.component';
import { IconicSelectWrapperComponent } from './components/select-wrapper/iconic-select-wrapper.component';
import { LoaderComponent } from './components/loader/loader.component';
import { SelectRefDirective } from './directives/select-ref.directive';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { PublicLayoutComponent } from './components/public-layout/public-layout.component';
import { FilterPipe } from "../core/pipes/filter.pipe";
import { SuccessContainerComponent } from "./components/success-container/success-container.component";
import { EditContainerComponent } from "./components/edit-container/edit-container.component";
import { FullEmptyContainerComponent } from "./components/full-empty-container/full-empty-container.component";
import { ChangeLocationModalComponent } from './components/change-location-modal/change-location-modal.component';
import { CallbackPipe } from '../core/pipes/callback.pipe';
import { SearchbarModule } from './components/searchbar/searchbar.component';
import { ButtonComponent } from './components/button/button.component';
import { FilterSelectComponent } from './components/filter-select/filter-select.component';
import { MatProgressSpinnerModule } from "@angular/material/progress-spinner";
import { TextareaWrapperComponent } from './components/textarea-wrapper/textarea-wrapper.component';
import { DatepickerComponent } from './components/datepicker/datepicker.component';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { OpenImageModalComponent } from './components/open-image-modal/open-image-modal.component';
import { ExtractPropertyPipe } from '../core/pipes/extract-property.pipe';
import { ActivityLogComponent } from './components/activity-log/activity-log.component';
import { CustomTooltipComponent } from './components/custom-tooltip/custom-tooltip.component';
import { CustomTooltipDirective } from './directives/custom-tooltip.directive';
import { SafeHtmlPipe } from '../core/pipes/safe-html.pipe';
import { ToggleComponent } from './components/toggle/toggle.component';
import { MAT_MOMENT_DATE_ADAPTER_OPTIONS, MomentDateAdapter } from '@angular/material-moment-adapter';
import { MAT_DATE_FORMATS, MAT_DATE_LOCALE, MatNativeDateModule, MatRippleModule } from '@angular/material/core';
import { TranslateModule } from '@ngx-translate/core';
import { TimepickerComponent } from './components/timepicker/timepicker.component';
import { MatMenuModule } from '@angular/material/menu';
import { MatRadioModule } from '@angular/material/radio';
import { GenericWrapperComponent } from './components/generic-wrapper/generic-wrapper.component';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { MatChipsModule } from '@angular/material/chips';
import { MatStepperModule } from '@angular/material/stepper';
import { MatDialogModule } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatSelectModule } from '@angular/material/select';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatSortModule } from '@angular/material/sort';
import { MatTableModule } from '@angular/material/table';
import { MatTooltipModule } from '@angular/material/tooltip';
import { InputRefDirective } from './directives/input-ref.directive';
import { MatTabsModule } from '@angular/material/tabs';
import { MultiselectsearchComponent } from './components/multiselectsearch/multiselectsearch.component';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { CdkDropList, CdkDrag } from '@angular/cdk/drag-drop';
import { WarningModalComponent } from './components/modals/warning-modal/warning-modal.component';
import { PhonenumberComponent } from './components/phonenumber/phonenumber.component';
import { NgxMaskDirective, NgxMaskPipe, provideNgxMask } from 'ngx-mask';
import { IconicSelectSearchComponent } from './components/select-search/iconic-select-search.component';
import { MaterialPanelTableModule } from './components/tables/material-panel-table/material-panel-table.component';
import { NgScrollbarModule } from 'ngx-scrollbar';
import { NgScrollbarReachedModule } from 'ngx-scrollbar/reached-event';
import { MatSliderModule } from '@angular/material/slider';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { NgxChartsModule } from '@swimlane/ngx-charts';
import { SankeyChartComponent } from './components/sankey-chart/sankey-chart.component';
import { ProgressBarComponent } from './components/progress-bar/progress-bar.component';
import { NumberTickerComponent } from './components/number-ticker/number-ticker.component';
import { NumberCounterComponent } from './components/number-counter/number-counter.component';
import { TruckSimulationComponent } from './components/truck-simulation/truck-simulation.component';

export const MY_FORMATS = {
    parse: {
        dateInput: 'YYYY.MM.DD',
    },
    display: {
        dateInput: 'YYYY.MM.DD',
        monthYearLabel: 'MMM YYYY',
        dateA11yLabel: 'LL',
        monthYearA11yLabel: 'MMMM-YYYY',
    },
};

@NgModule({
    declarations: [
        IconicInputWrapperComponent,
        IconicPasswordWrapperComponent,
        IconicSelectWrapperComponent,
        DatepickerComponent,
        LoaderComponent,
        PublicLayoutComponent,
        SuccessContainerComponent,
        FilterPipe,
        EditContainerComponent,
        FullEmptyContainerComponent,
        ChangeLocationModalComponent,
        CallbackPipe,
        ButtonComponent,
        FilterSelectComponent,
        TextareaWrapperComponent,
        OpenImageModalComponent,
        ExtractPropertyPipe,
        ActivityLogComponent,
        CustomTooltipComponent,
        CustomTooltipDirective,
        SafeHtmlPipe,
        ToggleComponent,
        TimepickerComponent,
        GenericWrapperComponent,
        InputRefDirective,
        SelectRefDirective,
        MultiselectsearchComponent,
        WarningModalComponent,
        PhonenumberComponent,
        IconicSelectSearchComponent,
        SankeyChartComponent,
        ProgressBarComponent,
        NumberTickerComponent,
        NumberCounterComponent,
        TruckSimulationComponent
    ],
    imports: [
        FontAwesomeModule,
        FormsModule,
        ReactiveFormsModule,
        SearchbarModule,
        MatProgressSpinnerModule,
        MatDatepickerModule,
        TranslateModule,
        MatMenuModule,
        MatRadioModule,
        CommonModule,
        MatFormFieldModule,
        MatInputModule,
        MatTabsModule,
        MatChipsModule,
        MatAutocompleteModule,
        MatButtonToggleModule,
        CdkDropList,
        CdkDrag,
        NgxMaskDirective,
        NgxMaskPipe,
        MatSelectModule,
        MaterialPanelTableModule,
        NgScrollbarModule,
        NgScrollbarReachedModule,
        MatSliderModule,
        MatProgressBarModule

    ],
    exports: [
        IconicInputWrapperComponent,
        IconicPasswordWrapperComponent,
        IconicSelectWrapperComponent,
        DatepickerComponent,
        LoaderComponent,
        PublicLayoutComponent,
        FilterPipe,
        SuccessContainerComponent,
        EditContainerComponent,
        FullEmptyContainerComponent,
        ChangeLocationModalComponent,
        CallbackPipe,
        ButtonComponent,
        FilterSelectComponent,
        TextareaWrapperComponent,
        OpenImageModalComponent,
        ExtractPropertyPipe,
        ActivityLogComponent,
        CustomTooltipComponent,
        CustomTooltipDirective,
        SafeHtmlPipe,
        ToggleComponent,
        TimepickerComponent,
        MatRadioModule,
        CommonModule,
        DatepickerComponent,
        MatCheckboxModule,
        MatFormFieldModule,
        MatInputModule,
        MatButtonModule,
        MatButtonToggleModule,
        MatChipsModule,
        MatStepperModule,
        MatDialogModule,
        MatIconModule,
        MatNativeDateModule,
        MatPaginatorModule,
        MatRippleModule,
        MatSelectModule,
        MatSidenavModule,
        MatSlideToggleModule,
        MatSnackBarModule,
        MatSortModule,
        MatTableModule,
        MatTooltipModule,
        InputRefDirective,
        SelectRefDirective,
        MatInputModule,
        FontAwesomeModule,
        FormsModule,
        ReactiveFormsModule,
        TranslateModule,
        MatTabsModule,
        SearchbarModule,
        MultiselectsearchComponent,
        CdkDropList,
        CdkDrag,
        WarningModalComponent,
        PhonenumberComponent,
        MatMenuModule,
        IconicSelectSearchComponent,
        MaterialPanelTableModule,
        NgScrollbarModule,
        NgScrollbarReachedModule,
        MatSliderModule,
        MatProgressBarModule,
        NgxChartsModule,
        SankeyChartComponent,
        ProgressBarComponent,
        NumberTickerComponent,
        NumberCounterComponent,
        TruckSimulationComponent
    ],
    providers: [
        provideNgxMask(),
        NgxMaskPipe,
        { provide: MAT_MOMENT_DATE_ADAPTER_OPTIONS, useClass: MomentDateAdapter, deps: [MAT_DATE_LOCALE] },
        { provide: MAT_DATE_FORMATS, useValue: MY_FORMATS }
    ],
    schemas: []
})
export class SharedModule { }
