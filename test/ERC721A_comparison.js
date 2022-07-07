// Load modules
const cliProgress = require("cli-progress");

// Load artifacts
const ERC721_Incremental = artifacts.require("ERC721_Incremental");
const ERC721Enumerable_Incremental = artifacts.require(
  "ERC721Enumerable_Incremental"
);
const ERC721A_Incremental = artifacts.require("ERC721A_Incremental");
const ERC721_RandomWithHash = artifacts.require("ERC721_RandomWithHash");
const ERC721Enumerable_RandomWithHash = artifacts.require(
  "ERC721Enumerable_RandomWithHash"
);

// Load utils
const gasStats = require("../utils/gasStats");

contract("ALL TESTS", (accounts) => {
  const ZERO_ADDRESS = "0x0000000000000000000000000000000000000000";

  // Array of tokensId identified by contract => users
  const usersTokensByContract = {};

  // Amount of mint to test
  const MINT_AMOUNT = 10;

  /**
   * ========================
   *        FUNCTIONS
   * ========================
   */

  /**
   * Update `usersTokensByContract` with transaction's event logs
   */
  const updateUsersTokens = (txData, contractName) => {
    if (!usersTokensByContract[contractName]) {
      usersTokensByContract[contractName] = {};
    }
    const usersTokens = usersTokensByContract[contractName];
    txData.logs.map((log) => {
      if (log.event === "Transfer") {
        const { to, from, tokenId } = log.args;
        usersTokens[to] = usersTokens[to]
          ? [...usersTokens[to], tokenId]
          : [tokenId];

        if (from !== ZERO_ADDRESS) {
          usersTokens[from] = usersTokens[from].filter(
            (id) => id.toString() !== tokenId.toString()
          );
        }
      }
    });
  };

  /**
   * Mint foreach network's users for the `artifact` deployed contract
   * Update users tokens and add transaction's gas used to gasStats
   * Show a progress bar in the console
   */
  const launchMints = async (artifact, contractName) => {
    const contract = await artifact.deployed();
    assert(contract.address !== "", "Contract not deployed");

    // Set progress bar
    console.log(`\tWait while users mint "${contractName}" tokens...`);
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
      const txData = await contract.mint(MINT_AMOUNT, { from: user });
      updateUsersTokens(txData, contractName); // Add ids to usersTokensByContract
      gasStats.addGasUsed(
        contractName,
        `Mint ${MINT_AMOUNT}`,
        txData.receipt.gasUsed
      );

      // Progress
      progressBar.increment();
    }

    progressBar.stop();
  };

  /**
   * Transfer a random token to the first user foreach other network's users for the `artifact` deployed contract
   * Update users tokens and add transaction's gas used to gasStats
   * Show a progress bar in the console
   */
  const launchTransfers = async (artifact, contractName) => {
    const contract = await artifact.deployed();
    assert(contract.address !== "", "Contract not deployed");

    // Set progress bar
    console.log(`\tWait while users mint "${contractName}" tokens...`);
    const progressBar = new cliProgress.SingleBar(
      {
        format:
          "\tMint: [{bar}] {percentage}% | {value}/{total} users | ETA: {eta}s | Duration: {duration_formatted}",
      },
      cliProgress.Presets.shades_classic
    );
    progressBar.start(accounts.length - 1, 0);

    // Each users transfer a random token to the first user
    for (let i = 1; i < accounts.length; i++) {
      const user = accounts[i];
      // Shuffle usersTokens for transfer them in disorder
      const usersTokens = usersTokensByContract[contractName][user]
        .map((value) => ({ value, sort: Math.random() }))
        .sort((a, b) => a.sort - b.sort)
        .map(({ value }) => value);
      let gasUsed = 0;

      for (let i = 0; i < usersTokens.length; i++) {
        const tokenId = usersTokens[i];
        const txData = await contract.transferFrom(user, accounts[0], tokenId, {
          from: user,
        });
        gasUsed += txData.receipt.gasUsed;
      }

      gasStats.addGasUsed(contractName, `Transfer x10`, gasUsed);

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

  // ERC721 (Incremental)
  it(`${accounts.length} users mint ${MINT_AMOUNT} NFT for ERC721`, async () => {
    await launchMints(ERC721_Incremental, "ERC721 (Incremental)");
  });

  it(`${
    accounts.length - 1
  } users transfer ${MINT_AMOUNT} tokens to the first user for ERC721 (Incremental)`, async () => {
    await launchTransfers(ERC721_Incremental, "ERC721 (Incremental)");
  });

  // ERC721A (Incremental)
  it(`${accounts.length} users mint ${MINT_AMOUNT} NFT for ERC721A (Incremental)`, async () => {
    await launchMints(ERC721A_Incremental, "ERC721A (Incremental)");
  });

  it(`${
    accounts.length - 1
  } users transfer ${MINT_AMOUNT} tokens to the first user for ERC721A (Incremental)`, async () => {
    await launchTransfers(ERC721A_Incremental, "ERC721A (Incremental)");
  });

  // GAS STATS
  it(`END`, async () => {
    // Add total
    let total = {};
    const stats = gasStats.getStats();
    for (action in stats) {
      for (contract in stats[action]) {
        const gasUsed = stats[action][contract];
        total[contract] = total[contract] + gasUsed || gasUsed;
      }
    }
    for (contract in total) {
      gasStats.addGasUsed(contract, "TOTAL", total[contract]);
    }
    // TO DO : Add total
    gasStats.consoleStats("ERC721 (Incremental)");
  });
});
