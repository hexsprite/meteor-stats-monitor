import _ from 'lodash'
import usage from 'pidusage'
import CircularBuffer from 'circular-buffer'
import { IncomingWebhook } from '@slack/client'
const os = require('os')

// testing
// const CHECK_INTERVAL = 1 * 1000 // 60 seconds
// const ALERT_INTERVAL = 5 * 1000 // 5 minutes
// startStatsLogger({ logger: console })

const CHECK_INTERVAL = 60 * 1000 // 60 seconds
const ALERT_INTERVAL = 5 * 60 * 1000 // 5 minutes
const CPU_THRESHOLD = 80
const BUFFER_SIZE = 5

export const statsBuffer = new CircularBuffer(BUFFER_SIZE)

export function startStatsLogger ({ logger = console }) {
  // capture stats
  setInterval(() => captureStats(logger), CHECK_INTERVAL)

  // check for alerts
  setInterval(checkAlerts, ALERT_INTERVAL)
}

export function captureStats (logger) {
  usage.stat(process.pid, (err, stat) => {
    if (err) {
      console.error(err)
    }
    if (stat) {
      stat = { ...stat, category: 'systemMonitor' }
      logger.info(stat)
    }
    statsBuffer.enq(stat)
  })
}

export function checkAlerts () {
  const stats = statsBuffer.toarray()
  const cpuAverage = _.meanBy(stats, 'cpu')
  // if we have a full buffer worth of data and the average is still high
  if (stats.length === BUFFER_SIZE && cpuAverage > CPU_THRESHOLD) {
    slackAlert(cpuAverage)
  }
}

export function slackAlert (average) {
  const webhook = new IncomingWebhook(
    Meteor.settings.statsMonitor.slackWebhookUrl
  )
  webhook.send(
    `${os.hostname()}: CPU alert: 5 min. average of ${Math.round(
      average
    )}% exceeded threshold`,
    (err, header, statusCode, body) => {
      if (err) {
        console.log('stats-monitor error webhook.send:', err)
      }
    }
  )
}
