"use client";

import { useEffect, useState } from "react";
import { countries } from "countries-list";
import { NextPage } from "next";
import Swal from "sweetalert2";
import localAreaJSON from "~~/data/localArea.json";
import parcelJSON from "~~/data/parcel.json";
import parcelHubJSON from "~~/data/parcelHub.json";
import postcodeJSON from "~~/data/postcode.json";
import { EmployeeWithoutPasswordInterface, ParcelHubInterface, ParcelInterface } from "~~/interfaces/GeneralInterface";
import { generatePath } from "~~/utils/generatePath";

const Dashboard: NextPage = () => {
  const [employeeData, setEmployeeData] = useState<EmployeeWithoutPasswordInterface | null>(null);
  const [parcelHubData, setParcelHubData] = useState<ParcelHubInterface | null>(null);
  const [parcelData, setParcelData] = useState<ParcelInterface[] | null>(null);
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [newParcelData, setNewParcelData] = useState<ParcelInterface>({
    tracking_number: "",
    parcel_weight_kg: undefined,
    parcel_dimensions_cm: {
      length: undefined,
      width: undefined,
      height: undefined,
    },
    parcel_estimated_delivery: "",
    parcel_type: "",
    is_fragile: true || false,
    extra_comment: "",
    sender: {
      name: "",
      phone_number: "",
      email: "",
    },
    recipient: {
      name: "",
      phone_number: "",
      email: "",
    },
    final_destination: {
      street: "",
      area: "",
      postal_code: "",
      state: "",
      country: "",
    },
    current_location: "",
    pathway: [
      {
        parcel_hub_id: "",
        received_time: "",
        dispatch_time: "",
        photo_url: "",
        sender: {
          signature_hash: "",
        },
        employee: {
          employee_id: "",
          signature_hash: "",
        },
        verification_hash: "",
      },
    ],
    final_delivery: {
      received_time: "",
      photo_url: "",
      customer_signature_hash: "",
      verification_hash: "",
    },
  });

  const [isLogin, setIsLogin] = useState<null | boolean>(null);

  const [filteredParcelData, setFilteredParcelData] = useState<ParcelInterface[] | null>(null);

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
      // redirect to customer dashboard
      window.location.href = "/customer-dashboard";
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
      setFilteredParcelData(
        parcelData.filter(p => p.pathway.some(ph => ph.parcel_hub_id === parcelHubData.parcel_hub_id)),
      );
    }
  }, [parcelData, parcelHubData]);

  const dispatchParcel = (trackingNumber: string) => {
    const status = document.getElementById("status-" + trackingNumber)?.textContent;
    if (status !== "Arrived") {
      Swal.fire({
        icon: "error",
        title: "Action not allowed",
        text: "Parcel is not arrived at your location yet.",
      });
      return;
    }

    // loading 1s
    Swal.fire({
      title: "Get ready to dispatch parcel...",
      timer: 1000,
      timerProgressBar: true,
      didOpen: () => {
        Swal.showLoading();
      },
    }).then(() => {
      window.location.href = "dispatch-parcel/" + trackingNumber;
    });
  };

  const receiveParcel = (trackingNumber: string) => {
    const status = document.getElementById("status-" + trackingNumber)?.textContent;
    if (status !== "OTW") {
      Swal.fire({
        icon: "error",
        title: "Action not allowed",
        text: "Parcel is not dispatched from your location yet.",
      });
      return;
    }

    // loading 1s
    Swal.fire({
      title: "Get ready to receive parcel...",
      timer: 1000,
      timerProgressBar: true,
      didOpen: () => {
        Swal.showLoading();
      },
    }).then(() => {
      window.location.href = "receive-parcel/" + trackingNumber;
    });
  };

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

  const handleDateTimeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;

    if (name === "date") {
      setDate(value);
    }
    if (name === "time") {
      setTime(value);
    }

    // If both date and time are set, update parcel_estimated_delivery
    if (date || time) {
      const isoString = `${date}T${time}:00Z`; // Ensure format is correct
      setNewParcelData(prev => ({
        ...prev,
        parcel_estimated_delivery: isoString,
      }));
      //console.log("parcel_estimated_delivery updated:", newParcelData.parcel_estimated_delivery);
    }
  };

  const handleChange = (e: any) => {
    const { name, value } = e.target;
    setNewParcelData(prev => ({
      ...prev,
      [name]: name === "is_fragile" ? value === "true" : value,
    }));
  };

  const handleNestedChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
    section: keyof ParcelInterface,
    key: string,
  ) => {
    const { value } = e.target;
    setNewParcelData(prev => {
      if (!prev) return prev;
      const sectionData = prev[section] as Record<string, any>;
      return {
        ...prev,
        [section]: {
          ...sectionData,
          [key]: value,
        },
      };
    });
  };

  const generateUniqueTrackingNumber = (): string => {
    let trackingNumber: string;
    do {
      trackingNumber =
        "TRK" +
        Math.floor(Math.random() * 1000000000)
          .toString()
          .padStart(9, "0");
    } while (parcelJSON.some(parcel => parcel.tracking_number === trackingNumber));

    return trackingNumber;
  };

  const applyDijkstraAlgoritm = (destinationHub: string) => {
    const destinationId =
      destinationHub in localAreaJSON ? localAreaJSON[destinationHub as keyof typeof localAreaJSON] : "1.3.1.1";
    const validAddresses = [
      "1.0.0.0",
      "1.2.0.0",
      "1.2.1.0",
      "1.2.1.1",
      "1.3.0.0",
      "1.3.1.0",
      "1.3.1.1",
      "1.3.2.0",
      "1.3.2.1",
      "1.3.2.2",
      "2.0.0.0",
      "2.6.0.0",
      "2.6.1.0",
      "2.6.1.1",
    ];

    const origin = parcelHubData?.parcel_hub_id || "1.3.2.1"; // Example origin

    // console.log("Origin:", origin);
    // console.log("Destination:", destination);

    // Generate pathway using the algorithm
    const pathwayHubs = generatePath(origin, destinationId, validAddresses);

    //Set the current location
    newParcelData.current_location = destinationId;

    // Map pathway data structure
    newParcelData.pathway = pathwayHubs.map((hubId, index) => ({
      parcel_hub_id: hubId,
      received_time: index === 0 ? new Date().toISOString() : "", // Set current time for first hub only
      dispatch_time: "",
      photo_url: "",
      sender: {
        signature_hash: "",
      },
      employee: {
        employee_id: "",
        signature_hash: "",
      },
      verification_hash: "",
    }));

    // console.log(newParcelData.pathway);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    newParcelData.tracking_number = generateUniqueTrackingNumber();
    applyDijkstraAlgoritm(newParcelData.final_destination.area);
    console.log(newParcelData);

    try {
      const response = await fetch("/api/temporaryParcel", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newParcelData),
      });

      const result = await response.json();
      if (response.ok) {
        // loading 1s
        Swal.fire({
          title: "Get ready to create parcel...",
          timer: 1000,
          timerProgressBar: true,
          didOpen: () => {
            Swal.showLoading();
          },
        }).then(() => {
          window.location.href = "create-parcel/" + newParcelData.tracking_number;
        });
      } else {
        console.error("Error:", result);
        alert("Failed to update parcel data.");
      }
    } catch (error) {
      console.error("Request Error:", error);
      alert("An error occurred while updating parcel data.");
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      <h1 className="text-4xl font-bold mt-8">Parcel Dashboard</h1>
      <p>Check parcel status here.</p>

      {/* Parcel Hub detail */}
      <div className="flex flex-row w-[60%] gap-4 mb-6">
        {parcelHubData ? (
          <ul className="list bg-base-100 rounded-box w-full shadow-md">
            <li className="p-4 pb-0 text-md tracking-wide border-b-2 border-gray-400">
              <p>{parcelHubData.parcel_hub_name}</p>
            </li>
            <div className="card bg-base-100 w-full shadow-sm opacity-65 p-4">
              <div className="flex flex-row justify-between items-center">
                <p className="font-semibold">Parcel Hub ID</p>
                <p>{parcelHubData.parcel_hub_id}</p>
              </div>
              <div className="flex flex-row justify-between items-center">
                <p className="font-semibold">Parcel Hub Address</p>
                <p>{parcelHubData.parcel_hub_address}</p>
              </div>
              <div className="flex flex-row justify-between items-center">
                <p className="font-semibold">Parcel Hub Location</p>
                <p>
                  {parcelHubData.state}, {parcelHubData.country}
                </p>
              </div>
              <div className="flex flex-row justify-between items-center">
                <p className="font-semibold">Operating Level</p>
                <p>
                  <span
                    className={`badge badge-outline badge-sm ${
                      parcelHubData.parcel_hub_operating_level.toLowerCase() === "international"
                        ? "badge-success"
                        : parcelHubData.parcel_hub_operating_level.toLowerCase() === "national"
                          ? "badge-info"
                          : parcelHubData.parcel_hub_operating_level.toLowerCase() === "regional"
                            ? "badge-warning"
                            : "badge-error"
                    }`}
                  >
                    {parcelHubData.parcel_hub_operating_level.charAt(0).toUpperCase() +
                      parcelHubData.parcel_hub_operating_level.slice(1).toLowerCase()}
                  </span>
                </p>
              </div>
            </div>
          </ul>
        ) : (
          <div className="flex flex-row justify-between w-full items-center">
            <p className="text-center w-full">Loading ...</p>
          </div>
        )}
      </div>

      {/* Add Parcel Button */}
      <div className="flex flex-row w-[80%] gap-4 mb-6">
        <div className="w-full flex justify-end">
          <button
            className="btn btn-primary"
            onClick={() => (document.getElementById("modal-add-parcel") as HTMLDialogElement)?.showModal()}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth="1.5"
              stroke="currentColor"
              className="size-6"
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
            </svg>
            Add Parcel
          </button>
        </div>
      </div>

      {/* This is a dividerrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrr */}
      {/* Add Parcel Modal */}
      <dialog id="modal-add-parcel" className="modal">
        <div className="modal-box w-8/12 max-w-5xl">
          <h3 className="font-bold text-lg">Add New Parcel</h3>
          <p className="py-4">Press ESC key or click the button below to close</p>
          {/* Form */}
          {/* Parcel weight */}
          <div className="flex justify-between items-center w-full gap-2">
            <div className="flex md:flex-row flex-col px-2 w-full gap-2">
              <p className="w-56">
                Parcel weight
                <span className="text-error ms-1">*</span>
              </p>
              <div className="flex flex-row gap-2 items-center w-full">
                <input
                  type="number"
                  placeholder="Parcel weight"
                  className="input"
                  name="parcel_weight_kg"
                  value={newParcelData.parcel_weight_kg}
                  onChange={handleChange}
                />{" "}
                kg
              </div>
            </div>
          </div>
          {/* Parcel dimension */}
          <div className="flex justify-between items-center w-full gap-2">
            <div className="flex md:flex-row flex-col px-2 w-full gap-2">
              <p className="w-56">
                Parcel dimension
                <span className="text-error ms-1">*</span>
              </p>
              <div className="flex flex-row gap-2 items-center w-full">
                <div className="flex flex-row gap-2 items-center">
                  <input
                    type="text"
                    placeholder="Length"
                    className="input"
                    name="parcel_dimensions_cm.length"
                    value={newParcelData.parcel_dimensions_cm.length}
                    onChange={e => handleNestedChange(e, "parcel_dimensions_cm", "length")}
                  />
                  <span className="text-center w-12">cm x</span>
                </div>
                <div className="flex flex-row gap-2 items-center">
                  <input
                    type="text"
                    placeholder="Width"
                    className="input"
                    name="parcel_dimensions_cm.width"
                    value={newParcelData.parcel_dimensions_cm.width}
                    onChange={e => handleNestedChange(e, "parcel_dimensions_cm", "width")}
                  />
                  <span className="text-center w-12">cm x</span>
                </div>
                <div className="flex flex-row gap-2 items-center">
                  <input
                    type="text"
                    placeholder="Height"
                    className="input"
                    name="parcel_dimensions_cm.height"
                    value={newParcelData.parcel_dimensions_cm.height}
                    onChange={e => handleNestedChange(e, "parcel_dimensions_cm", "height")}
                  />
                  <span className="text-center w-12">cm</span>
                </div>
              </div>
            </div>
          </div>
          {/* Parcel estimated delivery */}
          <div className="flex justify-between items-center w-full gap-2">
            <div className="flex md:flex-row flex-col px-2 w-full gap-2">
              <p className="w-56">
                Parcel estimated delivery
                <span className="text-error ms-1">*</span>
              </p>
              <p className="flex flex-row gap-2 items-center w-full">
                <input type="date" className="input w-56" name="date" value={date} onChange={handleDateTimeChange} />
                <input type="time" className="input w-56" name="time" value={time} onChange={handleDateTimeChange} />
              </p>
            </div>
          </div>
          <div className="flex justify-between items-center w-full gap-2">
            <div className="flex md:flex-row flex-col px-2 w-full gap-2">
              <p className="w-56">
                Parcel type
                <span className="text-error ms-1">*</span>
              </p>
              <div className="flex w-full flex-row items-center gap-2">
                {/* Parcel type */}
                <div className="flex flex-row gap-2 items-center w-full">
                  <select className="select select-bordered max-w-xs w-full" name="parcel_type" onChange={handleChange}>
                    <option disabled selected>
                      Select parcel type
                    </option>
                    <option value="box">Box</option>
                    <option value="envelope">Envelope</option>
                    <option value="package">Package</option>
                    <option value="other">Other</option>
                  </select>
                </div>
              </div>
            </div>
            <div className="flex md:flex-row flex-col px-2 w-full gap-2">
              <p className="w-56">
                Is Fragile?
                <span className="text-error ms-1">*</span>
              </p>
              <div className="flex w-full flex-row items-center gap-2">
                {/* Is Fragile */}
                <div className="flex flex-row gap-12 w-full">
                  <label className="label cursor-pointer">
                    <span className="label-text">Yes</span>
                    <input
                      type="radio"
                      name="is_fragile"
                      className="radio radio-primary"
                      value="true"
                      checked={newParcelData.is_fragile === true}
                      onChange={handleChange}
                    />
                  </label>
                  <label className="label cursor-pointer">
                    <span className="label-text">No</span>
                    <input
                      type="radio"
                      name="is_fragile"
                      className="radio radio-primary"
                      value="false"
                      checked={newParcelData.is_fragile === false}
                      onChange={handleChange}
                    />
                  </label>
                </div>
              </div>
            </div>
          </div>
          {/* Extra comment */}
          <div className="flex justify-between items-center w-full gap-2">
            <div className="flex md:flex-row flex-col px-2 w-full gap-2">
              <p className="w-56">Extra Comment</p>
              <textarea
                className="textarea textarea-bordered w-full"
                placeholder="Extra comment"
                name="extra_comment"
                value={newParcelData.extra_comment}
                onChange={handleChange}
              ></textarea>
            </div>
          </div>
          {/* Upload image */}
          <div className="flex justify-between items-center w-full gap-2">
            <div className="flex md:flex-row flex-col px-2 w-full gap-2">
              <p className="w-56">
                Upload image
                <span className="text-error ms-1">*</span>
              </p>
              <div className="flex flex-row gap-2 items-center w-full">
                <input type="file" className="file-input" accept="image/*" name="photo_url" onChange={handleChange} />
              </div>
            </div>
          </div>

          <hr className="mt-8 mb-4 opacity-60" />
          {/* Sender */}
          <h4 className="font-bold text-lg">Sender</h4>
          {/* Sender name */}
          <div className="flex justify-between items-center w-full gap-2">
            <div className="flex md:flex-row flex-col px-2 w-full gap-2">
              <p className="w-56">
                Name
                <span className="text-error ms-1">*</span>
              </p>
              <div className="flex flex-row gap-2 items-center w-full">
                <input
                  type="text"
                  placeholder="John Doe"
                  className="input"
                  name="sender.name"
                  value={newParcelData.sender.name}
                  onChange={e => handleNestedChange(e, "sender", "name")}
                />
              </div>
            </div>
          </div>
          {/* Sender phone number */}
          <div className="flex justify-between items-center w-full gap-2">
            <div className="flex md:flex-row flex-col px-2 w-full gap-2">
              <p className="w-56">
                Phone number
                <span className="text-error ms-1">*</span>
              </p>
              <div className="flex flex-row gap-2 items-center w-full">
                <input
                  type="text"
                  placeholder="+60123456789"
                  className="input"
                  name="sender.phone_number"
                  value={newParcelData.sender.phone_number}
                  onChange={e => handleNestedChange(e, "sender", "phone_number")}
                />
              </div>
            </div>
          </div>
          {/* Sender email */}
          <div className="flex justify-between items-center w-full gap-2">
            <div className="flex md:flex-row flex-col px-2 w-full gap-2">
              <p className="w-56">
                Email
                <span className="text-error ms-1">*</span>
              </p>
              <div className="flex flex-row gap-2 items-center w-full">
                <input
                  type="email"
                  placeholder="john.doe@example.com"
                  className="input"
                  name="sender.email"
                  value={newParcelData.sender.email}
                  onChange={e => handleNestedChange(e, "sender", "email")}
                />
              </div>
            </div>
          </div>

          <hr className="mt-8 mb-4 opacity-60" />
          {/* Recipient */}
          <h4 className="font-bold text-lg">Recipent</h4>
          {/* Recipent name */}
          <div className="flex justify-between items-center w-full gap-2">
            <div className="flex md:flex-row flex-col px-2 w-full gap-2">
              <p className="w-56">
                Name
                <span className="text-error ms-1">*</span>
              </p>
              <div className="flex flex-row gap-2 items-center w-full">
                <input
                  type="text"
                  placeholder="John Doe"
                  className="input"
                  name="recipient.name"
                  onChange={e => handleNestedChange(e, "recipient", "name")}
                  value={newParcelData.recipient.name}
                />
              </div>
            </div>
          </div>
          {/* Recipent phone number */}
          <div className="flex justify-between items-center w-full gap-2">
            <div className="flex md:flex-row flex-col px-2 w-full gap-2">
              <p className="w-56">
                Phone number
                <span className="text-error ms-1">*</span>
              </p>
              <div className="flex flex-row gap-2 items-center w-full">
                <input
                  type="text"
                  placeholder="+60123456789"
                  className="input"
                  name="recipient.phone_number"
                  onChange={e => handleNestedChange(e, "recipient", "phone_number")}
                  value={newParcelData.recipient.phone_number}
                />
              </div>
            </div>
          </div>
          {/* Recipent email */}
          <div className="flex justify-between items-center w-full gap-2">
            <div className="flex md:flex-row flex-col px-2 w-full gap-2">
              <p className="w-56">
                Email
                <span className="text-error ms-1">*</span>
              </p>
              <div className="flex flex-row gap-2 items-center w-full">
                <input
                  type="email"
                  placeholder="john.doe@example.com"
                  className="input"
                  name="recipient.email"
                  onChange={e => handleNestedChange(e, "recipient", "email")}
                  value={newParcelData.recipient.email}
                />
              </div>
            </div>
          </div>

          <hr className="mt-8 mb-4 opacity-60" />
          {/* Final Destination */}
          <h4 className="font-bold text-lg">Final Destination</h4>
          {/* Street */}
          <div className="flex justify-between items-center w-full gap-2">
            <div className="flex md:flex-row flex-col px-2 w-full gap-2">
              <p className="w-56">
                Street
                <span className="text-error ms-1">*</span>
              </p>
              <div className="flex flex-row gap-2 items-center w-full">
                <input
                  type="text"
                  placeholder="123, Jalan ABC"
                  className="input"
                  name="final_destination.street"
                  onChange={e => handleNestedChange(e, "final_destination", "street")}
                  value={newParcelData.final_destination.street}
                />
              </div>
            </div>
          </div>
          {/* Area */}
          <div className="flex justify-between items-center w-full gap-2">
            <div className="flex md:flex-row flex-col px-2 w-full gap-2">
              <p className="w-56">
                Area
                <span className="text-error ms-1">*</span>
              </p>
              <div className="flex flex-row gap-2 items-center w-full">
                <select
                  className="select select-bordered max-w-xs w-full"
                  onChange={(e: React.ChangeEvent<HTMLSelectElement>) => {
                    const selectedArea = e.target.value;
                    const selectedPostcode =
                      (postcodeJSON as Record<string, { postal_code: string }>)[selectedArea]?.postal_code || "";

                    setNewParcelData(prev => ({
                      ...prev,
                      final_destination: {
                        ...prev.final_destination,
                        area: selectedArea,
                        postal_code: selectedPostcode,
                      },
                    }));
                  }}
                >
                  <option disabled selected>
                    Select area
                  </option>
                  {Object.entries(postcodeJSON).map(([area, data]) => (
                    <option key={area} value={area}>
                      {data.postal_code} - {area}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>
          <div className="flex justify-between items-center w-full gap-2">
            {/* <div className="flex md:flex-row flex-col px-2 w-full gap-2"> */}
            {/* <p className="w-56">
                Postcode
                <span className="text-error ms-1">*</span>
              </p> */}
            {/* <div className="flex w-full flex-row items-center gap-2"> */}
            {/* Postcode */}
            {/* <div className="flex flex-row gap-2 items-center w-full"> */}
            {/* <select
                    className="select select-bordered max-w-xs w-full"
                    onChange={e => handleNestedChange(e, "final_destination", "postal_code")}
                  >
                    <option disabled selected>
                      Select area
                    </option>
                    {Object.keys(localAreaJSON).map(area => (
                      <option key={area} value={area}>
                        {area}
                      </option>
                    ))}
                  </select> */}
            {/* </div> */}
            {/* </div> */}
            {/* </div> */}
            <div className="flex md:flex-row flex-col px-2 w-full gap-2">
              <p className="w-56">
                State
                <span className="text-error ms-1">*</span>
              </p>
              <div className="flex w-full flex-row items-center gap-2">
                {/* State */}
                <div className="flex flex-row gap-2 items-center w-full">
                  <input
                    type="text"
                    placeholder="Selangor"
                    className="input"
                    name="final_destination.state"
                    onChange={e => handleNestedChange(e, "final_destination", "state")}
                    value={newParcelData.final_destination.state}
                  />
                </div>
              </div>
            </div>
          </div>
          {/* Country */}
          <div className="flex justify-between items-center w-full gap-2">
            <div className="flex md:flex-row flex-col px-2 w-full gap-2">
              <p className="w-56">
                Country
                <span className="text-error ms-1">*</span>
              </p>
              <div className="flex flex-row gap-2 items-center w-full">
                <select
                  className="select select-bordered w-"
                  onChange={e => handleNestedChange(e, "final_destination", "country")}
                >
                  <option disabled selected>
                    Select country
                  </option>
                  {Object.values(countries).map(country => (
                    <option key={country.name} value={country.name}>
                      {country.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          <div className="modal-action">
            <form method="dialog">
              <div className="flex flex-row gap-2">
                {/* if there is a button in form, it will close the modal */}
                <button className="btn">Cancel</button>
                {/* Submit button */}
                <button className="btn btn-primary" onClick={handleSubmit}>
                  Submit
                </button>
              </div>
            </form>
          </div>
        </div>
      </dialog>
      {/* This is a dividerrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrr */}

      {/* Dashboard table */}
      <div className="flex flex-col w-[80%] min-w-96 gap-4 mb-4">
        <div className="overflow-x-auto">
          <table className="table">
            {/* head */}
            <thead>
              <tr>
                <th>Tracking No.</th>
                <th>Sender</th>
                <th>Recipient</th>
                <th>Send From</th>
                <th>Final Destination</th>
                <th>Status</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {filteredParcelData?.map(parcel => (
                <tr key={parcel.tracking_number}>
                  <td
                    className="link hover:text-secondary"
                    onClick={() =>
                      (
                        document.getElementById("modal-trackingNo-" + parcel.tracking_number) as HTMLDialogElement
                      )?.showModal()
                    }
                  >
                    {parcel.tracking_number}
                  </td>
                  <td
                    className="link hover:text-secondary"
                    onClick={() =>
                      (
                        document.getElementById("modal-sender-" + parcel.tracking_number) as HTMLDialogElement
                      )?.showModal()
                    }
                  >
                    {parcel.sender.name}
                  </td>
                  <td
                    className="link hover:text-secondary"
                    onClick={() =>
                      (
                        document.getElementById("modal-recipent-" + parcel.tracking_number) as HTMLDialogElement
                      )?.showModal()
                    }
                  >
                    {parcel.recipient.name}
                  </td>
                  <td>
                    {parcel.pathway[0].parcel_hub_id === parcelHubData?.parcel_hub_id ? (
                      <i>(Sender)</i>
                    ) : parcel.pathway.findIndex(ph => ph.parcel_hub_id === parcelHubData?.parcel_hub_id) > 0 ? (
                      <>
                        <span
                          className="inline-block pb-1 link hover:text-secondary"
                          onClick={() =>
                            (
                              document.getElementById("modal-sendFrom-" + parcel.tracking_number) as HTMLDialogElement
                            )?.showModal()
                          }
                        >
                          {parcelHubJSON.find(
                            ph =>
                              ph.parcel_hub_id ===
                              parcel.pathway[
                                parcel.pathway.findIndex(ph => ph.parcel_hub_id === parcelHubData?.parcel_hub_id) - 1
                              ].parcel_hub_id,
                          )?.parcel_hub_name || "-"}
                        </span>
                        <br />
                        <span
                          className={`inline-block badge badge-outline badge-sm ${
                            parcelHubJSON
                              .find(
                                ph =>
                                  ph.parcel_hub_id ===
                                  parcel.pathway[
                                    parcel.pathway.findIndex(ph => ph.parcel_hub_id === parcelHubData?.parcel_hub_id) -
                                      1
                                  ].parcel_hub_id,
                              )
                              ?.parcel_hub_operating_level.toLowerCase() === "international"
                              ? "badge-success"
                              : parcelHubJSON
                                    .find(
                                      ph =>
                                        ph.parcel_hub_id ===
                                        parcel.pathway[
                                          parcel.pathway.findIndex(
                                            ph => ph.parcel_hub_id === parcelHubData?.parcel_hub_id,
                                          ) - 1
                                        ].parcel_hub_id,
                                    )
                                    ?.parcel_hub_operating_level.toLowerCase() === "national"
                                ? "badge-info"
                                : parcelHubJSON
                                      .find(
                                        ph =>
                                          ph.parcel_hub_id ===
                                          parcel.pathway[
                                            parcel.pathway.findIndex(
                                              ph => ph.parcel_hub_id === parcelHubData?.parcel_hub_id,
                                            ) - 1
                                          ].parcel_hub_id,
                                      )
                                      ?.parcel_hub_operating_level.toLowerCase() === "regional"
                                  ? "badge-warning"
                                  : "badge-error"
                          }`}
                        >
                          {(parcelHubJSON
                            .find(
                              ph =>
                                ph.parcel_hub_id ===
                                parcel.pathway[
                                  parcel.pathway.findIndex(ph => ph.parcel_hub_id === parcelHubData?.parcel_hub_id) - 1
                                ].parcel_hub_id,
                            )
                            ?.parcel_hub_operating_level.charAt(0)
                            .toUpperCase() || "") +
                            (parcelHubJSON
                              .find(
                                ph =>
                                  ph.parcel_hub_id ===
                                  parcel.pathway[
                                    parcel.pathway.findIndex(ph => ph.parcel_hub_id === parcelHubData?.parcel_hub_id) -
                                      1
                                  ].parcel_hub_id,
                              )
                              ?.parcel_hub_operating_level.slice(1)
                              .toLowerCase() || "") || "-"}
                        </span>
                      </>
                    ) : (
                      "-"
                    )}
                  </td>
                  <td>
                    {parcel.final_destination.street +
                      ", " +
                      parcel.final_destination.area +
                      ", " +
                      parcel.final_destination.postal_code +
                      ", " +
                      parcel.final_destination.state +
                      ", " +
                      parcel.final_destination.country}
                  </td>
                  <td>
                    <div
                      id={`status-${parcel.tracking_number}`}
                      className={`badge badge-outline badge-sm ${
                        parcel.current_location === "received"
                          ? "badge-ghost" // Delivered
                          : parcel.current_location === parcelHubData?.parcel_hub_id &&
                              parcel.pathway.find(ph => ph.parcel_hub_id === parcelHubData.parcel_hub_id)
                                ?.received_time &&
                              !parcel.pathway.find(ph => ph.parcel_hub_id === parcelHubData.parcel_hub_id)
                                ?.dispatch_time
                            ? "badge-secondary" // Arrived
                            : parcel.current_location === parcelHubData?.parcel_hub_id &&
                                parcel.pathway.find(ph => ph.parcel_hub_id === parcelHubData.parcel_hub_id)
                                  ?.received_time &&
                                parcel.pathway.find(ph => ph.parcel_hub_id === parcelHubData.parcel_hub_id)
                                  ?.dispatch_time &&
                                !parcel.pathway[
                                  parcel.pathway.findIndex(ph => ph.parcel_hub_id === parcelHubData.parcel_hub_id) + 1
                                ]?.received_time
                              ? "badge-success" // Dispatched
                              : parcel.current_location === parcelHubData?.parcel_hub_id &&
                                  parcel.pathway[0].parcel_hub_id === parcelHubData.parcel_hub_id &&
                                  !parcel.pathway[0].dispatch_time
                                ? "badge-secondary" // Arrived
                                : parcel.pathway.some(
                                      (ph, index) =>
                                        ph.parcel_hub_id === parcelHubData?.parcel_hub_id &&
                                        parcel.pathway
                                          .slice(0, index)
                                          .some(p => p.parcel_hub_id === parcel.current_location && p.dispatch_time),
                                    )
                                  ? "badge-warning" // OTW
                                  : parcel.pathway.some(
                                        (ph, index) =>
                                          ph.parcel_hub_id === parcelHubData?.parcel_hub_id &&
                                          parcel.pathway
                                            .slice(index + 1)
                                            .some(p => p.parcel_hub_id === parcel.current_location && ph.dispatch_time),
                                      )
                                    ? "badge-info" // Forwarded
                                    : parcel.pathway.findIndex(
                                          ph => ph.parcel_hub_id === parcelHubData?.parcel_hub_id,
                                        ) > 0 &&
                                        parcel.pathway
                                          .slice(
                                            0,
                                            parcel.pathway.findIndex(
                                              ph => ph.parcel_hub_id === parcelHubData?.parcel_hub_id,
                                            ),
                                          )
                                          .some(ph => ph.parcel_hub_id === parcel.current_location)
                                      ? "badge-primary" // Pending
                                      : "badge-error" // Error
                      }`}
                    >
                      {parcel.current_location === "received"
                        ? "Delivered"
                        : parcel.current_location === parcelHubData?.parcel_hub_id &&
                            parcel.pathway.find(ph => ph.parcel_hub_id === parcelHubData.parcel_hub_id)
                              ?.received_time &&
                            !parcel.pathway.find(ph => ph.parcel_hub_id === parcelHubData.parcel_hub_id)?.dispatch_time
                          ? "Arrived"
                          : parcel.current_location === parcelHubData?.parcel_hub_id &&
                              parcel.pathway.find(ph => ph.parcel_hub_id === parcelHubData.parcel_hub_id)
                                ?.received_time &&
                              parcel.pathway.find(ph => ph.parcel_hub_id === parcelHubData.parcel_hub_id)
                                ?.dispatch_time &&
                              !parcel.pathway[
                                parcel.pathway.findIndex(ph => ph.parcel_hub_id === parcelHubData.parcel_hub_id) + 1
                              ]?.received_time
                            ? "Dispatched"
                            : parcel.current_location === parcelHubData?.parcel_hub_id &&
                                parcel.pathway[0].parcel_hub_id === parcelHubData.parcel_hub_id &&
                                !parcel.pathway[0].dispatch_time
                              ? "Arrived"
                              : parcel.pathway.some(
                                    (ph, index) =>
                                      ph.parcel_hub_id === parcelHubData?.parcel_hub_id &&
                                      parcel.pathway
                                        .slice(0, index)
                                        .some(p => p.parcel_hub_id === parcel.current_location && p.dispatch_time),
                                  )
                                ? "OTW"
                                : parcel.pathway.some(
                                      (ph, index) =>
                                        ph.parcel_hub_id === parcelHubData?.parcel_hub_id &&
                                        parcel.pathway
                                          .slice(index + 1)
                                          .some(p => p.parcel_hub_id === parcel.current_location && ph.dispatch_time),
                                    )
                                  ? "Forwarded"
                                  : parcel.pathway.findIndex(ph => ph.parcel_hub_id === parcelHubData?.parcel_hub_id) >
                                        0 &&
                                      parcel.pathway
                                        .slice(
                                          0,
                                          parcel.pathway.findIndex(
                                            ph => ph.parcel_hub_id === parcelHubData?.parcel_hub_id,
                                          ),
                                        )
                                        .some(ph => ph.parcel_hub_id === parcel.current_location)
                                    ? "Pending"
                                    : "Error"}
                    </div>
                  </td>
                  <td>
                    <div className="list-row">
                      {/* Track Delivery */}
                      <button
                        className="btn btn-square btn-ghost"
                        onClick={() => trackDelivery(parcel.tracking_number)}
                      >
                        <div className="tooltip" data-tip="Track delivery">
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
                              d="M15 10.5a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z"
                            />
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1 1 15 0Z"
                            />
                          </svg>
                        </div>
                      </button>
                      {/* Receive Parcel */}
                      {/* Status is OTW */}
                      {parcel.pathway.some(
                        (ph, index) =>
                          ph.parcel_hub_id === parcelHubData?.parcel_hub_id &&
                          parcel.pathway
                            .slice(0, index)
                            .some(p => p.parcel_hub_id === parcel.current_location && p.dispatch_time),
                      ) && (
                        <button
                          onClick={() => receiveParcel(parcel.tracking_number)}
                          className="btn btn-square btn-ghost"
                        >
                          <div className="tooltip" data-tip="Receive parcel">
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
                                d="M9 3.75H6.912a2.25 2.25 0 0 0-2.15 1.588L2.35 13.177a2.25 2.25 0 0 0-.1.661V18a2.25 2.25 0 0 0 2.25 2.25h15A2.25 2.25 0 0 0 21.75 18v-4.162c0-.224-.034-.447-.1-.661L19.24 5.338a2.25 2.25 0 0 0-2.15-1.588H15M2.25 13.5h3.86a2.25 2.25 0 0 1 2.012 1.244l.256.512a2.25 2.25 0 0 0 2.013 1.244h3.218a2.25 2.25 0 0 0 2.013-1.244l.256-.512a2.25 2.25 0 0 1 2.013-1.244h3.859M12 3v8.25m0 0-3-3m3 3 3-3"
                              />
                            </svg>
                          </div>
                        </button>
                      )}
                      {/* Dispatch Parcel */}
                      {/* Status is arrived */}
                      {((parcel.current_location === parcelHubData?.parcel_hub_id &&
                        parcel.pathway.find(ph => ph.parcel_hub_id === parcelHubData.parcel_hub_id)?.received_time &&
                        !parcel.pathway.find(ph => ph.parcel_hub_id === parcelHubData.parcel_hub_id)?.dispatch_time) ||
                        (parcel.current_location === parcelHubData?.parcel_hub_id &&
                          parcel.pathway[0].parcel_hub_id === parcelHubData.parcel_hub_id &&
                          !parcel.pathway[0].dispatch_time)) && (
                        <button
                          className="btn btn-square btn-ghost"
                          onClick={() => dispatchParcel(parcel.tracking_number)}
                        >
                          <div className="tooltip" data-tip="Dispatch parcel">
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
                                d="M6 12 3.269 3.125A59.769 59.769 0 0 1 21.485 12 59.768 59.768 0 0 1 3.27 20.875L5.999 12Zm0 0h7.5"
                              />
                            </svg>
                          </div>
                        </button>
                      )}
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
                    {/* Sender Modal */}
                    <dialog id={"modal-sender-" + parcel.tracking_number} className="modal">
                      <div className="modal-box">
                        <h3 className="font-bold text-lg">{parcel.sender.name}</h3>
                        <p className="pb-2">Press ESC key or click the button below to close</p>
                        {/* Sender phone number */}
                        <div className="flex justify-between items-center">
                          <p>Phone number</p>
                          <p>{parcel.sender.phone_number}</p>
                        </div>
                        {/* Sender address */}
                        <div className="flex justify-between items-center">
                          <p>Email</p>
                          <p>{parcel.sender.email}</p>
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
                    {/* Recipent Modal */}
                    <dialog id={"modal-recipent-" + parcel.tracking_number} className="modal">
                      <div className="modal-box">
                        <h3 className="font-bold text-lg">{parcel.recipient.name}</h3>
                        <p className="pb-2">Press ESC key or click the button below to close</p>
                        {/* Recipent phone number */}
                        <div className="flex justify-between items-center">
                          <p>Phone number</p>
                          <p>{parcel.recipient.phone_number}</p>
                        </div>
                        {/* Recipent email */}
                        <div className="flex justify-between items-center">
                          <p>Email</p>
                          <p>{parcel.recipient.email}</p>
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
                    {/* Send From Modal */}
                    <dialog id={"modal-sendFrom-" + parcel.tracking_number} className="modal">
                      <div className="modal-box">
                        <h3 className="font-bold text-lg">
                          {parcelHubJSON.find(
                            ph =>
                              ph.parcel_hub_id ===
                              parcel.pathway[
                                parcel.pathway.findIndex(ph => ph.parcel_hub_id === parcelHubData?.parcel_hub_id) - 1
                              ]?.parcel_hub_id,
                          )?.parcel_hub_name ?? "-"}
                        </h3>
                        <p className="pb-2">Press ESC key or click the button below to close</p>
                        {/* Parcel Hub ID */}
                        <div className="flex justify-between items-center">
                          <p>Parcel Hub ID</p>
                          <p>
                            {
                              parcel.pathway[
                                parcel.pathway.findIndex(ph => ph.parcel_hub_id === parcelHubData?.parcel_hub_id) - 1
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
                                parcel.pathway[
                                  parcel.pathway.findIndex(ph => ph.parcel_hub_id === parcelHubData?.parcel_hub_id) - 1
                                ]?.parcel_hub_id,
                            )?.parcel_hub_address +
                              ", " +
                              parcelHubJSON.find(
                                ph =>
                                  ph.parcel_hub_id ===
                                  parcel.pathway[
                                    parcel.pathway.findIndex(ph => ph.parcel_hub_id === parcelHubData?.parcel_hub_id) -
                                      1
                                  ]?.parcel_hub_id,
                              )?.state +
                              ", " +
                              parcelHubJSON.find(
                                ph =>
                                  ph.parcel_hub_id ===
                                  parcel.pathway[
                                    parcel.pathway.findIndex(ph => ph.parcel_hub_id === parcelHubData?.parcel_hub_id) -
                                      1
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
                                  .find(
                                    ph =>
                                      ph.parcel_hub_id ===
                                      parcel.pathway[
                                        parcel.pathway.findIndex(
                                          ph => ph.parcel_hub_id === parcelHubData?.parcel_hub_id,
                                        ) - 1
                                      ]?.parcel_hub_id,
                                  )
                                  ?.parcel_hub_operating_level.toLowerCase() === "international"
                                  ? "badge-success"
                                  : parcelHubJSON
                                        .find(
                                          ph =>
                                            ph.parcel_hub_id ===
                                            parcel.pathway[
                                              parcel.pathway.findIndex(
                                                ph => ph.parcel_hub_id === parcelHubData?.parcel_hub_id,
                                              ) - 1
                                            ]?.parcel_hub_id,
                                        )
                                        ?.parcel_hub_operating_level.toLowerCase() === "national"
                                    ? "badge-info"
                                    : parcelHubJSON
                                          .find(
                                            ph =>
                                              ph.parcel_hub_id ===
                                              parcel.pathway[
                                                parcel.pathway.findIndex(
                                                  ph => ph.parcel_hub_id === parcelHubData?.parcel_hub_id,
                                                ) - 1
                                              ]?.parcel_hub_id,
                                          )
                                          ?.parcel_hub_operating_level.toLowerCase() === "regional"
                                      ? "badge-warning"
                                      : "badge-error"
                              }`}
                            >
                              {(parcelHubJSON
                                .find(
                                  ph =>
                                    ph.parcel_hub_id ===
                                    parcel.pathway[
                                      parcel.pathway.findIndex(
                                        ph => ph.parcel_hub_id === parcelHubData?.parcel_hub_id,
                                      ) - 1
                                    ]?.parcel_hub_id,
                                )
                                ?.parcel_hub_operating_level.charAt(0)
                                .toUpperCase() || "") +
                                (parcelHubJSON
                                  .find(
                                    ph =>
                                      ph.parcel_hub_id ===
                                      parcel.pathway[
                                        parcel.pathway.findIndex(
                                          ph => ph.parcel_hub_id === parcelHubData?.parcel_hub_id,
                                        ) - 1
                                      ]?.parcel_hub_id,
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
                  </td>
                </tr>
              ))}
            </tbody>
            {/* foot */}
            <tfoot>
              <tr>
                <th>Tracking No.</th>
                <th>Recipent</th>
                <th>Send From</th>
                <th>Final Destination</th>
                <th>Status</th>
                <th>Action</th>
              </tr>
            </tfoot>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
