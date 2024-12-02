import type { NextApiRequest, NextApiResponse } from "next";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const response = await fetch(`${process.env.PAYLOADCMS_URL}/api/pages`, {
    headers: {
      // Uncomment and use the API key if needed
      // Authorization: `Bearer ${process.env.PAYLOADCMS_API_KEY}`,
    },
  });

  const data = await response.json();
  console.log(data);
  const latestPage = data.docs[0];
  res.status(200).json({
    title: latestPage?.title || "",
    htmlContent: latestPage?.htmlContent || "",
    cssContent: latestPage?.cssContent || "",
    description: latestPage?.description || "",
    gjsData: latestPage?.gjsData || {},
  });
}
