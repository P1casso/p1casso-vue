export async function exchangeNpssoForCode() {
  const queryString = new URLSearchParams({
    access_type: 'offline',
    client_id: '09515159-7237-4370-9b40-3806e67c0891',
    redirect_uri: 'com.scee.psxandroid.scecompcall://redirect',
    response_type: 'code',
    scope: 'psn:mobile.v2.core psn:clientapp'
  }).toString()

  const requestUrl = `/sony/api/authz/v3/oauth/authorize?${queryString}`
  const { headers: responseHeaders } = await fetch(requestUrl, {
    headers: {
      Cookie: `npsso=q06uE7HQgxrCxO2t4OSnzlEUTEwgwbkHYtykGz8z8iGgXLh5RdIiB9d8KRd5bTNI`
    },
    redirect: 'manual'
  })
  console.log(responseHeaders)
  if (
    !responseHeaders.has('location') ||
    !responseHeaders.get('location')?.includes('?code=')
  ) {
    return null
  }
  const redirectLocation = responseHeaders.get('location')
  const redirectParams = new URLSearchParams(
    redirectLocation.split('redirect/')[1]
  )
  return redirectParams.get('code')
}


export async function exchangeCodeForAccessToken1(accessCode) {
  const requestUrl = `/sony/api/authz/v3/oauth/token`
  const res = await fetch(requestUrl, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
      Authorization:
        'Basic MDk1MTUxNTktNzIzNy00MzcwLTliNDAtMzgwNmU2N2MwODkxOnVjUGprYTV0bnRCMktxc1A='
    },
    body: new URLSearchParams({
      code: accessCode,
      redirect_uri: 'com.scee.psxandroid.scecompcall://redirect',
      grant_type: 'authorization_code',
      token_format: 'jwt'
    }).toString()
  })
  console.log(res)
  //const raw = await res.json()
  return {
    // accessToken: raw.access_token,
    // expiresIn: raw.expires_in,
    // idToken: raw.id_token,
    // refreshToken: raw.refresh_token,
    // refreshTokenExpiresIn: raw.refresh_token_expires_in,
    // scope: raw.scope,
    // tokenType: raw.token_type
  }
}