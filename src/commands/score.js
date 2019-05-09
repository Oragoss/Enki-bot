import UserService from '../services/UserService';

module.exports = {
	name: 'score',
    description: 'Tell Enki-bot to display your score to others.',
    aliases: ['sc'],
    cooldown: 30,
    usage: '<answer>', //This gives the example of what a user should type
	execute(message) {
        UserService.displayScore(message);
	}
};
