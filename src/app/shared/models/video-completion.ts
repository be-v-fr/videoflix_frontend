/**
 * Represents the playback state of a video, related to the current user,
 */
export class VideoCompletion {
    id: number;
    videoId: number;
    currentTime: number;
    updatedAt: Date;


    constructor(obj: any) {
        this.id = obj.id ? obj.id : -1;
        this.videoId = obj.video_id ? obj.video_id : -1;
        this.currentTime = obj.current_time ? obj.current_time : -1;
        this.updatedAt = new Date(obj.updated_at ? obj.updated_at : -1);
    }
}