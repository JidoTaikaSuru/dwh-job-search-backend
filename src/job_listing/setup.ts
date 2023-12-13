import {JobListingPutBody} from "./index.js";
import {supabaseClient} from "../index.js";
import {IPresentationDefinition} from "@sphereon/pex";
import {loadPlaceholdersIntoPresentationDefinition, PresentationDefinitionPlaceholder,} from "../presentation/lib.js";

/* This script seeds the job_listings table in Supabase
 *  It was written so we can quickly iterate on presentation definitions and troubleshoot edge cases
 * */

const issuerIdPlaceholder: PresentationDefinitionPlaceholder = {
  // issuer_id key, default did:ethr:goerli:0x03ee6b214c87fe28cb5cbc486cfb60295bb05ebd2803e98fa5a6e658e89991aa8b, validate should be a regex that matches the  pattern
  key: "{{issuer_id}}",
  value:
    "did:ethr:goerli:0x03ee6b214c87fe28cb5cbc486cfb60295bb05ebd2803e98fa5a6e658e89991aa8b",
  validate: (value: string) => {
    //TODO validate did
    // Check value regex match did:ethr:goerli:0x<hexString>
    // return value.match(/^did:ethr:goerli:0x[0-9a-fA-F]{20,40}$/) !== null; // TODO fixme
    return true;
  },
};

const requireIssuer = {
  path: ["$.issuer.id"],
  purpose: "We only accept credentials issued by our issuer",
  filter: {
    type: "string",
    const: "{{issuer_id}}",
  },
};

const requireType = (typeString: string) => ({
  path: ["$.vc.type"],
  purpose: `Holder must possess ${typeString} VC`,
  filter: {
    type: "array",
    contains: {
      type: "string",
      const: typeString,
    },
  },
});

const requireJti = {
  path: ["$.jti"],
  purpose: "We only accept credentials with a specific jti",
  filter: {
    type: "string",
    const: "did:web:gotid.org:credential:has-account:{{user_did_value}}",
    // pattern: "^did:web:gotid.org:credential:has-account:.*",
  },
};

const requireCredentialSubjectId = {
  path: ["$.vc.credentialSubject.id"],
  purpose: "Holder must be {{user_did}}",
  filter: {
    type: "string",
    const: "{{user_did}}",
  },
};

export const hasAccountPresentationDefinition: IPresentationDefinition = {
  id: "2aec8c4c-e071-4bda-8a76-41ab27632afa",
  input_descriptors: [
    {
      id: "user has a HasAccount VC issued by us",
      name: "HasAccount",
      purpose:
        "Please provide your HasAccount VC that we issued to you on account creation",
      constraints: {
        fields: [
          requireIssuer,
          requireType("HasAccountWithTrustAuthority"),
          requireJti,
          requireCredentialSubjectId,
        ],
      },
    },
  ],
};

export const hasVerifiedEmailPresentationDefinition: IPresentationDefinition = {
  id: "bd980aee-10ba-462c-8088-4afdda24ed97",
  input_descriptors: [
    {
      id: "user has a VerifiedEmail VC issued by us",
      name: "VerifiedEmail",
      purpose:
        "Please provide your VerifiedEmail VC that we issued to you on account creation. If you don't have one, try signing up for an account with us using OTP",
      constraints: {
        fields: [
          requireIssuer,
          requireType("HasVerifiedEmail"),
          requireJti,
          requireCredentialSubjectId,
        ],
      },
    },
  ],
};

export const hasPassedCaptchaPresentationDefinition: IPresentationDefinition = {
  id: "6edbf323-b47c-43e6-be94-2210ad55fbd0",
  input_descriptors: [
    {
      id: "user has a a PassedCaptcha VC issued by us",
      name: "PassedCaptcha",
      purpose:
        "Please provide your PassedCapctha VC that we issued to you on account creation. If you don't have one, too bad, this is a demo VC that is meant to intentionally fail",
      constraints: {
        fields: [
          requireIssuer,
          requireType("PassedCaptcha"),
          requireJti,
          requireCredentialSubjectId,
        ],
      },
    },
  ],
};

