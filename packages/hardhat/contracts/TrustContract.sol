pragma solidity >=0.6.0 <0.9.0;

//SPDX-License-Identifier: MIT

// import "hardhat/console.sol";
//import "@openzeppelin/contracts/access/Ownable.sol"; //https://github.com/OpenZeppelin/openzeppelin-contracts/blob/master/contracts/access/Ownable.sol

contract TrustContract {
    constructor() {}

    // Joining network
    event JoinNetwork(address sender, string name);

    mapping(string => address) public name2address;
    mapping(string => bool) public name2exists;
    mapping(address => bool) public address2exists;
    string[] public names;

    function getUserCount() public view returns (uint256 count) {
        return names.length;
    }

    function joinNetwork(string memory name) public {
        require(!name2exists[name], "name already exist");
        require(!address2exists[msg.sender], "already signed");
        names.push(name);
        name2exists[name] = true;
        name2address[name] = msg.sender;
        emit JoinNetwork(msg.sender, name);
    }
}
