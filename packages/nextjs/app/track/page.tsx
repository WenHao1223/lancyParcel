"use client";

import { useEffect } from "react";
import { NextPage } from "next";
import Swal from "sweetalert2";

const Track: NextPage = () => {
  useEffect(() => {
    Swal.fire({
      title: "Loading...",
      html: "Please wait while we redirect you to the home page.",
      timer: 3000,
      timerProgressBar: true,
      didOpen: () => {
        Swal.showLoading();
      },
    }).then(() => {
      window.location.href = "/";
    });
  }, []);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      <h1 className="text-4xl font-bold mt-8">Tracking Page</h1>
      <p>Track your order here.</p>

      {/* Ordered Item detail */}
      <div className="flex flex-row w-[40%] gap-4 mb-4">
        <ul className="list bg-base-100 rounded-box w-full shadow-md">
          <li className="p-4 pb-2 text-xs opacity-60 tracking-wide">Ordered Item</li>

          <li className="list-row">Loading...</li>
        </ul>
      </div>
    </div>
  );
};

export default Track;
