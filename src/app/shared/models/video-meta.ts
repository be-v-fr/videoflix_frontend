export class VideoMeta {
    id: number;
    title: string;
    description: string;
    durationInSeconds: number;
    playlistUrl: string;
    thumbUrl: string;

    constructor(obj: any) {
        this.id = obj.id ? obj.id : -1;
        this.title = obj.title ? obj.title : '';
        this.description = obj.description ? obj.description : '';
        this.durationInSeconds = obj.duration_in_seconds ? obj.duration_in_seconds : -1;
        this.playlistUrl = obj.playlist_url ? obj.playlist_url : '';
        this.thumbUrl = obj.thumbnail ? obj.thumbnail : '';
    }

    toJson(): {} {
        return {
            id: this.id,
            title: this.title,
            description: this.description,
            duration_in_seconds: this.durationInSeconds,
            playlist_url: this.playlistUrl,
            thumbnail: this.thumbUrl,
        }
    }

    showDuration(): string {
        const seconds: number = Math.round(this.durationInSeconds);
        if(seconds == -1) {
            return 'Unknown duration';
        } else if (seconds < 60) {
            return Math.round(seconds) + ' s';
        } else {
            const hours: number = Math.floor(seconds / 3600);
            const minutes: number = Math.floor((seconds / 60) % 60);
            let value: string = (hours > 0) ? hours + ' h' : '';
            switch(minutes) {
                case 0: return value;
                case 1: return value + ' ' + minutes + ' min.';
                default: return value + ' ' + minutes + ' mins.';
            }
        }
    }
}