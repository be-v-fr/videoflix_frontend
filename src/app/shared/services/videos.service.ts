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

  
  public async syncVideosMeta(): Promise<void> {
    const resp = await lastValueFrom(this.http.get(this.VIDEOS_URL));
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
    console.log('all metadata:', this.videosMeta);
    return this.videosMeta.find(v => v.id === id);
  }
}
