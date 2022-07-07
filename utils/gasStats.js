// gasStats
const gasStats = (module.exports = {
  gasUsed: [],
  addGasUsed: (contract, action, gas) => {
    gasStats.gasUsed.push({
      contract,
      action,
      gas: gas,
    });
  },
  getStats: () => {
    // Calculate total gas used by action => contracts
    const totalStats = gasStats.gasUsed.reduce((prev, curr) => {
      if (!prev[curr.action]) {
        prev[curr.action] = {};
      }
      prev[curr.action][curr.contract] = prev[curr.action][curr.contract] || {
        length: 0,
        total: 0,
      };

      const actionData = prev[curr.action][curr.contract];
      actionData.length++;
      actionData.total += curr.gas;

      return prev;
    }, {});

    // Calculate average gas used by action => contracts
    for (action in totalStats) {
      for (contract in totalStats[action]) {
        totalStats[action][contract] = Math.round(
          totalStats[action][contract].total /
            totalStats[action][contract].length
        );
      }
    }

    return totalStats;
  },
  consoleStats: (referenceContract = 0) => {
    const stats = gasStats.getStats();

    // The reference contract is the contract that will be displayed as having the most common gas expenses
    const referenceValues = {};

    // Set min and max gas cost by action
    let minValues = {};
    let maxValues = {};
    for (action in stats) {
      referenceValues[action] = stats[action][referenceContract];
      for (contract in stats[action]) {
        const gasUsed = stats[action][contract];
        if (!minValues[action] && !maxValues[action]) {
          minValues[action] = gasUsed;
          maxValues[action] = gasUsed;
        } else {
          minValues[action] =
            gasUsed < minValues[action] ? gasUsed : minValues[action];
          maxValues[action] =
            gasUsed > maxValues[action] ? gasUsed : maxValues[action];
        }
      }
    }

    // Gas used printed format
    for (action in stats) {
      for (contract in stats[action]) {
        const gasUsed = stats[action][contract];
        const percentage = referenceValues[action]
          ? Math.round(
              (100 * (gasUsed - referenceValues[action])) /
                referenceValues[action]
            )
          : null;

        if (percentage && percentage > 0) {
          stats[action][contract] = `${gasUsed} (+${percentage}%)`;
        } else if (percentage) {
          stats[action][contract] = `${gasUsed} (${percentage}%)`;
        } else {
          stats[action][contract] = `${gasUsed}`;
        }
      }
    }

    // Console stats
    console.log("\n\t================== GAS STATS ==================");
    console.table(stats);
  },
});
