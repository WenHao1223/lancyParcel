import fs from "fs";
import type { NextApiRequest, NextApiResponse } from "next";
import path from "path";

const filePath = path.join(process.cwd(), "data", "temporaryParcel.json");

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

  if (req.method === "PUT") {
    try {
      const newParcel = req.body;

      // Step 1: Read existing file data
      let existingData: any[] = [];

      if (fs.existsSync(filePath)) {
        const jsonData = fs.readFileSync(filePath, "utf8");
        if (jsonData.trim()) {
          existingData = JSON.parse(jsonData); // Convert JSON string to array
        }
      }

      // Step 2: Append new parcel to the array
      existingData.push(newParcel);

      // Step 3: Write updated data back to the file
      fs.writeFileSync(filePath, JSON.stringify(existingData, null, 2), "utf8");

      return res.status(200).json({ message: "Parcel added successfully" });
    } catch (error) {
      return res.status(500).json({ error: "Failed to update JSON file" });
    }
  }

  return res.status(405).json({ message: "Method Not Allowed" });
}
