import type { NextApiRequest, NextApiResponse } from "next";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === "POST") {
    const { htmlContent, cssContent } = req.body;

    const response = await fetch(`${process.env.PAYLOADCMS_URL}/api/pages`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        // Authorization: `Bearer ${process.env.PAYLOADCMS_API_KEY}`,
      },
      body: JSON.stringify({
        title: "New Landing Page",
        htmlContent,
        cssContent,
      }),
    });

    const data = await response.json();
    res.status(200).json(data);
  } else {
    res.status(405).json({ message: "Method Not Allowed" });
  }
}
