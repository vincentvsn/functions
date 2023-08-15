import { AzureFunction, Context, HttpRequest } from "@azure/functions";
import * as currencyCloud from 'currency-cloud';
import { getTierForIso, tierPrices } from './countries';

const inputObject = {
  loginId: 'tech@keewe.eu',
  apiKey: '8f6568f36d852eb44e876fa82935429a9666393b4a1a4bf3af6e91b761d42b31'
};

interface GetPaymentCreationByIdFromCcy {
  id: string;
  type: string;
  company_id: string;
  status: string; // Pending
  amount: string;
  provider: string;
  payment_provider_id: string;
  currency: string; // -> currency
  created_at: string;
  volume_payment_processed_euro: string; // Amount
  shortReference: string; // -> shortReference
  turnoverInitial: string; // 0
  turnoverExpected: string; // 0
  turnoverRealized: string; // 0
  costRoll: string; // 0
  dividendPlanetAmount: string; // 0
  cost_fx_provider_initial: string; // 0
  cost_fx_provider_expected: string; // 0
  cost_fx_provider_realized: string; // 0
  transfer_fees: string;
  costTotal: string;
}

interface GetInfoBeneficiary {
  name: string;
  beneficiaryCountry: string;
}

interface PaymentBody {
  providerId: string;
  organizationId: string;
  dividendPlanetRate: string;
}

async function GetTransferFees(beneficiary_country: string) {
  const tier = getTierForIso(beneficiary_country);

  if (tier) {
    const price = tierPrices[tier];
    return price.toString();
  } else {
    return "0";
  }
}

const activityFunction: AzureFunction = async function (context: Context) {
  const GetInfoBeneficiary: GetInfoBeneficiary = context.bindingData.getInfoBeneficiaryPayment;
  const GetPaymentCreationByIdFromCcy: GetPaymentCreationByIdFromCcy = context.bindingData.getPaymentByIdFromCcy;
  const PaymentBody: PaymentBody = context.bindingData.paymentCreatedBody;
  const DataBuildFromCcy = await ConstructDataFromCcloud(GetPaymentCreationByIdFromCcy, PaymentBody, GetInfoBeneficiary);
  return await ConvertPaymentInfosToEuros(DataBuildFromCcy);
};

async function GetRateCurrency(currency: string) {
    const { loginId, apiKey } = inputObject;
    const getQuote = {
        buyCurrency: "EUR",
        sellCurrency: currency,
        amount: 1000,
        fixedSide: "buy"
    };

    try {
        await currencyCloud.authentication.login({
            environment: 'demo',
            loginId: loginId,
            apiKey: apiKey
        });

        return currencyCloud.retry(
            () => {
                return currencyCloud.rates.get(getQuote)
                    .then((res) => {
                        return res.coreRate;
                    });
            });
    } catch (error) {
        console.error('An error occurred:', error.message);
        return null;
    }
}

async function RuleOfThreeConversion(ValueCurrencyToTransform: string, RateConversion: string) {
  const ValueOfTransformation = Number(ValueCurrencyToTransform) / Number(RateConversion);
  return ValueOfTransformation.toString();
}

async function ConvertPaymentInfosToEuros(DataBuildFromCcy) {
  if (DataBuildFromCcy.currency !== "EUR") {
    const RateConversion = await GetRateCurrency(DataBuildFromCcy.currency);
    DataBuildFromCcy.amount = await RuleOfThreeConversion(DataBuildFromCcy.amount, RateConversion);
    DataBuildFromCcy.amount = Math.round(DataBuildFromCcy.amount * 100) / 100;
  }
  return DataBuildFromCcy;
}

async function ConstructDataFromCcloud(GetPaymentCreationByIdFromCcy: GetPaymentCreationByIdFromCcy, PaymentBody: PaymentBody, GetInfoBeneficiary: GetInfoBeneficiary) {
  const transferFees = await GetTransferFees(GetInfoBeneficiary.beneficiaryCountry);
  const costTotal = Number(transferFees) * -1;
  const costTotalToString = costTotal.toString();

  const DataPayment = {
    id: GetPaymentCreationByIdFromCcy.id,
    company_id: PaymentBody.organizationId,
    type: "payment",
    status: "pending",
    amount: GetPaymentCreationByIdFromCcy.amount,
    provider: "Currency Cloud",
    payment_provider_id: PaymentBody.providerId,
    currency: GetPaymentCreationByIdFromCcy.currency,
    beneficiary_name: GetInfoBeneficiary.name,
    beneficiary_country: GetInfoBeneficiary.beneficiaryCountry,
    volume_payment_processed_euro: GetPaymentCreationByIdFromCcy.amount,
    short_reference: GetPaymentCreationByIdFromCcy.shortReference,
    turnover_initial: "0",
    turnover_expected: "0",
    transfer_fees: transferFees,
    turnover_realized: "0",
    created_at: GetPaymentCreationByIdFromCcy.created_at,
    cost_roll: "0",
    dividend_planet_amount: "0",
    cost_fx_provider_initial: "0",
    cost_fx_provider_expected: "0",
    cost_fx_provider_realized: "0",
    cost_total: costTotalToString,
    gross_margin_initial: costTotalToString,
    gross_margin_expected: costTotalToString,
    gross_margin_realized: "0"
  }
  return DataPayment;
}

export default activityFunction;
