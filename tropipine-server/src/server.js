require('dotenv/config');

const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const cookieParser = require('cookie-parser');
const rateLimit = require('express-rate-limit');
const { prisma } = require('./config/db');

const app = express();
const { connect } = require('./config/db');
const port = process.env.PORT || 5000;

app.use(helmet());
app.use(
	cors({
		origin: process.env.CLIENT_URL || true,
		credentials: true,
	})
);
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(morgan(process.env.NODE_ENV === 'production' ? 'combined' : 'dev'));
app.use(
	rateLimit({
		windowMs: 15 * 60 * 1000,
		max: 100,
	})
);

// Connect to DB
connect();

// Routes
const authRoutes = require('./routes/auth.routes');
app.use('/api/v1/auth', authRoutes);

const productRoutes = require('./routes/product.routes');
app.use('/api/v1/products', productRoutes);

const orderRoutes = require('./routes/order.routes');
app.use('/api/v1/orders', orderRoutes);

const paymentRoutes = require('./routes/payment.routes');
app.use('/api/v1/payments', paymentRoutes);

const couponRoutes = require('./routes/coupon.routes');
app.use('/api/v1/coupons', couponRoutes);

const adminRoutes = require('./routes/admin.routes');
app.use('/api/v1/admin', adminRoutes);

const galleryRoutes = require('./routes/gallery.routes');
app.use('/api/v1/gallery', galleryRoutes);

app.get('/health', async (_req, res) => {
	try {
		await prisma.$queryRaw`SELECT 1`;
		res.json({ status: 'ok' });
	} catch {
		res.status(503).json({ status: 'degraded' });
	}
});

app.get('/', (_req, res) => {
	res.json({ message: 'TropiPine server is running' });
});

app.use((_req, res) => {
	res.status(404).json({ message: 'Route not found' });
});

const server = app.listen(port, () => {
	console.log(`Server running on port ${port}`);
});

async function shutdown(signal) {
	console.log(`${signal} received, shutting down`);
	server.close(async () => {
		await prisma.$disconnect();
		process.exit(0);
	});
}

process.on('SIGINT', () => {
	shutdown('SIGINT');
});

process.on('SIGTERM', () => {
	shutdown('SIGTERM');
});

process.on('unhandledRejection', (error) => {
	console.error('Unhandled rejection:', error);
});
