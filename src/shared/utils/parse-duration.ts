/**
 * Converte strings de duração usadas em JWT (ex.: "7d", "15m") em milissegundos.
 * Suporta apenas os formatos usados neste projeto.
 */
export function parseDurationToMs(duration: string): number {
  const match = /^(\d+)([smhd])$/.exec(duration.trim());
  if (!match) {
    throw new Error(`Formato de duração inválido: ${duration}`);
  }

  const value = Number(match[1]);
  const unit = match[2];

  const multipliers: Record<string, number> = {
    s: 1_000,
    m: 60_000,
    h: 3_600_000,
    d: 86_400_000,
  };

  return value * multipliers[unit];
}
