import * as hubspot from "@hubspot/api-client";
/*
 * This function is not intended to be invoked directly. Instead it will be
 * triggered by an orchestrator function.
 *
 * Before running this sample, please:
 * - create a Durable orchestration function
 * - create a Durable HTTP starter function
 * - run 'npm install durable-functions' from the wwwroot folder of your
 *   function app in Kudu
 */

import { AzureFunction, Context } from "@azure/functions";
import { SimplePublicObjectWithAssociations } from "@hubspot/api-client/lib/codegen/crm/companies";

const activityFunction: AzureFunction = async function (
  context: Context
): Promise<SimplePublicObjectWithAssociations[]> {
  context.log("HTTP trigger function processed a request.");
  const hubspotClient = new hubspot.Client({
    accessToken: "pat-eu1-7b7968a5-d9f4-4960-8113-496d0a78624f",
  });

  try {
    const apiResponse = await hubspotClient.crm.companies.searchApi.doSearch(
      context.bindingData.data
    );

    return apiResponse.results;
  } catch (e) {
    e.message === "HTTP request failed"
      ? console.error(JSON.stringify(e.response, null, 2))
      : console.error(e);
  }
};

export default activityFunction;
