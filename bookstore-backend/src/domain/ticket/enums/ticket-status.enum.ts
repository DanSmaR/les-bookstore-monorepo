/**
 * Status do cupom
 *
 * ACTIVE: Cupom válido e disponível para uso
 * USED: Cupom já foi utilizado (uso único global)
 * EXPIRED: Cupom desativado manualmente ou passou da data de validade
 *
 * Comportamento por tipo:
 * - Cupons de TROCA (exchange): Uso ÚNICO GLOBAL. Marcados como USED após pagamento.
 *   Se sobrar valor, um NOVO cupom é gerado (RN0036).
 *
 * - Cupons PROMOCIONAIS PESSOAIS (owner_id != NULL): Uso ÚNICO GLOBAL.
 *   Marcados como USED após pagamento.
 *
 * - Cupons PROMOCIONAIS PÚBLICOS (owner_id = NULL): Uso ÚNICO POR USUÁRIO.
 *   Permanecem ACTIVE, mas rastreados em tb_used_tickets por usuário.
 *   Admin pode desativar manualmente alterando status para EXPIRED.
 */
export enum TicketStatus {
  ACTIVE = 'active',
  USED = 'used',
  EXPIRED = 'expired',
}
