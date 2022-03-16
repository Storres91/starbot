module.exports = {
    name: 'sendmap',
    description: 'Sends the map channel message',
    aliases: [''],
    async execute(client, message, args, Discord) {
        const STAFFROLE = '857060867676831805';
        if(message.member.user.id=='313351494361677845' || message.member.roles.cache.some(role => role.id == STAFFROLE)){

            //SERVER
            await message.channel.send({files: ['./assets/img/1_SERVER.png']})
            message.channel.send('<#851102112968212520> \n' +
            'Any updates to server or bots are announced here! \n' +
            '\n' +
            '<#851102612371406858> \n' +
            'Verify yourself and read the rules. \n' +
            '\n' +
            '<#851073392110338078> \n' +
            'New members join log.\n' +
            '\n' +
            '<#811753198897332245> \n' +
            'The channel to pick roles or remove them.\n' +
            '\n' +
            '<#860226434614558740> \n' +
            'Shown lvl 10+ in amari but let give you a make over starting with your name colour. \n' +
            '\n' +
            '<#851087471831941150> \n' +
            'You can make suggestions to the server.\n' +
            '\n' +
            '<#852665029245272075> \n' +
            'Suggestions are voted upon by the community then staff team.\n' +
            '\n' +
            '<#855897048565284894> \n' +
            'The benefits possible with our levelling bot <@!339254240012664832> and booster perks.\n' +
            '\n' +
            '<#884551258915090452> \n' +
            'User boosting logs.\n' +
            '\n' +
            '<#857768054359457813> \n' +
            'Help bump our server!',)

            //HELP
            await message.channel.send({files: ['./assets/img/2_HELP.png']})
            message.channel.send('<#953218095940501524> \n' +
            "Come here when you get lost and don't know which channel is for which purpose. \n" +
            '\n' +
            '<#856343007729287178> \n' +
            'General information on the server.\n' +
            '\n' +
            '<#854023730538479677> \n' +
            'If no answers in Faq, feel free to ask your questions here.\n' +
            '\n' +
            '<#856638681360236614> \n' +
            'Need a member of staff and somewhere private for an issue within the server? Support ticket is your answer.\n' +
            '\n' +
            '<#851685203281838081> \n' +
            'Request your own channel, add co-owners, delete/archive channels or channel upgrade can be requested here.',)

            //GENERAL
            await message.channel.send({files: ['./assets/img/3_GENERAL.png']})
            message.channel.send('<#852588316363980860> \n' +
            "General chat where you're able to have a conversation with anyone as long as it's SFW! \n" +
            '\n' +
            '<#856041929027223552> \n' +
            'Chat for boosters to talk or to sort out their booster roles & icons\n' +
            '\n' +
            '<#860283951675342858> \n' +
            '<a:cr_kekeke:895635825927274526> \n' +
            '\n' +
            '<#853286368335626250> \n' +
            '<a:flexleft:953431444888371280> 😉 <a:flexright:953431444959686746>\n' +
            '\n' +
            '<#873404771137097738> \n' +
            'Place for OC art \n' +
            '\n' +
            '<#854466908983525406>\n' +
            'Want an emote on the server? Put your suggestions here! \n' +
            '\n' +
            ' <#867539163883634719>\n' +
            'The place where anonymous people post their confessions!',)

            //GIVEAWAY
            await message.channel.send({files: ['./assets/img/4_GIVEAWAY.png']})
            message.channel.send('<#869271499800985640> \n' +
            'Want to make an giveaway? Come here and read the pins! \n' +
            '\n' +
            '<#862321500471427072> \n' +
            '<#851104820336001084>\n' +
            '<#873745846150266900> \n' +
            'Giveaways and winner(s) announced here \n' +
            '\n' +
            '<#906923925752135701> \n' +
            'Giveaways with a requirement are required here unless stated otherwise\n' +
            ' \n' +
            '<#859176841516417054> \n' +
            'All payments for winners of giveaways regardless of time travel',)

            //SUPER ZONE
            await message.channel.send({files: ['./assets/img/5_SUPER_ZONE.png']})
            message.channel.send('<#861324842561568768> \n' +
            'Do ``rpg p`` here to get assigned tt roles\n' +
            '\n' +
            '<#852301901693583370> \n' +
            'Information on how boosted minibosses work here\n' +
            '\n' +
            '<#928163057430061136> \n' +
            'Where Godly Miniboss (lvl 4k+) are hosted (requires level 10+ in <@!339254240012664832> )\n' +
            '\n' +
            '<#852321070022787082> \n' +
            'Where Miniboss 800+ are hosted but sometimes 4k+ hosts here <:cr_eeveehappy:879920895722942514> \n' +
            '\n' +
            '<#851108452268245022> \n' +
            'Boosted minibosses commands are completed here, so winners get ready <:cr_elmoburn:892754341453234217> \n' +
            '\n' +
            '<#877916760601399337> \n' +
            'Boosted arena list (gives more cookies than regular arena command)\n' +
            '\n' +
            '<#877916875420479518> \n' +
            'Where boosted arena commands are completed',)

            //SPACE MARKET
            await message.channel.send({files: ['./assets/img/6_SPACE_MARKET.png']})
            message.channel.send('<#867534464263127060>\n' +
            'Wanting to sell something in ERPG bot? Guild? Duel? \n' +
            '**Warning, scammers will be punished**\n' +
            '\n' +
            '<#867535675603419146>\n' +
            'Users wanting to buy or request services in ERPG bot can be done here. Sellers can look here to see if they match your requirements.\n' +
            '\n' +
            '<#867541049739313182> \n' +
            'Commands relating to buying and selling is done here',)

            //PUBLIC GALAXY
            await message.channel.send({files: ['./assets/img/7_PUBLIC_GALAXY.png']})
            message.channel.send('<#851086740310720512> <a:cr_pinkrollingstar:865266644346863636> \n' +
            '\n' +
            '<#851086812175794196> <a:cr_pinkrollingstar:865266644346863636> \n' +
            '\n' +
            '<#851684888918491146> <a:cr_pinkrollingstar:865266644346863636> \n' +
            '\n' +
            '<#854744139053006878> <a:cr_pinkrollingstar:865266644346863636> \n' +
            '\n' +
            '<#859846381812056094> <a:cr_pinkrollingstar:865266644346863636> \n' +
            '\n' +
            '<#859847400662368266> <a:cr_pinkrollingstar:865266644346863636> \n' +
            '\n' +
            "These channels are public channels, anyone can use them but doesn't mean its free reign! **All rules** of the server still apply. No toxic, no snipe... <:cr_mmblush:874865113071513620> \n" +
            '\n' +
            '<#855094831306375180> <a:cr_pinkrollingstar:865266644346863636> \n' +
            '\n'+
            '<#882326282304639006> <a:cr_pinkrollingstar:865266644346863636> \n' +
            '\n' +
            '<#953177351674556446> <a:cr_pinkrollingstar:865266644346863636> \n' +
            '\n' +
            'Need to find a partner or a guild? Come to our searching channels above <:cr_mmoke:907525454003585044> \n' +
            '\n' +
            '<#864271402488430623> <a:cr_pinkrollingstar:865266644346863636> \n' +
            '\n' +
            '<#876085020375252992> <a:cr_pinkrollingstar:865266644346863636> \n' +
            '\n' +
            '<#852215579242922057> <a:cr_pinkrollingstar:865266644346863636> \n' +
            '\n' +
            '<#861118078057578506> <a:cr_pinkrollingstar:865266644346863636> \n' +
            '\n' +
            'Channels self explain. Come to ask for assistance from the bots for d10, d13 or enchantment. \n' +
            '\n' +
            '<#852587758761541733> \n' +
            '<:cr_gamblebad:865983093114667078> or <:cr_gamblegood:865983093210087424> ?\n' +
            '\n' +
            '<#861646055312195618> \n' +
            "Drop your arena or miniboss command here if you don't wanna join boosted arena or miniboss. \n" +
            '\n' +
            '<#855838409502228502> \n' +
            'Come and drop your epic items. This channel can be used for epic item drop giveaways.',)

            //MISC BOTS
            await message.channel.send({files: ['./assets/img/8_MISC_BOTS.png']})
            message.channel.send('<#877768456831913984> \n' +
            '<#854083152069918741>  \n' +
            "I don't know why but people love counting here.\n" +
            '\n' +
            '<#854491028090519572> \n' +
            '<#854082652838821958> \n' +
            '<#859588901899206686> \n' +
            '<#856261753322340382>\n' +
            '<#854931816535031828> \n' +
            '<#907783666778914866> \n' +
            '<#854942306121285642> \n' +
            '<#894084138414526494> \n' +
            '<#859592961742209034>  \n' +
            '<#858542889495822366> \n' +
            'Self explains. Come enjoy other bots besides erpg <a:cr_peachbored:864143615626444831> \n' +
            '\n' +
            '<#880308727503261697> \n' +
            "Poketwo's spawn channel. You can catch **all** pokemons freely here.\n" +
            '<#885619994283638864> \n' +
            "Poketwo's shiny-hunt channel. **Always** check for shiny-hunters before catching. \n" +
            '\n' +
            '<#860195707259453480> \n' +
            'Use all commands you want with any bots.',)

            //PRIVATE CHANNELS
            await message.channel.send({files: ['./assets/img/9_PRIVATE_CHANNELS.png']})
            message.channel.send('> Below the **Misc Bots Category** are private channels. \n' +
            '> Make sure you have the permission of the room owners before playing in a private room. \n' +
            '> Check how you can get a private channel in <#855897048565284894> mentions above.',)

            //VOICE CHAT
            await message.channel.send({files: ['./assets/img/10_VOICE_CHAT.png']})
            message.channel.send('Feel free to have some small talk with your friends in **General VC**, or enjoy music in **Music channels**, or go to **karaoke** to show your talents <a:cr_party:891186181222588426>',)

            message.delete().catch(()=>null)
        }
    }
}