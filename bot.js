const { Client, GatewayIntentBits } = require('discord.js');
const fs = require('fs');


const client = new Client({ intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMembers] });

client.once('ready', async () => {
    console.log(`Logged in as ${client.user.tag}`);

   
    const guild = client.guilds.cache.get('SERVER ID');
    if (!guild) return console.log('Guild not found');

    const members = await guild.members.fetch();

    const data = members.map(member => {
        const nickname = member.nickname || member.user.username;
        const tagMatch = nickname.match(/-(\d{4})/);
        const prefixMatch = nickname.match(/"([^"]+)"/);

        const tagNumber = tagMatch ? tagMatch[1] : "0000";
        const prefix = prefixMatch ? prefixMatch[1] : nickname;

        return JSON.stringify({
            _id: member.user.id,
            guildId: guild.id,
            tagNumber: { $numberInt: tagNumber },
            prefix: prefix,
            points: { $numberInt: "0" },
            activity: "ACTIVE",
            deployments: {
                leader: { $numberInt: "0" },
                member: { $numberInt: "0" }
            },
            createdAt: { $date: { $numberLong: Date.now().toString() } },
            __v: { $numberInt: "0" }
        });
    });

    fs.writeFile('output.txt', data.join('\n'), (err) => {
        if (err) {
            console.error('Error writing to file', err);
        } else {
            console.log('Data successfully written to output.txt');
        }
    });
});

client.login('BOT TOKEN');
