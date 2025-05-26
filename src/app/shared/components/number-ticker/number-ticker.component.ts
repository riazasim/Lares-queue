import {
    Component,
    Input,
    OnInit,
    OnDestroy,
    OnChanges,
    SimpleChanges,
    ChangeDetectorRef
} from '@angular/core';

interface TimeSlot {
    time: string;
    value: number;
}

@Component({
    selector: 'app-number-ticker',
    template: `<span>{{ currentValue | number:'1.0-0' }}</span>`,
    styles: [``]
})
export class NumberTickerComponent implements OnInit, OnDestroy, OnChanges {
    @Input() data: TimeSlot[] = [];
    @Input() targetValue: number | null = null;

    @Input() totalAnimationTime: number = 60000;
    @Input() autoPlay: boolean = true;

    currentValue = 0;
    currentSlotIndex = 0;
    isPlaying = false;
    currentPhase: 'idle' | 'counting' | 'pause' = 'idle';

    private animationFrame: any;
    private pauseTimeout: any;

    private startTimestamp = 0;
    private fromValue = 0;
    private toValue = 0;

    private slots: TimeSlot[] = [];
    private isSingleNumberMode = false;

    constructor(private cd: ChangeDetectorRef) {}

    get perSlotTime(): number {
        return this.slots.length ? this.totalAnimationTime / this.slots.length : 0;
    }

    get countingTime(): number {
        return this.perSlotTime * 0.8;
    }

    get pauseTime(): number {
        return this.perSlotTime * 0.2;
    }

    ngOnInit(): void {
        this.setupMode();
        this.reset();
        if (this.autoPlay) {
            this.play();
        }
    }

    ngOnChanges(changes: SimpleChanges): void {
        if (changes['data'] || changes['targetValue']) {
            this.setupMode();
            this.reset();
            if (this.autoPlay) {
                this.play();
            }
        }

        if (changes['autoPlay'] && !changes['autoPlay'].firstChange) {
            this.autoPlay ? this.play() : this.pause();
        }
    }

    private setupMode(): void {
        this.isSingleNumberMode = typeof this.targetValue === 'number';
        this.slots = this.isSingleNumberMode ? [{ time: 'target', value: this.targetValue! }] : this.data;
    }

    play(): void {
        if (this.isPlaying) return;
        this.isPlaying = true;

        if (this.currentPhase === 'idle') {
            this.startCounting();
        }
    }

    pause(): void {
        this.isPlaying = false;
        cancelAnimationFrame(this.animationFrame);
        clearTimeout(this.pauseTimeout);
    }

    reset(): void {
        this.pause();
        this.currentSlotIndex = 0;
        this.currentValue = 0;
        this.currentPhase = 'idle';
        this.cd.detectChanges();
    }

    private startCounting(): void {
        if (this.currentSlotIndex >= this.slots.length) {
            this.isPlaying = false;
            this.currentPhase = 'idle';
            return;
        }

        const slot = this.slots[this.currentSlotIndex];
        this.fromValue = this.currentValue;
        this.toValue = this.currentValue + slot.value;

        if (slot.value <= 0) {
            this.startPause();
            return;
        }

        this.currentPhase = 'counting';
        this.startTimestamp = performance.now();
        this.runAnimation();
    }

    private runAnimation(): void {
        const now = performance.now();
        const elapsed = now - this.startTimestamp;
        const progress = Math.min(elapsed / this.countingTime, 1);

        this.currentValue = this.fromValue + (this.toValue - this.fromValue) * progress;
        this.cd.detectChanges();

        if (progress < 1) {
            this.animationFrame = requestAnimationFrame(() => this.runAnimation());
        } else {
            this.currentValue = this.toValue;
            this.cd.detectChanges();

            if (this.isSingleNumberMode) {
                this.isPlaying = false;
                this.currentPhase = 'idle';
            } else {
                this.startPause();
            }
        }
    }

    private startPause(): void {
        this.currentPhase = 'pause';
        this.pauseTimeout = setTimeout(() => {
            this.currentSlotIndex++;
            this.currentPhase = 'idle';
            if (this.isPlaying) {
                this.startCounting();
            }
        }, this.pauseTime);
    }

    ngOnDestroy(): void {
        cancelAnimationFrame(this.animationFrame);
        clearTimeout(this.pauseTimeout);
    }
}
