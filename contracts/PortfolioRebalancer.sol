// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";
import "@openzeppelin/contracts/security/Pausable.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";

/**
 * @title PortfolioRebalancer
 * @dev Smart contract for automatically rebalancing portfolio allocations
 * @notice Maintains target asset allocation by automatically buying/selling tokens
 */
contract PortfolioRebalancer is Ownable, ReentrancyGuard, Pausable {
    using SafeERC20 for IERC20;

    // Events
    event PortfolioConfigured(
        address indexed user,
        address[] tokens,
        uint256[] targetAllocations,
        uint256 rebalanceThreshold,
        uint256 rebalanceInterval
    );
    
    event PortfolioRebalanced(
        address indexed user,
        address[] tokens,
        uint256[] oldBalances,
        uint256[] newBalances,
        uint256 timestamp
    );
    
    event RebalanceThresholdUpdated(address indexed user, uint256 newThreshold);
    event WorkflowPaused(address indexed user);
    event WorkflowResumed(address indexed user);

    // Struct to store portfolio configuration
    struct PortfolioConfig {
        address[] tokens;              // Array of token addresses in portfolio
        uint256[] targetAllocations;   // Target allocation percentages (basis points)
        uint256 rebalanceThreshold;    // Threshold for triggering rebalance (basis points)
        uint256 rebalanceInterval;     // Minimum time between rebalances (seconds)
        uint256 lastRebalanceTime;     // Timestamp of last rebalance
        bool isActive;                 // Whether rebalancing is active
        uint256 totalRebalances;       // Total number of rebalances performed
        uint256 totalGasUsed;          // Total gas used for rebalancing
    }

    // Struct for rebalance operation
    struct RebalanceOperation {
        address tokenIn;
        address tokenOut;
        uint256 amountIn;
        uint256 amountOut;
        uint256 slippageTolerance;    // Maximum slippage allowed (basis points)
    }

    // State variables
    mapping(address => PortfolioConfig) public userPortfolios;
    mapping(address => bool) public authorizedExecutors;
    
    // DEX router interface (simplified for MVP)
    mapping(address => address) public dexRouters; // token => router address
    mapping(address => uint256) public tokenPrices; // token => price in USD (scaled by 1e18)

    // Modifiers
    modifier onlyAuthorizedExecutor() {
        require(authorizedExecutors[msg.sender] || msg.sender == owner(), "Not authorized executor");
        _;
    }

    modifier validPortfolioConfig(
        address[] memory tokens,
        uint256[] memory allocations,
        uint256 threshold,
        uint256 interval
    ) {
        require(tokens.length > 0, "No tokens specified");
        require(tokens.length == allocations.length, "Mismatched arrays");
        require(threshold > 0 && threshold <= 1000, "Invalid threshold"); // Max 10%
        require(interval >= 3600, "Interval too short"); // Minimum 1 hour
        
        uint256 totalAllocation = 0;
        for (uint256 i = 0; i < allocations.length; i++) {
            require(tokens[i] != address(0), "Invalid token address");
            require(allocations[i] > 0, "Invalid allocation");
            totalAllocation += allocations[i];
        }
        require(totalAllocation == 10000, "Allocations must sum to 100%"); // 10000 basis points = 100%
        _;
    }

    /**
     * @dev Constructor sets the deployer as the initial owner
     */
    constructor() {
        authorizedExecutors[msg.sender] = true;
    }

    /**
     * @dev Configure portfolio rebalancing for a user
     * @param tokens Array of token addresses in the portfolio
     * @param targetAllocations Target allocation percentages (in basis points)
     * @param rebalanceThreshold Threshold for triggering rebalance (in basis points)
     * @param rebalanceInterval Minimum time between rebalances (in seconds)
     */
    function configurePortfolio(
        address[] memory tokens,
        uint256[] memory targetAllocations,
        uint256 rebalanceThreshold,
        uint256 rebalanceInterval
    ) external nonReentrant whenNotPaused 
      validPortfolioConfig(tokens, targetAllocations, rebalanceThreshold, rebalanceInterval) {
        
        PortfolioConfig storage config = userPortfolios[msg.sender];
        
        // Clear existing configuration
        delete config.tokens;
        delete config.targetAllocations;
        
        // Set new configuration
        config.tokens = tokens;
        config.targetAllocations = targetAllocations;
        config.rebalanceThreshold = rebalanceThreshold;
        config.rebalanceInterval = rebalanceInterval;
        config.lastRebalanceTime = block.timestamp;
        config.isActive = true;
        
        emit PortfolioConfigured(msg.sender, tokens, targetAllocations, rebalanceThreshold, rebalanceInterval);
    }

    /**
     * @dev Execute portfolio rebalancing (called by authorized executor)
     * @param user The user whose portfolio to rebalance
     */
    function executeRebalance(address user) external onlyAuthorizedExecutor nonReentrant whenNotPaused {
        PortfolioConfig storage config = userPortfolios[user];
        require(config.isActive, "Portfolio not active");
        require(block.timestamp >= config.lastRebalanceTime + config.rebalanceInterval, "Too soon to rebalance");
        
        // Check if rebalancing is needed
        if (!_needsRebalancing(user)) {
            return; // No rebalancing needed
        }
        
        // Execute rebalancing
        _performRebalance(user);
    }

    /**
     * @dev Check if portfolio needs rebalancing
     * @param user The user address
     * @return True if rebalancing is needed
     */
    function needsRebalancing(address user) external view returns (bool) {
        return _needsRebalancing(user);
    }

    /**
     * @dev Internal function to check if rebalancing is needed
     * @param user The user address
     * @return True if rebalancing is needed
     */
    function _needsRebalancing(address user) internal view returns (bool) {
        PortfolioConfig memory config = userPortfolios[user];
        if (!config.isActive || config.tokens.length == 0) {
            return false;
        }
        
        // Calculate current allocations
        uint256 totalValue = _getPortfolioValue(user);
        if (totalValue == 0) {
            return false;
        }
        
        // Check if any token is outside the threshold
        for (uint256 i = 0; i < config.tokens.length; i++) {
            uint256 currentValue = _getTokenValue(user, config.tokens[i]);
            uint256 currentAllocation = (currentValue * 10000) / totalValue;
            uint256 targetAllocation = config.targetAllocations[i];
            
            // Check if deviation exceeds threshold
            if (currentAllocation > targetAllocation) {
                if (currentAllocation - targetAllocation > config.rebalanceThreshold) {
                    return true;
                }
            } else {
                if (targetAllocation - currentAllocation > config.rebalanceThreshold) {
                    return true;
                }
            }
        }
        
        return false;
    }

    /**
     * @dev Internal function to perform the actual rebalancing
     * @param user The user whose portfolio to rebalance
     */
    function _performRebalance(address user) internal {
        PortfolioConfig storage config = userPortfolios[user];
        
        // Calculate current portfolio value
        uint256 totalValue = _getPortfolioValue(user);
        if (totalValue == 0) {
            return;
        }
        
        // Store old balances for event
        uint256[] memory oldBalances = new uint256[](config.tokens.length);
        for (uint256 i = 0; i < config.tokens.length; i++) {
            oldBalances[i] = _getTokenValue(user, config.tokens[i]);
        }
        
        // Calculate target values and determine trades needed
        RebalanceOperation[] memory operations = _calculateRebalanceOperations(user, totalValue);
        
        // Execute trades (simplified for MVP - in reality would call DEX)
        for (uint256 i = 0; i < operations.length; i++) {
            _executeTrade(user, operations[i]);
        }
        
        // Update configuration
        config.lastRebalanceTime = block.timestamp;
        config.totalRebalances += 1;
        
        // Store new balances for event
        uint256[] memory newBalances = new uint256[](config.tokens.length);
        for (uint256 i = 0; i < config.tokens.length; i++) {
            newBalances[i] = _getTokenValue(user, config.tokens[i]);
        }
        
        emit PortfolioRebalanced(user, config.tokens, oldBalances, newBalances, block.timestamp);
    }

    /**
     * @dev Calculate rebalancing operations needed
     * @param user The user address
     * @param totalValue Total portfolio value
     * @return Array of rebalance operations
     */
    function _calculateRebalanceOperations(
        address user, 
        uint256 totalValue
    ) internal view returns (RebalanceOperation[] memory) {
        PortfolioConfig memory config = userPortfolios[user];
        
        // Calculate current and target values
        uint256[] memory currentValues = new uint256[](config.tokens.length);
        uint256[] memory targetValues = new uint256[](config.tokens.length);
        
        for (uint256 i = 0; i < config.tokens.length; i++) {
            currentValues[i] = _getTokenValue(user, config.tokens[i]);
            targetValues[i] = (totalValue * config.targetAllocations[i]) / 10000;
        }
        
        // Determine trades needed (simplified logic)
        RebalanceOperation[] memory operations = new RebalanceOperation[](config.tokens.length);
        uint256 operationCount = 0;
        
        for (uint256 i = 0; i < config.tokens.length; i++) {
            if (currentValues[i] > targetValues[i]) {
                // Token is overweight, need to sell
                uint256 excessAmount = currentValues[i] - targetValues[i];
                if (excessAmount > 0) {
                    operations[operationCount] = RebalanceOperation({
                        tokenIn: config.tokens[i],
                        tokenOut: address(0), // Will be determined by rebalancing logic
                        amountIn: excessAmount,
                        amountOut: 0,
                        slippageTolerance: 300 // 3% slippage tolerance
                    });
                    operationCount++;
                }
            }
        }
        
        // Resize array to actual count
        RebalanceOperation[] memory finalOperations = new RebalanceOperation[](operationCount);
        for (uint256 i = 0; i < operationCount; i++) {
            finalOperations[i] = operations[i];
        }
        
        return finalOperations;
    }

    /**
     * @dev Execute a trade (simplified for MVP)
     * @param user The user address
     * @param operation The rebalance operation
     */
    function _executeTrade(address user, RebalanceOperation memory operation) internal {
        // In a real implementation, this would:
        // 1. Check user's token balance
        // 2. Calculate optimal trade route
        // 3. Execute swap through DEX router
        // 4. Handle slippage protection
        // 5. Update balances
        
        // For MVP, we'll simulate the trade
        // This is where you'd integrate with Uniswap, SushiSwap, etc.
    }

    /**
     * @dev Get total portfolio value in USD
     * @param user The user address
     * @return Total portfolio value
     */
    function _getPortfolioValue(address user) internal view returns (uint256) {
        PortfolioConfig memory config = userPortfolios[user];
        uint256 totalValue = 0;
        
        for (uint256 i = 0; i < config.tokens.length; i++) {
            totalValue += _getTokenValue(user, config.tokens[i]);
        }
        
        return totalValue;
    }

    /**
     * @dev Get token value in USD for a user
     * @param user The user address
     * @param token The token address
     * @return Token value in USD
     */
    function _getTokenValue(address user, address token) internal view returns (uint256) {
        uint256 balance = IERC20(token).balanceOf(user);
        uint256 price = tokenPrices[token];
        
        if (price == 0) {
            // Default price for demo (e.g., ETH = $2000)
            price = 2000 * 1e18;
        }
        
        return (balance * price) / 1e18;
    }

    /**
     * @dev Get portfolio configuration for a user
     * @param user The user address
     * @return PortfolioConfig struct
     */
    function getPortfolioConfig(address user) external view returns (PortfolioConfig memory) {
        return userPortfolios[user];
    }

    /**
     * @dev Get current portfolio allocation percentages
     * @param user The user address
     * @return Array of current allocation percentages
     */
    function getCurrentAllocations(address user) external view returns (uint256[] memory) {
        PortfolioConfig memory config = userPortfolios[user];
        uint256 totalValue = _getPortfolioValue(user);
        
        if (totalValue == 0) {
            return new uint256[](config.tokens.length);
        }
        
        uint256[] memory allocations = new uint256[](config.tokens.length);
        for (uint256 i = 0; i < config.tokens.length; i++) {
            uint256 tokenValue = _getTokenValue(user, config.tokens[i]);
            allocations[i] = (tokenValue * 10000) / totalValue;
        }
        
        return allocations;
    }

    /**
     * @dev Update rebalance threshold
     * @param newThreshold New threshold in basis points
     */
    function updateRebalanceThreshold(uint256 newThreshold) external {
        require(newThreshold > 0 && newThreshold <= 1000, "Invalid threshold");
        
        PortfolioConfig storage config = userPortfolios[msg.sender];
        require(config.isActive, "Portfolio not configured");
        
        config.rebalanceThreshold = newThreshold;
        emit RebalanceThresholdUpdated(msg.sender, newThreshold);
    }

    /**
     * @dev Pause user's portfolio rebalancing
     */
    function pausePortfolio() external {
        PortfolioConfig storage config = userPortfolios[msg.sender];
        require(config.isActive, "Portfolio not active");
        
        config.isActive = false;
        emit WorkflowPaused(msg.sender);
    }

    /**
     * @dev Resume user's portfolio rebalancing
     */
    function resumePortfolio() external {
        PortfolioConfig storage config = userPortfolios[msg.sender];
        require(!config.isActive, "Portfolio already active");
        
        config.isActive = true;
        config.lastRebalanceTime = block.timestamp; // Reset timer
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
