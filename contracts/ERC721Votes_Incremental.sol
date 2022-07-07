// SPDX-License-Identifier: MIT
pragma solidity 0.8.12;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721Burnable.sol";
import "@openzeppelin/contracts/utils/cryptography/draft-EIP712.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/draft-ERC721Votes.sol";

contract ERC721Votes_Incremental is
    ERC721,
    ERC721Burnable,
    EIP712,
    ERC721Votes
{
    uint256 private _mintCounter = 0;
    uint256 constant MAX_SUPPLY = 10_000;

    constructor() ERC721("MyToken", "MTK") EIP712("MyToken", "1") {}

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

    function _afterTokenTransfer(
        address from,
        address to,
        uint256 tokenId
    ) internal override(ERC721, ERC721Votes) {
        super._afterTokenTransfer(from, to, tokenId);
    }
}
