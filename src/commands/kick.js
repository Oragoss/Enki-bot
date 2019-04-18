//https://discordjs.guide/miscellaneous/parsing-mention-arguments.html#using-regular-expressions
//TODO: make sure you implement the correct way to ban someone.

module.exports = {
	name: 'kick',
    description: 'Kick a user from the server',
    guildOnly: true,
    args: true, //Set this to be true if you want this command to need an argument
    usage: '<user> <reason>', //This gives the example of what a user should type
	execute(message, args) {
        if (!args[1]) return message.reply('You didn\'t specify a reason');
        message.reply('You might think about implementing this.');

        // The actual Kick code
        //const member = message.mentions.members.first();
        // member.kick(args[1]).then(() => {
        //     // Successmessage
        //     message.channel.send(":wave: " + member.displayName +
        //" has been successfully kicked :point_right: ");
        // }).catch(() => {
        //      // Failmessage
        //     message.channel.send("Access Denied");
        // });
    }
};
