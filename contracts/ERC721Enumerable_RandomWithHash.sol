// SPDX-License-Identifier: MIT
pragma solidity 0.8.12;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721Enumerable.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721Burnable.sol";

contract ERC721Enumerable_RandomWithHash is
    ERC721,
    ERC721Enumerable,
    ERC721Burnable
{
    uint256 constant MAX_SUPPLY = 10_000;

    mapping(uint256 => uint256) private availableIds;

    constructor() ERC721("MyToken", "MTK") {}

    function mint(uint256 amount) external {
        require(totalSupply() + amount <= MAX_SUPPLY);
        for (uint256 i = 0; i < amount; i++) {
            uint256 tokenId = getRandomToken(msg.sender, totalSupply());
            _safeMint(msg.sender, tokenId);
        }
    }

    // Thx Cyberkongs VX <3
    function getRandomToken(address _wallet, uint256 _totalMinted)
        private
        returns (uint256)
    {
        uint256 remaining = MAX_SUPPLY - _totalMinted;
        uint256 rand = uint256(
            keccak256(
                abi.encodePacked(
                    _wallet,
                    block.difficulty,
                    block.timestamp,
                    remaining
                )
            )
        ) % remaining;
        uint256 value = rand;

        if (availableIds[rand] != 0) {
            value = availableIds[rand];
        }

        if (availableIds[remaining - 1] == 0) {
            availableIds[rand] = remaining - 1;
        } else {
            availableIds[rand] = availableIds[remaining - 1];
        }

        return value;
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
