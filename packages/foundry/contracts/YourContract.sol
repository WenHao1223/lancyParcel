//SPDX-License-Identifier: MIT
pragma solidity >=0.8.0 <0.9.0;

// Useful for debugging. Remove when deploying to a live network.
import "forge-std/console.sol";

// Use openzeppelin to inherit battle-tested implementations (ERC20, ERC721, etc)
// import "@openzeppelin/contracts/access/Ownable.sol";

/**
 * A smart contract that allows changing a state variable of the contract and tracking the changes
 * It also allows the owner to withdraw the Ether in the contract
 * @author BuidlGuidl
 */
contract YourContract {
    // State Variables
    address public immutable owner;
    string public greeting = "Building Unstoppable Apps!!!";
    bool public premium = false;
    uint256 public totalCounter = 0;
    mapping(address => uint256) public userGreetingCounter;

    // Events: a way to emit log statements from smart contract that can be listened to by external parties
    event GreetingChange(address indexed greetingSetter, string newGreeting, bool premium, uint256 value);

    // Constructor: Called once on contract deployment
    // Check packages/foundry/deploy/Deploy.s.sol
    constructor(address _owner) {
        owner = _owner;
    }

    // Modifier: used to define a set of rules that must be met before or after a function is executed
    // Check the withdraw() function
    modifier isOwner() {
        // msg.sender: predefined variable that represents address of the account that called the current function
        require(msg.sender == owner, "Not the Owner");
        _;
    }

    /**
     * Function that allows anyone to change the state variable "greeting" of the contract and increase the counters
     *
     * @param _newGreeting (string memory) - new greeting to save on the contract
     */
    function setGreeting(string memory _newGreeting) public payable {
        // Print data to the anvil chain console. Remove when deploying to a live network.

        console.logString("Setting new greeting");
        console.logString(_newGreeting);

        greeting = _newGreeting;
        totalCounter += 1;
        userGreetingCounter[msg.sender] += 1;

        // msg.value: built-in global variable that represents the amount of ether sent with the transaction
        if (msg.value > 0) {
            premium = true;
        } else {
            premium = false;
        }

        // emit: keyword used to trigger an event
        emit GreetingChange(msg.sender, _newGreeting, msg.value > 0, msg.value);
    }

    /**
     * Function that allows the owner to withdraw all the Ether in the contract
     * The function can only be called by the owner of the contract as defined by the isOwner modifier
     */
    function withdraw() public isOwner {
        (bool success,) = owner.call{ value: address(this).balance }("");
        require(success, "Failed to send Ether");
    }

    /**
     * Function that allows the contract to receive ETH
     */
    receive() external payable { }


    //ADD HERE
    function sayHello() public pure returns (string memory) {
        return "Hello from contract!";
    }


    //Signature Hashing
    mapping(address => bytes32) public hashedAddresses;

    event AddressHashed(address indexed user, bytes32 hashedValue);

    function hashAddress(address userAddress) public {
        bytes32 hashed = keccak256(abi.encodePacked(userAddress));
        hashedAddresses[userAddress] = hashed;

        emit AddressHashed(userAddress, hashed);
    }

    function getHashedAddress(address userAddress) public view returns (bytes32) {
        return hashedAddresses[userAddress];
    }

    //Parcel
    struct Parcel {
        string trackingNumber;
        string dispatchTime;
        string localHubId;
        string sender;
        string employee;
    }

    mapping(bytes32 => Parcel) public parcels; // Store hashed parcel data

    event ParcelHashed(bytes32 hash, string trackingNumber);

    function hashParcelData(
        string memory trackingNumber,
        string memory dispatchTime,
        string memory localHubId,
        string memory sender,
        string memory employee
    ) public returns (bytes32) {
        bytes32 hash = keccak256(
            abi.encodePacked(trackingNumber, dispatchTime, localHubId, sender, employee)
        );

        parcels[hash] = Parcel(trackingNumber, dispatchTime, localHubId, sender, employee);

        emit ParcelHashed(hash, trackingNumber);
        return hash;
    }

    //Send
    struct Send {
        string trackingNumber;
        string dispatchTime;
        string hubId;
        string employee;
    }

    mapping(bytes32 => Send) public sends; // Store hashed parcel data

    event SendHashed(bytes32 hash, string trackingNumber);

    function hashSendData(
        string memory trackingNumber,
        string memory dispatchTime,
        string memory hubId,
        string memory employee
    ) public returns (bytes32) {
        bytes32 hash = keccak256(
            abi.encodePacked(trackingNumber, dispatchTime, hubId, employee)
        );

        sends[hash] = Send(trackingNumber, dispatchTime, hubId, employee);

        emit SendHashed(hash, trackingNumber);
        return hash;
    }

    //Receive
    struct Receive {
        string trackingNumber;
        string receiveTime;
        string hubId;
        string employee;
    }

    mapping(bytes32 => Receive) public receives; // Store hashed parcel data

    event ReceiveHashed(bytes32 hash, string trackingNumber);

    function hashReceiveData(
        string memory trackingNumber,
        string memory receiveTime,
        string memory hubId,
        string memory employee
    ) public returns (bytes32) {
        bytes32 hash = keccak256(
            abi.encodePacked(trackingNumber, receiveTime, hubId, employee)
        );

        receives[hash] = Receive(trackingNumber, receiveTime, hubId, employee);

        emit ReceiveHashed(hash, trackingNumber);
        return hash;
    }

    //Confirm
    struct Confirm {
        string trackingNumber;
        string receiveTime;
        string customer;
    }

    mapping(bytes32 => Confirm) public confirms; // Store hashed parcel data

    event ConfirmHashed(bytes32 hash, string trackingNumber);

    function hashConfirmData(
        string memory trackingNumber,
        string memory receiveTime,
        string memory customer
    ) public returns (bytes32) {
        bytes32 hash = keccak256(
            abi.encodePacked(trackingNumber, receiveTime, customer)
        );

        confirms[hash] = Confirm(trackingNumber, receiveTime, customer);

        emit ConfirmHashed(hash, trackingNumber);
        return hash;
    }
}
