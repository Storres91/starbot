module.exports = {
	name: 'ready',
	once: true,
	async execute(args, client, Discord, message) {
		console.log(`Ready! Logged in as ${client.user.tag}`);
		client.emit('startGbanTimers', client, Discord, message)

	},
};