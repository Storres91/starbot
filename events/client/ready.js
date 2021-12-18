module.exports = {
	name: 'ready',
	once: true,
	async execute(args, client, Discord, message) {
		console.log(`Ready! Logged in as ${client.user.tag}`);
		client.channels.fetch("902377203801661470").then(function(result1) {result1.send("Bot restarted in celestial `sb start`<@313351494361677845>")});


	},
};