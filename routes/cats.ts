import { Router, Request, Response } from 'express';
import { calculateAge } from '../src/utils/date.js';
import { renderNavigationItem, NavigationItemProps } from '../src/components/navigation.js';
import { renderAboutSection, renderPhotoCarousel } from '../src/components/about.js';
import { catsData, VALID_ALIASES } from '../src/data/cats.js';
import { getAssetUrl } from '../src/utils/assets.js';

const router: Router = Router();

router.get('/about_navigation/:view', (req: Request, res: Response): void => {
    const { view } = req.params;

    const { groucho, chica } = catsData;
    const grouchoAndChicaNavigationItem: NavigationItemProps = {
        targetAlias: 'groucho_and_chica',
        imgSrc: getAssetUrl('groucho_and_chica', 'nav'),
        imgAlt: 'Groucho and Chica together',
        label: 'Groucho & Chica'
    };

    const navigationConfigs: Record<string, NavigationItemProps[]> = {
        groucho_and_chica: [
            {
                targetAlias: groucho.alias,
                imgSrc: groucho.navigationThumbnailImgSrc,
                imgAlt: groucho.navigationThumbnailImgAlt,
                label: groucho.displayName
            },
            {
                targetAlias: chica.alias,
                imgSrc: chica.navigationThumbnailImgSrc,
                imgAlt: chica.navigationThumbnailImgAlt,
                label: chica.displayName
            }
        ],
        groucho: [
            grouchoAndChicaNavigationItem,
            {
                targetAlias: chica.alias,
                imgSrc: chica.navigationThumbnailImgSrc,
                imgAlt: chica.navigationThumbnailImgAlt,
                label: chica.displayName
            }
        ],
        chica: [
            {
                targetAlias: groucho.alias,
                imgSrc: groucho.navigationThumbnailImgSrc,
                imgAlt: groucho.navigationThumbnailImgAlt,
                label: groucho.displayName
            },
            grouchoAndChicaNavigationItem
        ]
    };

    const items = navigationConfigs[view];
    if (!items) {
        res.status(404).send(/* html */ `<p class="text-red-500">View not found!</p>`);
        return;
    }

    const html = items.map(renderNavigationItem).join('');
    res.send(html);
});

router.get('/about/groucho_and_chica', (_req: Request, res: Response): void => {
    const birthDate = new Date('2021-07-02');
    const { years, months } = calculateAge(birthDate);

    let ageText = `${years} year${years !== 1 ? 's' : ''}`;
    if (months > 0) {
        ageText += ` and ${months} month${months !== 1 ? 's' : ''}`;
    }
    ageText += ' old';

    const aboutItems: Array<string> = [
        '<strong>Gotcha day:</strong> November 10, 2021',
        /* html */ `Adopted from <a class="text-orange-600 hover:underline" href="https://www.sfspca.org/" target="_blank">SF SPCA</a>`,
        'The names, Groucho and Chica, are from the shelter',
        'They were in the same shelter room and bonded together',
        'Not siblings, but they have similar fur patterns',
        'Both are American Shorthair cats',
        `Both are born on July 2, 2021 (currently ${ageText})`,
        'They love to play and sleep together',
        'They both like to change up where they sleep every now and then',
        'Both are very curious, but easily get scared at the same time',
        "They don't bite nor scratch",
        'Let them approach you at their own pace!'
    ];

    const { displayName, photos } = catsData.groucho_and_chica;

    const html = renderAboutSection({
        alias: 'groucho_and_chica',
        title: `About ${displayName}`,
        aboutItems,
        initialPhoto: photos[0],
        photos,
        numPhotos: photos.length
    });

    res.send(html);
});

router.get('/about/:name', (req: Request, res: Response): void => {
    const catName = req.params.name.toLowerCase();

    if (!Object.keys(catsData).includes(catName)) {
        res.status(404).send(/* html */ `
            <div class="p-8">
                <h2 class="mb-4 text-2xl font-bold text-red-500">Cat not found!</h2>
            </div>
        `);
        return;
    }

    const { aboutItems, displayName, displayPronouns, photos } = catsData[catName];

    const html = renderAboutSection({
        alias: catName,
        title: `About ${displayName}`,
        subtitle: displayPronouns,
        aboutItems: aboutItems,
        initialPhoto: photos[0],
        photos,
        numPhotos: photos.length
    });

    res.send(html);
});

router.get('/about/:alias/photos/:index', (req: Request, res: Response): void => {
    const catAlias = req.params.alias.toLowerCase();
    const transitionDirection = req.query.direction as 'next' | 'prev' | undefined;

    if (!VALID_ALIASES.includes(catAlias)) {
        res.status(404).send(/* html */ `
            <div class="p-8">
                <h2 class="mb-4 text-2xl font-bold text-red-500">Cat not found!</h2>
            </div>
        `);
        return;
    }

    const photoIndex = parseInt(req.params.index);
    const { photos } = catsData[catAlias];

    if (isNaN(photoIndex) || photoIndex < 0 || photoIndex >= photos.length) {
        res.status(404).send(/* html */ `<div class="text-red-500">Photo not found</div>`);
        return;
    }

    const numPhotos = photos.length;
    const nextPhotoIndex = (photoIndex + 1) % numPhotos;
    const prevPhotoIndex = photoIndex === 0 ? numPhotos - 1 : photoIndex - 1;

    const { src, altText } = photos[photoIndex];
    const nextImageSrc = photos[nextPhotoIndex]?.src;
    const prevImageSrc = photos[prevPhotoIndex]?.src;

    const html = renderPhotoCarousel({
        imageSrc: src,
        imageAlt: altText,
        alias: catAlias,
        nextIndex: nextPhotoIndex,
        prevIndex: prevPhotoIndex,
        nextImageSrc,
        prevImageSrc,
        currentIndex: photoIndex,
        numPhotos,
        transitionDirection
    });

    res.send(html);
});

export default router;
