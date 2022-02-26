// Load modules
const cliProgress = require("cli-progress");

// Load artifacts
const ERC721_Incremental = artifacts.require("ERC721_Incremental");
const ERC721Enumerable_Incremental = artifacts.require(
  "ERC721Enumerable_Incremental"
);
const ERC721A_Incremental = artifacts.require("ERC721A_Incremental");

// Load utils
const gasStats = require("../utils/gasStats");

contract("ALL TESTS", (accounts) => {
  const usersTokensByContract = [];

  /**
   * ========================
   *        FUNCTIONS
   * ========================
   */

  const addMintedToken = (user, txData, contractName) => {
    const idMints = txData.logs.reduce((acc, curr) => {
      if (curr.event === "Transfer") {
        acc.push(curr.args.tokenId);
      }
      return acc;
    }, []);
    if (!usersTokensByContract[contractName]) {
      usersTokensByContract[contractName] = {};
    }
    usersTokensByContract[contractName][user] = usersTokensByContract[
      contractName
    ][user]
      ? [...usersTokensByContract[contractName][user], ...idMints]
      : idMints;
  };

  const launchMints = async (artifact, name) => {
    const contract = await artifact.deployed();
    assert(contract.address !== "", "Contract not deployed");

    // Set progress bar
    console.log(`\tWait while users mint "${name}" tokens...`);
    const progressBar = new cliProgress.SingleBar(
      {
        format:
          "\tMint: [{bar}] {percentage}% | {value}/{total} users | ETA: {eta}s | Duration: {duration_formatted}",
      },
      cliProgress.Presets.shades_classic
    );
    progressBar.start(accounts.length, 0);

    // Mint foreach users
    for (let i = 0; i < accounts.length; i++) {
      const user = accounts[i];
      const amount = 1 + (i % 10);

      const txData = await contract.mint(amount, { from: user });
      gasStats.addGasUsed(name, `Mint ${amount}`, txData);
      addMintedToken(user, txData, name); // Add ids to usersTokensByContract

      // Progress
      progressBar.increment();
    }

    progressBar.stop();
  };

  const launchTransfers = async (artifact, name) => {
    const contract = await artifact.deployed();
    assert(contract.address !== "", "Contract not deployed");

    // Set progress bar
    console.log(`\tWait while users mint "${name}" tokens...`);
    const progressBar = new cliProgress.SingleBar(
      {
        format:
          "\tMint: [{bar}] {percentage}% | {value}/{total} users | ETA: {eta}s | Duration: {duration_formatted}",
      },
      cliProgress.Presets.shades_classic
    );
    progressBar.start(accounts.length - 1, 0);

    // Each users transfer their first token to the first user
    for (let i = 1; i < accounts.length; i++) {
      const user = accounts[i];
      const tokenId = usersTokensByContract[name][user][0];

      const txData = await contract.transferFrom(user, accounts[0], tokenId, {
        from: user,
      });
      gasStats.addGasUsed(name, `Transfer 1`, txData);

      // Progress
      progressBar.increment();
    }

    progressBar.stop();
  };

  /**
   * ========================
   *          TESTS
   * ========================
   */

  it(`${accounts.length} users mint for ERC721 (Incremental)`, async () => {
    await launchMints(ERC721_Incremental, "ERC721 (Incremental)");
  });

  it(`${accounts.length} transfer their first token to the first user for ERC721 (Incremental)`, async () => {
    await launchTransfers(ERC721_Incremental, "ERC721 (Incremental)");
  });

  it(`${accounts.length} users mint for ERC721Enumerable (Incremental)`, async () => {
    await launchMints(
      ERC721Enumerable_Incremental,
      "ERC721Enumerable (Incremental)"
    );
  });

  it(`${accounts.length} transfer their first token to the first user for ERC721Enumerable (Incremental)`, async () => {
    await launchTransfers(
      ERC721Enumerable_Incremental,
      "ERC721Enumerable (Incremental)"
    );
  });

  it(`${accounts.length} users mint for ERC721A (Incremental)`, async () => {
    await launchMints(ERC721A_Incremental, "ERC721A (Incremental)");
  });

  it(`${accounts.length} transfer their first token to the first user for ERC721A (Incremental)`, async () => {
    await launchTransfers(ERC721A_Incremental, "ERC721A (Incremental)");
  });

  it(`END`, async () => {
    gasStats.consoleStats("ERC721 (Incremental)");
  });
});
