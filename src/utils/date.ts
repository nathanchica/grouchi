import { Age } from '../types/cat';

export function calculateAge(birthDate: Date): Age {
    const today = new Date();

    if (birthDate > today) {
        throw new Error('Birth date cannot be in the future');
    }

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
