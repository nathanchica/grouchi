import { Photo } from './photo.js';

export interface Age {
    years: number;
    months: number;
}

export interface Cat {
    alias: string;
    displayName: string;
    displayPronouns?: string;
    aboutItems?: Array<string>;
    navigationThumbnailImgSrc: string;
    navigationThumbnailImgAlt: string;
    photos: Array<Photo>;
}
