const bcryptjs = require("bcryptjs");
const jwt = require('jsonwebtoken')
const router = require("express").Router();

const Users = require("../users/users-model.js");

router.post("/register", (req, res) => {
    let creds = req.body;
    const rounds = process.env.HASH_ROUNDS || 4;

    const hash = bcryptjs.hashSync(creds.password, rounds);

    creds.password = hash;

    Users.add(creds)
        .then(saved => {
            const token = createToken(cred);
            res.status(201).json({ data: saved , token: token});
        })
        .catch(error => {
            res.status(500).json({ error: error.message });
            ``;
        });
});

router.post("/login", (req, res) => {
    const { username, password } = req.body;

    Users.findBy({ username })
        .then(users => {
            const user = users[0];

            if (user && bcryptjs.compareSync(password, user.password)) {
                const token = createToken(user);

                res.status(200).json({ message: `Welcome ${user.username}!`, token: token });
            } else {
                res.status(401).json({ message: "Invalid credentials" });
            }
        })
        .catch(error => {
            res.status(500).json({ error: error.message });
        });
});

function createToken(user) {
    const payload = {
        userId: user.id,
        username: user.username,
        depeartment: user.depeartment,
    }

    const secret = process.env.JWT_SECRET || 'secrettokenhere'

    const options = {
        expiresIn: '2h'
    }
    return jwt.sign(payload, secret, options)
}

module.exports = router;
