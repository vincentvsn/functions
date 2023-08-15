import { AzureFunction, Context, HttpRequest } from "@azure/functions";
import axios from "axios";
import { GetRateCurrency, RuleOfThreeConversion } from "../Utils/utils";

export interface GetConversionCreationByIdFromCcy {
  clientBuyAmount: string;
  clientSellAmount: string;
  partnerBuyAmount: string;
  partnerSellAmount: string;
  buyCurrency: string;
  sellCurrency: string;
  fixedSide: string;
  CurrencyToTransform: string;
}

interface DataConversion {
  cost_total: string;
  fixed_side: string;
  sell_currency: string;
  buy_currency: string;
  gross_margin_expected: string;
}

const activityFunction: AzureFunction = async function (context: Context) {
  console.log("THE CONTEXT", context);
  const cost_roll: string = context.bindingData.sumOfAllAmountOfConversionActions;
  const DataConversion: DataConversion = context.bindingData.searchOperationByConversionId;

  return await BuildDataToPushConversionUpdate(cost_roll, DataConversion);
};

async function ConvertCostRollInEuros(cost_roll: string, DataConversion: DataConversion) {
  const Data = {
    clientBuyAmount: "",
    clientSellAmount: "",
    partnerBuyAmount: "",
    partnerSellAmount: "",
    buyCurrency: "",
    sellCurrency: "",
    fixedSide: "",
    CurrencyToTransform: "",
  }
  if (DataConversion.fixed_side === "buy") {
    Data.CurrencyToTransform = DataConversion.sell_currency;
  } else {
    Data.CurrencyToTransform = DataConversion.buy_currency;
  }
  console.log("CURRENCY ", Data.CurrencyToTransform);
  const GetConversionCreationByIdFromCcy: GetConversionCreationByIdFromCcy = Data;

  const RateConversion = await GetRateCurrency(GetConversionCreationByIdFromCcy);
  return await RuleOfThreeConversion(cost_roll, RateConversion);
}

async function BuildDataToPushConversionUpdate(cost_roll: string, DataConversion: DataConversion) {
  const sum_total_cost = Number(cost_roll) + Number(DataConversion.cost_total);
  const sum_total_cost_as_string = sum_total_cost.toLocaleString();
  console.log("THE RES", DataConversion.gross_margin_expected);
  const cost_roll_final = await ConvertCostRollInEuros(cost_roll, DataConversion);
  console.log("COST ROLL", cost_roll);
  const InfoConversion = {
    cost_roll: cost_roll_final,
    cost_total: sum_total_cost_as_string,
    gross_margin_realized: DataConversion.gross_margin_expected,
  }
  console.log("FINAL : ", InfoConversion);
  return InfoConversion
}

export default activityFunction;
