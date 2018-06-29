import express from "express";
import App from "../models/App";
import User from "../models/User";
const router = express.Router();

router.post("/code", async (req, res) => {
    const app = await App.findOne({key: req.body.key});
    if (null == app) {
        res.statusCode = 401;
        return res.json({error: "App not found for given key."});
    }
    const codeToken = App.keygen();

    app.tokens.push({
        issued: new Date().getTime(),
        code: codeToken,
        used: false
    });
    await app.save();

    res.json({code: codeToken});
});

router.post("/token", async (req, res) => {
    const user = User.findOne({"tokens.code": req.body.token});
    const app = App.findOne({key: req.body.key});
    const result = await Promise.all([user, app]);
    if (null == result[0] || null == result[1]) {
        res.statusCode = 401;
        return res.send("Unauthorized");
    }
    res.json({
        username: result[0].username,
        _id: result[0]._id,
        email: result[0].email
    });
})

export default router;
