import { Record, Web5 } from "@web5/api";
import { DateSort, ProtocolDefinition } from "@tbd54566975/dwn-sdk-js";
import { protocols } from "./protocols.js";

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

  console.debug(
    "Protocol configured configureProtocol()",
    configureStatus,
    protocol,
  );
};

export type DwnListType = {
  record: Record;
  data: any;
  id: string;
};

export const transformRecordToListType = async (
  record: Record,
): Promise<DwnListType> => {
  return {
    record,
    data: await record.data.json(),
    id: record.id,
  };
};

export const transformMultipleRecordsToListType = async (
  records: Array<Record>,
) => {
  const dwnList: DwnListType[] = [];
  for (const record of records) {
    dwnList.push(await transformRecordToListType(record));
  }
  return dwnList;
};

interface DwnClientFunctions {
  dwnCreateAndSendJApplicationReplyingToJob: (
    recipientDWN: string,
    message: string,
    job_record_id: string,
  ) => Promise<void>;
  dwnCreateAndSendJApplication: (
    recipientDWN: string,
    message: string,
  ) => Promise<void>;
  dwnCreateJobPost: (data: any) => Promise<Record | undefined>;
  dwnCreateSelfProfileName: (name: string) => Promise<Record | undefined>;
}

export class DwnClient implements DwnClientFunctions {
  web5: Web5;
  // user: User;
  myDid: string;

  constructor(props: { web5: Web5; myDid: string }) {
    this.web5 = props.web5;
    // this.user = props.user;
    this.myDid = props.myDid;
  }

  async dwnQuerySelf(protocol: ProtocolDefinition) {
    console.debug("dwnQuerySelf ~ protocol:", protocol);
    try {
      const { records } = await this.web5.dwn.records.query({
        message: {
          filter: {
            protocol: protocol.protocol,
          },
        },
      });
      console.log(
        "🚀 ~ file: utils.ts:200 ~ dwnQuerySelf ~ records:",
        JSON.stringify(records),
      );

      return await transformMultipleRecordsToListType(records || []);
    } catch (e) {
      console.log("🚀 ~ file: utils.ts:205 ~ dwnQuerySelf ~ e:", e);

      return undefined;
    }
  }

  async dwnQueryOtherDWNByProtocol(
    fromDWN: string,
    protocol: ProtocolDefinition,
  ) {
    console.debug(
      "dwnQueryOtherDWN()  about to query fromDWN " +
        fromDWN +
        " for " +
        protocol.protocol,
    );
    // Reads the indicated record from Bob's DWNs
    try {
      const { records, status } = await this.web5.dwn.records.query({
        from: fromDWN,
        message: {
          filter: {
            protocol: protocol.protocol,
          },
        },
      });

      console.log("dwnQueryOtherDWN ~ records:", records);
      if (status.code !== 200) {
        console.error("dwnReadOtherDWN ~ status:", status);
        return undefined;
      }
      return await transformMultipleRecordsToListType(records || []);
    } catch (e) {
      console.error("dwnQueryOtherDWN ~ e:", e);
      console.groupEnd();
      return [];
    }
  }

  async dwnReadOtherDWN(
    fromDWN: string,
    protocol: ProtocolDefinition,
  ): Promise<any | undefined> {
    console.debug(
      "dwnReadOtherDWN()  fromDWN " + fromDWN + " for " + protocol.protocol,
    );
    // Reads the indicated record from Bob's DWNs
    try {
      console.log("protocol", protocol.protocol);
      const { record, status } = await this.web5.dwn.records.read({
        from: fromDWN,
        message: {
          filter: {
            protocol: protocol.protocol,
          },
        },
      });
      console.log(`dwnReadOtherDWN ~ record: ${record}`);
      if (status.code !== 200) {
        console.error("dwnReadOtherDWN ~ status:", status);
        console.groupEnd();
        return undefined;
      }
      // assuming the record is a json payload
      const data = await record.data.json();
      console.log(`dwnReadOtherDWN ~ data: ${data}`);
      return data;
    } catch (e) {
      console.error("dwnReadOtherDWN ~ e:", e);
      return undefined;
    }
  }

