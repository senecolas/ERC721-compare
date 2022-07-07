// Load modules
const cliProgress = require("cli-progress");

// Load artifacts
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

// Load utils
const gasStats = require("../utils/gasStats");

contract("Gas comparison", (accounts) => {
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
      gasStats.addGasUsed(
        contractName,
        `Mint ${amount}`,
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
      const usersTokens = usersTokensByContract[contractName][user];
      const tokenId =
        usersTokens[Math.floor(Math.random() * usersTokens.length)];

      const txData = await contract.transferFrom(user, accounts[0], tokenId, {
        from: user,
      });
      updateUsersTokens(txData, contractName); // Add ids to usersTokensByContract
      gasStats.addGasUsed(contractName, `Transfer 1`, txData.receipt.gasUsed);

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
        gasStats.addGasUsed(contractName, `Burn 1`, txData.receipt.gasUsed);
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

  [
    { artifact: ERC721_Incremental, name: "ERC721 (Incremental)" },
    { artifact: ERC721Votes_Incremental, name: "ERC721Votes (Incremental)" },
    {
      artifact: ERC721Enumerable_Incremental,
      name: "ERC721Enumerable (Incremental)",
    },
    { artifact: ERC721A_Incremental, name: "ERC721A (Incremental)" },
    { artifact: ERC721_RandomWithHash, name: "ERC721 (Random with hash)" },
    {
      artifact: ERC721Enumerable_RandomWithHash,
      name: "ERC721Enumerable (Random with hash)",
    },
  ].forEach((contract) => {
    describe(`\nTests for ${contract.name}`, function () {
      it(`Get gas for ${contract.name} deployment`, async () => {
        const instance = await contract.artifact.new();
        const tx = await web3.eth.getTransaction(instance.transactionHash);

        gasStats.addGasUsed(contract.name, `Deployment`, tx.gas);
      });

      it(`${accounts.length} users mint for ${contract.name}`, async () => {
        await launchMints(contract.artifact, contract.name);
      });

      it(`${
        accounts.length - 1
      } users transfer a random token to the first user for ${
        contract.name
      }`, async () => {
        await launchTransfers(contract.artifact, contract.name);
      });

      it(`${accounts.length} users burn a random token for ${contract.name}`, async () => {
        await launchBurns(contract.artifact, contract.name);
      });
    });
  });

  // GAS STATS
  describe(`\nEND`, function () {
    it(`Get stats`, async () => {
      gasStats.consoleStats("ERC721 (Incremental)");
    });
  });
});
