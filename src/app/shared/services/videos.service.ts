import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { VideoMeta } from '../models/video-meta';
import { environment } from '../../../environments/environment.development';
import { BehaviorSubject, lastValueFrom } from 'rxjs';
import { VideoCompletion } from '../models/video-completion';


/**
 * Service for handling video-related data,
 * including video metadata and user video completion data.
 */
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


  /**
   * Sync video metadata if allowed based on the sync interval.
   */
  public syncVideosMetaIfAllowed(): void {
    if (this.isVideosMetaSyncingAllowed()) {
      this.syncVideosMeta();
    }
  }


  /**
   * Check if video metadata syncing is allowed based on the sync interval.
   */
  private isVideosMetaSyncingAllowed(): boolean {
    return Date.now() - this.lastVideosMetaSynced > this.videosMetaSyncSeconds * 1000;
  }


  /**
   * Sync the video metadata by fetching it from the server.
   */
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


  /**
   * Get the list of all video metadata.
   */
  public getVideosMeta(): VideoMeta[] {
    return this.videosMeta;
  }


  /**
   * Get video metadata by its ID.
   */
  public getVideoMetaFromId(id: number): VideoMeta | undefined {
    return this.videosMeta.find(v => v.id === id);
  }


  /**
   * Get video metadata filtered by genre.
   */
  public getVideosMetaByGenre(genre: string): VideoMeta[] {
    return this.videosMeta.filter(v => v.genre === genre);
  }


  /**
   * Get the latest 5 videos from the metadata list.
   */
  public getLatestVideosMeta(): VideoMeta[] {
    return this.videosMeta.slice(0, 5);
  }


  /**
   * Get the list of previously watched videos based on video completion data.
   */
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


  /**
   * Get the list of all genres from the video metadata.
   * @returns {string[]} An array of unique genres sorted alphabetically.
   */
  public getGenres(): string[] {
    const genres: string[] = [];
    this.videosMeta.forEach(v => {
      if (!genres.includes(v.genre)) {
        genres.push(v.genre);
      }
    });
    return genres.sort((a, b) => a.localeCompare(b));
  }


  /**
   * Initialize user-related video completion data by fetching it from the server.
   */
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


  /**
   * Initializes the preview video by selecting a random video that has not been watched.
   */
  private initVideoPreview(): void {
    const unwatchedVideos: VideoMeta[] = this.videosMeta.filter(vm => !this.getVideoCompletion(vm.id));
    if (unwatchedVideos.length > 0) {
      const randomIndex = Math.floor(Math.random() * unwatchedVideos.length);
      this.previewIndex = this.videosMeta.indexOf(unwatchedVideos[randomIndex]);
    } else {
      const randomIndex = Math.floor(Math.random() * this.videosMeta.length);
      this.previewIndex = randomIndex;
    }
  }


  /**
   * Retrieves video completion data by video ID.
   */
  public getVideoCompletion(videoId: number): VideoCompletion | undefined {
    return this.videoCompletionList.find(vc => vc.videoId == videoId);
  }


  /**
   * Retrieves the metadata of the preview video.
   * @returns {VideoMeta} The metadata of the preview video.
   */
  public getPreviewVideoMeta(): VideoMeta {
    return this.videosMeta[this.previewIndex];
  }


  /**
   * Updates video completion list in runtime memory by putting the updated object first,
   * keeping the ordering.
   * @param {VideoCompletion} updatedCompletion - The updated video completion data.
   */
  public saveVideoCompletionInRuntime(updatedCompletion: VideoCompletion) {
    if (this.videoCompletionList) {
      const index = this.videoCompletionList.findIndex(vC => vC.videoId == updatedCompletion.videoId);
      if (index >= 0) {
        this.videoCompletionList.splice(index, 1);
      }
      this.videoCompletionList.unshift(updatedCompletion);
    }
  }


  /**
   * Saves video completion data to the server. Creates or updates based on the existence of a valid ID.
   * @param {VideoCompletion} updatedCompletion - The video completion data to save.
   * @returns {Promise<Object>} A promise resolving with the server response.
   */
  public saveVideoCompletionOnServer(updatedCompletion: VideoCompletion): Promise<Object> {
    if (updatedCompletion.id >= 1) {
      return this.updateVideoCompletionOnServer(updatedCompletion);
    } else {
      return this.createVideoCompletionOnServer(updatedCompletion);
    }
  }



  /**
   * Updates video completion data on the server.
   */
  private updateVideoCompletionOnServer(updatedCompletion: VideoCompletion): Promise<Object> {
    const url = this.VIDEOS_URL + 'completion/' + updatedCompletion.id + '/';
    const data = { current_time: updatedCompletion.currentTime };
    return lastValueFrom(this.http.patch(url, data))
  }


  /**
   * Posts new video completion data on the server.
   */
  private createVideoCompletionOnServer(updatedCompletion: VideoCompletion): Promise<Object> {
    const url = this.VIDEOS_URL + 'completion/';
    const data = {
      video_id: updatedCompletion.videoId,
      current_time: updatedCompletion.currentTime
    };
    return lastValueFrom(this.http.post(url, data));
  }


  /**
   * Searches video metadata based on the current search filter.
   * @returns {VideoMeta[]} Array of video metadata matching the search filter.
   */
  public search(): VideoMeta[] {
    const filterLc = this.searchFilter.toLocaleLowerCase();
    return this.videosMeta.filter(vm => {
      return vm.title.toLocaleLowerCase().includes(filterLc) ||
      vm.description.toLocaleLowerCase().includes(filterLc)
    });
  }
}
