import { AzureFunction, Context, HttpRequest } from "@azure/functions";
import * as currencyCloud from 'currency-cloud';
import { CallActivityAction } from "durable-functions/lib/src/classes";

const inputObject = {
  loginId: 'tech@keewe.eu',
  apiKey: '8f6568f36d852eb44e876fa82935429a9666393b4a1a4bf3af6e91b761d42b31'
};

const activityFunction: AzureFunction = async function (context: Context): Promise<void> {
  const conversionId = context.bindingData.conversionCreatedBody.conversionId;
  return await GetConversionByIdFromCcy(inputObject, conversionId);
};

async function GetConversionByIdFromCcy(inputObject, conversionId) {
  const { loginId, apiKey } = inputObject;

  try {
    await currencyCloud.authentication.login({
      environment: 'demo',
      loginId: loginId,
      apiKey: apiKey
    });

    const conversion = await currencyCloud.conversions.get({ id: conversionId });
    if (conversion) {
      return conversion;
    } else {
      console.log('Conversion not found.');
      return null;
    }
  } catch (error) {
    console.error('An error occurred:', error.message);
    return null;
  }
}

export default activityFunction;
