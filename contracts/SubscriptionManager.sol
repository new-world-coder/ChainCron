// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";
import "@openzeppelin/contracts/security/Pausable.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/utils/Address.sol";

/**
 * @title SubscriptionManager
 * @dev Contract for managing workflow subscriptions, payments, and renewals
 * @notice Handles subscription lifecycle including payment processing and expiry management
 */
contract SubscriptionManager is Ownable, ReentrancyGuard, Pausable {
    using Address for address payable;

    // Events
    event Subscribed(
        address indexed user,
        uint256 indexed workflowId,
        uint256 expiryTime,
        uint256 amountPaid
    );
    
    event Renewed(
        address indexed user,
        uint256 indexed workflowId,
        uint256 newExpiryTime,
        uint256 amountPaid
    );
    
    event Cancelled(
        address indexed user,
        uint256 indexed workflowId,
        uint256 cancelledAt
    );

    event PaymentTokenUpdated(address indexed newToken);
    event SubscriptionPeriodUpdated(uint256 newPeriod);

    // Struct to store subscription information
    struct Subscription {
        address user;
        uint256 workflowId;
        uint256 expiryTime;
        bool isActive;
        uint256 subscribedAt;
        uint256 lastRenewedAt;
    }

    // State variables
    IERC20 public paymentToken;
    uint256 public subscriptionPeriod = 30 days; // Default 30 days
    uint256 public nextSubscriptionId = 1;

    // Mappings
    mapping(address => mapping(uint256 => Subscription)) public userSubscriptions; // user => workflowId => subscription
    mapping(address => uint256[]) public userActiveWorkflows; // user => array of active workflow IDs
    mapping(uint256 => Subscription) public subscriptions; // subscriptionId => subscription
    mapping(address => uint256[]) public userSubscriptionHistory; // user => array of subscription IDs

    // External contracts (set by owner)
    address public workflowRegistryAddress;

    // Modifiers
    modifier onlyRegistry() {
        require(msg.sender == workflowRegistryAddress, "Only registry can call");
        _;
    }

    /**
     * @dev Constructor sets the payment token and initial owner
     * @param _paymentToken Address of the ERC20 token used for payments
     */
    constructor(address _paymentToken) {
        require(_paymentToken != address(0), "Invalid payment token address");
        paymentToken = IERC20(_paymentToken);
    }

    /**
     * @dev Set the workflow registry address
     * @param _registryAddress Address of the WorkflowRegistry contract
     */
    function setWorkflowRegistry(address _registryAddress) external onlyOwner {
        require(_registryAddress != address(0), "Invalid registry address");
        workflowRegistryAddress = _registryAddress;
    }

    /**
     * @dev Subscribe to a workflow
     * @param workflowId The ID of the workflow to subscribe to
     * @param price The subscription price in wei (should match registry price)
     */
    function subscribe(uint256 workflowId, uint256 price) external nonReentrant whenNotPaused {
        require(workflowId > 0, "Invalid workflow ID");
        require(price > 0, "Invalid price");
        
        // Check if user already has an active subscription
        require(!userSubscriptions[msg.sender][workflowId].isActive, "Already subscribed");

        uint256 expiryTime = block.timestamp + subscriptionPeriod;
        uint256 subscriptionId = nextSubscriptionId;

        // Transfer payment
        require(
            paymentToken.transferFrom(msg.sender, address(this), price),
            "Payment transfer failed"
        );

        // Create subscription
        Subscription memory newSubscription = Subscription({
            user: msg.sender,
            workflowId: workflowId,
            expiryTime: expiryTime,
            isActive: true,
            subscribedAt: block.timestamp,
            lastRenewedAt: block.timestamp
        });

        userSubscriptions[msg.sender][workflowId] = newSubscription;
        subscriptions[subscriptionId] = newSubscription;
        userActiveWorkflows[msg.sender].push(workflowId);
        userSubscriptionHistory[msg.sender].push(subscriptionId);

        nextSubscriptionId++;

        emit Subscribed(msg.sender, workflowId, expiryTime, price);
    }

    /**
     * @dev Renew an existing subscription
     * @param workflowId The ID of the workflow to renew
     * @param price The subscription price in wei
     */
    function renew(uint256 workflowId, uint256 price) external nonReentrant whenNotPaused {
        require(workflowId > 0, "Invalid workflow ID");
        require(price > 0, "Invalid price");
        
        Subscription storage subscription = userSubscriptions[msg.sender][workflowId];
        require(subscription.user == msg.sender, "No subscription found");
        require(
            subscription.isActive || block.timestamp > subscription.expiryTime,
            "Subscription still active"
        );

        uint256 newExpiryTime = block.timestamp + subscriptionPeriod;

        // Transfer payment
        require(
            paymentToken.transferFrom(msg.sender, address(this), price),
            "Payment transfer failed"
        );

        // Update subscription
        subscription.expiryTime = newExpiryTime;
        subscription.isActive = true;
        subscription.lastRenewedAt = block.timestamp;

        // Update the subscription record
        for (uint256 i = 0; i < nextSubscriptionId; i++) {
            if (subscriptions[i].user == msg.sender && 
                subscriptions[i].workflowId == workflowId &&
                subscriptions[i].isActive) {
                subscriptions[i].expiryTime = newExpiryTime;
                subscriptions[i].lastRenewedAt = block.timestamp;
                break;
            }
        }

        emit Renewed(msg.sender, workflowId, newExpiryTime, price);
    }

    /**
     * @dev Cancel a subscription
     * @param workflowId The ID of the workflow to cancel subscription for
     */
    function cancel(uint256 workflowId) external nonReentrant {
        require(workflowId > 0, "Invalid workflow ID");
        
        Subscription storage subscription = userSubscriptions[msg.sender][workflowId];
        require(subscription.user == msg.sender, "No subscription found");
        require(subscription.isActive, "Subscription not active");

        subscription.isActive = false;

        // Remove from active workflows array
        uint256[] storage activeWorkflows = userActiveWorkflows[msg.sender];
        for (uint256 i = 0; i < activeWorkflows.length; i++) {
            if (activeWorkflows[i] == workflowId) {
                activeWorkflows[i] = activeWorkflows[activeWorkflows.length - 1];
                activeWorkflows.pop();
                break;
            }
        }

        // Update the subscription record
        for (uint256 i = 0; i < nextSubscriptionId; i++) {
            if (subscriptions[i].user == msg.sender && 
                subscriptions[i].workflowId == workflowId &&
                subscriptions[i].isActive) {
                subscriptions[i].isActive = false;
                break;
            }
        }

        emit Cancelled(msg.sender, workflowId, block.timestamp);
    }

    /**
     * @dev Check if a user has an active subscription to a workflow
     * @param user The user address
     * @param workflowId The workflow ID
     * @return True if user has active subscription, false otherwise
     */
    function isSubscriptionActive(address user, uint256 workflowId) external view returns (bool) {
        Subscription memory subscription = userSubscriptions[user][workflowId];
        return subscription.isActive && block.timestamp <= subscription.expiryTime;
    }

    /**
     * @dev Get subscription details for a user and workflow
     * @param user The user address
     * @param workflowId The workflow ID
     * @return Subscription details
     */
    function getSubscription(address user, uint256 workflowId) external view returns (Subscription memory) {
        return userSubscriptions[user][workflowId];
    }

    /**
     * @dev Get all active workflow IDs for a user
     * @param user The user address
     * @return Array of active workflow IDs
     */
    function getUserActiveWorkflows(address user) external view returns (uint256[] memory) {
        uint256[] memory activeWorkflows = userActiveWorkflows[user];
        uint256 activeCount = 0;

        // Count active subscriptions
        for (uint256 i = 0; i < activeWorkflows.length; i++) {
            if (isSubscriptionActive(user, activeWorkflows[i])) {
                activeCount++;
            }
        }

        // Create array with only active subscriptions
        uint256[] memory result = new uint256[](activeCount);
        uint256 index = 0;
        for (uint256 i = 0; i < activeWorkflows.length; i++) {
            if (isSubscriptionActive(user, activeWorkflows[i])) {
                result[index] = activeWorkflows[i];
                index++;
            }
        }

        return result;
    }

    /**
     * @dev Get subscription history for a user
     * @param user The user address
     * @return Array of subscription IDs
     */
    function getUserSubscriptionHistory(address user) external view returns (uint256[] memory) {
        return userSubscriptionHistory[user];
    }

    /**
     * @dev Update payment token (only owner)
     * @param newToken Address of the new payment token
     */
    function updatePaymentToken(address newToken) external onlyOwner {
        require(newToken != address(0), "Invalid token address");
        paymentToken = IERC20(newToken);
        emit PaymentTokenUpdated(newToken);
    }

    /**
     * @dev Update subscription period (only owner)
     * @param newPeriod New subscription period in seconds
     */
    function updateSubscriptionPeriod(uint256 newPeriod) external onlyOwner {
        require(newPeriod > 0, "Period must be greater than 0");
        subscriptionPeriod = newPeriod;
        emit SubscriptionPeriodUpdated(newPeriod);
    }

    /**
     * @dev Withdraw collected payments (only owner)
     */
    function withdrawPayments() external onlyOwner {
        uint256 balance = paymentToken.balanceOf(address(this));
        require(balance > 0, "No balance to withdraw");
        
        require(
            paymentToken.transfer(owner(), balance),
            "Transfer to owner failed"
        );
    }

    /**
     * @dev Pause the contract
     */
    function pause() external onlyOwner {
        _pause();
    }

    /**
     * @dev Unpause the contract
     */
    function unpause() external onlyOwner {
        _unpause();
    }
}
