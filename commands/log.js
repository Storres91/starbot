module.exports = {
    name: 'log',
    description: 'Interacts with the log',
    aliases: ['editlog'],
    async execute(client, message, args, Discord) {
        const STAFFROLE = '857060867676831805';
        let logMessage;
        
        if (message.member.user.id == '313351494361677845' || message.member.roles.cache.some(role => role.id == STAFFROLE)){}
        else return message.channel.send("You can't use this.");

        if(message.type != 'REPLY') return message.channel.send("You didn't reply to any log message.");
        if(!args[1]) return message.channel.send("You have to include what you're editing.");

        let logMessageEdit = "\n"+args.slice(1).join(" ");
        logMessage = await message.channel.messages.fetch(message.reference.messageId);

        if(!isLogMessage(logMessage)) return message.channel.send("The replied message is not a log message.");
        
        

        switch(args[0]){
            case 'remove':
                removeLogField(logMessage, logMessageEdit);
                break;

            case 'add':
                addLogField(logMessage, logMessageEdit);
                break;

            default:
                return message.channel.send("What are you trying to do with this log <@"+message.member.id+">?\n`sb log add/remove <Description>`");
        }

        message.delete().catch(()=>null);

        //FUNCTIONS

        //Remove a line from the description
        function removeLogField(logMessage, matchDescription){
            matchDescription = matchDescription.replace("\n", "");
            let logDescription = (logMessage.embeds[0].description).split("\n");
            let newDescription = [];
            for(let line of logDescription){
                if (!(line.includes(matchDescription))){
                    newDescription.push(line)
                }
            }
            logMessage.edit({embeds:[logMessage.embeds[0]
                .setDescription(newDescription.join("\n"))
                .setFooter("Last edited")
                .setTimestamp(Date.now())
            ]});

        }

        //Add a line to the description
        function addLogField(logMessage, description){
            let logDescription = (logMessage.embeds[0].description) || " ";
            logMessage.edit({embeds:[logMessage.embeds[0]
                .setDescription(logDescription+description)
                .setFooter("Last edited")
                .setTimestamp(Date.now())
            ]});
            
        }

        //Check if replied message is log message
        function isLogMessage(logMessage){
            if(logMessage.embeds[0]){
                if(logMessage.embeds[0].title != "Interactive Log" || logMessage.author.id != client.user.id){
                    return false
                }
                else{
                    return true
                }
            }
            else{
                return false
            }
        }
    }
}