//JDs here come from indeed.com
const preCreateJobListings: JobListingPutBody[] = [
  {
    id: "8ae3ea55-53f2-4000-ae39-8328816eb748",
    title: "Software Engineer",
    description:
      "A Software Engineer, or Software Development Engineer, is responsible for developing software programs or systems that align with user needs. Their duties include meeting with clients or business professionals to strategize ideas for beneficial software, coordinating with other IT professionals to design software and running tests to catch coding errors.",
    company: "Decentralinked",
    presentation_definition: loadPlaceholdersIntoPresentationDefinition(
      hasAccountPresentationDefinition,
      [issuerIdPlaceholder],
    ),
  },
  // {
  //   id: "aaf168a8-1e16-41b3-8fa7-b7ee53e8aaea",
  //   title: "Software Engineer",
  //   description:
  //     "A Software Engineer, or Software Development Engineer, is responsible for developing software programs or systems that align with user needs. Their duties include meeting with clients or business professionals to strategize ideas for beneficial software, coordinating with other IT professionals to design software and running tests to catch coding errors.",
  //   company: "Deknilartneced",
  //   presentation_definition: loadPlaceholdersIntoPresentationDefinition(
  //     hasAccountPresentationDefinition,
  //     [issuerIdPlaceholder],
  //   ),
  // },
  // {
  //   id: "f453da48-1402-4a1c-8679-3f01ecc5849e",
  //   title: "Senior Software Engineer",
  //   description:
  //     "A Senior Software Engineer is a professional responsible for directing software development projects, producing clean code, and leading a team of engineers. They possess extensive experience in software development, project management, and have in-depth knowledge of programming languages and databases.",
  //   company: "Deknilartneced",
  //   presentation_definition: loadPlaceholdersIntoPresentationDefinition(
  //     hasVerifiedEmailPresentationDefinition,
  //     [issuerIdPlaceholder],
  //   ),
  // },
  {
    id: "47d78076-4c3c-45e8-a54f-c76c3cf1472e",
    title: "Senior Software Engineer",
    description:
      "A Senior Software Engineer is a professional responsible for directing software development projects, producing clean code, and leading a team of engineers. They possess extensive experience in software development, project management, and have in-depth knowledge of programming languages and databases.",
    company: "Decentralinked",
    presentation_definition: loadPlaceholdersIntoPresentationDefinition(
      hasVerifiedEmailPresentationDefinition,
      [issuerIdPlaceholder],
    ),
  },
  {
    id: "997d8528-d7c6-4ae3-b906-e59e9529c896",
    title: "Staff Software Engineer",
    description:
      'Staff software engineers combine their technical proficiencies and leadership skills to find effective software solutions. People in this role typically have extensive experience, advanced computer skills, and knowledge of software development principles. Learning more about what a staff software engineer does and how you can prepare for this career path can help you determine whether the role interests you. In this article, we answer the question, "What is a staff software engineer?", list some of their duties and responsibilities, explain how to start your career in this field and explore some skills you can develop for success.',
    company: "Decentralinked",
    presentation_definition: loadPlaceholdersIntoPresentationDefinition(
      hasPassedCaptchaPresentationDefinition,
      [issuerIdPlaceholder],
    ),
  },
];

// Seeding and upserting job listings wil let us iterate on presentation definitions faster
// This is necessary because PEX doesn't do everything we want it to do yet
export const precreateJobListings = async () => {
  for (const jobListing of preCreateJobListings) {
    console.log("Upserting jobListing", JSON.stringify(jobListing, null, 2));
    const { data, error } = await supabaseClient
      .from("job_listings")
      .upsert(jobListing);
    if (error) {
      console.error(error);
    }
    console.log("data", data);
  }
};

precreateJobListings();
