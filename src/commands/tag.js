import TagService from '../services/TagService';

//TODO: Continue from here:
//https://discordjs.guide/sequelize/#beta-creating-the-model
module.exports = {
	name: 'tag',
	description: 'Create a tag!',
	args: true, //Set this to be true if you want this command to need an argument
    usage: '<name-of-tag> <one-word-description> <count>', //This gives the example of what a user should type
	execute(message, args) {
		console.log(args);
		const name = args[0].toLowerCase();
		const description = args[1];
		const count = args[2];
		const jData = {
			name,
			description: description || 'Default description',
			username: message.author.username,
			usage_count: count
		};
		TagService.addNewTag(jData);
		message.channel.send('Adding tag...');
	}
};
