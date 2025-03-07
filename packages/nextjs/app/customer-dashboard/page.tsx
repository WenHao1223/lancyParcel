"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { NextPage } from "next";
import Swal from "sweetalert2";
import parcelJSON from "~~/data/parcel.json";
import { CustomerWithoutPasswordInterface, ParcelHubInterface, ParcelInterface } from "~~/interfaces/GeneralInterface";

const OrderHistory: NextPage = () => {
  const [customerData, setCustomerData] = useState<CustomerWithoutPasswordInterface | null>(null);
  const [parcelHubData, setParcelHubData] = useState<ParcelHubInterface | null>(null);
  const [parcelData, setParcelData] = useState<ParcelInterface[] | null>(null);

  const [isLogin, setIsLogin] = useState<null | boolean>(null);

  const [filteredParcelData, setFilteredParcelData] = useState<ParcelInterface[] | null>(null);

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
      const filteredData = parcelData.filter(parcel => parcel.recipient.email === customerData?.email);
      setFilteredParcelData(filteredData);
    }
  }, [parcelData, customerData]);

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

  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      <h1 className="text-4xl font-bold">Customer Dashboard Page</h1>
      <p>View your parcel status here.</p>

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

      {/* Order history list */}
      <div className="flex flex-row w-[40%] gap-4">
        <ul className="list bg-base-100 rounded-box w-full shadow-md">
          <li className="p-4 pb-2 text-xs opacity-60 tracking-wide">Order History</li>

          <li className="list-row">
            <div>
              <Image
                width={40}
                height={40}
                className="rounded-box"
                src="https://img.daisyui.com/images/profile/demo/1@94.webp"
                alt="Product"
              />
            </div>
            <div>
              <div>Dio Lupa</div>
              <div className="text-xs uppercase font-semibold opacity-60">2025-03-02 17:00:00</div>
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
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z"
                  />
                </svg>
              </div>
            </button>
            <button className="btn btn-square btn-ghost">
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
        </ul>
      </div>
    </div>
  );
};

export default OrderHistory;
