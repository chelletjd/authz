import express from 'express'
import { login } from '../services/homeService';
import { requiresAuth } from 'express-openid-connect';

const HomeController = express.Router()

HomeController.get('/', requiresAuth(), login)

export default HomeController;