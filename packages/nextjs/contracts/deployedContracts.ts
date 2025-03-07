/**
 * This file is autogenerated by Scaffold-ETH.
 * You should not edit it manually or your changes might be overwritten.
 */
import { GenericContractsDeclaration } from "~~/utils/scaffold-eth/contract";

const deployedContracts = {
  534351: {
    YourContract: {
      address: "0x1dE55945e2c86F766613D55784b73F3dDCb2901B",
      abi: [
        {
          type: "constructor",
          inputs: [
            {
              name: "_owner",
              type: "address",
              internalType: "address",
            },
          ],
          stateMutability: "nonpayable",
        },
        {
          type: "receive",
          stateMutability: "payable",
        },
        {
          type: "function",
          name: "confirms",
          inputs: [
            {
              name: "",
              type: "bytes32",
              internalType: "bytes32",
            },
          ],
          outputs: [
            {
              name: "trackingNumber",
              type: "string",
              internalType: "string",
            },
            {
              name: "receiveTime",
              type: "string",
              internalType: "string",
            },
            {
              name: "customer",
              type: "string",
              internalType: "string",
            },
          ],
          stateMutability: "view",
        },
        {
          type: "function",
          name: "getHashedAddress",
          inputs: [
            {
              name: "userAddress",
              type: "address",
              internalType: "address",
            },
          ],
          outputs: [
            {
              name: "",
              type: "bytes32",
              internalType: "bytes32",
            },
          ],
          stateMutability: "view",
        },
        {
          type: "function",
          name: "greeting",
          inputs: [],
          outputs: [
            {
              name: "",
              type: "string",
              internalType: "string",
            },
          ],
          stateMutability: "view",
        },
        {
          type: "function",
          name: "hashAddress",
          inputs: [
            {
              name: "userAddress",
              type: "address",
              internalType: "address",
            },
          ],
          outputs: [],
          stateMutability: "nonpayable",
        },
        {
          type: "function",
          name: "hashConfirmData",
          inputs: [
            {
              name: "trackingNumber",
              type: "string",
              internalType: "string",
            },
            {
              name: "receiveTime",
              type: "string",
              internalType: "string",
            },
            {
              name: "customer",
              type: "string",
              internalType: "string",
            },
          ],
          outputs: [
            {
              name: "",
              type: "bytes32",
              internalType: "bytes32",
            },
          ],
          stateMutability: "nonpayable",
        },
        {
          type: "function",
          name: "hashParcelData",
          inputs: [
            {
              name: "trackingNumber",
              type: "string",
              internalType: "string",
            },
            {
              name: "dispatchTime",
              type: "string",
              internalType: "string",
            },
            {
              name: "localHubId",
              type: "string",
              internalType: "string",
            },
            {
              name: "sender",
              type: "string",
              internalType: "string",
            },
            {
              name: "employee",
              type: "string",
              internalType: "string",
            },
          ],
          outputs: [
            {
              name: "",
              type: "bytes32",
              internalType: "bytes32",
            },
          ],
          stateMutability: "nonpayable",
        },
        {
          type: "function",
          name: "hashReceiveData",
          inputs: [
            {
              name: "trackingNumber",
              type: "string",
              internalType: "string",
            },
            {
              name: "receiveTime",
              type: "string",
              internalType: "string",
            },
            {
              name: "hubId",
              type: "string",
              internalType: "string",
            },
            {
              name: "employee",
              type: "string",
              internalType: "string",
            },
          ],
          outputs: [
            {
              name: "",
              type: "bytes32",
              internalType: "bytes32",
            },
          ],
          stateMutability: "nonpayable",
        },
        {
          type: "function",
          name: "hashSendData",
          inputs: [
            {
              name: "trackingNumber",
              type: "string",
              internalType: "string",
            },
            {
              name: "dispatchTime",
              type: "string",
              internalType: "string",
            },
            {
              name: "hubId",
              type: "string",
              internalType: "string",
            },
            {
              name: "employee",
              type: "string",
              internalType: "string",
            },
          ],
          outputs: [
            {
              name: "",
              type: "bytes32",
              internalType: "bytes32",
            },
          ],
          stateMutability: "nonpayable",
        },
        {
          type: "function",
          name: "hashedAddresses",
          inputs: [
            {
              name: "",
              type: "address",
              internalType: "address",
            },
          ],
          outputs: [
            {
              name: "",
              type: "bytes32",
              internalType: "bytes32",
            },
          ],
          stateMutability: "view",
        },
        {
          type: "function",
          name: "owner",
          inputs: [],
          outputs: [
            {
              name: "",
              type: "address",
              internalType: "address",
            },
          ],
          stateMutability: "view",
        },
        {
          type: "function",
          name: "parcels",
          inputs: [
            {
              name: "",
              type: "bytes32",
              internalType: "bytes32",
            },
          ],
          outputs: [
            {
              name: "trackingNumber",
              type: "string",
              internalType: "string",
            },
            {
              name: "dispatchTime",
              type: "string",
              internalType: "string",
            },
            {
              name: "localHubId",
              type: "string",
              internalType: "string",
            },
            {
              name: "sender",
              type: "string",
              internalType: "string",
            },
            {
              name: "employee",
              type: "string",
              internalType: "string",
            },
          ],
          stateMutability: "view",
        },
        {
          type: "function",
          name: "premium",
          inputs: [],
          outputs: [
            {
              name: "",
              type: "bool",
              internalType: "bool",
            },
          ],
          stateMutability: "view",
        },
        {
          type: "function",
          name: "receives",
          inputs: [
            {
              name: "",
              type: "bytes32",
              internalType: "bytes32",
            },
          ],
          outputs: [
            {
              name: "trackingNumber",
              type: "string",
              internalType: "string",
            },
            {
              name: "receiveTime",
              type: "string",
              internalType: "string",
            },
            {
              name: "hubId",
              type: "string",
              internalType: "string",
            },
            {
              name: "employee",
              type: "string",
              internalType: "string",
            },
          ],
          stateMutability: "view",
        },
        {
          type: "function",
          name: "sayHello",
          inputs: [],
          outputs: [
            {
              name: "",
              type: "string",
              internalType: "string",
            },
          ],
          stateMutability: "pure",
        },
        {
          type: "function",
          name: "sends",
          inputs: [
            {
              name: "",
              type: "bytes32",
              internalType: "bytes32",
            },
          ],
          outputs: [
            {
              name: "trackingNumber",
              type: "string",
              internalType: "string",
            },
            {
              name: "dispatchTime",
              type: "string",
              internalType: "string",
            },
            {
              name: "hubId",
              type: "string",
              internalType: "string",
            },
            {
              name: "employee",
              type: "string",
              internalType: "string",
            },
          ],
          stateMutability: "view",
        },
        {
          type: "function",
          name: "setGreeting",
          inputs: [
            {
              name: "_newGreeting",
              type: "string",
              internalType: "string",
            },
          ],
          outputs: [],
          stateMutability: "payable",
        },
        {
          type: "function",
          name: "totalCounter",
          inputs: [],
          outputs: [
            {
              name: "",
              type: "uint256",
              internalType: "uint256",
            },
          ],
          stateMutability: "view",
        },
        {
          type: "function",
          name: "userGreetingCounter",
          inputs: [
            {
              name: "",
              type: "address",
              internalType: "address",
            },
          ],
          outputs: [
            {
              name: "",
              type: "uint256",
              internalType: "uint256",
            },
          ],
          stateMutability: "view",
        },
        {
          type: "function",
          name: "withdraw",
          inputs: [],
          outputs: [],
          stateMutability: "nonpayable",
        },
        {
          type: "event",
          name: "AddressHashed",
          inputs: [
            {
              name: "user",
              type: "address",
              indexed: true,
              internalType: "address",
            },
            {
              name: "hashedValue",
              type: "bytes32",
              indexed: false,
              internalType: "bytes32",
            },
          ],
          anonymous: false,
        },
        {
          type: "event",
          name: "ConfirmHashed",
          inputs: [
            {
              name: "hash",
              type: "bytes32",
              indexed: false,
              internalType: "bytes32",
            },
            {
              name: "trackingNumber",
              type: "string",
              indexed: false,
              internalType: "string",
            },
          ],
          anonymous: false,
        },
        {
          type: "event",
          name: "GreetingChange",
          inputs: [
            {
              name: "greetingSetter",
              type: "address",
              indexed: true,
              internalType: "address",
            },
            {
              name: "newGreeting",
              type: "string",
              indexed: false,
              internalType: "string",
            },
            {
              name: "premium",
              type: "bool",
              indexed: false,
              internalType: "bool",
            },
            {
              name: "value",
              type: "uint256",
              indexed: false,
              internalType: "uint256",
            },
          ],
          anonymous: false,
        },
        {
          type: "event",
          name: "ParcelHashed",
          inputs: [
            {
              name: "hash",
              type: "bytes32",
              indexed: false,
              internalType: "bytes32",
            },
            {
              name: "trackingNumber",
              type: "string",
              indexed: false,
              internalType: "string",
            },
          ],
          anonymous: false,
        },
        {
          type: "event",
          name: "ReceiveHashed",
          inputs: [
            {
              name: "hash",
              type: "bytes32",
              indexed: false,
              internalType: "bytes32",
            },
            {
              name: "trackingNumber",
              type: "string",
              indexed: false,
              internalType: "string",
            },
          ],
          anonymous: false,
        },
        {
          type: "event",
          name: "SendHashed",
          inputs: [
            {
              name: "hash",
              type: "bytes32",
              indexed: false,
              internalType: "bytes32",
            },
            {
              name: "trackingNumber",
              type: "string",
              indexed: false,
              internalType: "string",
            },
          ],
          anonymous: false,
        },
      ],
      inheritedFunctions: {},
      deploymentFile: "run-1741362800.json",

      deploymentScript: "Deploy.s.sol",
    },
  },
} as const;

export default deployedContracts satisfies GenericContractsDeclaration;
