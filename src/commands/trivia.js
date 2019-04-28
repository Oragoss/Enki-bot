import TriviaService from '../services/TriviaService';

module.exports = {
	name: 'trivia',
	description: 'Tell Enki-bot to ask you a random trivia question!',
	execute(message) {
		TriviaService.getQuestion(message);
	}
};
