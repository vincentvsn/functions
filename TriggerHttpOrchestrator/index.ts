﻿import { AzureFunction, Context, HttpRequest } from "@azure/functions";
import * as df from "durable-functions";

const httpStart: AzureFunction = async function (
  context: Context,
  req: HttpRequest
): Promise<any> {
  const client = df.getClient(context);
  const instanceId = await client.startNew(
    req.params.functionName,
    undefined,
    req.body
  );

  return client.createCheckStatusResponse(context.bindingData.req, instanceId);
};

export default httpStart;
