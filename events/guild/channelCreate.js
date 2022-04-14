module.exports = {
    name: 'channelCreate',
    description: 'Sample description',
    aliases: [''],
    async execute(channel, client, Discord, server) {
        if (channel.parentId == '858136654745305098') client.users.fetch('230120935804370944').then(user=>user.send(`A ticket was just created in celestial realm → <#${channel.id}>`))
    }
}