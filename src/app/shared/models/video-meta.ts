export class VideoMeta {
    id: number;
    title: string;
    description: string;
    durationInMinutes: number;
    videoFilesUrl: string;
    thumbUrl: string;

    constructor(obj: any) {
        this.id = obj.id ? obj.id : -1;
        this.title = obj.title ? obj.title : '';
        this.description = obj.description ? obj.description : '';
        this.durationInMinutes = obj.duration_in_minutes ? obj.duration_in_minutes : -1;
        this.videoFilesUrl = obj.video_files_url ? obj.video_files_url : '';
        this.thumbUrl = obj.thumbnail ? obj.thumbnail : '';
    }

    toJson(): {} {
        return {
            id: this.id,
            title: this.title,
            description: this.description,
            duration_in_minutes: this.durationInMinutes,
            video_files_url: this.videoFilesUrl,
            thumbnail: this.thumbUrl,
        }
    }
}