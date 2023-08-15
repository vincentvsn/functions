import { AzureFunction, Context, HttpRequest } from "@azure/functions";


const activityFunction: AzureFunction = async function (context: Context) {
  console.log("END", context);
  const CostRoll: string = context.bindingData.sumOfAllAmountOfConversionActions;
  return await(BuildDataToPushConversionCancelled(CostRoll))
};

async function BuildDataToPushConversionCancelled(CostRoll: string) {
  const DataToPush = {
    status: "cancelled",
    volume_conversion_processed_euro: "0",
    turnover_expected: "0",
    turnover_realized: "0",
    cost_roll: CostRoll,
    cost_fx_provider_expected: "0",
    cost_total: CostRoll,
    gross_margin_expected: "0",
    gross_margin_realized: CostRoll
  }
  return DataToPush;
}

export default activityFunction;