  async dwnQuerySelfallJSONData() {
    try {
      console.log("my did", this.myDid);
      const { records } = await this.web5.dwn.records.query({
        from: this.myDid,
        message: {
          filter: {
            dataFormat: "application/json",
          },
        },
      });

      console.log("dwnQuerySelfallJSONData ~ records:", records);

      return await transformMultipleRecordsToListType(records || []);
    } catch (e) {
      console.log("dwnQuerySelfallJSONData ~ e:", e);

      return undefined;
    }
  }

  async dwnQuerySelfForAnyRecordsWrittenByOthers() {
    try {
      const { records } = await this.web5.dwn.records.query({
        message: {
          filter: {
            dataFormat: "application/json",
          },
        },
      });

      if (records) {
        //console.log("dwnQuerySelfForAnyRecordsWrittenByOthers ~ records:", records)
        const outlist: Array<{
          record: Record;
          data: any;
          id: string;
        }> = [];
        for (const record of records) {
          const data = await record.data.json();
          const list = { record, data, id: record.id };
          if (data.author !== this.myDid) outlist.push(list);
        }
        console.log(
          "dwnQuerySelfForAnyRecordsWrittenByOthers,",
          outlist.length,
          "records from OTHERS outlist:",
          outlist,
        );
        return outlist;
      }
    } catch (e) {
      console.log("dwnQuerySelfForAnyRecordsWrittenByOthers ~ e:", e);

      return undefined;
    }
  }

  async dwnQuerySelfForAnyRecordsWrittenByOthersAndAreInReplyToOneOfMyRecords() {
    try {
      const { records } = await this.web5.dwn.records.query({
        message: {
          filter: {
            dataFormat: "application/json",
          },
        },
      });

      if (records) {
        //console.log("dwnQuerySelfForAnyRecordsWrittenByOthers ~ records:", records)
        const outlist: Array<{
          record: Record;
          data: any;
          id: string;
        }> = [];
        for (const record of records) {
          const data = await record.data.json();
          const list = { record, data, id: record.id };
          if (data.author !== this.myDid) {
            outlist.push(list);
            console.log(
              "dwnQuerySelfForAnyRecordsWrittenByOthersAndAreInReplyToOneOfMyRecords() data.parentId=" +
                data.parentId +
                "  of data=" +
                JSON.stringify(data) +
                " also record:",
              record,
            );
          }
        }
        console.log(
          "dwnQuerySelfForAnyRecordsWrittenByOthersAndAreInReplyToOneOfMyRecords ~ " +
            outlist.length +
            " records from OTHERS outlist:",
          outlist,
        );
        return outlist;
      }
    } catch (e) {
      console.log(
        "dwnQuerySelfForAnyRecordsWrittenByOthersAndAreInReplyToOneOfMyRecords ~ e:",
        e,
      );

      return undefined;
    }
  }

  async dwnReadSelfReturnRecordAndData() {
    console.log(
      "dwnReadSelf ~ protocol:",
      protocols["selfProfileProtocol"].protocol,
    );
    try {
      const { record, status } = await this.web5.dwn.records.read({
        message: {
          filter: {
            protocol: protocols["selfProfileProtocol"].protocol,
          },
        },
      });
      console.log("dwnReadSelf ~ record:", record);
      console.log("dwnReadSelfReturnRecordAndData ~ status:", status);
      if (!record) return undefined;
      return await transformRecordToListType(record);
    } catch (e) {
      console.log("dwnReadSelf ~ e:", e);

      return undefined;
    }
  }

