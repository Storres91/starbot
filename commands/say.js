module.exports = {
    name: 'say',
    description: 'makes the bot say smth',
    execute(client, message, args){
        const messageTxt = args.join(" ");
        const STAFFROLE = '857060867676831805';
        if(!messageTxt) return;
        if(message.member.user.id=='313351494361677845' || message.member.roles.cache.some(role => role.id == STAFFROLE)){
            setTimeout(function(){
                message.delete();
                message.channel.send(messageTxt);
            },1000);
        }
        
    }
}