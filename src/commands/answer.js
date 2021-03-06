import TriviaService from '../services/TriviaService';

module.exports = {
	name: 'answer',
    description: 'Tell Enki-bot to ask you a random trivia question!',
    aliases: ['a', 'a:', 'ans'],
    cooldown: 12,
    args: true, //Set this to be true if you want this command to need an argument
    usage: '<answer>', //This gives the example of what a user should type
	execute(message, args) {
		TriviaService.answerQuestion(message, args);
	}
};
