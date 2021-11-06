module.exports = {
    execute(message, client, Discord) {
        const prefix = 'sb ';
        if (message.content.toLowerCase().startsWith(prefix)) {
            if (!message.content.toLowerCase().startsWith(prefix) || message.author.bot) return;
            if (message.channel.type == 'dm') return;

            const args = message.content.toLowerCase().slice(prefix.length).split(/ +/);
            const cmd = args.shift().toLowerCase();

            const command = client.commands.get(cmd);
            if(!command) return;

            try {
                if (command) command.execute(client, message, args, Discord);
            } catch (err) {
                console.log(err);
            }
        }
    }
}