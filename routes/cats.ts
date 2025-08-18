import { Router, Request, Response } from 'express';

const router: Router = Router();

interface Cat {
    id: number;
    name: string;
    personality: string;
    favoriteToy: string;
    fact: string;
}

interface Age {
    years: number;
    months: number;
}

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

const cats: Array<Cat> = [
    {
        id: 1,
        name: 'Groucho',
        personality: 'Mischievous',
        favoriteToy: 'Feather wand',
        fact: 'Loves to climb on everything!'
    },
    {
        id: 2,
        name: 'Chica',
        personality: 'Cuddly',
        favoriteToy: 'Catnip mouse',
        fact: 'Purrs louder than a motor!'
    }
];

router.get('/about', (_req: Request, res: Response): void => {
    const birthDate = new Date('2021-07-02');
    const age = calculateAge(birthDate);

    let ageText = `${age.years} year${age.years !== 1 ? 's' : ''}`;
    if (age.months > 0) {
        ageText += ` and ${age.months} month${age.months !== 1 ? 's' : ''}`;
    }
    ageText += ' old';

    const aboutItems: Array<string> = [
        '<strong>Gotcha day:</strong> November 10, 2021',
        'Adopted from <a class="text-orange-600 hover:underline" href="https://www.sfspca.org/" target="_blank">SF SPCA</a>',
        'The names, Groucho and Chica, are from the shelter',
        'They were in the same shelter room and bonded together',
        'Not siblings, but they have similar fur patterns',
        'Both are American Shorthair cats',
        `Both are born on July 2, 2021 (currently ${ageText})`,
        'They love to play and sleep together'
    ];

    const html = aboutItems.map((item) => `<li>${item}</li>`).join('');
    res.send(html);
});

router.get('/:id', (req: Request, res: Response): void => {
    const catId = parseInt(req.params.id);
    const cat = cats.find((c) => c.id === catId);

    if (!cat) {
        res.status(404).send('<p class="text-red-500">Cat not found!</p>');
        return;
    }

    res.send(`
      <div class="mt-4 border-l-4 border-orange-500 bg-orange-50 p-4">
        <p class="text-gray-900"><span class="font-bold text-orange-600">Fun fact about ${cat.name}:</span> ${cat.fact}</p>
      </div>
    `);
});

export default router;
