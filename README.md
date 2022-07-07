# Comparison of different ERC721 smart contracts

[![Ethereum Version][ethereum-image]][ethereum-url]
[![Solidity][solidity-image]][solidity-url]
[![Node Version][node-image]][node-url]
[![MIT License][license-shield]][license-url]

The goal of this repository is to compare different ways of making an NFT contract: openzeppelin's [ERC721](https://github.com/OpenZeppelin/openzeppelin-contracts/blob/master/contracts/token/ERC721/ERC721.sol) and [ERC721Enumerable](https://github.com/OpenZeppelin/openzeppelin-contracts/blob/master/contracts/token/ERC721/extensions/ERC721Enumerable.sol), [ERC721A](https://github.com/chiru-labs/ERC721A) and other personal implementations for mint with or without randomness...

This comparison is done first by studying the **gas used for mint 1 to 10 NFTs, exchange and burn** with these different contracts, but also by giving an opinion on the features offered. 

*These opinion only engage the person in charge of this repository, but all people are invited to **share and discuss** about theirs by **creating issues**.*

- [Comparison of different ERC721 smart contracts](#comparison-of-different-erc721-smart-contracts)
  - [Gas comparison](#gas-comparison)
    - [ERC721 vs ERC721Enumerable _(Incremental)_](#erc721-vs-erc721enumerable-incremental)
    - [ERC721 vs ERC721A _(Incremental)_](#erc721-vs-erc721a-incremental)
    - [ERC721 _(Incremental)_ vs ERC721 _(Random with hash)_](#erc721-incremental-vs-erc721-random-with-hash)
## Gas comparison


### ERC721 vs ERC721Enumerable _(Incremental)_

|      ACTION      |        Mint 1        |        Mint 2        |        Mint 3        |        Mint 4        |        Mint 5        |        Mint 10        |     Transfer 1     |       Burn 1       |
| :--------------: | :------------------: | :------------------: | :------------------: | :------------------: | :------------------: | :-------------------: | :----------------: | :----------------: |
|      ERC721      |        76672         |        100873        |        127574        |        154275        |        180976        |        314481         |       48662        |       26635        |
| ERC721Enumerable | 144089<br/> _(+88%)_ | 252174<br/>_(+150%)_ | 362059<br/>_(+184%)_ | 471944<br/>_(+206%)_ | 581829<br/>_(+221%)_ | 1131254<br/>_(+260%)_ | 76036<br/>_(+56%)_ | 44959<br/>_(+69%)_ |


### ERC721 vs ERC721A _(Incremental)_

| ACTION  | Mint 1 |       Mint 2       |       Mint 3       |       Mint 4       |       Mint 5       |      Mint 10       |     Transfer 1     |       Burn 1        |
| :-----: | :----: | :----------------: | :----------------: | :----------------: | :----------------: | :----------------: | :----------------: | :-----------------: |
| ERC721  | 76672  |       100873       |       127574       |       154275       |       180976       |       314481       |       48662        |        26635        |
| ERC721A | 76661  | 76987<br/>_(-24%)_ | 79813<br/>_(-37%)_ | 82639<br/>_(-46%)_ | 85465<br/>_(-53%)_ | 99595<br/>_(-68%)_ | 77924<br/>_(+60%)_ | 70032<br/>_(+163%)_ |


### ERC721 _(Incremental)_ vs ERC721 _(Random with hash)_ 

|                  ACTION                   |        Mint 1        |        Mint 2        |        Mint 3        |        Mint 4        |        Mint 5        |        Mint 10        |     Transfer 1     |       Burn 1       |
| :---------------------------------------: | :------------------: | :------------------: | :------------------: | :------------------: | :------------------: | :-------------------: | :----------------: | :----------------: |
|        ERC721<br/>_(Incremental)_         |        76672         |        100873        |        127574        |        154275        |        180976        |        314481         |       48662        |       26635        |
|      ERC721<br/>_(Random with hash)_      | 100011<br/>_(+30%)_  | 147609<br/>_(+46%)_  | 197557<br/>_(+55%)_  | 245154<br/>_(+59%)_  | 292604<br/>_(+62%)_  |  542653<br/>_(+73%)_  |       48671        |       26646        |
| ERC721Enumerable<br/>_(Random with hash)_ | 158963<br/>_(+107%)_ | 292728<br/>_(+190%)_ | 425790<br/>_(+234%)_ | 558856<br/>_(+262%)_ | 691922<br/>_(+282%)_ | 1357540<br/>_(+332%)_ | 77056<br/>_(+58%)_ | 44632<br/>_(+68%)_ |



<!-- Markdown style -->
<style>
table th:first-of-type {
    width: 20%;
}
table th {
    width: 10%;
}
</style>

<!-- Markdown link & img dfn's -->
[ethereum-image]: https://img.shields.io/badge/Ethereum-purple?logo=Ethereum&style=for-the-badge
[ethereum-url]: https://ethereum.org/fr/
[node-image]: https://img.shields.io/badge/node-v16-blue?style=for-the-badge
[node-url]: https://nodejs.org/ko/blog/release/v16.13.0/
[solidity-image]: https://img.shields.io/badge/Solidity-v0.8.12-gray?logo=Solidity&style=for-the-badge
[solidity-url]: https://nodejs.org/uk/blog/release/v12.14.1/
[license-shield]: https://img.shields.io/badge/License-MIT-green.svg?style=for-the-badge
[license-url]: https://github.com/senecolas/ERC721-compare/blob/main/LICENSE