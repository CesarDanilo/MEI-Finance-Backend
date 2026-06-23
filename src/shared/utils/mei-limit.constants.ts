import { getEnv } from "../../config/env";

/** Limite anual de faturamento MEI — valor definido por legislação, configurável via env. */
export function getMeiAnnualLimit(): number {
  return getEnv().MEI_ANNUAL_LIMIT;
}

/** Percentual a partir do qual o backend sinaliza alerta (padrão 80%). */
export function getMeiAlertThresholdPercent(): number {
  return getEnv().MEI_ALERT_THRESHOLD_PERCENT;
}
