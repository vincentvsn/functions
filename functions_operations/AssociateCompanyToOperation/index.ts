import { AzureFunction, Context, HttpRequest } from "@azure/functions";

const hubspot = require('@hubspot/api-client');

const hubspotClient = new hubspot.Client({ "accessToken": "pat-eu1-7b7968a5-d9f4-4960-8113-496d0a78624f" });

interface InputAssociateCompanyOperation {
  objectTypeOperation: string;
  idOperation: string;
  objectTypeCompany: string;
  idCompany: string;
  associationType: string;
}

const activityFunction: AzureFunction = async function (context: Context): Promise<void> {
  let idOperation: string;
  let idCompany: string;
  if (context.bindingData.string === "conversion") {
    idOperation = context.bindingData.searchOperationByConversionIdCreated.id;
    idCompany = context.bindingData.searchOperationByConversionIdCreated.company_id;
  } else {
    idOperation = context.bindingData.searchOperationByPaymentIdCreated.id;
    idCompany = context.bindingData.convertPaymentInfosToEuros.company_id;
  }
  const ObjectCreate: InputAssociateCompanyOperation = await CreateObjectToAssociate(idOperation, idCompany);
  console.log(ObjectCreate);
  return await AssociateCompanyToOperation(ObjectCreate)
};

async function CreateObjectToAssociate(idOperation: string, idCompany: string) {
  const InputAssociation = {
    objectTypeOperation: "2-116564448",
    idOperation: idOperation,
    objectTypeCompany: "company",
    idCompany: idCompany,
    associationType: "a",
  }
  return InputAssociation;
}

async function AssociateCompanyToOperation(InputAssociateCompanyOperation: InputAssociateCompanyOperation): Promise<void> {
  try {
    const apiResponse = await hubspotClient.crm.objects.associationsApi.create(
      InputAssociateCompanyOperation.objectTypeOperation,
      InputAssociateCompanyOperation.idOperation,
      InputAssociateCompanyOperation.objectTypeCompany,
      InputAssociateCompanyOperation.idCompany,
      InputAssociateCompanyOperation.associationType
    );
    console.log(JSON.stringify(apiResponse, null, 2));
  } catch (e) {
    e.message === 'HTTP request failed'
      ? console.error(JSON.stringify(e.response, null, 2))
      : console.error(e)
  }
}

export default activityFunction;
