export interface Age {
    years: number;
    months: number;
}

export interface Cat {
    alias: string;
    displayName: string;
    displayPronouns: string;
    aboutItems: Array<string>;
    navigationThumbnailImgSrc: string;
    navigationThumbnailImgAlt: string;
    coverPhotoImgSrc: string;
    coverPhotoImgAlt: string;
}
