"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
const df = __importStar(require("durable-functions"));
// Status lié à la conversion
// Status lié au payment
// Event : Création de Conversion / Création de Payment
// Value_id : conversion_id ou payment_id
// Get conversion by id / payment by id chez Currency Cloud
// Récupérer la requete et envoyer sur Hubspot
// Créer programme pour create a custom object
// Diff entre client sell amount et partner sell amount -> Transformer marger en euros pour marge brut -> marge net = marge brut * 0.95
// Graphique P&L de l'entreprise mois par mois
// Lister paire de devise que le client à traité
// ----- PAYMENT ----- \\
const PaymentData = {
    "id": "8254e369-1200-46ff-af5c-dea068373a11",
    "amount": "10.00",
    "beneficiary_id": null,
    "currency": "EUR",
    "reference": "none",
    "reason": "none",
    "status": "ready_to_send",
    "creator_contact_id": "53aabbe1-6627-4ce8-b517-766ef9625710",
    "payment_type": "regular",
    "payment_date": "2021-03-03",
    "transferred_at": "",
    "authorisation_steps_required": "0",
    "last_updater_contact_id": "53aabbe1-6627-4ce8-b517-766ef9625710",
    "short_reference": "210303-DJXQKW001",
    "conversion_id": null,
    "failure_reason": "",
    "payer_id": "3fcd5fed-8a5e-4880-b68e-a658ea3a90c2",
    "payer_details_source": "payer",
    "created_at": "2021-03-03T09:37:04+00:00",
    "updated_at": "2021-04-14T08:53:36+00:00",
    "payment_group_id": null,
    "unique_request_id": "3ullyU8Yn6gIa_7K8kLUnw",
    "failure_returned_amount": "0.00",
    "ultimate_beneficiary_name": null,
    "purpose_code": null,
    "charge_type": null,
    "fee_amount": null,
    "fee_currency": null,
    "review_status": "passed",
    "invoice_date": null,
    "invoice_number": null
};
// ----- CONVERSION WITH PAYMENT ----- \\
const ConversionWithPayment = {
    "id": "60e49154-1031-4c6d-a502-db4acb941be0",
    "amount": "83333.34",
    "beneficiary_id": null,
    "currency": "EUR",
    "reference": "6da5daff-82a4-4070-ad6e-2edf2692622f",
    "reason": "Sent by Keewe",
    "status": "suspended",
    "creator_contact_id": "53aabbe1-6627-4ce8-b517-766ef9625710",
    "payment_type": "regular",
    "payment_date": "2021-04-16",
    "transferred_at": "2021-08-04T14:33:00Z",
    "authorisation_steps_required": "0",
    "last_updater_contact_id": "65b990b6-d438-4fa2-b9c7-d9f304781387",
    "short_reference": "210412-KCVLHC001",
    "conversion_id": "6da5daff-82a4-4070-ad6e-2edf2692622f",
    "failure_reason": "",
    "payer_id": "152d3812-006b-48f5-bd7a-7f08a964934f",
    "payer_details_source": "payer",
    "created_at": "2021-04-12T13:00:54+00:00",
    "updated_at": "2021-08-04T14:33:01+00:00",
    "payment_group_id": null,
    "unique_request_id": "6da5daff-82a4-4070-ad6e-2edf2692622f",
    "failure_returned_amount": "0.00",
    "ultimate_beneficiary_name": null,
    "purpose_code": null,
    "charge_type": null,
    "fee_amount": null,
    "fee_currency": null,
    "review_status": "passed",
    "invoice_date": null,
    "invoice_number": null
};
const PaymentWithConversion = {
    "id": "6da5daff-82a4-4070-ad6e-2edf2692622f",
    "settlement_date": "2021-04-16T13:30:00+00:00",
    "conversion_date": "2021-04-16T00:00:00+00:00",
    "short_reference": "20210412-KCVLHC",
    "creator_contact_id": "53aabbe1-6627-4ce8-b517-766ef9625710",
    "account_id": "ee6d596a-81da-495d-a767-53d46e2e73c9",
    "currency_pair": "EURUSD",
    "status": "closed",
    "buy_currency": "EUR",
    "sell_currency": "USD",
    "client_buy_amount": "83333.34",
    "client_sell_amount": "100000.00",
    "fixed_side": "buy",
    "core_rate": "1.1858",
    "partner_rate": "1.1858",
    "partner_buy_amount": "83333.34",
    "partner_sell_amount": "98816.67",
    "client_rate": "1.2000",
    "deposit_required": false,
    "deposit_amount": "0.00",
    "deposit_currency": "",
    "deposit_status": "not_required",
    "deposit_required_at": "",
    "payment_ids": [
        "60e49154-1031-4c6d-a502-db4acb941be0"
    ],
    "unallocated_funds": "0.00",
    "unique_request_id": "68141dea-9db7-4fe9-b104-223df91003bf",
    "created_at": "2021-04-12T13:00:51+00:00",
    "updated_at": "2021-08-04T14:33:00+00:00",
    "mid_market_rate": "1.1858"
};
// [CURRENCY] -> Currency : Payment | Buy Currency Conversion
// [Sell Currency] -> Null Payment | Sell currency Conversion
// [Amount] -> Buy client amount Conversion | Currency Payment
// [Sell amount] -> Client sell amount Conversion | Conversion avec payment | Null payment
// Marge rate
// Client rate
// Currency pair -> Null si payment
// Provider : Currency Cloud
// Conversion provider id
// Conversion Short Reference
// Payment provider id
// Payment Short Reference
// Growth Margin
// Net Margin
// Planet Dividend
// Payment fees
// Beneficiary name
// Created at
// Status: Pour conversion : pending - completed - cancelled, Pour payment : pending - completed - failed - blocked
// Payment date
// Company id
/*async function payment_with_conversion() {
  const InfoConversionWithPayment: PaymentWithConversion & ConversionWithPayment = {
    ...ConversionData,
    ...PaymentData,
  };

  const growth_marg = Number(InfoConversionWithPayment.client_sell_amount) - Number(InfoConversionWithPayment.partner_sell_amount);
  const growth_str = growth_marg.toLocaleString('fr-FR');

  const net_marg = growth_marg * 0.95
  const net_str = net_marg.toLocaleString('fr-FR');

  let rate = ((Number(InfoConversionWithPayment.client_rate) - Number(InfoConversionWithPayment.partner_rate)) / Number(InfoConversionWithPayment.partner_rate)) * 100;
  if (rate < 0) {
    rate *= -1;
  }
  let the_rate = rate.toLocaleString('fr-FR');
  the_rate += " %"

  const data = {
    properties: {
      currency: InfoConversionWithPayment.buy_currency,
      sell_currency: InfoConversionWithPayment.sell_currency,
      amount: InfoConversionWithPayment.client_buy_amount,
      sell_amount: InfoConversionWithPayment.client_sell_amount,
      rate: the_rate,
      client_rate: InfoConversionWithPayment.client_rate,
      currency_pair: InfoConversionWithPayment.currency_pair,
      provider: InfosAdd.provider,
      conversion_provider_id: InfoConversionWithPayment.id,
      conversion_short_reference: InfoConversionWithPayment.short_reference,
      growth_margin: growth_str,
      net_margin: net_str,
      planet_dividend: InfosAdd.planet_dividend,
      creation_date: InfoConversionWithPayment.created_at,
      status: InfoConversionWithPayment.status,
      company_id: InfosAdd.company_id,
      type: "payment with conversion"
    },
  };

  return data;
}

async function payment() {
  const data = {
    properties: {
      currency: PaymentData.currency,
      amount: PaymentData.amount,
      provider: InfosAdd.provider,
      payment_provider_id: PaymentData.id,
      payment_short_reference: PaymentData.short_reference,
      planet_dividend: InfosAdd.planet_dividend,
      payment_fees: PaymentData.fee_amount,
      beneficiary_name: PaymentData.ultimate_beneficiary_name,
      creation_date: PaymentData.created_at,
      status: PaymentData.status,
      company_id: InfosAdd.company_id,
      type: "payment"
    },
  };

  return data;
}*/
const ConversionCreate = {
    "conversionId": "d9b16e34-463d-4d7d-b89e-15f8ea010c0f",
    "providerId": "CURRENCY_CLOUD",
    "organizationId": "123",
    "dividendPlanetRate": 0.15
};
const ConversionComplete = {
    "conversionId": "",
    "organizationId": "123"
};
const ConversionUpdate = {
    "conversionId": "",
    "organizationId": "123"
};
const PaymentCreate = {
    "paiementId": "",
    "providerId": "CURRENCY_CLOUD",
    "organizationId": "123"
};
const PaymentComplete = {};
const PaymentUpdate = {
    "paiementId": "",
    "organizationId": "123"
};
const orchestrator = df.orchestrator(function* (context) {
    const input = context.df.getInput();
    const { eventName } = input;
    const outputs = [];
    switch (eventName) {
        case "conversion_created":
            const requestCCloud = yield context.df.callActivity("FindConversionCCloud", { ConversionCreate });
            const conversionCreatedPromise = yield context.df.callActivity("ConversionCreated", { ConversionCreate, requestCCloud });
            break;
        case "conversion_completed":
            yield context.df.callActivity("ConversionCompleted", { ConversionComplete });
            break;
        case "conversion_updated":
            yield context.df.callActivity("ConversionUpdated", { ConversionUpdate });
            break;
        case "payment_created":
            yield context.df.callActivity("PaymentCreated", { PaymentCreate });
            break;
        case "payment_completed":
            yield context.df.callActivity("PaymentCompleted", { PaymentComplete });
            break;
        case "payment_updated":
            yield context.df.callActivity("PaymentUpdated", { PaymentUpdate });
            break;
        default:
            break;
    }
    //console.log(data);
    //const updatedCompanies = yield context.df.callActivity(
    //  "CreateOperation",
    //  { data }
    //);
    //outputs.push(updatedCompanies);
});
exports.default = orchestrator;
// Creation
// Payment -> Si conversion id n'est pas null
// On vient rechercher la conversion dans Hubspot avec cet id
// On change le type de conversion à conversion_with_payment
// On vient update les infos
// conversion_created / conversion_updated
// payment_created / payment_updated
//# sourceMappingURL=index.js.map