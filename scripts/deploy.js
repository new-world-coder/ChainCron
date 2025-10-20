const { ethers } = require("hardhat");

async function main() {
  console.log("Starting deployment of Forte Cron contracts...");

  // Deploy a mock ERC20 token for payments (for testing)
  const MockERC20 = await ethers.getContractFactory("MockERC20");
  const mockToken = await MockERC20.deploy("Forte Cron Token", "FCT", ethers.parseEther("1000000"));
  await mockToken.waitForDeployment();
  const mockTokenAddress = await mockToken.getAddress();
  console.log("MockERC20 deployed to:", mockTokenAddress);

  // Deploy WorkflowRegistry
  const WorkflowRegistry = await ethers.getContractFactory("WorkflowRegistry");
  const workflowRegistry = await WorkflowRegistry.deploy();
  await workflowRegistry.waitForDeployment();
  const workflowRegistryAddress = await workflowRegistry.getAddress();
  console.log("WorkflowRegistry deployed to:", workflowRegistryAddress);

  // Deploy SubscriptionManager
  const SubscriptionManager = await ethers.getContractFactory("SubscriptionManager");
  const subscriptionManager = await SubscriptionManager.deploy(mockTokenAddress);
  await subscriptionManager.waitForDeployment();
  const subscriptionManagerAddress = await subscriptionManager.getAddress();
  console.log("SubscriptionManager deployed to:", subscriptionManagerAddress);

  // Deploy WorkflowExecutor
  const WorkflowExecutor = await ethers.getContractFactory("WorkflowExecutor");
  const workflowExecutor = await WorkflowExecutor.deploy();
  await workflowExecutor.waitForDeployment();
  const workflowExecutorAddress = await workflowExecutor.getAddress();
  console.log("WorkflowExecutor deployed to:", workflowExecutorAddress);

  // Set up cross-contract references
  console.log("Setting up contract references...");
  
  // Set registry address in subscription manager
  await subscriptionManager.setWorkflowRegistry(workflowRegistryAddress);
  console.log("Set workflow registry in subscription manager");

  // Set subscription manager address in executor
  await workflowExecutor.setSubscriptionManager(subscriptionManagerAddress);
  console.log("Set subscription manager in workflow executor");

  console.log("\n=== Deployment Summary ===");
  console.log("MockERC20 Token:", mockTokenAddress);
  console.log("WorkflowRegistry:", workflowRegistryAddress);
  console.log("SubscriptionManager:", subscriptionManagerAddress);
  console.log("WorkflowExecutor:", workflowExecutorAddress);

  console.log("\nDeployment completed successfully!");
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
