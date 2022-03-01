// SPDX-License-Identifier: MIT
pragma solidity 0.8.12;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721Enumerable.sol";

contract ERC721Enumerable_Incremental is ERC721, ERC721Enumerable {
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

    // The following functions are overrides required by Solidity.

    function _beforeTokenTransfer(
        address from,
        address to,
        uint256 tokenId
    ) internal override(ERC721, ERC721Enumerable) {
        super._beforeTokenTransfer(from, to, tokenId);
    }

    function supportsInterface(bytes4 interfaceId)
        public
        view
        override(ERC721, ERC721Enumerable)
        returns (bool)
    {
        return super.supportsInterface(interfaceId);
    }
}
