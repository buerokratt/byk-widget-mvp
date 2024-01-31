import http from "./http-service";
import { RUUTER_ENDPOINTS } from "../constants";
import { WidgetConfigResponse } from "../model/widget-config-response-model";

class WidgetService {
  authenticateUser(): Promise<WidgetConfigResponse> {
    return http.get(RUUTER_ENDPOINTS.AUTHENTICATE_USER);
  }
}

export default new WidgetService();
