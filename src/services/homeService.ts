import Express from 'express';
var sdk = require("@ory/client")

var ory = new sdk.FrontendApi(
  new sdk.Configuration({
    basePath:
      process.env.ORY_SDK_URL || "https://playground.projects.oryapis.com",
  }),
)

// Login ory service
export function login (req: Express.Request, res: Express.Response) {
  ory
    .toSession({ cookie: req.header("cookie") })
    .then(({ data: session }: any) => {
      res.render("index", {
        title: "Express",
        // Our identity is stored in the session along with other useful information.
        identity: session.identity,
      })
    })
    .catch(() => {
      // If logged out, send to login page
      res.redirect("/login")
    })
}