  async dwnQuerySelfJApplicationsFromOthers() {
    const { records } = await this.web5.dwn.records.query({
      message: {
        filter: {
          schema:
            protocols["jobApplicationSimpleProtocol"].types.japplication.schema,
        },
        dateSort: DateSort.CreatedAscending,
      },
    });
    console.log("JApplication records", records);
    if (!records) return [];
    const japplicationList = [];
    const japplicationList_from_others = [];
    for (const record of records) {
      const data = await record.data.json();
      const list = { record, data, id: record.id };
      console.log(
        "dwnQueryJApplicationsWithoutJob ~ data:",
        JSON.stringify(data),
      );
      japplicationList.push(list);
      if (data.author !== this.myDid) japplicationList_from_others.push(list);
    }
    console.log(
      "🚀 ~ file:  ~ dwnQueryJApplicationsWithoutJob ~ japplicationList:",
      japplicationList,
    );
    console.log(
      "🚀 ~ file:  ~ dwnQueryJApplicationsWithoutJob ~ japplicationList_from_others:",
      japplicationList_from_others,
    );
    return japplicationList_from_others;
  }

  async dwnQueryJApplicationsForJob() {
    const { records } = await this.web5.dwn.records.query({
      message: {
        filter: {
          schema:
            protocols["jobPostThatCanTakeApplicationsAsReplyProtocol"].types
              .japplication.schema,
        },
        dateSort: DateSort.CreatedAscending,
      },
    });
    console.log(" dwnQueryJApplicationsForJob() JApplication records", records);

    if (!records) return [];
    const japplicationList = [];
    const japplicationList_from_others = [];
    for (const record of records) {
      const data = await record.data.json();
      const list = { record, data, id: record.id };
      japplicationList.push(list);
      if (data.author !== this.myDid) japplicationList_from_others.push(list);
    }
    console.log(
      "🚀 ~ file:  ~ dwnQueryJApplicationsForJob ~ japplicationList:",
      japplicationList,
    );
    console.log(
      "🚀 ~ file:  ~ dwnQueryJApplicationsForJob ~ japplicationList_from_others:",
      japplicationList_from_others,
    );
  }

  async dwnCreateAndSendJApplicationReplyingToJob(
    recipientDWN: string,
    message: string,
    job_record_id: string,
  ) {
    //bookmark
    const mmmmessg = "JApplication message: " + message;

    const appdata = {
      "@type": "japplication",
      title: "JApplication " + Math.random(),
      description: mmmmessg,
      author: this.myDid,
      email: "dummyEmail@email.com", //TODO swap to real email later?
      parent_job: job_record_id,
      recipient: recipientDWN,
    };

    try {
      const { record, status } = await this.web5.dwn.records.create({
        data: appdata,
        message: {
          protocol: protocols["jobApplicationSimpleProtocol"].protocol,
          protocolPath: "japplication",
          schema:
            protocols["jobApplicationSimpleProtocol"].types.japplication.schema,
          dataFormat:
            protocols["jobApplicationSimpleProtocol"].types.japplication
              .dataFormats?.[0],
          recipient: recipientDWN,
        },
      });
      console.log(
        "dwnCreateAndSendJApplicationReplyingToJob ~ record & status:",
        record,
        status,
      );

      if (record) {
        const { status: sendStatus } = await record.send(recipientDWN);

        if (sendStatus.code !== 202) {
          console.error(
            " dwnCreateAndSendJApplicationReplyingToJob() Unable to send to target ",
            JSON.stringify(sendStatus),
          );
          return;
        } else {
          console.log(
            " dwnCreateAndSendJApplicationReplyingToJob() japplication sent to recipient to " +
              recipientDWN +
              "  sendStatus=" +
              JSON.stringify(sendStatus),
          );
        }
      } else {
        console.log(
          "dwnCreateAndSendJApplicationReplyingToJob ~ record:",
          record,
        );
        console.error(
          " dwnCreateAndSendJApplicationReplyingToJob record should not be undefined",
        );
      }
    } catch (e) {
      console.error(e);
      return;
    }
  }

