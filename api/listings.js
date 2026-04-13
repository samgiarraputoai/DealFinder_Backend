export default async function handler(req, res) {
  const ATTOM_API_KEY = process.env.ATTOM_API_KEY;
  const { city = "Phoenix", state = "AZ" } = req.query;

  try {
    const response = await fetch(
      `https://api.gateway.attomdata.com/propertyapi/v1.0.0/property/address?city=${city}&state=${state}`,
      {
        headers: {
          apikey: ATTOM_API_KEY,
        },
      }
    );

    const data = await response.json();

    return res.status(200).json(data);
  } catch (error) {
    return res.status(500).json({
      error: "ATTOM fetch failed",
      details: error.message,
    });
  }
}