// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "@openzeppelin/contracts-upgradeable/proxy/utils/Initializable.sol";
import "@openzeppelin/contracts-upgradeable/proxy/utils/UUPSUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/access/OwnableUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/security/ReentrancyGuardUpgradeable.sol";
import "./AgentRegistry.sol";

/**
 * @title ReputationSystem
 * @dev Manages reputation scoring for AI agents based on performance
 * @author Dovine Owuor
 */
contract ReputationSystem is Initializable, UUPSUpgradeable, OwnableUpgradeable, ReentrancyGuardUpgradeable {
    
    // Structs
    struct ReputationEvent {
        address agent;
        uint256 rating; // 1-5 scale
        string comment;
        uint256 timestamp;
        address reviewer;
        uint256 taskId;
        bool isPositive;
    }
    
    struct ReputationMetrics {
        uint256 totalRating;
        uint256 ratingCount;
        uint256 positiveCount;
        uint256 negativeCount;
        uint256 averageRating;
        uint256 reputationScore; // 0-1000 scale
        uint256 lastUpdated;
    }
    
    struct WeightFactors {
        uint256 recentWeight; // Weight for recent ratings
        uint256 valueWeight; // Weight based on task value
        uint256 complexityWeight; // Weight based on task complexity
        uint256 decayRate; // Reputation decay over time
    }
    
    // State variables
    AgentRegistry public agentRegistry;
    mapping(address => ReputationMetrics) public agentMetrics;
    mapping(address => ReputationEvent[]) public agentReputationEvents;
    mapping(address => mapping(uint256 => bool)) public hasReviewed;
    
    // Reputation calculation parameters
    WeightFactors public weightFactors;
    uint256 public constant MAX_REPUTATION = 1000;
    uint256 public constant MIN_REPUTATION = 0;
    uint256 public constant RATING_SCALE = 5;
    
    // Events
    event ReputationUpdated(
        address indexed agent,
        uint256 oldScore,
        uint256 newScore,
        uint256 rating,
        string comment,
        uint256 timestamp
    );
    
    event ReputationDecay(
        address indexed agent,
        uint256 oldScore,
        uint256 newScore,
        uint256 timestamp
    );
    
    event WeightFactorsUpdated(
        uint256 recentWeight,
        uint256 valueWeight,
        uint256 complexityWeight,
        uint256 decayRate
    );
    
    // Modifiers
    modifier onlyValidAgent(address _agent) {
        require(agentRegistry.getAgent(_agent).owner != address(0), "Invalid agent");
        _;
    }
    
    modifier onlyAuthorizedReviewer(address _agent, uint256 _taskId) {
        require(!hasReviewed[_agent][_taskId], "Already reviewed this task");
        _;
    }
    
    /// @custom:oz-upgrades-unsafe-allow state-variable-immutable
    function initialize(address _agentRegistry) public initializer {
        __Ownable_init();
        __ReentrancyGuard_init();
        agentRegistry = AgentRegistry(_agentRegistry);
        
        // Initialize default weight factors
        weightFactors = WeightFactors({
            recentWeight: 150, // 1.5x weight for recent ratings
            valueWeight: 120, // 1.2x weight based on task value
            complexityWeight: 110, // 1.1x weight based on complexity
            decayRate: 5 // 5% decay per month
        });
    }
    
    /**
     * @dev Add reputation rating for an agent
     * @param _agent Agent address to rate
     * @param _rating Rating from 1-5
     * @param _comment Review comment
     * @param _taskId Associated task ID
     * @param _taskValue Value of the task in wei
     * @param _complexity Complexity score (1-10)
     */
    function addReputationRating(
        address _agent,
        uint256 _rating,
        string memory _comment,
        uint256 _taskId,
        uint256 _taskValue,
        uint256 _complexity
    ) external nonReentrant onlyValidAgent(_agent) onlyAuthorizedReviewer(_agent, _taskId) {
        require(_rating >= 1 && _rating <= RATING_SCALE, "Invalid rating");
        require(_complexity >= 1 && _complexity <= 10, "Invalid complexity");
        require(bytes(_comment).length > 0, "Comment cannot be empty");
        
        bool isPositive = _rating >= 3;
        
        // Create reputation event
        ReputationEvent memory repEvent = ReputationEvent({
            agent: _agent,
            rating: _rating,
            comment: _comment,
            timestamp: block.timestamp,
            reviewer: msg.sender,
            taskId: _taskId,
            isPositive: isPositive
        });
        
        agentReputationEvents[_agent].push(repEvent);
        hasReviewed[_agent][_taskId] = true;
        
        // Calculate new reputation score
        uint256 oldScore = agentMetrics[_agent].reputationScore;
        uint256 newScore = calculateReputationScore(_agent, _rating, _taskValue, _complexity);
        
        // Update metrics
        ReputationMetrics storage metrics = agentMetrics[_agent];
        metrics.totalRating += _rating;
        metrics.ratingCount++;
        if (isPositive) {
            metrics.positiveCount++;
        } else {
            metrics.negativeCount++;
        }
        metrics.averageRating = metrics.totalRating / metrics.ratingCount;
        metrics.reputationScore = newScore;
        metrics.lastUpdated = block.timestamp;
        
        // Update agent registry
        agentRegistry.updateReputation(_agent, newScore);
        
        emit ReputationUpdated(_agent, oldScore, newScore, _rating, _comment, block.timestamp);
    }
    
    /**
     * @dev Calculate weighted reputation score
     * @param _agent Agent address
     * @param _newRating New rating to add
     * @param _taskValue Value of the task
     * @param _complexity Complexity of the task
     * @return New reputation score
     */
    function calculateReputationScore(
        address _agent,
        uint256 _newRating,
        uint256 _taskValue,
        uint256 _complexity
    ) internal view returns (uint256) {
        ReputationMetrics memory metrics = agentMetrics[_agent];
        
        if (metrics.ratingCount == 0) {
            return 500; // Start at neutral (50% of max)
        }
        
        // Base score from average rating
        uint256 baseScore = (metrics.averageRating * 200); // Convert to 0-1000 scale
        
        // Apply weights
        uint256 weightedScore = baseScore;
        
        // Recent activity weight
        uint256 timeSinceLastUpdate = block.timestamp - metrics.lastUpdated;
        uint256 recencyBonus = 0;
        if (timeSinceLastUpdate < 7 days) {
            recencyBonus = (weightFactors.recentWeight * _newRating) / 100;
        }
        weightedScore += recencyBonus;
        
        // Task value weight
        uint256 valueBonus = 0;
        if (_taskValue > 0) {
            valueBonus = (weightFactors.valueWeight * _newRating * _taskValue) / (1 ether * 100);
            weightedScore += valueBonus;
        }
        
        // Complexity weight
        uint256 complexityBonus = (weightFactors.complexityWeight * _newRating * _complexity) / 100;
        weightedScore += complexityBonus;
        
        // Apply time decay
        uint256 decayAmount = (metrics.reputationScore * weightFactors.decayRate * timeSinceLastUpdate) / (100 * 30 days);
        weightedScore = weightedScore > decayAmount ? weightedScore - decayAmount : 0;
        
        // Ensure within bounds
        if (weightedScore > MAX_REPUTATION) {
            weightedScore = MAX_REPUTATION;
        }
        
        return weightedScore;
    }
    
    /**
     * @dev Apply reputation decay to all agents (call periodically)
     */
    function applyReputationDecay() external onlyOwner {
        // This would typically be called by a keeper or automation
        // Implementation depends on specific decay strategy
        emit ReputationDecay(address(0), 0, 0, block.timestamp);
    }
    
    /**
     * @dev Update weight factors for reputation calculation
     * @param _recentWeight Weight for recent ratings
     * @param _valueWeight Weight based on task value
     * @param _complexityWeight Weight based on task complexity
     * @param _decayRate Reputation decay rate
     */
    function updateWeightFactors(
        uint256 _recentWeight,
        uint256 _valueWeight,
        uint256 _complexityWeight,
        uint256 _decayRate
    ) external onlyOwner {
        weightFactors = WeightFactors({
            recentWeight: _recentWeight,
            valueWeight: _valueWeight,
            complexityWeight: _complexityWeight,
            decayRate: _decayRate
        });
        
        emit WeightFactorsUpdated(_recentWeight, _valueWeight, _complexityWeight, _decayRate);
    }
    
    /**
     * @dev Get reputation tier for an agent
     * @param _agent Agent address
     * @return Tier name and minimum reputation required
     */
    function getReputationTier(address _agent) external view returns (string memory, uint256) {
        uint256 score = agentMetrics[_agent].reputationScore;
        
        if (score >= 900) {
            return ("Platinum", 900);
        } else if (score >= 750) {
            return ("Gold", 750);
        } else if (score >= 600) {
            return ("Silver", 600);
        } else if (score >= 400) {
            return ("Bronze", 400);
        } else {
            return ("Unrated", 0);
        }
    }
    
    // View functions
    function getReputationMetrics(address _agent) external view returns (ReputationMetrics memory) {
        return agentMetrics[_agent];
    }
    
    function getReputationEvents(address _agent, uint256 _limit) external view returns (ReputationEvent[] memory) {
        ReputationEvent[] storage events = agentReputationEvents[_agent];
        uint256 length = _limit > 0 && _limit < events.length ? _limit : events.length;
        
        ReputationEvent[] memory result = new ReputationEvent[](length);
        for (uint256 i = 0; i < length; i++) {
            result[i] = events[events.length - length + i];
        }
        
        return result;
    }
    
    function getAverageRating(address _agent) external view returns (uint256) {
        return agentMetrics[_agent].averageRating;
    }
    
    function getReputationScore(address _agent) external view returns (uint256) {
        return agentMetrics[_agent].reputationScore;
    }
    
    function getTotalRatings(address _agent) external view returns (uint256) {
        return agentMetrics[_agent].ratingCount;
    }
    
    function getPositiveRatingCount(address _agent) external view returns (uint256) {
        return agentMetrics[_agent].positiveCount;
    }
    
    function getNegativeRatingCount(address _agent) external view returns (uint256) {
        return agentMetrics[_agent].negativeCount;
    }
    
    // Required for UUPS upgradeability
    function _authorizeUpgrade(address newImplementation) internal override onlyOwner {}
}
