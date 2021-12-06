const gbanModel = require('../models/gbanSchema.js')
const countersModel = require('../models/countersSchema.js')

module.exports = {
	name: 'start',
	description: 'Restart timeouts for gbanneds',
	async execute(client, message, args, Discord) {
		const gBannedRole = '869251117844934706';
		const staffRoleID = '857060867676831805';
		const gaManagerRoleID = '869250517791019088';
		var memberTargetFunction;

		const gunbannedEmbed = new Discord.MessageEmbed()
			.setColor('#08FF00')
			.setTitle(":white_check_mark: You are now unbanned from Celestial Realm giveaways <a:starpurplehover:905575054161641483>")
			.setDescription("Always remember to do the requirements and follow the rules.")
			.setFooter("Celestial Starbot")
			.setTimestamp();

		if (message.member.user.id == '313351494361677845' || message.member.roles.cache.some(role => role.id == staffRoleID) || message.member.roles.cache.some(role => role.id == gaManagerRoleID)) {
			let countersData2;
			try {
				countersData2 = await countersModel.findOne({ counterID: 2 });
			} catch (err) {
				console.log(`Error getting countersData2 ${err}`)
			}

			for (let k = 1; k <= countersData2.bansSeq; k++) {
				let gbannedData;
				try {
					gbannedData = await gbanModel.findOne({ gbanID: k });
				} catch (err) {
					console.log(`Error getting gbannedData ${err}`)
				}



				if (gbannedData) {
					var memberTargetFunction = await message.guild.members.fetch(gbannedData.gbanUserID);
					if (gbannedData.gunbanDate > Date.now() && memberTargetFunction.roles.cache.some(role => role.id == gBannedRole)) {

						unbanTimer = gbannedData.gunbanDate - Date.now();
						setTimeout(function () { gabantimeout(gbannedData.gbanUserID) }, unbanTimer);
						console.log("Started timeout for user " + gbannedData.gbanUserID);

					} else if (gbannedData.gunbanDate < Date.now() && memberTargetFunction.roles.cache.some(role => role.id == gBannedRole)) {
						memberTargetFunction.roles.remove(gBannedRole);
						memberTargetFunction.send({ embeds: [gunbannedEmbed] }).catch(() => null);

					}
				}
			}
		client.channels.fetch("887103191274106890").then(function(result1) {result1.send("**Command done, Successfully started all the processes**")});
		client.channels.fetch("869298472648597524").then(function(result2) {result2.send("**Command done, Successfully started all the processes**")});
		}else{
			message.channel.send("You're not allowed to do that")
		}

		function gabantimeout(userID) {
			memberTargetFunction.then(function (user2) {
				user2.roles.remove(gBannedRole).catch(() => null);
				user2.send({ embeds: [gunbannedEmbed] }).catch(() => null);

			});
			console.log("Unbanned user: " + userID);

		}

	},
};