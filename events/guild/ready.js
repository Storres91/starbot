module.exports = {
	name: 'ready',
	once: true,
	async execute(args, client, Discord, message) {
		console.log(`Ready! Logged in as ${client.user.tag}`);
		client.channels.fetch("902377203801661470").then(ch=>ch.send("**Bot just restarted**"))
		client.emit('startGbanTimers', client, Discord, message);
		client.emit('restartReminders', client, Discord);

	},
};