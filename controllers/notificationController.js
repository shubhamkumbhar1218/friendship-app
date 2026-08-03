const axios = require("axios");

exports.sendNotification = async (req, res) => {
  try {
    const { answer, userAgent, platform, language } = req.body;

    if (answer !== "YES") {
      return res.json({ success: true });
    }

    const ip =
      req.headers["x-forwarded-for"]?.split(",")[0] ||
      req.socket.remoteAddress;

    // Get country from IP (free API)
    let country = "Unknown";

    try {
      const geo = await axios.get(`http://ip-api.com/json/${ip}`);
      country = geo.data.country || "Unknown";
    } catch (e) {
      // Ignore lookup failures
    }

    const time = new Date().toLocaleString();

    const message = `
🎉 Someone accepted your friendship request ❤️

📍 Country: ${country}
🌍 IP: ${ip}
🌐 Browser: ${userAgent}
💻 Device: ${platform}
🗣️ Language: ${language}
🕒 Time: ${time}
`;

    await axios.post(
      `https://api.telegram.org/bot${process.env.BOT_TOKEN}/sendMessage`,
      {
        chat_id: process.env.CHAT_ID,
        text: message
      }
    );

    res.json({ success: true });
  } catch (err) {
    console.error(err.response?.data || err.message);
    res.status(500).json({ success: false });
  }
};