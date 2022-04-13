module.exports = {
    name: 'permsManager',    
    hasAnyOfRoles(member, roles = []) {
        if (roles.length == 0) return true
        for (const roleToCheck of roles) {
            if (member.roles.cache.some(role => role.id === roleToCheck)) return true
        }    
        return false

    },

    hasAllOfRoles(member, roles = []){
        if (roles.length == 0) return true
        for (const roleToCheck of roles) {
            if (!member.roles.cache.some(role => role.id === roleToCheck)) return false
        }    
        return true
    },

    isUser(member, users = []){
        if (users.length == 0) return true
        for (const userToCheck of users){
            if(member.id == userToCheck) return true
        }
        return false
        
    },

    isAllowed({member, roles=[], users=[]}={}){
        if (roles.length == 0 && users.length == 0) return true

        for (const roleToCheck of roles) {
            if (member.roles.cache.some(role => role.id === roleToCheck)) return true
        }  
        for (const userToCheck of users){
            if(member.id == userToCheck) return true
        }

        return false

    },
}