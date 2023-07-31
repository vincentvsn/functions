import { AzureFunction, Context, HttpRequest } from "@azure/functions";
import axios from "axios";

const API_KEY = ""; // To replace

interface CompanyData {
  last_connection: string;
  number_of_connections: string;
  last_download: string;
}

const activityFunction: AzureFunction = async function (context: Context): Promise<void> {
  try {
    const company: CompanyData = context.bindings.name.hubspotCompaniesWithoutKeeweId;
    const eventName: string = context.bindings.name.eventName;
    
    console.log("Hubspot2 : ", context.bindings.name.hubspotCompaniesWithoutKeeweId);
    if (company && eventName) {
      await ListOrganizationFromKeewe(company, eventName);
    } else {
      console.error("Invalid data received. Unable to update company.");
    }
  } catch (error) {
    console.error("Error processing data:", error);
    throw error;
  }
};

async function ListOrganizationFromKeewe(company: CompanyData, eventName: string): Promise<void> {
  try {
    if (!company || company[0].length === 0) {
      throw new Error('Invalid company data.');
    }
    const url = `https://api.hubapi.com/companies/v2/companies/${company[0].id}`;

    const headers = {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${API_KEY}`
    };

    let define_event = "\0";
    let define_number = "\0";
    let nb_connections = 0;
    if (eventName == "connection") {
      define_event = "last_connection";
      define_number = "number_of_connections"
      nb_connections = company[0].properties.number_of_connections;
    } else if (eventName == "download-certificate") {
      define_event = "last_download";
      define_number = "number_of_download"
      nb_connections = company[0].properties.number_of_download;
    }
    if (nb_connections === undefined) {
      nb_connections = 0;
    }

    const options_date = {
      day: '2-digit' as const,
      month: '2-digit' as const,
      year: '2-digit' as const,
      hour: '2-digit' as const,
      minute: '2-digit' as const,
      second: '2-digit' as const,
      hour12: false,
    };

    const string_to_convert_date = new Date().toLocaleString(undefined, options_date);
    const date = new Date(string_to_convert_date);

    const options: Intl.DateTimeFormatOptions = {
      year: '2-digit' as const,
      month: '2-digit' as const,
      day: '2-digit' as const,
      hour: '2-digit' as const,
      minute: '2-digit' as const,
      second: '2-digit' as const,
      hour12: false,
    };

    const update_connection = date.toLocaleDateString("fr-FR", options);

    nb_connections++;
    const data = {
      properties: [
        {
          name: define_number,
          value: nb_connections
        },
        {
          name: define_event,
          value: update_connection
        }
      ]
    };
    
    console.log("Request Payload:", data);

    const response = await axios.put(url, data, { headers });

    console.log("Updated company properties:", response.data);

    } catch (error) {
      console.error("Error:", error.message);
      console.error("Error Details:", error.response.data);
  }
}

export default activityFunction;
