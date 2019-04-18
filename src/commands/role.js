module.exports = {
	name: 'role',
    description: 'Get information about a user\'s role',
    guildOnly: true,
    args: true, //Set this to be true if you want this command to need an argument
    usage: '<user>', //This gives the example of what a user should type
	execute(message) {
		const member = message.mentions.members.first();
        member.roles.forEach((role) => {
            if (role.name === '@everyone') {
                Promise.resolve(message.channel.send('everyone'));
            }
            else {
                Promise.resolve(message.channel.send(role.name));
            }
            // console.log(role);
        });
	}
};
