import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { SizeProp } from '@fortawesome/fontawesome-svg-core';

@Component({
    selector: 'app-loader',
    templateUrl: './loader.component.html',
    styleUrls: ['./loader.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class LoaderComponent {
    @Input()
    public message = '';

    @Input()
    public fullScreen = false;

    @Input()
    public isOverlay = false;

    @Input()
    public isOverlayWhite = false;

    @Input()
    public isContainer = false;

    @Input()
    public size: SizeProp = '3x'

    @Input()
    public isWhite: boolean;
}
