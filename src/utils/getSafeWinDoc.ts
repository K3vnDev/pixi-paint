export const getSafeWinDoc = () => {
  const win = typeof window !== 'undefined' ? window : undefined
  const doc = typeof document !== 'undefined' ? document : undefined
  return { window: win, document: doc }
}
