const favoritesModel = require('../models/favoritesSchema.js');
const { transformToId } = require('../utils/targets.js');

module.exports = {
    name: 'favorites',
    description: 'List of favorite channels',
    aliases: ['fav','favorite',],
    async execute(client, message, args, Discord, server) {
        if (message.channel.id == server.CHANNELS.GENERAL) return

        let favoritesData;
        try {
            favoritesData = await favoritesModel.findOne({ userID: message.author.id });
        } catch (err) {
            console.log(`Error getting favoritesData at fav command ${err}`)
        }

        if (!args[0]) args[0] = 'show';
        if (args[0].toLowerCase() != 'add' && !favoritesData) return message.channel.send('You haven\'t added any channels to your favorite list.\n<a:bg_starrollwhite:929572216578924615> Add one with `sb fav add <#channel/ID>`')

        let chnID; 
        

        switch (args[0].toLowerCase()) {
            case 'add':
                if (!args[1]) return message.channel.send('You must include the channel or id to add. `sb fav add <#channel/ID>`') 
                
                chnID = transformToId(args[1])
                if (isNaN(chnID)) return message.channel.send(args[1]+' is not a valid channel.')

                if (!favoritesData){
                    createRegister(chnID);
                } else {
                    addChannel(chnID); 
                    showList();
                } 
                
                

                break;

            case 'remove':
                if (!args[1]) return message.channel.send('You must include the channel or id to remove. `sb fav remove <#channel/ID/index>`')
                chnID = transformToId(args[1])
                if (isNaN(chnID)) return message.channel.send(args[1]+' is not a valid channel.')
                
                removeChannel(chnID)
                showList()
                
                break;

            case 'toggle':
                toggleView();
                break;
            
            default:
                showList();

                break;
        }

        function toggleView(){
            favoritesData.embed?favoritesData.embed=false:favoritesData.embed=true;
            favoritesData.save();

            message.channel.send(`Display favorites as plain text set to **${!favoritesData.embed}.**`)
        }

        async function createRegister(channelID){
            try {
                let favoritesMod = await favoritesModel.create({
                    userID: message.author.id,
                    channels: [channelID],
                    embed: true
                });
                favoritesMod.save();
    
            } catch (error) {
                message.channel.send("Error adding to database, report to Noxet (Noxxy).")
            }
            message.channel.send(`Successfully created your favorites list and added <#${channelID}>, check it out! \`sb fav\``)
        }

        function addChannel(channelID){
            if(favoritesData.channels.length > 14) return message.channel.send('<a:bg_starrollwhite:929572216578924615> Sorry, you are only allowed to add a maximum of 15 channels to your favorite list.')
            if (favoritesData.channels.indexOf(channelID) > -1) return message.channel.send(`<#${channelID}> is already in your favorites list.`)
            favoritesData.channels.push(channelID);
            favoritesData.save();
            message.channel.send(`Successfully added <#${channelID}> to your favorites.`)
        }

        function removeChannel(channelID){
            let index;

            if(args[1].length<=2){
                index = parseInt(args[1]-1);
                channelID = favoritesData.channels[index];
            } 
            else index = favoritesData.channels.indexOf(channelID);
            if (parseInt(args[1])>favoritesData.channels.length) return message.channel.send(`What are you trying to do? You only have **${favoritesData.channels.length}** channels in your list <a:cr_dumbbell:890460553238167582>`)
            if (index < 0 || index >=16) return message.channel.send(`I did not find this channel in your favorites list.`)

            favoritesData.channels.splice(index, 1);
            favoritesData.save();
            message.channel.send(`Successfully removed <#${channelID}> from your favorites.`)
        }

        function showList(){
            let title = `${message.member.nickname?message.member.nickname:message.member.user.username}'s favorites list (${favoritesData.channels.length}/15)`;
            let description = favoritesData.channels.map((ch, i) => `**${i+1}.** <#${ch}>`).join('\n ');

            const listEmbed = new Discord.MessageEmbed()
                .setTitle(title)
                .setDescription(description)
                .setColor('#b5359d')
                .setTimestamp();

            
            if(favoritesData.embed){
                message.channel.send({embeds: [listEmbed]})
            } else {
                message.channel.send(`> **${title}**\n>\n > ${description}`)
            }
        }


    }
}