// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";
import "@openzeppelin/contracts/security/Pausable.sol";

/**
 * @title WorkflowRegistry
 * @dev Registry contract for storing workflow metadata and managing workflow information
 * @notice This contract stores workflow details including name, description, creator, price, and category
 */
contract WorkflowRegistry is Ownable, ReentrancyGuard, Pausable {
    
    // Events
    event WorkflowRegistered(
        uint256 indexed workflowId,
        address indexed creator,
        string name,
        string description,
        uint256 price,
        string category
    );
    
    event WorkflowUpdated(
        uint256 indexed workflowId,
        string name,
        string description,
        uint256 price,
        string category
    );

    // Struct to store workflow information
    struct Workflow {
        uint256 id;
        string name;
        string description;
        address creator;
        uint256 price; // Price in wei per subscription period
        string category;
        bool isActive;
        uint256 createdAt;
    }

    // State variables
    uint256 public nextWorkflowId = 1;
    mapping(uint256 => Workflow) public workflows;
    mapping(address => uint256[]) public creatorWorkflows;
    mapping(string => uint256[]) public categoryWorkflows;

    /**
     * @dev Constructor sets the deployer as the initial owner
     */
    constructor() {}

    /**
     * @dev Register a new workflow (only owner for MVP)
     * @param name The name of the workflow
     * @param description Detailed description of the workflow
     * @param price Subscription price in wei
     * @param category Workflow category (DeFi, Trading, NFT, Governance, Utility)
     */
    function registerWorkflow(
        address creator,
        string memory name,
        string memory description,
        uint256 price,
        string memory category
    ) external onlyOwner nonReentrant whenNotPaused returns (uint256) {
        require(creator != address(0), "Invalid creator address");
        require(bytes(name).length > 0, "Name cannot be empty");
        require(bytes(description).length > 0, "Description cannot be empty");
        require(bytes(category).length > 0, "Category cannot be empty");

        uint256 workflowId = nextWorkflowId;
        
        workflows[workflowId] = Workflow({
            id: workflowId,
            name: name,
            description: description,
            creator: creator,
            price: price,
            category: category,
            isActive: true,
            createdAt: block.timestamp
        });

        creatorWorkflows[creator].push(workflowId);
        categoryWorkflows[category].push(workflowId);

        nextWorkflowId++;

        emit WorkflowRegistered(workflowId, creator, name, description, price, category);
        
        return workflowId;
    }

    /**
     * @dev Update workflow details (only owner for MVP)
     * @param workflowId The ID of the workflow to update
     * @param name New name for the workflow
     * @param description New description for the workflow
     * @param price New price for the workflow
     * @param category New category for the workflow
     */
    function updateWorkflow(
        uint256 workflowId,
        string memory name,
        string memory description,
        uint256 price,
        string memory category
    ) external onlyOwner nonReentrant whenNotPaused {
        require(workflows[workflowId].creator != address(0), "Workflow does not exist");
        require(bytes(name).length > 0, "Name cannot be empty");
        require(bytes(description).length > 0, "Description cannot be empty");
        require(bytes(category).length > 0, "Category cannot be empty");

        Workflow storage workflow = workflows[workflowId];
        
        // Remove from old category if category changed
        if (keccak256(bytes(workflow.category)) != keccak256(bytes(category))) {
            _removeFromCategory(workflowId, workflow.category);
            categoryWorkflows[category].push(workflowId);
        }

        workflow.name = name;
        workflow.description = description;
        workflow.price = price;
        workflow.category = category;

        emit WorkflowUpdated(workflowId, name, description, price, category);
    }

    /**
     * @dev Get workflow details
     * @param workflowId The ID of the workflow
     * @return Workflow struct containing all workflow information
     */
    function getWorkflow(uint256 workflowId) external view returns (Workflow memory) {
        require(workflows[workflowId].creator != address(0), "Workflow does not exist");
        return workflows[workflowId];
    }

    /**
     * @dev Get all workflows by creator
     * @param creator The creator address
     * @return Array of workflow IDs created by the creator
     */
    function getWorkflowsByCreator(address creator) external view returns (uint256[] memory) {
        return creatorWorkflows[creator];
    }

    /**
     * @dev Get all workflows by category
     * @param category The category name
     * @return Array of workflow IDs in the category
     */
    function getWorkflowsByCategory(string memory category) external view returns (uint256[] memory) {
        return categoryWorkflows[category];
    }

    /**
     * @dev Get total number of workflows
     * @return Total count of registered workflows
     */
    function getTotalWorkflows() external view returns (uint256) {
        return nextWorkflowId - 1;
    }

    /**
     * @dev Toggle workflow active status (only owner)
     * @param workflowId The ID of the workflow
     * @param isActive The new active status
     */
    function setWorkflowStatus(uint256 workflowId, bool isActive) external onlyOwner {
        require(workflows[workflowId].creator != address(0), "Workflow does not exist");
        workflows[workflowId].isActive = isActive;
    }

    /**
     * @dev Internal function to remove workflow from category
     * @param workflowId The ID of the workflow
     * @param category The category to remove from
     */
    function _removeFromCategory(uint256 workflowId, string memory category) internal {
        uint256[] storage categoryList = categoryWorkflows[category];
        for (uint256 i = 0; i < categoryList.length; i++) {
            if (categoryList[i] == workflowId) {
                categoryList[i] = categoryList[categoryList.length - 1];
                categoryList.pop();
                break;
            }
        }
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
