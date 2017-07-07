import usage from 'pidusage'

const CHECK_INTERVAL = 60 * 1000 // 60 seconds

export function startStatsLogger ({
  logger = console,
  interval = CHECK_INTERVAL
}) {
  setInterval(() => {
    usage.stat(process.pid, (err, stat) => {
      if (err) {
        console.error(err)
      }
      if (stat) {
        stat = { ...stat, category: 'systemMonitor' }
        logger.info(stat)
      }
    })
  }, interval)
}
