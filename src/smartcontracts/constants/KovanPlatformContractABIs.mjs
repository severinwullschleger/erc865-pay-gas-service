export const PLATFORM_KOVAN_ABI =
  [
    {
      'constant': false,
      'inputs': [
        {
          'name': '_articleHash',
          'type': 'bytes32'
        }
      ],
      'name': 'acceptArticleVersion',
      'outputs': [],
      'payable': false,
      'stateMutability': 'nonpayable',
      'type': 'function'
    },
    {
      'constant': false,
      'inputs': [
        {
          'name': '_articleHash',
          'type': 'bytes32'
        },
        {
          'name': '_reviewerAddress',
          'type': 'address'
        }
      ],
      'name': 'acceptReview',
      'outputs': [],
      'payable': false,
      'stateMutability': 'nonpayable',
      'type': 'function'
    },
    {
      'constant': false,
      'inputs': [
        {
          'name': '_articleHash',
          'type': 'bytes32'
        },
        {
          'name': '_reviewHash',
          'type': 'bytes32'
        },
        {
          'name': '_articleHasMajorIssues',
          'type': 'bool'
        },
        {
          'name': '_articleHasMinorIssues',
          'type': 'bool'
        },
        {
          'name': '_score1',
          'type': 'uint8'
        },
        {
          'name': '_score2',
          'type': 'uint8'
        }
      ],
      'name': 'addCommunityReview',
      'outputs': [],
      'payable': false,
      'stateMutability': 'nonpayable',
      'type': 'function'
    },
    {
      'constant': false,
      'inputs': [
        {
          'name': '_articleHash',
          'type': 'bytes32'
        },
        {
          'name': '_reviewHash',
          'type': 'bytes32'
        },
        {
          'name': '_articleHasMajorIssues',
          'type': 'bool'
        },
        {
          'name': '_articleHasMinorIssues',
          'type': 'bool'
        },
        {
          'name': '_score1',
          'type': 'uint8'
        },
        {
          'name': '_score2',
          'type': 'uint8'
        }
      ],
      'name': 'addEditorApprovedReview',
      'outputs': [],
      'payable': false,
      'stateMutability': 'nonpayable',
      'type': 'function'
    },
    {
      'constant': false,
      'inputs': [
        {
          'name': '_submissionId',
          'type': 'uint256'
        }
      ],
      'name': 'assignForSubmissionProcess',
      'outputs': [],
      'payable': false,
      'stateMutability': 'nonpayable',
      'type': 'function'
    },
    {
      'constant': false,
      'inputs': [
        {
          'name': '_submissionId',
          'type': 'uint256'
        },
        {
          'name': '_newEditor',
          'type': 'address'
        }
      ],
      'name': 'changeEditorFromSubmissionProcess',
      'outputs': [],
      'payable': false,
      'stateMutability': 'nonpayable',
      'type': 'function'
    },
    {
      'constant': false,
      'inputs': [
        {
          'name': '_articleHash',
          'type': 'bytes32'
        },
        {
          'name': '_reviewHash',
          'type': 'bytes32'
        },
        {
          'name': '_articleHasMajorIssues',
          'type': 'bool'
        },
        {
          'name': '_articleHasMinorIssues',
          'type': 'bool'
        },
        {
          'name': '_score1',
          'type': 'uint8'
        },
        {
          'name': '_score2',
          'type': 'uint8'
        }
      ],
      'name': 'correctReview',
      'outputs': [],
      'payable': false,
      'stateMutability': 'nonpayable',
      'type': 'function'
    },
    {
      'constant': false,
      'inputs': [
        {
          'name': '_articleHash',
          'type': 'bytes32'
        }
      ],
      'name': 'declineArticleVersion',
      'outputs': [],
      'payable': false,
      'stateMutability': 'nonpayable',
      'type': 'function'
    },
    {
      'constant': false,
      'inputs': [
        {
          'name': '_articleHash',
          'type': 'bytes32'
        }
      ],
      'name': 'declineArticleVersionAndClose',
      'outputs': [],
      'payable': false,
      'stateMutability': 'nonpayable',
      'type': 'function'
    },
    {
      'constant': false,
      'inputs': [
        {
          'name': '_submissionId',
          'type': 'uint256'
        }
      ],
      'name': 'declineNewReviewRound',
      'outputs': [],
      'payable': false,
      'stateMutability': 'nonpayable',
      'type': 'function'
    },
    {
      'constant': false,
      'inputs': [
        {
          'name': '_articleHash',
          'type': 'bytes32'
        },
        {
          'name': '_reviewerAddress',
          'type': 'address'
        }
      ],
      'name': 'declineReview',
      'outputs': [],
      'payable': false,
      'stateMutability': 'nonpayable',
      'type': 'function'
    },
    {
      'constant': false,
      'inputs': [
        {
          'name': '_submissionId',
          'type': 'uint256'
        },
        {
          'name': '_articleHash',
          'type': 'bytes32'
        },
        {
          'name': '_articleURL',
          'type': 'bytes32'
        },
        {
          'name': '_authors',
          'type': 'address[]'
        },
        {
          'name': '_authorContributionRatios',
          'type': 'uint16[]'
        },
        {
          'name': '_linkedArticles',
          'type': 'bytes32[]'
        },
        {
          'name': '_linkedArticlesSplitRatios',
          'type': 'uint16[]'
        }
      ],
      'name': 'openNewReviewRound',
      'outputs': [],
      'payable': false,
      'stateMutability': 'nonpayable',
      'type': 'function'
    },
    {
      'constant': false,
      'inputs': [
        {
          'name': '_articleHash',
          'type': 'bytes32'
        },
        {
          'name': '_reviewerAddress',
          'type': 'address'
        }
      ],
      'name': 'rejectReviewer',
      'outputs': [],
      'payable': false,
      'stateMutability': 'nonpayable',
      'type': 'function'
    },
    {
      'constant': false,
      'inputs': [
        {
          'name': '_submissionId',
          'type': 'uint256'
        }
      ],
      'name': 'removeEditorFromSubmissionProcess',
      'outputs': [],
      'payable': false,
      'stateMutability': 'nonpayable',
      'type': 'function'
    },
    {
      'constant': false,
      'inputs': [
        {
          'name': 'editor',
          'type': 'address'
        }
      ],
      'name': 'resignEditor',
      'outputs': [],
      'payable': false,
      'stateMutability': 'nonpayable',
      'type': 'function'
    },
    {
      'constant': false,
      'inputs': [
        {
          'name': 'expertReviewer',
          'type': 'address'
        }
      ],
      'name': 'resignExpertReviewer',
      'outputs': [],
      'payable': false,
      'stateMutability': 'nonpayable',
      'type': 'function'
    },
    {
      'constant': false,
      'inputs': [
        {
          'name': '_articleHash',
          'type': 'bytes32'
        },
        {
          'name': 'reviewerAddress',
          'type': 'address'
        }
      ],
      'name': 'resignFromReviewing',
      'outputs': [],
      'payable': false,
      'stateMutability': 'nonpayable',
      'type': 'function'
    },
    {
      'constant': false,
      'inputs': [
        {
          'name': '_articleHash',
          'type': 'bytes32'
        }
      ],
      'name': 'sanityIsNotOk',
      'outputs': [],
      'payable': false,
      'stateMutability': 'nonpayable',
      'type': 'function'
    },
    {
      'constant': false,
      'inputs': [
        {
          'name': '_articleHash',
          'type': 'bytes32'
        }
      ],
      'name': 'sanityIsOk',
      'outputs': [],
      'payable': false,
      'stateMutability': 'nonpayable',
      'type': 'function'
    },
    {
      'constant': false,
      'inputs': [
        {
          'name': '_eurekaTokenContractAddress',
          'type': 'address'
        }
      ],
      'name': 'setEurekaTokenContract',
      'outputs': [],
      'payable': false,
      'stateMutability': 'nonpayable',
      'type': 'function'
    },
    {
      'constant': false,
      'inputs': [
        {
          'name': 'editor',
          'type': 'address'
        }
      ],
      'name': 'signUpEditor',
      'outputs': [],
      'payable': false,
      'stateMutability': 'nonpayable',
      'type': 'function'
    },
    {
      'constant': false,
      'inputs': [
        {
          'name': 'expertReviewer',
          'type': 'address'
        }
      ],
      'name': 'signUpExpertReviewer',
      'outputs': [],
      'payable': false,
      'stateMutability': 'nonpayable',
      'type': 'function'
    },
    {
      'constant': false,
      'inputs': [
        {
          'name': 'expertReviewers',
          'type': 'address[]'
        }
      ],
      'name': 'signUpExpertReviewers',
      'outputs': [],
      'payable': false,
      'stateMutability': 'nonpayable',
      'type': 'function'
    },
    {
      'constant': false,
      'inputs': [
        {
          'name': '_articleHash',
          'type': 'bytes32'
        }
      ],
      'name': 'signUpForReviewing',
      'outputs': [],
      'payable': false,
      'stateMutability': 'nonpayable',
      'type': 'function'
    },
    {
      'constant': false,
      'inputs': [
        {
          'name': '_from',
          'type': 'address'
        },
        {
          'name': '_value',
          'type': 'uint256'
        },
        {
          'name': '_articleHash',
          'type': 'bytes32'
        },
        {
          'name': '_articleURL',
          'type': 'bytes32'
        },
        {
          'name': '_authors',
          'type': 'address[]'
        },
        {
          'name': '_authorContributionRatios',
          'type': 'uint16[]'
        },
        {
          'name': '_linkedArticles',
          'type': 'bytes32[]'
        },
        {
          'name': '_linkedArticlesSplitRatios',
          'type': 'uint16[]'
        }
      ],
      'name': 'startSubmissionProcess',
      'outputs': [],
      'payable': false,
      'stateMutability': 'nonpayable',
      'type': 'function'
    },
    {
      'constant': false,
      'inputs': [
        {
          'name': 'reviewHash',
          'type': 'bytes32'
        }
      ],
      'name': 'updateTimeBasedReviewState',
      'outputs': [],
      'payable': false,
      'stateMutability': 'nonpayable',
      'type': 'function'
    },
    {
      'inputs': [],
      'payable': false,
      'stateMutability': 'nonpayable',
      'type': 'constructor'
    },
    {
      'anonymous': false,
      'inputs': [
        {
          'indexed': false,
          'name': 'submissionOwner',
          'type': 'address'
        },
        {
          'indexed': false,
          'name': 'editorAddress',
          'type': 'address'
        },
        {
          'indexed': false,
          'name': 'stateTimestamp',
          'type': 'uint256'
        }
      ],
      'name': 'EditorSignUp',
      'type': 'event'
    },
    {
      'anonymous': false,
      'inputs': [
        {
          'indexed': false,
          'name': 'contractOwner',
          'type': 'address'
        },
        {
          'indexed': false,
          'name': 'editorAddress',
          'type': 'address'
        },
        {
          'indexed': false,
          'name': 'stateTimestamp',
          'type': 'uint256'
        }
      ],
      'name': 'EditorResigned',
      'type': 'event'
    },
    {
      'anonymous': false,
      'inputs': [
        {
          'indexed': false,
          'name': 'contractOwner',
          'type': 'address'
        },
        {
          'indexed': false,
          'name': 'reviewerAddress',
          'type': 'address'
        },
        {
          'indexed': false,
          'name': 'stateTimestamp',
          'type': 'uint256'
        }
      ],
      'name': 'ExpertReviewerSignUp',
      'type': 'event'
    },
    {
      'anonymous': false,
      'inputs': [
        {
          'indexed': false,
          'name': 'contractOwner',
          'type': 'address'
        },
        {
          'indexed': false,
          'name': 'editorAddress',
          'type': 'address'
        },
        {
          'indexed': false,
          'name': 'stateTimestamp',
          'type': 'uint256'
        }
      ],
      'name': 'ExpertReviewerResigned',
      'type': 'event'
    },
    {
      'anonymous': false,
      'inputs': [
        {
          'indexed': false,
          'name': 'submissionId',
          'type': 'uint256'
        },
        {
          'indexed': false,
          'name': 'submissionOwner',
          'type': 'address'
        },
        {
          'indexed': false,
          'name': 'articleHash',
          'type': 'bytes32'
        },
        {
          'indexed': false,
          'name': 'articleURL',
          'type': 'bytes32'
        },
        {
          'indexed': false,
          'name': 'stateTimestamp',
          'type': 'uint256'
        }
      ],
      'name': 'SubmissionProcessStart',
      'type': 'event'
    },
    {
      'anonymous': false,
      'inputs': [
        {
          'indexed': false,
          'name': 'assignerAddress',
          'type': 'address'
        },
        {
          'indexed': false,
          'name': 'submissionId',
          'type': 'uint256'
        },
        {
          'indexed': false,
          'name': 'stateTimestamp',
          'type': 'uint256'
        }
      ],
      'name': 'AssignmentForSubmissionProcess',
      'type': 'event'
    },
    {
      'anonymous': false,
      'inputs': [
        {
          'indexed': false,
          'name': 'submissionId',
          'type': 'uint256'
        },
        {
          'indexed': false,
          'name': 'stateTimestamp',
          'type': 'uint256'
        }
      ],
      'name': 'RemovedEditorFromSubmission',
      'type': 'event'
    },
    {
      'anonymous': false,
      'inputs': [
        {
          'indexed': false,
          'name': 'submissionId',
          'type': 'uint256'
        },
        {
          'indexed': false,
          'name': 'newEditor',
          'type': 'address'
        },
        {
          'indexed': false,
          'name': 'stateTimestamp',
          'type': 'uint256'
        }
      ],
      'name': 'ChangedEditorFromSubmission',
      'type': 'event'
    },
    {
      'anonymous': false,
      'inputs': [
        {
          'indexed': false,
          'name': 'submissionId',
          'type': 'uint256'
        },
        {
          'indexed': false,
          'name': 'articleHash',
          'type': 'bytes32'
        },
        {
          'indexed': false,
          'name': 'stateTimestamp',
          'type': 'uint256'
        }
      ],
      'name': 'SanityIsOk',
      'type': 'event'
    },
    {
      'anonymous': false,
      'inputs': [
        {
          'indexed': false,
          'name': 'submissionId',
          'type': 'uint256'
        },
        {
          'indexed': false,
          'name': 'articleHash',
          'type': 'bytes32'
        },
        {
          'indexed': false,
          'name': 'stateTimestamp',
          'type': 'uint256'
        }
      ],
      'name': 'SanityIsNotOk',
      'type': 'event'
    },
    {
      'anonymous': false,
      'inputs': [
        {
          'indexed': false,
          'name': 'articleHash',
          'type': 'bytes32'
        },
        {
          'indexed': false,
          'name': 'reviewerAddress',
          'type': 'address'
        },
        {
          'indexed': false,
          'name': 'stateTimestamp',
          'type': 'uint256'
        },
        {
          'indexed': false,
          'name': 'isEditorApprovedReview',
          'type': 'bool'
        }
      ],
      'name': 'SignedUpForReviewing',
      'type': 'event'
    },
    {
      'anonymous': false,
      'inputs': [
        {
          'indexed': false,
          'name': 'articleHash',
          'type': 'bytes32'
        },
        {
          'indexed': false,
          'name': 'reviewerAddress',
          'type': 'address'
        },
        {
          'indexed': false,
          'name': 'stateTimestamp',
          'type': 'uint256'
        }
      ],
      'name': 'ResignedFromReviewing',
      'type': 'event'
    },
    {
      'anonymous': false,
      'inputs': [
        {
          'indexed': false,
          'name': 'articleHash',
          'type': 'bytes32'
        },
        {
          'indexed': false,
          'name': 'reviewHash',
          'type': 'bytes32'
        },
        {
          'indexed': false,
          'name': 'reviewerAddress',
          'type': 'address'
        },
        {
          'indexed': false,
          'name': 'articleHasMajorIssues',
          'type': 'bool'
        },
        {
          'indexed': false,
          'name': 'articleHasMinorIssues',
          'type': 'bool'
        },
        {
          'indexed': false,
          'name': 'score1',
          'type': 'uint8'
        },
        {
          'indexed': false,
          'name': 'score2',
          'type': 'uint8'
        },
        {
          'indexed': false,
          'name': 'stateTimestamp',
          'type': 'uint256'
        }
      ],
      'name': 'EditorApprovedReviewIsAdded',
      'type': 'event'
    },
    {
      'anonymous': false,
      'inputs': [
        {
          'indexed': false,
          'name': 'articleHash',
          'type': 'bytes32'
        },
        {
          'indexed': false,
          'name': 'reviewHash',
          'type': 'bytes32'
        },
        {
          'indexed': false,
          'name': 'reviewerAddress',
          'type': 'address'
        },
        {
          'indexed': false,
          'name': 'articleHasMajorIssues',
          'type': 'bool'
        },
        {
          'indexed': false,
          'name': 'articleHasMinorIssues',
          'type': 'bool'
        },
        {
          'indexed': false,
          'name': 'score1',
          'type': 'uint8'
        },
        {
          'indexed': false,
          'name': 'score2',
          'type': 'uint8'
        },
        {
          'indexed': false,
          'name': 'stateTimestamp',
          'type': 'uint256'
        }
      ],
      'name': 'CommunityReviewIsAdded',
      'type': 'event'
    },
    {
      'anonymous': false,
      'inputs': [
        {
          'indexed': false,
          'name': 'oldReviewHash',
          'type': 'bytes32'
        },
        {
          'indexed': false,
          'name': 'articleHash',
          'type': 'bytes32'
        },
        {
          'indexed': false,
          'name': 'reviewerAddress',
          'type': 'address'
        },
        {
          'indexed': false,
          'name': 'reviewHash',
          'type': 'bytes32'
        },
        {
          'indexed': false,
          'name': 'articleHasMajorIssues',
          'type': 'bool'
        },
        {
          'indexed': false,
          'name': 'articleHasMinorIssues',
          'type': 'bool'
        },
        {
          'indexed': false,
          'name': 'score1',
          'type': 'uint8'
        },
        {
          'indexed': false,
          'name': 'score2',
          'type': 'uint8'
        },
        {
          'indexed': false,
          'name': 'stateTimestamp',
          'type': 'uint256'
        }
      ],
      'name': 'ReviewIsCorrected',
      'type': 'event'
    },
    {
      'anonymous': false,
      'inputs': [
        {
          'indexed': false,
          'name': 'articleHash',
          'type': 'bytes32'
        },
        {
          'indexed': false,
          'name': 'reviewer',
          'type': 'address'
        },
        {
          'indexed': false,
          'name': 'stateTimestamp',
          'type': 'uint256'
        }
      ],
      'name': 'ReviewIsAccepted',
      'type': 'event'
    },
    {
      'anonymous': false,
      'inputs': [
        {
          'indexed': false,
          'name': 'articleHash',
          'type': 'bytes32'
        },
        {
          'indexed': false,
          'name': 'reviewer',
          'type': 'address'
        },
        {
          'indexed': false,
          'name': 'stateTimestamp',
          'type': 'uint256'
        }
      ],
      'name': 'ReviewIsDeclined',
      'type': 'event'
    },
    {
      'anonymous': false,
      'inputs': [
        {
          'indexed': false,
          'name': 'articleHash',
          'type': 'bytes32'
        },
        {
          'indexed': false,
          'name': 'reviewer',
          'type': 'address'
        },
        {
          'indexed': false,
          'name': 'stateTimestamp',
          'type': 'uint256'
        }
      ],
      'name': 'ReviewerRejected',
      'type': 'event'
    },
    {
      'anonymous': false,
      'inputs': [
        {
          'indexed': false,
          'name': 'articleHash',
          'type': 'bytes32'
        },
        {
          'indexed': false,
          'name': 'editor',
          'type': 'address'
        },
        {
          'indexed': false,
          'name': 'stateTimestamp',
          'type': 'uint256'
        }
      ],
      'name': 'ArticleVersionIsAccepted',
      'type': 'event'
    },
    {
      'anonymous': false,
      'inputs': [
        {
          'indexed': false,
          'name': 'articleHash',
          'type': 'bytes32'
        },
        {
          'indexed': false,
          'name': 'editor',
          'type': 'address'
        },
        {
          'indexed': false,
          'name': 'stateTimestamp',
          'type': 'uint256'
        }
      ],
      'name': 'DeclineArticleVersion',
      'type': 'event'
    },
    {
      'anonymous': false,
      'inputs': [
        {
          'indexed': false,
          'name': 'articleHash',
          'type': 'bytes32'
        },
        {
          'indexed': false,
          'name': 'editor',
          'type': 'address'
        },
        {
          'indexed': false,
          'name': 'stateTimestamp',
          'type': 'uint256'
        }
      ],
      'name': 'DeclineArticleVersionAndClose',
      'type': 'event'
    },
    {
      'anonymous': false,
      'inputs': [
        {
          'indexed': false,
          'name': 'submissionId',
          'type': 'uint256'
        },
        {
          'indexed': false,
          'name': 'stateTimestamp',
          'type': 'uint256'
        }
      ],
      'name': 'NewReviewRoundRequested',
      'type': 'event'
    },
    {
      'anonymous': false,
      'inputs': [
        {
          'indexed': false,
          'name': 'submissionId',
          'type': 'uint256'
        },
        {
          'indexed': false,
          'name': 'articleHash',
          'type': 'bytes32'
        },
        {
          'indexed': false,
          'name': 'articleUrl',
          'type': 'bytes32'
        },
        {
          'indexed': false,
          'name': 'stateTimestamp',
          'type': 'uint256'
        }
      ],
      'name': 'NewReviewRoundOpened',
      'type': 'event'
    },
    {
      'anonymous': false,
      'inputs': [
        {
          'indexed': false,
          'name': 'submissionId',
          'type': 'uint256'
        },
        {
          'indexed': false,
          'name': 'stateTimestamp',
          'type': 'uint256'
        }
      ],
      'name': 'NewReviewRoundDeclined',
      'type': 'event'
    },
    {
      'anonymous': false,
      'inputs': [
        {
          'indexed': false,
          'name': 'submissionId',
          'type': 'uint256'
        },
        {
          'indexed': false,
          'name': 'stateTimestamp',
          'type': 'uint256'
        }
      ],
      'name': 'SubmissionProcessClosed',
      'type': 'event'
    },
    {
      'constant': true,
      'inputs': [
        {
          'name': '',
          'type': 'uint256'
        }
      ],
      'name': 'articleSubmissions',
      'outputs': [
        {
          'name': 'submissionId',
          'type': 'uint256'
        },
        {
          'name': 'submissionState',
          'type': 'uint8'
        },
        {
          'name': 'stateTimestamp',
          'type': 'uint256'
        },
        {
          'name': 'submissionOwner',
          'type': 'address'
        },
        {
          'name': 'editor',
          'type': 'address'
        }
      ],
      'payable': false,
      'stateMutability': 'view',
      'type': 'function'
    },
    {
      'constant': true,
      'inputs': [
        {
          'name': '',
          'type': 'bytes32'
        }
      ],
      'name': 'articleVersions',
      'outputs': [
        {
          'name': 'submissionId',
          'type': 'uint256'
        },
        {
          'name': 'articleHash',
          'type': 'bytes32'
        },
        {
          'name': 'publishedTimestamp',
          'type': 'uint256'
        },
        {
          'name': 'articleUrl',
          'type': 'bytes32'
        },
        {
          'name': 'versionState',
          'type': 'uint8'
        },
        {
          'name': 'stateTimestamp',
          'type': 'uint256'
        }
      ],
      'payable': false,
      'stateMutability': 'view',
      'type': 'function'
    },
    {
      'constant': true,
      'inputs': [],
      'name': 'contractOwner',
      'outputs': [
        {
          'name': '',
          'type': 'address'
        }
      ],
      'payable': false,
      'stateMutability': 'view',
      'type': 'function'
    },
    {
      'constant': true,
      'inputs': [
        {
          'name': 'hash',
          'type': 'bytes32'
        }
      ],
      'name': 'getAuthors',
      'outputs': [
        {
          'name': 'authors',
          'type': 'address[]'
        }
      ],
      'payable': false,
      'stateMutability': 'view',
      'type': 'function'
    },
    {
      'constant': true,
      'inputs': [],
      'name': 'getJournalParameters',
      'outputs': [
        {
          'name': '_contractOwner',
          'type': 'address'
        },
        {
          'name': '_minAmountOfEditorApprovedReviews',
          'type': 'uint256'
        },
        {
          'name': '_maxAmountOfRewardedEditorApprovedReviews',
          'type': 'uint256'
        },
        {
          'name': '_minAmountOfCommunityReviews',
          'type': 'uint256'
        },
        {
          'name': '_maxAmountOfRewardedCommunityReviews',
          'type': 'uint256'
        },
        {
          'name': '_sciencemattersFoundationReward',
          'type': 'uint256'
        },
        {
          'name': '_editorReward',
          'type': 'uint256'
        },
        {
          'name': '_linkedArticlesReward',
          'type': 'uint256'
        },
        {
          'name': '_invalidationWorkReward',
          'type': 'uint256'
        },
        {
          'name': '_editorApprovedReviewerRewardPerReviewer',
          'type': 'uint256'
        },
        {
          'name': '_communityReviewerRewardPerReviewer',
          'type': 'uint256'
        },
        {
          'name': '_secondReviewerRewardPerReviewer',
          'type': 'uint256'
        },
        {
          'name': '_submissionFee',
          'type': 'uint256'
        },
        {
          'name': '_maxReviewRounds',
          'type': 'uint256'
        }
      ],
      'payable': false,
      'stateMutability': 'view',
      'type': 'function'
    },
    {
      'constant': true,
      'inputs': [
        {
          'name': 'hash',
          'type': 'bytes32'
        }
      ],
      'name': 'getLinkedArticles',
      'outputs': [
        {
          'name': 'linkedArticles',
          'type': 'bytes32[]'
        }
      ],
      'payable': false,
      'stateMutability': 'view',
      'type': 'function'
    },
    {
      'constant': true,
      'inputs': [
        {
          'name': '',
          'type': 'address'
        }
      ],
      'name': 'isEditor',
      'outputs': [
        {
          'name': '',
          'type': 'bool'
        }
      ],
      'payable': false,
      'stateMutability': 'view',
      'type': 'function'
    },
    {
      'constant': true,
      'inputs': [
        {
          'name': '',
          'type': 'address'
        }
      ],
      'name': 'isExpertReviewer',
      'outputs': [
        {
          'name': '',
          'type': 'bool'
        }
      ],
      'payable': false,
      'stateMutability': 'view',
      'type': 'function'
    },
    {
      'constant': true,
      'inputs': [
        {
          'name': '',
          'type': 'bytes32'
        },
        {
          'name': '',
          'type': 'address'
        }
      ],
      'name': 'reviews',
      'outputs': [
        {
          'name': 'articleHash',
          'type': 'bytes32'
        },
        {
          'name': 'reviewer',
          'type': 'address'
        },
        {
          'name': 'isEditorApprovedReview',
          'type': 'bool'
        },
        {
          'name': 'reviewState',
          'type': 'uint8'
        },
        {
          'name': 'stateTimestamp',
          'type': 'uint256'
        },
        {
          'name': 'reviewHash',
          'type': 'bytes32'
        },
        {
          'name': 'reviewedTimestamp',
          'type': 'uint256'
        },
        {
          'name': 'articleHasMajorIssues',
          'type': 'bool'
        },
        {
          'name': 'articleHasMinorIssues',
          'type': 'bool'
        },
        {
          'name': 'score1',
          'type': 'uint8'
        },
        {
          'name': 'score2',
          'type': 'uint8'
        },
        {
          'name': 'reviewedBy',
          'type': 'address'
        }
      ],
      'payable': false,
      'stateMutability': 'view',
      'type': 'function'
    },
    {
      'constant': true,
      'inputs': [],
      'name': 'submissionFee',
      'outputs': [
        {
          'name': '',
          'type': 'uint256'
        }
      ],
      'payable': false,
      'stateMutability': 'view',
      'type': 'function'
    }
  ];
