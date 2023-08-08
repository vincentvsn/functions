import { AzureFunction, Context, HttpRequest } from "@azure/functions";
import axios from "axios";

const API_KEY = "pat-eu1-7b7968a5-d9f4-4960-8113-496d0a78624f";

interface CompanyProperties {
  createdate: string;
  hs_lastmodifieddate: string;
  hs_object_id: string;
  last_connection: string;
  last_download: string;
  number_of_connections: string;
  number_of_download: string;
}

interface Company {
  id: string;
  properties: CompanyProperties;
  createdAt: string;
  updateAt: string;
  archived: boolean;
}

enum Steps {
  SCRAPPING = 1,
  CONTACT,
  CLIENT,
  ONBOARDED,
}

enum EventsEnum {
  CONNECTION = 'connection',
  DOWNLOAD = 'download-certificate'
}

const fields = {
  [EventsEnum.CONNECTION]: { dateFieldName: 'last_connection', valueFieldName: 'number_of_connections' },
  [EventsEnum.DOWNLOAD]: { dateFieldName: 'last_download', valueFieldName: 'number_of_download' },
}

const activityFunction: AzureFunction = async function (context: Context): Promise<void> {
  try {
    const [company]: Company[] = context.bindings.name.hubspotCompaniesWithoutKeeweId;
    const event: EventsEnum = context.bindings.name.eventName;

    if (!company || (event !== EventsEnum.CONNECTION && event !== EventsEnum.DOWNLOAD)) {
      throw new Error("Invalid data received. Unable to update company.");
    }

    await ListOrganizationFromKeewe(company, event);
  } catch (error) {
    console.error("Error processing data:", error);
  }
};

async function ListOrganizationFromKeewe(company: Company, event: EventsEnum): Promise<void> {
  try {
    const url = `https://api.hubapi.com/companies/v2/companies/${company.id}`;

    const headers = {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${API_KEY}`
    };

    let nb_connections = 0;

    if (event === EventsEnum.CONNECTION) {
      nb_connections = (Number(company.properties.number_of_connections) || 0) + 1;

    } else if (event === EventsEnum.DOWNLOAD) {
      nb_connections = (Number(company.properties.number_of_download) || 0) + 1;
    }

    const date = new Date();
    const update_connection = date.toLocaleString('fr-FR');

    const data = {
      properties: [
        {
          name: fields[event].valueFieldName,
          value: nb_connections
        },
        {
          name: fields[event].dateFieldName,
          value: update_connection
        }
      ]
    };

    await axios.put(url, data, { headers });

  } catch (error) {
    console.error("Error:", error.message);
    console.error("Error Details:", error.response.data);
  }
}

export default activityFunction;
