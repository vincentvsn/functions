/*
 * This function is not intended to be invoked directly. Instead it will be
 * triggered by an HTTP starter function.
 *
 * Before running this sample, please:
 * - create a Durable activity function (default name is "Hello")
 * - create a Durable HTTP starter function
 * - run 'npm install durable-functions' from the wwwroot folder of your
 *    function app in Kudu
 */

import * as df from "durable-functions";

const orchestrator = df.orchestrator(function* (context) {
  const outputs = [];

  // Step1: list hubspot companies with keeweId undefined and onboardingStep defined and get their
  const hubspotCompaniesWithoutKeeweId = yield context.df.callActivity(
    "SearchCompanies",
    {
      filterGroups: [
        {
          filters: [
            {
              operator: "NOT_HAS_PROPERTY",
              propertyName: "keeweid",
            },
            {
              operator: "HAS_PROPERTY",
              propertyName: "onboarding",
            },
          ],
        },
      ],
      properties: ["id", "siren"],
      sorts: [],
    }
  );

  // Step2: get companies from keewe that match with siren
  // Step3: map hubspot company id with keewe id
  // Step4: push keeweId to hubspot

  outputs.push(hubspotCompaniesWithoutKeeweId);

  return outputs;
});

export default orchestrator;
