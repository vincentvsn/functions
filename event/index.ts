import * as df from "durable-functions";

interface OrchestratorInput {
  organizationId: string;
  eventName: string;
}

const orchestrator = df.orchestrator(function* (context) {
  const input = context.df.getInput() as OrchestratorInput;
  const { organizationId, eventName } = input;
  const outputs = [];

  const filter = {
    filterGroups: [
      {
        filters: [
          {
            operator: "EQ",
            propertyName: "keeweid",
            value: organizationId,
          },
        ],
      },
    ],
    properties: ["last_connection", "number_of_connections", "last_download", "number_of_download"],
    sorts: [],
  };

  const hubspotCompaniesWithoutKeeweId = yield context.df.callActivity(
    "SearchCompanies",
    filter
  );
  console.log("HUBSPOT RESULT : ", hubspotCompaniesWithoutKeeweId);
  const updatedCompanies = yield context.df.callActivity(
    "UpdateLastConnectionActivity",
    { organizationId, hubspotCompaniesWithoutKeeweId, eventName}
  );

  outputs.push(updatedCompanies);

  return outputs;
});

export default orchestrator;
