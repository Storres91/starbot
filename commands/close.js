module.exports = {
    name: 'close',
    description: 'sb close',
    async execute(client, message, args, Discord) {
        if(message.member.nickname != null) message.channel.send(message.member.nickname+" has left the chat. <a:bg_pepobye:928148613715083334>");
        else message.channel.send(message.author.username+" has left the chat. <a:bg_pepobye:928148613715083334>");
    }
}