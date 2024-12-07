import { Component, ElementRef, Input, OnDestroy, OnInit, ViewChild } from '@angular/core';
import videojs from 'video.js';

@Component({
  selector: 'app-player',
  standalone: true,
  imports: [],
  templateUrl: './player.component.html',
  styleUrl: './player.component.scss'
})
export class PlayerComponent implements OnInit, OnDestroy {
  @ViewChild('target', {static: true}) target!: ElementRef;

  // See options: https://videojs.com/guides/options
  @Input() options?: {
      fluid?: boolean,
      controls: boolean,
      aspectRatio?: string,
      autoplay: boolean,
      sources: {
          src: string,
          type: string,
      }[],
  };

  player: any;

  ngOnInit() {
    this.player = videojs(this.target.nativeElement, this.options, function onPlayerReady() {
      console.log('onPlayerReady', this);
    });
  }

  ngOnDestroy() {
    if (this.player) {
      this.player.dispose();
    }
  }
}
