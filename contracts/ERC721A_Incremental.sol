// SPDX-License-Identifier: MIT
pragma solidity 0.8.12;

import "erc721a/contracts/ERC721A.sol";

contract ERC721A_Incremental is ERC721A {
    uint256 constant MAX_SUPPLY = 10_000;

    constructor() ERC721A("MyToken", "MTK") {}

    function mint(uint256 amount) external {
        require(totalSupply() + amount <= MAX_SUPPLY);
        _safeMint(msg.sender, amount);
    }
}
