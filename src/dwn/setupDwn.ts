import { createClient } from "@supabase/supabase-js";
import { protocols } from "./protocols.js";
import { Web5, Web5ConnectOptions } from "@web5/api";
import { ProtocolDefinition } from "@tbd54566975/dwn-sdk-js";
import { DwnClient } from "./web5Client.js";
import { Database } from "../__generated__/supabase-types.js";

export const did_db_table = "dwn_did_registry_2";
export const DEBUGGING = false;
export const LOCAL_DWN = true;
export const supabaseClient = createClient<Database>(
  "https://api.gotid.org",
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InVicG5ibnpwZm10YmJyZ2lnempxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MDAwNjQzODIsImV4cCI6MjAxNTY0MDM4Mn0.fS_FBY4mDgYVn1GDocKMuze5y_s_ZlX5acQ-QAVcvG0",
);

export const configureProtocol = async (
  web5: Web5,
  protocolDefinition: ProtocolDefinition,
) => {
  // query the list of existing protocols on the DWN
  const { protocols, status } = await web5.dwn.protocols.query({
    message: {
      filter: {
        protocol: protocolDefinition.protocol,
      },
    },
  });

  if (status.code !== 200) {
    console.error("Error querying protocols configureProtocol()", status);
    return;
  }

  // if the protocol already exists, we return
  if (protocols.length > 0) {
    console.log(
      "Protocol already exists and configured  configureProtocol() , " +
        protocolDefinition.protocol,
    );
    return;
  }

  // configure protocol on local DWN
  const { status: configureStatus, protocol } =
    await web5.dwn.protocols.configure({
      message: {
        definition: protocolDefinition,
      },
    });

  // console.debug(
  //   "Protocol configured configureProtocol()",
  //   configureStatus,
  //   protocol,
  // );
};

export const getWeb5Connection = async () => {
  const options: Web5ConnectOptions = {
    // sync: "10s",
  };
  if (LOCAL_DWN) {
    options.techPreview = {
      // See README.md for setup instructions
      dwnEndpoints: [
        "http://localhost:3000/",
        // "http://localhost:3001/",
        // "http://localhost:3002/",
        // "http://localhost:3003/",
      ],
    };
  }
  console.log("Starting web5 connection with options: ", options);
  const web5Connection = await Web5.connect(options);
  for (const protocol of Object.values(protocols)) {
    await configureProtocol(web5Connection.web5, protocol);
  }
  return web5Connection;
};

export const getWeb5Client = async () => {
  const { web5, did: myDid } = await getWeb5Connection();

  return new DwnClient({ web5, myDid });
};
const dwnClient = await getWeb5Client();

const didCreate = async () => {
  let label = "";

  const { myDid, web5 } = dwnClient;
  if (myDid && web5) {
    console.log(
      "🚀 ~ file: common.ts:34 ~ initMyTestingData ~ user:",
      "dummyEmail@email.com",
    );
    label = "dummyEmail@email.com";
    const curnamerecord = await dwnClient.dwnQuerySelf(
      protocols["selfProfileProtocol"],
    );
    console.log(
      "🚀 ~ file: common.ts:31 ~ initMyTestingData ~ curnamerecord:",
      curnamerecord,
    );
    if (!curnamerecord || curnamerecord.length == 0)
      await dwnClient.dwnCreateSelfProfileName(
        "dummyEmail@email.com".split("@")[0],
      );
  }

  const send_date: any = {
    did: myDid,
    protocol_list: { lol: ["lol"] },
    label: label,
    // user_agent: user_agent,
    updated_client_side_time: new Date().toISOString(),
  };
  // if (ip_info_j && ip_info_j.city) {
  //   send_date["ip_info_jsonb"] = ip_info;
  // }

  const { data: data_after_insert, error } = await supabaseClient
    .from(did_db_table)
    .upsert(send_date)
    .select();

  console.log("data_after_insert: " + JSON.stringify(data_after_insert));
  console.log("did_db_table error: " + JSON.stringify(error));

  return myDid;
};

const initMyTestingData = async () => {
  const { myDid, web5 } = dwnClient;
  console.log(
    "trigger rebuild git  go go turbo vercel netlfiy gods give us reuslts",
  );
  console.log("HELLO WORLD, initMyTestingData()");

  if (myDid && web5) {
    console.log(
      "🚀 ~ file: common.ts:34 ~ initMyTestingData ~ user:",
      "dummyEmail@email.com",
    );
    const curnamerecord = await dwnClient.dwnQuerySelf(
      protocols["selfProfileProtocol"],
    );
    console.log(
      "🚀 ~ file: common.ts:31 ~ initMyTestingData ~ curnamerecord:",
      curnamerecord,
    );
    if (!curnamerecord || curnamerecord.length == 0)
      await dwnClient.dwnCreateSelfProfileName(
        "dummyEmail@email.com".split("@")[0],
      );

    const jobdata = {
      title: "Senior Software Engineer",
      description: "We are looking for a Sr software engineer",
      presentation_definition: `{"id":"bd980aee-10ba-462c-8088-4afdda24ed97","input_descriptors":[{"id":"user has a HasAccount VC issued by us","name":"user has a HasAccount VC issued by us","purpose":"Please provide your HasAccount VC that we issued to you on account creation","constraints":{"fields":[{"path":["$.vc.type"],"filter":{"type":"array","contains":{"type":"string","const":"HasVerifiedEmail"}},"purpose":"Holder must possess HasVerifiedEmail VC"}]}}]}`,
    };

    const gotJobsSelf = await dwnClient.dwnQuerySelf(
      protocols["jobPostThatCanTakeApplicationsAsReplyProtocol"],
    );
    if (gotJobsSelf) {
      if (gotJobsSelf?.length < 2) {
        jobdata.title = jobdata.title + " " + gotJobsSelf?.length;
        await dwnClient.dwnCreateJobPost(jobdata);
      }
    } else {
      await dwnClient.dwnCreateJobPost(jobdata);
    }
  }
};

