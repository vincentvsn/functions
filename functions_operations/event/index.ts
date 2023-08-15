import * as df from "durable-functions";

interface OrchestratorInput {
  eventName: string;
}

const ConversionCreatedBody = {
  "conversionId": "5a99ea0b-4d77-4a8d-8d10-41330abed027",
  "providerId": "CURRENCY_CLOUD",
  "organizationId": "8138931423",
  "dividendPlanetRate": 0.15
}

const PaymentCreatedBody = {
  "paymentId": "495ae852-bf94-4cdc-87eb-9f20259b5672",
  "providerId": "CURRENCY_CLOUD",
  "organizationId": "8138931423",
}

let GetTokenLoginAPICCloud;
let GetAllActionsByConversionId;
let SumOfAllAmountOfConversionActions;

const orchestrator = df.orchestrator(function* (context) {
  const input = context.df.getInput() as OrchestratorInput;
  const { eventName } = input;
  const outputs = [];

  switch (eventName) {
    case "conversion_created":
      const GetConversionCreationByIdFromCcy = yield context.df.callActivity(
        "GetConversionByIdFromCcy",
        { ConversionCreatedBody },
      );
      const ConvertCurrencyToEuros = yield context.df.callActivity(
        "ConvertCurrencyToEuros",
        { GetConversionCreationByIdFromCcy },
      );
      const TransformCcyConversionToHubspotConversionOperationCreation = yield context.df.callActivity(
        "TransformCcyConversionToHubspotConversionOperationCreation",
        { ConversionCreatedBody, ConvertCurrencyToEuros }
      );
      const SearchOperationByConversionIdCreated = yield context.df.callActivity(
        "CreateConversionOperationCreationToHubspot",
        { TransformCcyConversionToHubspotConversionOperationCreation }
      );

      yield context.df.callActivity(
        "AssociateCompanyToOperation",
        { SearchOperationByConversionIdCreated, string: "conversion" } // A CHANGER VOIR PAYMENT
      );
      break

    case "conversion_updated": // Rentrer un ConversionId présent sur Hubspot et qui a des actions
      GetTokenLoginAPICCloud = yield context.df.callActivity(
        "GetTokenLoginAPICCloud",
        {},
      );
      GetAllActionsByConversionId = yield context.df.callActivity(
        "GetAllActionsByConversionId",
        { GetTokenLoginAPICCloud, ConversionCreatedBody },
      );
      SumOfAllAmountOfConversionActions = yield context.df.callActivity(
        "SumOfAllAmountOfConversionActions",
        { GetAllActionsByConversionId },
      );
      const SearchOperationByConversionId = yield context.df.callActivity(
        "SearchOperationByConversionId",
        { ConversionCreatedBody, string: "updated" },
      );
      console.log("SEARCH : ", SearchOperationByConversionId);

      const BuildDataToPushConversionUpdate = yield context.df.callActivity(
        "BuildDataToPushConversionUpdate",
        { SumOfAllAmountOfConversionActions, SearchOperationByConversionId },
      );
      console.log("DATA", BuildDataToPushConversionUpdate)
      yield context.df.callActivity(
        "UpdateDataFromConversionToHubspot",
        { BuildDataToPushConversionUpdate, SearchOperationByConversionId, string: "updated" }
      );
      break

    case "conversion_completed": // Rentrer un ConversionId présent sur Hubspot
      const SearchOperationByConversionIdCompleted = yield context.df.callActivity(
        "SearchOperationByConversionId",
        { ConversionCreatedBody, string: "completed" },
      );
      const TransformCcyConversionToHubspotConversionOperationCompleted = yield context.df.callActivity(
        "TransformCcyConversionToHubspotConversionOperationCompleted",
        { SearchOperationByConversionIdCompleted },
      );
      const GetDataToPushHubspotFromConversionCompleted = yield context.df.callActivity(
        "CompletedConversionOperationCompletedToHubspot",
        { TransformCcyConversionToHubspotConversionOperationCompleted }
      );
      yield context.df.callActivity(
        "UpdateDataFromConversionToHubspot",
        { GetDataToPushHubspotFromConversionCompleted, SearchOperationByConversionIdCompleted, string: "completed" }
      );
      break

    case "conversion_cancelled": // Rentrer un ConversionId présent sur Hubspot
      GetTokenLoginAPICCloud = yield context.df.callActivity(
        "GetTokenLoginAPICCloud",
        {},
      );
      console.log("Token", GetTokenLoginAPICCloud);
      GetAllActionsByConversionId = yield context.df.callActivity(
        "GetAllActionsByConversionId",
        { GetTokenLoginAPICCloud, ConversionCreatedBody },
      );
      console.log("Get Actions ", GetAllActionsByConversionId);
      SumOfAllAmountOfConversionActions = yield context.df.callActivity(
        "SumOfAllAmountOfConversionActions",
        { GetAllActionsByConversionId },
      );
      console.log("SUM : ", SumOfAllAmountOfConversionActions);

      const SearchOperationByConversionIdCancelled = yield context.df.callActivity(
        "SearchOperationByConversionId",
        { ConversionCreatedBody },
      );
      console.log("INFO CONVERSION", SearchOperationByConversionIdCancelled);
      const BuildDataToPushConversionCancelled = yield context.df.callActivity(
        "BuildDataToPushConversionCancelled",
        { SumOfAllAmountOfConversionActions, SearchOperationByConversionIdCancelled },
      );
      // Convertcurrencytoeuros
      console.log("FINISH TO PUSH", BuildDataToPushConversionCancelled);
      yield context.df.callActivity(
        "UpdateDataFromConversionToHubspot",
        { BuildDataToPushConversionCancelled, SearchOperationByConversionIdCancelled, string: "cancelled" }
      );
      break

    case "payment_created":
      const GetPaymentByIdFromCcy = yield context.df.callActivity(
        "GetPaymentByIdFromCcy",
        { PaymentCreatedBody },
      );
      const GetInfoBeneficiaryPayment = yield context.df.callActivity(
        "GetInfoBeneficiaryPayment",
        { GetPaymentByIdFromCcy }
      )
      const ConvertPaymentInfosToEuros = yield context.df.callActivity(
        "ConvertPaymentInfosToEuros",
        { GetPaymentByIdFromCcy, PaymentCreatedBody, GetInfoBeneficiaryPayment },
      );
      const SearchOperationByPaymentIdCreated = yield context.df.callActivity(
        "CreatePaymentOperationCreationToHubspot",
        { ConvertPaymentInfosToEuros }
      );
      yield context.df.callActivity(
        "AssociateCompanyToOperation",
        { ConvertPaymentInfosToEuros, SearchOperationByPaymentIdCreated, string: "payment" } // A CHANGER VOIR PAYMENT
      );
      break

    case "payment_updated":
      const GetInfoHubspotFromOpertaionByPaymentidUpdated = yield context.df.callActivity(
        "GetInfoHubspotFromOpertaionByPaymentid",
        { PaymentCreatedBody },
      );
      const BuildDataToPushPaymentUpdated = yield context.df.callActivity(
        "BuildDataToPushPaymentUpdated",
        { GetInfoHubspotFromOpertaionByPaymentidUpdated },
      );
      yield context.df.callActivity(
        "PushToHubspotByPaymentId",
        { BuildDataToPushPaymentUpdated, GetInfoHubspotFromOpertaionByPaymentidUpdated, string: "updated" },
      );
      break

    case "payment_completed":
      const GetInfoHubspotFromOperationByPaymentidCompleted = yield context.df.callActivity(
        "GetInfoHubspotFromOpertaionByPaymentid",
        { PaymentCreatedBody },
      );
      const BuildDataToPushPaymentCompleted = yield context.df.callActivity(
        "BuildDataToPushPaymentCompleted",
        { GetInfoHubspotFromOperationByPaymentidCompleted },
      );
      yield context.df.callActivity(
        "PushToHubspotByPaymentId",
        { BuildDataToPushPaymentCompleted, GetInfoHubspotFromOperationByPaymentidCompleted, string: "completed" },
      );
      break

    case "payment_cancelled":
      const GetInfoHubspotFromOperationByPaymentidCancelled = yield context.df.callActivity(
        "GetInfoHubspotFromOpertaionByPaymentid",
        { PaymentCreatedBody },
      );
      const BuildDataToPushPaymentCancelled = yield context.df.callActivity(
        "BuildDataToPushPaymentCancelled",
        { GetInfoHubspotFromOperationByPaymentidCancelled },
      );
      yield context.df.callActivity(
        "PushToHubspotByPaymentId",
        { BuildDataToPushPaymentCancelled, GetInfoHubspotFromOperationByPaymentidCancelled, string: "cancelled" },
      );
      break

    default:
      break;
  }
});

export default orchestrator;
