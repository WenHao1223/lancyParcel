"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { useParams } from "next/navigation";
import { countries } from "countries-list";
import { NextPage } from "next";
import Swal from "sweetalert2";
import localAreaJSON from "~~/data/localArea.json";
import parcelJSON from "~~/data/parcel.json";
import parcelHubJSON from "~~/data/parcelHub.json";
import postcodeJSON from "~~/data/postcode.json";
import {
  CustomerWithoutPasswordInterface,
  EmployeeWithoutPasswordInterface,
  ParcelHubInterface,
  ParcelInterface,
} from "~~/interfaces/GeneralInterface";

const Track: NextPage = () => {
  const params = useParams();
  const [trackingNumber, setTrackingNumber] = useState("");
  useEffect(() => {
    if (!params) return;
    setTrackingNumber(Array.isArray(params.id) ? params.id[0] : params.id);
  }, [params]);

  const [employeeData, setEmployeeData] = useState<EmployeeWithoutPasswordInterface | null>(null);
  const [customerData, setCustomerData] = useState<null | CustomerWithoutPasswordInterface>(null);
  const [parcelHubData, setParcelHubData] = useState<ParcelHubInterface | null>(null);
  const [parcelData, setParcelData] = useState<ParcelInterface[] | null>(null);
  const [isLogin, setIsLogin] = useState<null | boolean>(null);

  const [specificParcel, setSpecificParcel] = useState<ParcelInterface | null>(null);

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
    if (parcelData) {
      setSpecificParcel(parcelData.find(p => p.tracking_number === trackingNumber) || null);
    }
  }, [parcelData, trackingNumber]);

  const formatDate = (isoString?: string): string => {
    if (!isoString) return "--/--"; // Handle undefined or null values

    return isoString.slice(0, 16).replace("T", " ");
  };

  const formatDateShort = (isoString?: string): string => {
    if (!isoString) return "--/--"; // Handle undefined or null values

    const date = new Date(isoString);
    return date.toLocaleDateString("en-GB", { day: "2-digit", month: "short" });
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      <h1 className="text-4xl font-bold">Tracking Page</h1>
      <p>Track your order here.</p>

      {/* Ordered Item detail */}
      <div className="flex flex-row w-[40%] gap-4 mb-4">
        <ul className="list bg-base-100 rounded-box w-full shadow-md">
          <li className="p-4 pb-2 text-xs opacity-60 tracking-wide">Ordered Item</li>

          <li className="list-row">
            <div>
              <Image width={40} height={40} className="rounded-box" src="/lancy-parcel.png" alt="" />
            </div>
            <div>
              <div>{specificParcel?.tracking_number}</div>
              <div className="text-xs font-semibold opacity-60">
                Expected Delivery Time: {formatDate(specificParcel?.parcel_estimated_delivery)}
              </div>
            </div>
            <button className="btn btn-square btn-ghost">
              <div className="tooltip" data-tip="Check product details">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth="1.5"
                  stroke="currentColor"
                  className="size-6"
                  onClick={() =>
                    (
                      document.getElementById(
                        "modal-trackingNo-" + specificParcel?.tracking_number,
                      ) as HTMLDialogElement
                    )?.showModal()
                  }
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z"
                  />
                </svg>
              </div>
            </button>
          </li>
        </ul>
      </div>

      {/* Tracking graph */}
      <div className="flex flex-row w-[40%] min-w-96 gap-4">
        <ul className="list bg-base-100 rounded-box w-full shadow-md gap-1 pb-4">
          <li className="p-4 pb-2 text-xs opacity-60 tracking-wide flex justify-between border-b-2 border-b-white/60 mb-4">
            <p>Tracking Number</p>
            <p>{specificParcel?.tracking_number}</p>
          </li>

          <div className="flex flex-col gap-4">
            {specificParcel?.pathway?.map((item, index) => (
              <div key={index} className="grid grid-cols-[48px_1fr] gap-4">
                {/* Dot */}
                <div className="relative flex">
                  <div className="absolute z-10 left-[137px] -ml-[5px] w-[10px] h-[10px] rounded-full bg-white"></div>
                </div>

                {/* Graph item */}
                <div className="flex flex-col w-100">
                  <div className="flex flex-row">
                    <div className="border-dashed border-r-2 pr-6 flex">
                      <div>
                        <div className="flex flex-col gap-1 items-end justify-start h-full">
                          <p className="mb-0 w-12">{formatDateShort(item.received_time)}</p>
                          <p className="mt-0  w-12">{formatDate(item.received_time).split(" ")[1]}</p>
                        </div>
                      </div>
                    </div>
                    <div className="pl-8 flex justify-center">
                      <div>
                        <div className="flex flex-col gap-1 items-start justify-start h-full">
                          <p className="mb-0">
                            Parcel has{" "}
                            <span
                              className={
                                item.parcel_hub_id === specificParcel?.current_location
                                  ? "text-green-300 font-semibold"
                                  : "text-orange-300 font-semibold"
                              }
                            >
                              {item.parcel_hub_id === specificParcel?.current_location ? "arrived at" : "departed to"}
                            </span>{" "}
                            hub {parcelHubJSON.find(hub => hub.parcel_hub_id === item.parcel_hub_id)?.parcel_hub_name}.
                          </p>

                          <p
                            className="mt-0 link text-secondary"
                            onClick={() =>
                              (
                                document.getElementById(
                                  `modal-checkSignature-${specificParcel?.tracking_number}-${item.parcel_hub_id}`,
                                ) as HTMLDialogElement
                              )?.showModal()
                            }
                          >
                            Check Digital Signature
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </ul>
      </div>

      <dialog id={"modal-trackingNo-" + specificParcel?.tracking_number} className="modal">
        <div className="modal-box">
          <h3 className="font-bold text-lg">{specificParcel?.tracking_number}</h3>
          <p className="pb-2">Press ESC key or click the button below to close</p>
          {/* Parcel weight */}
          <div className="flex justify-between items-center">
            <p>Parcel weight</p>
            <p>{specificParcel?.parcel_weight_kg} kg</p>
          </div>
          {/* Parcel dimension */}
          <div className="flex justify-between items-center">
            <p>Parcel dimension</p>
            <p>
              {specificParcel?.parcel_dimensions_cm.length} cm x {specificParcel?.parcel_dimensions_cm.width} cm x{" "}
              {specificParcel?.parcel_dimensions_cm.height} cm
            </p>
          </div>
          {/* Parcel estimated delivery */}
          <div className="flex justify-between items-center">
            <p>Parcel estimated delivery</p>
            <p>{specificParcel?.parcel_estimated_delivery}</p>
          </div>
          {/* Parcel type */}
          <div className="flex justify-between items-center">
            <p>Parcel type</p>
            <p>
              {specificParcel?.parcel_type
                ? specificParcel.parcel_type.charAt(0).toUpperCase() + specificParcel.parcel_type.slice(1)
                : "N/A"}
            </p>
          </div>
          {/* is fragile */}
          <div className="flex justify-between items-center">
            <p>Is fragile</p>
            <p>{specificParcel?.is_fragile ? "Yes" : "No"}</p>
          </div>
          {/* extra comment */}
          <div className="flex justify-between items-center">
            <p>Extra comment</p>
            <p>{specificParcel?.extra_comment}</p>
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

      {specificParcel?.pathway?.map((pathwayItem, index) => (
        <dialog
          key={index}
          id={`modal-checkSignature-${specificParcel.tracking_number}-${pathwayItem.parcel_hub_id}`}
          className="modal"
        >
          <div className="modal-box">
            <h3 className="font-bold text-lg">
              {specificParcel.tracking_number} -{" "}
              {parcelHubJSON.find(hub => hub.parcel_hub_id === pathwayItem.parcel_hub_id)?.parcel_hub_name}
            </h3>
            <p className="pb-2">Press ESC key or click the button below to close</p>
            {/* Employee ID */}
            <div className="flex justify-between items-center">
              <p>Employee ID</p>
              <p>{pathwayItem.employee.employee_id}</p>
            </div>
            {/* Employee Digital Signature Hash */}
            <div className="flex justify-between items-center">
              <p>Employee Digital Signature Hash</p>
              <p>
                {pathwayItem.employee.signature_hash?.substring(0, 6)}...
                {pathwayItem.employee.signature_hash?.substring(pathwayItem.employee.signature_hash.length - 4)}
              </p>
            </div>
            {/* Verification Hash */}
            <div className="flex justify-between items-center">
              <p>Verification Hash</p>
              <p>
                {pathwayItem.verification_hash?.substring(0, 6)}...
                {pathwayItem.verification_hash?.substring(pathwayItem.verification_hash.length - 4)}
              </p>
            </div>
            {/* Close button */}
            <div className="modal-action">
              <form method="dialog">
                <button className="btn">Close</button>
              </form>
            </div>
          </div>
        </dialog>
      ))}

      <div className="flex flex-row w-[40%] min-w-96 gap-4 justify-center mt-4">
        <button className="btn btn-error btn-disabled w-1/2">Cancel</button>
        <button className="btn btn-primary w-1/2">Confirm Delivery</button>
      </div>
    </div>
  );
};

export default Track;
