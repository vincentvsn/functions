import { AzureFunction, Context, HttpRequest } from "@azure/functions";
import axios from "axios";

const apiKey = 'pat-eu1-7b7968a5-d9f4-4960-8113-496d0a78624f';
const objectName = '2-116564448';
const objectEndpoint = `https://api.hubapi.com/crm/v3/objects/${objectName}`;
const hubspotEndpoint = `https://api.hubapi.com/crm/v3/objects/${objectName}/search`;


interface InfoConversion {
  id: string,
  currency: string,
  sell_currency: string,
  amount: string,
  sell_amount: string,
  rate: string,
  client_rate: string,
  currency_pair: string,
  provider: string,
  conversion_provider_id: string,
  conversion_short_reference: string,
  creation_date: string,
  status: string,
  company_id: string,
  type: string,
  gross_margin_initial: string,
  cost_payment_initial: string,
  cost_provider_initial: string,
  cost_roll: string,
  dividend_planet_inital: string,
  net_margin_initial: string,
  net_margin_expected: string
}

function sleep(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms));
}

const activityFunction: AzureFunction = async function (context: Context): Promise<void> {
  const InfoConversion: InfoConversion = context.bindingData.transformCcyConversionToHubspotConversionOperationCreation;
  await CreateOperation(InfoConversion);
  await sleep(15000);
  const conversionId: string = InfoConversion.id;
  console.log("INFOCONVERSION", InfoConversion)
  console.log("CONVERSIONID", conversionId);
  return await searchCustomObjectById(conversionId);
};

const searchCustomObjectById = async (id: string) => {
  console.log("OK2");
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
      'cost_total'
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
          cost_roll: customObject.properties.cost_roll_initial || null,
          company_id: customObject.properties.company_id || null,
          cost_total: customObject.properties.cost_total || null
        };
      });
      console.log("VERITY : ", customObjectsData)
      return customObjectsData[0];
    } else {
      console.log('Failed to fetch data from HubSpot API.');
    }
  } catch (error) {
    console.error('Error occurred:', error.message);
  }
};

async function CreateOperation(InfoConversion: InfoConversion): Promise<void> {
  const operationData = {
    properties: InfoConversion,
  };
  console.log("OK");
  const headers = {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${apiKey}`,
  };

  axios.post(objectEndpoint, operationData, { headers })
    .then(response => {
      console.log('Operation created successfully:', response.data);
    })
    .catch(error => {
      console.error('Error creating operation:', error);
    });
}

export default activityFunction;
