"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { useParams } from "next/navigation";
import { NextPage } from "next";
import Swal from "sweetalert2";
import { useAccount } from "wagmi";
import employeeJSON from "~~/data/employee.json";
import parcelJSON from "~~/data/parcel.json";
import parcelHubJSON from "~~/data/parcelHub.json";
import { useScaffoldWriteContract } from "~~/hooks/scaffold-eth";
import {
  CustomerWithoutPasswordInterface,
  EmployeeWithoutPasswordInterface,
  ParcelHubInterface,
  ParcelInterface,
} from "~~/interfaces/GeneralInterface";

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
const useHashSignature = (connectedAddress: string | undefined) => {
  const { writeContractAsync } = useScaffoldWriteContract({
    contractName: "YourContract",
  });

  const handleHashSignature = async () => {
    if (!connectedAddress) {
      alert("Please connect MetaMask first!");
      return null;
    }

    try {
      const tx = await writeContractAsync({
        functionName: "hashAddress",
        args: [connectedAddress],
      });

      if (tx) {
        alert(`Transaction sent! Hash: ${tx}`);
        return tx as string;
      }
    } catch (error) {
      console.error("Error hashing address:", error);
      alert("Transaction failed!");
      return "";
    }
  };

  return { handleHashSignature };
};

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
        return tx as string; // Returning hash
      }
    } catch (error) {
      console.error("Error hashing parcel data:", error);
      alert("Transaction failed!");
      return null;
    }
  };

  return { hashSendData };
};

