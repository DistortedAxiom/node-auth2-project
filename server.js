const express = require('express');
const helmet = require('helmet');
const session = require('express-session');

const usersRouter = require('./users/users-router')
const authRouter = require('./auth/auth-router.js')
const authenticate = require('./auth/auth-middleware')

const server = express();

const sessionConfig =
    {
        name: 'session',
        secret: process.env.SESSION_SECRET || "Secret",
        cookie: {
          maxAge: 1000 * 60 * 30,
          secure: process.env.USE_SECURE_COOKIE || false,
          httpOnly: true
        },
        resave: false,
        saveUninitialized: true,
    }


server.use(helmet());
server.use(express.json());
server.use(session(sessionConfig));

server.use("/api/users", authenticate, usersRouter)
server.use("/api/auth", authRouter)

server.get("/", (req, res) => {
    res.json({ api: "up" });
});

module.exports = server;
