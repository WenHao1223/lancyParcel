"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { useParams } from "next/navigation";
import { NextPage } from "next";
import Swal from "sweetalert2";
//solidity
import { useAccount } from "wagmi";
import employeeJSON from "~~/data/employee.json";
import parcelJSON from "~~/data/parcel.json";
import parcelHubJSON from "~~/data/parcelHub.json";
import temporaryParcelJSON from "~~/data/temporaryParcel.json";
import { useScaffoldWriteContract } from "~~/hooks/scaffold-eth";
import { CustomerWithoutPasswordInterface, ParcelHubInterface, ParcelInterface } from "~~/interfaces/GeneralInterface";

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
        return tx; // Returning hash
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

  return { hashReceiveData };
};

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
  const params = useParams();
  const { address: connectedAddress } = useAccount();
  const { handleHashSignature } = useHashSignature(connectedAddress);
  const { hashReceiveData } = useHashReceive();

  useEffect(() => {
    if (!params) return;
    setTrackingNumber(Array.isArray(params.id) ? params.id[0] : params.id);
  }, [params]);

  const [customerData, setCustomerData] = useState<CustomerWithoutPasswordInterface | null>(null);
  const [parcelData, setParcelData] = useState<ParcelInterface[] | null>(null);
  const [temporaryParcelData, setTemporaryParcelData] = useState<ParcelInterface[] | null>(null);
  const [isLogin, setIsLogin] = useState<null | boolean>(null);

  const [trackingNumber, setTrackingNumber] = useState("");
  useEffect(() => {
    if (!params) return;
    setTrackingNumber(Array.isArray(params.id) ? params.id[0] : params.id);
  }, [params]);

  const [specificParcel, setSpecificParcel] = useState<ParcelInterface | null>(null);
  const [isSender, setIsSender] = useState<boolean | null>(null);

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
  }, [parcelJSON]);

  // store temporaryParcelJSON data into temporaryParcelData
  useEffect(() => {
    if (!temporaryParcelData) {
      setTemporaryParcelData(temporaryParcelJSON);
    }
  }, [temporaryParcelJSON]);

  useEffect(() => {
    if (temporaryParcelData) {
      setSpecificParcel(temporaryParcelData.find(p => p.tracking_number === trackingNumber) || null);
    }
  }, [temporaryParcelData, trackingNumber]);

  useEffect(() => {
    if (specificParcel) {
      // check if this is the sender
      setIsSender(specificParcel?.sender?.email === customerData?.email ? true : false);
    }
  }, [specificParcel]);

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
    console.log("Received Time", specificParcel?.pathway[0]?.received_time);
    console.log("Parcel Hub ID", specificParcel?.pathway[0]?.parcel_hub_id);
    console.log("Employee ID", specificParcel?.pathway[0]?.employee.employee_id);

    // smart contract algorithm here
    // @shinyen17
    const hub_id: string = specificParcel?.pathway[0]?.parcel_hub_id ?? "";

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
    const verification_hash = await hashReceiveData(
      trackingNumber, // Tracking number
      specificParcel?.pathway[0]?.received_time ?? "", // Received time
      specificParcel?.pathway[0]?.parcel_hub_id ?? "", // Hub ID
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

    // Find the specific parcel in temporaryParcelJSON
    const tempParcelIndex = temporaryParcelJSON.findIndex(p => p.tracking_number === trackingNumber);
    if (tempParcelIndex !== -1) {
      const parcel = temporaryParcelJSON[tempParcelIndex];

      // Find the current parcel hub in the pathway
      const pathwayIndex = parcel.pathway.findIndex(
        ph => ph.parcel_hub_id === specificParcel?.pathway[0]?.parcel_hub_id,
      );
      if (pathwayIndex !== -1) {
        // Update the sender signature hash, and verification hash
        parcel.pathway[pathwayIndex].sender.signature_hash = signature_hash;
        parcel.pathway[pathwayIndex].verification_hash = verification_hash;

        parcel.current_location = specificParcel?.pathway[0]?.parcel_hub_id || "";

        // Remove the parcel from temporaryParcelJSON
        temporaryParcelJSON.splice(tempParcelIndex, 1);

        // Add the updated parcel to ParcelJSON
        const updatedParcelJSON = [...parcelJSON, parcel];

        async function handleUpdate(api: string, data: any) {
          try {
            const response = await fetch(api, {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify(data),
            });

            if (!response.ok) throw new Error("Failed to update data");
          } catch (error) {
            console.error(error);
          }
        }

        await handleUpdate("/api/temporaryParcel", temporaryParcelJSON); // Update temporaryParcelJSON
        await handleUpdate("/api/parcel", updatedParcelJSON); // Update ParcelJSON

        console.log("Parcel moved successfully:", parcel);

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
      <h1 className="text-4xl font-bold mt-8">Seller&apos;s Delivery Verification</h1>
      <p>Verify your parcel ready for delivery.</p>

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
                {isSender === true ? (
                  <>
                    Dispatched on{" "}
                    <span className="italic">
                      {new Date(parcelData?.[0]?.pathway[0]?.received_time || "").toLocaleString("en-SG", {
                        timeZone: "Asia/Singapore",
                      })}
                    </span>
                  </>
                ) : isSender === false ? (
                  <>Record not found.</>
                ) : (
                  <>Loading...</>
                )}
              </div>
            </div>
            {isSender && (
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

        {isSender && specificParcel && (
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
                  <i>(Sender: {parcelData?.[0].sender.name})</i>
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
                  {
                    parcelHubJSON.find(ph => ph.parcel_hub_id === specificParcel.pathway[0]?.parcel_hub_id)
                      ?.parcel_hub_name
                  }
                </p>
              </div>
              <div className="flex flex-row justify-between items-center">
                <p className="font-semibold">Received Time</p>
                <p>
                  {new Date(specificParcel.pathway[0]?.received_time ?? "").toLocaleString("en-SG", {
                    timeZone: "Asia/Singapore",
                  })}
                </p>
              </div>
              <div className="flex flex-row justify-between items-center">
                <p>Employee ID</p>
                <p
                  className="font-semibold link hover:text-secondary no-underline"
                  onClick={() =>
                    (
                      document.getElementById(
                        "modal-employee-" + specificParcel.pathway[0]?.employee.employee_id,
                      ) as HTMLDialogElement
                    )?.showModal()
                  }
                >
                  {specificParcel.pathway[0]?.employee.employee_id}
                </p>
              </div>
              <div className="flex flex-row justify-between items-center">
                <p>Employee Signature Hash</p>
                <p className="font-semibold">
                  {specificParcel.pathway[0]?.employee.signature_hash?.substring(0, 6)}...
                  {specificParcel.pathway[0]?.employee.signature_hash?.substring(
                    specificParcel.pathway[0]?.employee.signature_hash.length - 4,
                  )}
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
              <p>Is fragile?</p>
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
            <h3 className="font-bold text-lg">
              {
                parcelHubJSON.find(
                  ph =>
                    ph.parcel_hub_id ===
                    specificParcel.pathway[
                      specificParcel.pathway.findIndex(
                        ph => ph.parcel_hub_id === specificParcel.pathway[0]?.parcel_hub_id,
                      )
                    ]?.parcel_hub_id,
                )?.parcel_hub_name
              }
            </h3>
            <p className="pb-2">Press ESC key or click the button below to close</p>
            {/* Parcel Hub ID */}
            <div className="flex justify-between items-center">
              <p>Parcel Hub ID</p>
              <p>
                {
                  specificParcel.pathway[
                    specificParcel.pathway.findIndex(
                      ph => ph.parcel_hub_id === specificParcel.pathway[0]?.parcel_hub_id,
                    )
                  ]?.parcel_hub_id
                }
              </p>
            </div>
            {/* Parcel Hub Location */}
            <div className="flex justify-between items-center">
              <p>Parcel Hub Location</p>
              <p>
                {parcelHubJSON.find(
                  ph =>
                    ph.parcel_hub_id ===
                    specificParcel.pathway[
                      specificParcel.pathway.findIndex(
                        ph => ph.parcel_hub_id === specificParcel.pathway[0]?.parcel_hub_id,
                      )
                    ]?.parcel_hub_id,
                )?.parcel_hub_address +
                  ", " +
                  parcelHubJSON.find(
                    ph =>
                      ph.parcel_hub_id ===
                      specificParcel.pathway[
                        specificParcel.pathway.findIndex(
                          ph => ph.parcel_hub_id === specificParcel.pathway[0]?.parcel_hub_id,
                        )
                      ]?.parcel_hub_id,
                  )?.state +
                  ", " +
                  parcelHubJSON.find(
                    ph =>
                      ph.parcel_hub_id ===
                      specificParcel.pathway[
                        specificParcel.pathway.findIndex(
                          ph => ph.parcel_hub_id === specificParcel.pathway[0]?.parcel_hub_id,
                        )
                      ]?.parcel_hub_id,
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
                      .find(ph => ph.parcel_hub_id === specificParcel.pathway[0]?.parcel_hub_id)
                      ?.parcel_hub_operating_level.toLowerCase() === "international"
                      ? "badge-success"
                      : parcelHubJSON
                            .find(ph => ph.parcel_hub_id === specificParcel.pathway[0]?.parcel_hub_id)
                            ?.parcel_hub_operating_level.toLowerCase() === "national"
                        ? "badge-info"
                        : parcelHubJSON
                              .find(ph => ph.parcel_hub_id === specificParcel.pathway[0]?.parcel_hub_id)
                              ?.parcel_hub_operating_level.toLowerCase() === "regional"
                          ? "badge-warning"
                          : "badge-error"
                  }`}
                >
                  {(parcelHubJSON
                    .find(ph => ph.parcel_hub_id === specificParcel.pathway[0]?.parcel_hub_id)
                    ?.parcel_hub_operating_level.charAt(0)
                    .toUpperCase() || "") +
                    (parcelHubJSON
                      .find(ph => ph.parcel_hub_id === specificParcel.pathway[0]?.parcel_hub_id)
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

      {/* Employee Modal */}
      {specificParcel && (
        <dialog id={"modal-employee-" + specificParcel.pathway[0].employee.employee_id} className="modal">
          <div className="modal-box">
            <h3 className="font-bold text-lg">{specificParcel.pathway[0].employee.employee_id}</h3>
            <p className="pb-2">Press ESC key or click the button below to close</p>
            {/* Employee email */}
            <div className="flex justify-between items-center">
              <p>Email</p>
              <p>
                {employeeJSON.find(emp => emp.employee_id === specificParcel.pathway[0].employee.employee_id)?.email}
              </p>
            </div>
            {/* Parcel Hub */}
            <div className="flex justify-between items-center">
              <p>Parcel Hub</p>
              <p>
                {
                  parcelHubJSON.find(
                    ph =>
                      ph.parcel_hub_id ===
                      employeeJSON.find(emp => emp.employee_id === specificParcel.pathway[0].employee.employee_id)
                        ?.parcel_hub_id,
                  )?.parcel_hub_name
                }{" "}
                (
                {
                  employeeJSON.find(emp => emp.employee_id === specificParcel.pathway[0].employee.employee_id)
                    ?.parcel_hub_id
                }
                )
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

      {isSender && (
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

export default ParcelSellerVerify;
