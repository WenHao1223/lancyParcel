"use client";

import { useEffect, useState } from "react";

// Define the structure of your JSON data
interface JsonData {
  message: string;
  count: number;
}

export default function Home() {
  const [data, setData] = useState<JsonData | null>(null);
  const [inputValue, setInputValue] = useState<string>("");

  // Fetch JSON Data from API
  useEffect(() => {
    async function fetchData() {
      try {
        const response = await fetch("/api/updateJson");
        if (!response.ok) throw new Error("Failed to fetch data");
        const json: JsonData = await response.json();
        setData(json);
      } catch (error) {
        console.error(error);
      }
    }
    fetchData();
  }, []);

  // Update JSON Data
  async function handleUpdate() {
    if (!data) return;

    const newData: JsonData = { message: inputValue, count: data.count + 1 };

    try {
      const response = await fetch("/api/updateJson", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newData),
      });

      if (!response.ok) throw new Error("Failed to update data");
      setData(newData);
    } catch (error) {
      console.error(error);
    }
  }

  return (
    <div>
      <h1>JSON Data</h1>
      {data ? <pre>{JSON.stringify(data, null, 2)}</pre> : <p>Loading...</p>}

      <input
        type="text"
        value={inputValue}
        onChange={e => setInputValue(e.target.value)}
        placeholder="Update message"
      />
      <button onClick={handleUpdate}>Update JSON</button>
    </div>
  );
}
