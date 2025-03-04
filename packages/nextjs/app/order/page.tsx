import Image from "next/image";
import { NextPage } from "next";

const Order: NextPage = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      <h1 className="text-4xl font-bold">Order Page</h1>
      <p>Order your products here.</p>

      {/* Product card list */}
      <div className="flex flex-row gap-4">
        {/* Item 1 */}
        <div className="card bg-base-100 w-96 shadow-sm">
          <figure>
            <div className="relative w-full h-56">
              <Image fill src="https://img.daisyui.com/images/stock/photo-1606107557195-0e29a4b5b4aa.webp" alt="" />
            </div>
          </figure>
          <div className="card-body">
            <h2 className="card-title">
              Card Title
              <div className="badge badge-warning">NEW</div>
            </h2>
            <div className="card-details mb-4 gap-2">
              <p>A card component has a figure, a body part, and inside body there are title and actions parts</p>
              <div className="flex gap-3 justify-start">
                <div className="badge badge-outline p-3">Fashion</div>
                <div className="badge badge-outline p-3">Products</div>
              </div>
            </div>
            <p className="text-2xl font-semibold">RM 20.00</p>
            <div className="card-actions justify-end">
              <button className="btn btn-primary w-full rounded-md">Buy Now</button>
            </div>
          </div>
        </div>

        {/* Item 2 */}
        <div className="card bg-base-100 w-96 shadow-sm">
          <figure>
            <div className="relative w-full h-56">
              <Image fill src="https://img.daisyui.com/images/stock/photo-1606107557195-0e29a4b5b4aa.webp" alt="" />
            </div>
          </figure>
          <div className="card-body">
            <h2 className="card-title">
              Card Title
              <div className="badge badge-warning">NEW</div>
            </h2>
            <div className="card-details mb-4 gap-2">
              <p>A card component has a figure, a body part, and inside body there are title and actions parts</p>
              <div className="flex gap-3 justify-start">
                <div className="badge badge-outline p-3">Fashion</div>
                <div className="badge badge-outline p-3">Products</div>
              </div>
            </div>
            <p className="text-2xl font-semibold">RM 20.00</p>
            <div className="card-actions justify-end">
              <button className="btn btn-primary w-full rounded-md">Buy Now</button>
            </div>
          </div>
        </div>

        {/* Item 3 */}
        <div className="card bg-base-100 w-96 shadow-sm">
          <figure>
            <div className="relative w-full h-56">
              <Image fill src="https://img.daisyui.com/images/stock/photo-1606107557195-0e29a4b5b4aa.webp" alt="" />
            </div>
          </figure>
          <div className="card-body">
            <h2 className="card-title">
              Card Title
              <div className="badge badge-warning">NEW</div>
            </h2>
            <div className="card-details mb-4 gap-2">
              <p>A card component has a figure, a body part, and inside body there are title and actions parts</p>
              <div className="flex gap-3 justify-start">
                <div className="badge badge-outline p-3">Fashion</div>
                <div className="badge badge-outline p-3">Products</div>
              </div>
            </div>
            <p className="text-2xl font-semibold">RM 20.00</p>
            <div className="card-actions justify-end">
              <button className="btn btn-primary w-full rounded-md">Buy Now</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Order;
