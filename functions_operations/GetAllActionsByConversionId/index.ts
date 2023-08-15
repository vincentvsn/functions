import { AzureFunction, Context, HttpRequest } from "@azure/functions";
import axios from 'axios';

const activityFunction: AzureFunction = async function (context: Context) {
  const token: string = context.bindingData.getTokenLoginAPICCloud;
  const conversionId: string = context.bindingData.conversionCreatedBody.conversionId;

  return await GetAllActionsByConversionId(token, conversionId);
};

async function GetAllActionsByConversionId(token: string, conversionId: string) {
  const apiUrl = 'https://devapi.currencycloud.com/v2/conversions/profit_and_loss';

  const headers = {
    'X-Auth-Token': token,
  };

  const params = {
    conversion_id: conversionId,
  };

  try {
    const response = await axios.get(apiUrl, { headers, params });

    if (response.status === 200) {
      const profitAndLossData = response.data.conversion_profit_and_losses;
      return profitAndLossData;
    } else {
      console.log('Error:', response.data);
    }
  } catch (error) {
    console.error('An error occurred:', error.message);
  }
}

export default activityFunction;
