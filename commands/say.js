module.exports = {
    name: 'say',
    description: 'makes the bot say smth',
    execute(client, message, args){
        const messageTxt = args.join(" ");
        if(!messageTxt) return;
        if(message.member.user.id=='313351494361677845'){
            setTimeout(function(){
                message.delete().catch(() => null);
                message.channel.send(messageTxt);
            },1000);
        }
        
    }
}