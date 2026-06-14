import { Hono } from 'hono';

import adminRoute from './admin.route.js';
import authRoute from './auth.route.js';
import cusomerRoute from './customer.route.js';
import sellerRoute from './seller.route.js';
import notifikasiRoute from './notifikasi.route.js';
import profileRoute from './profile.route.js';

const app = new Hono();
app.route('/auth', authRoute);
app.route('/admin', adminRoute);
app.route('/customer', cusomerRoute);
app.route('/seller', sellerRoute);
app.route('/notifications', notifikasiRoute);
app.route('/profile', profileRoute);


export default app;
