"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { useParams } from "next/navigation";
import { NextPage } from "next";
import Swal from "sweetalert2";
import parcelJSON from "~~/data/parcel.json";
import parcelHubJSON from "~~/data/parcelHub.json";
import { CustomerWithoutPasswordInterface, ParcelHubInterface, ParcelInterface } from "~~/interfaces/GeneralInterface";

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

const ParcelReceiveCustomer: NextPage = () => {
  const params = useParams();

  const [customerData, setCustomerData] = useState<CustomerWithoutPasswordInterface | null>(null);
  const [parcelData, setParcelData] = useState<ParcelInterface[] | null>(null);
  const [isLogin, setIsLogin] = useState<null | boolean>(null);

  const [trackingNumber, setTrackingNumber] = useState("");

  useEffect(() => {
    if (!params) return;
    setTrackingNumber(Array.isArray(params.id) ? params.id[0] : params.id);
  }, [params]);

  const [specificParcel, setSpecificParcel] = useState<ParcelInterface | null>(null);
  const [isCurrentCustomer, setIsCurrentCustomer] = useState<boolean | null>(null);

  const [receivedTime, setReceivedTime] = useState("");
  const [prevParcelHub, setPrevParcelHub] = useState<ParcelHubInterface | null>(null);
  const [dispatchedTime, setDispatchedTime] = useState("");

  useEffect(() => {
    const employeeBase64 = localStorage.getItem("employeeData");
    const customerBase64 = localStorage.getItem("customerData");

    if (employeeBase64) {
      // redirect to employee dashboard
      window.location.href = "/employee-dashboard";
    } else if (customerBase64) {
      const customerString = atob(customerBase64);
      const customer = JSON.parse(customerString);
      setCustomerData(customer);
      setIsLogin(true);
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
  useEffect(() => {
    if (!parcelData) {
      setParcelData(parcelJSON);
    }
  }, [parcelData]);

  useEffect(() => {
    if (parcelData) {
      const parcel = parcelData.find(parcel => parcel.tracking_number === trackingNumber);
      if (parcel) {
        setSpecificParcel(parcel);
      } else {
        setSpecificParcel(null);
      }
    }
  }, [trackingNumber, parcelData]);

  useEffect(() => {
    if (specificParcel && customerData) {
      // check if the recipient is the current user
      if (specificParcel.recipient.email === customerData.email) {
        setIsCurrentCustomer(true);
      } else {
        setIsCurrentCustomer(false);
      }
    }
  }, [specificParcel, customerData]);

  useEffect(() => {
    if (specificParcel && customerData && isCurrentCustomer) {
      setReceivedTime(new Date().toISOString());
      setPrevParcelHub(parcelHubJSON.find(ph => ph.parcel_hub_id === specificParcel.current_location) || null);
      setDispatchedTime(specificParcel.pathway[specificParcel.pathway.length - 1].dispatch_time || "");
    }
  }, [specificParcel, customerData, isCurrentCustomer]);

  const placeDigitalSigature = () => {
    console.log("Placing digital signature...");
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      <h1 className="text-4xl font-bold">Recipent Receive Parcel Verification</h1>
      <p>Verify your parcel here.</p>

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
              {specificParcel && (
                <div
                  className="link hover:text-secondary no-underline"
                  onClick={() =>
                    (
                      document.getElementById("modal-trackingNo-" + specificParcel.tracking_number) as HTMLDialogElement
                    )?.showModal()
                  }
                >
                  {trackingNumber}
                </div>
              )}
              <div className="text-xs font-semibold opacity-60">
                {isCurrentCustomer === true ? (
                  <>
                    Dispatched on{" "}
                    <span className="italic">
                      {new Date(dispatchedTime).toLocaleString("en-SG", {
                        timeZone: "Asia/Singapore",
                      })}
                    </span>
                  </>
                ) : isCurrentCustomer === false ? (
                  <>Record not found.</>
                ) : (
                  <>Loading...</>
                )}
              </div>
            </div>
            {isCurrentCustomer && (
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

        {isCurrentCustomer && specificParcel && customerData && (
          <>
            <div className="card bg-base-100 w-full shadow-sm p-4">
              <div className="flex flex-row justify-between items-center">
                <p className="font-semibold">Send From</p>
                <p
                  className="link hover:text-secondary no-underline"
                  onClick={() =>
                    (
                      document.getElementById("modal-sender-" + specificParcel.tracking_number) as HTMLDialogElement
                    )?.showModal()
                  }
                >
                  {prevParcelHub?.parcel_hub_name}
                </p>
              </div>
              <div className="flex flex-row justify-between items-center">
                <p className="font-semibold">Send To</p>
                <p
                  className="link hover:text-secondary no-underline"
                  onClick={() =>
                    (
                      document.getElementById("modal-recipent-" + specificParcel.tracking_number) as HTMLDialogElement
                    )?.showModal()
                  }
                >
                  {specificParcel.recipient.name}
                </p>
              </div>
              <div className="flex flex-row justify-between items-center">
                <p className="font-semibold">Received Time</p>
                <p>
                  {new Date(receivedTime).toLocaleString("en-SG", {
                    timeZone: "Asia/Singapore",
                  })}
                </p>
              </div>
              <div className="flex flex-row justify-between items-center">
                <p className="font-semibold">Customer ID</p>
                <p>{customerData.email}</p>
              </div>
            </div>
          </>
        )}
      </div>

      {/* Sender Modal */}
      {specificParcel && (
        <dialog id={"modal-sender-" + specificParcel.tracking_number} className="modal">
          <div className="modal-box">
            <h3 className="font-bold text-lg">
              {
                parcelHubJSON.find(
                  ph => ph.parcel_hub_id === specificParcel.pathway[specificParcel.pathway.length - 1].parcel_hub_id,
                )?.parcel_hub_name
              }
            </h3>
            <p className="pb-2">Press ESC key or click the button below to close</p>
            {/* Parcel Hub ID */}
            <div className="flex justify-between items-center">
              <p>Parcel Hub ID</p>
              <p>{specificParcel.pathway[specificParcel.pathway.length - 1].parcel_hub_id}</p>
            </div>
            {/* Parcel Hub Location */}
            <div className="flex justify-between items-center">
              <p>Parcel Hub Location</p>
              <p>
                {parcelHubJSON.find(
                  ph => ph.parcel_hub_id === specificParcel.pathway[specificParcel.pathway.length - 1].parcel_hub_id,
                )?.parcel_hub_address +
                  ", " +
                  parcelHubJSON.find(
                    ph => ph.parcel_hub_id === specificParcel.pathway[specificParcel.pathway.length - 1].parcel_hub_id,
                  )?.state +
                  ", " +
                  parcelHubJSON.find(
                    ph => ph.parcel_hub_id === specificParcel.pathway[specificParcel.pathway.length - 1].parcel_hub_id,
                  )?.country}
              </p>
            </div>
            {/* Parcel Hub Operating Level */}
            <div className="flex justify-between items-center">
              <p>Parcel Hub Operating Level</p>
              <p>
                <span
                  className={`badge badge-outline badge-sm ${
                    parcelHubJSON
                      .find(
                        ph =>
                          ph.parcel_hub_id === specificParcel.pathway[specificParcel.pathway.length - 1].parcel_hub_id,
                      )
                      ?.parcel_hub_operating_level.toLowerCase() === "international"
                      ? "badge-success"
                      : parcelHubJSON
                            .find(
                              ph =>
                                ph.parcel_hub_id ===
                                specificParcel.pathway[specificParcel.pathway.length - 1].parcel_hub_id,
                            )
                            ?.parcel_hub_operating_level.toLowerCase() === "national"
                        ? "badge-info"
                        : parcelHubJSON
                              .find(
                                ph =>
                                  ph.parcel_hub_id ===
                                  specificParcel.pathway[specificParcel.pathway.length - 1].parcel_hub_id,
                              )
                              ?.parcel_hub_operating_level.toLowerCase() === "regional"
                          ? "badge-warning"
                          : "badge-error"
                  }`}
                >
                  {(parcelHubJSON
                    .find(
                      ph =>
                        ph.parcel_hub_id === specificParcel.pathway[specificParcel.pathway.length - 1].parcel_hub_id,
                    )
                    ?.parcel_hub_operating_level.charAt(0)
                    .toUpperCase() || "") +
                    (parcelHubJSON
                      .find(
                        ph =>
                          ph.parcel_hub_id === specificParcel.pathway[specificParcel.pathway.length - 1].parcel_hub_id,
                      )
                      ?.parcel_hub_operating_level.slice(1)
                      .toLowerCase() || "")}
                </span>
              </p>
            </div>
            {/* Close button */}
            <div className="modal-action">
              <form method="dialog">
                {/* if there is a button in form, it will close the modal */}
                <button className="btn">Close</button>
              </form>
            </div>
          </div>
        </dialog>
      )}

      {/* Recipent Modal */}
      {specificParcel && (
        <dialog id={"modal-recipent-" + specificParcel.tracking_number} className="modal">
          <div className="modal-box">
            <h3 className="font-bold text-lg">{specificParcel.recipient.name}</h3>
            <p className="pb-2">Press ESC key or click the button below to close</p>
            {/* Recipent phone number */}
            <div className="flex justify-between items-center">
              <p>Phone number</p>
              <p>{specificParcel.recipient.phone_number}</p>
            </div>
            {/* Recipent email */}
            <div className="flex justify-between items-center">
              <p>Email</p>
              <p>{specificParcel.recipient.email}</p>
            </div>
            {/* Close button */}
            <div className="modal-action">
              <form method="dialog">
                {/* if there is a button in form, it will close the modal */}
                <button className="btn">Close</button>
              </form>
            </div>
          </div>
        </dialog>
      )}

      {isCurrentCustomer && (
        <div className="flex flex-row w-[40%] min-w-96 gap-4 justify-center mt-4">
          <button className="btn btn-error btn-disabled w-1/2">Cancel</button>
          <button className="btn btn-primary w-1/2" onClick={placeDigitalSigature}>
            Place Digital Signature
          </button>
        </div>
      )}
    </div>
  );
};

export default ParcelReceiveCustomer;
