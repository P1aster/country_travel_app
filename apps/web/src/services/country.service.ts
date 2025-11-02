import type {
  CountryBasic,
  CountryDetailed,
  CountrySyncResponse,
} from "@/types";
import { axiosInstance } from "@/api/axios-instance";

export class CountryService {
  static async getAllCountries(): Promise<CountryBasic[]> {
    try {
      const response = await axiosInstance.get<CountryBasic[]>("/api/country");
      return response.data;
    } catch (error) {
      console.error("Error fetching countries from backend:", error);
      throw error;
    }
  }

  static async getCountryById(id: string): Promise<CountryDetailed> {
    try {
      const response = await axiosInstance.get<CountryDetailed>(
        `/api/country/${id}`,
      );
      return response.data;
    } catch (error) {
      console.error(`Error fetching country with ID ${id}:`, error);
      throw error;
    }
  }

  static async triggerManualSync(): Promise<CountrySyncResponse> {
    try {
      const response =
        await axiosInstance.post<CountrySyncResponse>("/api/country/sync");
      return response.data;
    } catch (error) {
      console.error("Error triggering manual sync:", error);
      throw error;
    }
  }
}
