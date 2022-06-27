// contracts/GameItem.sol
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/utils/Counters.sol";
import "@openzeppelin/contracts/token/ERC721/utils/ERC721Holder.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/cryptography/SignatureChecker.sol";
import "@openzeppelin/contracts/interfaces/IERC1271.sol";
import "hardhat/console.sol";
import "./SoulManager.sol";

contract Soul is IERC1271, ERC721Holder, ERC721{
    using Counters for Counters.Counter;
    using SignatureChecker for address;
    // sender soul specific token id
    Counters.Counter private _vID;

    // recipient soul specific token id
    Counters.Counter private _tokenIndex;
    SoulManager private soulManager;
    address immutable private owner;
    uint immutable private soulId;

    event ApprovalSent(address, string);
    event TokenReceived(address, address, uint, string);

    struct SBT {
      address sender;
      address recipient;
      uint tokenId;
      uint vID;
      string tokenURI;
    }

    mapping(uint => SBT) private _sbts;

    constructor(string memory _soulName, string memory _sbtSym, address _soulManagerAddr, address _owner, uint _soulId) 
    ERC721(_soulName, _sbtSym){
      require(_msgSender() == _soulManagerAddr, "soul contructor: only soul manager can initialize a soul instance");
        soulManager = SoulManager(_soulManagerAddr);
        owner = _owner;
        soulId= _soulId;
    }

    function issueSBTtoSelf(string memory tokenURI) external onlyOwner() returns (uint256) {
      return _issueSBT(address(this), tokenURI);
    }

    function issueSBTtoOther(address recipient, string memory tokenURI) external onlySoulManager() returns (uint256) {
      return _issueSBT(recipient, tokenURI);
    }

    function issuePendingSBT(address recipient, string memory tokenURI) external onlyOwner() {
      soulManager.addPendingToken(recipient, tokenURI);
    }

    function claimSBT(address issuer, string memory tokenURI, bytes calldata signature) external onlyOwner() {
      soulManager.releaseSBT(issuer, tokenURI, signature);
    }

    function size() external view returns(uint256) {
      return _tokenIndex.current();
    }

    function getAllSBTs() external view returns(SBT[] memory) {
      SBT[] memory _res = new SBT[](_tokenIndex.current());
      for (uint i = 0; i < _tokenIndex.current(); i++) {
        _res[i] = _sbts[i];
      }
      return _res;
    }

    function onERC721Received(address, address, uint256 _verificationId, bytes memory _data) public override returns(bytes4) {
      uint currentIndex = _tokenIndex.current();
      SBT memory newSbt = SBT({
        sender: _msgSender(),
        recipient: address(this),
        tokenId: currentIndex,
        vID: _verificationId,
        tokenURI: string(_data)
      });

      _sbts[currentIndex] = newSbt;
      _tokenIndex.increment();

      emit TokenReceived(_msgSender(), address(this), currentIndex, string(_data));

      return this.onERC721Received.selector;
    }

    function safeTransferFrom(address, address, uint256) public override pure{
      revert("safeTransferFrom: SBT is not transferrable");
    }

    function transferFrom(address, address, uint256) public override pure {
      revert("transferFrom: SBT is not transferrable");
    }

    function _issueSBT(address recipient, string memory tokenURI) internal returns (uint256) {   
      uint256 newItemId = _vID.current();
      _safeMint(recipient, newItemId, bytes(tokenURI));
      _vID.increment();
      return newItemId;
    }

    function getOwner() external view returns(address _owner) {
      _owner = owner;
    }

    modifier onlySoulManager() {
      require(_msgSender() == address(soulManager), "soulManagerOnly: only soul manager contract can call this function");
      _;
    }
    modifier onlyOwner() {
      require(_msgSender() == owner, "onlyOwner: only owner of the contract can call this function"); 
      _;
    }

    //TODO: add EIP1271 contract verification process

    function isValidSignature(bytes32 hash, bytes memory signature) external view override returns (bytes4 magicValue) {
      if (owner.isValidSignatureNow(hash, signature)) {
        return 0x12345678;
      } else {
        return 0xffffffff;
      }
    }
    //TODO: add 
}
