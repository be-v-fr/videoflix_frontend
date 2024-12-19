import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { VideoMeta } from '../models/video-meta';
import { environment } from '../../../environments/environment.development';
import { lastValueFrom } from 'rxjs';
import { VideoCompletion } from '../models/video-completion';

@Injectable({
  providedIn: 'root'
})
export class VideosService {
  private readonly VIDEOS_URL: string = environment.BASE_URL + 'videos/';
  private videosMeta: VideoMeta[] = [];
  public lastVideosMetaSynced: number = 0;
  private readonly videosMetaSyncSeconds: number = 600;
  public videoCompletionList: VideoCompletion[] = [];


  constructor(
    private http: HttpClient,
  ) { }


  public syncVideosMetaIfAllowed(): void {
    if (this.isVideosMetaSyncingAllowed()) {
      this.syncVideosMeta();
    }
  }


  private isVideosMetaSyncingAllowed(): boolean {
    return Date.now() - this.lastVideosMetaSynced > this.videosMetaSyncSeconds * 1000;
  }


  private syncVideosMeta(): void {
    lastValueFrom(this.http.get(this.VIDEOS_URL)).then(resp => {
      this.lastVideosMetaSynced = Date.now();
      this.videosMeta = [];
      (resp as Array<any>).forEach(vData => {
        this.videosMeta.push(new VideoMeta(vData));
      });
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


  public getVideoCompletion(id: number): VideoCompletion | undefined {
    return this.videoCompletionList.find(vc => vc.videoId == id);
  }


  public saveVideoCompletion(updatedCompletion: VideoCompletion) {
    this.saveVideoCompletionInRuntime(updatedCompletion);
    this.saveVideoCompletionOnServer(updatedCompletion);
  }


  private saveVideoCompletionInRuntime(updatedCompletion: VideoCompletion) {
    if (this.videoCompletionList) {
      console.log(this.videoCompletionList);
      const index = this.videoCompletionList.findIndex(vC => vC.videoId == updatedCompletion.videoId);
      if (index == -1) {
        this.videoCompletionList.push(updatedCompletion);
      } else {
        this.videoCompletionList[index] = updatedCompletion;
      }
      console.log(this.videoCompletionList);
    }
  }


  private saveVideoCompletionOnServer(updatedCompletion: VideoCompletion) {
    console.log('server post request logic here');
  }
}
