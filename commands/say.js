module.exports = {
    name: 'say',
    description: 'makes the bot say smth',
    execute(client, message, args){
        const STAFFROLE = '857060867676831805';
        const messageTxt = args.join(" ");
        if(!messageTxt) return;
        if(message.member.user.id=='313351494361677845' || message.member.roles.cache.some(role => role.id == STAFFROLE)){
            setTimeout(function(){
                message.delete().catch(() => null);
                let messageSay = message;
                messageSay.content = messageSay.content.toLowerCase().replace("sb say ", "");
                message.channel.send(messageSay);
            },1000);
        }
        
    }
}