/**
 * Represents the metadata for a video, inluding the video playlist
 * and thumbnail URLs to access the actual content.
 */
export class VideoMeta {
    id: number;
    title: string;
    description: string;
    genre: string;
    durationInSeconds: number;
    playlistUrl: string;
    thumbUrl: string;
    createdAt: Date;


    constructor(obj: any) {
        this.id = obj.id ? obj.id : -1;
        this.title = obj.title ? obj.title : '';
        this.description = obj.description ? obj.description : '';
        this.genre = obj.genre ? obj.genre : '';
        this.durationInSeconds = obj.duration_in_seconds ? obj.duration_in_seconds : -1;
        this.playlistUrl = obj.playlist_url ? obj.playlist_url : '';
        this.thumbUrl = obj.thumbnail ? obj.thumbnail : '';
        this.createdAt = new Date(obj.created_at ? obj.created_at : -1);
    }

    
    /**
     * Returns duration formatted to string including adequate time units.
     */
    showDuration(): string {
        const seconds: number = Math.round(this.durationInSeconds);
        if(seconds == -1) {
            return 'Unknown duration';
        } else if (seconds < 60) {
            return Math.round(seconds) + ' s';
        } else {
            return this.formatToHoursAndMinutes(seconds);
        }
    }


    /**
     * Formats duration in seconds to hours and minutes.
     */
    private formatToHoursAndMinutes(seconds: number): string {
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