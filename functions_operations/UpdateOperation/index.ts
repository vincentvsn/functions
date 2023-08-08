import { AzureFunction, Context, HttpRequest } from "@azure/functions";
import axios from "axios";

const apiKey = 'pat-eu1-7b7968a5-d9f4-4960-8113-496d0a78624f';
const objectName = '2-116564448';

const activityFunction: AzureFunction = async function (context: Context): Promise<void> {
    const data: [] = context.bindings.name.data;
  await CreateOperation(data);
};

// UPDATE AN OPERATION

async function CreateOperation(data: []): Promise<void> {
  console.log(data);
  try {
    const apiUrl = 'https://api.hubapi.com';

    const endpoint = `/crm/v3/objects/${objectName}`;

    const config = {
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
    };

    const response = await axios.post(`${apiUrl}${endpoint}`, data, config);

    console.log('Custom object record created successfully:', response.data);
  } catch (error) {
    console.error('Error creating custom object record:', error.response?.data || error.message);
  }
}

export default activityFunction;
