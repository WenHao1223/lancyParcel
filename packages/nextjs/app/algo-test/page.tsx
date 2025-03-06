"use client";

import Link from "next/link";
import parcelJSON from "../../data/parcel.json";
import { NextPage } from "next";

// Test Case: 2.1.1, 1.3.1.1

// 1.⁠ ⁠algorithm compares this 2 ids, from the first to last character
// 2.⁠ ⁠algorithm found only first part '1.' is the same (you can split it by ".", something like python to get 4 elements in a list, and compare)
// 3.⁠ ⁠the other 3 digits are different, replace with 0, generating 1.0.0.0
// 4.⁠ ⁠comparing this address again with sender parcel, 1.2.1.1, we know that it needs to traverse to 1.2.0.0, 1.2.1.0, and reverse the sequence become -> 1.0.0.0, 1.2.0.0, 1.2.1.0, 1.2.1.1
// 5.⁠ ⁠comparing this address again with receiver parcel, 1.3.1.1, we know that it needs to traverse to 1.3.0.0, 1.3.1.0, 1.3.3.1
// 6.⁠ ⁠combine 2 lists to generate full pathway

// to get 1.3.1.1, check the list from localArea.json by input: area

const AlgoTest: NextPage = () => {
  const origin = "2.6.1.1";
  const destination = "2.6.1.1";

  // Valid addresses in the system
  const validAddresses = [
    "1.0.0.0", // Malaysia International Hub
    "1.2.0.0", // Penang National Hub
    "1.2.1.0", // Penang Central Hub
    "1.2.1.1", // George Town Hub
    "1.3.0.0", // Kuala Lumpur National Hub
    "1.3.1.0", // KL North Hub
    "1.3.1.1", // Sepang Hub
    "1.3.2.0", // KL South Hub
    "1.3.2.1", // KL Sentral Hub
    "1.3.2.2", // Bukit Bintang Hub
    "2.0.0.0", // Singapore Internatioal Hub
    "2.6.0.0", // Singapore National Hub
    "2.6.1.0", // Singapore Central Hub
    "2.6.1.1", // Raffles Place Hub
  ];

  const generatePath = (origin: string, destination: string): string[] => {
    // Validate addresses first
    if (validAddresses.includes(origin) || validAddresses.includes(destination)) {
      return ["Invalid address."];
    }

    if (origin === destination) {
      return []; // No pathway needed - Origin and Destination are the same
    }

    const originParts = origin.split(".");
    const destParts = destination.split(".");
    const path: string[] = [origin];

    // Find common prefix level
    let commonLevel = 0;
    while (commonLevel < originParts.length && originParts[commonLevel] === destParts[commonLevel]) {
      commonLevel++;
    }

    // Generate upward path
    for (let i = originParts.length - 1; i >= commonLevel; i--) {
      const segment = [...originParts];
      for (let j = i; j < originParts.length; j++) {
        segment[j] = "0";
      }
      const upPath = segment.join(".");
      if (upPath !== origin && upPath !== "0.0.0.0") {
        path.push(upPath);
      }
    }

    // Generate downward path
    for (let i = commonLevel; i < destParts.length - 1; i++) {
      const segment = [...destParts];
      for (let j = i + 1; j < destParts.length; j++) {
        segment[j] = "0";
      }
      const downPath = segment.join(".");
      if (downPath !== "0.0.0.0") {
        path.push(downPath);
      }
    }

    if (origin !== destination) {
      path.push(destination);
    }

    return path;
  };

  // Generate complete path
  const fullPath = generatePath(origin, destination);

  return (
    <div className="flex flex-col items-center mt-20 min-h-screen">
      <h1 className="text-4xl font-bold">Algo Test</h1>
      <div className="flex flex-col gap-4 mt-8">
        <div>Origin: {origin}</div>
        <div>Destination: {destination}</div>
        <div className="mt-4">
          <div className="font-bold">Full pathway:</div>
          <div className="flex flex-col gap-2">
            {fullPath.length > 0 ? (
              fullPath.map((path, index) => (
                <div key={index} className="font-mono">
                  {path}
                </div>
              ))
            ) : (
              <div className="font-mono text-center">N/A</div>
            )}
          </div>
        </div>
      </div>
      <div className="mt-10 flex justify-start items-center gap-2 flex-col sm:flex-row border-white">
        <button className="btn">
          <Link href="/">Back</Link>
        </button>
      </div>
    </div>
  );
};

export default AlgoTest;
