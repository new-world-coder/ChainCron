// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";
import "@openzeppelin/contracts/security/Pausable.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";

/**
 * @title CreatorTools
 * @dev Smart contract for workflow creators to manage their workflows and revenue
 * @notice Handles revenue sharing, workflow management, and creator analytics
 */
contract CreatorTools is Ownable, ReentrancyGuard, Pausable {
    using SafeERC20 for IERC20;

    // Events
    event WorkflowPublished(
        address indexed creator,
        uint256 indexed workflowId,
        string name,
        string description,
        uint256 price,
        uint256 creatorFee
    );
    
    event RevenueWithdrawn(
        address indexed creator,
        uint256 amount,
        uint256 workflowId,
        uint256 timestamp
    );
    
    event WorkflowUpdated(
        address indexed creator,
        uint256 indexed workflowId,
        string newDescription,
        uint256 newPrice
    );
    
    event WorkflowPaused(address indexed creator, uint256 indexed workflowId);
    event WorkflowResumed(address indexed creator, uint256 indexed workflowId);

    // Struct to store workflow information
    struct WorkflowInfo {
        address creator;              // Creator's address
        string name;                 // Workflow name
        string description;          // Workflow description
        uint256 price;               // Subscription price (in wei)
        uint256 creatorFee;          // Creator's fee percentage (basis points)
        uint256 totalSubscribers;    // Total number of subscribers
        uint256 totalRevenue;         // Total revenue generated
        uint256 creatorEarnings;     // Creator's earnings
        bool isActive;               // Whether workflow is active
        uint256 createdAt;           // Creation timestamp
        uint256 lastUpdated;         // Last update timestamp
    }

    // Struct for revenue distribution
    struct RevenueDistribution {
        uint256 platformFee;         // Platform fee percentage (basis points)
        uint256 creatorFee;          // Creator fee percentage (basis points)
        uint256 totalFees;           // Total fees (should equal 10000)
    }

    // State variables
    mapping(uint256 => WorkflowInfo) public workflows;
    mapping(address => uint256[]) public creatorWorkflows;
    mapping(address => uint256) public creatorTotalEarnings;
    mapping(address => uint256) public creatorPendingWithdrawals;
    
    uint256 public nextWorkflowId = 1;
    uint256 public totalWorkflows = 0;
    uint256 public totalPlatformRevenue = 0;
    
    // Revenue distribution settings
    RevenueDistribution public revenueDistribution = RevenueDistribution({
        platformFee: 2000,  // 20% platform fee
        creatorFee: 8000,   // 80% creator fee
        totalFees: 10000    // 100% total
    });
    
    // Payment token (e.g., USDC, DAI)
    IERC20 public paymentToken;
    
    // Modifiers
    modifier onlyCreator(uint256 workflowId) {
        require(workflows[workflowId].creator == msg.sender, "Not the creator");
        _;
    }
    
    modifier validWorkflow(uint256 workflowId) {
        require(workflowId > 0 && workflowId < nextWorkflowId, "Invalid workflow ID");
        require(workflows[workflowId].creator != address(0), "Workflow does not exist");
        _;
    }
    
    modifier validRevenueDistribution(uint256 platformFee, uint256 creatorFee) {
        require(platformFee + creatorFee == 10000, "Fees must sum to 100%");
        require(platformFee >= 1000, "Platform fee must be at least 10%");
        require(creatorFee >= 5000, "Creator fee must be at least 50%");
        _;
    }

    /**
     * @dev Constructor sets the payment token and initial owner
     * @param _paymentToken Address of the payment token (e.g., USDC)
     */
    constructor(address _paymentToken) {
        require(_paymentToken != address(0), "Invalid payment token");
        paymentToken = IERC20(_paymentToken);
    }

    /**
     * @dev Publish a new workflow
     * @param name Workflow name
     * @param description Workflow description
     * @param price Subscription price (in payment token units)
     * @param creatorFee Creator's fee percentage (basis points)
     */
    function publishWorkflow(
        string memory name,
        string memory description,
        uint256 price,
        uint256 creatorFee
    ) external nonReentrant whenNotPaused {
        require(bytes(name).length > 0, "Name cannot be empty");
        require(bytes(description).length > 0, "Description cannot be empty");
        require(price > 0, "Price must be greater than 0");
        require(creatorFee >= 5000 && creatorFee <= 9000, "Invalid creator fee");
        
        uint256 workflowId = nextWorkflowId++;
        
        workflows[workflowId] = WorkflowInfo({
            creator: msg.sender,
            name: name,
            description: description,
            price: price,
            creatorFee: creatorFee,
            totalSubscribers: 0,
            totalRevenue: 0,
            creatorEarnings: 0,
            isActive: true,
            createdAt: block.timestamp,
            lastUpdated: block.timestamp
        });
        
        creatorWorkflows[msg.sender].push(workflowId);
        totalWorkflows++;
        
        emit WorkflowPublished(msg.sender, workflowId, name, description, price, creatorFee);
    }

    /**
     * @dev Update workflow information
     * @param workflowId Workflow ID to update
     * @param newDescription New description
     * @param newPrice New price
     */
    function updateWorkflow(
        uint256 workflowId,
        string memory newDescription,
        uint256 newPrice
    ) external nonReentrant whenNotPaused onlyCreator(workflowId) validWorkflow(workflowId) {
        require(bytes(newDescription).length > 0, "Description cannot be empty");
        require(newPrice > 0, "Price must be greater than 0");
        
        WorkflowInfo storage workflow = workflows[workflowId];
        workflow.description = newDescription;
        workflow.price = newPrice;
        workflow.lastUpdated = block.timestamp;
        
        emit WorkflowUpdated(msg.sender, workflowId, newDescription, newPrice);
    }

    /**
     * @dev Pause a workflow
     * @param workflowId Workflow ID to pause
     */
    function pauseWorkflow(uint256 workflowId) external onlyCreator(workflowId) validWorkflow(workflowId) {
        WorkflowInfo storage workflow = workflows[workflowId];
        require(workflow.isActive, "Workflow already paused");
        
        workflow.isActive = false;
        emit WorkflowPaused(msg.sender, workflowId);
    }

    /**
     * @dev Resume a workflow
     * @param workflowId Workflow ID to resume
     */
    function resumeWorkflow(uint256 workflowId) external onlyCreator(workflowId) validWorkflow(workflowId) {
        WorkflowInfo storage workflow = workflows[workflowId];
        require(!workflow.isActive, "Workflow already active");
        
        workflow.isActive = true;
        emit WorkflowResumed(msg.sender, workflowId);
    }

    /**
     * @dev Process subscription payment and distribute revenue
     * @param workflowId Workflow ID
     * @param subscriber Subscriber address
     * @param amount Payment amount
     */
    function processSubscription(
        uint256 workflowId,
        address subscriber,
        uint256 amount
    ) external nonReentrant validWorkflow(workflowId) {
        WorkflowInfo storage workflow = workflows[workflowId];
        require(workflow.isActive, "Workflow is not active");
        require(amount == workflow.price, "Incorrect payment amount");
        
        // Transfer payment from subscriber to contract
        paymentToken.safeTransferFrom(subscriber, address(this), amount);
        
        // Calculate revenue distribution
        uint256 platformRevenue = (amount * revenueDistribution.platformFee) / 10000;
        uint256 creatorRevenue = (amount * workflow.creatorFee) / 10000;
        
        // Update workflow statistics
        workflow.totalSubscribers++;
        workflow.totalRevenue += amount;
        workflow.creatorEarnings += creatorRevenue;
        
        // Update creator earnings
        creatorTotalEarnings[workflow.creator] += creatorRevenue;
        creatorPendingWithdrawals[workflow.creator] += creatorRevenue;
        
        // Update platform revenue
        totalPlatformRevenue += platformRevenue;
    }

    /**
     * @dev Withdraw creator earnings
     */
    function withdrawEarnings() external nonReentrant {
        uint256 amount = creatorPendingWithdrawals[msg.sender];
        require(amount > 0, "No earnings to withdraw");
        
        creatorPendingWithdrawals[msg.sender] = 0;
        paymentToken.safeTransfer(msg.sender, amount);
        
        emit RevenueWithdrawn(msg.sender, amount, 0, block.timestamp);
    }

    /**
     * @dev Withdraw earnings for a specific workflow
     * @param workflowId Workflow ID
     */
    function withdrawWorkflowEarnings(uint256 workflowId) external nonReentrant onlyCreator(workflowId) validWorkflow(workflowId) {
        WorkflowInfo storage workflow = workflows[workflowId];
        uint256 amount = workflow.creatorEarnings;
        
        require(amount > 0, "No earnings for this workflow");
        
        workflow.creatorEarnings = 0;
        creatorPendingWithdrawals[msg.sender] -= amount;
        paymentToken.safeTransfer(msg.sender, amount);
        
        emit RevenueWithdrawn(msg.sender, amount, workflowId, block.timestamp);
    }

    /**
     * @dev Get creator's workflow statistics
     * @param creator Creator address
     * @return totalWorkflows Number of workflows created
     * @return totalSubscribers Total subscribers across all workflows
     * @return totalRevenue Total revenue generated
     * @return totalEarnings Total earnings
     */
    function getCreatorStats(address creator) external view returns (
        uint256 totalWorkflows,
        uint256 totalSubscribers,
        uint256 totalRevenue,
        uint256 totalEarnings
    ) {
        uint256[] memory workflowIds = creatorWorkflows[creator];
        
        for (uint256 i = 0; i < workflowIds.length; i++) {
            WorkflowInfo memory workflow = workflows[workflowIds[i]];
            totalSubscribers += workflow.totalSubscribers;
            totalRevenue += workflow.totalRevenue;
            totalEarnings += workflow.creatorEarnings;
        }
        
        totalWorkflows = workflowIds.length;
    }

    /**
     * @dev Get workflow information
     * @param workflowId Workflow ID
     * @return WorkflowInfo struct
     */
    function getWorkflowInfo(uint256 workflowId) external view validWorkflow(workflowId) returns (WorkflowInfo memory) {
        return workflows[workflowId];
    }

    /**
     * @dev Get creator's workflows
     * @param creator Creator address
     * @return Array of workflow IDs
     */
    function getCreatorWorkflows(address creator) external view returns (uint256[] memory) {
        return creatorWorkflows[creator];
    }

    /**
     * @dev Get creator's pending withdrawals
     * @param creator Creator address
     * @return Pending withdrawal amount
     */
    function getPendingWithdrawals(address creator) external view returns (uint256) {
        return creatorPendingWithdrawals[creator];
    }

    /**
     * @dev Update revenue distribution (only owner)
     * @param platformFee New platform fee percentage
     * @param creatorFee New creator fee percentage
     */
    function updateRevenueDistribution(
        uint256 platformFee,
        uint256 creatorFee
    ) external onlyOwner validRevenueDistribution(platformFee, creatorFee) {
        revenueDistribution.platformFee = platformFee;
        revenueDistribution.creatorFee = creatorFee;
        revenueDistribution.totalFees = platformFee + creatorFee;
    }

    /**
     * @dev Withdraw platform revenue (only owner)
     * @param amount Amount to withdraw
     */
    function withdrawPlatformRevenue(uint256 amount) external onlyOwner {
        require(amount <= totalPlatformRevenue, "Insufficient platform revenue");
        require(amount <= paymentToken.balanceOf(address(this)), "Insufficient contract balance");
        
        totalPlatformRevenue -= amount;
        paymentToken.safeTransfer(owner(), amount);
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
