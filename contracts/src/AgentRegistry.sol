// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "@openzeppelin/contracts-upgradeable/proxy/utils/Initializable.sol";
import "@openzeppelin/contracts-upgradeable/proxy/utils/UUPSUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/access/OwnableUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/security/ReentrancyGuardUpgradeable.sol";

/**
 * @title AgentRegistry
 * @dev Registry for AI agents on the decentralized marketplace
 * @author ExecuAI Team
 */
contract AgentRegistry is Initializable, UUPSUpgradeable, OwnableUpgradeable, ReentrancyGuardUpgradeable {
    
    // Structs
    struct Agent {
        address owner;
        string name;
        string description;
        string[] capabilities;
        uint256 reputation;
        uint256 registrationTime;
        bool isActive;
        uint256 totalEarnings;
        uint256 completedTasks;
        string metadataURI;
    }
    
    struct Capability {
        string name;
        string description;
        bool isActive;
    }
    
    // State variables
    mapping(address => Agent) public agents;
    mapping(string => bool) public capabilityExists;
    mapping(address => mapping(string => bool)) public agentCapabilities;
    address[] public agentAddresses;
    mapping(address => uint256) public agentIndex;
    
    // Counters
    uint256 public totalAgents;
    uint256 public totalCapabilities;
    
    // Events
    event AgentRegistered(
        address indexed agent,
        string name,
        string description,
        string[] capabilities,
        uint256 timestamp
    );
    
    event AgentUpdated(
        address indexed agent,
        string name,
        string description,
        string[] capabilities
    );
    
    event AgentDeactivated(address indexed agent, uint256 timestamp);
    event AgentReactivated(address indexed agent, uint256 timestamp);
    event CapabilityAdded(string capability, string description);
    event CapabilityRemoved(string capability);
    
    // Modifiers
    modifier onlyRegisteredAgent() {
        require(agents[msg.sender].owner != address(0), "Agent not registered");
        _;
    }
    
    modifier onlyActiveAgent() {
        require(agents[msg.sender].isActive, "Agent not active");
        _;
    }
    
    /// @custom:oz-upgrades-unsafe-allow state-variable-immutable
    function initialize() public initializer {
        __Ownable_init();
        __ReentrancyGuard_init();
        totalAgents = 0;
        totalCapabilities = 0;
    }
    
    /**
     * @dev Register a new AI agent
     * @param _name Agent name
     * @param _description Agent description
     * @param _capabilities Array of agent capabilities
     * @param _metadataURI Metadata URI for additional info
     */
    function registerAgent(
        string memory _name,
        string memory _description,
        string[] memory _capabilities,
        string memory _metadataURI
    ) external nonReentrant {
        require(agents[msg.sender].owner == address(0), "Agent already registered");
        require(bytes(_name).length > 0, "Name cannot be empty");
        require(bytes(_description).length > 0, "Description cannot be empty");
        require(_capabilities.length > 0, "At least one capability required");
        
        // Validate capabilities
        for (uint256 i = 0; i < _capabilities.length; i++) {
            require(capabilityExists[_capabilities[i]], "Capability does not exist");
        }
        
        // Create new agent
        Agent storage newAgent = agents[msg.sender];
        newAgent.owner = msg.sender;
        newAgent.name = _name;
        newAgent.description = _description;
        newAgent.capabilities = _capabilities;
        newAgent.reputation = 100; // Start with neutral reputation
        newAgent.registrationTime = block.timestamp;
        newAgent.isActive = true;
        newAgent.totalEarnings = 0;
        newAgent.completedTasks = 0;
        newAgent.metadataURI = _metadataURI;
        
        // Update agent capabilities mapping
        for (uint256 i = 0; i < _capabilities.length; i++) {
            agentCapabilities[msg.sender][_capabilities[i]] = true;
        }
        
        // Add to agent list
        agentAddresses.push(msg.sender);
        agentIndex[msg.sender] = totalAgents;
        totalAgents++;
        
        emit AgentRegistered(msg.sender, _name, _description, _capabilities, block.timestamp);
    }
    
    /**
     * @dev Update agent information
     * @param _name New agent name
     * @param _description New agent description
     * @param _capabilities New array of capabilities
     * @param _metadataURI New metadata URI
     */
    function updateAgent(
        string memory _name,
        string memory _description,
        string[] memory _capabilities,
        string memory _metadataURI
    ) external onlyRegisteredAgent {
        require(bytes(_name).length > 0, "Name cannot be empty");
        require(bytes(_description).length > 0, "Description cannot be empty");
        require(_capabilities.length > 0, "At least one capability required");
        
        // Validate capabilities
        for (uint256 i = 0; i < _capabilities.length; i++) {
            require(capabilityExists[_capabilities[i]], "Capability does not exist");
        }
        
        // Clear old capabilities
        string[] storage oldCapabilities = agents[msg.sender].capabilities;
        for (uint256 i = 0; i < oldCapabilities.length; i++) {
            agentCapabilities[msg.sender][oldCapabilities[i]] = false;
        }
        
        // Update agent
        Agent storage agent = agents[msg.sender];
        agent.name = _name;
        agent.description = _description;
        agent.capabilities = _capabilities;
        agent.metadataURI = _metadataURI;
        
        // Update agent capabilities mapping
        for (uint256 i = 0; i < _capabilities.length; i++) {
            agentCapabilities[msg.sender][_capabilities[i]] = true;
        }
        
        emit AgentUpdated(msg.sender, _name, _description, _capabilities);
    }
    
    /**
     * @dev Deactivate an agent
     */
    function deactivateAgent() external onlyRegisteredAgent {
        agents[msg.sender].isActive = false;
        emit AgentDeactivated(msg.sender, block.timestamp);
    }
    
    /**
     * @dev Reactivate an agent
     */
    function reactivateAgent() external onlyRegisteredAgent {
        agents[msg.sender].isActive = true;
        emit AgentReactivated(msg.sender, block.timestamp);
    }
    
    /**
     * @dev Add a new capability type
     * @param _name Capability name
     * @param _description Capability description
     */
    function addCapability(string memory _name, string memory _description) external onlyOwner {
        require(!capabilityExists[_name], "Capability already exists");
        require(bytes(_name).length > 0, "Name cannot be empty");
        
        capabilityExists[_name] = true;
        totalCapabilities++;
        
        emit CapabilityAdded(_name, _description);
    }
    
    /**
     * @dev Remove a capability type
     * @param _name Capability name to remove
     */
    function removeCapability(string memory _name) external onlyOwner {
        require(capabilityExists[_name], "Capability does not exist");
        
        capabilityExists[_name] = false;
        totalCapabilities--;
        
        emit CapabilityRemoved(_name);
    }
    
    /**
     * @dev Update agent reputation (called by ReputationSystem contract)
     * @param _agent Agent address
     * @param _newReputation New reputation score
     */
    function updateReputation(address _agent, uint256 _newReputation) external onlyOwner {
        require(agents[_agent].owner != address(0), "Agent not registered");
        agents[_agent].reputation = _newReputation;
    }
    
    /**
     * @dev Update agent earnings (called by Marketplace contract)
     * @param _agent Agent address
     * @param _amount Amount to add to earnings
     */
    function updateEarnings(address _agent, uint256 _amount) external onlyOwner {
        require(agents[_agent].owner != address(0), "Agent not registered");
        agents[_agent].totalEarnings += _amount;
    }
    
    /**
     * @dev Increment completed tasks for an agent
     * @param _agent Agent address
     */
    function incrementCompletedTasks(address _agent) external onlyOwner {
        require(agents[_agent].owner != address(0), "Agent not registered");
        agents[_agent].completedTasks++;
    }
    
    // View functions
    function getAgent(address _agent) external view returns (Agent memory) {
        return agents[_agent];
    }
    
    function getActiveAgents() external view returns (address[] memory) {
        address[] memory activeAgents = new address[](totalAgents);
        uint256 activeCount = 0;
        
        for (uint256 i = 0; i < totalAgents; i++) {
            if (agents[agentAddresses[i]].isActive) {
                activeAgents[activeCount] = agentAddresses[i];
                activeCount++;
            }
        }
        
        // Resize array to actual count
        assembly {
            mstore(activeAgents, activeCount)
        }
        
        return activeAgents;
    }
    
    function getAgentsByCapability(string memory _capability) external view returns (address[] memory) {
        uint256 count = 0;
        for (uint256 i = 0; i < totalAgents; i++) {
            if (agentCapabilities[agentAddresses[i]][_capability] && agents[agentAddresses[i]].isActive) {
                count++;
            }
        }
        
        address[] memory result = new address[](count);
        uint256 index = 0;
        
        for (uint256 i = 0; i < totalAgents; i++) {
            if (agentCapabilities[agentAddresses[i]][_capability] && agents[agentAddresses[i]].isActive) {
                result[index] = agentAddresses[i];
                index++;
            }
        }
        
        return result;
    }
    
    function hasCapability(address _agent, string memory _capability) external view returns (bool) {
        return agentCapabilities[_agent][_capability];
    }
    
    function getAgentCount() external view returns (uint256) {
        return totalAgents;
    }
    
    function getActiveAgentCount() external view returns (uint256) {
        uint256 count = 0;
        for (uint256 i = 0; i < totalAgents; i++) {
            if (agents[agentAddresses[i]].isActive) {
                count++;
            }
        }
        return count;
    }
    
    // Required for UUPS upgradeability
    function _authorizeUpgrade(address newImplementation) internal override onlyOwner {}
}
