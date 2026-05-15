import 'dayjs/locale/zh-cn.js'

import dayjs from 'dayjs'
import duration from 'dayjs/plugin/duration.js'
import relativeTime from 'dayjs/plugin/relativeTime.js'
import fse from 'fs-extra'
import logSymbols from 'log-symbols'
export { fse }
dayjs.extend(duration)
dayjs.extend(relativeTime)
dayjs.locale('zh-cn')
export { dayjs }
export { logSymbols }
