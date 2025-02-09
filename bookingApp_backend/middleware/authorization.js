const jwt = require("jsonwebtoken");

function verifyAdmin(req, res, next) {
    if (req.headers['authorization'] !== undefined) {
        const token = req.headers['authorization'];

        const { account } = jwt.decode(token);
        if (account === 1) {
            next();
        } else {
            res.status(403).send({ error: "You have no authorization for this action" })
        }
    } else {
        res.status(403).send({ error: "You have no authorization for this action" })
    }
}

function verifyAllotor(req, res, next) {
    if (req.headers['authorization'] !== undefined) {
        const token = req.headers['authorization'];

        const { account } = jwt.decode(token);
        if (account === 3) {
            next();
        } else {
            res.status(403).send({ error: "You have no authorization for this action" })
        }
    } else {
        res.status(403).send({ error: "You have no authorization for this action" })
    }
}

function verifyAdminBooker(req, res, next) {
    if (req.headers['authorization'] !== undefined) {
        const token = req.headers['authorization'];

        const { account } = jwt.decode(token);
        if ([1, 2].includes(account)) {
            next();
        } else {
            res.status(403).send({ error: "You have no authorization for this action" })
        }
    } else {
        res.status(403).send({ error: "You have no authorization for this action" })
    }
}

function verifyDriverAllotorAdmin(req, res, next) {
    if (req.headers['authorization'] !== undefined) {
        const token = req.headers['authorization'];

        const { account } = jwt.decode(token);
        if ([1, 3, 4].includes(account)) {
            next();
        } else {
            res.status(403).send({ error: "You have no authorization for this action" })
        }
    } else {
        res.status(403).send({ error: "You have no authorization for this action" })
    }
}

module.exports = { verifyAdmin, verifyAdminBooker, verifyAllotor, verifyDriverAllotorAdmin }