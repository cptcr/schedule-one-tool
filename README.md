
# **Schedule 1 Modify Tool Setup Guide**

This guide will walk you through the process of setting up and using the **Schedule 1 Modify Tool** to modify your **Schedule 1** game save files using **Git** for version control.

---

## **Step 1: Prerequisites**

Before we start, ensure you have the following installed:

1. **[Git](https://git-scm.com/downloads)**  
   Git is a version control system that allows you to clone the repository and manage changes.
   
   - After installing, verify that Git is installed by running the following command in your terminal or command prompt:
     ```bash
     git --version
     ```

2. **[Node.js (v22 or later)](https://nodejs.org/en/download)**  
   Node.js is a JavaScript runtime required to run the project. It also comes with **npm** (Node Package Manager), which is used to install dependencies.

   - To check if Node.js is installed, run:
     ```bash
     node -v
     ```

3. **[Visual Studio Code (VS Code)](https://code.visualstudio.com/download)**  
   This is an editor used to open and edit project files.

---

## **Step 2: Clone the GitHub Repository**

Now that you have **Git** installed, you can clone the repository to your local machine.

1. Open a terminal (Command Prompt or PowerShell on Windows, Terminal on macOS/Linux).
2. Navigate to the folder where you want to store the project (for example, your **Desktop**).
3. Run the following command to **clone** the repository from GitHub:

   ```bash
   git clone https://github.com/cptcr/schedule-one-tool.git
   ```

   This will create a folder named `schedule-one-tool` containing all the project files.

---

## **Step 3: Open the Project in Visual Studio Code**

1. Open **Visual Studio Code** (VS Code).
2. Click **File > Open Folder** and select the `schedule-one-tool` folder that was created when you cloned the repository.

---

## **Step 4: Install Dependencies**

Once the project is open in VS Code, you need to install the required packages (dependencies) for the tool to work.

1. Open the **Terminal** in VS Code by clicking on **Terminal > New Terminal**.
2. In the terminal, make sure you're inside the `schedule-one-tool` folder (the folder containing `package.json`).
3. Run the following command to install the necessary dependencies:

   ```bash
   npm install
   ```

   This command will install all the required packages listed in the `package.json` file.

---

## **Step 5: Install TypeScript and ts-node (If Not Already Installed)**

The tool is written in TypeScript, so you need **TypeScript** and **ts-node** to run the TypeScript files.

1. In the **Terminal**, check if TypeScript and ts-node are installed by running:

   ```bash
   tsc -v
   ts-node -v
   ```

2. If TypeScript or ts-node is not installed, install them globally by running:

   ```bash
   npm install -g typescript ts-node
   ```

---

## **Step 6: Run the Tool**

Now that everything is set up, you can run the tool!

1. In the **Terminal** inside **VS Code**, run the following command:

   ```bash
   npx ts-node src/index.ts
   ```

   This will execute the **index.ts** file, and you will be prompted with various options to modify your **Schedule 1** save files.

---

## **Step 7: Interact with the Tool**

The tool will allow you to modify the game's save files based on the options presented to you. Here's an example of how the tool works:

1. The tool will first ask you to provide the **path** to your **Schedule 1** save folder.
2. Then, it will show you a list of available **accounts** and allow you to select one.
3. After selecting an account, it will show you the **SaveGames** available for that account (e.g., SaveGame_1, SaveGame_2, etc.).
4. Next, you'll be asked to choose an option to modify, such as:
   - **Modify Business**
   - **Modify Balance**
   - **Modify Internal Law Intensity**
5. Based on your selection, you can make changes to specific JSON files, such as modifying the balance, setting businesses as owned, or adjusting the law intensity.

---

## **Step 8: Updating the Repository (Optional)**

If you want to keep your project up-to-date with changes from the original repository, you can pull the latest updates using Git.

1. In the **Terminal**, make sure you're in the project directory (`schedule-one-tool`).
2. Run the following command to pull the latest changes from the repository:

   ```bash
   git pull origin main
   ```

   This will download and apply any changes made in the original repository to your local project.

---

## **Troubleshooting**

1. **Missing Packages or Errors During Installation:**  
   If you encounter issues during `npm install`, make sure you're connected to the internet and try again.

2. **TypeScript Errors:**  
   Ensure that your `tsconfig.json` file is set up correctly. If TypeScript is not compiling, you may need to install it globally using the command provided earlier.

3. **Running the Tool:**  
   If you see any errors when running `npx ts-node src/index.ts`, make sure you're in the correct directory and all dependencies are installed.

---

## **Additional Notes**

- **Git**: Git is used to track changes and update your local copy of the project. You don't need to worry about it for now unless you want to contribute changes to the project.
  
- **Backup Your Save Files**: Always back up your **Schedule 1** save files before making any modifications.

- **ts-node**: This tool allows you to run TypeScript files directly, without manually compiling them into JavaScript.
