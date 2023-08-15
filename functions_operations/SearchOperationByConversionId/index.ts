import { AzureFunction, Context, HttpRequest } from "@azure/functions";
import axios from "axios";

const apiKey = 'pat-eu1-7b7968a5-d9f4-4960-8113-496d0a78624f';
const objectName = '2-116564448';
const hubspotEndpoint = `https://api.hubapi.com/crm/v3/objects/${objectName}/search`;

const activityFunction: AzureFunction = async function (context: Context): Promise<void> {
  const Id = context.bindingData.conversionCreatedBody.conversionId;
  return await OperationCompletedPush(Id);
};

const searchCustomObjectById = async (id: string) => {
  const requestBody = {
    filterGroups: [
      {
        filters: [
          {
            operator: 'EQ',
            propertyName: 'id',
            value: id,
          },
        ],
      },
    ],
    properties: [
      'id',
      'turnover_expected',
      'cost_expected',
      'cost_fx_provider_expected',
      'gross_margin_expected',
      'cost_roll',
      'company_id',
      'cost_total',
      'fixed_side',
      'sell_currency',
      'buy_currency'
    ],
  };

  try {
    const response = await axios.post(hubspotEndpoint, requestBody, {
      headers: {
        Authorization: `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
    });

    if (response.status === 200) {
      const customObjectsData = response.data.results.map((customObject) => {
        return {
          id: customObject.id || null,
          turnover_expected: customObject.properties.turnover_expected || null,
          cost_expected: customObject.properties.cost_expected || null,
          cost_fx_provider_expected: customObject.properties.cost_fx_provider_expected || null,
          gross_margin_expected: customObject.properties.gross_margin_expected || null,
          cost_roll: customObject.properties.cost_roll || null,
          company_id: customObject.properties.company_id || null,
          cost_total: customObject.properties.cost_total || null,
          fixed_side: customObject.properties.fixed_side || null,
          sell_currency: customObject.properties.sell_currency || null,
          buy_currency: customObject.properties.buy_currency || null
        };
      });
      console.log("")
      console.log("VERITY : ", customObjectsData[0])
      return customObjectsData[0];
    } else {
      console.log('Failed to fetch data from HubSpot API.');
    }
  } catch (error) {
    console.error('Error occurred:', error.message);
  }
};

async function OperationCompletedPush(Id: string): Promise<void> {
  return await searchCustomObjectById(Id);
}

export default activityFunction;
