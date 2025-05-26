import { Component, Input, ViewChild, ElementRef, OnChanges, SimpleChanges, AfterViewInit } from '@angular/core';
import gsap from 'gsap';

@Component({
  selector: 'app-progress-bar',
  template: `
    <div class="w-full bg-[#E4E7EC] rounded-full">
      <div #progressBar class="bg-[#3498DB] h-3 rounded-full"></div>
    </div>
  `
})
export class ProgressBarComponent implements OnChanges, AfterViewInit {
  @Input() duration: number = 5;

  @Input() autoplay: boolean = false;

  @ViewChild('progressBar') progressBar!: ElementRef<HTMLDivElement>;

  private tween: gsap.core.Tween | null = null;
  private isPaused = false;

  private hasViewInitialized = false;

  ngAfterViewInit(): void {
    this.hasViewInitialized = true;
    if (this.autoplay) {
      this.start();
    }
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['duration'] && !changes['duration'].firstChange && this.autoplay && this.hasViewInitialized) {
      this.start();
    }

    if (changes['autoplay'] && changes['autoplay'].currentValue && this.hasViewInitialized) {
      this.start();
    }
  }

  public start(): void {
    if (this.tween) {
      this.tween.kill();
    }
    gsap.set(this.progressBar.nativeElement, { width: '0%' });
    this.tween = gsap.to(this.progressBar.nativeElement, {
      width: '100%',
      duration: this.duration,
      ease: 'linear',
    });
    this.isPaused = false;
  }

  public pause(): void {
    if (this.tween && !this.isPaused) {
      this.tween.pause();
      this.isPaused = true;
    }
  }

  public resume(): void {
    if (this.tween && this.isPaused) {
      this.tween.resume();
      this.isPaused = false;
    }
  }

  public toggle(): void {
    if (this.tween) {
      this.isPaused ? this.resume() : this.pause();
    }
  }
}
