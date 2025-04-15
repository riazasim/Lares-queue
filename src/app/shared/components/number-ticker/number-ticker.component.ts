import { Component, Input, OnInit, OnDestroy, OnChanges, SimpleChanges, ChangeDetectorRef } from '@angular/core';

interface TimeSlot {
    time: string;
    value: number;
}

@Component({
    selector: 'app-number-ticker',
    template: `<span>{{ currentValue }}</span>`,
    styles: [``]
})
export class NumberTickerComponent implements OnInit, OnDestroy, OnChanges {
    // Data input (can be provided via async pipe or directly)
    @Input() data: TimeSlot[] = [
        { time: '00:00', value: 3 },
        { time: '01:00', value: 4 },
        { time: '02:00', value: 6 },
        { time: '03:00', value: 0 },
        { time: '04:00', value: 0 },
        { time: '05:00', value: 0 },
        { time: '06:00', value: 0 },
        { time: '07:00', value: 0 },
        { time: '08:00', value: 0 },
        { time: '09:00', value: 0 },
        { time: '10:00', value: 0 },
        { time: '11:00', value: 0 },
        { time: '12:00', value: 0 },
        { time: '13:00', value: 0 },
        { time: '14:00', value: 0 },
        { time: '15:00', value: 0 },
        { time: '16:00', value: 0 },
        { time: '17:00', value: 0 },
        { time: '18:00', value: 0 },
        { time: '19:00', value: 0 },
        { time: '20:00', value: 0 },
        { time: '21:00', value: 0 },
        { time: '22:00', value: 0 },
        { time: '23:00', value: 0 }
    ];

    // Total animation time (default 60,000ms = 60 seconds)
    @Input() totalAnimationTime: number = 60000;
    // Maximum visible increments for a time slot (if the addition exceeds this, the animation shows only the last increments)
    @Input() maxDisplayIncrements: number = 20;
    // autoPlay: when true, the ticker automatically starts after initialization or data change
    @Input() autoPlay: boolean = true;

    // Internal state variables
    slots: TimeSlot[] = [];
    currentSlotIndex = 0;
    // Cumulative value that carries from slot to slot
    currentValue = 0;
    isPlaying = false;
    currentPhase: 'idle' | 'counting' | 'pause' = 'idle';

    // Variables for counting phase of the current slot
    currentStep = 0;       // Number of steps completed in current slot's counting phase
    totalSteps = 0;        // Total steps to display for the current slot
    // The starting cumulative value for the current slot's animation
    private slotStartValue = 0;
    // The new cumulative target value for the current slot
    private slotTargetValue = 0;
    // Computed update interval (in ms) for the counting phase of the current slot
    private currentUpdateInterval = 0;

    // Timer handles
    countInterval: any;
    pauseTimeout: any;
    remainingPauseTime = 0;
    pauseStartTimestamp = 0;

    // Each time slot gets an equal share of the total animation time.
    private get perSlotTime(): number {
        return this.slots.length ? this.totalAnimationTime / this.slots.length : 0;
    }

    // The counting phase occupies 80% of each slot’s time.
    private get countingTime(): number {
        return this.perSlotTime * 0.8;
    }

    // The pause phase occupies the remaining 20%.
    private get pauseTime(): number {
        return this.perSlotTime * 0.2;
    }

    constructor(private cd: ChangeDetectorRef) { }

    ngOnInit(): void {
        this.slots = this.data;
        this.reset();
        if (this.autoPlay && this.slots && this.slots.length > 0) {
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
                if (this.autoPlay && this.slots && this.slots.length > 0) {
                    this.play();
                }
            }
        }
        if (changes['autoPlay'] && !changes['autoPlay'].firstChange) {
            // If autoPlay changes, start or pause accordingly.
            if (this.autoPlay && !this.isPlaying) {
                this.play();
            } else if (!this.autoPlay && this.isPlaying) {
                this.pause();
            }
        }
    }

    // Public method: Start or resume the animation.
    play(): void {
        if (this.isPlaying) return;
        this.isPlaying = true;
        if (this.currentPhase === 'idle') {
            // If starting fresh, begin the current slot's counting phase.
            this.startCountingPhase();
        } else if (this.currentPhase === 'counting') {
            this.resumeCountingPhase();
        } else if (this.currentPhase === 'pause') {
            this.resumePausePhase();
        }
    }

    // Public method: Pause the animation.
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

    // Public method: Reset the animation.
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

    // Start the counting phase for the current time slot.
    private startCountingPhase(): void {
        if (this.currentSlotIndex >= this.slots.length) {
            this.isPlaying = false;
            this.currentPhase = 'idle';
            return;
        }

        const addition = this.slots[this.currentSlotIndex].value;
        // If there is nothing to add, immediately start the pause phase.
        if (addition <= 0) {
            this.slotStartValue = this.currentValue;
            this.slotTargetValue = this.currentValue;
            this.startPausePhase();
            return;
        }

        let steps: number;
        // If the addition is small enough, animate all increments.
        if (addition <= this.maxDisplayIncrements) {
            steps = addition;
            this.slotStartValue = this.currentValue;
        } else {
            // For large additions, animate only the last maxDisplayIncrements increments.
            steps = this.maxDisplayIncrements;
            this.slotStartValue = this.currentValue + (addition - this.maxDisplayIncrements);
        }
        this.slotTargetValue = this.currentValue + addition;
        this.totalSteps = steps;
        this.currentStep = 0;
        // Calculate update interval so that the counting phase always lasts exactly countingTime.
        this.currentUpdateInterval = Math.round(this.countingTime / steps);
        this.currentPhase = 'counting';

        this.countInterval = setInterval(() => {
            this.currentStep++;
            this.currentValue = this.slotStartValue + this.currentStep;
            this.cd.detectChanges();
            if (this.currentStep >= steps) {
                clearInterval(this.countInterval);
                // Ensure the final value is exactly the target.
                this.currentValue = this.slotTargetValue;
                this.cd.detectChanges();
                this.startPausePhase();
            }
        }, this.currentUpdateInterval);
    }

    // Resume counting if paused mid-way.
    private resumeCountingPhase(): void {
        this.countInterval = setInterval(() => {
            this.currentStep++;
            this.currentValue = this.slotStartValue + this.currentStep;
            this.cd.detectChanges();
            if (this.currentStep >= this.totalSteps) {
                clearInterval(this.countInterval);
                this.currentValue = this.slotTargetValue;
                this.cd.detectChanges();
                this.startPausePhase();
            }
        }, this.currentUpdateInterval);
    }

    // Start the pause phase between time slots.
    private startPausePhase(): void {
        this.currentPhase = 'pause';
        this.remainingPauseTime = this.pauseTime;
        this.pauseStartTimestamp = Date.now();
        this.pauseTimeout = setTimeout(() => {
            this.moveToNextSlot();
        }, this.remainingPauseTime);
    }

    // Resume the pause phase if it was interrupted.
    private resumePausePhase(): void {
        this.pauseStartTimestamp = Date.now();
        this.pauseTimeout = setTimeout(() => {
            this.moveToNextSlot();
        }, this.remainingPauseTime);
    }

    // Move to the next time slot while keeping the cumulative value.
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
