import express from 'express'
import { login } from '../services/homeService';
import { requiresAuth } from 'express-openid-connect';

const HomeController = express.Router()

HomeController.get('/', (req: express.Request, res: express.Response) => {
  res.redirect("/login")
})

export default HomeController;