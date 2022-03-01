# Comparison of different ERC721 smart contracts

[![Ethereum Version][ethereum-image]][ethereum-url]
[![Solidity][solidity-image]][solidity-url]
[![Node Version][node-image]][node-url]
[![MIT License][license-shield]][license-url]

The goal of this repository is to compare different ways of making an NFT contract: openzeppelin's [ERC721](https://github.com/OpenZeppelin/openzeppelin-contracts/blob/master/contracts/token/ERC721/ERC721.sol) and [ERC721Enumerable](https://github.com/OpenZeppelin/openzeppelin-contracts/blob/master/contracts/token/ERC721/extensions/ERC721Enumerable.sol), [ERC721A](https://github.com/chiru-labs/ERC721A) and other personal implementations for mint with or without randomness...

This comparison is done first by studying the **gas used for mint 1 to 10 NFTs, exchange and burn** with these different contracts, but also by giving an opinion on the features offered. 

*These opinion only engage the person in charge of this repository, but all people are invited to **share and discuss** about theirs by **creating issues**.*


## Gas comparison

|   ACTION   | ERC721<br/>_(Incremental)_| ERC721Enumerable<br/>_(Incremental)_ | ERC721A<br/>_(Incremental)_ | ERC721<br/>_(Random with hash)_ | ERC721Enumerable<br/>_(Random with hash)_ |
|:----------:|:--------------------:|:------------------------------------:|:---------------------------:|:-------------------------------:|:-----------------------------------------:|
|   Mint 1   |        76672         |        144089<br/> _(+88%)_          |            76661            |       100011<br/>_(+30%)_       |           158963<br/>_(+107%)_            |
|   Mint 2   |        100873        |         252174<br/>_(+150%)_         |     76987<br/>_(-24%)_      |       147609<br/>_(+46%)_       |           292728<br/>_(+190%)_            |
|   Mint 3   |        127574        |         362059<br/>_(+184%)_         |     79813<br/>_(-37%)_      |       197557<br/>_(+55%)_       |           425790<br/>_(+234%)_            |
|   Mint 4   |        154275        |         471944<br/>_(+206%)_         |     82639<br/>_(-46%)_      |       245154<br/>_(+59%)_       |           558856<br/>_(+262%)_            |
|   Mint 5   |        180976        |         581829<br/>_(+221%)_         |     85465<br/>_(-53%)_      |       292604<br/>_(+62%)_       |           691922<br/>_(+282%)_            |
|  Mint 10   |        314481        |        1131254<br/>_(+260%)_         |     99595<br/>_(-68%)_      |       542653<br/>_(+73%)_       |           1357540<br/>_(+332%)_           |
| Transfer 1 |        48662         |          76036<br/>_(+56%)_          |     77924<br/>_(+60%)_      |              48671              |            77056<br/>_(+58%)_             |
|   Burn 1   |        26635         |          44959<br/>_(+69%)_          |     70032<br/>_(+163%)_     |              26646              |            44632<br/>_(+68%)_             |



<!-- Markdown link & img dfn's -->
[ethereum-image]: https://img.shields.io/badge/Ethereum-purple?logo=Ethereum&style=for-the-badge
[ethereum-url]: https://ethereum.org/fr/
[node-image]: https://img.shields.io/badge/node-v16-blue?style=for-the-badge
[node-url]: https://nodejs.org/ko/blog/release/v16.13.0/
[solidity-image]: https://img.shields.io/badge/Solidity-v0.8.12-gray?logo=Solidity&style=for-the-badge
[solidity-url]: https://nodejs.org/uk/blog/release/v12.14.1/
[license-shield]: https://img.shields.io/badge/License-MIT-green.svg?style=for-the-badge
[license-url]: https://github.com/senecolas/ERC721-compare/blob/main/LICENSE