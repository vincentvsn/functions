import { AzureFunction, Context } from "@azure/functions";
import { type } from "os";

interface GetConversionCompletedByIdFromCcy {
  id: string;
  turnover_expected: string;
  turnover_realized: string;
  cost_fx_provider_expected: string;
  cost_fx_provider_realized: string;
  gross_margin_expected: string;
  gross_margin_realized: string;
}

const activityFunction: AzureFunction = async function (context: Context) {
  const GetConversionCompletedByIdFromCcy: GetConversionCompletedByIdFromCcy = context.bindingData.searchOperationByConversionIdCompleted;
  return await ConversionCreated(GetConversionCompletedByIdFromCcy);
};

async function ConversionCreated(GetConversionCompletedByIdFromCcy: GetConversionCompletedByIdFromCcy) {
  const InfoConversion = {
    id: GetConversionCompletedByIdFromCcy.id,
    turnover_realized: GetConversionCompletedByIdFromCcy.turnover_expected,
    cost_fx_provider_realized: GetConversionCompletedByIdFromCcy.cost_fx_provider_expected,
    gross_margin_realized: GetConversionCompletedByIdFromCcy.gross_margin_expected,
  }
  return InfoConversion;
}

export default activityFunction;
