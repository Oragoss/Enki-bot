//https://discordjs.guide/miscellaneous/parsing-mention-arguments.html#how-discord-mentions-work
//TODO: Expand upon this

module.exports = {
	name: 'avatar',
    description: 'Grabs a user\'s avatar!',
    aliases: ['icon', 'pfp'],
    args: true, //Set this to be true if you want this command to need an argument
    usage: '<user>', //This gives the example of what a user should type
	execute(message, args) { //, args
        // const member = message.mentions.members.first();

        if (!args[0]) {
            const avatarURL = message.author.displayAvatarURL;
            return message.reply('', avatarURL);
        }
        else {
            const avatarList = message.mentions.users.map((user) => {
                return `${user.username}'s avatar: ${user.displayAvatarURL}`;
            });
            return message.channel.send(avatarList);
        }
	}
};
