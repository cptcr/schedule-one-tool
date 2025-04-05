import chalk from "chalk";
import * as fs from "fs";
import readline from "node:readline";
import { stdin as input, stdout as output } from "node:process";
import path from "node:path";
import { promises as fsPromises } from "fs";

const rl = readline.createInterface({ input, output });

let pathFOUND: string;
let selectedAccount: string;
let selectedGame: string;

async function printStart() {
    console.clear();
    console.log(chalk.green("SCHEDULE 1 - TOOL"));
    console.log(chalk.green("Made with love by cptcr"));
}

async function listAccounts(sanitizedPath: string): Promise<string[]> {
    try {
        const savesPath = path.join(sanitizedPath, "Saves");
        const files = await fsPromises.readdir(savesPath, { withFileTypes: true });
        const directories = files.filter(file => file.isDirectory()).map(file => file.name);

        console.log(chalk.blue("Found these accounts on Schedule 1:"));
        directories.forEach((account, index) => {
            console.log(`${index + 1}. ${account}`);
        });

        return directories;
    } catch (err) {
        console.error(chalk.red("Error reading accounts:"), err);
        return [];
    }
}

async function selectAccount(accounts: string[]): Promise<string> {
    return new Promise<string>((resolve) => {
        rl.question("Enter the number of the account to select: ", (input) => {
            const selectedAccountIndex = parseInt(input.trim()) - 1;
            if (selectedAccountIndex >= 0 && selectedAccountIndex < accounts.length) {
                selectedAccount = accounts[selectedAccountIndex];
                resolve(selectedAccount);
            } else {
                console.log(chalk.red("Invalid selection. Please try again."));
                selectAccount(accounts).then(resolve);
            }
        });
    });
}

async function listSaveGames(accountPath: string): Promise<string[]> {
    try {
        const accountFolderPath = path.join(accountPath);
        const files = await fsPromises.readdir(accountFolderPath, { withFileTypes: true });

        const directories = files.filter(file => file.isDirectory() && file.name.startsWith("SaveGame_")).map(file => file.name);

        if (directories.length === 0) {
            console.log(chalk.red("No save games found for this account."));
            return [];
        }

        console.log(chalk.blue("Found these games for the selected account:"));
        directories.forEach((game, index) => {
            console.log(`${index + 1}. ${game}`);
        });

        return directories;
    } catch (err) {
        console.error(chalk.red("Error reading save games:"), err);
        return [];
    }
}

async function selectGame(games: string[]): Promise<string> {
    return new Promise<string>((resolve) => {
        rl.question("Enter the number of the SaveGame to select: ", (input) => {
            const selectedGameIndex = parseInt(input.trim()) - 1;
            if (selectedGameIndex >= 0 && selectedGameIndex < games.length) {
                selectedGame = games[selectedGameIndex];
                resolve(selectedGame);
            } else {
                console.log(chalk.red("Invalid selection. Please try again."));
                selectGame(games).then(resolve);
            }
        });
    });
}

async function modifyBusiness(gamePath: string) {
    const businessPath = path.join(gamePath, "Businesses");
    const businesses = ["Car Wash", "Laundromat", "Post Office", "Taco Ticklers"];
    console.clear();
    console.log(chalk.blue("Select a Business to Modify"));

    businesses.forEach((business, index) => {
        console.log(`${index + 1}. ${business}`);
    });

    return new Promise<void>((resolve) => {
        rl.question("Enter the number to modify the selected business: ", async (input) => {
            const businessIndex = parseInt(input.trim()) - 1;
            if (businessIndex >= 0 && businessIndex < businesses.length) {
                const businessName = businesses[businessIndex];
                const businessJsonPath = path.join(businessPath, businessName, "Business.json");

                try {
                    const businessData = JSON.parse(await fsPromises.readFile(businessJsonPath, "utf-8"));
                    businessData.IsOwned = true;
                    await fsPromises.writeFile(businessJsonPath, JSON.stringify(businessData, null, 2));
                    console.log(chalk.green(`Successfully modified ${businessName} to be owned.`));
                } catch (err) {
                    console.error(chalk.red("Error modifying business:"), err);
                }
                resolve();
            } else {
                console.log(chalk.red("Invalid selection. Please try again."));
                modifyBusiness(gamePath).then(resolve);
            }
        });
    });
}

