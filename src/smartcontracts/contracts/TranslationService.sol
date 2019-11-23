pragma solidity ^0.5.12;

import "./CHFT.sol";


contract TranlationService {
    
    CHFT CHFTContract;

    struct TranslationRequest {
        address requester;
        uint256 reward;
        uint improvementRequestedTimestamp;
        address translator;
        string translation;
        uint256 translationHandinTimestamp;
        
        bool rewardCollected;
    }

    mapping (bytes32 => TranslationRequest) requests;

    // the requester has around 3 days to request an improvement, after these 3 days, the translator can collect the reward
    // in blocks, avg blocktime 13 seconds -> 60 * 60 * 24 * 3 / 13secs = 19938 blocks
    uint256 timeForImprovementRequest = 14; // for testing purposes around 3 minutes instead of 3 days //*60*24;

    constructor(address _CHFTContracAddress) public {
        CHFTContract = CHFT(_CHFTContracAddress); 
    }

    function requestTranslation(address _requester, uint256 _reward, string memory _originalUrl) public {

        // make sure that the amount was really transferred
        require(msg.sender == address(CHFTContract));
        
        TranslationRequest storage request = requests[keccak256(bytes(_originalUrl))];
        request.requester = _requester;
        request.reward = _reward;
        request.improvementRequestedTimestamp = block.number;
    }
    
    function withdrawRequestTranslation(address _requester, uint256 _value, string memory _originalUrl) public {
        TranslationRequest storage request = requests[keccak256(bytes(_originalUrl))];
        
        require(_requester == request.requester, "only the requester can withdraw his request");
        require(request.translator == address(0), "the request can only be withdrawn if there is no translation already");

        require(CHFTContract.transfer(request.requester, request.reward));
    }

    function requestImprovement(address _requester, uint256 _value, string memory _originalUrl) public {
        TranslationRequest storage request = requests[keccak256(bytes(_originalUrl))];
        
        require(_requester == request.requester, "only the requester can withdraw his request");
        request.improvementRequestedTimestamp = block.number;
    }

    function translationSubmission(address _translator, uint256 _value, string memory _originalUrl, string memory _translationUrl) public {
        TranslationRequest storage request = requests[keccak256(bytes(_originalUrl))];
        
        require(request.translator == address(0) || request.translator == _translator, "already translated by someone else");
        
        request.translator = _translator;
        request.translation = _translationUrl;
        request.translationHandinTimestamp = block.number;

    }

    function collectReward(address _collector, uint256 _value, string memory _originalUrl) public {
        TranslationRequest storage request = requests[keccak256(bytes(_originalUrl))];
        
        require(_collector == request.translator, "only the translator can collect the reward");
        require(!request.rewardCollected, "the reward is already collected");
        require(request.translationHandinTimestamp > request.improvementRequestedTimestamp, "the reward can only be collected if no improvement is requested");
        
        require(request.translationHandinTimestamp - timeForImprovementRequest > request.improvementRequestedTimestamp, "the reward can only be collected if no improvement is requested and if the time for a request has expired");
        
        request.rewardCollected = true;
        require(CHFTContract.transfer(request.translator, request.reward));
    }
}

