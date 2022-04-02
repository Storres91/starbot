const fs = require('fs');

module.exports = (client) => {
    const DIRECTORIES_PATHS = ['./commands','./commands/moderation']
    let validPaths = [];
    let command_files = [];

    for (let path of DIRECTORIES_PATHS) {
        let filesOfPath;

        try {
            filesOfPath = fs.readdirSync(path).filter(file => file.endsWith('.js'));
        }
        catch{
            continue;
        }

        validPaths.push(path)
        command_files.push(filesOfPath)
    }
    
    let index = 0;
    for (const path of validPaths){
        for (const file of command_files[index]) {
            const command = require(`.${path}/${file}`);        
            if (command.name) {
                client.commands.set(command.name, command);
            } else {
                continue;
            }
        }

        index++;
    }
    
}