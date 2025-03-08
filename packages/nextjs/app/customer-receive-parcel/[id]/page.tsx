"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { useParams } from "next/navigation";
import { NextPage } from "next";
import Swal from "sweetalert2";
import { useAccount } from "wagmi";
import parcelJSON from "~~/data/parcel.json";
import parcelHubJSON from "~~/data/parcelHub.json";
import { useScaffoldWriteContract } from "~~/hooks/scaffold-eth";
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

const useHashSignature = (connectedAddress: string | undefined) => {
  const { writeContractAsync } = useScaffoldWriteContract({
    contractName: "YourContract",
  });

  const handleHashSignature = async () => {
    if (!connectedAddress) {
      Swal.fire({
        icon: "error",
        title: "Please connect MetaMask first!",
        text: "Please try again.",
        allowOutsideClick: false,
        timer: 3000,
        timerProgressBar: true,
        didOpen: () => {
          Swal.showLoading();
        },
      });
      return null;
    }

    try {
      const tx = await writeContractAsync({
        functionName: "hashAddress",
        args: [connectedAddress],
      });

      if (tx) {
        Swal.fire({
          icon: "success",
          title: "Transaction successful!",
          text: "Transaction has been sent successfully. Signature Hash: " + tx,
          allowOutsideClick: false,
          timer: 3000,
          timerProgressBar: true,
          didOpen: () => {
            Swal.showLoading();
          },
        });
        return tx as string;
      }
    } catch (error) {
      console.error("Error hashing address:", error);
      Swal.fire({
        icon: "error",
        title: "Transaction failed!",
        text: "Please try again.",
        allowOutsideClick: false,
        timer: 3000,
        timerProgressBar: true,
        didOpen: () => {
          Swal.showLoading();
        },
      });
      return "";
    }
  };

  return { handleHashSignature };
};

const useHashSend = () => {
  const { writeContractAsync } = useScaffoldWriteContract({
    contractName: "YourContract",
  });

  const hashSendData = async (trackingNumber: string, dispatchTime: string, localHubId: string, customer: string) => {
    try {
      const tx = await writeContractAsync({
        functionName: "hashSendData",
        args: [trackingNumber, dispatchTime, localHubId, customer],
      });

      if (tx) {
        Swal.fire({
          icon: "success",
          title: "Transaction successful!",
          text: "Transaction has been sent successfully. Verification Hash: " + tx,
          allowOutsideClick: false,
          timer: 3000,
          timerProgressBar: true,
          didOpen: () => {
            Swal.showLoading();
          },
        });
        return tx as string; // Returning hash
      }
    } catch (error) {
      console.error("Error hashing parcel data:", error);
      Swal.fire({
        icon: "error",
        title: "Transaction failed!",
        text: "Please try again.",
        allowOutsideClick: false,
        timer: 3000,
        timerProgressBar: true,
        didOpen: () => {
          Swal.showLoading();
        },
      });
      return null;
    }
  };

  return { hashSendData };
};

const ParcelReceiveCustomer: NextPage = () => {
  const params = useParams();
  const { address: connectedAddress } = useAccount();
  const { handleHashSignature } = useHashSignature(connectedAddress);
  const { hashSendData } = useHashSend();

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

  const cancelDigitalSignature = () => {
    Swal.fire({
      icon: "warning",
      title: "Cancel Digital Signature!",
      text: "Action has been cancelled.",
      allowOutsideClick: false,
      timer: 1500,
      timerProgressBar: true,
      didOpen: () => {
        Swal.showLoading();
      },
    }).then(() => {
      window.location.href = "/parcel-dashboard";
    });
  };

  const placeDigitalSigature = async () => {
    console.log("Tracking Number", trackingNumber);
    console.log("Received Time", receivedTime);
    console.log("Customer ID", customerData?.email);

    // smart contract algorithm here
    const cus_id: string = customerData?.email ?? "";

    const signature_hash = await handleHashSignature();
    if (!signature_hash) {
      Swal.fire({
        icon: "error",
        title: "Signature hash is invalid!",
        text: "Please try again.",
        allowOutsideClick: false,
        timer: 3000,
        timerProgressBar: true,
        didOpen: () => {
          Swal.showLoading();
        },
      });
      return;
    }

    const verification_hash = await hashSendData(
      trackingNumber, // Tracking number
      receivedTime, // Received time
      cus_id, // Customer ID
      signature_hash, // Customer
    );
    if (!verification_hash) {
      Swal.fire({
        icon: "error",
        title: "Verification hash is invalid!",
        text: "Please try again.",
        allowOutsideClick: false,
        timer: 3000,
        timerProgressBar: true,
        didOpen: () => {
          Swal.showLoading();
        },
      });
      return;
    }

    const photo_url = "dummy_photo_url"; // Replace with actual photo URL

    // Find the specific parcel
    const parcelIndex = parcelJSON.findIndex(p => p.tracking_number === trackingNumber);
    if (parcelIndex !== -1) {
      const parcel = parcelJSON[parcelIndex];

      // Find the current parcel hub in the pathway
      const pathwayIndex = parcel.pathway.length - 1;
      if (pathwayIndex !== -1) {
        // Update the dispatch time, photo URL, employee signature hash, and verification hash
        parcel.pathway[pathwayIndex].dispatch_time = dispatchedTime;

        parcel.final_delivery.received_time = receivedTime;
        parcel.final_delivery.photo_url = photo_url;
        parcel.final_delivery.customer_signature_hash = signature_hash;
        parcel.final_delivery.verification_hash = verification_hash;

        parcel.current_location = "received";

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
          window.location.href = "/parcel-dashboard";
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
      <h1 className="text-4xl font-bold mt-8">Recipent Receive Parcel Verification</h1>
      <p>Verify your parcel here.</p>

      {/* Ordered Item detail */}
      <div className="flex flex-col w-[40%] min-w-96 gap-4 mb-4">
        <ul className="list bg-base-100 rounded-box w-full shadow-md">
          <li className="p-4 pb-2 text-xs opacity-60 tracking-wide">Parcel</li>

          <li className="list-row">
            <div>
              <Image width={40} height={40} className="rounded-box" src="/lancy-parcel.png" alt="" />
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
          <button className="btn btn-secondary btn-outline w-1/2" onClick={cancelDigitalSignature}>
            Cancel
          </button>
          <button className="btn btn-primary w-1/2" onClick={placeDigitalSigature}>
            Place Digital Signature
          </button>
        </div>
      )}
    </div>
  );
};

export default ParcelReceiveCustomer;
