import { Cat } from '../types/cat.js';
import { getAssetUrl } from '../utils/assets.js';

export const VALID_ALIASES = ['groucho', 'chica', 'groucho_and_chica'];

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
        navigationThumbnailImgSrc: getAssetUrl('groucho', 'nav'),
        navigationThumbnailImgAlt: 'Groucho the Cat, laying on a woven blanket',
        profilePhoto: {
            src: getAssetUrl('groucho', 'thumbnail'),
            altText: 'Groucho the Cat'
        },
        photos: [
            {
                src: getAssetUrl('groucho', 1),
                altText: 'Groucho the Cat, laying down'
            },
            {
                src: getAssetUrl('groucho', 2),
                altText: 'Groucho the Cat, laying awake on an arm'
            },
            {
                src: getAssetUrl('groucho', 3),
                altText: 'Groucho the Cat, laying asleep on an arm'
            },
            {
                src: getAssetUrl('groucho', 4),
                altText: 'Groucho the Cat, laying down on a woven blanket'
            },
            {
                src: getAssetUrl('groucho', 5),
                altText: 'Groucho the Cat, laying down on a couch'
            },
            {
                src: getAssetUrl('groucho', 6),
                altText: 'Groucho the Cat'
            },
            {
                src: getAssetUrl('groucho', 7),
                altText: 'Groucho the Cat, sitting by a window overlooking a city'
            },
            {
                src: getAssetUrl('groucho', 8),
                altText: 'Groucho the Cat, sitting by a window overlooking a city'
            },
            {
                src: getAssetUrl('groucho', 9),
                altText: 'Groucho the Cat, laying inside a cardboard box'
            },
            {
                src: getAssetUrl('groucho', 10),
                altText: 'Groucho the Cat, laying down on a small table'
            },
            {
                src: getAssetUrl('groucho', 11),
                altText: 'Groucho the Cat'
            },
            {
                src: getAssetUrl('groucho', 12),
                altText: 'Groucho the Cat'
            },
            {
                src: getAssetUrl('groucho', 13),
                altText: 'Groucho the Cat, standing by an open window overlooking a city'
            },
            {
                src: getAssetUrl('groucho', 14),
                altText: 'Groucho the Cat, sitting in a ripped-open cardboard box'
            },
            {
                src: getAssetUrl('groucho', 15),
                altText: 'Groucho the Cat, sitting in a cardboard box'
            },
            {
                src: getAssetUrl('groucho', 16),
                altText: 'Groucho the Cat, laying down on a keyboard'
            },
            {
                src: getAssetUrl('groucho', 17),
                altText: 'Groucho the Cat, sitting in a Hello Fresh cardboard box'
            },
            {
                src: getAssetUrl('groucho', 18),
                altText: 'Groucho the Cat, laying down'
            },
            {
                src: getAssetUrl('groucho', 19),
                altText: 'Groucho the Cat, laying down on an arm and chest'
            },
            {
                src: getAssetUrl('groucho', 20),
                altText: 'Groucho the Cat, laying down by a keyboard'
            },
            {
                src: getAssetUrl('groucho', 21),
                altText: 'Groucho the Cat, sitting on a lap'
            }
        ]
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
        navigationThumbnailImgSrc: getAssetUrl('chica', 'nav'),
        navigationThumbnailImgAlt: 'Chica the Cat, sitting by a window overlooking a city',
        profilePhoto: {
            src: getAssetUrl('chica', 'thumbnail'),
            altText: 'Chica the Cat'
        },
        photos: [
            {
                src: getAssetUrl('chica', 1),
                altText: 'Chica the Cat, laying down on a drying rack'
            },
            {
                src: getAssetUrl('chica', 2),
                altText: 'Chica the Cat, laying down on carpet'
            },
            {
                src: getAssetUrl('chica', 3),
                altText: 'Chica the Cat, laying asleep on a woven blanket'
            },
            {
                src: getAssetUrl('chica', 4),
                altText: 'Chica the Cat, holding a wire'
            },
            {
                src: getAssetUrl('chica', 5),
                altText: 'Chica the Cat, laying down on a bed'
            },
            {
                src: getAssetUrl('chica', 6),
                altText: 'Chica the Cat, laying down on an arm'
            },
            {
                src: getAssetUrl('chica', 7),
                altText: 'Chica the Cat, sitting on a cat shaped rug'
            },
            {
                src: getAssetUrl('chica', 8),
                altText: 'Chica the Cat, standing on a door frame'
            },
            {
                src: getAssetUrl('chica', 9),
                altText: 'Chica the Cat, asleep while hugging an arm'
            },
            {
                src: getAssetUrl('chica', 10),
                altText: 'Chica the Cat, peeking out the side of an office chair'
            },
            {
                src: getAssetUrl('chica', 11),
                altText: 'Chica the Cat, laying asleep on a drying rack'
            },
            {
                src: getAssetUrl('chica', 12),
                altText: 'Chica the Cat, sitting on top of a couch pillow'
            },
            {
                src: getAssetUrl('chica', 13),
                altText: 'Chica the Cat, laying asleep on a mouse pad'
            },
            {
                src: getAssetUrl('chica', 14),
                altText: 'Chica the Cat, laying down in a small play house'
            },
            {
                src: getAssetUrl('chica', 15),
                altText: 'Chica the Cat, looking outside a window'
            },
            {
                src: getAssetUrl('chica', 16),
                altText: 'Chica the Cat, looking outside a window'
            },
            {
                src: getAssetUrl('chica', 17),
                altText: 'Chica the Cat, laying asleep on a table by a window'
            },
            {
                src: getAssetUrl('chica', 18),
                altText: 'Chica the Cat, laying down on an office chair with sunlight on her'
            },
            {
                src: getAssetUrl('chica', 19),
                altText: 'Chica the Cat'
            },
            {
                src: getAssetUrl('chica', 20),
                altText: 'Chica the Cat, sitting on a hoodie with similar colors as her'
            },
            {
                src: getAssetUrl('chica', 21),
                altText: 'Chica the Cat, laying asleep on a couch'
            },
            {
                src: getAssetUrl('chica', 22),
                altText: 'Chica the Cat, sitting by her water and food dispensers'
            },
            {
                src: getAssetUrl('chica', 23),
                altText: 'Chica the Cat'
            }
        ]
    },
    groucho_and_chica: {
        alias: 'groucho_and_chica',
        displayName: 'Groucho and Chica',
        navigationThumbnailImgSrc: getAssetUrl('groucho_and_chica', 'nav'),
        navigationThumbnailImgAlt: 'Groucho and Chica together',
        photos: [
            {
                src: getAssetUrl('groucho_and_chica', 1),
                altText: 'Groucho and Chica laying down together on a blanket'
            },
            {
                src: getAssetUrl('groucho_and_chica', 2),
                altText: 'Groucho and Chica. Chica is in a playhouse while Groucho is outside it'
            },
            {
                src: getAssetUrl('groucho_and_chica', 3),
                altText: 'Groucho and Chica, eating together on a table by a window overlooking a city'
            },
            {
                src: getAssetUrl('groucho_and_chica', 4),
                altText: 'Groucho and Chica, both sitting on separate steps of a step ladder'
            },
            {
                src: getAssetUrl('groucho_and_chica', 5),
                altText: 'Groucho and Chica, laying down on a desk'
            },
            {
                src: getAssetUrl('groucho_and_chica', 6),
                altText: 'Groucho and Chica, sitting together on an office chair'
            },
            {
                src: getAssetUrl('groucho_and_chica', 7),
                altText: 'Groucho and Chica, sitting together on an office chair'
            },
            {
                src: getAssetUrl('groucho_and_chica', 8),
                altText: 'Groucho and Chica, laying down together on a desk'
            },
            {
                src: getAssetUrl('groucho_and_chica', 9),
                altText: 'Groucho and Chica, laying down together on a desk'
            },
            {
                src: getAssetUrl('groucho_and_chica', 10),
                altText: 'Groucho and Chica, sitting together on a small chair'
            },
            {
                src: getAssetUrl('groucho_and_chica', 11),
                altText: 'Groucho and Chica, sitting together in a pet carrier'
            },
            {
                src: getAssetUrl('groucho_and_chica', 12),
                altText: 'Groucho and Chica, laying together on a table by a window overlooking a city'
            },
            {
                src: getAssetUrl('groucho_and_chica', 13),
                altText: 'Groucho licking Chica clean'
            },
            {
                src: getAssetUrl('groucho_and_chica', 14),
                altText: 'Groucho and Chica, laying together in a small playhouse'
            },
            {
                src: getAssetUrl('groucho_and_chica', 15),
                altText: 'Groucho and Chica, laying together in a small playhouse'
            },
            {
                src: getAssetUrl('groucho_and_chica', 16),
                altText: 'Groucho and Chica, both laying down on a couch'
            },
            {
                src: getAssetUrl('groucho_and_chica', 17),
                altText: 'Groucho and Chica, both laying down on a drying rack'
            },
            {
                src: getAssetUrl('groucho_and_chica', 18),
                altText: 'Groucho and Chica, both sitting on a bed'
            },
            {
                src: getAssetUrl('groucho_and_chica', 19),
                altText: 'Groucho and Chica, both laying down in a cardboard box'
            },
            {
                src: getAssetUrl('groucho_and_chica', 20),
                altText: 'Groucho and Chica, both laying down on a couch'
            },
            {
                src: getAssetUrl('groucho_and_chica', 21),
                altText: 'Groucho and Chica, both standing on a table by a window overlooking a city'
            },
            {
                src: getAssetUrl('groucho_and_chica', 22),
                altText: 'Groucho and Chica, sitting in separate boxes that are on top of each other'
            },
            {
                src: getAssetUrl('groucho_and_chica', 23),
                altText: 'Groucho and Chica, sitting inside a cabinet'
            },
            {
                src: getAssetUrl('groucho_and_chica', 24),
                altText: 'Groucho and Chica, laying down on a couch'
            }
        ]
    }
};
