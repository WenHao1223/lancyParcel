import { NextPage } from "next";

const OrderHistory: NextPage = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      <h1 className="text-4xl font-bold">Order History Page</h1>
      <p>View your order history here.</p>

      {/* Order history list */}
      <div className="flex flex-row w-[40%] gap-4">
        <ul className="list bg-base-100 rounded-box w-full shadow-md">
          <li className="p-4 pb-2 text-xs opacity-60 tracking-wide">Order History</li>

          <li className="list-row">
            <div>
              <img className="size-10 rounded-box" src="https://img.daisyui.com/images/profile/demo/1@94.webp" />
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
            <button className="btn btn-square btn-ghost">
              <div className="tooltip" data-tip="Track delivery">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke-width="1.5"
                  stroke="currentColor"
                  className="size-6"
                >
                  <path stroke-linecap="round" stroke-linejoin="round" d="M15 10.5a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1 1 15 0Z"
                  />
                </svg>
              </div>
            </button>
          </li>

          <li className="list-row">
            <div>
              <img className="size-10 rounded-box" src="https://img.daisyui.com/images/profile/demo/1@94.webp" />
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
            <button className="btn btn-square btn-ghost">
              <div className="tooltip" data-tip="Track delivery">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke-width="1.5"
                  stroke="currentColor"
                  className="size-6"
                >
                  <path stroke-linecap="round" stroke-linejoin="round" d="M15 10.5a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
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
