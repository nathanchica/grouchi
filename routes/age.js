import { Router } from 'express';

const router = Router();

function calculateAge(birthDate) {
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

router.get('/', (_req, res) => {
    const birthDate = new Date('2021-07-02');
    const age = calculateAge(birthDate);

    let ageText = `${age.years} year${age.years !== 1 ? 's' : ''}`;
    if (age.months > 0) {
        ageText += ` and ${age.months} month${age.months !== 1 ? 's' : ''}`;
    }
    ageText += ' old';

    res.send(ageText);
});

export default router;
