module.exports = {
    name: 'channelCreate',
    description: 'Sample description',
    aliases: [''],
    async execute(channel, client, Discord, server) {

        if (channel.parentId == '858136654745305098'){
            let usersToNotify = ['230120935804370944', '889435777522618398']

            for (const user of usersToNotify) {
                client.users.fetch(user).then(user=>user.send(`A ticket was just created in celestial realm → <#${channel.id}>`))
            }
        } 

        
    }
}