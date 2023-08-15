import { AzureFunction, Context, HttpRequest } from "@azure/functions";
import axios from 'axios';

interface Transaction {
  account_id: string;
  contact_id: string;
  event_account_id: string;
  event_contact_id: string;
  conversion_id: string;
  event_type: string;
  amount: string;
  currency: string;
  notes: string;
  event_date_time: string;
}

export interface GetConversionCreationByIdFromCcy {
 CurrencyToTransform: string;
}

const activityFunction: AzureFunction = async function (context: Context) {
  const AllActionsFromConversionId: Transaction[] = context.bindingData.data.getAllActionsByConversionId;
  return await SumOfAllAmountOfConversionActions(AllActionsFromConversionId);
};

async function SumOfAllAmountOfConversionActions(AllActionsFromConversionId: Transaction[]) {
  let totalAmount = 0;
  for (const transaction of AllActionsFromConversionId) {
      totalAmount += parseFloat(transaction.amount);
  }
  return totalAmount;
}

export default activityFunction;
