import { AzureFunction, Context, HttpRequest } from "@azure/functions";
import axios from 'axios';

const activityFunction: AzureFunction = async function (context: Context) {
  return await GetTokenLoginAPICCloud();
};

async function GetTokenLoginAPICCloud(): Promise<string> {
  const apiKey = '8f6568f36d852eb44e876fa82935429a9666393b4a1a4bf3af6e91b761d42b31';
  const loginId = 'tech@keewe.eu';
  const baseUrl = 'https://devapi.currencycloud.com/v2/authenticate/api';

  const requestData = {
    "login_id": loginId,
    "api_key": apiKey
  };

  try {
    const response = await axios.post(baseUrl, requestData);
    const token = response.data.auth_token;
    return token;
  } catch (error) {
    console.error('Error generating token:', error.message);
    throw error;
  }
}

export default activityFunction;
