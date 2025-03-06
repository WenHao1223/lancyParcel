import fs from "fs";
import type { NextApiRequest, NextApiResponse } from "next";
import path from "path";

const filePath = path.join(process.cwd(), "data", "parcel.json");

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === "GET") {
    try {
      const jsonData = fs.readFileSync(filePath, "utf8");
      const data = JSON.parse(jsonData);
      return res.status(200).json(data);
    } catch (error) {
      return res.status(500).json({ error: "Failed to read JSON file" });
    }
  }

  if (req.method === "POST") {
    try {
      const newData = req.body;
      fs.writeFileSync(filePath, JSON.stringify(newData, null, 2), "utf8");
      return res.status(200).json({ message: "Data updated successfully" });
    } catch (error) {
      return res.status(500).json({ error: "Failed to update JSON file" });
    }
  }

  return res.status(405).json({ message: "Method Not Allowed" });
}
