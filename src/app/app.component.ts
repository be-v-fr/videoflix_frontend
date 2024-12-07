import { Component, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { VideosService } from './shared/services/videos.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent implements OnInit {
  title = 'videoflix_frontend';

  constructor(
    private videosService: VideosService,
  ) { }

  ngOnInit(): void {
    console.log('init home...');
    // try catch
    this.videosService.syncVideosMeta();
  }
}
