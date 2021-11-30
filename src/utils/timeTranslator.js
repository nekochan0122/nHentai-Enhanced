import { json } from '../variable'

/**
 * 翻譯時間
 * @param {string} time - 時間字符串
 */
export function timeTranslator(time) {
  const jsonTime = json.Book.Time,
    engTime = [
      'years',
      'year',
      'months',
      'month',
      'weeks',
      'days',
      'day',
      'hours',
      'hour',
      'minutes',
      'minute',
      'seconds',
      'second',
      'ago',
    ]

  for (let i = 0, max = engTime.length; i < max; i++) {
    time = time.replace(engTime[i], jsonTime[engTime[i]])
  }

  return time
}
