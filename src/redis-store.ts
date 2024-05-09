export let refreshTokens: { username: string; token: string }[] = []

export const removeToken = (username: string) => {
  refreshTokens = refreshTokens.filter(token => token.username !== username)
}
