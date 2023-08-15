import { AzureFunction, Context, HttpRequest } from "@azure/functions";
import axios from 'axios';

const apiKey = 'pat-eu1-7b7968a5-d9f4-4960-8113-496d0a78624f';
const objectName = '2-116564448';
const hubspotEndpoint = `https://api.hubapi.com/crm/v3/objects/${objectName}/search`;

interface DataConversion {
  turnover_realized: string;
  cost_realized: string;
  cost_fx_provider_realized: string;
  gross_margin_realized: string;
  conversion_status: string;
  cost_roll: string;
  volume_conversion_processed_euro: string,
  turnover_expected: string,
  cost_fx_provider_expected: string,
  cost_total: string,
  gross_margin_expected: string
}

const activityFunction: AzureFunction = async function (context: Context) {
  console.log("CONTEXT FINAL", context)
  const DefineTypeConversion: string = context.bindingData.string;
  let DataConversion: DataConversion;
  let conversionId: string;
  if (DefineTypeConversion === "completed") {
    DataConversion = context.bindingData.getDataToPushHubspotFromConversionCompleted;
    conversionId = context.bindingData.searchOperationByConversionIdCompleted.id;
  } else if (DefineTypeConversion === "updated") {
    conversionId = context.bindingData.searchOperationByConversionId.id;
    DataConversion = context.bindingData.buildDataToPushConversionUpdate;
  } else {
    conversionId = context.bindingData.searchOperationByConversionIdCancelled.id;
    DataConversion = context.bindingData.buildDataToPushConversionCancelled;
  }
  return await UpdateDataFromConversionToHubspot(DataConversion, conversionId);
};

async function UpdateDataFromConversionToHubspot(DataConversion: DataConversion, Id: string) {
  const objectEndpoint = `https://api.hubapi.com/crm/v3/objects/${objectName}/${Id}`;

  const updateData = {
    properties: DataConversion,
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
