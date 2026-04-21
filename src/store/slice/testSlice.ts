import { createSlice, PayloadAction } from '@reduxjs/toolkit';

type AnswerMap = Record<string, string>;

interface TestState {
  questions: any[];
  answers: AnswerMap;
  result: {
    score: number;
    total: number;
    correct: number;
    wrong: number;
    notAttempted: number;
  } | null;
}

const initialState: TestState = {
  questions: [],
  answers: {},
  result: null,
};

const testSlice = createSlice({
  name: 'test',
  initialState,
  reducers: {
    setQuestions(state, action: PayloadAction<any[]>) {
      state.questions = action.payload;
    },

    saveAnswer(state, action: PayloadAction<{ qId: string; ans: string }>) {
      state.answers[action.payload.qId] = action.payload.ans;
    },

    submitTest(state) {
      let correct = 0;
      let wrong = 0;
      let notAttempted = 0;

      state.questions.forEach(q => {
        const userAnswer = state.answers[q.id];

        if (!userAnswer) {
          notAttempted++;
        } else if (userAnswer === q.correctAnswer) {
          correct++;
        } else {
          wrong++;
        }
      });

      const total = state.questions.length;

      state.result = {
        score: Math.round((correct / total) * 100) || 0,
        total,
        correct,
        wrong,
        notAttempted,
      };
    },

    resetTest(state) {
      state.answers = {};
      state.result = null;
    },
  },
});

export const { setQuestions, saveAnswer, submitTest, resetTest } =
  testSlice.actions;

export default testSlice.reducer;
