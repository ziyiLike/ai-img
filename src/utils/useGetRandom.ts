export default function useGetRandom(
  length = 16,
  mixedStr = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ',
) {
  return Array.from({ length }, () => mixedStr[Math.floor(Math.random() * mixedStr.length)]).join(
    '',
  )
}
