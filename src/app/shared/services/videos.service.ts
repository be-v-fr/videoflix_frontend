import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { VideoMeta } from '../models/video-meta';
import { environment } from '../../../environments/environment.development';
import { lastValueFrom } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class VideosService {
  private readonly VIDEOS_URL: string = environment.BASE_URL + 'videos/';
  private videosMeta: VideoMeta[] = [];

  constructor(
    private http: HttpClient,
  ) { }

  public getVideosMeta(): VideoMeta[] {
    return this.videosMeta;
  }

  public async syncVideosMeta(): Promise<void> {
    const resp = await lastValueFrom(this.http.get(this.VIDEOS_URL));
    this.videosMeta = [];
    (resp as Array<any>).forEach(vData => {
      this.videosMeta.push(new VideoMeta(vData));
    });
  }
}
