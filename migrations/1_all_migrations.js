const ERC721_Incremental = artifacts.require("ERC721_Incremental");
const ERC721Enumerable_Incremental = artifacts.require(
  "ERC721Enumerable_Incremental"
);
const ERC721A_Incremental = artifacts.require("ERC721A_Incremental");

module.exports = function (deployer) {
  deployer.deploy(ERC721_Incremental);
  deployer.deploy(ERC721Enumerable_Incremental);
  deployer.deploy(ERC721A_Incremental);
};
