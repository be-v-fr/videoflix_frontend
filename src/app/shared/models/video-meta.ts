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
        this.fileUrl = obj.file ? obj.file : '';
        this.thumbUrl = obj.thumbnail ? obj.thumbnail : '';
    }

    toJson(): {} {
        return {
            title: this.title,
            description: this.description,
            duration_in_minutes: this.durationInMinutes,
            file: this.fileUrl,
            thumbnail: this.thumbUrl,
        }
    }
}