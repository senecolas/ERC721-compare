# Comparison of different ERC721 smart contracts

[![Ethereum Version][ethereum-image]][ethereum-url]
[![Solidity][solidity-image]][solidity-url]
[![Node Version][node-image]][node-url]
[![MIT License][license-shield]][license-url]

The goal of this repository is to compare different ways of making an NFT contract: openzeppelin's [ERC721](https://github.com/OpenZeppelin/openzeppelin-contracts/blob/master/contracts/token/ERC721/ERC721.sol) and [ERC721Enumerable](https://github.com/OpenZeppelin/openzeppelin-contracts/blob/master/contracts/token/ERC721/extensions/ERC721Enumerable.sol), [ERC721A](https://github.com/chiru-labs/ERC721A) and other personal implementations for mint with or without randomness...

This comparison is done first by studying the **gas used for mint and exchange 1 to 10 NFTs** with these different contracts, but also by giving an opinion on the features offered. 

*These opinion only engage the person in charge of this repository, but all people are invited to **share and discuss** about theirs by **creating issues**.*


## Gas comparison


|   ACTION   | ERC721<br/>_(Incremental)_ | ERC721Enumerable<br/>_(Incremental)_ | ERC721A<br/>_(Incremental)_ |
|:----------:|:--------------------:|:------------------------------:|:---------------------:|
|   Mint 1   |        88236         |         152175 <br/>_(+72%)_          |         88185         |
|   Mint 2   |        99937         |         251260 <br/>_(+151%)_         |     76011 <br/>_(-24%)_      |
|   Mint 3   |        126638        |         361145 <br/>_(+185%)_         |     78837 <br/>_(-38%)_      |
|   Mint 4   |        153339        |         471030 <br/>_(+207%)_         |     81663 <br/>_(-47%)_      |
|   Mint 5   |        180040        |         580915 <br/>_(+223%)_         |     84489 <br/>_(-53%)_      |
|   Mint 6   |        206741        |         690800 <br/>_(+234%)_         |     87315 <br/>_(-58%)_      |
|   Mint 7   |        233442        |         800685 <br/>_(+243%)_         |     90141 <br/>_(-61%)_      |
|   Mint 8   |        260143        |         910570 <br/>_(+250%)_         |     92967 <br/>_(-64%)_      |
|   Mint 9   |        286844        |        1020455 <br/>_(+256%)_         |     95793 <br/>_(-67%)_      |
|  Mint 10   |        313545        |        1130340 <br/>_(+261%)_         |     98619 <br/>_(-69%)_      |
| Transfer 1 |        49908         |          80500 <br/>_(+61%)_          |     70919 <br/>_(+42%)_      |






<!-- Markdown link & img dfn's -->
[ethereum-image]: https://img.shields.io/badge/Ethereum-purple?logo=Ethereum&style=for-the-badge
[ethereum-url]: https://ethereum.org/fr/
[node-image]: https://img.shields.io/badge/node-v16-blue?style=for-the-badge
[node-url]: https://nodejs.org/ko/blog/release/v16.13.0/
[solidity-image]: https://img.shields.io/badge/Solidity-v0.8.12-gray?logo=Solidity&style=for-the-badge
[solidity-url]: https://nodejs.org/uk/blog/release/v12.14.1/
[license-shield]: https://img.shields.io/badge/License-MIT-green.svg?style=for-the-badge
[license-url]: https://github.com/senecolas/ERC721-compare/blob/main/LICENSE