async function modifyBalance(gamePath: string) {
    const moneyJsonPath = path.join(gamePath, "Money.json");
    console.clear();
    console.log(chalk.blue("Modify Balance or Networth"));

    return new Promise<void>((resolve) => {
        rl.question("Enter new Online Balance: ", async (onlineBalance) => {
            rl.question("Enter new Networth: ", async (networth) => {
                try {
                    const moneyData = JSON.parse(await fsPromises.readFile(moneyJsonPath, "utf-8"));
                    moneyData.OnlineBalance = parseFloat(onlineBalance);
                    moneyData.Networth = parseFloat(networth);
                    await fsPromises.writeFile(moneyJsonPath, JSON.stringify(moneyData, null, 2));
                    console.log(chalk.green("Successfully modified Balance and Networth."));
                } catch (err) {
                    console.error(chalk.red("Error modifying balance:"), err);
                }
                resolve();
            });
        });
    });
}

async function modifyWeeklyDepositSum(gamePath: string) {
    const moneyJsonPath = path.join(gamePath, "Money.json");
    console.clear();
    console.log(chalk.blue("Modify Weekly Deposit Sum"));

    return new Promise<void>((resolve) => {
        rl.question("Set Weekly Deposit Sum to 0 (press Enter to confirm): ", async () => {
            try {
                const moneyData = JSON.parse(await fsPromises.readFile(moneyJsonPath, "utf-8"));
                moneyData.WeeklyDepositSum = 0;
                await fsPromises.writeFile(moneyJsonPath, JSON.stringify(moneyData, null, 2));
                console.log(chalk.green("Successfully modified Weekly Deposit Sum to 0."));
            } catch (err) {
                console.error(chalk.red("Error modifying Weekly Deposit Sum:"), err);
            }
            resolve();
        });
    });
}

async function modifyInternalLawIntensity(gamePath: string) {
    const lawJsonPath = path.join(gamePath, "Law.json");
    console.clear();
    console.log(chalk.blue("Modify Internal Law Intensity"));

    return new Promise<void>((resolve) => {
        rl.question("Enter new Internal Law Intensity (e.g., 0.25): ", async (intensity) => {
            try {
                const lawData = JSON.parse(await fsPromises.readFile(lawJsonPath, "utf-8"));
                lawData.InternalLawIntensity = parseFloat(intensity);
                await fsPromises.writeFile(lawJsonPath, JSON.stringify(lawData, null, 2));
                console.log(chalk.green("Successfully modified Internal Law Intensity."));
            } catch (err) {
                console.error(chalk.red("Error modifying internal law intensity:"), err);
            }
            resolve();
        });
    });
}

async function handleMenuSelection(gamePath: string) {
    let exitMenu = false;
    while (!exitMenu) {
        console.clear();
        console.log(chalk.blue("Select an option:"));
        console.log("1. Modify Business");
        console.log("2. Modify Balance");
        console.log("3. Modify Weekly Deposit Sum");
        console.log("4. Modify Internal Law Intensity");
        console.log("5. Exit");

        await new Promise<void>((resolve) => {
            rl.question("Enter your option number: ", async (option) => {
                switch (option.trim()) {
                    case "1":
                        await modifyBusiness(gamePath);
                        break;
                    case "2":
                        await modifyBalance(gamePath);
                        break;
                    case "3":
                        await modifyWeeklyDepositSum(gamePath);
                        break;
                    case "4":
                        await modifyInternalLawIntensity(gamePath);
                        break;
                    case "5":
                        console.log(chalk.green("Exiting..."));
                        exitMenu = true;
                        break;
                    default:
                        console.log(chalk.red("Invalid selection. Please try again."));
                        break;
                }
                resolve();
            });
        });
    }
}

async function main() {
    await printStart();

    await console.log(chalk.magenta("To get the path do this: \n1. Press the Windows key and R \n2. Enter %AppData%Low (Default Steam Installer Path, if you have installed it in another folder/drive, please use the correct path) \n3. Open the TVGS Folder \n4. Open the Schedule 1 Folder \n5. Right-Click on the bar on the top on Schedule One and select \"Copy Adress\" \n6. Paste it below using CTRL + V \n7. Press ENTER"))
    rl.question("Enter your Schedule 1 path (e.g., C:/Users/yourname/AppData/LocalLow/TVGS/Schedule I): ", async (inputPath) => {
        const sanitizedPath = inputPath.trim().replace(/\\/g, "/");

        try {
            const accounts = await listAccounts(sanitizedPath);
            const selectedAccount = await selectAccount(accounts);
            const accountPath = path.join(sanitizedPath, "Saves", selectedAccount);

            const games = await listSaveGames(accountPath);
            if (games.length === 0) {
                rl.close();
                return;
            }
            const selectedGame = await selectGame(games);
            const gamePath = path.join(accountPath, selectedGame);

            await handleMenuSelection(gamePath);
            rl.close();
        } catch (err) {
            console.error(chalk.red("Error:", err));
            rl.close();
        }
    });
}

main();
