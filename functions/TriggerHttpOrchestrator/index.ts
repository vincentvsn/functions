import { AzureFunction, Context, HttpRequest } from "@azure/functions";
import * as df from "durable-functions";

const httpStart: AzureFunction = async function (
  context: Context,
  req: HttpRequest
): Promise<any> {
  const organizationId = req.query.organizationId as string;
  const eventName = req.query.eventName as string;
  const functionName = req.params.functionName as string;

  if (!organizationId || !eventName || functionName !== "event") {
    context.res = {
      status: 400,
      body: "Both 'organizationId' and 'eventName' parameters are required.",
    };
    throw new Error("ERROR");
  }

  const client = df.getClient(context);
  const instanceId = await client.startNew(functionName, undefined, {
    organizationId,
    eventName,
  });

  return client.createCheckStatusResponse(context.bindingData.req, instanceId);
};

export default httpStart;
