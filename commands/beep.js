const boop = (message) => {
	return message.channel.send('Boop.');
};

module.exports = {
	name: 'beep',
	description: 'Beep!',
	execute(message) { //, args
		boop(message);
	}
};
