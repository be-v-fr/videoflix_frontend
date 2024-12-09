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
  public lastVideosMetaSynced: number = 0;
  private readonly videosMetaSyncSeconds: number = 600;


  constructor(
    private http: HttpClient,
  ) { }


  public syncVideosMetaIfAllowed(): void {
    if(this.isVideosMetaSyncingAllowed()) {
      this.syncVideosMeta();
    }
  }


  private isVideosMetaSyncingAllowed(): boolean {
    return Date.now() - this.lastVideosMetaSynced > this.videosMetaSyncSeconds * 1000;
  }

  
  private async syncVideosMeta(): Promise<void> {
    // ERROR HANDLING
    const resp = await lastValueFrom(this.http.get(this.VIDEOS_URL));
    this.lastVideosMetaSynced = Date.now();
    this.videosMeta = [];
    (resp as Array<any>).forEach(vData => {
      this.videosMeta.push(new VideoMeta(vData));
    });
  }


  public async retrieveVideoMeta(id: number): Promise<Object> {
    return await lastValueFrom(this.http.get(this.VIDEOS_URL + id + '/'));
  }


  public getVideosMeta(): VideoMeta[] {
    return this.videosMeta;
  }


  public getVideoMetaFromId(id: number): VideoMeta | undefined {
    return this.videosMeta.find(v => v.id === id);
  }
}
