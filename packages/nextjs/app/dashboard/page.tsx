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
                <th>123456789</th>
                <td>John</td>
                <td>
                  Parcel ABC <br />
                  <span className="badge badge-outline badge-warning badge-sm">Regional</span>
                </td>
                <td>123, Main Street, 1234 New York, United States</td>
                <th>
                  <div className="badge badge-soft badge-info badge-sm">Sent</div>
                </th>
              </tr>
              {/* row 2 */}
              <tr>
                <th>234567890</th>
                <td>Alice</td>
                <td>
                  Parcel ABC <br />
                  <span className="badge badge-outline badge-success badge-sm">International</span>
                </td>
                <td>234, Main Street, 1234 New York, United States</td>
                <th>
                  <div className="badge badge-soft badge-warning badge-sm">Pending</div>
                </th>
              </tr>
              {/* row 3 */}
              <tr>
                <th>987654321</th>
                <td>Jet</td>
                <td>
                  Parcel ABC <br />
                  <span className="badge badge-outline badge-warning badge-sm">Regional</span>
                </td>
                <td>345, Main Street, 1234 Bristol, United Kingdom</td>
                <th>
                  <div className="badge badge-soft badge-success badge-sm">Arrived</div>
                </th>
              </tr>
              {/* row 4 */}
              <tr>
                <th>098765432</th>
                <td>Dane</td>
                <td>
                  Parcel ABC <br />
                  <span className="badge badge-outline badge-success badge-sm">International</span>
                </td>
                <td>456, Main Street, 1234 New York, United States</td>
                <th>
                  <div className="badge badge-soft badge-error badge-sm">Cancelled</div>
                </th>
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
