import * as fs from "fs";
import * as path from "path";
import * as readline from "readline";
import chalk from "chalk";
import * as os from "os";
import inquirer from "inquirer"; // Import inquirer for interactive prompts

const basePath = path.join(
  os.homedir(),
  "AppData",
  "LocalLow",
  "TVGS",
  "Schedule I",
);

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

const displayHeader = (title: string) => {
  console.clear();
  console.log(chalk.blue.bold("=============================="));
  console.log(chalk.blue.bold(` ${title} `));
  console.log(chalk.blue.bold("=============================="));
};

const listAccounts = () => {
  displayHeader("Select an Account");
  const savesPath = path.join(basePath, "Saves");
  if (!fs.existsSync(savesPath)) {
    console.error(
      chalk.red(`Error: The directory ${savesPath} does not exist.`),
    );
    return;
  }
  fs.readdir(savesPath, (err, files) => {
    if (err) {
      console.error(chalk.red("Error reading accounts:"), err);
      return;
    }
    if (files.length === 0) {
      console.log(chalk.yellow("No accounts found."));
      askToModifyMore();
      return;
    }
    displayGrid(files);
    rl.question("Enter the number of the account: ", (answer) => {
      const accountIndex = parseInt(answer) - 1;
      if (
        isNaN(accountIndex) ||
        accountIndex < 0 ||
        accountIndex >= files.length
      ) {
        console.log(chalk.red("Invalid selection."));
        listAccounts();
        return;
      }
      const accountPath = path.join(savesPath, files[accountIndex]);
      listGames(accountPath);
    });
  });
};

const listGames = (accountPath: string) => {
  displayHeader("Select a Game");
  fs.readdir(accountPath, (err, files) => {
    if (err) {
      console.error(chalk.red("Error reading games:"), err);
      return;
    }
    if (files.length === 0) {
      console.log(chalk.yellow("No games found."));
      askToModifyMore();
      return;
    }
    displayGrid(files);
    rl.question("Enter the number of the game: ", (answer) => {
      const gameIndex = parseInt(answer) - 1;
      if (isNaN(gameIndex) || gameIndex < 0 || gameIndex >= files.length) {
        console.log(chalk.red("Invalid selection."));
        listGames(accountPath);
        return;
      }
      const gamePath = path.join(accountPath, files[gameIndex]);
      listGameOptions(gamePath);
    });
  });
};

const listGameOptions = (gamePath: string) => {
  displayHeader("Select an Option");
  console.log(chalk.green("1. Change Law Intensity"));
  console.log(chalk.green("2. Change Money"));
  console.log(chalk.green("3. Modify Businesses"));
  console.log(chalk.green("4. Modify NPCs"));
  rl.question("Enter the number of the option: ", (answer) => {
    switch (parseInt(answer)) {
      case 1:
        changeLawIntensity(gamePath);
        break;
      case 2:
        changeMoney(gamePath);
        break;
      case 3:
        modifyBusinesses(gamePath);
        break;
      case 4:
        modifyNPCs(gamePath);
        break;
      default:
        console.log(chalk.red("Invalid option"));
        listGameOptions(gamePath);
        break;
    }
  });
};

const changeLawIntensity = (gamePath: string) => {
  displayHeader("Change Law Intensity");
  const lawFilePath = path.join(gamePath, "Law.json");
  fs.readFile(lawFilePath, "utf8", (err, data) => {
    if (err) {
      console.error(chalk.red("Error reading Law.json:"), err);
      return;
    }
    try {
      const lawData = JSON.parse(data);
      lawData.InternalLawIntensity = 0;
      fs.writeFile(lawFilePath, JSON.stringify(lawData, null, 2), (err) => {
        if (err) {
          console.error(chalk.red("Error writing Law.json:"), err);
          return;
        }
        console.log(chalk.green("Law intensity changed successfully!"));
        askToModifyMore();
      });
    } catch (e) {
      console.error(chalk.red("Error parsing Law.json:"), e);
    }
  });
};

const changeMoney = (gamePath: string) => {
  displayHeader("Change Money");
  const moneyFilePath = path.join(gamePath, "Money.json");
  rl.question("Enter new Online Balance: ", (onlineBalance) => {
    rl.question("Enter new Networth: ", (networth) => {
      rl.question("Enter new Weekly Deposit Sum: ", (weeklyDepositSum) => {
        fs.readFile(moneyFilePath, "utf8", (err, data) => {
          if (err) {
            console.error(chalk.red("Error reading Money.json:"), err);
            return;
          }
          try {
            const moneyData = JSON.parse(data);
            moneyData.OnlineBalance = parseFloat(onlineBalance);
            moneyData.Networth = parseFloat(networth);
            moneyData.WeeklyDepositSum = parseFloat(weeklyDepositSum);
            fs.writeFile(
              moneyFilePath,
              JSON.stringify(moneyData, null, 2),
              (err) => {
                if (err) {
                  console.error(chalk.red("Error writing Money.json:"), err);
                  return;
                }
                console.log(chalk.green("Money changed successfully!"));
                askToModifyMore();
              },
            );
          } catch (e) {
            console.error(chalk.red("Error parsing Money.json:"), e);
          }
        });
      });
    });
  });
};