const spamEveryDWNwithAJobApplication = async () => {
  const { myDid } = dwnClient;
  //TODO adoll start reading here

  const { data: public_dwn_did_list } = await supabaseClient
    .from(did_db_table)
    .select("*");

  if (public_dwn_did_list) {
    for (let i = 0; i < public_dwn_did_list.length; i++) {
      //TODO remove  trying to apply for a job at every DID DWN  we know of  no matter if they have a job or the protocol installed
      const element = public_dwn_did_list[i];

      if (element.did && element.did !== myDid) {
        //Check if i can already find my record in their system

        const applicaitons_i_find_on_other_DWN =
          await dwnClient.dwnQueryOtherDWNByProtocol(
            element.did,
            protocols["jobApplicationSimpleProtocol"],
          ); //TODO Ruben change this your filtering the wrong thing

        let already_posted = false;
        if (
          applicaitons_i_find_on_other_DWN &&
          applicaitons_i_find_on_other_DWN.length > 2
        ) {
          already_posted = true;
        }

        // if (true || !already_posted) {
        const jobpostlist = await dwnClient.dwnQueryOtherDWNByProtocol(
          element.did,
          protocols["jobPostThatCanTakeApplicationsAsReplyProtocol"],
        );
        console.log(
          "🚀 ~ file: common.ts:194 ~ spamEveryDWNwithAJobApplication ~ jobpostlist:",
          jobpostlist,
        );
        if (jobpostlist && jobpostlist.length && jobpostlist.length > 0) {
          const firstjobpost = jobpostlist[0];
          console.log(
            "🚀 ~ file: common.ts:198 ~ spamEveryDWNwithAJobApplication ~ firstjobpost:",
            firstjobpost,
          );
          console.log(
            "🚀🚀🚀  Found a company that has a job post so i should try to apply to the job now  ",
          ); //TODO RWO bookmark
          //TODO RWO bookmark
          await dwnClient.dwnCreateAndSendJApplicationReplyingToJob(
            element.did,
            "Saw this job and wanted to put in my application " + Math.random(),
            firstjobpost.id,
          ); //TODO Ruben this is not 100% confirmed to be correclty working yet
        } else {
          await dwnClient.dwnCreateAndSendJApplication(
            element.did,
            " Did'nt see a job post so i figured i'd try apply to the company directly " +
              Math.random(),
          ); // This is working for sure
        }
      } else {
        console.log(
          "🌳🌳 Not spamming more applicaitons to this DWN because I see I already put one ",
        );
      }
    }
  }
};

export let dids_with_names: Array<{ did: string; name: string }> = [];

export const getAllDWNnames = async () => {
  // TODO change this
  const { data: public_dwn_did_list } = await supabaseClient
    .from(did_db_table)
    .select("*");

  if (public_dwn_did_list) {
    let count_dwn_with_a_name = 0;
    dids_with_names = [];
    for (let i = 0; i < public_dwn_did_list.length; i++) {
      //TODO change this to
      const element = public_dwn_did_list[i];
      if (element.did) {
        const data = await dwnClient.dwnReadOtherDWN(
          element.did,
          protocols["selfProfileProtocol"],
        );

        //if(data && data.length > 0 && data[0].name  ){
        if (data && data.name) {
          console.log("🚀 ~ file: common.ts:190 ~ data:", data);
          count_dwn_with_a_name++;
          dids_with_names.push({ did: element.did, name: data.name });
        }
      }
    }
    console.log(
      " %%%$$$###  out of " +
        public_dwn_did_list.length +
        " DWN's we found " +
        count_dwn_with_a_name +
        " that have a name ",
    );

    console.log("🚀 ~   dids_with_names:", dids_with_names);
  }
};

// export let user_agent = "";
// if (window.navigator.userAgent) user_agent = window.navigator.userAgent;

const namdata = await dwnClient.dwnReadSelfReturnRecordAndData();
console.log(" namdata:", namdata);
await initMyTestingData();
console.log("finished initMyTestingData");
await dwnClient.dwnQueryJApplicationsForJob();
const ll = await dwnClient.dwnQuerySelfJApplicationsFromOthers();
console.log("ll:", ll);

const something = await dwnClient.dwnQuerySelfForAnyRecordsWrittenByOthers();
console.log("something:", something);
// console.log("finished dwnQuerySelfForAnyRecordsWrittenByOthers");
// await dwnClient.dwnQuerySelfForAnyRecordsWrittenByOthersAndAreInReplyToOneOfMyRecords();
// console.log(
//   "finished dwnQuerySelfForAnyRecordsWrittenByOthersAndAreInReplyToOneOfMyRecords",
// );
// await spamEveryDWNwithAJobApplication();
//await getAllDWNnames();
