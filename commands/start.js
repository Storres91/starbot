const gbanModel = require('../models/gbanSchema.js')
const countersModel = require('../models/countersSchema.js')

module.exports = {
	name: 'start',
	description: 'Restart timeouts for gbanneds',
	async execute(client, message, args, Discord) {
		const gBannedRole = '869251117844934706';
		var memberTargetFunction;

		const gunbannedEmbed = new Discord.MessageEmbed()
			.setColor('#08FF00')
			.setTitle(":white_check_mark: You are now unbanned from Celestial Realm giveaways <a:starpurplehover:905575054161641483>")
			.setDescription("Always remember to do the requirements and follow the rules.")
			.setFooter("Celestial Starbot")
			.setTimestamp();

		if (message.member.user.id == '313351494361677845') {
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
					try{
						memberTargetFunction = await message.guild.members.fetch(gbannedData.gbanUserID);
					}catch(error){
						console.log(error)
					}
					if(memberTargetFunction){
						if (gbannedData.gunbanDate > Date.now() && memberTargetFunction.roles.cache.some(role => role.id == gBannedRole)) {

							var unbanTimer = gbannedData.gunbanDate - Date.now();
							setTimeout(function () { gabantimeout(gbannedData.gbanUserID) }, unbanTimer);
							console.log("Started timeout for user " + gbannedData.gbanUserID);
	
						} else if (gbannedData.gunbanDate < Date.now() && memberTargetFunction.roles.cache.some(role => role.id == gBannedRole)) {
							memberTargetFunction.roles.remove(gBannedRole);
							memberTargetFunction.send({ embeds: [gunbannedEmbed] }).catch(() => null);
	
						}
					}
					
				}
			}
		client.channels.fetch("902377203801661470").then(function(result1) {result1.send("**Command done, Successfully started all the processes**")});
		}else{
			message.channel.send("You're not allowed to do that")
		}

		async function gabantimeout(userID) {
			let memberTargetFunctionT = await message.guild.members.cache.get(userID);
			memberTargetFunctionT.roles.remove(gBannedRole).catch(() => null);
			memberTargetFunctionT.send({ embeds: [gunbannedEmbed] }).catch(() => null);


			console.log("Unbanned user: " + userID);

		}

	},
};