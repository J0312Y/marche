import api from './client';

/** « Demandez aux acheteurs » : questions sur un article, réponses de la boutique et des clients qui l'ont reçu */
const questions = {
  list: (articleId) => api.get(`/articles/${articleId}/questions`), // { questions, can_answer }
  ask: (articleId, question) => api.post(`/articles/${articleId}/questions`, { question }),
  answer: (questionId, answer) => api.post(`/questions/${questionId}/answers`, { answer }),
};

export default questions;
