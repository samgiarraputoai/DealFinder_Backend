export default async function handler(req, res) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  if (req.method === "OPTIONS") {
    return res.status(200).end();
  }

  try {
    const city = req.query.city || "Phoenix";
    const state = req.query.state || "AZ";

    if (!process.env.RENTCAST_API_KEY) {
      return res.status(500).json({
        error: "Missing RENTCAST_API_KEY in Vercel environment variables",
      });
    }

    const url = `https://api.rentcast.io/v1/listings/sale?city=${encodeURIComponent(
      city
    )}&state=${encodeURIComponent(state)}&limit=50`;

    const response = await fetch(url, {
      headers: {
        "X-Api-Key": process.env.RENTCAST_API_KEY,
        Accept: "application/json",
      },
    });

    const text = await response.text();

    if (!response.ok) {
      return res.status(response.status).json({
        error: "RentCast request failed",
        status: response.status,
        details: text,
      });
    }

    let data;
    try {
      data = JSON.parse(text);
    } catch (e) {
      return res.status(500).json({
        error: "RentCast returned non-JSON response",
        details: text,
      });
    }

    return res.status(200).json({
      source: "rentcast",
      city,
      state,
      listings: data,
    });
  } catch (error) {
    return res.status(500).json({
      error: "Server error",
      details: error.message,
    });
  }
}
