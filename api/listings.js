export default async function handler(req, res) {
  const ATTOM_API_KEY = process.env.ATTOM_API_KEY;
  const { postalcode = "85001" } = req.query;

  try {
    const response = await fetch(
      `https://api.gateway.attomdata.com/propertyapi/v1.0.0/property/snapshot?postalcode=${encodeURIComponent(postalcode)}`,
      {
        headers: {
          Accept: "application/json",
          APIKey: ATTOM_API_KEY,
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