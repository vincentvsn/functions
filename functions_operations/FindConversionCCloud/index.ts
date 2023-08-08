import { AzureFunction, Context, HttpRequest } from "@azure/functions";
import * as currencyCloud from 'currency-cloud';
import { CallActivityAction } from "durable-functions/lib/src/classes";

const loginId = 'tech@keewe.eu';
const apiKey = '8f6568f36d852eb44e876fa82935429a9666393b4a1a4bf3af6e91b761d42b31';

interface data {
  conversionId: string
}

const activityFunction: AzureFunction = async function (context: Context): Promise<void> {
  const conversionId: string = context.bindingData.conversionCreate.conversionId;
  await GetInfoConversion(conversionId);
};

async function GetInfoConversion(conversionId: string): Promise<void> {
  return await currencyCloud.authentication.login({
    environment: 'demo',
    loginId: loginId,
    apiKey: apiKey
  })
    .then(() => {
      return currencyCloud.conversions.find();
    })
    .then((res) => {
      const conversion = res.conversions.find((conv) => {
        return conv.id === conversionId;
      });

      if (conversion) {
        return conversion;
      } else {
        console.log('Conversion not found.');
      }
    })
}

export default activityFunction;
