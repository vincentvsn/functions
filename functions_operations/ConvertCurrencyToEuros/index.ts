import { AzureFunction, Context, HttpRequest } from "@azure/functions";
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

const activityFunction: AzureFunction = async function (context: Context) {
  const GetConversionCreationByIdFromCcy: GetConversionCreationByIdFromCcy = context.bindingData.getConversionCreationByIdFromCcy;
  await ConvertCurrencyToEuros(GetConversionCreationByIdFromCcy);
  return GetConversionCreationByIdFromCcy;
};

async function TransformValueToEurosBuy(GetConversionCreationByIdFromCcy: GetConversionCreationByIdFromCcy, RateConversion: string) {
  GetConversionCreationByIdFromCcy.clientBuyAmount = await RuleOfThreeConversion(GetConversionCreationByIdFromCcy.clientBuyAmount, RateConversion);
  GetConversionCreationByIdFromCcy.partnerBuyAmount = await RuleOfThreeConversion(GetConversionCreationByIdFromCcy.partnerBuyAmount, RateConversion);
}

async function TransformValueToEurosSell(GetConversionCreationByIdFromCcy: GetConversionCreationByIdFromCcy, RateConversion: string) {
  GetConversionCreationByIdFromCcy.clientSellAmount = await RuleOfThreeConversion(GetConversionCreationByIdFromCcy.clientSellAmount, RateConversion);
  GetConversionCreationByIdFromCcy.partnerSellAmount = await RuleOfThreeConversion(GetConversionCreationByIdFromCcy.partnerSellAmount, RateConversion);
}

async function ChangeValueCurrency(GetConversionCreationByIdFromCcy: GetConversionCreationByIdFromCcy) {
  if (GetConversionCreationByIdFromCcy.fixedSide === "buy") {
    GetConversionCreationByIdFromCcy.CurrencyToTransform = GetConversionCreationByIdFromCcy.sellCurrency;
  } else {
    GetConversionCreationByIdFromCcy.CurrencyToTransform = GetConversionCreationByIdFromCcy.buyCurrency;
  }
  if (GetConversionCreationByIdFromCcy.CurrencyToTransform !== "EUR") {
    return await GetRateCurrency(GetConversionCreationByIdFromCcy);
  }
  return "1";
}

async function ConvertCurrencyToEuros(GetConversionCreationByIdFromCcy: GetConversionCreationByIdFromCcy) {
  const RateConversion = await ChangeValueCurrency(GetConversionCreationByIdFromCcy);
  if (GetConversionCreationByIdFromCcy.fixedSide === "buy") {
    await TransformValueToEurosSell(GetConversionCreationByIdFromCcy, RateConversion);
  } else {
    await TransformValueToEurosBuy(GetConversionCreationByIdFromCcy, RateConversion);
  }
}

export default activityFunction;
