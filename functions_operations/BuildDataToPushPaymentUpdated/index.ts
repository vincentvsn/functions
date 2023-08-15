import { AzureFunction, Context, HttpRequest } from "@azure/functions";

interface DataPaymentCompleted {
  dividend_planet_amount: string;
  cost_fx_provider_initial: string;
  transfer_fees: string;
}

const activityFunction: AzureFunction = async function (context: Context) {
  const DataPaymentCompleted: DataPaymentCompleted = context.bindingData.getInfoHubspotFromOpertaionByPaymentidUpdated;

  const cost_total = Number(DataPaymentCompleted.dividend_planet_amount) + Number(DataPaymentCompleted.cost_fx_provider_initial) + Number(DataPaymentCompleted.transfer_fees);
  const cost_total_to_string = cost_total.toString();

  const InfoConversion = {
    cost_total: cost_total_to_string,
    status: "pending"
  }
  return InfoConversion
};

export default activityFunction;
