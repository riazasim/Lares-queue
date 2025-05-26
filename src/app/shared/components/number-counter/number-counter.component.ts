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
    selector: 'app-counter-ticker',
    template: `<span>{{ currentValue }}</span>`,
    styles: [``]
})
export class NumberCounterComponent implements OnInit, OnDestroy, OnChanges {
    @Input() data: TimeSlot[] = new Array(24).fill(null).map((_, i) => ({
        time: `${i.toString().padStart(2, '0')}:00`,
        value: 0
    }));

    @Input() totalAnimationTime: number = 60000;
    @Input() maxDisplayIncrements: number = 20;
    @Input() autoPlay: boolean = true;
    @Input() minIncrement: number = 0.0001; // NEW: minimum step size for float values

    slots: TimeSlot[] = [];
    currentSlotIndex = 0;
    currentValue = 0;
    isPlaying = false;
    currentPhase: 'idle' | 'counting' | 'pause' = 'idle';

    currentStep = 0;
    totalSteps = 0;
    private slotStartValue = 0;
    private slotTargetValue = 0;
    private currentUpdateInterval = 0;

    countInterval: any;
    pauseTimeout: any;
    remainingPauseTime = 0;
    pauseStartTimestamp = 0;

    private get perSlotTime(): number {
        return this.slots.length ? this.totalAnimationTime / this.slots.length : 0;
    }

    private get countingTime(): number {
        return this.perSlotTime * 0.8;
    }

    private get pauseTime(): number {
        return this.perSlotTime * 0.2;
    }

    constructor(private cd: ChangeDetectorRef) { }

    ngOnInit(): void {
        this.slots = this.data;
        this.reset();
        if (this.autoPlay && this.slots.length > 0) {
            this.play();
        }
    }

    ngOnChanges(changes: SimpleChanges): void {
        if (changes['data']) {
            if (
                changes['data'].firstChange ||
                JSON.stringify(changes['data'].currentValue) !== JSON.stringify(changes['data'].previousValue)
            ) {
                this.slots = changes['data'].currentValue;
                this.reset();
                if (this.autoPlay && this.slots.length > 0) {
                    this.play();
                }
            }
        }

        if (changes['autoPlay'] && !changes['autoPlay'].firstChange) {
            if (this.autoPlay && !this.isPlaying) {
                this.play();
            } else if (!this.autoPlay && this.isPlaying) {
                this.pause();
            }
        }
    }

    play(): void {
        if (this.isPlaying) return;
        this.isPlaying = true;
        if (this.currentPhase === 'idle') {
            this.startCountingPhase();
        } else if (this.currentPhase === 'counting') {
            this.resumeCountingPhase();
        } else if (this.currentPhase === 'pause') {
            this.resumePausePhase();
        }
    }

    pause(): void {
        if (!this.isPlaying) return;
        this.isPlaying = false;
        if (this.currentPhase === 'counting') {
            clearInterval(this.countInterval);
        } else if (this.currentPhase === 'pause') {
            clearTimeout(this.pauseTimeout);
            this.remainingPauseTime = this.pauseTime - (Date.now() - this.pauseStartTimestamp);
        }
    }

    reset(): void {
        this.pause();
        clearInterval(this.countInterval);
        clearTimeout(this.pauseTimeout);
        this.currentSlotIndex = 0;
        this.currentValue = 0;
        this.currentPhase = 'idle';
        this.currentStep = 0;
        this.totalSteps = 0;
        this.slotStartValue = 0;
        this.slotTargetValue = 0;
        this.cd.detectChanges();
    }

    private startCountingPhase(): void {
        if (this.currentSlotIndex >= this.slots.length) {
            this.isPlaying = false;
            this.currentPhase = 'idle';
            return;
        }

        const nextTarget = this.slots[this.currentSlotIndex].value;
        const difference = nextTarget - this.currentValue;

        if (difference === 0) {
            this.startPausePhase();
            return;
        }

        const steps = Math.min(
            Math.ceil(Math.abs(difference) / this.minIncrement),
            this.maxDisplayIncrements
        );

        this.slotStartValue = this.currentValue;
        this.slotTargetValue = nextTarget;
        this.totalSteps = steps;
        this.currentStep = 0;
        this.currentUpdateInterval = Math.round(this.countingTime / steps);
        this.currentPhase = 'counting';

        this.countInterval = setInterval(() => {
            this.currentStep++;
            const stepSize = (this.slotTargetValue - this.slotStartValue) / this.totalSteps;
            this.currentValue = parseFloat((this.slotStartValue + stepSize * this.currentStep).toFixed(6));
            this.cd.detectChanges();

            if (this.currentStep >= this.totalSteps) {
                clearInterval(this.countInterval);
                this.currentValue = this.slotTargetValue;
                this.cd.detectChanges();
                this.startPausePhase();
            }
        }, this.currentUpdateInterval);
    }

    private resumeCountingPhase(): void {
        const stepSize = (this.slotTargetValue - this.slotStartValue) / this.totalSteps;

        this.countInterval = setInterval(() => {
            this.currentStep++;
            this.currentValue = parseFloat((this.slotStartValue + stepSize * this.currentStep).toFixed(6));
            this.cd.detectChanges();

            if (this.currentStep >= this.totalSteps) {
                clearInterval(this.countInterval);
                this.currentValue = this.slotTargetValue;
                this.cd.detectChanges();
                this.startPausePhase();
            }
        }, this.currentUpdateInterval);
    }

    private startPausePhase(): void {
        this.currentPhase = 'pause';
        this.remainingPauseTime = this.pauseTime;
        this.pauseStartTimestamp = Date.now();
        this.pauseTimeout = setTimeout(() => {
            this.moveToNextSlot();
        }, this.remainingPauseTime);
    }

    private resumePausePhase(): void {
        this.pauseStartTimestamp = Date.now();
        this.pauseTimeout = setTimeout(() => {
            this.moveToNextSlot();
        }, this.remainingPauseTime);
    }

    private moveToNextSlot(): void {
        this.currentSlotIndex++;
        if (this.currentSlotIndex < this.slots.length) {
            this.currentPhase = 'idle';
            this.cd.detectChanges();
            if (this.isPlaying) {
                this.startCountingPhase();
            }
        } else {
            this.currentPhase = 'idle';
            this.isPlaying = false;
        }
    }

    ngOnDestroy(): void {
        clearInterval(this.countInterval);
        clearTimeout(this.pauseTimeout);
    }
}
