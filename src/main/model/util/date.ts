import dayjs from 'dayjs'

/**
 * 将 Date 或 null 转成 YYYY-MM-DD 字符串
 * @param d Date | null
 * @returns string | null
 */
export function formatDate(d: Date | null): string | null {
  if (!d) return null
  return dayjs(d).format('YYYY-MM-DD')
}
