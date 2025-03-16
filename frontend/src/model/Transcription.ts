export default class Transcription {
    filename: string;
    transcription: string;

    constructor(filename: string, transcription: string) {
        this.filename = filename;
        this.transcription = transcription;
    }
}