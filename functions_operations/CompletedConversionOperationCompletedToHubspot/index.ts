import { AzureFunction, Context, HttpRequest } from "@azure/functions";
import axios from "axios";


interface InfoGetByTransformCCy {
  turnover_realized: string;
  cost_fx_provider_realized: string;
  gross_margin_realized: string;
  conversion_status: string;
}

const activityFunction: AzureFunction = async function (context: Context) {
  const InfoGetByTransformCCy: InfoGetByTransformCCy = context.bindingData.transformCcyConversionToHubspotConversionOperationCompleted;
  const Id: string = context.bindingData.transformCcyConversionToHubspotConversionOperationCompleted.id;
  return await OperationCompletedPushToHubspot(InfoGetByTransformCCy, Id);
};

const ChangeInterfaceToPush = async (InfoGetByTransformCCy: InfoGetByTransformCCy) => {
  const InfoConversion = {
    turnover_realized: InfoGetByTransformCCy.turnover_realized,
    cost_fx_provider_realized: InfoGetByTransformCCy.cost_fx_provider_realized,
    gross_margin_realized: InfoGetByTransformCCy.gross_margin_realized,
    conversion_status: "Completed"
  }
  return InfoConversion
}

async function OperationCompletedPushToHubspot(InfoGetByTransformCCy: InfoGetByTransformCCy, Id: string) {
  return await ChangeInterfaceToPush(InfoGetByTransformCCy);
}

export default activityFunction;
