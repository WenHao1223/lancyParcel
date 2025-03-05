"use client";

import { useState } from "react";
//Write Contract
import { NextPage } from "next";
import { useAccount } from "wagmi";
import { useScaffoldContract } from "~~/hooks/scaffold-eth";
import { useScaffoldReadContract } from "~~/hooks/scaffold-eth";
//Read Contract
import { useScaffoldWriteContract } from "~~/hooks/scaffold-eth";

//Write Contract

//Signature Hashing
const useHashSignature = (connectedAddress: string | undefined) => {
  const { writeContractAsync } = useScaffoldWriteContract({
    contractName: "YourContract",
  });

  const handleHashSignature = async () => {
    if (!connectedAddress) {
      alert("Please connect MetaMask first!");
      return "";
    }

    try {
      const tx = await writeContractAsync({
        functionName: "hashAddress",
        args: [connectedAddress],
      });

      if (tx) {
        alert(`Transaction sent! Hash: ${tx}`);
        return tx;
      }
    } catch (error) {
      console.error("Error hashing address:", error);
      alert("Transaction failed!");
      return "";
    }
  };

  return { handleHashSignature };
};

//Parcel
const useHashParcel = () => {
  const { writeContractAsync } = useScaffoldWriteContract({
    contractName: "YourContract",
  });

  const hashParcelData = async (
    trackingNumber: string,
    dispatchTime: string,
    localHubId: string,
    sender: string,
    employee: string,
  ) => {
    try {
      const tx = await writeContractAsync({
        functionName: "hashParcelData",
        args: [trackingNumber, dispatchTime, localHubId, sender, employee],
      });

      if (tx) {
        alert(`Transaction successful! Hash: ${tx}`);
        return tx; // Returning hash
      }
    } catch (error) {
      console.error("Error hashing parcel data:", error);
      alert("Transaction failed!");
      return null;
    }
  };

  return { hashParcelData };
};

//Send
const useHashSend = () => {
  const { writeContractAsync } = useScaffoldWriteContract({
    contractName: "YourContract",
  });

  const hashSendData = async (trackingNumber: string, dispatchTime: string, localHubId: string, employee: string) => {
    try {
      const tx = await writeContractAsync({
        functionName: "hashSendData",
        args: [trackingNumber, dispatchTime, localHubId, employee],
      });

      if (tx) {
        alert(`Transaction successful! Hash: ${tx}`);
        return tx; // Returning hash
      }
    } catch (error) {
      console.error("Error hashing parcel data:", error);
      alert("Transaction failed!");
      return null;
    }
  };

  return { hashSendData };
};

//Receive
const useHashReceive = () => {
  const { writeContractAsync } = useScaffoldWriteContract({
    contractName: "YourContract",
  });

  const hashReceiveData = async (trackingNumber: string, receiveTime: string, hubId: string, employee: string) => {
    try {
      const tx = await writeContractAsync({
        functionName: "hashReceiveData",
        args: [trackingNumber, receiveTime, hubId, employee],
      });

      if (tx) {
        alert(`Transaction successful! Hash: ${tx}`);
        return tx; // Returning hash
      }
    } catch (error) {
      console.error("Error hashing parcel data:", error);
      alert("Transaction failed!");
      return null;
    }
  };

  return { hashReceiveData };
};

//Confirm
const useHashConfirm = () => {
  const { writeContractAsync } = useScaffoldWriteContract({
    contractName: "YourContract",
  });

  const hashConfirmData = async (trackingNumber: string, receiveTime: string, customer: string) => {
    try {
      const tx = await writeContractAsync({
        functionName: "hashConfirmData",
        args: [trackingNumber, receiveTime, customer],
      });

      if (tx) {
        alert(`Transaction successful! Hash: ${tx}`);
        return tx; // Returning hash
      }
    } catch (error) {
      console.error("Error hashing parcel data:", error);
      alert("Transaction failed!");
      return null;
    }
  };

  return { hashConfirmData };
};

