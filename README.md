# Comparison of different ERC721 smart contracts

[![Ethereum Version][ethereum-image]][ethereum-url]
[![Solidity][solidity-image]][solidity-url]
[![Node Version][node-image]][node-url]
[![MIT License][license-shield]][license-url]

The goal of this repository is to compare different ways of making an NFT contract: openzeppelin's [ERC721](https://github.com/OpenZeppelin/openzeppelin-contracts/blob/master/contracts/token/ERC721/ERC721.sol) and [ERC721Enumerable](https://github.com/OpenZeppelin/openzeppelin-contracts/blob/master/contracts/token/ERC721/extensions/ERC721Enumerable.sol), [ERC721A](https://github.com/chiru-labs/ERC721A) and other personal implementations for mint with or without randomness...

This comparison is done first by studying the **gas used for mint 1 to 10 NFTs** with these different contracts, but also by giving an opinion on the features offered. 

*These opinion only engage the person in charge of this repository, but all people are invited to **share and discuss** about theirs by **creating issues**.*



















<!-- Markdown link & img dfn's -->
[ethereum-image]: https://img.shields.io/badge/Ethereum-purple?logo=Ethereum&style=for-the-badge
[ethereum-url]: https://ethereum.org/fr/
[node-image]: https://img.shields.io/badge/node-v16-blue?style=for-the-badge
[node-url]: https://nodejs.org/ko/blog/release/v16.13.0/
[solidity-image]: https://img.shields.io/badge/Solidity-v0.8.7-gray?logo=Solidity&style=for-the-badge
[solidity-url]: https://nodejs.org/uk/blog/release/v12.14.1/
[license-shield]: https://img.shields.io/badge/License-MIT-green.svg?style=for-the-badge
[license-url]: https://github.com/senecolas/ERC721-compare/blob/main/LICENSE