const ParcelDispatch: NextPage = () => {
  const params = useParams();
  const { address: connectedAddress } = useAccount();
  const { handleHashSignature } = useHashSignature(connectedAddress);
  const { hashSendData } = useHashSend();

  useEffect(() => {
    if (!params) return;
    setTrackingNumber(Array.isArray(params.id) ? params.id[0] : params.id);
  }, [params]);

  const [employeeData, setEmployeeData] = useState<EmployeeWithoutPasswordInterface | null>(null);
  const [customerData, setCustomerData] = useState<null | CustomerWithoutPasswordInterface>(null);
  const [parcelHubData, setParcelHubData] = useState<ParcelHubInterface | null>(null);
  const [parcelData, setParcelData] = useState<ParcelInterface[] | null>(null);
  const [isLogin, setIsLogin] = useState<null | boolean>(null);

  const [trackingNumber, setTrackingNumber] = useState("");

  const [specificEmployee, setSpecificEmployee] = useState<EmployeeWithoutPasswordInterface | null>(null);
  const [specificParcel, setSpecificParcel] = useState<ParcelInterface | null>(null);
  const [isInsidePathway, setIsInsidePathway] = useState<boolean | null>(null);

  const [receivedTime, setReceivedTime] = useState("");
  const [currentParcelHub, setCurrentParcelHub] = useState<ParcelHubInterface | null>(null);
  const [nextParcelHub, setNextParcelHub] = useState<ParcelHubInterface | null>(null);
  const [dispatchedTime, setDispatchedTime] = useState("");
  const [employeeID, setEmployeeID] = useState("");

  useEffect(() => {
    const employeeBase64 = localStorage.getItem("employeeData");
    const customerBase64 = localStorage.getItem("customerData");

    if (employeeBase64) {
      const employeeString = atob(employeeBase64);
      const employee = JSON.parse(employeeString);
      setEmployeeData(employee);

      // load parcel hub info from json based on employeeData.parcel_hub_id
      const parcelHub = parcelHubJSON.find(p => p.parcel_hub_id === employee.parcel_hub_id);
      if (parcelHub) {
        setParcelHubData(parcelHub);
        setIsLogin(true);
      } else {
        console.log("Parcel hub not found.");
        setIsLogin(false);
        localStorage.removeItem("employeeData");
        window.location.href = "/login";
      }
    } else if (customerBase64) {
      const customerString = atob(customerBase64);
      const customer = JSON.parse(customerString);
      setCustomerData(customer);
      setParcelHubData(null);
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
  if (!parcelData) {
    setParcelData(parcelJSON);
  }

  useEffect(() => {
    if (parcelData && parcelHubData) {
      setSpecificParcel(parcelData.find(p => p.tracking_number === trackingNumber) || null);
    }
  }, [parcelData, parcelHubData, trackingNumber]);

  useEffect(() => {
    if (specificParcel && parcelHubData) {
      // check if the pathway contains the current parcel hub
      setIsInsidePathway(
        specificParcel.pathway.find(ph => ph.parcel_hub_id === parcelHubData.parcel_hub_id) ? true : false,
      );
    }
  }, [specificParcel, parcelHubData]);

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
  }, [specificParcel, parcelHubData, isInsidePathway, employeeID]);

  // get specific employee data
  useEffect(() => {
    if (employeeID) {
      setSpecificEmployee(employeeJSON.find(e => e.employee_id === employeeID) || null);
    }
  }, [employeeID]);

  const placeDigitalSigature = async () => {
    console.log("Tracking Number", trackingNumber);
    console.log("Dispatched Time", dispatchedTime);
    console.log("Parcel Hub ID", parcelHubData?.parcel_hub_id);
    console.log("Employee ID", employeeID);

    // smart contract algorithm here
    // @shinyen17
    const hub_id: string = parcelHubData?.parcel_hub_id ?? "";

    const signature_hash = await handleHashSignature();
    if (!signature_hash) {
      alert("Signature hash is invalid!");
      return;
    }

    const verification_hash = await hashSendData(
      trackingNumber, // Tracking number
      dispatchedTime, // Dispatch time
      hub_id, // Hub ID
      signature_hash, // Employee
    );
    if (!verification_hash) {
      alert("Verification hash failed!");
      return;
    }

    const photo_url = "dummy_photo_url"; // Replace with actual photo URL

    // Find the specific parcel
    const parcelIndex = parcelJSON.findIndex(p => p.tracking_number === trackingNumber);
    if (parcelIndex !== -1) {
      const parcel = parcelJSON[parcelIndex];

      // Find the current parcel hub in the pathway
      const pathwayIndex = parcel.pathway.findIndex(ph => ph.parcel_hub_id === parcelHubData?.parcel_hub_id);
      if (pathwayIndex !== -1) {
        // Update the dispatch time, photo URL, employee signature hash, and verification hash
        parcel.pathway[pathwayIndex].dispatch_time = dispatchedTime;
        parcel.pathway[pathwayIndex].photo_url = photo_url;
        parcel.pathway[pathwayIndex].employee.employee_id = employeeID;
        parcel.pathway[pathwayIndex].employee.signature_hash = signature_hash;
        parcel.pathway[pathwayIndex].verification_hash = verification_hash;

        // Update the parcelJSON with the modified parcel
        parcelJSON[parcelIndex] = parcel;

        async function handleUpdate() {
          if (!parcelJSON) return;

          try {
            const response = await fetch("/api/parcel", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify(parcelJSON),
            });

            // if (!response.ok) throw new Error("Failed to update data");
          } catch (error) {
            console.error(error);
          }
        }

        await handleUpdate();

        console.log("Parcel updated successfully:", parcel);

        Swal.fire({
          icon: "success",
          title: "Parcel Dispatched Successfully",
          text: "Parcel has been dispatched successfully.",
          allowOutsideClick: false,
          timer: 3000,
          timerProgressBar: true,
          didOpen: () => {
            Swal.showLoading();
          },
        }).then(() => {
          window.location.href = "/dashboard";
        });
      } else {
        console.log("Current parcel hub not found in the pathway.");
      }
    } else {
      console.log("Parcel not found.");
    }
  };

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
                {isInsidePathway === true ? (
                  <>
                    Received on{" "}
                    <span className="italic">
                      {new Date(receivedTime).toLocaleString("en-SG", {
                        timeZone: "Asia/Singapore",
                      })}
                    </span>
                  </>
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

        {isInsidePathway && specificParcel && (
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
                  {currentParcelHub?.parcel_hub_name}
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
                  {nextParcelHub?.parcel_hub_name}
                </p>
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
                <p>Employee ID</p>
                <p
                  className="font-semibold link hover:text-secondary no-underline"
                  onClick={() =>
                    (document.getElementById("modal-employee-" + employeeID) as HTMLDialogElement)?.showModal()
                  }
                >
                  {employeeID}
                </p>
              </div>
            </div>
          </>
        )}
      </div>

      {/* Tracking Number Modal */}
      {specificParcel && (
        <dialog id={"modal-trackingNo-" + specificParcel.tracking_number} className="modal">
          <div className="modal-box">
            <h3 className="font-bold text-lg">{specificParcel.tracking_number}</h3>
            <p className="pb-2">Press ESC key or click the button below to close</p>
            {/* Parcel weight */}
            <div className="flex justify-between items-center">
              <p>Parcel weight</p>
              <p>{specificParcel.parcel_weight_kg} kg</p>
            </div>
            {/* Parcel dimension */}
            <div className="flex justify-between items-center">
              <p>Parcel dimension</p>
              <p>
                {specificParcel.parcel_dimensions_cm.length} cm x {specificParcel.parcel_dimensions_cm.width} cm x{" "}
                {specificParcel.parcel_dimensions_cm.height} cm
              </p>
            </div>
            {/* Parcel estimated delivery */}
            <div className="flex justify-between items-center">
              <p>Parcel estimated delivery</p>
              <p>{specificParcel.parcel_estimated_delivery}</p>
            </div>
            {/* Parcel type */}
            <div className="flex justify-between items-center">
              <p>Parcel type</p>
              <p>{specificParcel.parcel_type.charAt(0).toUpperCase() + specificParcel.parcel_type.slice(1)}</p>
            </div>
            {/* is fragile */}
            <div className="flex justify-between items-center">
              <p>Is fragile</p>
              <p>{specificParcel.is_fragile ? "Yes" : "No"}</p>
            </div>
            {/* extra comment */}
            <div className="flex justify-between items-center">
              <p>Extra comment</p>
              <p>{specificParcel.extra_comment}</p>
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

      {/* Sender Modal */}
      {specificParcel && (
        <dialog id={"modal-sender-" + specificParcel.tracking_number} className="modal">
          <div className="modal-box">
            <h3 className="font-bold text-lg">{specificParcel.sender.name}</h3>
            <p className="pb-2">Press ESC key or click the button below to close</p>
            {/* Sender phone number */}
            <div className="flex justify-between items-center">
              <p>Phone number</p>
              <p>{specificParcel.sender.phone_number}</p>
            </div>
            {/* Sender address */}
            <div className="flex justify-between items-center">
              <p>Email</p>
              <p>{specificParcel.sender.email}</p>
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

      {/* Recipient Modal */}
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

      {/* Employee Modal */}
      {employeeID && specificEmployee && (
        <dialog id={"modal-employee-" + employeeID} className="modal">
          <div className="modal-box">
            <h3 className="font-bold text-lg">{employeeID}</h3>
            <p className="pb-2">Press ESC key or click the button below to close</p>
            {/* Employee email */}
            <div className="flex justify-between items-center">
              <p>Email</p>
              <p>{specificEmployee.email}</p>
            </div>
            {/* Parcel Hub */}
            <div className="flex justify-between items-center">
              <p>Parcel Hub</p>
              <p>
                {parcelHubJSON.find(ph => ph.parcel_hub_id === specificEmployee.parcel_hub_id)?.parcel_hub_name} (
                {specificEmployee.parcel_hub_id})
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

      {isInsidePathway && (
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

export default ParcelDispatch;
