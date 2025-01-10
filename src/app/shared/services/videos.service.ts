import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { VideoMeta } from '../models/video-meta';
import { environment } from '../../../environments/environment.development';
import { BehaviorSubject, lastValueFrom } from 'rxjs';
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
  public loadingState: BehaviorSubject<null | 'meta' | 'completion' | 'complete'> = new BehaviorSubject<null | 'meta' | 'completion' | 'complete'>(null);
  private previewIndex: number = -1;
  public searchFilter: string = '';


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
    this.loadingState.next('meta');
    lastValueFrom(this.http.get(this.VIDEOS_URL + 'main/?ordering=-created_at')).then(resp => {
      this.lastVideosMetaSynced = Date.now();
      this.videosMeta = [];
      (resp as Array<any>).forEach(vData => {
        this.videosMeta.push(new VideoMeta(vData));
      });
    });
  }


  public async retrieveVideoMeta(id: number): Promise<Object> {
    return await lastValueFrom(this.http.get(this.VIDEOS_URL + 'main/' + id + '/'));
  }


  public getVideosMeta(): VideoMeta[] {
    return this.videosMeta;
  }


  public getVideoMetaFromId(id: number): VideoMeta | undefined {
    return this.videosMeta.find(v => v.id === id);
  }


  public getVideosMetaByGenre(genre: string): VideoMeta[] {
    return this.videosMeta.filter(v => v.genre === genre);
  }


  public getLatestVideosMeta(): VideoMeta[] {
    return this.videosMeta.slice(0, 5);
  }


  public getPreviouslyWatchedVideosMeta(): VideoMeta[] {
    const metasWatched: VideoMeta[] = [];
    this.videoCompletionList.forEach(vc => {
        const meta = this.getVideoMetaFromId(vc.videoId);
        if (meta) {
          metasWatched.push(meta);
        }
      });
    return metasWatched;
  }


  public getGenres(): string[] {
    const genres: string[] = [];
    this.videosMeta.forEach(v => {
      if (!genres.includes(v.genre)) {
        genres.push(v.genre);
      }
    });
    return genres.sort((a, b) => a.localeCompare(b));
  }


  public initVideoCompletionData(): void {
    this.loadingState.next('completion');
    const url = this.VIDEOS_URL + 'completion/?ordering=-updated_at';
    lastValueFrom(this.http.get(url)).then(resp => {
      this.videoCompletionList = [];
      (resp as Array<any>).forEach(vcData => {
        this.videoCompletionList.push(new VideoCompletion(vcData));
      });
      this.initVideoPreview();
      this.loadingState.next('complete');
    });
  }


  private initVideoPreview(): void {
    const randomIndex: number =  Math.floor(Math.random() * this.videosMeta.length);
    const alreadyWatched: boolean = this.getVideoCompletion(this.videosMeta[randomIndex].id) instanceof VideoCompletion;
    alreadyWatched ? this.initVideoPreview() : this.previewIndex = randomIndex;
  }


  public getVideoCompletion(videoId: number): VideoCompletion | undefined {
    return this.videoCompletionList.find(vc => vc.videoId == videoId);
  }


  public getPreviewVideoMeta(): VideoMeta {
    return this.videosMeta[this.previewIndex];
  }


  public saveVideoCompletionInRuntime(updatedCompletion: VideoCompletion) {
    if (this.videoCompletionList) {
      const index = this.videoCompletionList.findIndex(vC => vC.videoId == updatedCompletion.videoId);
      if (index >= 0) {
        this.videoCompletionList.splice(index, 1);
      }
      this.videoCompletionList.unshift(updatedCompletion);
    }
  }


  public saveVideoCompletionOnServer(updatedCompletion: VideoCompletion): Promise<Object> {
    if (updatedCompletion.id >= 1) {
      return this.updateVideoCompletionOnServer(updatedCompletion);
    } else {
      return this.createVideoCompletionOnServer(updatedCompletion);
    }
  }


  private updateVideoCompletionOnServer(updatedCompletion: VideoCompletion): Promise<Object> {
    const url = this.VIDEOS_URL + 'completion/' + updatedCompletion.id + '/';
    const data = { current_time: updatedCompletion.currentTime };
    return lastValueFrom(this.http.patch(url, data))
  }


  private createVideoCompletionOnServer(updatedCompletion: VideoCompletion): Promise<Object> {
    const url = this.VIDEOS_URL + 'completion/';
    const data = {
      video_id: updatedCompletion.videoId,
      current_time: updatedCompletion.currentTime
    };
    return lastValueFrom(this.http.post(url, data));
  }


  public search(): VideoMeta[] {
    const filterLc = this.searchFilter.toLocaleLowerCase();
    return this.videosMeta.filter(vm => {
      return vm.title.toLocaleLowerCase().includes(filterLc) ||
      vm.description.toLocaleLowerCase().includes(filterLc)
    });
  }
}