  async dwnCreateAndSendJApplication(recipientDWN: string, message: string) {
    const mmmmessg = "JApplication message: " + message;

    const appdata = {
      "@type": "japplication",
      title: "JApplication " + Math.random(),
      description: mmmmessg,
      author: this.myDid,
      email: "dummyEmail@email.com",
      recipient: recipientDWN,
    };

    try {
      const { record } = await this.web5.dwn.records.create({
        data: appdata,
        message: {
          protocol: protocols["jobApplicationSimpleProtocol"].protocol,
          protocolPath: "japplication",
          schema:
            protocols["jobApplicationSimpleProtocol"].types.japplication.schema,
          dataFormat:
            protocols["jobApplicationSimpleProtocol"].types.japplication
              .dataFormats?.[0],
          recipient: recipientDWN,
        },
      });
      console.log("dwnCreateAndSendJApplication ~ record:", record);

      if (record) {
        const { status: sendStatus } = await record.send(recipientDWN);

        if (sendStatus.code !== 202) {
          console.error(
            " dwnCreateAndSendJApplication() Unable to send to target ",
            JSON.stringify(sendStatus),
          );
          return;
        } else {
          console.log(
            " dwnCreateAndSendJApplication() japplication sent to recipient to " +
              recipientDWN +
              "  sendStatus=" +
              JSON.stringify(sendStatus),
          );
        }
      } else {
        console.log("dwnCreateAndSendJApplication ~ record:", record);
        console.error(
          " dwnCreateAndSendJApplication record should not be undefined",
        );
      }
    } catch (e) {
      console.error(e);
      return;
    }
  }

  async dwnCreateSelfProfileName(name: string) {
    console.log(
      "🚀 ~ file: index.html:588 ~ dwnCreateSelfProfileName ~ inputText:",
      name,
    );

    const profiledata = {
      "@type": "selfprofile",
      name: name,
      author: this.myDid,
    };

    try {
      const { record } = await this.web5.dwn.records.create({
        data: profiledata,
        message: {
          protocol: protocols["selfProfileProtocol"].protocol,
          protocolPath: "selfprofile",
          schema: protocols["selfProfileProtocol"].types.selfprofile.schema,
          dataFormat:
            protocols["selfProfileProtocol"].types.selfprofile.dataFormats?.[0],
          published: true,
        },
      });

      if (record)
        console.log(
          "dwnCreateSelfProfileName ~   protocol: " +
            protocols["selfProfileProtocol"].protocol +
            " record inputText=" +
            name +
            "create SUCCESS  ",
          record,
        );

      return record;
    } catch (e) {
      console.log(
        "🚀 ~ file: index.html:611 ~ dwnWriteTextRecord ~ ERROR :",
        e,
      );
    }
  }

  async dwnCreateJobPost(data: any) {
    console.log("dwnCreateJobPost ~ data:", JSON.stringify(data));

    const jobdata = {
      "@type": "jobPost",
      rando: Math.random(),
      author: this.myDid,
      ...data,
    };

    try {
      const { record, status } = await this.web5.dwn.records.create({
        data: jobdata,
        message: {
          protocol:
            protocols["jobPostThatCanTakeApplicationsAsReplyProtocol"].protocol,
          protocolPath: "jobPost",
          schema:
            protocols["jobPostThatCanTakeApplicationsAsReplyProtocol"].types
              .jobPost.schema,
          dataFormat:
            protocols["jobPostThatCanTakeApplicationsAsReplyProtocol"].types
              .jobPost.dataFormats?.[0],
          published: true,
        },
      });

      if (record)
        console.log(
          "🚀 ~ file:  ~  dwnCreateJobPost protocol: " +
            protocols["jobPostThatCanTakeApplicationsAsReplyProtocol"]
              .protocol +
            " create SUCCESS  ",
          record,
        );
      else {
        console.error("dwnCreateJobPost ~ status:", status);
      }

      return record;
    } catch (e) {
      console.log("dwnCreateJobPost ~ e:", e);
    }
  }
}
