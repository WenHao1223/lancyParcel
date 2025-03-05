/**
 * This file is autogenerated by Scaffold-ETH.
 * You should not edit it manually or your changes might be overwritten.
 */
import { GenericContractsDeclaration } from "~~/utils/scaffold-eth/contract";

const deployedContracts = {
  31337: {
    YourContract: {
      address: "0x700b6a60ce7eaaea56f065753d8dcb9653dbad35",
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
          name: "getParcel",
          inputs: [
            {
              name: "_trackingNumber",
              type: "string",
              internalType: "string",
            },
          ],
          outputs: [
            {
              name: "",
              type: "tuple",
              internalType: "struct YourContract.Parcel",
              components: [
                {
                  name: "TrackingNumber",
                  type: "string",
                  internalType: "string",
                },
                {
                  name: "sends",
                  type: "tuple[]",
                  internalType: "struct YourContract.Send[]",
                  components: [
                    {
                      name: "TrackingNumber",
                      type: "string",
                      internalType: "string",
                    },
                    {
                      name: "OutofDelTime",
                      type: "uint256",
                      internalType: "uint256",
                    },
                    {
                      name: "Sender_ID",
                      type: "address",
                      internalType: "address",
                    },
                    {
                      name: "Employee_ID",
                      type: "address",
                      internalType: "address",
                    },
                    {
                      name: "Emp_Sign",
                      type: "bytes",
                      internalType: "bytes",
                    },
                    {
                      name: "status",
                      type: "uint8",
                      internalType: "enum YourContract.Status",
                    },
                    {
                      name: "stage",
                      type: "uint256",
                      internalType: "uint256",
                    },
                  ],
                },
                {
                  name: "receives",
                  type: "tuple[]",
                  internalType: "struct YourContract.Receive[]",
                  components: [
                    {
                      name: "TrackingNumber",
                      type: "string",
                      internalType: "string",
                    },
                    {
                      name: "ReceivedTimes",
                      type: "uint256",
                      internalType: "uint256",
                    },
                    {
                      name: "Receiver_ID",
                      type: "address",
                      internalType: "address",
                    },
                    {
                      name: "Employee_ID",
                      type: "address",
                      internalType: "address",
                    },
                    {
                      name: "Emp_Sign",
                      type: "bytes",
                      internalType: "bytes",
                    },
                    {
                      name: "status",
                      type: "uint8",
                      internalType: "enum YourContract.Status",
                    },
                    {
                      name: "stage",
                      type: "uint256",
                      internalType: "uint256",
                    },
                  ],
                },
                {
                  name: "status",
                  type: "uint8",
                  internalType: "enum YourContract.Status",
                },
              ],
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
              type: "string",
              internalType: "string",
            },
          ],
          outputs: [
            {
              name: "TrackingNumber",
              type: "string",
              internalType: "string",
            },
            {
              name: "status",
              type: "uint8",
              internalType: "enum YourContract.Status",
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
      ],
      inheritedFunctions: {},
      deploymentFile: "run-1741170864.json",
      deploymentScript: "Deploy.s.sol",
    },
  },
} as const;

export default deployedContracts satisfies GenericContractsDeclaration;
