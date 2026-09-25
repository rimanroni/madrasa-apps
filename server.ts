import express from 'express';
import { createServer as createViteServer } from 'vite';
import crypto from 'crypto';
import dotenv from 'dotenv';
import path from 'path';

dotenv.config();

const app = express();
const PORT = process.env.PORT ? parseInt(process.env.PORT, 10) : 3000;

// Passwords configured via environment variables with the requested secure defaults
const MAIN_ADMIN_PASSWORD = process.env.MAIN_ADMIN_PASSWORD || 'riman100@@##';
const SUPER_ADMIN_PASSWORD = process.env.SUPER_ADMIN_PASSWORD || 'supar_admin1122';

// In-memory active session token store (with timestamp)
interface SessionData {
  token: string;
  role: 'main_admin' | 'super_admin';
  createdAt: number;
}
const activeSessions = new Map<string, SessionData>();

// Clean expired sessions periodically (24 hour session life)
const SESSION_TTL_MS = 24 * 60 * 60 * 1000;
setInterval(() => {
  const now = Date.now();
  for (const [token, data] of activeSessions.entries()) {
    if (now - data.createdAt > SESSION_TTL_MS) {
      activeSessions.delete(token);
    }
  }
}, 60 * 60 * 1000);

app.use(express.json());

// ==========================================
// ADMIN AUTHENTICATION API ENDPOINTS
// ==========================================

// POST /api/admin/login
app.post('/api/admin/login', (req, res) => {
  const { password } = req.body || {};

  if (!password || typeof password !== 'string') {
    return res.status(400).json({
      success: false,
      message: 'পাসওয়ার্ড প্রদান করা আবশ্যক।'
    });
  }

  let role: 'main_admin' | 'super_admin' | null = null;

  if (password === MAIN_ADMIN_PASSWORD) {
    role = 'main_admin';
  } else if (password === SUPER_ADMIN_PASSWORD) {
    role = 'super_admin';
  }

  if (!role) {
    return res.status(401).json({
      success: false,
      message: 'ভুল পাসওয়ার্ড! অ্যাডমিন ড্যাশবোর্ডে প্রবেশের অনুমতি নেই।'
    });
  }

  // Generate secure cryptographic session token
  const token = crypto.randomBytes(32).toString('hex');
  activeSessions.set(token, {
    token,
    role,
    createdAt: Date.now()
  });

  return res.json({
    success: true,
    token,
    role,
    message: role === 'super_admin' 
      ? 'সুপার অ্যাডমিন হিসেবে সফলভাবে লগইন হয়েছে।' 
      : 'প্রধান অ্যাডমিন হিসেবে সফলভাবে লগইন হয়েছে।'
  });
});

// POST /api/admin/verify
app.post('/api/admin/verify', (req, res) => {
  const authHeader = req.headers.authorization;
  const token = req.body?.token || (authHeader?.startsWith('Bearer ') ? authHeader.substring(7) : null);

  if (!token || !activeSessions.has(token)) {
    return res.status(401).json({
      valid: false,
      message: 'সেশন অনুপস্থিত বা মেয়াদোত্তীর্ণ। পুনরায় লগইন করুন।'
    });
  }

  const session = activeSessions.get(token)!;
  if (Date.now() - session.createdAt > SESSION_TTL_MS) {
    activeSessions.delete(token);
    return res.status(401).json({
      valid: false,
      message: 'সেশনের মেয়াদ শেষ হয়েছে।'
    });
  }

  return res.json({
    valid: true,
    role: session.role
  });
});

// POST /api/admin/logout
app.post('/api/admin/logout', (req, res) => {
  const authHeader = req.headers.authorization;
  const token = req.body?.token || (authHeader?.startsWith('Bearer ') ? authHeader.substring(7) : null);

  if (token && activeSessions.has(token)) {
    activeSessions.delete(token);
  }

  return res.json({
    success: true,
    message: 'অ্যাডমিন সেশন সফলভাবে সমাপ্ত হয়েছে।'
  });
});

// ==========================================
// VITE DEV SERVER / STATIC SERVING
// ==========================================
async function startServer() {
  const isProd = process.env.NODE_ENV === 'production';

  if (!isProd) {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa'
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.resolve(__dirname, 'dist');
    app.use(express.static(distPath));
    app.get('*', (_req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`[Maktab Management] Server listening on http://0.0.0.0:${PORT}`);
  });
}

startServer().catch((err) => {
  console.error('Failed to start server:', err);
  process.exit(1);
});
