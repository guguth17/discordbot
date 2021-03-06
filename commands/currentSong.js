/**
 * Created by julia on 02.10.2016.
 */
var cmd = 'np';
var i18nBean = require('../utility/i18nManager');
var t = i18nBean.getT();
var voice = require('../utility/voice');
var execute = function (message) {
    if (message.guild) {
        voice.now(message).then(result => {
            if (result.playing) {
                let repeat = (result.repeat) ? t('np.repeat-on', {lngs: message.lang}) : '';
                if (typeof (result.duration) !== 'undefined' && result.duration !== '') {
                    message.reply(t('np.song-duration', {
                        lngs: message.lang,
                        title: result.title,
                        repeat: repeat,
                        duration: result.duration,
                        current: result.current,
                        interpolation: {escape: false}
                    }));
                } else {
                    message.reply(t('np.song', {
                        lngs: message.lang,
                        title: result.title,
                        repeat: repeat,
                        interpolation: {escape: false}
                    }));
                }
            } else {
                message.channel.sendMessage(t('generic.no-song-in-queue', {lngs: message.lang}));
            }
        }).catch(err => {
            message.channel.sendMessage(t('generic.no-song-in-queue', {lngs: message.lang}));
            });
    }
};
module.exports = {cmd: cmd, accessLevel: 0, exec: execute, cat: 'music'};