const ParcelTemplate: NextPage = () => {
  const { address: connectedAddress } = useAccount();
  const { data: deployedContractData } = useScaffoldContract({
    contractName: "YourContract",
  });

  //Read Contract Methods
  const ContractReadMethods = () => {
    const { data: sayHelloData, isLoading } = useScaffoldReadContract({
      contractName: "YourContract",
      functionName: "sayHello",
    });

    if (isLoading) {
      return <p>Loading sayHello...</p>;
    }
    return <h2>{sayHelloData || "No data"}</h2>;
  };

  //Signature Hashing
  const { handleHashSignature } = useHashSignature(connectedAddress);

  const handleHashTransaction = async () => {
    const tx = await handleHashSignature();

    if (tx) {
      alert(`Transaction Hash: ${tx}`);
    } else {
      alert("Transaction failed or canceled!");
    }
  };

  //Parcel
  const { hashParcelData } = useHashParcel();

  const handleParcelHashing = async () => {
    const txHash = await hashParcelData(
      "TRK123456", // Tracking number
      "2025-03-06T12:00:00Z", // Dispatch time
      "HUB-MY-001", // Local hub ID
      "0x04B248BA46a5F9542FD27DD59E933621911Ec1D5", // Sender
      "0x04B248BA46a5F9542FD27DD59E933621911Ec1D5", // Employee
    );

    if (txHash) {
      alert(`Parcel Data Hashed! TX Hash: ${txHash}`);
    } else {
      alert("Parcel Hashing Failed!");
    }
  };

  //Send
  const { hashSendData } = useHashSend();

  const handleSendHashing = async () => {
    const txHash = await hashSendData(
      "TRK123456", // Tracking number
      "2025-03-06T12:00:00Z", // Dispatch time
      "HUB-MY-001", // Hub ID
      "0x04B248BA46a5F9542FD27DD59E933621911Ec1D5", // Employee
    );

    if (txHash) {
      alert(`Parcel Data Hashed! TX Hash: ${txHash}`);
    } else {
      alert("Parcel Hashing Failed!");
    }
  };

  //Receive
  const { hashReceiveData } = useHashReceive();

  const handleReceiveHashing = async () => {
    const txHash = await hashReceiveData(
      "TRK123456", // Tracking number
      "2025-03-06T12:00:00Z", // Receive time
      "HUB-MY-001", // Hub ID
      "0x04B248BA46a5F9542FD27DD59E933621911Ec1D5", // Employee
    );

    if (txHash) {
      alert(`Parcel Data Hashed! TX Hash: ${txHash}`);
    } else {
      alert("Parcel Hashing Failed!");
    }
  };

  //Confirm
  const { hashConfirmData } = useHashConfirm();

  const handleConfirmHashing = async () => {
    const txHash = await hashConfirmData(
      "TRK123456", // Tracking number
      "2025-03-06T12:00:00Z", // Receive time
      "0x04B248BA46a5F9542FD27DD59E933621911Ec1D5", // Customer
    );

    if (txHash) {
      alert(`Parcel Data Hashed! TX Hash: ${txHash}`);
    } else {
      alert("Parcel Hashing Failed!");
    }
  };

  return (
    <div>
      {deployedContractData ? <ContractReadMethods /> : <p>Loading contract data...</p>}

      <button className="btn" onClick={handleHashTransaction}>
        Signature Hashing
      </button>

      <button className="btn" onClick={handleParcelHashing}>
        Hash Parcel Data
      </button>

      <button className="btn" onClick={handleSendHashing}>
        Hash Send Data
      </button>

      <button className="btn" onClick={handleReceiveHashing}>
        Hash Receive Data
      </button>

      <button className="btn" onClick={handleConfirmHashing}>
        Hash Confirm Data
      </button>
    </div>
  );
};

export default ParcelTemplate;
