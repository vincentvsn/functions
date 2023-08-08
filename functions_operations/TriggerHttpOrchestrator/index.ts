import { AzureFunction, Context, HttpRequest } from "@azure/functions";
import * as df from "durable-functions";

const httpStart: AzureFunction = async function (
  context: Context,
  req: HttpRequest
): Promise<any> {

  const eventName = req.query.eventName as string;
  const functionName = req.params.functionName as string;

  if (!eventName || functionName !== "event") {
    context.res = {
      status: 400,
      body: "Both 'eventName' and 'functionName' parameters are required.",
    };
    throw new Error("ERROR");
  }

  const client = df.getClient(context);
  const instanceId = await client.startNew("event", undefined, {
    eventName,
  });

  return client.createCheckStatusResponse(context.bindingData.req, instanceId);
};

export default httpStart;

