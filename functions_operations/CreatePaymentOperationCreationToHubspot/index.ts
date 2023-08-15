import { AzureFunction, Context, HttpRequest } from "@azure/functions";
import axios from "axios";

const apiKey = 'pat-eu1-7b7968a5-d9f4-4960-8113-496d0a78624f';
const objectName = '2-116564448';
const objectEndpoint = `https://api.hubapi.com/crm/v3/objects/${objectName}`;
const hubspotEndpoint = `https://api.hubapi.com/crm/v3/objects/${objectName}/search`;

function sleep(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms));
}

const activityFunction: AzureFunction = async function (context: Context): Promise<void> {
  const InfoPayment = context.bindingData.convertPaymentInfosToEuros;
  const conversionId: string = context.bindingData.convertPaymentInfosToEuros.id;
  await CreateOperation(InfoPayment);
  await sleep(15000);
  return await searchCustomObjectById(conversionId);
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
      'company_id'
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
          company_id: customObject.company_id || null
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

async function CreateOperation(InfoPayment): Promise<void> {
  const operationData = {
    properties: InfoPayment,
  };
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
