export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const { price = 0, rent = 0 } = req.body || {};

    const monthlyCashFlow = Number(rent) - Number(price) * 0.006;
    const capRate = Number(price) > 0 ? (Number(rent) * 12) / Number(price) : 0;

    let score = 0;
    if (monthlyCashFlow > 500) score += 30;
    if (capRate > 0.07) score += 25;
    if (Number(price) > 0 && Number(rent) / Number(price) > 0.01) score += 20;

    return res.status(200).json({
      score,
      cashFlow: monthlyCashFlow,
      capRate,
    });
  } catch (error) {
    return res.status(500).json({
      error: "Analyze failed",
      details: error.message,
    });
  }
}
