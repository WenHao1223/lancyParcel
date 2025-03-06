"use client";

import { useEffect, useState } from "react";
import localAreaJSON from "../../public/data/localArea.json";
import parcelJSON from "../../public/data/parcel.json";
import parcelHubJSON from "../../public/data/parcelHub.json";
import { countries } from "countries-list";
import { NextPage } from "next";
import Swal from "sweetalert2";
import { EmployeeWithoutPasswordInterface, ParcelHubInterface, ParcelInterface } from "~~/interfaces/GeneralInterface";

const Dashboard: NextPage = () => {
  const [loginData, setLoginData] = useState<EmployeeWithoutPasswordInterface | null>(null);
  const [parcelHubData, setParcelHubData] = useState<ParcelHubInterface | null>(null);
  const [parcelData, setParcelData] = useState<ParcelInterface[] | null>(null);
  const [isLogin, setIsLogin] = useState<null | boolean>(null);

  const [filteredParcelData, setFilteredParcelData] = useState<ParcelInterface[] | null>(null);
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
      setFilteredParcelData(
        parcelData.filter(p => p.pathway.some(ph => ph.parcel_hub_id === parcelHubData.parcel_hub_id)),
      );
    }
  }, [parcelData, parcelHubData]);

  const dispatchParcel = (trackingNumber: string) => {
    const status = document.getElementById("status-" + trackingNumber)?.textContent;
    if (status !== "Arrived") {
      alert("Action not allowed.");
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

  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      <h1 className="text-4xl font-bold">Dashboard</h1>
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
                <input type="number" placeholder="Parcel weight" className="input" /> kg
              </div>
            </div>
          </div>
          {/* Parcel weight */}
          <div className="flex justify-between items-center w-full gap-2">
            <div className="flex md:flex-row flex-col px-2 w-full gap-2">
              <p className="w-56">
                Parcel dimension
                <span className="text-error ms-1">*</span>
              </p>
              <div className="flex flex-row gap-2 items-center w-full">
                <div className="flex flex-row gap-2 items-center">
                  <input type="text" placeholder="Length" className="input" />
                  <span className="text-center w-12">cm x</span>
                </div>
                <div className="flex flex-row gap-2 items-center">
                  <input type="text" placeholder="Width" className="input" />
                  <span className="text-center w-12">cm x</span>
                </div>
                <div className="flex flex-row gap-2 items-center">
                  <input type="text" placeholder="Height" className="input" />
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
                <input type="date" className="input w-56" />
                <input type="time" className="input w-56" />
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
                  <select className="select select-bordered max-w-xs w-full">
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
                    <input type="radio" name="is_fragile" className="radio radio-primary" value="yes" />
                  </label>
                  <label className="label cursor-pointer">
                    <span className="label-text">No</span>
                    <input type="radio" name="is_fragile" className="radio radio-primary" value="no" />
                  </label>
                </div>
              </div>
            </div>
          </div>
          {/* Extra comment */}
          <div className="flex justify-between items-center w-full gap-2">
            <div className="flex md:flex-row flex-col px-2 w-full gap-2">
              <p className="w-56">Extra Comment</p>
              <textarea className="textarea textarea-bordered w-full" placeholder="Extra comment"></textarea>
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
                <input type="file" className="file-input" />
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
                <input type="text" placeholder="John Doe" className="input" />
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
                <input type="text" placeholder="+60123456789" className="input" />
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
                <input type="email" placeholder="john.doe@example.com" className="input" />
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
                <input type="text" placeholder="John Doe" className="input" />
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
                <input type="text" placeholder="+60123456789" className="input" />
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
                <input type="email" placeholder="john.doe@example.com" className="input" />
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
                <input type="text" placeholder="123, Jalan ABC" className="input" />
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
                <select className="select select-bordered max-w-xs w-full">
                  <option disabled selected>
                    Select area
                  </option>
                  {Object.keys(localAreaJSON).map(area => (
                    <option key={area} value={area}>
                      {area}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>
          <div className="flex justify-between items-center w-full gap-2">
            <div className="flex md:flex-row flex-col px-2 w-full gap-2">
              <p className="w-56">
                Postcode
                <span className="text-error ms-1">*</span>
              </p>
              <div className="flex w-full flex-row items-center gap-2">
                {/* Postcode */}
                <div className="flex flex-row gap-2 items-center w-full">
                  <select className="select select-bordered max-w-xs w-full">
                    <option disabled selected>
                      Select area
                    </option>
                    {Object.keys(localAreaJSON).map(area => (
                      <option key={area} value={area}>
                        {area}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>
            <div className="flex md:flex-row flex-col px-2 w-full gap-2">
              <p className="w-56">
                State
                <span className="text-error ms-1">*</span>
              </p>
              <div className="flex w-full flex-row items-center gap-2">
                {/* State */}
                <div className="flex flex-row gap-2 items-center w-full">
                  <input type="text" placeholder="Selangor" className="input" />
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
                <select className="select select-bordered w-">
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
                <button className="btn btn-primary">Submit</button>
              </div>
            </form>
          </div>
        </div>
      </dialog>

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
                        <button className="btn btn-square btn-ghost">
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
                          <p>Is fragile</p>
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
