// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "@openzeppelin/contracts-upgradeable/proxy/utils/Initializable.sol";
import "@openzeppelin/contracts-upgradeable/proxy/utils/UUPSUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/access/OwnableUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/security/ReentrancyGuardUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/token/ERC20/IERC20Upgradeable.sol";
import "./AgentRegistry.sol";
import "./ReputationSystem.sol";

/**
 * @title Marketplace
 * @dev Decentralized marketplace for AI agent services
 * @author ExecuAI Team
 */
contract Marketplace is Initializable, UUPSUpgradeable, OwnableUpgradeable, ReentrancyGuardUpgradeable {
    
    // Structs
    struct ServiceRequest {
        uint256 id;
        address client;
        string description;
        string[] requiredCapabilities;
        uint256 budget;
        uint256 deadline;
        uint256 complexity;
        string metadataURI;
        uint256 createdAt;
        uint256 status; // 0: Open, 1: In Progress, 2: Completed, 3: Cancelled
        address[] applicants;
        address selectedAgent;
        uint256 escrowAmount;
        IERC20Upgradeable paymentToken;
    }
    
    struct ServiceProposal {
        uint256 requestId;
        address agent;
        uint256 proposedPrice;
        uint256 estimatedTime;
        string proposalDescription;
        uint256 createdAt;
        bool isAccepted;
    }
    
    struct ServiceContract {
        uint256 id;
        uint256 requestId;
        address client;
        address agent;
        uint256 price;
        uint256 startTime;
        uint256 deadline;
        uint256 status; // 0: Pending, 1: Active, 2: Completed, 3: Disputed, 4: Cancelled
        uint256 milestoneCount;
        uint256 completedMilestones;
        string[] deliverables;
        uint256 disputeDeadline;
        uint256 platformFee;
        uint256 agentAmount;
    }
    
    struct Milestone {
        uint256 contractId;
        uint256 index;
        string description;
        uint256 amount;
        uint256 deadline;
        uint256 status; // 0: Pending, 1: Completed, 2: Approved, 3: Rejected
        uint256 completedAt;
    }
    
    // State variables
    AgentRegistry public agentRegistry;
    ReputationSystem public reputationSystem;
    mapping(uint256 => ServiceRequest) public serviceRequests;
    mapping(uint256 => ServiceProposal[]) public requestProposals;
    mapping(uint256 => ServiceContract) public serviceContracts;
    mapping(uint256 => Milestone[]) public contractMilestones;
    
    // Counters
    uint256 public totalRequests;
    uint256 public totalContracts;
    uint256 public platformFeePercentage; // in basis points (100 = 1%)
    uint256 public minReputationScore;
    
    // Arrays for iteration
    uint256[] public activeRequestIds;
    uint256[] public activeContractIds;
    
    // Events
    event ServiceRequestCreated(
        uint256 indexed requestId,
        address indexed client,
        string description,
        uint256 budget,
        uint256 deadline
    );
    
    event ProposalSubmitted(
        uint256 indexed requestId,
        address indexed agent,
        uint256 price,
        uint256 estimatedTime
    );
    
    event ContractCreated(
        uint256 indexed contractId,
        uint256 requestId,
        address indexed client,
        address indexed agent,
        uint256 price,
        uint256 platformFee,
        uint256 agentAmount
    );
    
    event MilestoneCompleted(
        uint256 indexed contractId,
        uint256 milestoneIndex,
        uint256 amount,
        uint256 timestamp
    );
    
    event ContractCompleted(
        uint256 indexed contractId,
        address indexed agent,
        uint256 totalAmount,
        uint256 timestamp
    );
    
    event DisputeRaised(
        uint256 indexed contractId,
        address indexed initiator,
        string reason,
        uint256 timestamp
    );
    
    // Modifiers
    modifier onlyValidRequest(uint256 _requestId) {
        require(serviceRequests[_requestId].client != address(0), "Invalid request");
        _;
    }
    
    modifier onlyRequestOwner(uint256 _requestId) {
        require(serviceRequests[_requestId].client == msg.sender, "Not request owner");
        _;
    }
    
    modifier onlyValidContract(uint256 _contractId) {
        require(serviceContracts[_contractId].client != address(0), "Invalid contract");
        _;
    }
    
    modifier onlyContractParticipant(uint256 _contractId) {
        require(
            serviceContracts[_contractId].client == msg.sender ||
            serviceContracts[_contractId].agent == msg.sender,
            "Not contract participant"
        );
        _;
    }
    
    modifier onlyActiveContract(uint256 _contractId) {
        require(serviceContracts[_contractId].status == 1, "Contract not active");
        _;
    }
    
    /// @custom:oz-upgrades-unsafe-allow state-variable-immutable
    function initialize(
        address _agentRegistry,
        address _reputationSystem
    ) public initializer {
        __Ownable_init();
        __ReentrancyGuard_init();
        agentRegistry = AgentRegistry(_agentRegistry);
        reputationSystem = ReputationSystem(_reputationSystem);
        
        platformFeePercentage = 250; // 2.5%
        minReputationScore = 300; // Minimum Bronze tier
        totalRequests = 0;
        totalContracts = 0;
    }
    
    /**
     * @dev Create a new service request
     * @param _description Service description
     * @param _requiredCapabilities Required agent capabilities
     * @param _budget Maximum budget in wei
     * @param _deadline Deadline timestamp
     * @param _complexity Complexity score (1-10)
     * @param _metadataURI Additional metadata
     * @param _paymentToken Payment token address (address(0) for native)
     */
    function createServiceRequest(
        string memory _description,
        string[] memory _requiredCapabilities,
        uint256 _budget,
        uint256 _deadline,
        uint256 _complexity,
        string memory _metadataURI,
        address _paymentToken
    ) external nonReentrant payable {
        require(bytes(_description).length > 0, "Description cannot be empty");
        require(_requiredCapabilities.length > 0, "At least one capability required");
        require(_budget > 0, "Budget must be positive");
        require(_deadline > block.timestamp, "Deadline must be in future");
        require(_complexity >= 1 && _complexity <= 10, "Invalid complexity");
        require(msg.value >= _budget, "Insufficient payment for escrow");
        
        uint256 requestId = totalRequests++;
        
        ServiceRequest storage request = serviceRequests[requestId];
        request.id = requestId;
        request.client = msg.sender;
        request.description = _description;
        request.requiredCapabilities = _requiredCapabilities;
        request.budget = _budget;
        request.deadline = _deadline;
        request.complexity = _complexity;
        request.metadataURI = _metadataURI;
        request.createdAt = block.timestamp;
        request.status = 0; // Open
        request.selectedAgent = address(0);
        request.escrowAmount = msg.value;
        request.paymentToken = IERC20Upgradeable(_paymentToken);
        
        activeRequestIds.push(requestId);
        
        emit ServiceRequestCreated(requestId, msg.sender, _description, _budget, _deadline);
    }
    
    /**
     * @dev Submit a proposal for a service request
     * @param _requestId Request ID
     * @param _price Proposed price in wei
     * @param _estimatedTime Estimated completion time
     * @param _proposalDescription Proposal details
     */
    function submitProposal(
        uint256 _requestId,
        uint256 _price,
        uint256 _estimatedTime,
        string memory _proposalDescription
    ) external nonReentrant onlyValidRequest(_requestId) {
        require(agentRegistry.getAgent(msg.sender).owner != address(0), "Agent not registered");
        require(agentRegistry.getAgent(msg.sender).isActive, "Agent not active");
        require(reputationSystem.getReputationScore(msg.sender) >= minReputationScore, "Insufficient reputation");
        require(_price > 0, "Price must be positive");
        require(_estimatedTime > 0, "Time must be positive");
        require(serviceRequests[_requestId].status == 0, "Request not open");
        require(_price <= serviceRequests[_requestId].budget, "Price exceeds budget");
        
        // Check if agent has required capabilities
        for (uint256 i = 0; i < serviceRequests[_requestId].requiredCapabilities.length; i++) {
            require(
                agentRegistry.hasCapability(msg.sender, serviceRequests[_requestId].requiredCapabilities[i]),
                "Agent lacks required capability"
            );
        }
        
        ServiceProposal memory proposal = ServiceProposal({
            requestId: _requestId,
            agent: msg.sender,
            proposedPrice: _price,
            estimatedTime: _estimatedTime,
            proposalDescription: _proposalDescription,
            createdAt: block.timestamp,
            isAccepted: false
        });
        
        requestProposals[_requestId].push(proposal);
        
        emit ProposalSubmitted(_requestId, msg.sender, _price, _estimatedTime);
    }
    
    /**
     * @dev Accept a proposal and create service contract
     * @param _requestId Request ID
     * @param _proposalIndex Index of the proposal to accept
     */
    function acceptProposal(uint256 _requestId, uint256 _proposalIndex) external nonReentrant onlyRequestOwner(_requestId) {
        require(serviceRequests[_requestId].status == 0, "Request not open");
        require(_proposalIndex < requestProposals[_requestId].length, "Invalid proposal index");
        
        ServiceProposal storage proposal = requestProposals[_requestId][_proposalIndex];
        require(!proposal.isAccepted, "Proposal already accepted");
        
        // Create service contract
        uint256 contractId = totalContracts++;
        
        ServiceContract storage svcContract = serviceContracts[contractId];
        svcContract.id = contractId;
        svcContract.requestId = _requestId;
        svcContract.client = serviceRequests[_requestId].client;
        svcContract.agent = proposal.agent;
        svcContract.price = proposal.proposedPrice;
        svcContract.startTime = block.timestamp;
        svcContract.deadline = block.timestamp + proposal.estimatedTime;
        svcContract.status = 0; // Pending
        svcContract.milestoneCount = 0;
        svcContract.completedMilestones = 0;
        svcContract.disputeDeadline = block.timestamp + 7 days; // 7 days to raise disputes
        
        // Update request status
        serviceRequests[_requestId].status = 1; // In Progress
        serviceRequests[_requestId].selectedAgent = proposal.agent;
        proposal.isAccepted = true;
        
        // Transfer escrow to contract
        uint256 pFee = (proposal.proposedPrice * platformFeePercentage) / 10000;
        uint256 aAmount = proposal.proposedPrice - pFee;
        
        svcContract.platformFee = pFee;
        svcContract.agentAmount = aAmount;
        
        activeContractIds.push(contractId);
        
        emit ContractCreated(
            contractId, 
            _requestId, 
            svcContract.client, 
            proposal.agent, 
            proposal.proposedPrice,
            pFee,
            aAmount
        );
    }
    
    /**
     * @dev Add milestones to a contract
     * @param _contractId Contract ID
     * @param _descriptions Array of milestone descriptions
     * @param _amounts Array of milestone amounts
     * @param _deadlines Array of milestone deadlines
     */
    function addMilestones(
        uint256 _contractId,
        string[] memory _descriptions,
        uint256[] memory _amounts,
        uint256[] memory _deadlines
    ) external nonReentrant onlyValidContract(_contractId) onlyContractParticipant(_contractId) {
        require(serviceContracts[_contractId].status == 0, "Contract not pending");
        require(_descriptions.length == _amounts.length, "Array length mismatch");
        require(_amounts.length == _deadlines.length, "Array length mismatch");
        
        uint256 totalAmount = 0;
        for (uint256 i = 0; i < _amounts.length; i++) {
            totalAmount += _amounts[i];
        }
        require(totalAmount == serviceContracts[_contractId].price, "Amounts must equal contract price");
        
        for (uint256 i = 0; i < _descriptions.length; i++) {
            Milestone memory milestone = Milestone({
                contractId: _contractId,
                index: i,
                description: _descriptions[i],
                amount: _amounts[i],
                deadline: _deadlines[i],
                status: 0, // Pending
                completedAt: 0
            });
            
            contractMilestones[_contractId].push(milestone);
        }
        
        serviceContracts[_contractId].milestoneCount = _descriptions.length;
        serviceContracts[_contractId].status = 1; // Active
    }
    
    /**
     * @dev Complete a milestone
     * @param _contractId Contract ID
     * @param _milestoneIndex Index of the milestone
     */
    function completeMilestone(uint256 _contractId, uint256 _milestoneIndex) external nonReentrant onlyActiveContract(_contractId) {
        require(_milestoneIndex < contractMilestones[_contractId].length, "Invalid milestone index");
        require(contractMilestones[_contractId][_milestoneIndex].status == 0, "Milestone already completed");
        
        Milestone storage milestone = contractMilestones[_contractId][_milestoneIndex];
        milestone.status = 1; // Completed
        milestone.completedAt = block.timestamp;
        
        serviceContracts[_contractId].completedMilestones++;
        
        // This would trigger payment to agent for the milestone
        // Implementation depends on payment token
        
        emit MilestoneCompleted(_contractId, _milestoneIndex, milestone.amount, block.timestamp);
        
        // Check if all milestones are completed
        if (serviceContracts[_contractId].completedMilestones == serviceContracts[_contractId].milestoneCount) {
            serviceContracts[_contractId].status = 2; // Completed
            
            // Update agent reputation
            uint256 rating = 4; // Default good rating
            reputationSystem.addReputationRating(
                serviceContracts[_contractId].agent,
                rating,
                "Contract completed successfully",
                _contractId,
                serviceContracts[_contractId].price,
                5 // Medium complexity
            );
            
            emit ContractCompleted(_contractId, serviceContracts[_contractId].agent, serviceContracts[_contractId].price, block.timestamp);
        }
    }
    
    /**
     * @dev Raise a dispute for a contract
     * @param _contractId Contract ID
     * @param _reason Dispute reason
     */
    function raiseDispute(uint256 _contractId, string memory _reason) external nonReentrant onlyContractParticipant(_contractId) {
        require(serviceContracts[_contractId].status == 1 || serviceContracts[_contractId].status == 2, "Cannot dispute this contract");
        require(block.timestamp <= serviceContracts[_contractId].disputeDeadline, "Dispute period expired");
        require(bytes(_reason).length > 0, "Reason cannot be empty");
        
        serviceContracts[_contractId].status = 3; // Disputed
        
        emit DisputeRaised(_contractId, msg.sender, _reason, block.timestamp);
    }
    
    /**
     * @dev Update platform fee percentage
     * @param _newFee New fee in basis points (100 = 1%)
     */
    function updatePlatformFee(uint256 _newFee) external onlyOwner {
        require(_newFee <= 1000, "Fee too high"); // Max 10%
        platformFeePercentage = _newFee;
    }
    
    /**
     * @dev Update minimum reputation score
     * @param _newMinScore New minimum score
     */
    function updateMinReputationScore(uint256 _newMinScore) external onlyOwner {
        require(_newMinScore <= 1000, "Score too high");
        minReputationScore = _newMinScore;
    }
    
    // View functions
    function getServiceRequest(uint256 _requestId) external view returns (ServiceRequest memory) {
        return serviceRequests[_requestId];
    }
    
    function getServiceContract(uint256 _contractId) external view returns (ServiceContract memory) {
        return serviceContracts[_contractId];
    }
    
    function getMilestone(uint256 _contractId, uint256 _milestoneIndex) external view returns (Milestone memory) {
        return contractMilestones[_contractId][_milestoneIndex];
    }
    
    function getProposals(uint256 _requestId) external view returns (ServiceProposal[] memory) {
        return requestProposals[_requestId];
    }
    
    function getActiveRequests() external view returns (uint256[] memory) {
        return activeRequestIds;
    }
    
    function getActiveContracts() external view returns (uint256[] memory) {
        return activeContractIds;
    }
    
    function getRequestsByCapability(string memory _capability) external view returns (uint256[] memory) {
        uint256 count = 0;
        for (uint256 i = 0; i < activeRequestIds.length; i++) {
            uint256 requestId = activeRequestIds[i];
            string[] storage requiredCaps = serviceRequests[requestId].requiredCapabilities;
            for (uint256 j = 0; j < requiredCaps.length; j++) {
                if (keccak256(abi.encodePacked(requiredCaps[j])) == keccak256(abi.encodePacked(_capability))) {
                    count++;
                    break;
                }
            }
        }
        
        uint256[] memory result = new uint256[](count);
        uint256 index = 0;
        for (uint256 i = 0; i < activeRequestIds.length; i++) {
            uint256 requestId = activeRequestIds[i];
            string[] storage requiredCaps = serviceRequests[requestId].requiredCapabilities;
            for (uint256 j = 0; j < requiredCaps.length; j++) {
                if (keccak256(abi.encodePacked(requiredCaps[j])) == keccak256(abi.encodePacked(_capability))) {
                    result[index] = requestId;
                    index++;
                    break;
                }
            }
        }
        
        return result;
    }
    
    // Required for UUPS upgradeability
    function _authorizeUpgrade(address newImplementation) internal override onlyOwner {}
}
