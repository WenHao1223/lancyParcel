import { NextPage } from "next";

const Dashboard: NextPage = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      <h1 className="text-4xl font-bold">Dashboard</h1>
      <p>Check parcel status here.</p>

      {/* Parcel Hub detail */}
      <div className="flex flex-row w-[60%] gap-4 mb-6">
        <ul className="list bg-base-100 rounded-box w-full shadow-md">
          <li className="p-4 pb-0 text-md tracking-wide border-b-2 border-gray-400">
            <p>Parcel ABC</p>
          </li>
          <div className="card bg-base-100 w-full shadow-sm opacity-65 p-4">
            <div className="flex flex-row justify-between items-center">
              <p className="font-semibold">Parcel Hub ID</p>
              <p>Hub#23456</p>
            </div>
            <div className="flex flex-row justify-between items-center">
              <p className="font-semibold">Parcel Hub Address</p>
              <p>23, Main Street, New York</p>
            </div>
            <div className="flex flex-row justify-between items-center">
              <p className="font-semibold">Operating Level</p>
              <p>
                <span className="badge badge-outline badge-info badge-sm">National</span>
              </p>
            </div>
          </div>
        </ul>
      </div>

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
              {/* row 1 */}
              <tr>
                <td>123456789</td>
                <td className="link hover:text-secondary">Doe</td>
                <td className="link hover:text-secondary">John</td>
                <td>
                  Parcel ABC <br />
                  <span className="badge badge-outline badge-warning badge-sm">Regional</span>
                </td>
                <td>123, Main Street, 1234 New York, United States</td>
                <td>
                  <div className="badge badge-soft badge-info badge-sm">Sent</div>
                </td>
                <td>
                  <div className="list-row">
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
                          <path
                            stroke-linecap="round"
                            stroke-linejoin="round"
                            d="M15 10.5a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z"
                          />
                          <path
                            stroke-linecap="round"
                            stroke-linejoin="round"
                            d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1 1 15 0Z"
                          />
                        </svg>
                      </div>
                    </button>
                  </div>
                </td>
              </tr>
              {/* row 2 */}
              <tr>
                <td>234567890</td>
                <td className="link hover:text-secondary">Bob</td>
                <td className="link hover:text-secondary">Alice</td>
                <td>
                  Parcel ABC <br />
                  <span className="badge badge-outline badge-success badge-sm">International</span>
                </td>
                <td>234, Main Street, 1234 New York, United States</td>
                <td>
                  <div className="badge badge-soft badge-warning badge-sm">Pending</div>
                </td>
                <td>
                  <div className="list-row">
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
                          <path
                            stroke-linecap="round"
                            stroke-linejoin="round"
                            d="M15 10.5a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z"
                          />
                          <path
                            stroke-linecap="round"
                            stroke-linejoin="round"
                            d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1 1 15 0Z"
                          />
                        </svg>
                      </div>
                    </button>
                    <button className="btn btn-square btn-ghost">
                      <div className="tooltip" data-tip="Send product">
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
                            d="M6 12 3.269 3.125A59.769 59.769 0 0 1 21.485 12 59.768 59.768 0 0 1 3.27 20.875L5.999 12Zm0 0h7.5"
                          />
                        </svg>
                      </div>
                    </button>
                  </div>
                </td>
              </tr>
              {/* row 3 */}
              <tr>
                <td>987654321</td>
                <td className="link hover:text-secondary">Jet</td>
                <td className="link hover:text-secondary">Charles</td>
                <td>
                  Parcel ABC <br />
                  <span className="badge badge-outline badge-warning badge-sm">Regional</span>
                </td>
                <td>345, Main Street, 1234 Bristol, United Kingdom</td>
                <td>
                  <div className="badge badge-soft badge-success badge-sm">Arrived</div>
                </td>
                <td>
                  <div className="list-row">
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
                          <path
                            stroke-linecap="round"
                            stroke-linejoin="round"
                            d="M15 10.5a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z"
                          />
                          <path
                            stroke-linecap="round"
                            stroke-linejoin="round"
                            d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1 1 15 0Z"
                          />
                        </svg>
                      </div>
                    </button>
                  </div>
                </td>
              </tr>
              {/* row 4 */}
              <tr>
                <td>098765432</td>
                <td className="link hover:text-secondary">Dane</td>
                <td className="link hover:text-secondary">John</td>
                <td>
                  Parcel ABC <br />
                  <span className="badge badge-outline badge-success badge-sm">International</span>
                </td>
                <td>456, Main Street, 1234 New York, United States</td>
                <td>
                  <div className="badge badge-soft badge-error badge-sm">Cancelled</div>
                </td>
                <td>
                  <div className="list-row">
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
                          <path
                            stroke-linecap="round"
                            stroke-linejoin="round"
                            d="M15 10.5a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z"
                          />
                          <path
                            stroke-linecap="round"
                            stroke-linejoin="round"
                            d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1 1 15 0Z"
                          />
                        </svg>
                      </div>
                    </button>
                  </div>
                </td>
              </tr>
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
