pragma solidity >=0.6.0 <0.9.0;

//SPDX-License-Identifier: MIT

// import "hardhat/console.sol";
//import "@openzeppelin/contracts/access/Ownable.sol"; //https://github.com/OpenZeppelin/openzeppelin-contracts/blob/master/contracts/access/Ownable.sol

contract TrustContract {
    // Joining network
    event JoinNetwork(address sender, string name);

    mapping(string => address) public name2address;
    mapping(address => string) public address2name;
    mapping(string => bool) public name2exists;
    mapping(address => bool) public address2exists;
    string[] public names;
    address[] public addresses;

    function getUserCount() public view returns (uint256 count) {
        return names.length;
    }

    function joinNetwork(string memory joinersName) public {
        require(!name2exists[joinersName], "name already exist");
        require(!address2exists[msg.sender], "already signed");
        names.push(joinersName);
        addresses.push(msg.sender);
        name2exists[joinersName] = true;
        name2address[joinersName] = msg.sender;
        address2exists[msg.sender] = true;
        address2balance[msg.sender] = 100;
        address2name[msg.sender] = joinersName;
        emit JoinNetwork(msg.sender, joinersName);
    }

    // Balances
    event Transfer(address indexed _from, address indexed _to, uint256 _value);

    mapping(address => uint256) public address2balance;

    function transfer(address _to, uint256 _value)
        public
        returns (bool success)
    {
        require(address2balance[msg.sender] >= _value, "not enough funds");
        require(address2exists[msg.sender], "user does not exist");
        address2balance[msg.sender] -= _value;
        address2balance[_to] += _value;
        emit Transfer(msg.sender, _to, _value); //solhint-disable-line indent, no-unused-vars
        return true;
    }

    function balanceOf(address _owner) public view returns (uint256 balance) {
        return address2balance[_owner];
    }

    // for testing purposes
    function transferFrom(
        address _from,
        address _to,
        uint256 _value
    ) public returns (bool success) {
        require(address2balance[_from] >= _value, "not enough funds");
        address2balance[_to] += _value;
        address2balance[_from] -= _value;
        emit Transfer(_from, _to, _value); //solhint-disable-line indent, no-unused-vars
        return true;
    }

    // Init
    string public name = "Trust Coin";
    uint8 public decimals = 3;
    string public symbol = "TRT";

    uint256 public totalSupply = 10000;
    uint256 public MIN_BANK = 1000;

    string public bank = "bank";

    constructor() {
        joinNetwork(bank);
        address2balance[msg.sender] = totalSupply;
    }
}
