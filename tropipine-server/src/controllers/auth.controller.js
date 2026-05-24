const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { prisma } = require('../config/db');
require('dotenv/config');

const JWT_SECRET = process.env.JWT_SECRET || 'change_this_in_production_to_strong_secret_32_chars';
const JWT_EXPIRES = process.env.JWT_EXPIRES_IN || '7d';

function signToken(user) {
  return jwt.sign({ id: user.id, email: user.email, role: user.role }, JWT_SECRET, { expiresIn: JWT_EXPIRES });
}

async function register(req, res) {
  try {
    const { name, email, password } = req.body;
    if (!name || !email || !password) return res.status(400).json({ message: 'Missing fields' });

    const exists = await prisma.user.findUnique({ where: { email } });
    if (exists) return res.status(409).json({ message: 'Email already in use' });

    const hashed = await bcrypt.hash(password, 10);
    const user = await prisma.user.create({ data: { name, email, password: hashed } });

    const token = signToken(user);
    res.cookie('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    const { password: _p, ...safe } = user;
    res.status(201).json({ user: safe });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
}

async function login(req, res) {
  try {
    const { email, password } = req.body;
    if (!email || !password) return res.status(400).json({ message: 'Missing fields' });

    console.log('[LOGIN] Attempting login for email:', email);
    const user = await prisma.user.findUnique({ where: { email } });
    console.log('[LOGIN] User found:', !!user);
    if (!user) return res.status(401).json({ message: 'Invalid credentials' });

    const ok = await bcrypt.compare(password, user.password);
    console.log('[LOGIN] Password match:', ok);
    if (!ok) return res.status(401).json({ message: 'Invalid credentials' });

    const token = signToken(user);
    res.cookie('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    const { password: _p, ...safe } = user;
    res.json({ data: { user: safe, token } });
  } catch (err) {
    console.error('[LOGIN] Error:', err.message);
    console.error('[LOGIN] Stack:', err.stack);
    res.status(500).json({ message: 'Server error' });
  }
}

async function logout(req, res) {
  res.clearCookie('token');
  res.json({ message: 'Logged out' });
}

async function me(req, res) {
  try {
    const user = await prisma.user.findUnique({ where: { id: req.user.id } });
    if (!user) return res.status(404).json({ message: 'Not found' });
    const { password: _p, ...safe } = user;
    res.json({ user: safe });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
}

module.exports = { register, login, logout, me };
