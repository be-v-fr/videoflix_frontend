export class VideoMeta {
    title: string;
    description: string;
    durationInMinutes: number;
    fileUrl: string;
    thumbUrl: string;

    constructor(obj: any) {
        this.title = obj.title ? obj.title : '';
        this.description = obj.description ? obj.description : '';
        this.durationInMinutes = obj.duration_in_minutes ? obj.duration_in_minutes : -1;
        this.fileUrl = obj.fileUrl ? obj.fileUrl : '';
        this.thumbUrl = obj.thumb_url ? obj.thumb_url : '';
    }

    toJson(): {} {
        return {
            title: this.title,
            description: this.description,
            duration_in_minutes: this.durationInMinutes,
            file_url: this.fileUrl,
            thumb_url: this.thumbUrl,
        }
    }
}