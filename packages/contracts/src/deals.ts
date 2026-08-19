import { z } from "zod";

export const companySizeSchema = z.enum([
  "1_10",
  "11_50",
  "51_200",
  "201_500",
  "500_plus",
]);

export const serviceTypeSchema = z.enum([
  "group_training",
  "online_coaching",
  "ax_build",
  "change_management",
]);

export const dealStageSchema = z.enum([
  "new",
  "discovery",
  "follow_up",
  "proposal",
  "contract",
  "on_hold",
  "closed",
]);

export const dealStatusSchema = z.enum([
  "unreviewed",
  "first_contact_pending",
  "customer_response_pending",
  "discovery_completed",
  "meeting_scheduled",
  "meeting_completed",
  "company_profile_sent",
  "sample_quote_sent",
  "proposal_response_completed",
  "seminar_scheduled",
  "formal_proposal_sent",
  "negotiating",
  "contract_sent",
  "contract_signed",
  "invoice_issued",
  "long_term_hold",
  "lost",
  "excluded",
]);

export const dealValiditySchema = z.enum(["pending", "valid", "excluded"]);

export const createDealSchema = z.object({
  source: z.object({
    system: z.enum(["manual", "emergent"]),
    id: z.string().min(1).max(200).optional(),
  }),
  receivedAt: z.iso.datetime({ offset: true }),
  companyName: z.string().trim().min(1).max(200),
  companySize: companySizeSchema,
  contactName: z.string().trim().min(1).max(100),
  contactTitle: z.string().trim().max(100).optional(),
  phone: z.string().trim().min(7).max(30),
  email: z.email().max(254),
  customerNote: z.string().trim().max(5000).optional(),
  ownerId: z.uuid().optional(),
  services: z.array(serviceTypeSchema).max(4).default([]),
});

export const nextActionTypeSchema = z.enum([
  "call",
  "message",
  "meeting",
  "send_profile",
  "send_sample_quote",
  "send_proposal",
  "schedule_seminar",
  "other",
]);

export const nextActionInputSchema = z.object({
  type: nextActionTypeSchema,
  title: z.string().trim().min(1).max(200),
  dueAt: z.iso.datetime({ offset: true }),
  assigneeId: z.uuid().optional(),
  note: z.string().trim().max(2000).optional(),
});

export const nextActionSchema = z.object({
  id: z.string().min(1),
  type: nextActionTypeSchema,
  title: z.string(),
  dueAt: z.iso.datetime({ offset: true }),
  assigneeId: z.uuid().nullable(),
  note: z.string().nullable(),
  completedAt: z.iso.datetime({ offset: true }).nullable(),
});

export const completeFirstContactSchema = z.object({
  outcome: z.enum(["connected", "message_left"]),
  occurredAt: z.iso.datetime({ offset: true }),
  summary: z.string().trim().max(5000).optional(),
  actorId: z.uuid().optional(),
  nextAction: nextActionInputSchema.optional(),
});

export const dealSchema = z.object({
  id: z.uuid(),
  sourceSystem: z.enum(["manual", "emergent"]),
  sourceId: z.string().nullable(),
  receivedAt: z.iso.datetime({ offset: true }),
  companyId: z.uuid(),
  companyName: z.string(),
  companySize: companySizeSchema,
  contactName: z.string(),
  contactTitle: z.string().nullable(),
  phone: z.string(),
  email: z.email(),
  customerNote: z.string().nullable(),
  ownerId: z.uuid().nullable(),
  services: z.array(serviceTypeSchema),
  stage: dealStageSchema,
  status: dealStatusSchema,
  validity: dealValiditySchema,
  contactDeadlineAt: z.iso.datetime({ offset: true }),
  firstContactCompletedAt: z.iso.datetime({ offset: true }).nullable(),
  nextActions: z.array(nextActionSchema).default([]),
  createdAt: z.iso.datetime({ offset: true }),
  updatedAt: z.iso.datetime({ offset: true }),
});

export const dealListSchema = z.object({
  data: z.array(dealSchema),
  meta: z.object({ nextCursor: z.string().nullable() }),
});

export type CompanySize = z.infer<typeof companySizeSchema>;
export type ServiceType = z.infer<typeof serviceTypeSchema>;
export type DealStage = z.infer<typeof dealStageSchema>;
export type DealStatus = z.infer<typeof dealStatusSchema>;
export type DealValidity = z.infer<typeof dealValiditySchema>;
export type NextActionType = z.infer<typeof nextActionTypeSchema>;
export type NextAction = z.infer<typeof nextActionSchema>;
export type CreateDealInput = z.infer<typeof createDealSchema>;
export type CompleteFirstContactInput = z.infer<typeof completeFirstContactSchema>;
export type Deal = z.infer<typeof dealSchema>;
export type DealList = z.infer<typeof dealListSchema>;
