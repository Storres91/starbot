module.exports = {
    name: 'erpgEvent',
    description: 'Sample description',
    async execute(client, message, Discord, slash) {
        if(message.channel.id == '928163057430061136' || message.channel.id == '852321070022787082' || message.channel.id == '859876959521079328') return
        let eventRoleId;

        if(message.embeds[0].fields[0].value.toLowerCase().includes('catch')){
            eventRoleId = '851519388963700790';

        } else if (message.embeds[0].fields[0].value.toLowerCase().includes('chop')){
            eventRoleId = '851520347588132915';

        } else if (message.embeds[0].fields[0].value.toLowerCase().includes('fish')){
            eventRoleId = '851519530815586317';

        } else if (message.embeds[0].fields[0].value.toLowerCase().includes('time to fight')){
            eventRoleId = '851519112084455464';

        } else if (message.embeds[0].fields[0].value.toLowerCase().includes('summon')){
            eventRoleId = '851518913974894603';

        } else if (message.embeds[0].fields[0].name.toLowerCase().includes('fight')){
            eventRoleId = '854865647740387339';

        } else if (message.embeds[0].fields[0].name.toLowerCase().includes('join')){
            eventRoleId = '854865339883978772';
        } else return

        //Return true if channel is hidden (Everyone's view perm is off)
        await message.channel.permissionOverwrites.edit(eventRoleId, {
            VIEW_CHANNEL: true
        })
        if(slash) message.channel.send(`<@&${eventRoleId}> **PRESS THE BUTTON^^**`)
        else message.channel.send(`<@&${eventRoleId}>`)


        //Wait for event to end to hide again
        const filter = (m) => m.author.id === message.author.id;
        const eventEndCollector = new Discord.MessageCollector(message.channel, {
            filter,
            time: 1000 * 60
        });

        eventEndCollector.on('collect', (m)=>{
            // If another event starts return
            const events = ['join', 'fight', 'summon', 'time to fight', 'fish', 'chop', 'catch']
            for (let ev of events){
                if(m.embeds[0]?.fields[0]?.value.toLowerCase().includes(ev) || m.embeds[0]?.fields[0]?.name.toLowerCase().includes(ev)) return
            }

            //End event on embed
            if(m.embeds[0]?.fields[0]?.name.toLowerCase().includes('everyone got')) eventEndCollector.stop();
        })

        eventEndCollector.on('end', ()=>{
            let embed = new Discord.MessageEmbed()
                .setColor('#b5359d');

            if(message.channel.permissionOverwrites.cache?.get('672574313433399336')?.deny.any('0x0000000000000400')){
                embed.setDescription("<:cr_lock:983546206061994014> **Event is over, back into hiding mode.**");
            } else {
                embed.setDescription("<:cr_unlock:983546252413243413> **Event is over, time to go home.**");
            } 

            message.channel.send({embeds:[embed]})

            message.channel.permissionOverwrites.edit(eventRoleId, {
                VIEW_CHANNEL: null
            })
        })


    }
}
