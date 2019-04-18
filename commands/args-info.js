module.exports = {
	name: 'args-info',
    description: 'Information about the arguments provided.',
    args: true, //Set this to be true if you want this command to need an argument
	execute(message, args) {
		if (args[0] === 'foo') {
			return message.channel.send('bar');
		}

        message.channel.send(`Arguments: ${args}\nArguments length: ${args.length}`);
	}
};
