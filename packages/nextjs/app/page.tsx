"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import type { NextPage } from "next";
import { useAccount } from "wagmi";
// import { BugAntIcon, MagnifyingGlassIcon } from "@heroicons/react/24/outline";
import { Address } from "~~/components/scaffold-eth";
import parcelHubJSON from "~~/data/parcelHub.json";
//BLOCKCHAIN
import { useScaffoldContract } from "~~/hooks/scaffold-eth";
import { useScaffoldReadContract } from "~~/hooks/scaffold-eth";
import { EmployeeWithoutPasswordInterface, ParcelHubInterface } from "~~/interfaces/GeneralInterface";

const Home: NextPage = () => {
  const { address: connectedAddress } = useAccount();

  //BLOCKCHAIN
  const { data: deployedContractData } = useScaffoldContract({
    contractName: "YourContract",
  });

  const [loginData, setLoginData] = useState<EmployeeWithoutPasswordInterface | null>(null);
  const [parcelHubData, setParcelHubData] = useState<ParcelHubInterface | null>(null);
  const [isLogin, setIsLogin] = useState<null | boolean>(null);

  // const handleClick = async () => {
  //   if (connectedAddress) {
  //     alert(`Connected Address: ${connectedAddress}`);
  //   } else {
  //     alert("⚠️ No wallet connected.");
  //   }
  // };
  //BLOCKCHAIN

  // if local storage has user
  // decode user
  // save it to loginData variable

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

  const handleLogout = () => {
    localStorage.removeItem("loginData");
    setIsLogin(false);
    window.location.href = "/";
  };

  const ContractReadMethods = () => {
    const { data: sayHelloData, isLoading } = useScaffoldReadContract({
      contractName: "YourContract",
      functionName: "sayHello",
    });

    if (isLoading) {
      return <p>Loading sayHello...</p>;
    }

    return <h2>{sayHelloData || "No data"}</h2>;
  };

  return (
    <>
      <div className="flex items-center flex-col flex-grow pt-10">
        <div className="px-5">
          <h1 className="text-center">
            <span className="block text-2xl mb-2">Welcome to</span>
            <span className="block text-4xl font-bold">Scaffold-ETH 2</span>
          </h1>
          <div className="flex justify-center items-center space-x-2 flex-col sm:flex-row">
            <p className="my-2 font-medium">Connected Address:</p>
            <Address address={connectedAddress} />
          </div>

          {/* <p className="text-center text-lg">
            Get started by editing{" "}
            <code className="italic bg-base-300 text-base font-bold max-w-full break-words break-all inline-block">
              packages/nextjs/app/page.tsx
            </code>
          </p>
          <p className="text-center text-lg">
            Edit your smart contract{" "}
            <code className="italic bg-base-300 text-base font-bold max-w-full break-words break-all inline-block">
              YourContract.sol
            </code>{" "}
            in{" "}
            <code className="italic bg-base-300 text-base font-bold max-w-full break-words break-all inline-block">
              packages/hardhat/contracts
            </code>
          </p> */}
        </div>

        <div className="flex-grow bg-base-300 w-full mt-16 px-8 py-12">
          {/* <div className="flex justify-center items-center gap-12 flex-col sm:flex-row">
            <div className="flex flex-col bg-base-100 px-10 py-10 text-center items-center max-w-xs rounded-3xl">
              <BugAntIcon className="h-8 w-8 fill-secondary" />
              <p>
                Tinker with your smart contract using the{" "}
                <Link href="/debug" passHref className="link">
                  Debug Contracts
                </Link>{" "}
                tab.
              </p>
            </div>
            <div className="flex flex-col bg-base-100 px-10 py-10 text-center items-center max-w-xs rounded-3xl">
              <MagnifyingGlassIcon className="h-8 w-8 fill-secondary" />
              <p>
                Explore your local transactions with the{" "}
                <Link href="/blockexplorer" passHref className="link">
                  Block Explorer
                </Link>{" "}
                tab.
              </p>
            </div>
          </div> */}

          <div className="flex flex-col justify-center items-center w-full">
            <div className="w-[40%]">
              {isLogin == true ? (
                <>
                  {/* Parcel Hub detail */}
                  <div className="flex flex-row gap-4 mb-6">
                    {typeof loginData === "object" && loginData !== null && (
                      <ul className="list bg-base-100 rounded-box w-full shadow-md">
                        <li className="p-4 pt-2 pb-0 tracking-wide border-b-2 border-gray-400 flex flex-row justify-between items-center">
                          <p>{loginData.employee_id}</p>
                          <p>{loginData.email}</p>
                        </li>
                        <div className="card bg-base-100 w-full shadow-sm opacity-65 p-4">
                          {parcelHubData ? (
                            <>
                              <div className="flex flex-row justify-between items-center">
                                <p className="font-semibold">Parcel Hub ID</p>
                                <p>{parcelHubData.parcel_hub_id}</p>
                              </div>
                              <div className="flex flex-row justify-between items-center">
                                <p className="font-semibold">Parcel Hub Name</p>
                                <p>{parcelHubData.parcel_hub_name}</p>
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
                            </>
                          ) : (
                            <div className="flex flex-row justify-between items-center">
                              <p>Parcel Hub Data Not Found</p>
                            </div>
                          )}
                        </div>
                      </ul>
                    )}
                  </div>
                  <button className="btn btn-primary w-full" onClick={handleLogout}>
                    Logout
                  </button>
                </>
              ) : isLogin == false ? (
                <>
                  <p className="py-6 px-4 list bg-base-100 rounded-box w-full shadow-md">Please login first.</p>
                  <button className="btn btn-primary mt-4 w-full">
                    <Link href="/login" className="link no-underline">
                      Login
                    </Link>
                  </button>
                </>
              ) : (
                <>
                  <p className="py-6 px-4 list bg-base-100 rounded-box w-full shadow-md">Loading ...</p>
                </>
              )}
            </div>
          </div>
          <div className="flex flex-col gap-2 mt-12">
            <div className="flex justify-start items-center gap-2 flex-col sm:flex-row">
              <h2>User</h2>
              <button className="btn">
                <Link href="/order">Order Page</Link>
              </button>
              <button className="btn">
                <Link href="/order-history">Order History Page</Link>
              </button>
              <button className="btn">
                <Link href="/track">Tracking Page</Link>
              </button>
              <button className="btn">
                <Link href="/receive-delivery">Receive Delivery Page</Link>
              </button>
            </div>

            <div className="flex justify-start items-center gap-2 flex-col sm:flex-row">
              <h2>Warehouse Employee</h2>
              <button className="btn">
                <Link href="/dispatch-parcel">Send Transaction Page</Link>
              </button>
            </div>

            <div className="flex justify-start items-center gap-2 flex-col sm:flex-row">
              <h2>Parcel Hub Employee</h2>
              <button className="btn">
                <Link href="/dashboard">Parcel Dashboard Page</Link>
              </button>
              <button className="btn">
                <Link href="/dispatch-parcel">Dispatch Parcel Page</Link>
              </button>
            </div>

            {/* Blockchain testing*/}
            <div className="flex justify-start items-center gap-2 flex-col sm:flex-row">
              <button className="btn" /*onClick={handleClick}*/>
                <Link href="/parcel_template">Block Chain</Link>
              </button>
              {deployedContractData ? <ContractReadMethods /> : <p>Loading contract data...</p>}
            </div>

            {/* Algo testing*/}
            <div className="flex justify-start items-center gap-2 flex-col sm:flex-row">
              <h2>Algo Test</h2>
              <button className="btn">
                <Link href="/algo-test">Algo Test</Link>
              </button>
            </div>

            {/* Test fetch API */}
            <div className="flex justify-start items-center gap-2 flex-col sm:flex-row">
              <h2>Test Fetch API</h2>
              <button className="btn">
                <Link href="/test-json">Test Fetch API</Link>
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Home;
