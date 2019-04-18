class ServerInfo {
    static async Info(message) {
        return message.channel.send(`Server name: ${message.guild.name}\nTotal members: ${message.guild.memberCount}`);
    }
}

module.exports = {
	name: 'server',
	description: 'Returns the server name and the member count.',
	execute(message) { //, args
		ServerInfo.Info(message);
	}
};
