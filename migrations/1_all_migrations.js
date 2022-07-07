const ERC721_Incremental = artifacts.require("ERC721_Incremental");
const ERC721Votes_Incremental = artifacts.require("ERC721Votes_Incremental");
const ERC721Enumerable_Incremental = artifacts.require(
  "ERC721Enumerable_Incremental"
);
const ERC721A_Incremental = artifacts.require("ERC721A_Incremental");
const ERC721_RandomWithHash = artifacts.require("ERC721_RandomWithHash");
const ERC721Enumerable_RandomWithHash = artifacts.require(
  "ERC721Enumerable_RandomWithHash"
);

module.exports = function (deployer) {
  deployer.deploy(ERC721_Incremental);
  deployer.deploy(ERC721Votes_Incremental);
  deployer.deploy(ERC721Enumerable_Incremental);
  deployer.deploy(ERC721A_Incremental);
  deployer.deploy(ERC721_RandomWithHash);
  deployer.deploy(ERC721Enumerable_RandomWithHash);
};
