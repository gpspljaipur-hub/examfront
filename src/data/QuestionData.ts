export interface QuestionType {
    id: string;
    questionText: string;
    equation?: string;
    options: { id: string; text: string }[];
    correctAnswer: string;
    type: string;
    points: number;
    hint: string;
}

export const questionData: QuestionType[] = [
    {
        id: '1',
        questionText: 'Solve for x:',
        equation: 'x² - 5x + 6 = 0',
        options: [
            { id: 'A', text: 'x = 2, 3' },
            { id: 'B', text: 'x = -2, -3' },
            { id: 'C', text: 'x = 1, 6' },
            { id: 'D', text: 'x = -1, -6' },
        ],
        correctAnswer: 'A',
        type: 'Multiple Choice',
        points: 2,
        hint: 'Quadratic equations of form ax² + bx + c = 0 can be factored by finding numbers that multiply to c and add to b.',
    },
    {
        id: '2',
        questionText: 'Which of the following is a prime number?',
        options: [
            { id: 'A', text: '15' },
            { id: 'B', text: '21' },
            { id: 'C', text: '31' },
            { id: 'D', text: '49' },
        ],
        correctAnswer: 'C',
        type: 'Multiple Choice',
        points: 1,
        hint: 'A prime number is a natural number greater than 1 that has no positive divisors other than 1 and itself.',
    },
    {
        id: '3',
        questionText: 'Simplify the expression:',
        equation: '3(x + 4) - 2(x - 1)',
        options: [
            { id: 'A', text: 'x + 10' },
            { id: 'B', text: 'x + 14' },
            { id: 'C', text: '5x + 10' },
            { id: 'D', text: 'x + 11' },
        ],
        correctAnswer: 'B',
        type: 'Multiple Choice',
        points: 2,
        hint: 'Distribute the numbers outside the parentheses and then combine like terms.',
    },
    {
        id: '4',
        questionText: 'What is the value of pi (π) up to two decimal places?',
        options: [
            { id: 'A', text: '3.12' },
            { id: 'B', text: '3.14' },
            { id: 'C', text: '3.16' },
            { id: 'D', text: '3.18' },
        ],
        correctAnswer: 'B',
        type: 'Multiple Choice',
        points: 1,
        hint: 'Pi is approximately the ratio of a circle\'s circumference to its diameter.',
    },
    {
        id: '5',
        questionText: 'Solve for y in the equation:',
        equation: '2y + 8 = 16',
        options: [
            { id: 'A', text: 'y = 2' },
            { id: 'B', text: 'y = 4' },
            { id: 'C', text: 'y = 6' },
            { id: 'D', text: 'y = 8' },
        ],
        correctAnswer: 'B',
        type: 'Multiple Choice',
        points: 2,
        hint: 'Subtract 8 from both sides and then divide by 2.',
    },
];
