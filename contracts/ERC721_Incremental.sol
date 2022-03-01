// SPDX-License-Identifier: MIT
pragma solidity 0.8.12;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";

contract ERC721_Incremental is ERC721 {
    uint256 private _mintCounter = 0;
    uint256 constant MAX_SUPPLY = 10_000;

    constructor() ERC721("MyToken", "MTK") {}

    function mint(uint256 amount) external {
        require(totalSupply() + amount <= MAX_SUPPLY);
        uint256 tokenId = _mintCounter;
        for (uint256 i = 0; i < amount; i++) {
            tokenId += 1;
            _safeMint(msg.sender, tokenId);
        }
        _mintCounter = tokenId;
    }

    function totalSupply() public view returns (uint256) {
        return _mintCounter;
    }
}
