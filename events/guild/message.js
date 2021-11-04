

module.exports = {
    execute(message, client, Discord) {
        const prefix = 'sb ';
            if (!message.content.startsWith(prefix) || message.author.bot) return;
            if (message.channel.type == 'dm') return;

            const args = message.content.slice(prefix.length).split(/ +/);
            const cmd = args.shift().toLowerCase();

            const command = client.commands.get(cmd);

            try {
                if (command) command.execute(client, message, args, Discord);
            } catch (err) {
                console.log(err);
            }
        
    }
}