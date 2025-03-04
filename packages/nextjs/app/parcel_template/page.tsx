import { NextPage } from "next";

const ParcelTemplate: NextPage = () => {
    return (
    <div>
      <h6>Parcel Template</h6>
      <button className="btn">Create Parcel</button>
      <button className="btn">Send Parcel</button>
      <button className="btn">Receive Parcel</button>
      <button className="btn">Show Parcel</button>
    </div>

      );
};

export default ParcelTemplate;
