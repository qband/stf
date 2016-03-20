var syrup = require('stf-syrup')

var logger = require('../../../util/logger')
var wire = require('../../../wire')
var wireutil = require('../../../wire/util')

module.exports = syrup.serial()
  .dependency(require('../support/router'))
  .dependency(require('../support/push'))
  .dependency(require('./service'))
  .define(function(options, router, push, service) {
    var log = logger.createLogger('device:plugins:whitelist')

    router.on(wire.PasteWhiteList, function(channel, message) {
      log.info('Pasting "%s" to WhiteList', message.text)
      var reply = wireutil.reply(options.serial)
      service.setWhiteList(message.text)
        .then(function() {
          push.send([
            channel
          , reply.okay()
          ])
        })
        .catch(function(err) {
          log.error('Paste failed', err.stack)
          push.send([
            channel
          , reply.fail(err.message)
          ])
        })
    })

    router.on(wire.CopyWhiteList, function(channel) {
      log.info('Copying WhiteList contents')
      var reply = wireutil.reply(options.serial)
      service.getWhiteList()
        .then(function(content) {
          push.send([
            channel
          , reply.okay(content)
          ])
        })
        .catch(function(err) {
          log.error('Copy failed', err.stack)
          push.send([
            channel
          , reply.fail(err.message)
          ])
        })
    })
  })
