// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";
import "@openzeppelin/contracts/security/Pausable.sol";

/**
 * @title WorkflowExecutor
 * @dev Contract for executing workflow logic and managing execution permissions
 * @notice Handles workflow execution, permission checking, and execution logging
 */
contract WorkflowExecutor is Ownable, ReentrancyGuard, Pausable {
    
    // Events
    event WorkflowExecuted(
        uint256 indexed workflowId,
        address indexed user,
        address indexed executor,
        bytes32 executionHash,
        bool success,
        bytes resultData
    );
    
    event ExecutionFailed(
        uint256 indexed workflowId,
        address indexed user,
        address indexed executor,
        string reason
    );

    event ExecutorUpdated(address indexed newExecutor);
    event SubscriptionManagerUpdated(address indexed newManager);

    // Struct to store execution information
    struct Execution {
        uint256 workflowId;
        address user;
        address executor;
        uint256 timestamp;
        bytes32 executionHash;
        bool success;
        bytes resultData;
        uint256 gasUsed;
    }

    // State variables
    address public subscriptionManagerAddress;
    mapping(address => bool) public authorizedExecutors;
    mapping(bytes32 => Execution) public executions;
    mapping(uint256 => bytes32[]) public workflowExecutions; // workflowId => execution hashes
    mapping(address => bytes32[]) public userExecutions; // user => execution hashes
    uint256 public nextExecutionId = 1;

    // Modifiers
    modifier onlyAuthorizedExecutor() {
        require(authorizedExecutors[msg.sender], "Not authorized executor");
        _;
    }

    modifier validExecutionParams(uint256 workflowId, address user) {
        require(workflowId > 0, "Invalid workflow ID");
        require(user != address(0), "Invalid user address");
        _;
    }

    /**
     * @dev Constructor sets the deployer as the initial owner
     */
    constructor() {
        authorizedExecutors[msg.sender] = true;
    }

    /**
     * @dev Set the subscription manager address
     * @param _subscriptionManager Address of the SubscriptionManager contract
     */
    function setSubscriptionManager(address _subscriptionManager) external onlyOwner {
        require(_subscriptionManager != address(0), "Invalid subscription manager address");
        subscriptionManagerAddress = _subscriptionManager;
        emit SubscriptionManagerUpdated(_subscriptionManager);
    }

    /**
     * @dev Add or remove an authorized executor
     * @param executor Address of the executor to update
     * @param isAuthorized Whether the executor should be authorized
     */
    function setExecutor(address executor, bool isAuthorized) external onlyOwner {
        require(executor != address(0), "Invalid executor address");
        authorizedExecutors[executor] = isAuthorized;
        emit ExecutorUpdated(executor);
    }

    /**
     * @dev Check if user has valid subscription before executing workflow
     * @param user The user address
     * @param workflowId The workflow ID
     * @return True if user has valid subscription
     */
    function hasValidSubscription(address user, uint256 workflowId) public view returns (bool) {
        if (subscriptionManagerAddress == address(0)) {
            return false;
        }

        // Call SubscriptionManager to check if subscription is active
        // This would need to be implemented with an interface to avoid import issues
        // For now, we'll assume this functionality exists
        return true; // Placeholder - should call subscription manager
    }

    /**
     * @dev Execute a workflow for a user (only authorized executors)
     * @param workflowId The ID of the workflow to execute
     * @param user The user address
     * @param executionData Calldata for the specific workflow execution
     */
    function executeWorkflow(
        uint256 workflowId,
        address user,
        bytes calldata executionData
    ) external onlyAuthorizedExecutor nonReentrant whenNotPaused 
      validExecutionParams(workflowId, user) {
        
        // Check if user has valid subscription
        require(hasValidSubscription(user, workflowId), "No valid subscription");

        uint256 gasStart = gasleft();
        bytes32 executionHash = keccak256(abi.encodePacked(
            workflowId,
            user,
            block.timestamp,
            block.number,
            nextExecutionId
        ));

        bool success = false;
        bytes memory resultData;

        try this._executeWorkflowLogic(workflowId, user, executionData) {
            success = true;
            resultData = abi.encode("Execution successful");
        } catch Error(string memory reason) {
            success = false;
            resultData = abi.encode(reason);
            emit ExecutionFailed(workflowId, user, msg.sender, reason);
        } catch {
            success = false;
            resultData = abi.encode("Execution failed without reason");
            emit ExecutionFailed(workflowId, user, msg.sender, "Unknown execution failure");
        }

        uint256 gasUsed = gasStart - gasleft();

        // Store execution record
        Execution memory execution = Execution({
            workflowId: workflowId,
            user: user,
            executor: msg.sender,
            timestamp: block.timestamp,
            executionHash: executionHash,
            success: success,
            resultData: resultData,
            gasUsed: gasUsed
        });

        executions[executionHash] = execution;
        workflowExecutions[workflowId].push(executionHash);
        userExecutions[user].push(executionHash);
        nextExecutionId++;

        emit WorkflowExecuted(workflowId, user, msg.sender, executionHash, success, resultData);
    }

    /**
     * @dev Internal function to execute workflow logic (to be overridden by specific workflows)
     * @param workflowId The ID of the workflow
     * @param user The user address
     * @param executionData Calldata for the execution
     */
    function _executeWorkflowLogic(
        uint256 workflowId,
        address user,
        bytes calldata executionData
    ) external pure {
        // This is a placeholder for actual workflow logic
        // In a real implementation, this would delegate to specific workflow contracts
        // based on the workflowId
        
        require(executionData.length > 0, "Invalid execution data");
        
        // For MVP, we'll simulate different workflow behaviors based on ID
        if (workflowId == 1) {
            // Auto-Compound workflow logic placeholder
            return;
        } else if (workflowId == 2) {
            // Portfolio Rebalancer workflow logic placeholder
            return;
        } else if (workflowId == 3) {
            // Price Alert workflow logic placeholder
            return;
        } else {
            revert("Unsupported workflow ID");
        }
    }

    /**
     * @dev Get execution details by hash
     * @param executionHash The hash of the execution
     * @return Execution details
     */
    function getExecution(bytes32 executionHash) external view returns (Execution memory) {
        require(executions[executionHash].executor != address(0), "Execution not found");
        return executions[executionHash];
    }

    /**
     * @dev Get all executions for a workflow
     * @param workflowId The ID of the workflow
     * @return Array of execution hashes
     */
    function getWorkflowExecutions(uint256 workflowId) external view returns (bytes32[] memory) {
        return workflowExecutions[workflowId];
    }

    /**
     * @dev Get all executions for a user
     * @param user The user address
     * @return Array of execution hashes
     */
    function getUserExecutions(address user) external view returns (bytes32[] memory) {
        return userExecutions[user];
    }

    /**
     * @dev Get execution count for a workflow
     * @param workflowId The ID of the workflow
     * @return Number of executions
     */
    function getWorkflowExecutionCount(uint256 workflowId) external view returns (uint256) {
        return workflowExecutions[workflowId].length;
    }

    /**
     * @dev Get execution count for a user
     * @param user The user address
     * @return Number of executions
     */
    function getUserExecutionCount(address user) external view returns (uint256) {
        return userExecutions[user].length;
    }

    /**
     * @dev Get recent executions (last 50)
     * @return Array of execution hashes from recent executions
     */
    function getRecentExecutions() external view returns (bytes32[] memory) {
        // This would require maintaining a global executions array
        // For MVP, returning empty array - can be implemented in future version
        bytes32[] memory emptyArray = new bytes32[](0);
        return emptyArray;
    }

    /**
     * @dev Check if an executor is authorized
     * @param executor The executor address
     * @return True if authorized
     */
    function isAuthorizedExecutor(address executor) external view returns (bool) {
        return authorizedExecutors[executor];
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
