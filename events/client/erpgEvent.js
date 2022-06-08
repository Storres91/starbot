module.exports = {
    name: 'erpgEvent',
    description: 'Sample description',
    async execute(client, message, Discord) {
        if(message.embeds[0].fields[0].value.toLowerCase().includes('catch')){
            message.channel.send('<@&851519388963700790>')

        } else if (message.embeds[0].fields[0].value.toLowerCase().includes('chop')){
            message.channel.send('<@&851520347588132915>')

        } else if (message.embeds[0].fields[0].value.toLowerCase().includes('fish')){
            message.channel.send('<@&851519530815586317>')

        } else if (message.embeds[0].fields[0].value.toLowerCase().includes('time to fight')){
            message.channel.send('<@&851519112084455464>')

        } else if (message.embeds[0].fields[0].value.toLowerCase().includes('summon')){
            message.channel.send('<@&851518913974894603>')

        } else if (message.embeds[0].fields[0].name.toLowerCase().includes('fight')){
            message.channel.send('<@&854865647740387339>')

        } else if (message.embeds[0].fields[0].name.toLowerCase().includes('join')){
            message.channel.send('<@&854865339883978772>')
        }
    }
}