# SoulManager
SoulManager is a simple user interface that implements basic requirements and functionalities of "Soul" and "SoulBound Tokens(SBT)". With SoulManager, users are able to create multiple instances of Souls based on different categories of SBTs. Also Souls are capable of issuing and claiming SBTs on-chain via ethereum transactions.

Each Soul in SoulManager dApp is a ERC721Holder contract that can possess NFTs, but at the same time is a ERC721URIStroage contract that inherits minting capability from ERC721 contract to be able to issue SBTs to other Soul contracts. In order for all signers to claim their SBTs safely, claiming SBT requires all signers to provide valid signature to be verified as a rightful claimant. 

## Requirements
1. Currently SoulManager assumes all issuant Souls to have CIDs of NFT metadata. If you don't have CID of NFT metadata, feel free to use below CIDs to see interactions between Souls.

```
{
  path: 'Qme3sQNfvFxYfvTJDr3kmMpMhY5jncKGchY4eG37EwXS6x',
  cid: CID(Qme3sQNfvFxYfvTJDr3kmMpMhY5jncKGchY4eG37EwXS6x),
  size: 58
}
{
  path: 'QmQCG8P68STypEr1GrQz9u6vhnqsXXPE5n7qjdnPXD98xR',
  cid: CID(QmQCG8P68STypEr1GrQz9u6vhnqsXXPE5n7qjdnPXD98xR),
  size: 296
}
``` 


## Network
Currently only supported in rinkeby 
