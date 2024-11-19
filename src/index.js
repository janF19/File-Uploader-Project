const express = require('express');
const session = require('express-session');
const passport = require('passport');
const { PrismaClient } = require('@prisma/client');
const { PrismaSessionStore } = require('@quixo3/prisma-session-store');
const path = require('path');
const authRoutes = require('./routes/auth');
const fileRoutes = require('./routes/files');
const shareRouter = require('./routes/share');
const setupPassport = require('./config/passport');
const methodOverride = require('method-override');
const app = express();
const prisma = new PrismaClient();

// Middleware
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));


app.use(methodOverride('_method'));

// Session configuration with Prisma store
app.use(
  session({
    store: new PrismaSessionStore(prisma, {
      checkPeriod: 2 * 60 * 1000,  // Clean up expired sessions every 2 minutes
      dbRecordIdIsSessionId: true,
      dbRecordIdFunction: undefined,
    }),
    secret: process.env.SESSION_SECRET || 'your-secret-key',
    resave: false,
    saveUninitialized: false,
    cookie: {
      maxAge: 24 * 60 * 60 * 1000, // 24 hours
    }
  })
);

// Passport initialization
app.use(passport.initialize());
app.use(passport.session());
setupPassport(passport);

// Routes
app.use('/auth', authRoutes);
app.use('/files', fileRoutes);
app.use('/share', shareRouter);
app.use('/uploads', express.static('uploads'));

// Add this after your routes
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ error: 'Something broke!' });
});

app.get('/', (req, res) => {
  res.render('index', { user: req.user });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});