const modifyBusinesses = (gamePath: string) => {
  displayHeader("Modify Businesses");
  const businessesPath = path.join(gamePath, "Businesses");
  fs.readdir(businessesPath, (err, files) => {
    if (err) {
      console.error(chalk.red("Error reading businesses:"), err);
      return;
    }
    if (files.length === 0) {
      console.log(chalk.yellow("No businesses found."));
      askToModifyMore();
      return;
    }
    displayGrid(files);
    rl.question("Enter the number of the business: ", (answer) => {
      const businessIndex = parseInt(answer) - 1;
      if (
        isNaN(businessIndex) ||
        businessIndex < 0 ||
        businessIndex >= files.length
      ) {
        console.log(chalk.red("Invalid selection."));
        modifyBusinesses(gamePath);
        return;
      }
      const businessPath = path.join(
        businessesPath,
        files[businessIndex],
        "Business.json",
      );
      rl.question("Do you want to own this business? (yes/no): ", (own) => {
        fs.readFile(businessPath, "utf8", (err, data) => {
          if (err) {
            console.error(chalk.red("Error reading Business.json:"), err);
            return;
          }
          try {
            const businessData = JSON.parse(data);
            businessData.isOwned = own.toLowerCase() === "yes";
            fs.writeFile(
              businessPath,
              JSON.stringify(businessData, null, 2),
              (err) => {
                if (err) {
                  console.error(chalk.red("Error writing Business.json:"), err);
                  return;
                }
                console.log(chalk.green("Business modified successfully!"));
                askToModifyMore();
              },
            );
          } catch (e) {
            console.error(chalk.red("Error parsing Business.json:"), e);
          }
        });
      });
    });
  });
};

const modifyNPCs = (gamePath: string) => {
  displayHeader("Modify NPCs");
  const npcsPath = path.join(gamePath, "NPCs");

  fs.readdir(npcsPath, (err, files) => {
    if (err) {
      console.error(chalk.red("Error reading NPCs:"), err);
      return;
    }
    if (files.length === 0) {
      console.log(chalk.yellow("No NPCs found."));
      askToModifyMore();
      return;
    }

    // Use inquirer for NPC selection with arrow navigation
    const npcNames = files.map((file, index) => ({
      name: file,
      value: index,
    }));

    inquirer
      .prompt([
        {
          type: "list",
          name: "npcSelection",
          message: "Select an NPC:",
          choices: npcNames.map((npc, i) => ({
            name: i === 0 ? chalk.yellow(npc.name) : chalk.white(npc.name),
            value: npc.value,
          })),
          pageSize: 10,
          loop: false,
        },
      ])
      .then((answers) => {
        const npcIndex = answers.npcSelection;
        const npcPath = path.join(npcsPath, files[npcIndex]);

        rl.question("Do you want to unlock this NPC? (yes/no): ", (unlock) => {
          rl.question("Enter unlock type (integer): ", (unlockType) => {
            rl.question("Enter relationship delta (0-5): ", (relationDelta) => {
              const relationshipFilePath = path.join(
                npcPath,
                "Relationship.json",
              );
              fs.readFile(relationshipFilePath, "utf8", (err, data) => {
                if (err) {
                  console.error(
                    chalk.red("Error reading Relationship.json:"),
                    err,
                  );
                  return;
                }
                try {
                  const relationshipData = JSON.parse(data);
                  relationshipData.Unlocked = unlock.toLowerCase() === "yes";
                  relationshipData.UnlockType = parseInt(unlockType);
                  relationshipData.RelationDelta = parseFloat(relationDelta);

                  fs.writeFile(
                    relationshipFilePath,
                    JSON.stringify(relationshipData, null, 2),
                    (err) => {
                      if (err) {
                        console.error(
                          chalk.red("Error writing Relationship.json:"),
                          err,
                        );
                        return;
                      }
                      console.log(
                        chalk.green("NPC relationship modified successfully!"),
                      );
                      modifyNPCDebt(npcPath);
                    },
                  );
                } catch (e) {
                  console.error(
                    chalk.red("Error parsing Relationship.json:"),
                    e,
                  );
                }
              });
            });
          });
        });
      })
      .catch((err) => {
        console.error(chalk.red("Error in NPC selection:"), err);
      });
  });
};

const modifyNPCDebt = (npcPath: string) => {
  displayHeader("Modify NPC Debt");
  const npcFilePath = path.join(npcPath, "NPC.json");
  fs.readFile(npcFilePath, "utf8", (err, data) => {
    if (err) {
      console.error(chalk.red("Error reading NPC.json:"), err);
      askToModifyMore();
      return;
    }
    try {
      const npcData = JSON.parse(data);
      if ("debt" in npcData) {
        rl.question("Enter new debt value: ", (debt) => {
          npcData.debt = parseFloat(debt);
          fs.writeFile(npcFilePath, JSON.stringify(npcData, null, 2), (err) => {
            if (err) {
              console.error(chalk.red("Error writing NPC.json:"), err);
              return;
            }
            console.log(chalk.green("NPC debt modified successfully!"));
            askToModifyMore();
          });
        });
      } else {
        console.log(chalk.yellow("No debt variable found in NPC.json."));
        askToModifyMore();
      }
    } catch (e) {
      console.error(chalk.red("Error parsing NPC.json:"), e);
      askToModifyMore();
    }
  });
};

const displayGrid = (items: string[]) => {
  const columns = 3;
  for (let i = 0; i < items.length; i += columns) {
    const row = items
      .slice(i, i + columns)
      .map((item, index) => `${i + index + 1}. ${item}`)
      .join("  ");
    console.log(row);
  }
};

const askToModifyMore = () => {
  rl.question("Do you want to modify more? (yes/no): ", (answer) => {
    if (answer.toLowerCase() === "yes") {
      listAccounts();
    } else {
      console.log(chalk.green("Goodbye!"));
      rl.close();
      process.exit(0);
    }
  });
};

listAccounts();