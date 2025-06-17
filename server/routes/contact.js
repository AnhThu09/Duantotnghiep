import express from 'express';
import { createContact } from '../controllers/Contactform.js';

const ContactRouter = express.Router();

ContactRouter.post('/contact', createContact);

export default ContactRouter;
