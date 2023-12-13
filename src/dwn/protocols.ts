import { ProtocolDefinition } from "@tbd54566975/dwn-sdk-js";

export const protocols: { [key: string]: ProtocolDefinition } = {
  jobApplicationSimpleProtocol: {
    protocol: "https://didcomm.org/rwo/jobApplicationSimpleProtocol",
    published: true,
    types: {
      japplication: {
        schema: "https://didcomm.org/rwo/japplication.json",
        dataFormats: ["application/json"],
      },
    },
    structure: {
      japplication: {
        $actions: [
          {
            who: "author",
            of: "japplication",
            can: "read",
          },
          {
            who: "author",
            of: "japplication",
            can: "write",
          },
          {
            who: "recipient",
            of: "japplication",
            can: "read",
          },
          {
            who: "anyone",
            can: "write",
          },
        ],
      },
    },
  },
  cvPersonalStorageProtocol: {
    protocol:
      "https://didcomm.org/uris/that/dont/resolve/are/funny/cvPersonalStorageProtocol",
    published: true,
    types: {
      cvPersonalStorage: {
        schema:
          "https://didcomm.org/uris/that/dont/resolve/are/funny/cvPersonalStorage.json",
        dataFormats: ["application/json"],
      },
    },
    structure: {
      cvPersonalStorage: {
        $actions: [
          {
            who: "author",
            of: "cvPersonalStorage",
            can: "read",
          },
          {
            who: "author",
            of: "cvPersonalStorage",
            can: "write",
          },
        ],
      },
    },
  },
  selfProfileProtocol: {
    protocol:
      "https://didcomm.org/uris/that/dont/resolve/are/funny/selfProfileProtocol",
    published: true,
    types: {
      selfprofile: {
        schema:
          "https://didcomm.org/uris/that/dont/resolve/are/funny/selfprofile.json",
        dataFormats: ["application/json"],
      },
    },
    structure: {
      selfprofile: {
        $actions: [
          {
            who: "author",
            of: "selfprofile",
            can: "write",
          },
          {
            who: "anyone",
            can: "read",
          },
        ],
      },
    },
  },
  jobPostThatCanTakeApplicationsAsReplyProtocol: {
    protocol: "https://didcomm.org/rwo/jobPostProtocol",
    published: true,
    types: {
      jobPost: {
        schema: "https://didcomm.org/rwo/jobPost.json",
        dataFormats: ["application/json"],
      },
      japplication: {
        schema: "https://didcomm.org/rwo/japplication.json",
        dataFormats: ["application/json"],
      },
    },
    structure: {
      jobPost: {
        $actions: [
          {
            who: "author",
            of: "jobPost",
            can: "write",
          },
          {
            who: "anyone",
            can: "read",
          },
        ],
        japplication: {
          $actions: [
            {
              who: "author",
              of: "japplication",
              can: "read",
            },
            {
              who: "author",
              of: "jobPost",
              can: "read",
            },
            {
              who: "recipient",
              of: "japplication",
              can: "read",
            },
            {
              who: "anyone",
              can: "write",
            },
          ],
        },
      },
    },
  },
};
