import { AzureFunction, Context, HttpRequest } from "@azure/functions";
import axios from 'axios';

const apiKey = 'pat-eu1-7b7968a5-d9f4-4960-8113-496d0a78624f';
const objectName = '2-116564448';
const hubspotEndpoint = `https://api.hubapi.com/crm/v3/objects/${objectName}/search`;

interface DataPayment {
  status: string;
  gross_margin_realized: string;
}

const activityFunction: AzureFunction = async function (context: Context) {
  console.log("THE CONTEXT ", context);
  let paymentId: string;
  let DataPayment: DataPayment;
  if (context.bindingData.string === "created") {
    //paymentId = context.bindingData. ;
    //DataPayment = context.bindingData. ;
  } else if (context.bindingData.string === "completed") {
    paymentId = context.bindingData.getInfoHubspotFromOperationByPaymentidCompleted.id;
    DataPayment = context.bindingData.buildDataToPushPaymentCompleted;
  } else if (context.bindingData.string === "updated") {
    paymentId = context.bindingData.getInfoHubspotFromOpertaionByPaymentidUpdated.id;
    DataPayment = context.bindingData.buildDataToPushPaymentUpdated;
  } else {
    paymentId = context.bindingData.getInfoHubspotFromOperationByPaymentidCancelled.id
    DataPayment = context.bindingData.buildDataToPushPaymentCancelled;
  }
  await UpdateDataFromPaymentToHubspot(DataPayment, paymentId);
};

async function UpdateDataFromPaymentToHubspot(DataPayment: DataPayment, Id: string) {
  const objectEndpoint = `https://api.hubapi.com/crm/v3/objects/${objectName}/${Id}`;

  const updateData = {
    properties: DataPayment,
  };

  const headers = {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${apiKey}`,
  };

  axios.patch(objectEndpoint, updateData, { headers })
    .then(response => {
      console.log('Card updated successfully:', response.data);
    })
    .catch(error => {
      console.error('Error updating card:', error);
    });
}

export default activityFunction;
