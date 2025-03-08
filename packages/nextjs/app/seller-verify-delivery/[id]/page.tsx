"use client";

import { useEffect } from "react";
import Image from "next/image";
import { NextPage } from "next";
import Swal from "sweetalert2";

// Seller
// Tracking Number, Order Time, Sender Details (Encrypted), Parcel Weight & Dimensions, Dispatch Time, Employee ID Wallet Address, Digital Signature
// Local Hub
// Tracking Number, Received Time, Current Parcel Hub ID/Location, Dispatched Time, Employee ID Wallet Address, Digital Signature
// Regional Hub
// Tracking Number, Received Time, Current Parcel Hub ID/Location, Dispatched Time, Employee ID Wallet Address, Digital Signature
// National Hub
// Tracking Number, Received Time, Current Parcel Hub ID/Location, Dispatched Time, Employee ID Wallet Address, Digital Signature
// International Hub
// Tracking Number, Received Time, Current Parcel Hub ID/Location, Customs Clearance Time (If applicable), Dispatched Time, Employee ID Wallet Address, Digital Signature
// Customer
// Tracking Number, Out for Delivery Time, Delivery Time, Receiver Confirmation (Signature or Digital Proof), Employee ID Wallet Address, Digital Signature

const ParcelSellerVerify: NextPage = () => {
  useEffect(() => {
    Swal.fire({
      title: "Loading...",
      html: "Please wait while we redirect you to the home page.",
      timer: 3000,
      timerProgressBar: true,
      didOpen: () => {
        Swal.showLoading();
      },
    }).then(() => {
      window.location.href = "/";
    });
  }, []);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      <h1 className="text-4xl font-bold mt-8">Seller&apos;s Delivery Verification</h1>
      <p>Verify your parcel ready for delivery.</p>

      {/* Ordered Item detail */}
      <div className="flex flex-col w-[40%] min-w-96 gap-4 mb-4">
        <ul className="list bg-base-100 rounded-box w-full shadow-md">
          <li className="p-4 pb-2 text-xs opacity-60 tracking-wide">Parcel</li>

          <div className="p-4">
            <p>Invalid parcel tracking number.</p>
            <p>Redirecting you to the home page ...</p>
          </div>
        </ul>
      </div>
    </div>
  );
};

export default ParcelSellerVerify;
