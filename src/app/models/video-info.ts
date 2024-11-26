export class VideoInfo {
    title: string;
    durationInMinutes: number;
    thumbUrl: string;

    constructor(obj: any) {
        this.title = obj.title ? obj.title : '';
        this.durationInMinutes = obj.duration_in_minutes ? obj.duration_in_minutes : -1;
        this.thumbUrl = obj.thumb_url ? obj.thumb_url : '';
    }

    toJson(): {} {
        return {
            title: this.title,
            duration_in_minutes: this.durationInMinutes,
            thumb_url: this.thumbUrl,
        }
    }
}