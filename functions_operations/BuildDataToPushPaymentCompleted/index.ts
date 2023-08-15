import { AzureFunction, Context, HttpRequest } from "@azure/functions";

interface DataPaymentCompleted {
  status: string;
  gross_margin_expected: string;
}

const activityFunction: AzureFunction = async function (context: Context) {
  const DataPaymentCompleted: DataPaymentCompleted = context.bindingData.getInfoHubspotFromOperationByPaymentidCompleted;
  return await BuildDataToPushPaymentCompleted(DataPaymentCompleted);
};

async function BuildDataToPushPaymentCompleted(DataPaymentCompleted: DataPaymentCompleted) {
  const InfoConversion = {
    status: "completed",
    gross_margin_realized: DataPaymentCompleted.gross_margin_expected,
  }
  return InfoConversion
}

export default activityFunction;
