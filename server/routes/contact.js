import express from 'express';
import { createContact } from '../controllers/Contactform.js';

const ContactRoutes = express.Router();

ContactRoutes.post('/contact', createContact);

export default ContactRoutes;
