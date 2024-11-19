// src/routes/auth.js
const express = require('express');
const passport = require('passport');
const bcrypt = require('bcryptjs');
const { PrismaClient } = require('@prisma/client');
const router = express.Router();
const prisma = new PrismaClient();

const createUser = async (email, password) => {
    try {
        const user = await prisma.user.create({
            data: {
                email,
                password, // This will be the hashedPassword
            },
        });
        console.log('User created:', user);
        return user;
    } catch (error) {
        console.error('Error creating user:', error);
        throw error;
    }
};

router.get('/login', (req, res) => {
  res.render('login');
});

router.post('/login',
  passport.authenticate('local', {
    successRedirect: '/files',
    failureRedirect: '/auth/login',
    failureFlash: true
  })
);
 
router.get('/register', (req, res) => {
  res.render('register');
});

router.post('/register', async (req, res) => {
    try {
        const { email, password } = req.body;
        const hashedPassword = await bcrypt.hash(password, 10);
        
        // Use the createUser function
        const user = await createUser(email, hashedPassword);
        console.log('Registration successful:', user);
        
        res.redirect('/auth/login');
    } catch (err) {
        console.error('Registration failed:', err);
        res.redirect('/auth/register');
    }
});

router.get('/logout', (req, res) => {
    req.logout((err) => {
        if (err) {
            console.error('Logout error:', err);
            return res.redirect('/');
        }
        res.redirect('/');
    });
});

module.exports = router;