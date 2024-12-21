export class VideoCompletion {
    id: number;
    videoId: number;
    currentTime: number;
    updatedAt: number;


    constructor(obj: any) {
        this.id = obj.id ? obj.id : -1;
        this.videoId = obj.video_id ? obj.video_id : -1;
        this.currentTime = obj.current_time ? obj.current_time : -1;
        this.updatedAt = obj.updated_at ? obj.updated_at : -1;
    }


    toJson(): {} {
        return {
            video_id: this.videoId,
            current_time: this.currentTime,
            updated_at: this.updatedAt,
        }
    }
}