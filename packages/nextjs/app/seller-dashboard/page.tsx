"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { NextPage } from "next";
import Swal from "sweetalert2";
import parcelJSON from "~~/data/parcel.json";
import temporaryParcelJSON from "~~/data/temporaryParcel.json";
import { CustomerWithoutPasswordInterface, ParcelInterface } from "~~/interfaces/GeneralInterface";

const SellerDashboard: NextPage = () => {
  const [customerData, setCustomerData] = useState<CustomerWithoutPasswordInterface | null>(null);
  const [parcelData, setParcelData] = useState<ParcelInterface[] | null>(null);
  const [temporaryParcelData, setTemporaryParcelData] = useState<ParcelInterface[] | null>(null);

  const [isLogin, setIsLogin] = useState<null | boolean>(null);

  const [filteredParcelData, setFilteredParcelData] = useState<ParcelInterface[] | null>(null);
  const [filteredTemporaryParcelData, setFilteredTemporaryParcelData] = useState<ParcelInterface[] | null>(null);

  useEffect(() => {
    const employeeBase64 = localStorage.getItem("employeeData");
    const customerBase64 = localStorage.getItem("customerData");

    if (employeeBase64) {
      // redirect to employee dashboard
      window.location.href = "/parcel-dashboard";
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

  const formatDate = (isoString?: string): string => {
    if (!isoString) return "--/--"; // Handle undefined or null values

    return isoString.slice(0, 16).replace("T", " ");
  };

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
    if (!temporaryParcelData) {
      setTemporaryParcelData(temporaryParcelJSON);
    }
  }, [temporaryParcelData]);

  useEffect(() => {
    if (parcelData) {
      const filteredData = parcelData.filter(parcel => parcel.sender.email === customerData?.email);
      setFilteredParcelData(filteredData);
    }
  }, [parcelData, customerData]);

  useEffect(() => {
    if (temporaryParcelData) {
      const filteredData = temporaryParcelData.filter(parcel => parcel.sender.email === customerData?.email);
      setFilteredTemporaryParcelData(filteredData);
    }
  }, [temporaryParcelData, customerData]);

  const trackDelivery = (trackingNumber: string) => {
    Swal.fire({
      title: "Get ready to track parcel...",
      timer: 1000,
      timerProgressBar: true,
      didOpen: () => {
        Swal.showLoading();
      },
    }).then(() => {
      window.location.href = "track/" + trackingNumber;
    });
  };

  const verifyDelivery = (trackingNumber: string) => {
    Swal.fire({
      title: "Get ready to receive parcel...",
      timer: 1000,
      timerProgressBar: true,
      didOpen: () => {
        Swal.showLoading();
      },
    }).then(() => {
      window.location.href = "seller-verify-delivery/" + trackingNumber;
    });
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      <h1 className="text-4xl font-bold mt-8">Seller Dashboard</h1>
      <p>View your sold parcel status here.</p>

      {/* Customer details */}
      <div className="flex flex-row w-[40%] gap-4 mb-6">
        {customerData ? (
          <ul className="list bg-base-100 rounded-box w-full shadow-md">
            <li className="p-4 pb-0 text-md tracking-wide border-b-2 border-gray-400">
              <p>{customerData.name}</p>
            </li>
            <div className="card bg-base-100 w-full shadow-sm opacity-65 p-4">
              <div className="flex flex-row justify-between items-center">
                <p className="font-semibold">Email</p>
                <p>{customerData.email}</p>
              </div>
            </div>
          </ul>
        ) : (
          <div className="flex flex-row justify-between w-full items-center">
            <p className="text-center w-full">Loading ...</p>
          </div>
        )}
      </div>

      {/* Create parcel list */}
      <div className="flex flex-row w-[40%] gap-4 mb-6">
        <ul className="list bg-base-100 rounded-box w-full shadow-md">
          <li className="p-4 pb-2 text-xs opacity-60 tracking-wide">Create Parcel</li>

          {filteredTemporaryParcelData ? (
            filteredTemporaryParcelData.map(parcel => (
              <li className="list-row" key={parcel.tracking_number}>
                <div>
                  <Image width={40} height={40} className="rounded-box" src="/lancy-parcel.png" alt="" />
                </div>
                <div>
                  <div
                    className="link hover:text-secondary"
                    onClick={() =>
                      (
                        document.getElementById("modal-trackingNo-" + parcel.tracking_number) as HTMLDialogElement
                      )?.showModal()
                    }
                  >
                    {parcel.tracking_number}
                  </div>
                  <div className="text-xs flex flex-row items-center gap-4">
                    <div className="text-xs font-semibold opacity-60">
                      Expected Delivery Time: {formatDate(parcel.parcel_estimated_delivery)}
                    </div>
                    <div
                      id={`status-${parcel.tracking_number}`}
                      className={`badge badge-outline badge-sm ${
                        parcel.pathway[0]?.employee.signature_hash ? "badge-primary" : "badge-warning"
                      }`}
                    >
                      {parcel.pathway[0]?.employee.signature_hash ? "Pending" : "Unverified"}
                    </div>
                  </div>
                </div>

                {/* Tracking Number Modal */}
                <dialog id={"modal-trackingNo-" + parcel.tracking_number} className="modal">
                  <div className="modal-box">
                    <h3 className="font-bold text-lg">{parcel.tracking_number}</h3>
                    <p className="pb-2">Press ESC key or click the button below to close</p>
                    {/* Parcel weight */}
                    <div className="flex justify-between items-center">
                      <p>Parcel weight</p>
                      <p>{parcel.parcel_weight_kg} kg</p>
                    </div>
                    {/* Parcel dimension */}
                    <div className="flex justify-between items-center">
                      <p>Parcel dimension</p>
                      <p>
                        {parcel.parcel_dimensions_cm.length} cm x {parcel.parcel_dimensions_cm.width} cm x{" "}
                        {parcel.parcel_dimensions_cm.height} cm
                      </p>
                    </div>
                    {/* Parcel estimated delivery */}
                    <div className="flex justify-between items-center">
                      <p>Parcel estimated delivery</p>
                      <p>{parcel.parcel_estimated_delivery}</p>
                    </div>
                    {/* Parcel type */}
                    <div className="flex justify-between items-center">
                      <p>Parcel type</p>
                      <p>{parcel.parcel_type.charAt(0).toUpperCase() + parcel.parcel_type.slice(1)}</p>
                    </div>
                    {/* is fragile */}
                    <div className="flex justify-between items-center">
                      <p>Is fragile?</p>
                      <p>{parcel.is_fragile ? "Yes" : "No"}</p>
                    </div>
                    {/* extra comment */}
                    <div className="flex justify-between items-center">
                      <p>Extra comment</p>
                      <p>{parcel.extra_comment}</p>
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
                {/* Verify Delivery button */}
                <button className="btn btn-square btn-ghost" onClick={() => verifyDelivery(parcel.tracking_number)}>
                  <div className="tooltip" data-tip="Verify delivery">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke-width="1.5"
                      stroke="currentColor"
                      className="size-6"
                    >
                      <path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        d="M9 12.75 11.25 15 15 9.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"
                      />
                    </svg>
                  </div>
                </button>
              </li>
            ))
          ) : (
            <div className="flex flex-row justify-between w-full items-center">
              <p className="text-center w-full">Loading ...</p>
            </div>
          )}
        </ul>
      </div>

      {/* Sold history list */}
      <div className="flex flex-row w-[40%] gap-4">
        <ul className="list bg-base-100 rounded-box w-full shadow-md">
          <li className="p-4 pb-2 text-xs opacity-60 tracking-wide">Sold History</li>

          {filteredParcelData ? (
            filteredParcelData.map(parcel => (
              <li className="list-row" key={parcel.tracking_number}>
                <div>
                  <Image width={40} height={40} className="rounded-box" src="/lancy-parcel.png" alt="" />
                </div>
                <div>
                  <div
                    className="link hover:text-secondary"
                    onClick={() =>
                      (
                        document.getElementById("modal-trackingNo-" + parcel.tracking_number) as HTMLDialogElement
                      )?.showModal()
                    }
                  >
                    {parcel.tracking_number}
                  </div>
                  <div className="text-xs flex flex-row items-center gap-4">
                    <div className="text-xs font-semibold opacity-60">
                      Expected Delivery Time: {formatDate(parcel.parcel_estimated_delivery)}
                    </div>
                    <div
                      id={`status-${parcel.tracking_number}`}
                      className={`badge badge-outline badge-sm ${
                        parcel.current_location === "received"
                          ? "badge-success" // Received
                          : "badge-primary" // Sending
                      }`}
                    >
                      {parcel.current_location === "received" ? "Received" : "Sending"}
                    </div>
                  </div>
                </div>

                {/* Tracking Number Modal */}
                <dialog id={"modal-trackingNo-" + parcel.tracking_number} className="modal">
                  <div className="modal-box">
                    <h3 className="font-bold text-lg">{parcel.tracking_number}</h3>
                    <p className="pb-2">Press ESC key or click the button below to close</p>
                    {/* Parcel weight */}
                    <div className="flex justify-between items-center">
                      <p>Parcel weight</p>
                      <p>{parcel.parcel_weight_kg} kg</p>
                    </div>
                    {/* Parcel dimension */}
                    <div className="flex justify-between items-center">
                      <p>Parcel dimension</p>
                      <p>
                        {parcel.parcel_dimensions_cm.length} cm x {parcel.parcel_dimensions_cm.width} cm x{" "}
                        {parcel.parcel_dimensions_cm.height} cm
                      </p>
                    </div>
                    {/* Parcel estimated delivery */}
                    <div className="flex justify-between items-center">
                      <p>Parcel estimated delivery</p>
                      <p>{parcel.parcel_estimated_delivery}</p>
                    </div>
                    {/* Parcel type */}
                    <div className="flex justify-between items-center">
                      <p>Parcel type</p>
                      <p>{parcel.parcel_type.charAt(0).toUpperCase() + parcel.parcel_type.slice(1)}</p>
                    </div>
                    {/* is fragile */}
                    <div className="flex justify-between items-center">
                      <p>Is fragile?</p>
                      <p>{parcel.is_fragile ? "Yes" : "No"}</p>
                    </div>
                    {/* extra comment */}
                    <div className="flex justify-between items-center">
                      <p>Extra comment</p>
                      <p>{parcel.extra_comment}</p>
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
                {/* Track delivery button */}
                <button className="btn btn-square btn-ghost" onClick={() => trackDelivery(parcel.tracking_number)}>
                  <div className="tooltip" data-tip="Track delivery">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      strokeWidth="1.5"
                      stroke="currentColor"
                      className="size-6"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1 1 15 0Z"
                      />
                    </svg>
                  </div>
                </button>
              </li>
            ))
          ) : (
            <div className="flex flex-row justify-between w-full items-center">
              <p className="text-center w-full">Loading ...</p>
            </div>
          )}
        </ul>
      </div>
    </div>
  );
};

export default SellerDashboard;
