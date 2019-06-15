pragma solidity ^0.4.24;

import "./SafeMath.sol";
import "./DOS.sol";


contract EurekaPlatform {

    using SafeMath for uint256;

    DOS eurekaTokenContract;
    address public contractOwner;

    /*
    *   journal parameters
    */
    // amount of rewarded reviewers
    uint minAmountOfEditorApprovedReviews = 2;
    uint maxAmountOfRewardedEditorApprovedReviews = 3;
    uint minAmountOfCommunityReviews = 0;
    uint maxAmountOfRewardedCommunityReviews = 10;

    // rewards amount
    uint sciencemattersFoundationReward = 1250;
    uint editorReward = 500;
    uint linkedArticlesReward = 750;
    uint invalidationWorkReward = 1000;
    uint editorApprovedReviewerRewardPerReviewer = 250;
    uint communityReviewerRewardPerReviewer = 50;
    uint secondReviewerRewardPerReviewer = 25;
    // resulting submissionFee
    uint public submissionFee =
    sciencemattersFoundationReward
    + editorReward
    + linkedArticlesReward
    + invalidationWorkReward
    + maxAmountOfRewardedEditorApprovedReviews * editorApprovedReviewerRewardPerReviewer
    + maxAmountOfRewardedCommunityReviews * communityReviewerRewardPerReviewer
    + maxAmountOfRewardedCommunityReviews * secondReviewerRewardPerReviewer;

    uint constant maxReviewRounds = 3;
    uint REVIEWER_TIMER_INTERVAL = 120; // in seconds
    uint NO_NEW_REVIEW_ROUND_INTERVAL = 180; // in seconds

    function setReviewerTimerInterval(uint256 reviewerTimerInterval) public {
        REVIEWER_TIMER_INTERVAL = reviewerTimerInterval;
    }

    //    function setNoNewReviewRoundInterval(uint256 noNewReviewRoundInterval) public {
    //        NO_NEW_REVIEW_ROUND_INTERVAL = noNewReviewRoundInterval;
    //    }

    function getJournalParameters() view public returns (
        address _contractOwner,
        uint _minAmountOfEditorApprovedReviews,
        uint _maxAmountOfRewardedEditorApprovedReviews,
        uint _minAmountOfCommunityReviews,
        uint _maxAmountOfRewardedCommunityReviews,
        uint _sciencemattersFoundationReward,
        uint _editorReward,
        uint _linkedArticlesReward,
        uint _invalidationWorkReward,
        uint _editorApprovedReviewerRewardPerReviewer,
        uint _communityReviewerRewardPerReviewer,
        uint _secondReviewerRewardPerReviewer,
        uint _submissionFee,
        uint _maxReviewRounds
    ) {
        return (
        contractOwner,
        minAmountOfEditorApprovedReviews,
        maxAmountOfRewardedEditorApprovedReviews,
        minAmountOfCommunityReviews,
        maxAmountOfRewardedCommunityReviews,
        sciencemattersFoundationReward,
        editorReward,
        linkedArticlesReward,
        invalidationWorkReward,
        editorApprovedReviewerRewardPerReviewer,
        communityReviewerRewardPerReviewer,
        secondReviewerRewardPerReviewer,
        submissionFee,
        maxReviewRounds
        );
    }

    /* in future this constructor:
        constructor(
            address _eurekaTokenContractAddress,
            uint256 _minAmountOfEditorApprovedReviews,
            uint256 _maxAmountOfRewardedEditorApprovedReviews,
            ...
            ) public {
    */
    constructor() public {

        /*  eurekaTokenContract = Eureka(_eurekaTokenContractAddress);
            minAmountOfEditorApprovedReviews = _minAmountOfEditorApprovedReviews;
            maxAmountOfRewardedEditorApprovedReviews = _maxAmountOfRewardedEditorApprovedReviews;
            ...
        */
        contractOwner = msg.sender;
    }

    //TODO: this method is not needed if constructor is configured properly
    function setEurekaTokenContract(address _eurekaTokenContractAddress) public {
        require(msg.sender == contractOwner, "only the contract owner can call this function");
        eurekaTokenContract = DOS(_eurekaTokenContractAddress);
    }

    mapping(address => bool) public isEditor;
    mapping(address => bool) public isExpertReviewer;

    // primary key mappings
    uint256 submissionCounter;
    mapping(uint256 => ArticleSubmission) public articleSubmissions;
    mapping(bytes32 => ArticleVersion) public articleVersions;
    // mapping by articleHash and reviewer address
    mapping(bytes32 => mapping(address => Review)) public  reviews;

    // address mappings TODO: are these mappings needed?
    //    mapping(address => int256[]) articleSubmissionsBySubmissionOwner;
    //    mapping(address => int256[]) articleSubmissionsByEditor;
    //    mapping(address => bytes32[]) articleVersionsByAuthor;
    //    mapping(address => bytes32[]) reviewedArticlesByReviewer;         // return an array of articleVersion hashes which can be used for looking up the reviews


    enum SubmissionState {
        NOT_EXISTING,
        OPEN,
        EDITOR_ASSIGNED,
        NEW_REVIEW_ROUND_REQUESTED,
        CLOSED
    }
    // different ArticleVersion from different review-rounds are saved in the same ArticleSubmission Object
    struct ArticleSubmission {
        uint256 submissionId;
        SubmissionState submissionState;
        uint256 stateTimestamp;
        address submissionOwner;
        bytes32[] versions;
        address editor;
    }

    enum ArticleVersionState {
        NOT_EXISTING,
        SUBMITTED,
        OPEN_FOR_ALL_REVIEWERS,
        NOT_ENOUGH_REVIEWERS,
        DECLINED_SANITY_NOTOK,
        DECLINED,
        ACCEPTED
    }

    // an ArticleSubmission can have different versions
    struct ArticleVersion {
        uint256 submissionId;
        bytes32 articleHash;
        // the timestamp when the article was published
        uint256 publishedTimestamp;
        // the URL where the article is saved
        //TODO: URL can be resp. IS USUALLY bigger than bytes32 -> us string and length indicator in bytes parser
        bytes32 articleUrl;

        ArticleVersionState versionState;
        uint256 stateTimestamp;

        address[] authors;
        // the submission owner can weight the contributions of the different authors [0;10000]
        //  ( e.g. 3 authors with 1/3 contribution each: {3334,3333,3333} )
        uint16[] authorContributionRatios;
        // the hashes of the linked articles
        bytes32[] linkedArticles;
        // the submission owner can weight the impact of the linked articles [0;10000]
        uint16[] linkedArticlesSplitRatios;

        // the reviewers which are approved from the editor
        address[] editorApprovedReviews;
        // every community reviewer can add a community review without being approved
        address[] communityReviews;
    }

    enum ReviewState {
        NOT_EXISTING,
        SIGNED_UP_FOR_REVIEWING,
        HANDED_IN,
        REVIEWER_REJECTED,
        DECLINED,
        ACCEPTED
    }
    struct Review {
        bytes32 articleHash;
        address reviewer;

        bool isEditorApprovedReview;

        ReviewState reviewState;

        // with each state change the stateTimestamp field is updated
        uint256 stateTimestamp;

        bytes32 reviewHash;
        uint256 reviewedTimestamp;

        // if set to true, the editor cannot accept the article if he/she accepts this review
        bool articleHasMajorIssues;
        // acceptance of article is still possible although set to true
        bool articleHasMinorIssues;

        uint8 score1;
        uint8 score2;

        // address of the reviewer who reviewed this review (if at state ACCEPTED or DECLINED)
        address reviewedBy;
    }

    function getLinkedArticles(bytes32 hash) public view returns (bytes32[] linkedArticles) {
        linkedArticles = articleVersions[hash].linkedArticles;
    }

    function getAuthors(bytes32 hash) public view returns (address[] authors) {
        authors = articleVersions[hash].authors;
    }

    /*
        journal administration methods
    */
    event EditorSignUp(address submissionOwner, address editorAddress, uint256 stateTimestamp);

    function signUpEditor(address editor) public {

        require(msg.sender == contractOwner, "msg.sender must be the contract owner to call this function");
        isEditor[editor] = true;
        emit EditorSignUp(msg.sender, editor, block.timestamp);
    }

    event EditorResigned(address contractOwner, address editorAddress, uint256 stateTimestamp);

    function resignEditor(address editor) public {

        require(msg.sender == contractOwner, "msg.sender must be the contract owner to call this function");
        isEditor[editor] = false;
        emit EditorResigned(msg.sender, editor, block.timestamp);
    }

    event ExpertReviewerSignUp(address contractOwner, address reviewerAddress, uint256 stateTimestamp);

    function signUpExpertReviewer(address expertReviewer) public {

        require(msg.sender == contractOwner, "msg.sender must be the contract owner to call this function");
        isExpertReviewer[expertReviewer] = true;
        emit ExpertReviewerSignUp(msg.sender, expertReviewer, block.timestamp);
    }

    function signUpExpertReviewers(address[] expertReviewers) public {

        require(msg.sender == contractOwner, "msg.sender must be the contract owner to call this function");

        for(uint i=0; i < expertReviewers.length; i++) {
            isExpertReviewer[expertReviewers[i]] = true;
            emit ExpertReviewerSignUp(msg.sender, expertReviewers[i], block.timestamp);
        }
    }

    event ExpertReviewerResigned(address contractOwner, address editorAddress, uint256 stateTimestamp);

    function resignExpertReviewer(address expertReviewer) public {

        require(msg.sender == contractOwner, "msg.sender must be the contract owner to call this function");
        isExpertReviewer[expertReviewer] = false;
        emit ExpertReviewerResigned(msg.sender, expertReviewer, block.timestamp);
    }

    /*
        submission process methods
    */
    event SubmissionProcessStart(uint256 submissionId, address submissionOwner, bytes32 articleHash, bytes32 articleURL, uint256 stateTimestamp);

//    function startSubmissionProcess(
//        address _from,
//        uint256 _value,
//        bytes32 _articleHash, bytes32 _articleURL, address[] _authors,
//        uint16[] _authorContributionRatios, bytes32[] _linkedArticles, uint16[] _linkedArticlesSplitRatios) public {
//
//        //        require(msg.sender == address(eurekaTokenContract));
//        require(_value == submissionFee, 'transferred amount needs to equal the submission fee');
//
//        uint submissionId = submissionCounter++;
//        ArticleSubmission storage submission = articleSubmissions[submissionId];
//
//        submission.submissionId = submissionId;
//        submission.submissionOwner = _from;
//
//        submitArticleVersion(submissionId, _articleHash, _articleURL, _authors, _authorContributionRatios, _linkedArticles, _linkedArticlesSplitRatios);
//
//        submission.submissionState = SubmissionState.OPEN;
//        submission.stateTimestamp = block.timestamp;
//        emit SubmissionProcessStart(submission.submissionId, submission.submissionOwner, _articleHash, _articleURL, block.timestamp);
//    }

    event TestEvent (uint256 first, bytes32 second);
    function serviceContractTestFunction(address _from, uint256 _value, uint256 first, bytes32 second) public {
        emit TestEvent(first, second);
    }

    function submitArticleVersion(uint256 _submissionId, bytes32 _articleHash, bytes32 _articleURL,
        address[] _authors, uint16[] _authorContributionRatios, bytes32[] _linkedArticles, uint16[] _linkedArticlesSplitRatios) private {

        ArticleVersion storage article = articleVersions[_articleHash];
        require(article.submissionId == 0, 'Article was already uploaded.');
        // edge case: two articles have the same hash

        article.submissionId = _submissionId;
        article.articleHash = _articleHash;
        article.articleUrl = _articleURL;
        article.publishedTimestamp = block.timestamp;

        article.authors = _authors;
        article.authorContributionRatios = _authorContributionRatios;
        article.linkedArticles = _linkedArticles;
        article.linkedArticlesSplitRatios = _linkedArticlesSplitRatios;

        articleSubmissions[_submissionId].versions.push(article.articleHash);
        article.versionState = ArticleVersionState.SUBMITTED;
        article.stateTimestamp = block.timestamp;
    }


    event AssignmentForSubmissionProcess(address assignerAddress, uint256 submissionId, uint256 stateTimestamp);
    // a journal editor can assign him/herself to an article submission process
    // if the process is not already claimed by another editor
    function assignForSubmissionProcess(uint256 _submissionId) public {

        require(isEditor[msg.sender], "the sender of the transaction must be an editor to call this function.");

        ArticleSubmission storage submission = articleSubmissions[_submissionId];
        require(submission.submissionState == SubmissionState.OPEN, "the submission process needs to be OPEN to call this method.");
        require(submission.editor == address(0), "the submission process is already assigned to an editor.");
        require(msg.sender != submission.submissionOwner, "the submission owner can't be the editor of the same submission process");

        submission.editor = msg.sender;
        submission.submissionState = SubmissionState.EDITOR_ASSIGNED;
        submission.stateTimestamp = block.timestamp;
        emit AssignmentForSubmissionProcess(msg.sender, _submissionId, block.timestamp);
    }

    event RemovedEditorFromSubmission(uint submissionId, uint256 stateTimestamp);

    function removeEditorFromSubmissionProcess(uint256 _submissionId) public {
        ArticleSubmission storage submission = articleSubmissions[_submissionId];

        require(submission.submissionState == SubmissionState.EDITOR_ASSIGNED, "an editor needs to be assigned to call this function.");
        require(msg.sender == contractOwner
        || msg.sender == submission.editor, "an editor can only be removed by the contract owner or itself.");

        submission.editor = address(0);
        submission.submissionState = SubmissionState.OPEN;
        submission.stateTimestamp = block.timestamp;
        emit RemovedEditorFromSubmission(_submissionId, block.timestamp);
    }

    // is it a good idea that the current editor can assign another editor? or should only removing (method below) be possible?
    event ChangedEditorFromSubmission(uint256 submissionId, address newEditor, uint256 stateTimestamp);

    function changeEditorFromSubmissionProcess(uint256 _submissionId, address _newEditor) public {
        ArticleSubmission storage submission = articleSubmissions[_submissionId];
        require(submission.submissionState == SubmissionState.EDITOR_ASSIGNED, "an editor needs to be assigned to call this function.");
        require(isEditor[_newEditor], 'the new editor must be an allowed editor.');

        require(msg.sender == contractOwner
        || msg.sender == submission.editor, "an editor can only be changed by the contract owner or the current editor.");

        submission.editor = _newEditor;
        submission.stateTimestamp = block.timestamp;
        emit ChangedEditorFromSubmission(_submissionId, _newEditor, submission.stateTimestamp);
    }

    event SanityIsOk(uint256 submissionId, bytes32 articleHash, uint256 stateTimestamp);

    function sanityIsOk(bytes32 _articleHash) public {

        require(articleSubmissions[articleVersions[_articleHash].submissionId].editor == msg.sender, "msg.sender must be the editor of this submission process");

        ArticleVersion storage article = articleVersions[_articleHash];
        require(article.versionState == ArticleVersionState.SUBMITTED, "this method can't be called. version state must be SUBMITTED.");

        article.versionState = ArticleVersionState.OPEN_FOR_ALL_REVIEWERS;
        article.stateTimestamp = block.timestamp;
        emit SanityIsOk(articleVersions[_articleHash].submissionId, _articleHash, block.timestamp);
    }

    event SanityIsNotOk(uint256 submissionId, bytes32 articleHash, uint256 stateTimestamp);

    function sanityIsNotOk(bytes32 _articleHash) public {

        require(articleSubmissions[articleVersions[_articleHash].submissionId].editor == msg.sender, "msg.sender must be the editor of this submission process");

        ArticleVersion storage article = articleVersions[_articleHash];
        require(article.versionState == ArticleVersionState.SUBMITTED, "this method can't be called. version state must be SUBMITTED.");

        article.versionState = ArticleVersionState.DECLINED_SANITY_NOTOK;
        article.stateTimestamp = block.timestamp;

        requestNewReviewRound(article.submissionId);
        emit SanityIsNotOk(articleVersions[_articleHash].submissionId, _articleHash, block.timestamp);
    }

    event SignedUpForReviewing(bytes32 articleHash, address reviewerAddress, uint256 stateTimestamp, bool isEditorApprovedReview);
    function signUpForReviewing(bytes32 _articleHash) public {

        require(isExpertReviewer[msg.sender], "msg.sender must be an expert reviewer to sign up for adding an expert review.");

        require(articleVersions[_articleHash].versionState == ArticleVersionState.OPEN_FOR_ALL_REVIEWERS, "this method can't be called. version state must be OPEN_FOR_ALL_REVIEWERS.");

        Review storage review = reviews[_articleHash][msg.sender];
        require(review.reviewState == ReviewState.NOT_EXISTING, "the review already exists or the reviewer is already signed up.");

        review.reviewState = ReviewState.SIGNED_UP_FOR_REVIEWING;
        review.stateTimestamp = block.timestamp;
        review.reviewer = msg.sender;
        review.isEditorApprovedReview = true;

        articleVersions[_articleHash].editorApprovedReviews.push(review.reviewer);
        emit SignedUpForReviewing(_articleHash, msg.sender, block.timestamp, review.isEditorApprovedReview);
    }

    event ResignedFromReviewing(bytes32 articleHash, address reviewerAddress, uint256 stateTimestamp);
    function resignFromReviewing(bytes32 _articleHash, address reviewerAddress) public {

        require(msg.sender == contractOwner
        || msg.sender == articleSubmissions[articleVersions[_articleHash].submissionId].editor
        || msg.sender == reviewerAddress, "msg.sender must be the editor of the review process, the reviewer or the contract-owner.");
        require(articleVersions[_articleHash].versionState <= ArticleVersionState.OPEN_FOR_ALL_REVIEWERS, "this method can't be called. the review proccess of this article version is not open.");

        Review storage review = reviews[_articleHash][reviewerAddress];
        require(review.reviewState == ReviewState.SIGNED_UP_FOR_REVIEWING,
            "this method can't be called. the review must be in the state 'INVITED' or 'SIGNED_UP_FOR_REVIEWING'.");

        // check for timeout based dropout
        if(msg.sender == contractOwner && (block.timestamp - REVIEWER_TIMER_INTERVAL - review.stateTimestamp) > 0) {
            revert("Current time has not exceeded the given time-interval. The reviewer cannot be removed yet");
        }

        review.reviewState = ReviewState.NOT_EXISTING;
        review.stateTimestamp = 0;
        review.reviewer = address(0);
        review.isEditorApprovedReview = false;

        emit ResignedFromReviewing(_articleHash, reviewerAddress,  block.timestamp);
    }

    event EditorApprovedReviewIsAdded(bytes32 articleHash, bytes32 reviewHash, address reviewerAddress, bool articleHasMajorIssues, bool articleHasMinorIssues, uint8 score1, uint8 score2, uint256 stateTimestamp);

    function addEditorApprovedReview(bytes32 _articleHash, bytes32 _reviewHash, bool _articleHasMajorIssues, bool _articleHasMinorIssues, uint8 _score1, uint8 _score2) public {

        require(isExpertReviewer[msg.sender], "msg.sender must be an expert reviewer to add an expert review.");

        require(articleVersions[_articleHash].versionState == ArticleVersionState.OPEN_FOR_ALL_REVIEWERS, "this method can't be called. version state must be OPEN_FOR_ALL_REVIEWERS.");

        Review storage review = reviews[_articleHash][msg.sender];

        require(review.reviewState <= ReviewState.SIGNED_UP_FOR_REVIEWING, "msg.sender cannot add an editor approved review");

        if (review.reviewState == ReviewState.NOT_EXISTING)
            signUpForReviewing(_articleHash);

        review.isEditorApprovedReview = true;
        review.reviewHash = _reviewHash;
        review.reviewedTimestamp = block.timestamp;
        review.articleHasMajorIssues = _articleHasMajorIssues;
        review.articleHasMinorIssues = _articleHasMinorIssues;
        review.score1 = _score1;
        review.score2 = _score2;

        review.reviewState = ReviewState.HANDED_IN;
        review.stateTimestamp = block.timestamp;
        emit EditorApprovedReviewIsAdded(_articleHash, _reviewHash, review.reviewer, _articleHasMajorIssues, _articleHasMinorIssues, _score1, _score2, block.timestamp);
    }

    event CommunityReviewIsAdded(bytes32 articleHash, bytes32 reviewHash, address reviewerAddress, bool articleHasMajorIssues, bool articleHasMinorIssues, uint8 score1, uint8 score2, uint256 stateTimestamp);

    function addCommunityReview(bytes32 _articleHash, bytes32 _reviewHash, bool _articleHasMajorIssues, bool _articleHasMinorIssues, uint8 _score1, uint8 _score2) public {

        require(articleVersions[_articleHash].versionState >= ArticleVersionState.SUBMITTED
        , "this method can't be called. the article version does not exist.");

        Review storage review = reviews[_articleHash][msg.sender];
        require(review.reviewState == ReviewState.NOT_EXISTING, "the review already exists.");

        review.reviewer = msg.sender;

        review.isEditorApprovedReview = false;
        review.reviewHash = _reviewHash;
        review.reviewedTimestamp = block.timestamp;
        review.articleHasMajorIssues = _articleHasMajorIssues;
        review.articleHasMinorIssues = _articleHasMinorIssues;
        review.score1 = _score1;
        review.score2 = _score2;

        articleVersions[_articleHash].communityReviews.push(review.reviewer);
        review.reviewState = ReviewState.HANDED_IN;
        review.stateTimestamp = block.timestamp;
        emit CommunityReviewIsAdded(_articleHash, _reviewHash, review.reviewer, _articleHasMajorIssues, _articleHasMinorIssues, _score1, _score2, block.timestamp);
    }

    event ReviewIsCorrected(bytes32 oldReviewHash, bytes32 articleHash, address reviewerAddress, bytes32 reviewHash, bool articleHasMajorIssues, bool articleHasMinorIssues, uint8 score1, uint8 score2,  uint256 stateTimestamp);
    function correctReview(bytes32 _articleHash, bytes32 _reviewHash, bool _articleHasMajorIssues, bool _articleHasMinorIssues, uint8 _score1, uint8 _score2) public {

        Review storage review = reviews[_articleHash][msg.sender];
        require(review.reviewState == ReviewState.DECLINED
        || review.reviewState == ReviewState.ACCEPTED, "this method can't be called. only declined or already accepted reviews can be corrected.");

        bytes32 oldReviewHash = review.reviewHash;
        review.reviewHash = _reviewHash;
        review.reviewedTimestamp = block.timestamp;
        review.articleHasMajorIssues = _articleHasMajorIssues;
        review.articleHasMinorIssues = _articleHasMinorIssues;
        review.score1 = _score1;
        review.score2 = _score2;

        review.reviewState = ReviewState.HANDED_IN;
        review.stateTimestamp = block.timestamp;
        emit ReviewIsCorrected(oldReviewHash, _articleHash, msg.sender, _reviewHash, _articleHasMajorIssues, _articleHasMinorIssues, _score1, _score2, block.timestamp);
    }

    event ReviewIsAccepted(bytes32 articleHash, address reviewer, uint256 stateTimestamp);

    function acceptReview(bytes32 _articleHash, address _reviewerAddress) public {

        // in the future not only the editor will be able to accept reviews. for example expert reviewers or reviewers with a high reputation score will be able to do it
        require(articleSubmissions[articleVersions[_articleHash].submissionId].editor == msg.sender, "msg.sender must be the editor of this submission process");

        Review storage review = reviews[_articleHash][_reviewerAddress];
        require(review.reviewState == ReviewState.HANDED_IN, "to accept the review, the review state must be HANDED_IN.");

        // another solution would be to store the reviewer of the review in an array and devide the reward in the end by the number of reviewers
        require(review.reviewedBy == address(0)
        || review.reviewedBy == msg.sender, "a corrected review must be checked from the same user than before.");

        review.reviewState = ReviewState.ACCEPTED;
        review.stateTimestamp = block.timestamp;
        review.reviewedBy = msg.sender;
        emit ReviewIsAccepted(_articleHash, _reviewerAddress, block.timestamp);
    }

    event ReviewIsDeclined(bytes32 articleHash, address reviewer, uint256 stateTimestamp);

    function declineReview(bytes32 _articleHash, address _reviewerAddress) public {

        require(articleSubmissions[articleVersions[_articleHash].submissionId].editor == msg.sender, "msg.sender must be the editor of this submission process");

        Review storage review = reviews[_articleHash][_reviewerAddress];
        require(review.reviewState == ReviewState.HANDED_IN, "to decline the review, the review state must be HANDED_IN.");

        require(review.reviewedBy == address(0)
        || review.reviewedBy == msg.sender, "a corrected review must be checked from the same user than before.");

        review.reviewState = ReviewState.DECLINED;
        review.stateTimestamp = block.timestamp;
        review.reviewedBy = msg.sender;
        emit ReviewIsDeclined(_articleHash, _reviewerAddress, block.timestamp);
    }

    event ReviewerRejected(bytes32 articleHash, address reviewer, uint256 stateTimestamp);
    function rejectReviewer(bytes32 _articleHash, address _reviewerAddress) public {

        require(articleSubmissions[articleVersions[_articleHash].submissionId].editor == msg.sender, "msg.sender must be the editor of this submission process");

        Review storage review = reviews[_articleHash][_reviewerAddress];
        require(review.reviewState == ReviewState.SIGNED_UP_FOR_REVIEWING
        || review.reviewState == ReviewState.HANDED_IN
        || review.reviewState == ReviewState.DECLINED, "the reviewer can't be rejected.");

        review.reviewState = ReviewState.REVIEWER_REJECTED;
        review.stateTimestamp = block.timestamp;
        review.reviewedBy = msg.sender;
        emit ReviewerRejected(_articleHash, _reviewerAddress, block.timestamp);
    }

    event ArticleVersionIsAccepted(bytes32 articleHash, address editor, uint256 stateTimestamp);

    function acceptArticleVersion(bytes32 _articleHash) public {

        ArticleVersion storage article = articleVersions[_articleHash];

        require(articleSubmissions[article.submissionId].editor == msg.sender, "msg.sender must be the editor of this submission process");

        require(article.versionState <= ArticleVersionState.OPEN_FOR_ALL_REVIEWERS, "this method can't be called. the article version must be sanity checked and must not be already closed.");

        require(countAcceptedReviews(article.articleHash, article.editorApprovedReviews) >= minAmountOfEditorApprovedReviews,
            "the article doesn't have enough accepted editor approved reviews to be accepted.");
        require(countAcceptedReviews(article.articleHash, article.communityReviews) >= minAmountOfCommunityReviews,
            "the article doesn't have enough accepted community reviews to be accepted.");

        require(countSignedUpForReviewing(article.articleHash, article.editorApprovedReviews) == 0,
            "this method can't be called. there are users still working on reviews.");

        require(countReviewsWithMajorIssues(article.articleHash, article.editorApprovedReviews) == 0,
            "the article needs to be corrected.");
        require(countReviewsWithMajorIssues(article.articleHash, article.communityReviews) == 0,
            "the article needs to be corrected.");

        article.versionState = ArticleVersionState.ACCEPTED;
        article.stateTimestamp = block.timestamp;

        closeSubmissionProcess(article.submissionId);
        emit ArticleVersionIsAccepted(_articleHash, msg.sender, block.timestamp);
    }

    event DeclineArticleVersion(bytes32 articleHash, address editor, uint256 stateTimestamp);

    function declineArticleVersion(bytes32 _articleHash) public {

        ArticleVersion storage article = articleVersions[_articleHash];

        require(articleSubmissions[article.submissionId].editor == msg.sender, "msg.sender must be the editor of this submission process");

        require(article.versionState <= ArticleVersionState.OPEN_FOR_ALL_REVIEWERS, "this method can't be called. the article version must be sanity checked and must not be already closed.");


        require(countAcceptedReviews(article.articleHash, article.editorApprovedReviews) >= minAmountOfEditorApprovedReviews,
            "the article doesn't have enough accepted editor approved reviews to be declined.");
        require(countAcceptedReviews(article.articleHash, article.communityReviews) >= minAmountOfCommunityReviews,
            "the article doesn't have enough accepted community reviews to be declined.");

        require(countSignedUpForReviewing(article.articleHash, article.editorApprovedReviews) == 0,
            "this method can't be called. there are users still working on reviews.");

        article.versionState = ArticleVersionState.DECLINED;

        if (countRewardedReviewRounds(article.submissionId) >= maxReviewRounds)
            closeSubmissionProcess(article.submissionId);
        else
            requestNewReviewRound(article.submissionId);

        emit DeclineArticleVersion(_articleHash, msg.sender, block.timestamp);
    }

    event DeclineArticleVersionAndClose(bytes32 articleHash, address editor, uint256 stateTimestamp);

    function declineArticleVersionAndClose(bytes32 _articleHash) public {

        ArticleVersion storage article = articleVersions[_articleHash];

        require(articleSubmissions[article.submissionId].editor == msg.sender, "msg.sender must be the editor of this submission process");

        require(article.versionState <= ArticleVersionState.OPEN_FOR_ALL_REVIEWERS, "this method can't be called. the article version must be sanity checked and must not be already closed.");


        require(countAcceptedReviews(article.articleHash, article.editorApprovedReviews) >= minAmountOfEditorApprovedReviews,
            "the article doesn't have enough accepted editor approved reviews to be declined.");
        require(countAcceptedReviews(article.articleHash, article.communityReviews) >= minAmountOfCommunityReviews,
            "the article doesn't have enough accepted community reviews to be declined.");

        require(countSignedUpForReviewing(article.articleHash, article.editorApprovedReviews) == 0,
            "this method can't be called. there are users still working on reviews.");

        article.versionState = ArticleVersionState.DECLINED;

        closeSubmissionProcess(article.submissionId);
        emit DeclineArticleVersionAndClose(_articleHash, msg.sender, block.timestamp);
    }

    function countSignedUpForReviewing(bytes32 _articleHash, address[] _reviewers) view private returns (uint count) {
        for (uint i = 0; i < _reviewers.length; i++) {
            if (reviews[_articleHash][_reviewers[i]].reviewState == ReviewState.SIGNED_UP_FOR_REVIEWING)
                count++;
        }
        return count;
    }

    function countAcceptedReviews(bytes32 _articleHash, address[] _reviewers) view private returns (uint count) {
        count = 0;
        for (uint i = 0; i < _reviewers.length; i++) {
            if (reviews[_articleHash][_reviewers[i]].reviewState == ReviewState.ACCEPTED)
                count++;
        }
        return count;
    }

    function countReviewsWithMajorIssues(bytes32 _articleHash, address[] _reviewers) view private returns (uint count) {
        for (uint i = 0; i < _reviewers.length; i++) {
            if (reviews[_articleHash][_reviewers[i]].reviewState == ReviewState.ACCEPTED
            && reviews[_articleHash][_reviewers[i]].articleHasMajorIssues)
                count++;
        }
        return count;
    }

    // only counts the articles which went through a review process and therefore have the state DECLINED
    // does not consider the versions with state DECLINED_SANITY_NOTOK
    function countRewardedReviewRounds(uint256 _submissionId) view private returns (uint count) {
        bytes32[] memory versions = articleSubmissions[_submissionId].versions;
        for (uint i = 0; i < versions.length; i++) {
            if (articleVersions[versions[i]].versionState == ArticleVersionState.DECLINED
            || articleVersions[versions[i]].versionState == ArticleVersionState.ACCEPTED)
                count++;
        }
        return count;
    }

    event NewReviewRoundRequested(uint256 submissionId, uint256 stateTimestamp);
    function requestNewReviewRound(uint256 _submissionId) private {

        articleSubmissions[_submissionId].submissionState = SubmissionState.NEW_REVIEW_ROUND_REQUESTED;
        articleSubmissions[_submissionId].stateTimestamp = block.timestamp;
        emit NewReviewRoundRequested(_submissionId, block.timestamp);
    }

    event NewReviewRoundOpened(uint256 submissionId, bytes32 articleHash, bytes32 articleUrl, uint256 stateTimestamp);
    function openNewReviewRound(uint256 _submissionId, bytes32 _articleHash, bytes32 _articleURL, address[] _authors,
        uint16[] _authorContributionRatios, bytes32[] _linkedArticles, uint16[] _linkedArticlesSplitRatios) public {

        ArticleSubmission storage submission = articleSubmissions[_submissionId];
        require(msg.sender == submission.submissionOwner, "only the submission process owner can submit a new article version.");
        require(submission.submissionState == SubmissionState.NEW_REVIEW_ROUND_REQUESTED,
            "this method can't be called. the submission process state must be NEW_REVIEW_ROUND_REQUESTED.");

        submitArticleVersion(_submissionId, _articleHash, _articleURL, _authors, _authorContributionRatios, _linkedArticles, _linkedArticlesSplitRatios);

        submission.submissionState = SubmissionState.EDITOR_ASSIGNED;
        submission.stateTimestamp = block.timestamp;
        emit NewReviewRoundOpened(_submissionId, _articleHash, _articleURL, block.timestamp);
    }

    event NewReviewRoundDeclined(uint256 submissionId, uint256 stateTimestamp);

    function declineNewReviewRound(uint256 _submissionId) public {

        require(msg.sender == articleSubmissions[_submissionId].submissionOwner
        || msg.sender == contractOwner,
            "only the submission process owner can call this method");
        require(articleSubmissions[_submissionId].submissionState == SubmissionState.NEW_REVIEW_ROUND_REQUESTED,
            "this method can't be called. the submission process state must be NEW_REVIEW_ROUND_REQUESTED.");


        //        if(msg.sender == contractOwner && (block.timestamp - NO_NEW_REVIEW_ROUND_INTERVAL - articleSubmissions[_submissionId].stateTimestamp) > 0) {
        //            revert("Current time has not exceeded the given time-interval. The reviewer cannot be removed yet");
        //        }

        closeSubmissionProcess(_submissionId);
        emit NewReviewRoundDeclined(_submissionId, block.timestamp);
    }

    event SubmissionProcessClosed(uint256 submissionId, uint256 stateTimestamp);
    function closeSubmissionProcess(uint256 _submissionId) private {

        ArticleSubmission storage submission = articleSubmissions[_submissionId];

        // transfer rewards to science matters foundation and editor
        require(eurekaTokenContract.transfer(contractOwner, sciencemattersFoundationReward));
        require(eurekaTokenContract.transfer(submission.editor, editorReward));

        // counts how many reviewRounds happened to devide the reward later
        uint reviewRounds = countRewardedReviewRounds(_submissionId);

        //distributes the rewards to all reviewers, for every round a seperate transfer
        for (uint i = 0; i < submission.versions.length; i++) {
            ArticleVersion memory articleVersion = articleVersions[submission.versions[i]];
            if (articleVersion.versionState == ArticleVersionState.DECLINED
            || articleVersion.versionState == ArticleVersionState.ACCEPTED) {

                rewardEditorApprovedReviews(articleVersion, reviewRounds);
                rewardCommunityReviews(articleVersion, reviewRounds);
            }
        }

        articleVersion = articleVersions[submission.versions[submission.versions.length - 1]];
        //reward linked articles if article is accepted
        if (articleVersion.versionState == ArticleVersionState.ACCEPTED) {
            for (i = 0; i < articleVersion.linkedArticles.length; i++) {

                ArticleVersion memory linkedArticle = articleVersions[articleVersion.linkedArticles[i]];
                uint rewardForArticle = linkedArticlesReward.mul(articleVersion.linkedArticlesSplitRatios[i]).div(10000);

                for (uint a=0; a < linkedArticle.authors.length; a++) {

                    require(
                        eurekaTokenContract.transfer(
                            linkedArticle.authors[a],
                        // reward for article is splitted relatively to the contribution
                            rewardForArticle.mul(linkedArticle.authorContributionRatios[a]).div(10000)
                        )
                    );
                }
            }

            //TODO: reward invalidation work, check also if time is already up
        }
        submission.submissionState = SubmissionState.CLOSED;
        submission.stateTimestamp = block.timestamp;
        emit SubmissionProcessClosed(_submissionId, block.timestamp);
    }

    function rewardEditorApprovedReviews(ArticleVersion _articleVersion, uint _reviewRounds) private {
        uint rewardedReviewers = 0;
        for (uint i = 0; i < _articleVersion.editorApprovedReviews.length; i++) {
            if (rewardedReviewers < maxAmountOfRewardedEditorApprovedReviews) {
                if (reviews[_articleVersion.articleHash][_articleVersion.editorApprovedReviews[i]].reviewState == ReviewState.ACCEPTED) {
                    // transfer reward to editor approved reviewer
                    require(
                        eurekaTokenContract.transfer(
                            _articleVersion.editorApprovedReviews[i],
                            editorApprovedReviewerRewardPerReviewer.div(_reviewRounds)
                        ));
                    rewardedReviewers++;
                }
            }
            else
                return;
        }
    }

    function rewardCommunityReviews(ArticleVersion _articleVersion, uint _reviewRounds) private {
        uint rewardedReviewers = 0;
        for (uint i = 0; i < _articleVersion.communityReviews.length; i++) {
            if (rewardedReviewers < maxAmountOfRewardedCommunityReviews) {
                if (reviews[_articleVersion.articleHash][_articleVersion.communityReviews[i]].reviewState == ReviewState.ACCEPTED) {
                    // reward community reviewer
                    require(
                        eurekaTokenContract.transfer(
                            _articleVersion.communityReviews[i],
                            communityReviewerRewardPerReviewer.div(_reviewRounds)
                        ));
                    // reward the reviewer of the community review
                    require(
                        eurekaTokenContract.transfer(
                            reviews[_articleVersion.articleHash][_articleVersion.communityReviews[i]].reviewedBy,
                            secondReviewerRewardPerReviewer.div(_reviewRounds)
                        ));
                    rewardedReviewers++;
                }
            }
            else
                return;
        }
    }
}
