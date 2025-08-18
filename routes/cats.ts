import { Router, Request, Response } from 'express';

const router: Router = Router();

interface Cat {
    id: number;
    name: string;
    personality: string;
    favoriteToy: string;
    fact: string;
}

const cats: Cat[] = [
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
