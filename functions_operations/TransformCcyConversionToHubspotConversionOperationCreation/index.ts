import { AzureFunction, Context } from "@azure/functions";
import { type } from "os";

interface GetConversionCreationByIdFromCcy {
  id: string;
  conversionDate: string;
  shortReference: string;
  currencyPair: string;
  status: string;
  buyCurrency: string;
  sellCurrency: string;
  clientBuyAmount: string;
  clientSellAmount: string;
  fixedSide: string;
  coreRate: string;
  partnerRate: string;
  partnerBuyAmount: string;
  partnerSellAmount: string;
  clientRate: string;
  depositRequired: string;
  depositAmount: string;
  depositCurrency: string;
  paymentIds: string;
  unallocatedFunds: string;
  rate: string;
  volume_conversion_processed_euro: string;
  volume_payment_precessed_euro: string;
  turnover_initial: string;
  turnover_expected: string;
  turnover_realized: string;
  cost_total: string;
  cost_roll: string;
  cost_payment: string;
  dividend_planet_amount: string;
  cost_fx_provider_initial: string;
  cost_fx_provider_expected: string;
  gross_margin_initial: string;
  gross_margin_expected: string;
  gross_margin_realized: string;
}

interface InputConversion {
  conversionId: string;
  providerId: string;
  organizationId: string;
  dividendPlanetRate: string;
}

const activityFunction: AzureFunction = async function (context: Context) {
  const GetConversionCreationByIdFromCcy: GetConversionCreationByIdFromCcy = context.bindingData.convertCurrencyToEuros;
  const inputConversion: InputConversion = context.bindingData.conversionCreatedBody;
  return await ConversionCreated(GetConversionCreationByIdFromCcy, inputConversion);
};

async function GetCostInitial(GetConversionCreationByIdFromCcy: GetConversionCreationByIdFromCcy, InputConversion: InputConversion) {
  const CostInitial = Number(InputConversion.dividendPlanetRate) + Number(GetConversionCreationByIdFromCcy.cost_fx_provider_initial);
  const CostInitialConvertToString = CostInitial.toString();
  return CostInitialConvertToString;
}

async function GetGrossMargin(GetConversionCreationByIdFromCcy: GetConversionCreationByIdFromCcy) {
  const GrossMargin = Number(GetConversionCreationByIdFromCcy.turnover_initial) - Number(GetConversionCreationByIdFromCcy.cost_total);
  const GrossMarginConvertToString = GrossMargin.toString();
  return GrossMarginConvertToString;
}

async function GetTurnoverInitial(GetConversionCreationByIdFromCcy: GetConversionCreationByIdFromCcy) {
  const TurnoverInitial = Math.abs(Number(GetConversionCreationByIdFromCcy.clientSellAmount) - Number(GetConversionCreationByIdFromCcy.partnerSellAmount) === 0 ?
  Number(GetConversionCreationByIdFromCcy.clientBuyAmount) - Number(GetConversionCreationByIdFromCcy.partnerBuyAmount) :
  Number(GetConversionCreationByIdFromCcy.clientSellAmount) - Number(GetConversionCreationByIdFromCcy.partnerSellAmount));
  return TurnoverInitial.toString();
}

async function GetCostFxProvider(GetConversionCreationByIdFromCcy: GetConversionCreationByIdFromCcy) {
  const CostFxProvider = 0.05 * Number(GetConversionCreationByIdFromCcy.clientBuyAmount);
  const CostFxProviderConvertToString = CostFxProvider.toString();
  return CostFxProviderConvertToString;
}

async function GetDividendPlanetAmount(GetConversionCreationByIdFromCcy: GetConversionCreationByIdFromCcy, InputConversion: InputConversion) {
  const DividendPlanetAmount = Number(InputConversion.dividendPlanetRate) * Number(GetConversionCreationByIdFromCcy.turnover_initial);
  const DividendPlanetAmountConvertToString = DividendPlanetAmount.toString();
  return DividendPlanetAmountConvertToString;
}

