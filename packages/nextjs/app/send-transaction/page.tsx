import Image from "next/image";
import { NextPage } from "next";

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

const SendTransaction: NextPage = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      <h1 className="text-4xl font-bold">Send Parcel Page</h1>
      <p>Send your parcel here.</p>

      {/* Ordered Item detail */}
      <div className="flex flex-col w-[40%] min-w-96 gap-4 mb-4">
        <ul className="list bg-base-100 rounded-box w-full shadow-md">
          <li className="p-4 pb-2 text-xs opacity-60 tracking-wide">Ordered Item</li>

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

        <div className="divider" />

        <div className="card bg-base-100 w-full shadow-sm p-4">
          <div className="flex flex-row justify-between items-center">
            <p className="font-semibold">Tracking Number</p>
            <p>123456789</p>
          </div>
          <div className="flex flex-row justify-between items-center">
            <p className="font-semibold">Ordered Time</p>
            <p>2025-03-01 17:00:00</p>
          </div>
          <div className="flex flex-row justify-between items-center">
            <p className="font-semibold">Last Dispatched Time</p>
            <p>2025-03-01 19:00:00</p>
          </div>
          <div className="flex flex-row justify-between items-center">
            <p className="font-semibold">Delivery Time</p>
            <p>2025-03-02 17:00:00</p>
          </div>
        </div>
      </div>

      <div className="flex flex-row w-[40%] min-w-96 gap-4 justify-center mt-4">
        <button className="btn btn-error btn-disabled w-1/2">Cancel</button>
        <button className="btn btn-primary w-1/2">Place Digital Signature</button>
      </div>
    </div>
  );
};

export default SendTransaction;
