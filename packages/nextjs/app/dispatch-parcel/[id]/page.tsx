"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { useParams } from "next/navigation";
import parcelJSON from "../../../public/data/parcel.json";
import parcelHubJSON from "../../../public/data/parcelHub.json";
import { NextPage } from "next";
import { EmployeeWithoutPasswordInterface, ParcelHubInterface, ParcelInterface } from "~~/interfaces/GeneralInterface";

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

const ParcelDispatch: NextPage = () => {
  const params = useParams();

  useEffect(() => {
    if (!params) return;
    setTrackingNumber(Array.isArray(params.id) ? params.id[0] : params.id);
  }, [params]);

  const [loginData, setLoginData] = useState<EmployeeWithoutPasswordInterface | null>(null);
  const [parcelHubData, setParcelHubData] = useState<ParcelHubInterface | null>(null);
  const [parcelData, setParcelData] = useState<ParcelInterface[] | null>(null);
  const [isLogin, setIsLogin] = useState<null | boolean>(null);

  const [trackingNumber, setTrackingNumber] = useState("");

  const [specificParcel, setSpecificParcel] = useState<ParcelInterface | null>(null);
  const [isInsidePathway, setIsInsidePathway] = useState<boolean | null>(null);

  const [receivedTime, setReceivedTime] = useState("");
  const [currentParcelHub, setCurrentParcelHub] = useState<ParcelHubInterface | null>(null);
  const [nextParcelHub, setNextParcelHub] = useState<ParcelHubInterface | null>(null);
  const [dispatchedTime, setDispatchedTime] = useState("");
  const [employeeID, setEmployeeID] = useState("");

  useEffect(() => {
    const userBase64 = localStorage.getItem("loginData");

    if (userBase64) {
      const userString = atob(userBase64);
      const user = JSON.parse(userString);
      setLoginData(user);

      // load parcel hub info from json based on loginData.parcel_hub_id
      const parcelHub = parcelHubJSON.find(p => p.parcel_hub_id === user.parcel_hub_id);
      if (parcelHub) {
        setParcelHubData(parcelHub);
        setEmployeeID(user.employee_id);
        setIsLogin(true);
      } else {
        console.log("Parcel hub not found.");
        setIsLogin(false);
        localStorage.removeItem("loginData");
        window.location.href = "/login";
      }
    } else {
      // not login
      console.log("Please login first.");
      setIsLogin(false);
      window.location.href = "/login";
    }
  }, []);

  useEffect(() => {
    if (isLogin === false) {
      window.location.href = "/login";
    }
  }, [isLogin]);

  // store parcelJSON data into parcelData
  if (!parcelData) {
    setParcelData(parcelJSON);
  }

  useEffect(() => {
    if (parcelData && parcelHubData) {
      setSpecificParcel(parcelData.find(p => p.tracking_number === trackingNumber) || null);
    }
  }, [parcelData, parcelHubData]);

  useEffect(() => {
    if (specificParcel && parcelHubData) {
      // check if the pathway contains the current parcel hub
      setIsInsidePathway(
        specificParcel.pathway.find(ph => ph.parcel_hub_id === parcelHubData.parcel_hub_id) ? true : false,
      );
    }
  }, [specificParcel]);

  useEffect(() => {
    if (specificParcel && parcelHubData && isInsidePathway) {
      setReceivedTime(
        specificParcel.pathway.find(ph => ph.parcel_hub_id === parcelHubData.parcel_hub_id)?.received_time || "",
      );
      setCurrentParcelHub(parcelHubData);
      setNextParcelHub(
        parcelHubJSON.find(
          ph =>
            ph.parcel_hub_id ===
            specificParcel.pathway[
              specificParcel.pathway.findIndex(ph => ph.parcel_hub_id === parcelHubData.parcel_hub_id) + 1
            ]?.parcel_hub_id,
        ) || null,
      );
      setDispatchedTime(
        // current time to string and follow the format of 2025-03-05T06:00:00Z
        new Date().toISOString(),
      );
      setEmployeeID(employeeID);
    }
  }, [specificParcel, isInsidePathway]);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      <h1 className="text-4xl font-bold">Dispatch Parcel</h1>
      <p>Confirm to dispatch your parcel here.</p>

      {/* Ordered Item detail */}
      <div className="flex flex-col w-[40%] min-w-96 gap-4 mb-4">
        <ul className="list bg-base-100 rounded-box w-full shadow-md">
          <li className="p-4 pb-2 text-xs opacity-60 tracking-wide">Parcel</li>

          <li className="list-row">
            <div>
              <Image
                width={40}
                height={40}
                className="rounded-box"
                src="https://img.daisyui.com/images/profile/demo/1@94.webp"
                alt=""
              />
            </div>
            <div>
              <div>{trackingNumber}</div>
              <div className="text-xs font-semibold opacity-60">
                {isInsidePathway === true ? (
                  <>Received on {receivedTime}</>
                ) : isInsidePathway === false ? (
                  <>Record not found.</>
                ) : (
                  <>Loading...</>
                )}
              </div>
            </div>
            {isInsidePathway && (
              <button className="btn btn-square btn-ghost">
                <div className="tooltip" data-tip="Check product details">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth="1.5"
                    stroke="currentColor"
                    className="size-6"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z"
                    />
                  </svg>
                </div>
              </button>
            )}
          </li>
        </ul>

        <div className="divider" />

        {isInsidePathway && (
          <>
            <div className="card bg-base-100 w-full shadow-sm p-4">
              <div className="flex flex-row justify-between items-center">
                <p className="font-semibold">Send From</p>
                <p>{currentParcelHub?.parcel_hub_name}</p>
              </div>
              <div className="flex flex-row justify-between items-center">
                <p className="font-semibold">Send To</p>
                <p>{nextParcelHub?.parcel_hub_name}</p>
              </div>
              <div className="flex flex-row justify-between items-center">
                <p className="font-semibold">Dispatched Time</p>
                <p>
                  {new Date(dispatchedTime).toLocaleString("en-SG", {
                    timeZone: "Asia/Singapore",
                  })}
                </p>
              </div>
              <div className="flex flex-row justify-between items-center">
                <p className="font-semibold">Employee ID</p>
                <p>{employeeID}</p>
              </div>
            </div>
          </>
        )}
      </div>

      {isInsidePathway && (
        <div className="flex flex-row w-[40%] min-w-96 gap-4 justify-center mt-4">
          <button className="btn btn-error btn-disabled w-1/2">Cancel</button>
          <button className="btn btn-primary w-1/2">Place Digital Signature</button>
        </div>
      )}
    </div>
  );
};

export default ParcelDispatch;
