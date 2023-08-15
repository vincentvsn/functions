import * as currencyCloud from 'currency-cloud';
import { CallActivityAction } from "durable-functions/lib/src/classes";
import { get } from "http";
import { GetConversionCreationByIdFromCcy } from '../ConvertCurrencyToEuros';

const inputObject = {
  loginId: 'tech@keewe.eu',
  apiKey: '8f6568f36d852eb44e876fa82935429a9666393b4a1a4bf3af6e91b761d42b31'
};

export async function GetRateCurrency(GetConversionCreationByIdFromCcy: GetConversionCreationByIdFromCcy) {
    const { loginId, apiKey } = inputObject;
    const getQuote = {
        buyCurrency: "EUR",
        sellCurrency: GetConversionCreationByIdFromCcy.CurrencyToTransform,
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

export async function RuleOfThreeConversion(ValueCurrencyToTransform: string, RateConversion: string) {
    const ValueOfTransformation = Number(ValueCurrencyToTransform) / Number(RateConversion);
    return ValueOfTransformation.toString();
}
