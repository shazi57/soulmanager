// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/Counters.sol";
import "./Soul.sol";
import "hardhat/console.sol";

contract SoulManager is Ownable {
  event SoulAdded(uint, string, string, address);

  using Counters for Counters.Counter;
  Counters.Counter private _soulId;

  // one to one mapping from soulId to soul
  mapping(uint => address) private _souls;

  // many to one mapping from wallet to owner
  mapping(uint => address) private _owners;

  mapping(address => uint) private _numSouls;

  mapping(address => mapping(address => bytes32)) private _approvals;

  Soul soul;

  function createSoul(string memory _soulName, string memory _soulTicker) external {
    uint currSoulId = _soulId.current();
    Soul newSoul = new Soul(_soulName, _soulTicker, address(this), _msgSender(), currSoulId);
    _owners[currSoulId] = _msgSender();
    _numSouls[_msgSender()]++;
    _souls[currSoulId] = address(newSoul);
    
    _soulId.increment();
    emit SoulAdded(currSoulId, _soulName, _soulTicker, address(newSoul));
  }

  function addPendingToken(address recipient, string memory tokenURI) external {
    _approvals[_msgSender()][recipient] = keccak256(abi.encodePacked(tokenURI));
  }

  function releaseSBT(address issuer, string memory tokenURI, bytes calldata _signature) external {
    bytes32 payloadHash = keccak256(abi.encode(_msgSender(), issuer, tokenURI));
    bytes32 _hash = keccak256(abi.encodePacked("\x19Ethereum Signed Message:\n32", payloadHash));
    callERC1271isValidSignature(_msgSender(), _hash, _signature);

    require(_approvals[issuer][_msgSender()] == keccak256(abi.encodePacked(tokenURI))
    ,"releaseSBT: invalid tokenURI"
    );
    Soul senderSoul = Soul(issuer);
    senderSoul.issueSBTtoOther(_msgSender(), tokenURI);
  }

  function getSouls(address owner) external view returns(address[] memory mySouls) {
    uint numWallets = _numSouls[owner];
    mySouls = new address[](numWallets);
    uint soulIndex = 0;
    for (uint i = 0; i < _soulId.current(); i++) {
      if (_owners[i] == owner) {
        address soulAddr = _souls[i];
        mySouls[soulIndex] = soulAddr;
        soulIndex ++;
      }
    }
  }

  function getSoul(uint soulId) external view returns(address) {
    return _souls[soulId];
  }

  function getOwner(uint soulId) external view returns(address) {
    return _owners[soulId];
  }

  function getApproval(address issuer, address recipient) public view returns(bytes32) {
    return _approvals[issuer][recipient];
  }

  function callERC1271isValidSignature(
    address _addr,
    bytes32 _hash,
    bytes calldata _signature
  ) public view {
    bytes4 success = Soul(_addr).isValidSignature(_hash, _signature);
    require (success == 0x12345678, "INVALID_SIGNATURE");
  }
}

