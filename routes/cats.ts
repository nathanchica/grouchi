import { Router, Request, Response } from 'express';

const router: Router = Router();
interface Age {
    years: number;
    months: number;
}

interface Cat {
    alias: string;
    displayName: string;
    displayPronouns: string;
    aboutItems: Array<string>;
    navigationThumbnailImgSrc: string;
    navigationThumbnailImgAlt: string;
    coverPhotoImgSrc: string;
    coverPhotoImgAlt: string;
}

interface NavigationItem {
    targetView: string;
    targetGallery: string;
    imgSrc: string;
    imgAlt: string;
    label: string;
}

const catsData: { [alias: string]: Cat } = {
    groucho: {
        alias: 'groucho',
        displayName: 'Groucho',
        displayPronouns: 'he/him',
        aboutItems: [
            'Conqueror of boxes',
            'Will definitely let you know when he is hungry',
            'Very food-motivated',
            'Definitely need to hide food from him',
            'First to run away and hide from new people',
            'Likes to bother Chica (and me)',
            'Cuddly and likes to lay on my lap',
            'Chipped his right fang a long time ago',
            'Loves climbing',
            'Loves head scratches',
            'Prefers horizontal scratch surfaces'
        ],
        coverPhotoImgSrc: '/img/about_groucho_1.jpg',
        coverPhotoImgAlt: 'Groucho the Cat, laying down',
        navigationThumbnailImgSrc: '/img/about_groucho_thumbnail.jpg',
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
        coverPhotoImgSrc: '/img/about_chica_1.jpg',
        coverPhotoImgAlt: 'Chica the Cat, laying down on a drying rack',
        navigationThumbnailImgSrc: '/img/about_chica_thumbnail.jpg',
        navigationThumbnailImgAlt: 'Chica the Cat, sitting by a window overlooking a city'
    }
};

function calculateAge(birthDate: Date): Age {
    const today = new Date();

    let years = today.getFullYear() - birthDate.getFullYear();
    let months = today.getMonth() - birthDate.getMonth();

    if (months < 0 || (months === 0 && today.getDate() < birthDate.getDate())) {
        years--;
        months += 12;
    }

    if (today.getDate() < birthDate.getDate()) {
        months--;
    }

    return { years, months };
}

function renderNavigationItem(item: NavigationItem): string {
    // Create a user-friendly URL path - replace all underscores with hyphens
    const urlPath = item.targetView.replace(/_/g, '-');

    return /* html */ `
        <div
            class="group relative flex-1 cursor-pointer" 
            hx-get="/api/cats/about/${item.targetView}" 
            hx-target="#about-section" 
            hx-swap="innerHTML show:window:top"
            hx-push-url="/cats/${urlPath}"
            hx-on::after-request="htmx.ajax('GET', '/api/cats/about_navigation/${item.targetGallery}', '#about-navigation-section')"
        >
            <img alt="${item.imgAlt}" src="${item.imgSrc}" class="max-h-[480px] w-full object-cover" />
            <div class="backdrop-blur-0 absolute inset-0 flex items-center justify-center bg-black/0 transition-all duration-300 group-hover:bg-black/30 group-hover:backdrop-blur-xs">
                <p class="font-family-playfair text-xl font-bold text-white opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                    ${item.label}
                </p>
            </div>
        </div>
    `;
}

router.get('/about_navigation/:view', (req: Request, res: Response): void => {
    const view = req.params.view;

    const { groucho, chica } = catsData;
    const grouchoAndChicaNavigationItem: NavigationItem = {
        targetView: 'groucho_and_chica',
        targetGallery: 'groucho_and_chica',
        imgSrc: '/img/about_grouchi_thumbnail.jpg',
        imgAlt: 'Groucho and Chica together',
        label: 'Groucho & Chica'
    };

    const navigationConfigs: Record<string, NavigationItem[]> = {
        groucho_and_chica: [
            {
                targetView: groucho.alias,
                targetGallery: groucho.alias,
                imgSrc: groucho.navigationThumbnailImgSrc,
                imgAlt: groucho.navigationThumbnailImgAlt,
                label: groucho.displayName
            },
            {
                targetView: chica.alias,
                targetGallery: chica.alias,
                imgSrc: chica.navigationThumbnailImgSrc,
                imgAlt: chica.navigationThumbnailImgAlt,
                label: chica.displayName
            }
        ],
        groucho: [
            grouchoAndChicaNavigationItem,
            {
                targetView: chica.alias,
                targetGallery: chica.alias,
                imgSrc: chica.navigationThumbnailImgSrc,
                imgAlt: chica.navigationThumbnailImgAlt,
                label: chica.displayName
            }
        ],
        chica: [
            {
                targetView: groucho.alias,
                targetGallery: groucho.alias,
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
    const age = calculateAge(birthDate);

    let ageText = `${age.years} year${age.years !== 1 ? 's' : ''}`;
    if (age.months > 0) {
        ageText += ` and ${age.months} month${age.months !== 1 ? 's' : ''}`;
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

    const listHtml = aboutItems.map((item) => `<li>${item}</li>`).join('');
    const html = /* html */ `
        <img
            alt="Groucho and Chica laying down together"
            src="/img/about_grouchi_1.jpg"
            class="max-h-[480px] w-full object-cover"
        />
        <div class="p-8">
            <h2 class="mb-4 text-2xl font-bold text-gray-800">About Groucho and Chica</h2>
            <ul role="list" class="list-inside list-disc space-y-2 text-gray-700">
                ${listHtml}
            </ul>
        </div>
    `;
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

    const {
        aboutItems,
        displayName,
        displayPronouns,
        coverPhotoImgSrc: imageSrc,
        coverPhotoImgAlt: imageAlt
    } = catsData[catName];

    const listHtml = aboutItems.map((item) => `<li>${item}</li>`).join('');
    const html = /* html */ `
        <img
            alt="${imageAlt}"
            src="${imageSrc}"
            class="max-h-[480px] w-full object-cover"
        />
        <div class="p-8">
            <h2 class="mb-2 text-2xl font-bold text-gray-800">About ${displayName}</h2>
            <p class="mb-4 text-sm text-gray-500 italic">${displayPronouns}</p>
            <ul role="list" class="list-inside list-disc space-y-2 text-gray-700">
                ${listHtml}
            </ul>
        </div>
    `;
    res.send(html);
});

export default router;
