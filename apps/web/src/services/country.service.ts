
import type { Country, CountrySyncResponse } from "@/types";
const BACKEND_API_URL = "http://localhost:8080";

export class CountryService {
  static async getAllCountries(): Promise<Country[]> {
    try {
      const response = await fetch(`${BACKEND_API_URL}/api/country`);

      if (!response.ok) {
        throw new Error(`Failed to fetch countries: ${response.statusText}`);
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error("Error fetching countries from backend:", error);
      throw error;
    }
  }

  static async getCountryById(id: string): Promise<Country> {
    try {
      const response = await fetch(`${BACKEND_API_URL}/api/country/${id}`);

      if (!response.ok) {
        throw new Error(`Failed to fetch country: ${response.statusText}`);
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error(`Error fetching country with ID ${id}:`, error);
      throw error;
    }
  }

  static async triggerManualSync(): Promise<CountrySyncResponse> {
    try {
      const response = await fetch(`${BACKEND_API_URL}/api/country/sync`, {
        method: "POST",
      });

      if (!response.ok) {
        throw new Error(`Failed to trigger sync: ${response.statusText}`);
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error("Error triggering manual sync:", error);
      throw error;
    }
  }
}
