import { Component, Input, ViewChild, ElementRef, OnChanges, SimpleChanges } from '@angular/core';
import gsap from 'gsap';

@Component({
  selector: 'app-progress-bar',
  template: `
    <div class="w-full bg-[#E4E7EC] rounded-full">
      <div #progressBar class="bg-[#3498DB] h-3 rounded-full"></div>
    </div>
  `
})
export class ProgressBarComponent implements OnChanges {
  // Dynamic duration in seconds from the parent
  @Input() duration: number = 5;

  // Reference to the inner progress bar element
  @ViewChild('progressBar') progressBar!: ElementRef<HTMLDivElement>;

  // GSAP tween instance
  private tween: gsap.core.Tween | null = null;
  private isPaused = false;

  // Listen for changes to input properties
  ngOnChanges(changes: SimpleChanges): void {
    if (changes['duration'] && !changes['duration'].firstChange) {
      // Restart the animation with the new duration
      this.start();
    }
  }

  // Start (or restart) the animation from 0% to 100%
  public start(): void {
    // If an animation is already running, kill it
    if (this.tween) {
      this.tween.kill();
    }
    // Reset the progress bar width to 0%
    gsap.set(this.progressBar.nativeElement, { width: '0%' });
    // Create the GSAP tween animation with the updated duration
    this.tween = gsap.to(this.progressBar.nativeElement, {
      width: '100%',
      duration: this.duration,
      ease: 'linear',
    });
    this.isPaused = false;
  }

  // Pause the animation
  public pause(): void {
    if (this.tween && !this.isPaused) {
      this.tween.pause();
      this.isPaused = true;
    }
  }

  // Resume the paused animation
  public resume(): void {
    if (this.tween && this.isPaused) {
      this.tween.resume();
      this.isPaused = false;
    }
  }

  // Toggle between pause and resume
  public toggle(): void {
    if (this.tween) {
      this.isPaused ? this.resume() : this.pause();
    }
  }
}



// import { Component, Input, ViewChild, ElementRef, AfterViewInit } from '@angular/core';
// import gsap from 'gsap';

// @Component({
//     selector: 'app-progress-bar',
//     template: `
//     <div class="w-full bg-[#E4E7EC] rounded-full">
//       <div #progressBar class="bg-[#3498DB] h-3 rounded-full"></div>
//     </div>
//   `
// })
// export class ProgressBarComponent {
//     // Dynamic duration in seconds from the parent
//     @Input() duration: number = 5;


//     // Reference to the inner progress bar element
//     @ViewChild('progressBar') progressBar!: ElementRef<HTMLDivElement>;

//     // GSAP tween instance
//     private tween: gsap.core.Tween | null = null;
//     private isPaused = false;

//     // Auto-play the animation on view initialization

//     // Start (or restart) the animation from 0 to 100%
//     public start(): void {
//         // Reset the progress bar width to 0%
//         gsap.set(this.progressBar.nativeElement, { width: '0%' });

//         // Create the GSAP tween animation
//         this.tween = gsap.to(this.progressBar.nativeElement, {
//             width: '100%',
//             duration: this.duration,
//             ease: 'linear',
//         });
//         this.isPaused = false;
//     }

//     // Pause the animation
//     public pause(): void {
//         if (this.tween && !this.isPaused) {
//             this.tween.pause();
//             this.isPaused = true;
//         }
//     }

//     // Resume the paused animation
//     public resume(): void {
//         if (this.tween && this.isPaused) {
//             this.tween.resume();
//             this.isPaused = false;
//         }
//     }

//     // Toggle between pause and resume
//     public toggle(): void {
//         if (this.tween) {
//             this.isPaused ? this.resume() : this.pause();
//         }
//     }
// }
