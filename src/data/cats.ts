import { Cat } from '../types/cat.js';

export const catsData: { [alias: string]: Cat } = {
    groucho: {
        alias: 'groucho',
        displayName: 'Groucho',
        displayPronouns: 'he/him',
        aboutItems: [
            'Conqueror of boxes',
            'Will definitely let you know when he is hungry',
            'Very food-motivated',
            'Definitely need to hide food from him',
            'First to run away and hide from people and loud noises',
            'Likes to bother Chica (and me)',
            'Cuddly and likes to lay on my lap',
            'Chipped his right fang a long time ago',
            'Loves climbing',
            'Loves head scratches',
            'Prefers horizontal scratch surfaces'
        ],
        coverPhotoImgSrc: 'https://cdn.jsdelivr.net/gh/nathanchica/grouchi-assets@main/img/groucho/groucho-1.jpg',
        coverPhotoImgAlt: 'Groucho the Cat, laying down',
        navigationThumbnailImgSrc:
            'https://cdn.jsdelivr.net/gh/nathanchica/grouchi-assets@main/img/groucho/groucho-nav.jpg',
        navigationThumbnailImgAlt: 'Groucho the Cat, laying on a woven blanket'
    },
    chica: {
        alias: 'chica',
        displayName: 'Chica',
        displayPronouns: 'she/her',
        aboutItems: [
            'The mess maker',
            'Destroyer of furniture and decorations',
            'Sheds A LOT',
            'Very quiet',
            'First to greet me when I come back home (often waiting by the door)',
            'Very playful (loves chasing, especially loves toy springs)',
            'Will growl at reflected light and bugs',
            'Loves bird watching',
            'Likes to sleep near me',
            'Loves whole body pets',
            'Prefers vertical scratch surfaces'
        ],
        coverPhotoImgSrc: 'https://cdn.jsdelivr.net/gh/nathanchica/grouchi-assets@main/img/chica/chica-1.jpg',
        coverPhotoImgAlt: 'Chica the Cat, laying down on a drying rack',
        navigationThumbnailImgSrc:
            'https://cdn.jsdelivr.net/gh/nathanchica/grouchi-assets@main/img/chica/chica-nav.jpg',
        navigationThumbnailImgAlt: 'Chica the Cat, sitting by a window overlooking a city'
    }
};
