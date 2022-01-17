module.exports = {
    name: 'channelcount',
    description: 'Counts the channels in each category',
    async execute(client, message, args, Discord) {
        const staffRoleID = '857060867676831805';
        if (message.member.user.id == '313351494361677845' || message.member.roles.cache.some(role => role.id == staffRoleID)){
            const privateCategoriesId = ['855889626573045810', '866359829966487563', '923082998545514496', '859489667283550248',
                                        '851683880409759744', '887619539473424404', '923086668163059722',];
            var mensaje="";

            const channelcountEmbed = new Discord.MessageEmbed()
                .setTitle("<a:starpurplehover:905575054161641483> Celestial Realm's channel count <a:starpurplehover:905575054161641483>")
                .setColor("#b5359d")
                .setFooter(`Requested by ${message.member.nickname}`)
                .setTimestamp();

            for(let categoryId of privateCategoriesId){
                let category = await message.guild.channels.fetch(categoryId);
                let {name, children} = category;
                mensaje += `\n\n${name} \n${children.size == 50 ? "<:bg_xmark:932680409504972810>":"<:bg_checkmark:932680409198764095>"} ${children.size}/50 channels.`
            }
            message.channel.send({embeds: [channelcountEmbed.setDescription(mensaje)]});
        }
    }
}