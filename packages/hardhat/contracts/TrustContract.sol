pragma solidity >=0.6.0 <0.9.0;
pragma abicoder v2;

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
        address2contractcount[msg.sender] = 0;
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
    struct Info {
        string bank;
        uint256 MIN_BANK;
        uint256 totalSupply;
        string symbol;
        uint8 decimals;
        string name;
    }
    Info info =
        Info({
            name: "Trust Coin",
            decimals: 3,
            symbol: "TRT",
            totalSupply: 10000,
            MIN_BANK: 1000,
            bank: "bank"
        });

    constructor() {
        joinNetwork(info.bank);
        address2balance[msg.sender] = info.totalSupply;
    }

    // Trust Contracts
    struct Creator {
        address _address;
        uint256 oldBalance;
        int256 balanceChange;
        bool toSteal;
    }
    struct Acceptor {
        address _address;
        uint256 oldBalance;
        int256 balanceChange;
        bool toSteal;
        bytes32 actionHash;
    }
    struct TContract {
        uint256 id;
        // participants & value
        Creator creator;
        Acceptor acceptor;
        uint256 value;
        // other
        bool exists;
        uint step;
    }
    event ContractUpdate(
        uint256 id,
        // participants & values
        address creator,
        address acceptor,
        uint256 value,
        uint256 creatorOldBalance,
        uint256 acceptorOldBalance,
        int256 creatorBalanceChange,
        int256 acceptorBalanceChange,
        // actions
        bytes32 acceptorActionHash,
        bool acceptorToSteal,
        bool creatorToSteal,
        // other
        uint step
    );

    function emitContractUpdate(TContract memory c) private {
        emit ContractUpdate({
            id: c.id,
            // participants & values
            creator: c.creator._address,
            acceptor: c.acceptor._address,
            value: c.value,
            creatorOldBalance: c.creator.oldBalance,
            acceptorOldBalance: c.acceptor.oldBalance,
            creatorBalanceChange: c.creator.balanceChange,
            acceptorBalanceChange: c.acceptor.balanceChange,
            // actions
            acceptorActionHash: c.acceptor.actionHash,
            acceptorToSteal: c.acceptor.toSteal,
            creatorToSteal: c.creator.toSteal,
            // other
            step: c.step
        });
    }

    mapping(uint256 => TContract) public id2contract;
    uint256 public contractsCount = 0;
    mapping(address => uint256[]) public address2contractids;
    mapping(address => uint256) public address2contractcount;

    function createTrustContract(uint256 value) public {
        require(value > 0, "value must be > 0");
        require(address2balance[msg.sender] > value * 2, "not enough funds");
        require(
            address2balance[name2address[info.bank]] >
                value * 2 + info.MIN_BANK,
            "bank is empty"
        );
        address2balance[msg.sender] -= value;
        TContract memory c = TContract({
            id: contractsCount,
            creator: Creator({_address: msg.sender, oldBalance: address2balance[msg.sender], balanceChange: 0, toSteal: false}),
            acceptor: Acceptor({
                _address: address(0),
                oldBalance: 0,
                balanceChange: 0,
                toSteal: false,
                actionHash: 0
            }),
            value: value,
            exists: true,
            step: 1
        });
        id2contract[c.id] = c;
        address2contractids[msg.sender].push(c.id);
        address2contractcount[msg.sender] += 1;
        emitContractUpdate(c);
        contractsCount += 1;
    }
}
