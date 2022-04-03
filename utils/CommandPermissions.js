module.exports = {
    name: 'CommandPermissions',
    description: 'Utility for checking permissions for a command',
    aliases: [''],
    isAllowed({message, roles=[], users=[]}={}){
        if(message.author.id == '313351494361677845') return true
        if (roles.length == 0 && users.length == 0) return true

        const ROLES = {
            ADMIN: '850830076609429544',
            MOD:'235046787122069504',
            STAFF: '857060867676831805',
            GA_MANAGER: '869250517791019088',
            ARENA_MANAGER: '877920810315157514',
        }

        for (const roleToCheck of roles){
            if (message.member.roles.cache.some(role => role.id === ROLES[roleToCheck])) return true
        }
        for (const userToCheck of users){
            if(message.author.id == userToCheck) return true
        }
        return false

    },
    hasRoles(message, roles = []) {
        if (roles.length == 0) return true
        for (const roleToCheck of roles) {
            if (message.member.roles.cache.some(role => role.id === roleToCheck)) return true
        }    
        return false

    },
    isUser(message, users = []){
        if (users.length == 0) return true
        for (const userToCheck of users){
            if(message.author.id == userToCheck) return true
        }
        return false
        
    }
}