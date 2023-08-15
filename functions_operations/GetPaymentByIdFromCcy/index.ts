import { AzureFunction, Context, HttpRequest } from "@azure/functions";
import * as currencyCloud from 'currency-cloud';
import { CallActivityAction } from "durable-functions/lib/src/classes";

const inputObject = {
  loginId: 'tech@keewe.eu',
  apiKey: '8f6568f36d852eb44e876fa82935429a9666393b4a1a4bf3af6e91b761d42b31'
};

const activityFunction: AzureFunction = async function (context: Context): Promise<void> {
  const paymentId: string = context.bindingData.paymentCreatedBody.paymentId;
  return await GetPaymentByIdFromCcy(inputObject, paymentId);
};

async function GetPaymentByIdFromCcy(inputObject, paymentId) {
  const { loginId, apiKey } = inputObject;

  try {
    await currencyCloud.authentication.login({
      environment: 'demo',
      loginId: loginId,
      apiKey: apiKey
    });

    const payment = await currencyCloud.payments.get({ id: paymentId });
    if (payment) {
      return payment;
    } else {
      console.log('Payment not found.');
      return null;
    }
  } catch (error) {
    console.error('An error occurred:', error.message);
    return null;
  }
}

export default activityFunction;
