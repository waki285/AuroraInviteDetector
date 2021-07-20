"use strict";
const discord = require("discord.js");
const client = new discord.Client({ partials: ["CHANNEL", "MESSAGE", "REACTION"], allowedMentions: { parse: ["users"] }, ws: { intents: discord.Intents.ALL }});
const { Signale } = require("signale");
const console = new Signale({ scope: "Discord" });

const express = require("express");
const app = express();

app.get("/", (req, res, next) => {
  res.send("Discord Bot is Online!")
})
const prefix = "aid!";

const YOUR_GUILD_NAME = "123456789012345678";//これ使うサーバーのID
const WELCOME_CHANNEL_ID = "901234567890123456";//ようこそを送信するチャンネルID

let allInvites = {};

client.on('ready', async () => {
  console.success(`Logged in as ${client.user.tag}!`);
  const guild = client.guilds.cache.get(YOUR_GUILD_NAME);
  guild.fetchInvites()
  .then(invites => allInvites = invites)
  .catch(console.error("招待の読み込みにエラーが発生しました"));
});

client.on('inviteCreate', async invite => {
  client.guilds.cache.get(YOUR_GUILD_NAME).fetchInvites()
  .then(invites => allInvites = invites)
  .catch(console.error("招待の読み込みにエラーが発生しました"));
});

client.on('inviteDelete', async invite => {
  client.guilds.cache.get(YOUR_GUILD_NAME).fetchInvites()
  .then(invites => allInvites = invites)
  .catch(console.error("招待の読み込みにエラーが発生しました"));
});

client.on('guildMemberAdd', async member => {
  client.guilds.cache.get(YOUR_GUILD_NAME).fetchInvites()
  .then(invites => {
    const oldInvites = allInvites;
    allInvites = invites;
    const invite = invites.find(i => oldInvites.get(i.code).uses < i.uses);
    const inviter_invite = invites.filter(i => i.inviter.id === invite.inviter.id);
    let inviteCount = 0;
    inviter_invite.forEach(inv => inviteCount += inv.uses);
    client.channels.cache.get(WELCOME_CHANNEL_ID).send(`${member.tag}さんがやってきました。\nこの人を招待したのは${invite.inviter.tag}さんです。\nこの人は${inviter_invite.size}個の招待リンクで、${inviteCount}人を招待しました。`)
  })
});

client.on('message', async message => {
  if (message.author.bot) return;
  if (message.content.startsWith(prefix)) return;
  const args = message.content
    .slice(prefix.length)
    .trim()
    .split(/ +/g);
  const command = args.shift().toLowerCase();
});

client.login(process.env.token);