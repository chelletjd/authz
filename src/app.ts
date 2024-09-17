import 'dotenv/config'
import { randomBytes } from "crypto"
import express from "express"
import { auth, requiresAuth } from "express-openid-connect"
import HomeController from './controllers/homeController'
import { registerLoginRoute } from './controllers/LoginController'
import { engine } from "express-handlebars"
import bodyParser from 'body-parser'
import { handlebarsHelpers } from './pkg'
import { registerStaticRoutes } from './controllers/staticController'
import { registerRegistrationRoute } from './controllers/registrationController'
const app = express()


app.use(bodyParser.urlencoded({extended: true}))
// The `auth` router attaches /login, /logout
// and /callback routes to the baseURL
// app.use(
//   auth({
//     authRequired: false,
//     baseURL: "http://localhost:3000",
//     secret: process.env.ENCRYPTION_SECRET || randomBytes(64).toString("hex"),

//     clientID: process.env.OAUTH_CLIENT_ID,
//     clientSecret: process.env.OAUTH_CLIENT_SECRET,
//     issuerBaseURL: `https://${process.env.ORY_PROJECT_SLUG}.projects.oryapis.com`,

//     authorizationParams: {
//       response_type: "code",
//       scope: "openid email offline_access",
//     },
//   }), 
// )

registerLoginRoute(app)
app.set("view engine", "hbs")

app.engine(
  "hbs",
  engine({
    extname: "hbs",
    layoutsDir: `${__dirname}/../views/layouts/`,
    partialsDir: `${__dirname}/../views/partials/`,
    defaultLayout: "auth",
    helpers: handlebarsHelpers,
  }),
)

app.use('/', HomeController)
registerStaticRoutes(app)
registerRegistrationRoute(app)

// app.set('view engine', 'ejs');

export default app;