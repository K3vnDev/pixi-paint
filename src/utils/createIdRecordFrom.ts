export const createIdRecordFrom = <T>(arr: Array<{ id: string } & T>) => {
  const record: Record<string, T> = {}
  arr.forEach(item => {
    record[item.id] = item
  })
  return record
}
