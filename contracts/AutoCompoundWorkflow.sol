// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";
import "@openzeppelin/contracts/security/Pausable.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";

/**
 * @title AutoCompoundWorkflow
 * @dev Smart contract for automatically compounding DeFi yield farming rewards
 * @notice Automatically harvests and reinvests yield farming rewards at specified intervals
 */
contract AutoCompoundWorkflow is Ownable, ReentrancyGuard, Pausable {
    using SafeERC20 for IERC20;

    // Events
    event WorkflowConfigured(
        address indexed user,
        address indexed yieldToken,
        address indexed rewardToken,
        uint256 minRewardThreshold,
        uint256 compoundInterval
    );
    
    event RewardsCompounded(
        address indexed user,
        address indexed yieldToken,
        uint256 rewardAmount,
        uint256 newBalance,
        uint256 timestamp
    );
    
    event WorkflowPaused(address indexed user);
    event WorkflowResumed(address indexed user);

    // Struct to store user workflow configuration
    struct WorkflowConfig {
        address yieldToken;           // Token being farmed (e.g., LP token)
        address rewardToken;         // Reward token to harvest
        uint256 minRewardThreshold;   // Minimum reward amount to trigger compounding
        uint256 compoundInterval;     // Time interval between compounding (in seconds)
        uint256 lastCompoundTime;     // Timestamp of last compounding
        bool isActive;               // Whether workflow is active
        uint256 totalCompounded;     // Total amount compounded over time
        uint256 compoundCount;       // Number of times compounded
    }

    // State variables
    mapping(address => WorkflowConfig) public userWorkflows;
    mapping(address => bool) public authorizedExecutors;
    
    // External protocol interfaces (simplified for MVP)
    mapping(address => address) public yieldFarmingContracts; // yieldToken => farming contract
    mapping(address => uint256) public currentAPY; // yieldToken => APY in basis points (10000 = 100%)

    // Modifiers
    modifier onlyAuthorizedExecutor() {
        require(authorizedExecutors[msg.sender] || msg.sender == owner(), "Not authorized executor");
        _;
    }

    modifier validWorkflowConfig(
        address yieldToken,
        address rewardToken,
        uint256 minRewardThreshold,
        uint256 compoundInterval
    ) {
        require(yieldToken != address(0), "Invalid yield token");
        require(rewardToken != address(0), "Invalid reward token");
        require(minRewardThreshold > 0, "Invalid threshold");
        require(compoundInterval >= 3600, "Interval too short"); // Minimum 1 hour
        _;
    }

    /**
     * @dev Constructor sets the deployer as the initial owner
     */
    constructor() {
        authorizedExecutors[msg.sender] = true;
    }

    /**
     * @dev Configure auto-compound workflow for a user
     * @param yieldToken The token being farmed (e.g., LP token)
     * @param rewardToken The reward token to harvest and compound
     * @param minRewardThreshold Minimum reward amount to trigger compounding
     * @param compoundInterval Time interval between compounding attempts
     */
    function configureWorkflow(
        address yieldToken,
        address rewardToken,
        uint256 minRewardThreshold,
        uint256 compoundInterval
    ) external nonReentrant whenNotPaused 
      validWorkflowConfig(yieldToken, rewardToken, minRewardThreshold, compoundInterval) {
        
        WorkflowConfig storage config = userWorkflows[msg.sender];
        
        config.yieldToken = yieldToken;
        config.rewardToken = rewardToken;
        config.minRewardThreshold = minRewardThreshold;
        config.compoundInterval = compoundInterval;
        config.lastCompoundTime = block.timestamp;
        config.isActive = true;
        
        emit WorkflowConfigured(msg.sender, yieldToken, rewardToken, minRewardThreshold, compoundInterval);
    }

    /**
     * @dev Execute auto-compound workflow (called by authorized executor)
     * @param user The user whose workflow to execute
     */
    function executeCompound(address user) external onlyAuthorizedExecutor nonReentrant whenNotPaused {
        WorkflowConfig storage config = userWorkflows[user];
        require(config.isActive, "Workflow not active");
        require(block.timestamp >= config.lastCompoundTime + config.compoundInterval, "Too soon to compound");
        
        // Check if user has sufficient rewards to compound
        uint256 pendingRewards = getPendingRewards(user);
        require(pendingRewards >= config.minRewardThreshold, "Insufficient rewards");
        
        // Execute compounding logic
        _performCompound(user, pendingRewards);
    }

    /**
     * @dev Internal function to perform the actual compounding
     * @param user The user whose rewards to compound
     * @param rewardAmount The amount of rewards to compound
     */
    function _performCompound(address user, uint256 rewardAmount) internal {
        WorkflowConfig storage config = userWorkflows[user];
        
        // In a real implementation, this would:
        // 1. Harvest rewards from the farming contract
        // 2. Swap rewards to the yield token (if needed)
        // 3. Add liquidity back to the farming contract
        // 4. Update user's position
        
        // For MVP, we'll simulate the compounding
        config.lastCompoundTime = block.timestamp;
        config.totalCompounded += rewardAmount;
        config.compoundCount += 1;
        
        // Simulate increasing user's yield token balance
        // In reality, this would come from the farming contract
        uint256 newBalance = getYieldTokenBalance(user) + rewardAmount;
        
        emit RewardsCompounded(user, config.yieldToken, rewardAmount, newBalance, block.timestamp);
    }

    /**
     * @dev Get pending rewards for a user (simplified for MVP)
     * @param user The user address
     * @return Amount of pending rewards
     */
    function getPendingRewards(address user) public view returns (uint256) {
        WorkflowConfig memory config = userWorkflows[user];
        if (!config.isActive || config.yieldToken == address(0)) {
            return 0;
        }
        
        // Simulate pending rewards based on time elapsed and APY
        uint256 timeElapsed = block.timestamp - config.lastCompoundTime;
        uint256 userBalance = getYieldTokenBalance(user);
        uint256 apy = currentAPY[config.yieldToken];
        
        if (apy == 0) {
            apy = 1000; // Default 10% APY for demo
        }
        
        // Calculate rewards: balance * APY * timeElapsed / (365 days * 10000)
        uint256 rewards = (userBalance * apy * timeElapsed) / (365 days * 10000);
        
        return rewards;
    }

    /**
     * @dev Get user's yield token balance (simplified for MVP)
     * @param user The user address
     * @return Balance of yield token
     */
    function getYieldTokenBalance(address user) public view returns (uint256) {
        WorkflowConfig memory config = userWorkflows[user];
        if (config.yieldToken == address(0)) {
            return 0;
        }
        
        // In a real implementation, this would query the farming contract
        // For MVP, we'll return a simulated balance
        return IERC20(config.yieldToken).balanceOf(user);
    }

    /**
     * @dev Get workflow configuration for a user
     * @param user The user address
     * @return WorkflowConfig struct
     */
    function getWorkflowConfig(address user) external view returns (WorkflowConfig memory) {
        return userWorkflows[user];
    }

    /**
     * @dev Pause user's workflow
     */
    function pauseWorkflow() external {
        WorkflowConfig storage config = userWorkflows[msg.sender];
        require(config.isActive, "Workflow not active");
        
        config.isActive = false;
        emit WorkflowPaused(msg.sender);
    }

    /**
     * @dev Resume user's workflow
     */
    function resumeWorkflow() external {
        WorkflowConfig storage config = userWorkflows[msg.sender];
        require(!config.isActive, "Workflow already active");
        
        config.isActive = true;
        config.lastCompoundTime = block.timestamp; // Reset timer
        emit WorkflowResumed(msg.sender);
    }

    /**
     * @dev Add or remove authorized executor (only owner)
     * @param executor Address of the executor
     * @param isAuthorized Whether to authorize the executor
     */
    function setExecutor(address executor, bool isAuthorized) external onlyOwner {
        require(executor != address(0), "Invalid executor address");
        authorizedExecutors[executor] = isAuthorized;
    }

    /**
     * @dev Set APY for a yield token (only owner)
     * @param yieldToken The yield token address
     * @param apy APY in basis points (10000 = 100%)
     */
    function setAPY(address yieldToken, uint256 apy) external onlyOwner {
        require(yieldToken != address(0), "Invalid token address");
        currentAPY[yieldToken] = apy;
    }

    /**
     * @dev Set farming contract for a yield token (only owner)
     * @param yieldToken The yield token address
     * @param farmingContract The farming contract address
     */
    function setFarmingContract(address yieldToken, address farmingContract) external onlyOwner {
        require(yieldToken != address(0), "Invalid token address");
        yieldFarmingContracts[yieldToken] = farmingContract;
    }

    /**
     * @dev Emergency pause function
     */
    function emergencyPause() external onlyOwner {
        _pause();
    }

    /**
     * @dev Unpause function
     */
    function unpause() external onlyOwner {
        _unpause();
    }
}
