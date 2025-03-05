"use client";

import Link from "next/link";
import parcelJSON from "../../public/data/parcel.json";
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
  const origin = "1.2.1.1";
  const destination = "1.2.1.1";

  // Helper function to find the common prefix level
  const findCommonPrefix = (addr1: string, addr2: string): number => {
    const parts1 = addr1.split(".");
    const parts2 = addr2.split(".");
    for (let i = 0; i < parts1.length; i++) {
      if (parts1[i] !== parts2[i]) {
        return i;
      }
    }
    return parts1.length;
  };

  // Helper function to generate path segments going upwards (towards common ancestor)
  const generateUpwardPath = (address: string, commonLevel: number): string[] => {
    const parts = address.split(".");
    const paths: string[] = [address];

    // Only go up to the common level
    for (let i = parts.length - 1; i >= commonLevel; i--) {
      const segment = [...parts];
      for (let j = i; j < parts.length; j++) {
        segment[j] = "0";
      }
      const path = segment.join(".");
      if (path !== address && path !== "0.0.0.0") {
        paths.push(path);
      }
    }
    return paths;
  };

  // Helper function to generate path segments going downwards (from common ancestor)
  const generateDownwardPath = (address: string, commonLevel: number): string[] => {
    const parts = address.split(".");
    const paths: string[] = [];

    // Start from common level
    for (let i = commonLevel; i < parts.length - 1; i++) {
      const segment = [...parts];
      for (let j = i + 1; j < parts.length; j++) {
        segment[j] = "0";
      }
      const path = segment.join(".");
      if (path !== "0.0.0.0") {
        paths.push(path);
      }
    }
    paths.push(address);
    return paths;
  };

  // Generate complete path
  const fullPath =
    origin === destination
      ? ["No pathway needed - Origin and Destination are the same"]
      : (() => {
          const commonLevel = findCommonPrefix(origin, destination);
          return [...generateUpwardPath(origin, commonLevel), ...generateDownwardPath(destination, commonLevel)];
        })();

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
      <div className="mt-10 flex justify-start items-center gap-2 flex-col sm:flex-row border-white">
        <button className="btn">
          <Link href="/">Back</Link>
        </button>
      </div>
    </div>
  );
};

export default AlgoTest;
