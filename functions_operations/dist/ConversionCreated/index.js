"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const apiKey = 'pat-eu1-7b7968a5-d9f4-4960-8113-496d0a78624f';
const objectName = '2-116564448';
const activityFunction = function (context) {
    return __awaiter(this, void 0, void 0, function* () {
        console.log("CONVERSION");
        console.log("Context", context);
        //const data: [] = context.bindings.name.data;
        //console.log(context);
        //await ConversionCreated(data);
    });
};
/*enum Operation {
  currency = 'currency',
  sellCurrency = 'sell_currency',
  amount = 'amount',
  sellAmount = 'sell_amount',
  rate = 'rate',
  clientRate = 'client_rate',
  currencyPair = 'currency_pair',
  provider = 'provider',
  conversionProviderId = 'conversion_provider_id',
  conversionShortReference = 'conversion_short_reference',
  creationDate = 'created_at',
  status = 'status',
  organizationId = 'organization_id',
  type = 'type',

  grossMarginInitial = 'gross_margin_initial',
  cost_payment_initial = 'cost_payment_initial',
  cost_provider_initial = 'cost_provider_initial',
  cost_roll = 'cost_roll',
  dividend_planet_inital = 'dividend_planet_inital',
  net_margin_initial = 'net_margin_initial',
  net_margin_expected = 'net_margin_expected'
}

// Requeter CCloud pour avoir la requete.

async function conversion(Operation: ConversionData, data: infoRequest) {
  // SI client buy - partner buy === 0 alors -> Client sell - partner sell Sinon -> Client buy - partner buy ::: Absolute Value de tout
  const gross_marg = Number(Operation.client_sell_amount) - Number(Operation.partner_sell_amount);
  const gross_str = gross_marg.toLocaleString('fr-FR');

  const net_marg = gross_marg * 0.995
  const net_str = net_marg.toLocaleString('fr-FR');

  let rate = Math.abs(((Number(Operation.client_rate) - Number(Operation.partner_rate)) / Number(Operation.partner_rate)) * 100);

  let the_rate = rate.toLocaleString('fr-FR');
  the_rate += " %"

  const provider_initial = 0.995 * gross_marg;
  const provider_initial_str = provider_initial.toLocaleString('fr-FR');

  const net_margin_initial = ;
  const net_margin_initial_str = net_margin_initial.toLocaleString('fr-FR');

  const net_margin_expected = net_margin_initial;

  const InfoConversion = {
    properties: {
      currency: Operation.buy_currency,
      sell_currency: Operation.sell_currency,
      amount: Operation.client_buy_amount,
      sell_amount: Operation.client_sell_amount,
      rate: the_rate,
      client_rate: Operation.client_rate,
      currency_pair: Operation.currency_pair,
      provider: "Currency Cloud",
      conversion_provider_id: Operation.id,
      conversion_short_reference: Operation.short_reference,
      creation_date: Operation.conversion_date,
      status: Operation.status,
      company_id: company_id,
      type: "conversion",
      gross_margin_initial: gross_marg,
      cost_payment_initial: "0",
      cost_provider_initial: provider_initial_str,
      cost_roll: "0",
      dividend_planet_inital: Number(data.dividendPlanetRate) * gross_marg,
      net_margin_initial: net_margin_initial,
      net_margin_expected: net_margin_initial
    },
  };

  return data;
}

async function CreateOperation(data: []) {
  try {
    const apiUrl = 'https://api.hubapi.com';

    const endpoint = `/crm/v3/objects/${objectName}`;

    const config = {
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
    };

    const response = await axios.post(`${apiUrl}${endpoint}`, data, config);

    console.log('Custom object record created successfully:', response.data);
  } catch (error) {
    console.error('Error creating custom object record:', error.response?.data || error.message);
  }
}

interface data {
  conversionId: string,
  providerId: string,
  organizationId: string,
    dividendPlanetRate: string
}

async function ConversionCreated(data: []): Promise<void> {

  

  //CreateOperation(Operation, data);
}
*/
exports.default = activityFunction;
/*







/ ----- CONVERSION ----- \\
const ConversionData = {
  "id": "a091cc5a-ba61-47d5-99b6-2eef70c6106f",
  "settlement_date": "2021-03-18T16:30:00+00:00",
  "conversion_date": "2021-03-18T00:00:00+00:00",
  "short_reference": "20210315-MMYPVL",
  "creator_contact_id": "53aabbe1-6627-4ce8-b517-766ef9625710",
  "account_id": "ee6d596a-81da-495d-a767-53d46e2e73c9",
  "currency_pair": "EURUSD",
  "status": "closed",
  "buy_currency": "USD",
  "sell_currency": "EUR",
  "client_buy_amount": "100000.00",
  "client_sell_amount": "84599.00",
  "fixed_side": "buy",
  "core_rate": "1.1856",
  "partner_rate": "1.1856",
  "partner_buy_amount": "100000.00",
  "partner_sell_amount": "84345.48",
  "client_rate": "1.1820",
  "deposit_required": false,
  "deposit_amount": "0.00",
  "deposit_currency": "",
  "deposit_status": "not_required",
  "deposit_required_at": "",
  "payment_ids": [],
  "unallocated_funds": "0.00",
  "unique_request_id": "1234",
  "created_at": "2021-03-15T13:42:45+00:00",
  "updated_at": "2021-08-04T14:32:10+00:00",
  "mid_market_rate": "1.1858"
}

interface ConversionData {
  buy_currency: string; // [CURRENCY]
  sell_currency: string; // [SELL CURRENCY]
  client_buy_amount: string; // [AMOUNT]
  client_sell_amount: string; // [SELL AMOUNT]
  // [MARGE RATE] -> faire Calcul
  client_rate: string; // [CLIENT RATE]
  currency_pair: string; // [CURRENCY PAIR]
  // [PROVIDER] -> Voir InfosAdd
  short_reference: string; // [CONVERSION SHORT REFERENCE]
  id: string; // [CONVERSION PROVIDER ID]
  // [PLANET DIVIDEND]
  // [PAYMENT FEES] -> Null
  // [Beneficiary name] -> Null
  conversion_date: string; // [CONVERSION_DATE]
  status: string; // [STATUS] -> pending - completed - cancelled
  // [PAYMENT DATE] -> Null
  partner_sell_amount: string;
  partner_rate: string;
}

const company_id = "123";

interface infoRequest {
  conversionId: string;
  providerId: string;
  organizationId: string;
  dividendPlanetRate: string;
}*/ 
//# sourceMappingURL=index.js.map