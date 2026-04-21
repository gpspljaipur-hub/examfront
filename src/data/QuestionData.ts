export interface QuestionType {
    id: string;
    questionText: string;
    equation?: string;
    options: { id: string; text: string }[];
    correctAnswer: string;
    type: string;
    points: number;
    hint: string;
    solution: string;
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
        solution: 'To solve x² - 5x + 6 = 0, we look for two numbers that multiply to 6 and add to -5. These numbers are -2 and -3. \n\nSo, (x - 2)(x - 3) = 0. \n\nThis gives x = 2 and x = 3. Therefore, the correct option is A.',
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
        solution: 'Let\'s check each option:\n- 15 is divisible by 3 and 5 (15 = 3 × 5).\n- 21 is divisible by 3 and 7 (21 = 3 × 7).\n- 31 is only divisible by 1 and 31.\n- 49 is divisible by 7 (49 = 7 × 7).\n\nSince 31 has no other divisors, it is a prime number. Correct option is C.',
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
        solution: 'Step 1: Distribute 3 into (x + 4) and -2 into (x - 1):\n3x + 12 - 2x + 2\n\nStep 2: Combine like terms (x terms and constants):\n(3x - 2x) + (12 + 2) = x + 14.\n\nSo, the simplified expression is x + 14. Correct option is B.',
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
        solution: 'The value of pi (π) is an irrational number approximately equal to 3.14159... \nRounding it to two decimal places gives 3.14. Correct option is B.',
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
        solution: 'Step 1: Subtract 8 from both sides:\n2y = 16 - 8\n2y = 8\n\nStep 2: Divide by 2:\ny = 8 / 2\ny = 4\n\nCorrect option is B.',
    },
];