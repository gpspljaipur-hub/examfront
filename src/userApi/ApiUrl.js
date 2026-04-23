const ApiUrl = {
  // Auth
  CheckNumber: '/users/send-otp', // POST
  VERIFY_OTP: '/users/verify-otp', // POST
  GET_BOARDS: '/boards/get-board',
  GET_CLASSES: '/classes/get-class',
  GET_SUBJECT: '/subjects/get-subject',
  GET_CHAPTER: '/chapters/get-chapter',
  GET_QUESTION: '/ai/generate-questions',
  GET_SOLUTIONS: '/questions/get-by-test',
  ADD_PROFILE: '/profile/save',
  GET_PROFILE: '/profile/get',
  AI_CHAT_QUESTIONS: '/chat/chat-question',
};

export default ApiUrl;
