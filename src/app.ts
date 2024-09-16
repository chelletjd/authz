import 'dotenv/config'
import { randomBytes } from "crypto"
import express from "express"
import { auth, requiresAuth } from "express-openid-connect"
import HomeController from './controllers/homeController'
const app = express()

// The `auth` router attaches /login, /logout
// and /callback routes to the baseURL
app.use(
  auth({
    authRequired: false,
    baseURL: "http://localhost:3000",
    secret: process.env.ENCRYPTION_SECRET || randomBytes(64).toString("hex"),

    clientID: process.env.OAUTH_CLIENT_ID,
    clientSecret: process.env.OAUTH_CLIENT_SECRET,
    issuerBaseURL: `https://${process.env.ORY_PROJECT_SLUG}.projects.oryapis.com`,

    authorizationParams: {
      response_type: "code",
      scope: "openid email offline_access",
    },
  }), 
)
app.use('/', HomeController)

app.set('view engine', 'ejs');

export default app;