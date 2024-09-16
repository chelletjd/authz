import Express from 'express';

// Login ory service
export function login (req: Express.Request, res: Express.Response) {
  req.oidc.fetchUserInfo().then((userInfo: any) => {

    res.render('response', {
      response: JSON.stringify(
        {
          accessToken: req.oidc.accessToken,
          refreshToken: req.oidc.refreshToken,
          idToken: req.oidc.idToken,
          idTokenClaims: req.oidc.idTokenClaims,
          userInfo,
        },
        null,
        2,
      ),
      email: userInfo.email,
      accessToken: req.oidc.accessToken?.access_token,
    })
    // res.send(
    //   `<html lang='en'><body><pre><code>${JSON.stringify(
    //     {
    //       accessToken: req.oidc.accessToken,
    //       refreshToken: req.oidc.refreshToken,
    //       idToken: req.oidc.idToken,
    //       idTokenClaims: req.oidc.idTokenClaims,
    //       userInfo,
    //     },
    //     null,
    //     2,
    //   )}</code></pre></body></html>`,
    // )
  })
}