async function GetRate(GetConversionCreationByIdFromCcy: GetConversionCreationByIdFromCcy) {
  let rate = Math.abs(((Number(GetConversionCreationByIdFromCcy.clientRate) - Number(GetConversionCreationByIdFromCcy.partnerRate)) / Number(GetConversionCreationByIdFromCcy.partnerRate)) * 100);
  let the_rate = rate.toLocaleString('fr-FR');
  the_rate += " %"
  return the_rate;
}

async function ConversionCreated(GetConversionCreationByIdFromCcy: GetConversionCreationByIdFromCcy, InputConversion: InputConversion) {
  GetConversionCreationByIdFromCcy.turnover_initial = await GetTurnoverInitial(GetConversionCreationByIdFromCcy);
  GetConversionCreationByIdFromCcy.cost_fx_provider_initial = await GetCostFxProvider(GetConversionCreationByIdFromCcy);
  GetConversionCreationByIdFromCcy.dividend_planet_amount = await GetDividendPlanetAmount(GetConversionCreationByIdFromCcy, InputConversion);
  GetConversionCreationByIdFromCcy.cost_total = await GetCostInitial(GetConversionCreationByIdFromCcy, InputConversion);
  GetConversionCreationByIdFromCcy.gross_margin_initial = await GetGrossMargin(GetConversionCreationByIdFromCcy);
  const Rate = await GetRate(GetConversionCreationByIdFromCcy);

  const InfoConversion = {
    id: InputConversion.conversionId,
    currency: GetConversionCreationByIdFromCcy.buyCurrency,
    sell_currency: GetConversionCreationByIdFromCcy.sellCurrency,
    buy_currency: GetConversionCreationByIdFromCcy.buyCurrency,
    amount: GetConversionCreationByIdFromCcy.clientBuyAmount,
    sell_amount: GetConversionCreationByIdFromCcy.clientSellAmount,
    rate: Rate,
    client_rate: GetConversionCreationByIdFromCcy.clientRate,
    partner_rate: GetConversionCreationByIdFromCcy.partnerRate,
    partner_buy_amount: GetConversionCreationByIdFromCcy.partnerBuyAmount,
    partner_sell_amount: GetConversionCreationByIdFromCcy.partnerSellAmount,
    client_buy_amount: GetConversionCreationByIdFromCcy.clientBuyAmount,
    client_sell_amount: GetConversionCreationByIdFromCcy.clientSellAmount,
    currency_pair: GetConversionCreationByIdFromCcy.currencyPair,
    provider: InputConversion.providerId,
    fixed_side: GetConversionCreationByIdFromCcy.fixedSide,
    conversion_provider_id: GetConversionCreationByIdFromCcy.id,
    conversion_short_reference: GetConversionCreationByIdFromCcy.shortReference,
    creation_date: GetConversionCreationByIdFromCcy.conversionDate,
    status: "pending",
    company_id: InputConversion.organizationId,
    type: "conversion",
    volume_conversion_processed_euro: GetConversionCreationByIdFromCcy.clientBuyAmount,
    turnover_initial: GetConversionCreationByIdFromCcy.turnover_initial,
    turnover_expected: GetConversionCreationByIdFromCcy.turnover_initial,
    turnover_realized: "0",
    cost_total: GetConversionCreationByIdFromCcy.cost_total,
    cost_roll: "0",
    cost_payment: "0",
    dividend_planet_amount: GetConversionCreationByIdFromCcy.dividend_planet_amount,
    cost_fx_provider_initial: GetConversionCreationByIdFromCcy.cost_fx_provider_initial,
    cost_fx_provider_expected: GetConversionCreationByIdFromCcy.cost_fx_provider_initial,
    gross_margin_initial: GetConversionCreationByIdFromCcy.gross_margin_initial,
    gross_margin_expected: GetConversionCreationByIdFromCcy.gross_margin_initial,
    gross_margin_realized: "0",
  }
  return InfoConversion;
}

export default activityFunction;
