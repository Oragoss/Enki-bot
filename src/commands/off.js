import TriviaService from '../services/TriviaService';

module.exports = {
	name: 'off',
	description: 'Tells Enki-bot to stop playing.',
	execute() {
		TriviaService.turnOffTrivia();
	}
};
