// import Discord from 'discord.js';
import TriviaService from '../services/TriviaService';

module.exports = {
	name: 'trivia',
	aliases: ['t', 't:'],
	description: 'Tell Enki-bot to ask you a random trivia question!',
	execute(message) {
		TriviaService.getQuestion(message);

		// inside a command, event listener, etc.
		// const exampleEmbed = new Discord.RichEmbed()
		// .setColor('#0099ff')
		// .setTitle('Some title')
		// .setURL('https://discord.js.org/')
		// .setAuthor('Some name', 'https://i.imgur.com/wSTFkRM.png', 'https://discord.js.org')
		// .setDescription('Some description here')
		// .setThumbnail('https://i.imgur.com/wSTFkRM.png')
		// .addField('Regular field title', 'Some value here')
		// .addField('2Regular field title', 'Some value here')
		// .addBlankField()
		// .addField('A', 'The people of YouTube', true)
		// .addField('B', 'The city of Akatosh', true)
		// .addField('C', 'The thread of life', true)
		// .addField('D', 'Some other thing', true)
		// .setImage('https://i.imgur.com/wSTFkRM.png')
		// .setTimestamp()
		// .setFooter('Some footer text here', 'https://i.imgur.com/wSTFkRM.png');

		// message.channel.send(exampleEmbed);
	}
};
