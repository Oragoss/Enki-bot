// import Discord from 'discord.js';
import TriviaService from '../services/TriviaService';

module.exports = {
	name: 'trivia',
	aliases: ['t', 't:'],
	description: 'Tell Enki-bot to ask you a random trivia question!',
	execute(message) {
		TriviaService.getQuestion(message);
	}
};
