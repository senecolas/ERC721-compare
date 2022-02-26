// SPDX-License-Identifier: MIT
pragma solidity 0.8.12;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";

contract ERC721_Incremental is ERC721 {
    uint256 private _tokenIdCounter = 0;

    constructor() ERC721("MyToken", "MTK") {}

    function mint(uint256 amount) external {
        uint256 tokenId = _tokenIdCounter;
        for (uint256 i = 0; i < amount; i++) {
            tokenId += 1;
            _safeMint(msg.sender, tokenId);
        }
        _tokenIdCounter = tokenId;
    }
}
