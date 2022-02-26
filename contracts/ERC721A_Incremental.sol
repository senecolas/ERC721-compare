// SPDX-License-Identifier: MIT
pragma solidity 0.8.12;

import "erc721a/contracts/ERC721A.sol";

contract ERC721A_Incremental is ERC721A {
    constructor() ERC721A("MyToken", "MTK") {}

    function mint(uint256 amount) external {
        _safeMint(msg.sender, amount);
    }
}
