import randn from '@stdlib/random-base-randn';
import shuffle from '@stdlib/random-shuffle';

export function generateData(size) {
    const data = [];

    for (let i = 0; i < size; i++) {
        data.push(randn());
    }

    const shuffled = shuffle(data.slice());

    return shuffled;
}