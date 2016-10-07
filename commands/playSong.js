/**
 * Created by julia on 02.10.2016.
 */
var messageHelper = require('../utility/message');
var voice = require('../utility/voice');
var logger = require('../utility/logger');
var ytHelper = require('../utility/youtube/helper');
var musicHelper = require('../utility/music');
var osu = require('../utility/osu');
var winston = logger.getT();
var cmd = 'play';
var songModel = require('../DB/song');
var execute = function (message) {
    let messageSplit = message.content.split(' ');
    if (message.guild) {
        if (messageHelper.hasWolkeBot(message)) {
            if (typeof (messageSplit[1]) !== 'undefined') {
                var messageSearch = "";
                for (var i = 1; i < messageSplit.length; i++) {
                    messageSearch = messageSearch + " " + messageSplit[i]
                }
                if (musicHelper.checkMedia(messageSearch)) {
                    ytHelper.ytDlAndPlayFirst(message, messageSearch, messageSplit);
                } else if (musicHelper.checkOsuMap(messageSplit[1])) {
                    osu.download(message).then(Song => {
                        if (voice.inVoice(message)) {
                            voice.addSongFirst(message, Song, false).then(() => {
                                voice.playSong(message, Song);
                            }).catch(console.log);
                        } else {
                            message.reply('It looks like i am not connected to any Voice Channel of this Server at the Moment, connect me with !w.voice');
                        }
                    }).catch(message.reply);
                } else {
                    songModel.find({$text: {$search: messageSearch}}, {score: {$meta: "textScore"}}).sort({score: {$meta: "textScore"}}).limit(1).exec(function (err, Songs) {
                        if (err) return console.log(err);
                        var Song = Songs[0];
                        if (Song) {
                            if (voice.inVoice(message)) {
                                voice.addSongFirst(message, Song, false).then(() => {
                                    voice.playSong(message, Song);
                                }).catch(console.log);
                            } else {
                                message.reply('It looks like i am not connected to any Voice Channel of this Server at the Moment, connect me with !w.voice');
                            }
                        } else {
                            message.reply('No Song Found!');
                        }
                    });
                }
            } else {
                message.reply('No Search term entered!');
            }
        } else {
            message.reply('No Permission to use this Command! Use !w.qa instead!');
        }
    } else {
        message.reply("This Commands Only Works in Server Channels!");
    }
};
module.exports = {cmd:cmd, accessLevel:0, exec:execute};