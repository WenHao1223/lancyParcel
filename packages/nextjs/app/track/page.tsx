import Image from "next/image";
import { NextPage } from "next";

const Track: NextPage = () => {
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
              <img className="size-10 rounded-box" src="https://img.daisyui.com/images/profile/demo/1@94.webp" alt="" />
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
                  stroke-width="1.5"
                  stroke="currentColor"
                  className="size-6"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
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
            <p>123456789</p>
          </li>

          <div className="grid grid-cols-[48px_1fr] gap-4">
            {/* Dot */}
            <div className="relative flex">
              <div className="absolute z-10 left-[130px] -ml-[5px] w-[10px] h-[10px] rounded-full bg-white"></div>
            </div>

            {/* Graph item */}
            <div className="flex flex-col w-96">
              <div className="flex flex-row">
                <div className="border-dashed border-r-2 pr-6 flex">
                  <div>
                    <div className="flex flex-col gap-1 items-end justify-start h-full">
                      <p className="mb-0">27 Apr</p>
                      <p className="mt-0">12:54</p>
                    </div>
                  </div>
                </div>
                <div className="pl-8 flex justify-center">
                  <div>
                    <div className="flex flex-col gap-1 items-start justify-start h-full">
                      <p className="mb-0">Parcel has departed to hub ABC.</p>
                      <p className="mt-0 link text-secondary">Check Digital Signature</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-[48px_1fr] gap-4">
            {/* Dot */}
            <div className="relative flex">
              <div className="absolute z-10 left-[130px] -ml-[5px] w-[10px] h-[10px] rounded-full bg-white"></div>
            </div>

            {/* Create a table with 2 columns, first column for storing date and time; second columns for storing details, in between them need to have a border line */}
            <div className="flex flex-col w-96">
              <div className="flex flex-row">
                <div className="border-dashed border-r-2 pr-6 flex">
                  <div>
                    <div className="flex flex-col gap-1 items-end justify-start h-full">
                      <p className="mb-0">27 Apr</p>
                      <p className="mt-0">12:54</p>
                    </div>
                  </div>
                </div>
                <div className="pl-8 flex justify-center">
                  <div>
                    <div className="flex flex-col gap-1 items-start justify-start h-full">
                      <p className="mb-0">Parcel has departed to hub ABC.</p>
                      <p className="mt-0 link text-secondary">Check Digital Signature</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-[48px_1fr] gap-4">
            {/* Dot */}
            <div className="relative flex">
              <div className="absolute z-10 left-[130px] -ml-[5px] w-[10px] h-[10px] rounded-full bg-white"></div>
            </div>

            {/* Create a table with 2 columns, first column for storing date and time; second columns for storing details, in between them need to have a border line */}
            <div className="flex flex-col w-96">
              <div className="flex flex-row">
                <div className="border-dashed border-r-2 pr-6 flex">
                  <div>
                    <div className="flex flex-col gap-1 items-end justify-start h-full">
                      <p className="mb-0">27 Apr</p>
                      <p className="mt-0">12:54</p>
                    </div>
                  </div>
                </div>
                <div className="pl-8 flex justify-center">
                  <div>
                    <div className="flex flex-col gap-1 items-start justify-start h-full">
                      <p className="mb-0">Parcel has departed to hub ABC.</p>
                      <p className="mt-0 link text-secondary">Check Digital Signature</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </ul>
      </div>

      <div className="flex flex-row w-[40%] min-w-96 gap-4 justify-center mt-4">
        <button className="btn btn-error btn-disabled w-1/2">Cancel</button>
        <button className="btn btn-primary w-1/2">Confirm Delivery</button>
      </div>
    </div>
  );
};

export default Track;
