import { AzureFunction, Context, HttpRequest } from "@azure/functions";
import axios from "axios";

const apiKey = 'pat-eu1-7b7968a5-d9f4-4960-8113-496d0a78624f';
const objectName = '2-116564448';
const hubspotEndpoint = `https://api.hubapi.com/crm/v3/objects/${objectName}/search`;


const activityFunction: AzureFunction = async function (context: Context): Promise<void> {
  const Id = context.bindingData.paymentCreatedBody.paymentId;
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
      'gross_margin_expected',
      'dividend_planet_amount',
      'cost_fx_provider_initial',
      'transfer_fees'
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
          gross_margin_expected: customObject.properties.gross_margin_expected || null,
          dividend_planet_amount: customObject.properties.dividend_planet_amount || null,
          cost_fx_provider_initial: customObject.properties.cost_fx_provider_initial || null,
          transfer_fees: customObject.properties.transfer_fees || null
        };
      });
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
