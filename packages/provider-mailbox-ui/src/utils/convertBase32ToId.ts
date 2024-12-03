const dictionary = [
    1,
    2,
    3,
    4,
    5,
    6,
    7,
    8,
    9,
    'A',
    'B',
    'C',
    'D',
    'E',
    'F',
    'G',
    'H',
    'K',
    'L',
    'M',
    'N',
    'P',
    'Q',
    'R',
    'S',
    'T',
    'U',
    'V',
    'W',
    'X',
    'Y',
    'Z',
];

export function convertIdToBase32(id: number): string {
    const result = [];

    for (let i = 0; i < 30; i += 5) {
        const index = (id & (0b11111 << i)) >> i;

        result.push(dictionary[index]);
    }

    return result.join('');
}

export function convertBase32ToId(str: string): number {
    const result = str
        .split('')
        .map((x) => (isNaN(Number(x)) ? x : Number(x)))
        .reduce((acc, s, n) => {
            const num = dictionary.indexOf(s);

            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
            // @ts-ignore
            acc = acc | (num << (5 * n));

            return acc;
        }, 0);

    return Number(result);
}
