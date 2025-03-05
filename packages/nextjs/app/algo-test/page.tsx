"use client";

import parcelJSON from "../../public/data/parcel.json";
import { NextPage } from "next";

// 1.2.1.1, 1.3.1.1

// 1.⁠ ⁠algorithm compares this 2 ids, from the first to last character
// 2.⁠ ⁠algorithm found only first part '1.' is the same (you can split it by ".", something like python to get 4 elements in a list, and compare)
// 3.⁠ ⁠the other 3 digits are different, replace with 0, generating 1.0.0.0
// 4.⁠ ⁠comparing this address again with sender parcel, 1.2.1.1, we know that it needs to traverse to 1.2.0.0, 1.2.1.0, and reverse the sequence become -> 1.0.0.0, 1.2.0.0, 1.2.1.0, 1.2.1.1
// 5.⁠ ⁠comparing this address again with receiver parcel, 1.3.1.1, we know that it needs to traverse to 1.3.0.0, 1.3.1.0, 1.3.3.1
// 6.⁠ ⁠combine 2 lists to generate full pathway

// to get 1.3.1.1, check the list from localArea.json by input: area

const AlgoTest: NextPage = () => {
  const origin = "1.3.2.1";
  const destination = "2.6.1.1";

  // Helper function to generate path segments going upwards (towards common ancestor)
  const generateUpwardPath = (address: string): string[] => {
    const parts = address.split(".");
    const paths: string[] = [address];

    for (let i = parts.length - 1; i >= 0; i--) {
      const segment = [...parts];
      for (let j = i; j < parts.length; j++) {
        segment[j] = "0";
      }
      const path = segment.join(".");
      if (path !== address && path !== "0.0.0.0") {
        // Skip 0.0.0.0
        paths.push(path);
      }
    }
    return paths;
  };

  // Helper function to generate path segments going downwards (from common ancestor)
  const generateDownwardPath = (address: string): string[] => {
    const parts = address.split(".");
    const paths: string[] = [];

    for (let i = 0; i < parts.length - 1; i++) {
      const segment = [...parts];
      for (let j = i + 1; j < parts.length; j++) {
        segment[j] = "0";
      }
      const path = segment.join(".");
      if (path !== "0.0.0.0") {
        // Skip 0.0.0.0
        paths.push(path);
      }
    }
    paths.push(address); // Add destination
    return paths;
  };

  // Generate complete path
  const fullPath = [...generateUpwardPath(origin), ...generateDownwardPath(destination)];

  return (
    <div className="flex flex-col items-center mt-20 min-h-screen">
      <h1 className="text-4xl font-bold">Algo Test</h1>
      <div className="flex flex-col gap-4 mt-8">
        <div>Origin: {origin}</div>
        <div>Destination: {destination}</div>
        <div className="mt-4">
          <div className="font-bold">Full pathway:</div>
          <div className="flex flex-col gap-2">
            {fullPath.map((path, index) => (
              <div key={index} className="font-mono">
                {path}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AlgoTest;
