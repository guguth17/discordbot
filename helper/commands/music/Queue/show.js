/**
 * Created by julia on 24.07.2016.
 */
var general = require('../../../utility/general');
var voice = require('../../../utility/voice');
var queueModel = require('../../../../DB/queue');
var show = function showQueueCmd(bot, message) {
    queueModel.findOne({server: message.guild.id}, function (err, Queue) {
        if (err) return console.log(err);
        if (Queue) {
            if (Queue.songs.length > 0) {
                var reply = "";
                for (var q = 0; q < Queue.songs.length; q++) {
                    if (q === 0) {
                        let dispatcher = voice.getDispatcher(message.guild.voiceConnection);
                        let time = Math.floor(dispatcher.time / 1000);
                        if (typeof (Queue.songs[0].duration) !== 'undefined') {
                            reply = reply + `Currently Playing:\` ${Queue.songs[0].title} ${general.convertSeconds(time)}/${Queue.songs[0].duration} \`\n`;
                        } else {
                            reply = reply + `Currently Playing:\`${Queue.songs[0].title}\`\n`;
                        }
                        if (Queue.songs.length > 1) {
                            reply = `${reply}Queued:\n\`\`\``;
                        }
                    } else {
                        if (typeof (Queue.songs[q].duration) !== 'undefined') {
                            reply = reply + `${parseInt(q + 1)}. ${Queue.songs[q].title} ${Queue.songs[q].duration}\n`;
                        } else {
                            reply = reply + `\`\`\`${parseInt(q + 1)}. ${Queue.songs[q].title}n`;
                        }
                        if (q === Queue.songs.length-1) {
                            reply = `${reply}\`\`\``;
                        }
                    }
                }
                message.channel.sendMessage(reply).then(msg => {
                    msg.delete(60 * 1000);
                }).catch(console.log);
            } else {
                message.reply('There is no Song in the Queue right now!');
            }
        } else {
            message.reply('There is no Song in the Queue right now!');
        }
    });
};
module.exports = show;