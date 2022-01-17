module.exports = {
    name: 'aping',
    description: 'Pings the boosted arena role and deletes the message after 5 mins',
    aliases: ['arenaping', 'pingarena'],
    async execute(client, message, args, Discord) {
        const ARENA_MANAGER_ID = '877920810315157514';
        const BOOSTED_ARENA_ID = '872161326355607593';
        var msg;
        if (message.member.roles.cache.some(role => role.id == ARENA_MANAGER_ID) || message.member.roles.cache.some(role => role.id == STAFF_ROLE_ID)) {
            message.channel.send("<@&" + BOOSTED_ARENA_ID + "> \nThis ping will always auto delete after 5 mins. <a:cr_catpopopo:853385258510319626>").then(sent => msg = sent);
            setTimeout(() => {
                msg.delete().catch(() => null);
            }, 300000);
        } else return message.channel.send("You can't use this command");
    }
}