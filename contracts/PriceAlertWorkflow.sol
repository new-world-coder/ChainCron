// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";
import "@openzeppelin/contracts/security/Pausable.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";

/**
 * @title PriceAlertWorkflow
 * @dev Smart contract for price alerts with automatic token swapping
 * @notice Monitors token prices and executes swaps when conditions are met
 */
contract PriceAlertWorkflow is Ownable, ReentrancyGuard, Pausable {
    using SafeERC20 for IERC20;

    // Events
    event AlertConfigured(
        address indexed user,
        address indexed tokenIn,
        address indexed tokenOut,
        uint256 targetPrice,
        uint256 amountIn,
        bool isAbove,
        uint256 slippageTolerance
    );
    
    event AlertTriggered(
        address indexed user,
        address indexed tokenIn,
        address indexed tokenOut,
        uint256 actualPrice,
        uint256 targetPrice,
        uint256 amountSwapped,
        uint256 amountReceived,
        uint256 timestamp
    );
    
    event AlertCancelled(address indexed user, uint256 alertId);
    event WorkflowPaused(address indexed user);
    event WorkflowResumed(address indexed user);

    // Struct to store price alert configuration
    struct PriceAlert {
        address tokenIn;              // Token to sell
        address tokenOut;             // Token to buy
        uint256 targetPrice;          // Target price (in tokenOut per tokenIn, scaled by 1e18)
        uint256 amountIn;             // Amount of tokenIn to swap
        bool isAbove;                 // True if alert triggers when price goes above target
        uint256 slippageTolerance;    // Maximum slippage allowed (basis points)
        bool isActive;                // Whether alert is active
        uint256 createdAt;            // Timestamp when alert was created
        uint256 triggeredAt;           // Timestamp when alert was triggered (0 if not triggered)
    }

    // State variables
    mapping(address => PriceAlert[]) public userAlerts;
    mapping(address => bool) public authorizedExecutors;
    
    // Price feed interface (simplified for MVP)
    mapping(address => uint256) public tokenPrices; // token => price in USD (scaled by 1e18)
    mapping(address => address) public dexRouters; // token => router address
    
    // Alert statistics
    mapping(address => uint256) public totalAlertsCreated;
    mapping(address => uint256) public totalAlertsTriggered;
    mapping(address => uint256) public totalVolumeSwapped;

    // Modifiers
    modifier onlyAuthorizedExecutor() {
        require(authorizedExecutors[msg.sender] || msg.sender == owner(), "Not authorized executor");
        _;
    }

    modifier validAlertConfig(
        address tokenIn,
        address tokenOut,
        uint256 targetPrice,
        uint256 amountIn,
        uint256 slippageTolerance
    ) {
        require(tokenIn != address(0), "Invalid tokenIn");
        require(tokenOut != address(0), "Invalid tokenOut");
        require(tokenIn != tokenOut, "Tokens must be different");
        require(targetPrice > 0, "Invalid target price");
        require(amountIn > 0, "Invalid amount");
        require(slippageTolerance > 0 && slippageTolerance <= 1000, "Invalid slippage"); // Max 10%
        _;
    }

    /**
     * @dev Constructor sets the deployer as the initial owner
     */
    constructor() {
        authorizedExecutors[msg.sender] = true;
    }

    /**
     * @dev Create a new price alert
     * @param tokenIn Token to sell
     * @param tokenOut Token to buy
     * @param targetPrice Target price (in tokenOut per tokenIn, scaled by 1e18)
     * @param amountIn Amount of tokenIn to swap
     * @param isAbove True if alert triggers when price goes above target
     * @param slippageTolerance Maximum slippage allowed (basis points)
     */
    function createAlert(
        address tokenIn,
        address tokenOut,
        uint256 targetPrice,
        uint256 amountIn,
        bool isAbove,
        uint256 slippageTolerance
    ) external nonReentrant whenNotPaused 
      validAlertConfig(tokenIn, tokenOut, targetPrice, amountIn, slippageTolerance) {
        
        // Check if user has sufficient balance
        require(IERC20(tokenIn).balanceOf(msg.sender) >= amountIn, "Insufficient balance");
        
        // Create new alert
        PriceAlert memory newAlert = PriceAlert({
            tokenIn: tokenIn,
            tokenOut: tokenOut,
            targetPrice: targetPrice,
            amountIn: amountIn,
            isAbove: isAbove,
            slippageTolerance: slippageTolerance,
            isActive: true,
            createdAt: block.timestamp,
            triggeredAt: 0
        });
        
        userAlerts[msg.sender].push(newAlert);
        totalAlertsCreated[msg.sender]++;
        
        emit AlertConfigured(msg.sender, tokenIn, tokenOut, targetPrice, amountIn, isAbove, slippageTolerance);
    }

    /**
     * @dev Execute price alert (called by authorized executor)
     * @param user The user whose alert to check
     * @param alertId Index of the alert in user's alert array
     */
    function executeAlert(address user, uint256 alertId) external onlyAuthorizedExecutor nonReentrant whenNotPaused {
        require(alertId < userAlerts[user].length, "Invalid alert ID");
        
        PriceAlert storage alert = userAlerts[user][alertId];
        require(alert.isActive, "Alert not active");
        require(alert.triggeredAt == 0, "Alert already triggered");
        
        // Check if price condition is met
        uint256 currentPrice = _getCurrentPrice(alert.tokenIn, alert.tokenOut);
        bool conditionMet = false;
        
        if (alert.isAbove) {
            conditionMet = currentPrice >= alert.targetPrice;
        } else {
            conditionMet = currentPrice <= alert.targetPrice;
        }
        
        if (!conditionMet) {
            return; // Condition not met, no action needed
        }
        
        // Execute the swap
        _executeSwap(user, alertId, currentPrice);
    }

    /**
     * @dev Internal function to execute the swap
     * @param user The user address
     * @param alertId Index of the alert
     * @param currentPrice Current price of the token pair
     */
    function _executeSwap(address user, uint256 alertId, uint256 currentPrice) internal {
        PriceAlert storage alert = userAlerts[user][alertId];
        
        // Calculate expected output amount
        uint256 expectedAmountOut = (alert.amountIn * currentPrice) / 1e18;
        
        // Apply slippage tolerance
        uint256 minAmountOut = (expectedAmountOut * (10000 - alert.slippageTolerance)) / 10000;
        
        // Check if user still has sufficient balance
        require(IERC20(alert.tokenIn).balanceOf(user) >= alert.amountIn, "Insufficient balance");
        
        // Transfer tokens from user to contract
        IERC20(alert.tokenIn).safeTransferFrom(user, address(this), alert.amountIn);
        
        // In a real implementation, this would:
        // 1. Approve DEX router
        // 2. Execute swap through router
        // 3. Transfer output tokens to user
        
        // For MVP, we'll simulate the swap
        uint256 actualAmountOut = _simulateSwap(alert.tokenIn, alert.tokenOut, alert.amountIn, minAmountOut);
        
        // Transfer output tokens to user
        IERC20(alert.tokenOut).safeTransfer(user, actualAmountOut);
        
        // Update alert status
        alert.isActive = false;
        alert.triggeredAt = block.timestamp;
        
        // Update statistics
        totalAlertsTriggered[user]++;
        totalVolumeSwapped[user] += alert.amountIn;
        
        emit AlertTriggered(
            user,
            alert.tokenIn,
            alert.tokenOut,
            currentPrice,
            alert.targetPrice,
            alert.amountIn,
            actualAmountOut,
            block.timestamp
        );
    }

    /**
     * @dev Simulate swap execution (simplified for MVP)
     * @param tokenIn Input token
     * @param tokenOut Output token
     * @param amountIn Input amount
     * @param minAmountOut Minimum output amount
     * @return Actual output amount
     */
    function _simulateSwap(
        address tokenIn,
        address tokenOut,
        uint256 amountIn,
        uint256 minAmountOut
    ) internal view returns (uint256) {
        // In a real implementation, this would call the DEX router
        // For MVP, we'll return a simulated amount based on current price
        
        uint256 currentPrice = _getCurrentPrice(tokenIn, tokenOut);
        uint256 expectedAmount = (amountIn * currentPrice) / 1e18;
        
        // Apply some simulated slippage (0.1-0.5%)
        uint256 slippage = (expectedAmount * (100 + (block.timestamp % 5))) / 10000;
        uint256 actualAmount = expectedAmount - slippage;
        
        require(actualAmount >= minAmountOut, "Slippage too high");
        
        return actualAmount;
    }

    /**
     * @dev Get current price of token pair
     * @param tokenIn Input token
     * @param tokenOut Output token
     * @return Price in tokenOut per tokenIn (scaled by 1e18)
     */
    function _getCurrentPrice(address tokenIn, address tokenOut) internal view returns (uint256) {
        // In a real implementation, this would query price feeds
        // For MVP, we'll use stored prices
        
        uint256 priceIn = tokenPrices[tokenIn];
        uint256 priceOut = tokenPrices[tokenOut];
        
        if (priceIn == 0) priceIn = 1e18; // Default $1
        if (priceOut == 0) priceOut = 1e18; // Default $1
        
        // Calculate price: priceIn / priceOut
        return (priceIn * 1e18) / priceOut;
    }

    /**
     * @dev Cancel an active alert
     * @param alertId Index of the alert to cancel
     */
    function cancelAlert(uint256 alertId) external nonReentrant {
        require(alertId < userAlerts[msg.sender].length, "Invalid alert ID");
        
        PriceAlert storage alert = userAlerts[msg.sender][alertId];
        require(alert.isActive, "Alert not active");
        require(alert.triggeredAt == 0, "Alert already triggered");
        
        alert.isActive = false;
        
        emit AlertCancelled(msg.sender, alertId);
    }

    /**
     * @dev Get all alerts for a user
     * @param user The user address
     * @return Array of PriceAlert structs
     */
    function getUserAlerts(address user) external view returns (PriceAlert[] memory) {
        return userAlerts[user];
    }

    /**
     * @dev Get active alerts for a user
     * @param user The user address
     * @return Array of active PriceAlert structs
     */
    function getActiveAlerts(address user) external view returns (PriceAlert[] memory) {
        PriceAlert[] memory allAlerts = userAlerts[user];
        uint256 activeCount = 0;
        
        // Count active alerts
        for (uint256 i = 0; i < allAlerts.length; i++) {
            if (allAlerts[i].isActive && allAlerts[i].triggeredAt == 0) {
                activeCount++;
            }
        }
        
        // Create array for active alerts
        PriceAlert[] memory activeAlerts = new PriceAlert[](activeCount);
        uint256 index = 0;
        
        for (uint256 i = 0; i < allAlerts.length; i++) {
            if (allAlerts[i].isActive && allAlerts[i].triggeredAt == 0) {
                activeAlerts[index] = allAlerts[i];
                index++;
            }
        }
        
        return activeAlerts;
    }

    /**
     * @dev Get alert statistics for a user
     * @param user The user address
     * @return created Total alerts created
     * @return triggered Total alerts triggered
     * @return volume Total volume swapped
     */
    function getUserStats(address user) external view returns (uint256 created, uint256 triggered, uint256 volume) {
        return (totalAlertsCreated[user], totalAlertsTriggered[user], totalVolumeSwapped[user]);
    }

    /**
     * @dev Check if any alerts need execution for a user
     * @param user The user address
     * @return True if any alerts need execution
     */
    function hasAlertsToExecute(address user) external view returns (bool) {
        PriceAlert[] memory alerts = userAlerts[user];
        
        for (uint256 i = 0; i < alerts.length; i++) {
            if (!alerts[i].isActive || alerts[i].triggeredAt != 0) {
                continue;
            }
            
            uint256 currentPrice = _getCurrentPrice(alerts[i].tokenIn, alerts[i].tokenOut);
            bool conditionMet = false;
            
            if (alerts[i].isAbove) {
                conditionMet = currentPrice >= alerts[i].targetPrice;
            } else {
                conditionMet = currentPrice <= alerts[i].targetPrice;
            }
            
            if (conditionMet) {
                return true;
            }
        }
        
        return false;
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
     * @dev Set token price (only owner)
     * @param token The token address
     * @param price Price in USD (scaled by 1e18)
     */
    function setTokenPrice(address token, uint256 price) external onlyOwner {
        require(token != address(0), "Invalid token address");
        tokenPrices[token] = price;
    }

    /**
     * @dev Set DEX router for a token (only owner)
     * @param token The token address
     * @param router The router address
     */
    function setDexRouter(address token, address router) external onlyOwner {
        require(token != address(0), "Invalid token address");
        dexRouters[token] = router;
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
