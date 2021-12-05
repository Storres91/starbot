module.exports = {
	name: 'ready',
	once: true,
	async execute(args, client, Discord, message) {
		console.log(`Ready! Logged in as ${client.user.tag}`);
		//client.channels.fetch("887103191274106890").then(function(result1) {result1.send("Hi hi <a:cr_cutewaveheart:851550907324825621> \nThe bot just restarted, please run `sb start` command, thank you ")});
		//client.channels.fetch("869298472648597524").then(function(result2) {result2.send("Hi hi <a:cr_cutewaveheart:851550907324825621> <@&not869250517791019088> \nThe bot just restarted, please run `sb start` command, thank you ")});


	},
};