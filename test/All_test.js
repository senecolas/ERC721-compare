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

  // Array of each amount of mint to test
  const MINT_AMOUNTS_ARRAY = [1, 2, 3, 4, 5, 10];

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
      const amount = MINT_AMOUNTS_ARRAY[i % MINT_AMOUNTS_ARRAY.length];

      const txData = await contract.mint(amount, { from: user });
      updateUsersTokens(txData, contractName); // Add ids to usersTokensByContract
      gasStats.addGasUsed(contractName, `Mint ${amount}`, txData);

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
      const usersTokens = usersTokensByContract[contractName][user];
      const tokenId =
        usersTokens[Math.floor(Math.random() * usersTokens.length)];

      const txData = await contract.transferFrom(user, accounts[0], tokenId, {
        from: user,
      });
      updateUsersTokens(txData, contractName); // Add ids to usersTokensByContract
      gasStats.addGasUsed(contractName, `Transfer 1`, txData);

      // Progress
      progressBar.increment();
    }

    progressBar.stop();
  };

  /**
   * Burn a random token foreach network's users for the `artifact` deployed contract
   * Update users tokens and add transaction's gas used to gasStats
   * Show a progress bar in the console
   */
  const launchBurns = async (artifact, contractName) => {
    const contract = await artifact.deployed();
    assert(contract.address !== "", "Contract not deployed");

    // Set progress bar
    console.log(`\tWait while users burn "${contractName}" tokens...`);
    const progressBar = new cliProgress.SingleBar(
      {
        format:
          "\tBurn: [{bar}] {percentage}% | {value}/{total} users | ETA: {eta}s | Duration: {duration_formatted}",
      },
      cliProgress.Presets.shades_classic
    );
    progressBar.start(accounts.length - 1, 0);

    // Each users burn a random token
    for (let i = 1; i < accounts.length; i++) {
      const user = accounts[i];
      const usersTokens = usersTokensByContract[contractName][user];

      // If the user still has a token
      if (usersTokens && usersTokens.length) {
        const tokenId =
          usersTokens[Math.floor(Math.random() * usersTokens.length)];

        const txData = await contract.burn(tokenId, {
          from: user,
        });
        updateUsersTokens(txData, contractName); // Add ids to usersTokensByContract
        gasStats.addGasUsed(contractName, `Burn 1`, txData);
      }
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
  it(`${accounts.length} users mint for ERC721 (Incremental)`, async () => {
    await launchMints(ERC721_Incremental, "ERC721 (Incremental)");
  });

  it(`${
    accounts.length - 1
  } users transfer a random token to the first user for ERC721 (Incremental)`, async () => {
    await launchTransfers(ERC721_Incremental, "ERC721 (Incremental)");
  });

  it(`${accounts.length} users burn a random token for ERC721 (Incremental)`, async () => {
    await launchBurns(ERC721_Incremental, "ERC721 (Incremental)");
  });

  // ERC721Enumerable (Incremental)
  it(`${accounts.length} users mint for ERC721Enumerable (Incremental)`, async () => {
    await launchMints(
      ERC721Enumerable_Incremental,
      "ERC721Enumerable (Incremental)"
    );
  });

  it(`${
    accounts.length - 1
  } users transfer a random token to the first user for ERC721Enumerable (Incremental)`, async () => {
    await launchTransfers(
      ERC721Enumerable_Incremental,
      "ERC721Enumerable (Incremental)"
    );
  });

  it(`${accounts.length} users burn a random token for ERC721Enumerable (Incremental)`, async () => {
    await launchBurns(
      ERC721Enumerable_Incremental,
      "ERC721Enumerable (Incremental)"
    );
  });

  // ERC721A (Incremental)
  it(`${accounts.length} users mint for ERC721A (Incremental)`, async () => {
    await launchMints(ERC721A_Incremental, "ERC721A (Incremental)");
  });

  it(`${
    accounts.length - 1
  } users transfer a random token to the first user for ERC721A (Incremental)`, async () => {
    await launchTransfers(ERC721A_Incremental, "ERC721A (Incremental)");
  });

  it(`${accounts.length} users burn a random token for ERC721A (Incremental)`, async () => {
    await launchBurns(ERC721A_Incremental, "ERC721A (Incremental)");
  });

  // ERC721 (Random with hash)
  it(`${accounts.length} users mint for ERC721 (Random with hash)`, async () => {
    await launchMints(ERC721_RandomWithHash, "ERC721 (Random with hash)");
  });

  it(`${
    accounts.length - 1
  } users transfer a random token to the first user for ERC721 (Random with hash)`, async () => {
    await launchTransfers(ERC721_RandomWithHash, "ERC721 (Random with hash)");
  });

  it(`${accounts.length} users burn a random token for ERC721 (Random with hash)`, async () => {
    await launchBurns(ERC721_RandomWithHash, "ERC721 (Random with hash)");
  });

  // ERC721 (Random with hash)
  it(`${accounts.length} users mint for ERC721Enumerable (Random with hash)`, async () => {
    await launchMints(
      ERC721Enumerable_RandomWithHash,
      "ERC721Enumerable (Random with hash)"
    );
  });

  it(`${
    accounts.length - 1
  } users transfer a random token to the first user for ERC721Enumerable (Random with hash)`, async () => {
    await launchTransfers(
      ERC721Enumerable_RandomWithHash,
      "ERC721Enumerable (Random with hash)"
    );
  });

  it(`${accounts.length} users burn a random token for ERC721Enumerable (Random with hash)`, async () => {
    await launchBurns(
      ERC721Enumerable_RandomWithHash,
      "ERC721Enumerable (Random with hash)"
    );
  });

  // GAS STATS
  it(`END`, async () => {
    gasStats.consoleStats("ERC721 (Incremental)");
  });
});
