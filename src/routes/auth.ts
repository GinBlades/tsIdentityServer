import express from "express";
import App from "../models/App";
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
        code: codeToken
    });
    await app.save();

    res.json({code: codeToken});
});

export default router;
