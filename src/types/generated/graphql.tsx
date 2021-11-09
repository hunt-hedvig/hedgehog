import gql from 'graphql-tag'
import * as ApolloReactCommon from '@apollo/client'
import * as ApolloReactHooks from '@apollo/client'
export type Maybe<T> = T | null
export type Exact<T extends { [key: string]: unknown }> = {
  [K in keyof T]: T[K]
}
export type MakeOptional<T, K extends keyof T> = Omit<T, K> &
  { [SubKey in K]?: Maybe<T[SubKey]> }
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> &
  { [SubKey in K]: Maybe<T[SubKey]> }
const defaultOptions = {}
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: string
  String: string
  Boolean: boolean
  Int: number
  Float: number
  LocalDate: any
  Instant: any
  YearMonth: any
  MonetaryAmount: any
  URL: any
  LocalDateTime: any
  JSON: any
  BigDecimal: any
  ZonedDateTime: any
  LocalTime: any
}

export type Account = {
  __typename?: 'Account'
  id: Scalars['ID']
  currentBalance: MonetaryAmountV2
  totalBalance: MonetaryAmountV2
  chargeEstimation: AccountChargeEstimation
  entries: Array<AccountEntry>
  monthlyEntries: Array<MonthlyEntry>
}

export type AccountChargeEstimation = {
  __typename?: 'AccountChargeEstimation'
  subscription: MonetaryAmountV2
  discount: MonetaryAmountV2
  charge: MonetaryAmountV2
  discountCodes: Array<Scalars['String']>
}

export type AccountEntry = {
  __typename?: 'AccountEntry'
  id: Scalars['ID']
  type: Scalars['String']
  amount: MonetaryAmountV2
  fromDate: Scalars['LocalDate']
  reference: Scalars['String']
  source: Scalars['String']
  title?: Maybe<Scalars['String']>
  comment?: Maybe<Scalars['String']>
  failedAt?: Maybe<Scalars['Instant']>
  chargedAt?: Maybe<Scalars['Instant']>
}

export type AccountEntryInput = {
  type: Scalars['String']
  amount: Scalars['MonetaryAmount']
  fromDate: Scalars['LocalDate']
  reference: Scalars['String']
  source: Scalars['String']
  title?: Maybe<Scalars['String']>
  comment?: Maybe<Scalars['String']>
}

export type ActivatePendingAgreementInput = {
  pendingAgreementId: Scalars['ID']
  fromDate: Scalars['LocalDate']
}

export type Address = {
  __typename?: 'Address'
  street: Scalars['String']
  postalCode: Scalars['String']
  city?: Maybe<Scalars['String']>
}

export enum AgreementStatus {
  Pending = 'PENDING',
  ActiveInFuture = 'ACTIVE_IN_FUTURE',
  Active = 'ACTIVE',
  ActiveInPast = 'ACTIVE_IN_PAST',
  Terminated = 'TERMINATED',
}

export type AssignVoucherFreeMonths = {
  partnerId: Scalars['String']
  numberOfFreeMonths: Scalars['Int']
  code: Scalars['String']
  validFrom?: Maybe<Scalars['Instant']>
  validUntil?: Maybe<Scalars['Instant']>
  codeType?: Maybe<Scalars['String']>
}

export type AssignVoucherNoDiscount = {
  partnerId: Scalars['String']
  code: Scalars['String']
  validFrom?: Maybe<Scalars['Instant']>
  validUntil?: Maybe<Scalars['Instant']>
  codeType?: Maybe<Scalars['String']>
}

export type AssignVoucherPercentageDiscount = {
  partnerId: Scalars['String']
  numberOfMonths: Scalars['Int']
  percentageDiscount: Scalars['Float']
  code: Scalars['String']
  validFrom?: Maybe<Scalars['Instant']>
  validUntil?: Maybe<Scalars['Instant']>
  codeType?: Maybe<Scalars['String']>
}

export type AssignVoucherVisibleNoDiscount = {
  partnerId: Scalars['String']
  code: Scalars['String']
  validFrom?: Maybe<Scalars['Instant']>
  validUntil?: Maybe<Scalars['Instant']>
  codeType?: Maybe<Scalars['String']>
}

export type CampaignFilter = {
  code?: Maybe<Scalars['String']>
  partnerId?: Maybe<Scalars['String']>
  activeFrom?: Maybe<Scalars['LocalDate']>
  activeTo?: Maybe<Scalars['LocalDate']>
}

export type CampaignOwnerPartner = {
  __typename?: 'CampaignOwnerPartner'
  partnerId: Scalars['String']
}

export type ChangeFromDateInput = {
  newFromDate: Scalars['LocalDate']
}

export type ChangeTerminationDateInput = {
  newTerminationDate: Scalars['LocalDate']
}

export type ChangeToDateInput = {
  newToDate: Scalars['LocalDate']
}

export enum ChargeStatus {
  Initiated = 'INITIATED',
  WaitingForSubscription = 'WAITING_FOR_SUBSCRIPTION',
  SchedulingSubscription = 'SCHEDULING_SUBSCRIPTION',
  ScheduleSubscriptionFailed = 'SCHEDULE_SUBSCRIPTION_FAILED',
  SubscriptionScheduledAndWaitingForApproval = 'SUBSCRIPTION_SCHEDULED_AND_WAITING_FOR_APPROVAL',
  ApprovedForCharge = 'APPROVED_FOR_CHARGE',
  SchedulingCharge = 'SCHEDULING_CHARGE',
  ChargeRequesting = 'CHARGE_REQUESTING',
  ChargeRequestFailed = 'CHARGE_REQUEST_FAILED',
  ChargeInitiated = 'CHARGE_INITIATED',
  ChargeFailed = 'CHARGE_FAILED',
  ChargeCompleted = 'CHARGE_COMPLETED',
}

export type ChatMessage = {
  __typename?: 'ChatMessage'
  globalId: Scalars['ID']
  author?: Maybe<Scalars['String']>
  fromId: Scalars['String']
  timestamp?: Maybe<Scalars['Instant']>
  messageBodyJsonString: Scalars['String']
}

export type Claim = {
  __typename?: 'Claim'
  id: Scalars['ID']
  member: Member
  recordingUrl?: Maybe<Scalars['String']>
  state: ClaimState
  claimType?: Maybe<Scalars['String']>
  dateOfOccurrence?: Maybe<Scalars['LocalDate']>
  outcome?: Maybe<Scalars['String']>
  reserves?: Maybe<Scalars['MonetaryAmount']>
  registrationDate: Scalars['Instant']
  notes: Array<ClaimNote>
  transcriptions: Array<ClaimTranscription>
  payments: Array<ClaimPayment>
  events: Array<ClaimEvent>
  coveringEmployee: Scalars['Boolean']
  claimFiles: Array<ClaimFileUpload>
  contract?: Maybe<Contract>
  agreement?: Maybe<GenericAgreement>
  propertySelections: Array<ClaimPropertySelection>
  coInsured?: Maybe<CoInsured>
  restriction?: Maybe<ResourceAccessInformation>
}

export enum ClaimComplexity {
  Simple = 'SIMPLE',
  Complex = 'COMPLEX',
}

export type ClaimEvent = {
  __typename?: 'ClaimEvent'
  text?: Maybe<Scalars['String']>
  date?: Maybe<Scalars['Instant']>
}

export type ClaimFileUpload = {
  __typename?: 'ClaimFileUpload'
  claimFileId?: Maybe<Scalars['ID']>
  fileUploadUrl?: Maybe<Scalars['URL']>
  uploadedAt?: Maybe<Scalars['Instant']>
  claimId?: Maybe<Scalars['ID']>
  category?: Maybe<Scalars['String']>
  contentType?: Maybe<Scalars['String']>
}

export type ClaimNote = {
  __typename?: 'ClaimNote'
  text: Scalars['String']
  date: Scalars['LocalDateTime']
  handlerReference?: Maybe<Scalars['String']>
}

export type ClaimNoteInput = {
  text: Scalars['String']
}

export type ClaimPayment = {
  __typename?: 'ClaimPayment'
  id?: Maybe<Scalars['String']>
  amount?: Maybe<Scalars['MonetaryAmount']>
  deductible?: Maybe<Scalars['MonetaryAmount']>
  note?: Maybe<Scalars['String']>
  type?: Maybe<ClaimPaymentType>
  timestamp?: Maybe<Scalars['Instant']>
  exGratia?: Maybe<Scalars['Boolean']>
  transaction?: Maybe<Transaction>
  status?: Maybe<ClaimPaymentStatus>
}

export type ClaimPaymentInput = {
  amount: Scalars['MonetaryAmount']
  deductible: Scalars['MonetaryAmount']
  note: Scalars['String']
  type: ClaimPaymentType
  exGratia: Scalars['Boolean']
  sanctionListSkipped: Scalars['Boolean']
  carrier: Scalars['String']
}

export enum ClaimPaymentStatus {
  Prepared = 'PREPARED',
  Initiated = 'INITIATED',
  SanctionListHit = 'SANCTION_LIST_HIT',
  Completed = 'COMPLETED',
  Failed = 'FAILED',
}

export enum ClaimPaymentType {
  Manual = 'Manual',
  Automatic = 'Automatic',
  IndemnityCost = 'IndemnityCost',
  Expense = 'Expense',
}

export type ClaimProperty = {
  __typename?: 'ClaimProperty'
  id: Scalars['ID']
  name: Scalars['String']
}

export type ClaimPropertyOption = {
  __typename?: 'ClaimPropertyOption'
  id: Scalars['ID']
  name: Scalars['String']
}

export type ClaimPropertySelection = {
  __typename?: 'ClaimPropertySelection'
  claimType: Scalars['String']
  property: ClaimProperty
  option: ClaimPropertyOption
}

export type ClaimPropertyTemplate = {
  __typename?: 'ClaimPropertyTemplate'
  propertyId: Scalars['ID']
  name: Scalars['String']
  options: Array<ClaimPropertyOption>
}

export enum ClaimSource {
  App = 'APP',
  Email = 'EMAIL',
  Intercom = 'INTERCOM',
  Phone = 'PHONE',
  Chat = 'CHAT',
}

export enum ClaimState {
  Open = 'OPEN',
  Closed = 'CLOSED',
  Reopened = 'REOPENED',
}

export type ClaimSwishPaymentInput = {
  amount: Scalars['MonetaryAmount']
  deductible: Scalars['MonetaryAmount']
  note: Scalars['String']
  exGratia: Scalars['Boolean']
  sanctionListSkipped: Scalars['Boolean']
  phoneNumber: Scalars['String']
  message: Scalars['String']
  carrier: Scalars['String']
}

export type ClaimTranscription = {
  __typename?: 'ClaimTranscription'
  text: Scalars['String']
  confidenceScore: Scalars['Float']
  languageCode: Scalars['String']
}

export type ClaimTypeRelation = {
  __typename?: 'ClaimTypeRelation'
  id: Scalars['ID']
  claimType: Scalars['String']
  property: ClaimProperty
  propertyOption: ClaimPropertyOption
}

export type ClaimTypeTemplate = {
  __typename?: 'ClaimTypeTemplate'
  claimType: Scalars['String']
  properties: Array<ClaimPropertyTemplate>
}

export type CoInsured = {
  __typename?: 'CoInsured'
  id: Scalars['ID']
  fullName: Scalars['String']
  personalNumber: Scalars['String']
  email?: Maybe<Scalars['String']>
  phoneNumber?: Maybe<Scalars['String']>
}

export type Contract = {
  __typename?: 'Contract'
  id: Scalars['ID']
  holderMemberId: Scalars['ID']
  holderFirstName?: Maybe<Scalars['String']>
  holderLastName?: Maybe<Scalars['String']>
  switchedFrom?: Maybe<Scalars['String']>
  masterInception?: Maybe<Scalars['LocalDate']>
  status: ContractStatus
  typeOfContract: Scalars['String']
  isTerminated: Scalars['Boolean']
  terminationDate?: Maybe<Scalars['LocalDate']>
  currentAgreementId: Scalars['ID']
  hasPendingAgreement: Scalars['Boolean']
  genericAgreements: Array<GenericAgreement>
  hasQueuedRenewal: Scalars['Boolean']
  renewal?: Maybe<Renewal>
  preferredCurrency: Scalars['String']
  market: Scalars['String']
  signSource?: Maybe<Scalars['String']>
  contractTypeName: Scalars['String']
  createdAt: Scalars['Instant']
  isLocked: Scalars['Boolean']
}

export type ContractMarketInfo = {
  __typename?: 'ContractMarketInfo'
  market: Scalars['String']
  preferredCurrency: Scalars['String']
}

export enum ContractStatus {
  Pending = 'PENDING',
  ActiveInFuture = 'ACTIVE_IN_FUTURE',
  ActiveInFutureAndTerminatedInFuture = 'ACTIVE_IN_FUTURE_AND_TERMINATED_IN_FUTURE',
  Active = 'ACTIVE',
  TerminatedToday = 'TERMINATED_TODAY',
  TerminatedInFuture = 'TERMINATED_IN_FUTURE',
  Terminated = 'TERMINATED',
}

export type CostDeduction = {
  __typename?: 'CostDeduction'
  amount?: Maybe<Scalars['MonetaryAmount']>
}

export type CreateClaimTypeRelationInput = {
  claimType: Scalars['String']
  propertyId: Scalars['ID']
  propertyOptionId: Scalars['ID']
}

export type CreateNorwegianGripenInput = {
  baseFactorString?: Maybe<Scalars['String']>
  factors: Array<NorwegianGripenFactorInput>
}

export type DashboardNumbers = {
  __typename?: 'DashboardNumbers'
  numberOfClaims: Scalars['Int']
  numberOfQuestions: Scalars['Int']
}

export type Debt = {
  __typename?: 'Debt'
  paymentDefaults?: Maybe<Array<Maybe<PaymentDefault>>>
  debtDate?: Maybe<Scalars['LocalDate']>
  totalAmountPublicDebt?: Maybe<Scalars['MonetaryAmount']>
  numberPublicDebts?: Maybe<Scalars['Int']>
  totalAmountPrivateDebt?: Maybe<Scalars['MonetaryAmount']>
  numberPrivateDebts?: Maybe<Scalars['Int']>
  totalAmountDebt?: Maybe<Scalars['MonetaryAmount']>
  checkedAt?: Maybe<Scalars['Instant']>
  fromDateTime?: Maybe<Scalars['LocalDateTime']>
}

export type DirectDebitStatus = {
  __typename?: 'DirectDebitStatus'
  activated?: Maybe<Scalars['Boolean']>
}

export type EdiSwitcher = {
  __typename?: 'EdiSwitcher'
  id: Scalars['ID']
  memberId: Scalars['String']
  contractId: Scalars['ID']
  switcherCompany: Scalars['String']
  cancellationRequestedAt?: Maybe<Scalars['Instant']>
  note?: Maybe<Scalars['String']>
}

export type EditMemberInfoInput = {
  memberId: Scalars['String']
  firstName?: Maybe<Scalars['String']>
  lastName?: Maybe<Scalars['String']>
  email?: Maybe<Scalars['String']>
  phoneNumber?: Maybe<Scalars['String']>
  birthDate?: Maybe<Scalars['LocalDate']>
}

export type Employee = {
  __typename?: 'Employee'
  id: Scalars['ID']
  email: Scalars['String']
  role: Scalars['String']
  firstGrantedAt: Scalars['Instant']
}

export type ExtraBuilding = {
  __typename?: 'ExtraBuilding'
  id?: Maybe<Scalars['ID']>
  type: ExtraBuildingType
  area: Scalars['Int']
  hasWaterConnected: Scalars['Boolean']
  displayName?: Maybe<Scalars['String']>
}

export enum ExtraBuildingType {
  Garage = 'GARAGE',
  Carport = 'CARPORT',
  Shed = 'SHED',
  Storehouse = 'STOREHOUSE',
  Friggebod = 'FRIGGEBOD',
  Attefall = 'ATTEFALL',
  Outhouse = 'OUTHOUSE',
  Guesthouse = 'GUESTHOUSE',
  Gazebo = 'GAZEBO',
  Greenhouse = 'GREENHOUSE',
  Sauna = 'SAUNA',
  Barn = 'BARN',
  Boathouse = 'BOATHOUSE',
  Other = 'OTHER',
}

export type FileUpload = {
  __typename?: 'FileUpload'
  fileUploadUrl?: Maybe<Scalars['URL']>
  timestamp?: Maybe<Scalars['Instant']>
  mimeType?: Maybe<Scalars['String']>
  memberId?: Maybe<Scalars['ID']>
}

export enum Flag {
  Green = 'GREEN',
  Amber = 'AMBER',
  Red = 'RED',
}

export type FreeMonths = {
  __typename?: 'FreeMonths'
  numberOfMonths?: Maybe<Scalars['Int']>
}

export enum Gender {
  Male = 'MALE',
  Female = 'FEMALE',
  Other = 'OTHER',
}

export type GenericAgreement = {
  __typename?: 'GenericAgreement'
  id: Scalars['ID']
  fromDate?: Maybe<Scalars['LocalDate']>
  toDate?: Maybe<Scalars['LocalDate']>
  premium: MonetaryAmountV2
  certificateUrl?: Maybe<Scalars['String']>
  status: AgreementStatus
  typeOfContract: Scalars['String']
  address?: Maybe<Address>
  numberCoInsured?: Maybe<Scalars['Int']>
  squareMeters?: Maybe<Scalars['Int']>
  ancillaryArea?: Maybe<Scalars['Int']>
  yearOfConstruction?: Maybe<Scalars['Int']>
  numberOfBathrooms?: Maybe<Scalars['Int']>
  extraBuildings?: Maybe<Array<ExtraBuilding>>
  isSubleted?: Maybe<Scalars['Boolean']>
  lineOfBusinessName: Scalars['String']
  carrier: Scalars['String']
  partner?: Maybe<Scalars['String']>
  createdAt: Scalars['Instant']
}

export enum GrantHolderType {
  User = 'USER',
  Role = 'ROLE',
}

export type Identity = {
  __typename?: 'Identity'
  nationalIdentification: NationalIdentification
  firstName?: Maybe<Scalars['String']>
  lastName?: Maybe<Scalars['String']>
}

export type Incentive =
  | MonthlyPercentageDiscountFixedPeriod
  | FreeMonths
  | CostDeduction
  | NoDiscount
  | IndefinitePercentageDiscount
  | VisibleNoDiscount
  | UnknownIncentive

export type IndefinitePercentageDiscount = {
  __typename?: 'IndefinitePercentageDiscount'
  percentageDiscount?: Maybe<Scalars['Float']>
}

export type ListClaimsOptions = {
  includeAll?: Maybe<Scalars['Boolean']>
  page?: Maybe<Scalars['Int']>
  pageSize?: Maybe<Scalars['Int']>
  sortBy?: Maybe<Scalars['String']>
  sortDirection?: Maybe<Scalars['String']>
  filterClaimStates?: Maybe<Array<ClaimState>>
  filterCreatedBeforeOrOnDate?: Maybe<Scalars['LocalDate']>
  filterComplexities?: Maybe<Array<ClaimComplexity>>
  filterNumberOfMemberGroups?: Maybe<Scalars['Int']>
  filterSelectedMemberGroups?: Maybe<Array<Scalars['Int']>>
  filterMarkets?: Maybe<Array<Scalars['String']>>
  filterTypesOfContract?: Maybe<Array<Scalars['String']>>
}

export type ListClaimsResult = {
  __typename?: 'ListClaimsResult'
  claims: Array<Claim>
  totalPages: Scalars['Int']
  page: Scalars['Int']
}

export type ManualRedeemCampaignInput = {
  campaignCode: Scalars['String']
  activationDate?: Maybe<Scalars['LocalDate']>
}

export type ManualUnRedeemCampaignInput = {
  campaignCode: Scalars['String']
}

export type Me = {
  __typename?: 'Me'
  scopes: Array<Scalars['String']>
  role: Scalars['String']
  user: User
  settings: Array<UserSetting>
}

export type MeSettingsArgs = {
  filters?: Maybe<UserSettingsFilter>
}

export type Member = {
  __typename?: 'Member'
  memberId: Scalars['ID']
  email?: Maybe<Scalars['String']>
  phoneNumber?: Maybe<Scalars['String']>
  firstName?: Maybe<Scalars['String']>
  lastName?: Maybe<Scalars['String']>
  personalNumber?: Maybe<Scalars['String']>
  birthDate?: Maybe<Scalars['LocalDate']>
  gender?: Maybe<Gender>
  fraudulentStatus?: Maybe<Scalars['String']>
  fraudulentStatusDescription?: Maybe<Scalars['String']>
  createdOn?: Maybe<Scalars['Instant']>
  signedOn?: Maybe<Scalars['Instant']>
  status?: Maybe<Scalars['String']>
  transactions?: Maybe<Array<Maybe<Transaction>>>
  directDebitStatus?: Maybe<DirectDebitStatus>
  payoutMethodStatus?: Maybe<PayoutMethodStatus>
  monthlySubscription?: Maybe<MonthlySubscription>
  sanctionStatus?: Maybe<SanctionStatus>
  account?: Maybe<Account>
  fileUploads: Array<FileUpload>
  person?: Maybe<Person>
  numberFailedCharges?: Maybe<NumberFailedCharges>
  totalNumberOfClaims: Scalars['Int']
  quotes: Array<Quote>
  contracts: Array<Contract>
  claims: Array<Claim>
  contractMarketInfo?: Maybe<ContractMarketInfo>
  pickedLocale?: Maybe<Scalars['String']>
  referralInformation?: Maybe<ReferralInformation>
  identity?: Maybe<Identity>
  trials: Array<Trial>
}

export type MemberMonthlySubscriptionArgs = {
  month: Scalars['YearMonth']
}

export type MemberClaimsArgs = {
  filterByStates?: Maybe<Array<ClaimState>>
}

export type MemberChargeApproval = {
  memberId: Scalars['ID']
  amount: Scalars['MonetaryAmount']
}

export type MemberFraudulentStatusInput = {
  fraudulentStatus: Scalars['String']
  fraudulentStatusDescription?: Maybe<Scalars['String']>
}

export type MemberReferral = {
  __typename?: 'MemberReferral'
  memberId: Scalars['String']
  name?: Maybe<Scalars['String']>
  status: Scalars['String']
  incentive: Incentive
}

export type MemberSearchOptions = {
  includeAll?: Maybe<Scalars['Boolean']>
  page?: Maybe<Scalars['Int']>
  pageSize?: Maybe<Scalars['Int']>
  sortBy?: Maybe<Scalars['String']>
  sortDirection?: Maybe<Scalars['String']>
}

export type MemberSearchResult = {
  __typename?: 'MemberSearchResult'
  members: Array<Member>
  totalPages: Scalars['Int']
  page: Scalars['Int']
}

export type MonetaryAmountV2 = {
  __typename?: 'MonetaryAmountV2'
  amount: Scalars['String']
  currency: Scalars['String']
}

export type MonthlyEntry = {
  __typename?: 'MonthlyEntry'
  id: Scalars['ID']
  externalId?: Maybe<Scalars['String']>
  amount: MonetaryAmountV2
  type: Scalars['String']
  source: Scalars['String']
  addedBy: Scalars['String']
  addedAt: Scalars['Instant']
  title: Scalars['String']
  comment: Scalars['String']
}

export type MonthlyEntryInput = {
  externalId?: Maybe<Scalars['String']>
  amount: Scalars['MonetaryAmount']
  type: Scalars['String']
  source: Scalars['String']
  title: Scalars['String']
  comment: Scalars['String']
}

export type MonthlyPercentageDiscountFixedPeriod = {
  __typename?: 'MonthlyPercentageDiscountFixedPeriod'
  numberOfMonths?: Maybe<Scalars['Int']>
  percentage?: Maybe<Scalars['Float']>
}

export type MonthlySubscription = {
  __typename?: 'MonthlySubscription'
  amount?: Maybe<Scalars['MonetaryAmount']>
  member?: Maybe<Member>
}

export type MutationType = {
  __typename?: 'MutationType'
  chargeMember?: Maybe<Member>
  addAccountEntryToMember: Member
  addMonthlyEntryToMember: Member
  removeMonthlyEntry?: Maybe<Scalars['Boolean']>
  approveMemberCharge?: Maybe<Scalars['Boolean']>
  createPaymentCompletionLink: PaymentCompletionResponse
  updateClaimState?: Maybe<Claim>
  createClaim?: Maybe<Claim>
  addClaimNote?: Maybe<Claim>
  createClaimPayment?: Maybe<Claim>
  createClaimSwishPayment?: Maybe<Claim>
  setClaimType?: Maybe<Claim>
  setClaimOutcome?: Maybe<Claim>
  setClaimPropertySelection?: Maybe<Claim>
  setDateOfOccurrence?: Maybe<Claim>
  updateReserve?: Maybe<Claim>
  setCoveringEmployee?: Maybe<Claim>
  whitelistMember: Member
  markClaimFileAsDeleted?: Maybe<Scalars['Boolean']>
  backfillSubscriptions: Member
  setClaimFileCategory?: Maybe<ClaimFileUpload>
  activateQuote: Quote
  addAgreementFromQuote: Quote
  createQuoteFromAgreement: Quote
  markSwitchableSwitcherEmailAsReminded: SwitchableSwitcherEmail
  updateSwitcherEmailInfo: SwitchableSwitcherEmail
  updateEdiSwitcherNote: EdiSwitcher
  terminateContract: Contract
  activatePendingAgreement: Contract
  changeTerminationDate: Contract
  revertTermination: Contract
  createNorwegianGripenPriceEngine: Scalars['Boolean']
  addNorwegianPostalCodes: Scalars['Boolean']
  changeToDate: Contract
  changeFromDate: Contract
  safelyEdit: Contract
  regenerateCertificate: Contract
  sendMessage: SendMessageResponse
  markQuestionAsResolved: Scalars['Boolean']
  answerQuestion: Scalars['Boolean']
  updateQuoteBySchema: Quote
  createQuoteForMemberBySchema: Quote
  signQuoteForNewContract: Quote
  overrideQuotePrice: Quote
  createCampaignPartner: Scalars['Boolean']
  assignCampaignToPartnerPercentageDiscount: Scalars['Boolean']
  assignCampaignToPartnerFreeMonths: Scalars['Boolean']
  assignCampaignToPartnerNoDiscount: Scalars['Boolean']
  assignCampaignToPartnerVisibleNoDiscount: Scalars['Boolean']
  setCampaignCodeType?: Maybe<VoucherCampaign>
  setContractForClaim: Claim
  manualRedeemCampaign: Member
  manualUnRedeemCampaign: Member
  unsignMember: Scalars['Boolean']
  editMemberInfo: Member
  setFraudulentStatus: Member
  createEmployee: Employee
  updateEmployeeRole: Employee
  removeEmployee: Scalars['Boolean']
  payoutMember?: Maybe<Transaction>
  createClaimTypeRelation: ClaimTypeRelation
  deleteClaimTypeRelation: Scalars['Boolean']
  updateClaimProperty: ClaimProperty
  deprecateClaimProperty: Scalars['Boolean']
  createClaimProperty: ClaimProperty
  updateClaimPropertyOption: ClaimPropertyOption
  deprecateClaimPropertyOption: Scalars['Boolean']
  createClaimPropertyOption: ClaimPropertyOption
  upsertCoInsured: Claim
  deleteCoInsured: Scalars['Boolean']
  updateUser: User
  upsertUserSettings: Array<UserSetting>
  restrictResourceAccess: ResourceAccessInformation
  releaseResourceAccess: Scalars['Boolean']
  grantResourceAccess: ResourceAccessInformation
}

export type MutationTypeChargeMemberArgs = {
  id: Scalars['ID']
  amount: Scalars['MonetaryAmount']
}

export type MutationTypeAddAccountEntryToMemberArgs = {
  memberId: Scalars['ID']
  accountEntry: AccountEntryInput
}

export type MutationTypeAddMonthlyEntryToMemberArgs = {
  memberId: Scalars['ID']
  monthlyEntry: MonthlyEntryInput
}

export type MutationTypeRemoveMonthlyEntryArgs = {
  id: Scalars['ID']
}

export type MutationTypeApproveMemberChargeArgs = {
  approvals: Array<MemberChargeApproval>
}

export type MutationTypeCreatePaymentCompletionLinkArgs = {
  memberId: Scalars['ID']
}

export type MutationTypeUpdateClaimStateArgs = {
  id: Scalars['ID']
  state: ClaimState
}

export type MutationTypeCreateClaimArgs = {
  memberId: Scalars['ID']
  date: Scalars['LocalDateTime']
  source: ClaimSource
}

export type MutationTypeAddClaimNoteArgs = {
  id: Scalars['ID']
  note: ClaimNoteInput
}

export type MutationTypeCreateClaimPaymentArgs = {
  id: Scalars['ID']
  payment: ClaimPaymentInput
}

export type MutationTypeCreateClaimSwishPaymentArgs = {
  id: Scalars['ID']
  payment: ClaimSwishPaymentInput
}

export type MutationTypeSetClaimTypeArgs = {
  id: Scalars['ID']
  type?: Maybe<Scalars['String']>
}

export type MutationTypeSetClaimOutcomeArgs = {
  id: Scalars['ID']
  outcome?: Maybe<Scalars['String']>
}

export type MutationTypeSetClaimPropertySelectionArgs = {
  id: Scalars['ID']
  claimType: Scalars['String']
  propertyId: Scalars['ID']
  optionIds: Array<Scalars['ID']>
}

export type MutationTypeSetDateOfOccurrenceArgs = {
  id: Scalars['ID']
  date: Scalars['LocalDate']
}

export type MutationTypeUpdateReserveArgs = {
  id: Scalars['ID']
  amount: Scalars['MonetaryAmount']
}

export type MutationTypeSetCoveringEmployeeArgs = {
  id: Scalars['ID']
  coveringEmployee: Scalars['Boolean']
}

export type MutationTypeWhitelistMemberArgs = {
  memberId: Scalars['ID']
}

export type MutationTypeMarkClaimFileAsDeletedArgs = {
  claimId: Scalars['ID']
  claimFileId: Scalars['ID']
}

export type MutationTypeBackfillSubscriptionsArgs = {
  memberId: Scalars['ID']
}

export type MutationTypeSetClaimFileCategoryArgs = {
  claimId: Scalars['ID']
  claimFileId: Scalars['ID']
  category?: Maybe<Scalars['String']>
}

export type MutationTypeActivateQuoteArgs = {
  id: Scalars['ID']
  activationDate: Scalars['LocalDate']
  terminationDate?: Maybe<Scalars['LocalDate']>
}

export type MutationTypeAddAgreementFromQuoteArgs = {
  id: Scalars['ID']
  contractId: Scalars['ID']
  activeFrom?: Maybe<Scalars['LocalDate']>
  activeTo?: Maybe<Scalars['LocalDate']>
  previousAgreementActiveTo?: Maybe<Scalars['LocalDate']>
}

export type MutationTypeCreateQuoteFromAgreementArgs = {
  agreementId: Scalars['ID']
  memberId: Scalars['ID']
}

export type MutationTypeMarkSwitchableSwitcherEmailAsRemindedArgs = {
  id: Scalars['ID']
}

export type MutationTypeUpdateSwitcherEmailInfoArgs = {
  id: Scalars['ID']
  request?: Maybe<UpdateSwitcherNoteInput>
}

export type MutationTypeUpdateEdiSwitcherNoteArgs = {
  id: Scalars['ID']
  request: UpdateSwitcherNoteInput
}

export type MutationTypeTerminateContractArgs = {
  contractId: Scalars['ID']
  request?: Maybe<TerminateContractInput>
}

export type MutationTypeActivatePendingAgreementArgs = {
  contractId: Scalars['ID']
  request?: Maybe<ActivatePendingAgreementInput>
}

export type MutationTypeChangeTerminationDateArgs = {
  contractId: Scalars['ID']
  request?: Maybe<ChangeTerminationDateInput>
}

export type MutationTypeRevertTerminationArgs = {
  contractId: Scalars['ID']
}

export type MutationTypeCreateNorwegianGripenPriceEngineArgs = {
  request?: Maybe<CreateNorwegianGripenInput>
}

export type MutationTypeAddNorwegianPostalCodesArgs = {
  postalCodesString?: Maybe<Scalars['String']>
}

export type MutationTypeChangeToDateArgs = {
  agreementId: Scalars['ID']
  request?: Maybe<ChangeToDateInput>
}

export type MutationTypeChangeFromDateArgs = {
  agreementId: Scalars['ID']
  request?: Maybe<ChangeFromDateInput>
}

export type MutationTypeSafelyEditArgs = {
  agreementId: Scalars['ID']
  request?: Maybe<SafelyEditAgreementInput>
}

export type MutationTypeRegenerateCertificateArgs = {
  agreementId: Scalars['ID']
}

export type MutationTypeSendMessageArgs = {
  input: SendMessageInput
}

export type MutationTypeMarkQuestionAsResolvedArgs = {
  memberId: Scalars['ID']
}

export type MutationTypeAnswerQuestionArgs = {
  memberId: Scalars['ID']
  answer: Scalars['String']
}

export type MutationTypeUpdateQuoteBySchemaArgs = {
  quoteId: Scalars['ID']
  schemaData: Scalars['JSON']
  bypassUnderwritingGuidelines: Scalars['Boolean']
}

export type MutationTypeCreateQuoteForMemberBySchemaArgs = {
  memberId: Scalars['ID']
  schemaData: Scalars['JSON']
  bypassUnderwritingGuidelines: Scalars['Boolean']
}

export type MutationTypeSignQuoteForNewContractArgs = {
  quoteId: Scalars['ID']
  activationDate?: Maybe<Scalars['LocalDate']>
}

export type MutationTypeOverrideQuotePriceArgs = {
  input: OverrideQuotePriceInput
}

export type MutationTypeCreateCampaignPartnerArgs = {
  partnerId: Scalars['ID']
  partnerName: Scalars['String']
}

export type MutationTypeAssignCampaignToPartnerPercentageDiscountArgs = {
  request?: Maybe<AssignVoucherPercentageDiscount>
}

export type MutationTypeAssignCampaignToPartnerFreeMonthsArgs = {
  request?: Maybe<AssignVoucherFreeMonths>
}

export type MutationTypeAssignCampaignToPartnerNoDiscountArgs = {
  request?: Maybe<AssignVoucherNoDiscount>
}

export type MutationTypeAssignCampaignToPartnerVisibleNoDiscountArgs = {
  request?: Maybe<AssignVoucherVisibleNoDiscount>
}

export type MutationTypeSetCampaignCodeTypeArgs = {
  id: Scalars['ID']
  codeType: Scalars['String']
}

export type MutationTypeSetContractForClaimArgs = {
  request: SetContractForClaim
}

export type MutationTypeManualRedeemCampaignArgs = {
  memberId: Scalars['ID']
  request: ManualRedeemCampaignInput
}

export type MutationTypeManualUnRedeemCampaignArgs = {
  memberId: Scalars['ID']
  request: ManualUnRedeemCampaignInput
}

export type MutationTypeUnsignMemberArgs = {
  ssn: Scalars['String']
}

export type MutationTypeEditMemberInfoArgs = {
  request: EditMemberInfoInput
}

export type MutationTypeSetFraudulentStatusArgs = {
  memberId: Scalars['ID']
  request: MemberFraudulentStatusInput
}

export type MutationTypeCreateEmployeeArgs = {
  email: Scalars['String']
  role: Scalars['String']
}

export type MutationTypeUpdateEmployeeRoleArgs = {
  id: Scalars['ID']
  role: Scalars['String']
}

export type MutationTypeRemoveEmployeeArgs = {
  id: Scalars['ID']
}

export type MutationTypePayoutMemberArgs = {
  memberId: Scalars['ID']
  request: PayoutMemberInput
}

export type MutationTypeCreateClaimTypeRelationArgs = {
  request?: Maybe<CreateClaimTypeRelationInput>
}

export type MutationTypeDeleteClaimTypeRelationArgs = {
  id: Scalars['ID']
}

export type MutationTypeUpdateClaimPropertyArgs = {
  id: Scalars['ID']
  name: Scalars['String']
}

export type MutationTypeDeprecateClaimPropertyArgs = {
  id: Scalars['ID']
}

export type MutationTypeCreateClaimPropertyArgs = {
  name: Scalars['String']
}

export type MutationTypeUpdateClaimPropertyOptionArgs = {
  id: Scalars['ID']
  name: Scalars['String']
}

export type MutationTypeDeprecateClaimPropertyOptionArgs = {
  id: Scalars['ID']
}

export type MutationTypeCreateClaimPropertyOptionArgs = {
  name?: Maybe<Scalars['String']>
}

export type MutationTypeUpsertCoInsuredArgs = {
  claimId: Scalars['ID']
  request: UpsertCoInsuredInput
}

export type MutationTypeDeleteCoInsuredArgs = {
  claimId: Scalars['ID']
}

export type MutationTypeUpdateUserArgs = {
  input: UpdateUserInput
}

export type MutationTypeUpsertUserSettingsArgs = {
  settings: Array<UpsertUserSettingInput>
}

export type MutationTypeRestrictResourceAccessArgs = {
  resourceId: Scalars['ID']
}

export type MutationTypeReleaseResourceAccessArgs = {
  resourceId: Scalars['ID']
}

export type MutationTypeGrantResourceAccessArgs = {
  resourceId: Scalars['ID']
  grantHolder: Scalars['String']
  grantHolderType: GrantHolderType
}

export type NationalIdentification = {
  __typename?: 'NationalIdentification'
  identification: Scalars['String']
  nationality: Scalars['String']
}

export type NoDiscount = {
  __typename?: 'NoDiscount'
  _?: Maybe<Scalars['Boolean']>
}

export type NorwegianGripenFactorInput = {
  factorType: NorwegianGripenFactorType
  factorString: Scalars['String']
}

export enum NorwegianGripenFactorType {
  Age = 'AGE',
  CentralityGroup = 'CENTRALITY_GROUP',
  EconomyOfMunicipality = 'ECONOMY_OF_MUNICIPALITY',
  NumberOfPeople = 'NUMBER_OF_PEOPLE',
  SquareMeters = 'SQUARE_METERS',
  HouseholdType = 'HOUSEHOLD_TYPE',
  Deductible = 'DEDUCTIBLE',
}

export type NumberFailedCharges = {
  __typename?: 'NumberFailedCharges'
  numberFailedCharges: Scalars['Int']
  lastFailedChargeAt?: Maybe<Scalars['Instant']>
}

export type OverrideQuotePriceInput = {
  quoteId: Scalars['ID']
  price: Scalars['BigDecimal']
}

export type PaymentCompletionResponse = {
  __typename?: 'PaymentCompletionResponse'
  url: Scalars['String']
}

export type PaymentDefault = {
  __typename?: 'PaymentDefault'
  year?: Maybe<Scalars['Int']>
  week?: Maybe<Scalars['Int']>
  paymentDefaultType?: Maybe<Scalars['String']>
  paymentDefaultTypeText?: Maybe<Scalars['String']>
  amount?: Maybe<Scalars['MonetaryAmount']>
  caseId?: Maybe<Scalars['String']>
  claimant?: Maybe<Scalars['String']>
}

export enum PayoutCategory {
  Marketing = 'MARKETING',
  Referral = 'REFERRAL',
  Refund = 'REFUND',
}

export type PayoutMemberInput = {
  amount: Scalars['MonetaryAmount']
  sanctionBypassed?: Maybe<Scalars['Boolean']>
  category?: Maybe<PayoutCategory>
  referenceId?: Maybe<Scalars['String']>
  note?: Maybe<Scalars['String']>
  carrier?: Maybe<Scalars['String']>
  payoutDetails?: Maybe<SelectedPayoutDetails>
}

export type PayoutMethodStatus = {
  __typename?: 'PayoutMethodStatus'
  activated?: Maybe<Scalars['Boolean']>
}

export type Person = {
  __typename?: 'Person'
  debtFlag?: Maybe<Flag>
  debt?: Maybe<Debt>
  whitelisted?: Maybe<Whitelisted>
  status?: Maybe<PersonStatus>
}

export type PersonStatus = {
  __typename?: 'PersonStatus'
  flag?: Maybe<Flag>
  whitelisted?: Maybe<Scalars['Boolean']>
}

export type QueryType = {
  __typename?: 'QueryType'
  member?: Maybe<Member>
  claim?: Maybe<Claim>
  paymentSchedule?: Maybe<Array<Maybe<SchedulerState>>>
  me: Me
  switchableSwitcherEmails: Array<SwitchableSwitcherEmail>
  ediSwitchers: Array<EdiSwitcher>
  messageHistory: Array<ChatMessage>
  questionGroups: Array<QuestionGroup>
  findPartnerCampaigns: Array<VoucherCampaign>
  getPartnerCampaignOwners: Array<CampaignOwnerPartner>
  availableCampaignCodeTypes: Array<Scalars['String']>
  dashboardNumbers?: Maybe<DashboardNumbers>
  quoteSchemaForContractType?: Maybe<Scalars['JSON']>
  memberSearch: MemberSearchResult
  listClaims: ListClaimsResult
  employees: Array<Employee>
  availableEmployeeRoles: Array<Scalars['String']>
  claimTypes: Array<Scalars['String']>
  claimTypeTemplates: Array<ClaimTypeTemplate>
  claimTypeTemplate?: Maybe<ClaimTypeTemplate>
  claimTypeRelations: Array<ClaimTypeRelation>
  claimProperties: Array<ClaimProperty>
  claimProperty: ClaimProperty
  claimPropertyOptions: Array<ClaimPropertyOption>
  claimPropertyOption: ClaimPropertyOption
  user?: Maybe<User>
  users: Array<User>
  usersOnPath: Array<User>
  resourceAccess?: Maybe<ResourceAccessInformation>
}

export type QueryTypeMemberArgs = {
  id: Scalars['ID']
}

export type QueryTypeClaimArgs = {
  id: Scalars['ID']
}

export type QueryTypePaymentScheduleArgs = {
  status: ChargeStatus
}

export type QueryTypeMessageHistoryArgs = {
  memberId: Scalars['ID']
}

export type QueryTypeFindPartnerCampaignsArgs = {
  input: CampaignFilter
}

export type QueryTypeQuoteSchemaForContractTypeArgs = {
  contractType: Scalars['String']
}

export type QueryTypeMemberSearchArgs = {
  query: Scalars['String']
  options: MemberSearchOptions
}

export type QueryTypeListClaimsArgs = {
  options: ListClaimsOptions
}

export type QueryTypeClaimTypeTemplateArgs = {
  claimType: Scalars['String']
}

export type QueryTypeClaimPropertyArgs = {
  id: Scalars['ID']
}

export type QueryTypeClaimPropertyOptionArgs = {
  id: Scalars['ID']
}

export type QueryTypeUserArgs = {
  email: Scalars['String']
}

export type QueryTypeUsersOnPathArgs = {
  path: Scalars['String']
}

export type QueryTypeResourceAccessArgs = {
  resourceId: Scalars['String']
}

export type Question = {
  __typename?: 'Question'
  id: Scalars['ID']
  timestamp: Scalars['Instant']
  messageJsonString: Scalars['String']
}

export type QuestionGroup = {
  __typename?: 'QuestionGroup'
  id: Scalars['ID']
  memberId: Scalars['ID']
  questions: Array<Question>
  member?: Maybe<Member>
}

export type Quote = {
  __typename?: 'Quote'
  id: Scalars['ID']
  createdAt?: Maybe<Scalars['Instant']>
  price?: Maybe<Scalars['Float']>
  currency?: Maybe<Scalars['String']>
  productType?: Maybe<Scalars['String']>
  state?: Maybe<Scalars['String']>
  initiatedFrom?: Maybe<Scalars['String']>
  attributedTo?: Maybe<Scalars['String']>
  currentInsurer?: Maybe<Scalars['String']>
  startDate?: Maybe<Scalars['String']>
  validity?: Maybe<Scalars['Int']>
  memberId?: Maybe<Scalars['ID']>
  breachedUnderwritingGuidelines?: Maybe<Array<Scalars['String']>>
  isComplete?: Maybe<Scalars['Boolean']>
  schema?: Maybe<Scalars['JSON']>
  schemaData?: Maybe<Scalars['JSON']>
  signedProductId?: Maybe<Scalars['ID']>
  originatingProductId?: Maybe<Scalars['ID']>
  isReadyToSign?: Maybe<Scalars['Boolean']>
}

export type RedeemedCampaign = {
  __typename?: 'RedeemedCampaign'
  code: Scalars['String']
  type: Scalars['String']
  incentive: Incentive
  redemptionState: RedemptionState
}

export type RedemptionState = {
  __typename?: 'RedemptionState'
  redeemedAt: Scalars['Instant']
  activatedAt?: Maybe<Scalars['Instant']>
  activeTo?: Maybe<Scalars['Instant']>
  terminatedAt?: Maybe<Scalars['Instant']>
  unRedeemedAt?: Maybe<Scalars['Instant']>
}

export type ReferralCampaign = {
  __typename?: 'ReferralCampaign'
  code: Scalars['String']
  incentive?: Maybe<Incentive>
}

export type ReferralInformation = {
  __typename?: 'ReferralInformation'
  eligible: Scalars['Boolean']
  campaign: ReferralCampaign
  referredBy?: Maybe<MemberReferral>
  hasReferred: Array<MemberReferral>
  redeemedCampaigns: Array<RedeemedCampaign>
}

export type Renewal = {
  __typename?: 'Renewal'
  renewalDate: Scalars['LocalDate']
  draftCertificateUrl?: Maybe<Scalars['String']>
  draftOfAgreementId?: Maybe<Scalars['ID']>
}

export type ResourceAccessInformation = {
  __typename?: 'ResourceAccessInformation'
  resourceId: Scalars['ID']
  restrictedBy: User
  restrictedByMe: Scalars['Boolean']
  usersGranted: Array<User>
  usersRestricted: Array<User>
  rolesGranted: Array<Scalars['String']>
  rolesRestricted: Array<Scalars['String']>
}

export type SafelyEditAgreementInput = {
  newStreet?: Maybe<Scalars['String']>
}

export enum SanctionStatus {
  Undetermined = 'Undetermined',
  NoHit = 'NoHit',
  PartialHit = 'PartialHit',
  FullHit = 'FullHit',
}

export type SchedulerState = {
  __typename?: 'SchedulerState'
  id: Scalars['ID']
  member?: Maybe<Member>
  status: ChargeStatus
  changedBy: Scalars['String']
  changedAt: Scalars['Instant']
  amount?: Maybe<Scalars['MonetaryAmount']>
  transactionId?: Maybe<Scalars['ID']>
}

export type SelectedPayoutDetails = {
  type: Scalars['String']
  phoneNumber?: Maybe<Scalars['String']>
  ssn?: Maybe<Scalars['String']>
  message?: Maybe<Scalars['String']>
}

export type SendMessageFailed = {
  __typename?: 'SendMessageFailed'
  memberId: Scalars['String']
  errorCode: Scalars['Int']
  errorMessage: Scalars['String']
}

export type SendMessageInput = {
  memberId: Scalars['ID']
  message: Scalars['String']
  forceSendMessage: Scalars['Boolean']
}

export type SendMessageResponse = SendMessageSuccessful | SendMessageFailed

export type SendMessageSuccessful = {
  __typename?: 'SendMessageSuccessful'
  memberId: Scalars['String']
}

export type SetContractForClaim = {
  claimId: Scalars['String']
  memberId: Scalars['String']
  contractId: Scalars['String']
}

export type SwitchableSwitcherEmail = {
  __typename?: 'SwitchableSwitcherEmail'
  id: Scalars['ID']
  member: Member
  switcherCompany: Scalars['String']
  queuedAt: Scalars['Instant']
  contract?: Maybe<Contract>
  sentAt?: Maybe<Scalars['Instant']>
  remindedAt?: Maybe<Scalars['Instant']>
  cancellationDate?: Maybe<Scalars['LocalDate']>
  switcherType?: Maybe<Scalars['String']>
  note?: Maybe<Scalars['String']>
}

export type TerminateContractInput = {
  terminationDate: Scalars['LocalDate']
  terminationReason: Scalars['String']
  comment?: Maybe<Scalars['String']>
}

export type Transaction = {
  __typename?: 'Transaction'
  id?: Maybe<Scalars['ID']>
  amount?: Maybe<MonetaryAmountV2>
  timestamp?: Maybe<Scalars['Instant']>
  type?: Maybe<Scalars['String']>
  status?: Maybe<Scalars['String']>
}

export type Trial = {
  __typename?: 'Trial'
  id: Scalars['ID']
  fromDate: Scalars['LocalDate']
  toDate: Scalars['LocalDate']
  displayName: Scalars['String']
  partner: Scalars['String']
  address: TrialAddress
  certificateUrl?: Maybe<Scalars['String']>
  status: Scalars['String']
  createdAt: Scalars['Instant']
}

export type TrialAddress = {
  __typename?: 'TrialAddress'
  street: Scalars['String']
  city: Scalars['String']
  zipCode: Scalars['String']
  livingSpace?: Maybe<Scalars['Int']>
  apartmentNo?: Maybe<Scalars['String']>
  floor?: Maybe<Scalars['Int']>
}

export type UnknownIncentive = {
  __typename?: 'UnknownIncentive'
  _?: Maybe<Scalars['Boolean']>
}

export type UpdateSwitcherNoteInput = {
  note?: Maybe<Scalars['String']>
}

export type UpdateUserInput = {
  fullName?: Maybe<Scalars['String']>
  phoneNumber?: Maybe<Scalars['String']>
}

export type UpsertCoInsuredInput = {
  fullName: Scalars['String']
  personalNumber: Scalars['String']
  email?: Maybe<Scalars['String']>
  phoneNumber?: Maybe<Scalars['String']>
}

export type UpsertUserSettingInput = {
  key: Scalars['String']
  value?: Maybe<Scalars['JSON']>
}

export type User = {
  __typename?: 'User'
  id: Scalars['ID']
  email: Scalars['String']
  role?: Maybe<Scalars['String']>
  fullName: Scalars['String']
  phoneNumber?: Maybe<Scalars['String']>
  latestPresence?: Maybe<Scalars['Instant']>
  latestLocation?: Maybe<Scalars['String']>
}

export type UserSetting = {
  __typename?: 'UserSetting'
  key: UserSettingKey
  value: Scalars['JSON']
}

export enum UserSettingKey {
  DarkMode = 'DARK_MODE',
  FeatureFlags = 'FEATURE_FLAGS',
  NumberOfMemberGroups = 'NUMBER_OF_MEMBER_GROUPS',
  ClaimComplexityFilter = 'CLAIM_COMPLEXITY_FILTER',
  ClaimStatesFilter = 'CLAIM_STATES_FILTER',
  MemberGroupsFilter = 'MEMBER_GROUPS_FILTER',
  MarketFilter = 'MARKET_FILTER',
  NumberOfClaimsFilter = 'NUMBER_OF_CLAIMS_FILTER',
}

export type UserSettingsFilter = {
  keys: Array<UserSettingKey>
}

export type VisibleNoDiscount = {
  __typename?: 'VisibleNoDiscount'
  _?: Maybe<Scalars['Boolean']>
}

export type VoucherCampaign = {
  __typename?: 'VoucherCampaign'
  id: Scalars['ID']
  campaignCode: Scalars['String']
  partnerId: Scalars['String']
  partnerName: Scalars['String']
  validFrom?: Maybe<Scalars['Instant']>
  validTo?: Maybe<Scalars['Instant']>
  incentive?: Maybe<Incentive>
  codeType?: Maybe<Scalars['String']>
}

export type Whitelisted = {
  __typename?: 'Whitelisted'
  whitelistedAt?: Maybe<Scalars['Instant']>
  whitelistedBy?: Maybe<Scalars['String']>
}

export type SetClaimDateMutationVariables = Exact<{
  id: Scalars['ID']
  date: Scalars['LocalDate']
}>

export type SetClaimDateMutation = { __typename?: 'MutationType' } & {
  setDateOfOccurrence?: Maybe<
    { __typename?: 'Claim' } & Pick<Claim, 'id' | 'dateOfOccurrence'> & {
        contract?: Maybe<
          { __typename?: 'Contract' } & Pick<
            Contract,
            | 'id'
            | 'market'
            | 'currentAgreementId'
            | 'contractTypeName'
            | 'preferredCurrency'
            | 'typeOfContract'
            | 'masterInception'
            | 'terminationDate'
          > & {
              genericAgreements: Array<
                { __typename?: 'GenericAgreement' } & Pick<
                  GenericAgreement,
                  | 'id'
                  | 'lineOfBusinessName'
                  | 'status'
                  | 'carrier'
                  | 'typeOfContract'
                  | 'createdAt'
                > & {
                    address?: Maybe<
                      { __typename?: 'Address' } & Pick<
                        Address,
                        'street' | 'postalCode' | 'city'
                      >
                    >
                    premium: { __typename?: 'MonetaryAmountV2' } & Pick<
                      MonetaryAmountV2,
                      'amount' | 'currency'
                    >
                  }
              >
            }
        >
        agreement?: Maybe<
          { __typename?: 'GenericAgreement' } & Pick<
            GenericAgreement,
            'id' | 'typeOfContract' | 'lineOfBusinessName' | 'carrier'
          > & {
              address?: Maybe<
                { __typename?: 'Address' } & Pick<
                  Address,
                  'street' | 'postalCode' | 'city'
                >
              >
            }
        >
      }
  >
}

export type SetClaimOutcomeMutationVariables = Exact<{
  id: Scalars['ID']
  outcome?: Maybe<Scalars['String']>
}>

export type SetClaimOutcomeMutation = { __typename?: 'MutationType' } & {
  setClaimOutcome?: Maybe<
    { __typename?: 'Claim' } & Pick<Claim, 'id' | 'outcome'>
  >
}

export type SetClaimPropertySelectionMutationVariables = Exact<{
  id: Scalars['ID']
  claimType: Scalars['String']
  propertyId: Scalars['ID']
  optionIds: Array<Scalars['ID']> | Scalars['ID']
}>

export type SetClaimPropertySelectionMutation = {
  __typename?: 'MutationType'
} & {
  setClaimPropertySelection?: Maybe<
    { __typename?: 'Claim' } & Pick<Claim, 'id'> & {
        propertySelections: Array<
          { __typename?: 'ClaimPropertySelection' } & Pick<
            ClaimPropertySelection,
            'claimType'
          > & {
              property: { __typename?: 'ClaimProperty' } & Pick<
                ClaimProperty,
                'id' | 'name'
              >
              option: { __typename?: 'ClaimPropertyOption' } & Pick<
                ClaimPropertyOption,
                'id' | 'name'
              >
            }
        >
      }
  >
}

export type DeleteCoInsuredMutationVariables = Exact<{
  claimId: Scalars['ID']
}>

export type DeleteCoInsuredMutation = { __typename?: 'MutationType' } & Pick<
  MutationType,
  'deleteCoInsured'
>

export type UpsertCoInsuredMutationVariables = Exact<{
  claimId: Scalars['ID']
  request: UpsertCoInsuredInput
}>

export type UpsertCoInsuredMutation = { __typename?: 'MutationType' } & {
  upsertCoInsured: { __typename?: 'Claim' } & Pick<Claim, 'id'> & {
      coInsured?: Maybe<
        { __typename?: 'CoInsured' } & Pick<
          CoInsured,
          'id' | 'fullName' | 'personalNumber' | 'email' | 'phoneNumber'
        >
      >
    }
}

export type ClaimAddClaimNoteMutationVariables = Exact<{
  claimId: Scalars['ID']
  note: ClaimNoteInput
}>

export type ClaimAddClaimNoteMutation = { __typename?: 'MutationType' } & {
  addClaimNote?: Maybe<
    { __typename?: 'Claim' } & Pick<Claim, 'id'> & {
        notes: Array<
          { __typename?: 'ClaimNote' } & Pick<
            ClaimNote,
            'text' | 'date' | 'handlerReference'
          >
        >
        events: Array<
          { __typename?: 'ClaimEvent' } & Pick<ClaimEvent, 'text' | 'date'>
        >
      }
  >
}

export type ClaimMemberContractsMasterInceptionQueryVariables = Exact<{
  memberId: Scalars['ID']
}>

export type ClaimMemberContractsMasterInceptionQuery = {
  __typename?: 'QueryType'
} & {
  member?: Maybe<
    { __typename?: 'Member' } & Pick<
      Member,
      | 'memberId'
      | 'signedOn'
      | 'firstName'
      | 'lastName'
      | 'personalNumber'
      | 'fraudulentStatus'
      | 'sanctionStatus'
      | 'totalNumberOfClaims'
      | 'pickedLocale'
    > & {
        person?: Maybe<{ __typename?: 'Person' } & Pick<Person, 'debtFlag'>>
        directDebitStatus?: Maybe<
          { __typename?: 'DirectDebitStatus' } & Pick<
            DirectDebitStatus,
            'activated'
          >
        >
        numberFailedCharges?: Maybe<
          { __typename?: 'NumberFailedCharges' } & Pick<
            NumberFailedCharges,
            'numberFailedCharges' | 'lastFailedChargeAt'
          >
        >
        account?: Maybe<
          { __typename?: 'Account' } & Pick<Account, 'id'> & {
              totalBalance: { __typename?: 'MonetaryAmountV2' } & Pick<
                MonetaryAmountV2,
                'amount' | 'currency'
              >
            }
        >
        identity?: Maybe<
          { __typename?: 'Identity' } & Pick<
            Identity,
            'firstName' | 'lastName'
          > & {
              nationalIdentification: {
                __typename?: 'NationalIdentification'
              } & Pick<NationalIdentification, 'identification' | 'nationality'>
            }
        >
        contractMarketInfo?: Maybe<
          { __typename?: 'ContractMarketInfo' } & Pick<
            ContractMarketInfo,
            'market' | 'preferredCurrency'
          >
        >
        contracts: Array<
          { __typename?: 'Contract' } & Pick<
            Contract,
            | 'id'
            | 'currentAgreementId'
            | 'contractTypeName'
            | 'typeOfContract'
            | 'masterInception'
            | 'terminationDate'
            | 'isTerminated'
          > & {
              genericAgreements: Array<
                { __typename?: 'GenericAgreement' } & Pick<
                  GenericAgreement,
                  | 'id'
                  | 'status'
                  | 'typeOfContract'
                  | 'lineOfBusinessName'
                  | 'carrier'
                  | 'createdAt'
                > & {
                    address?: Maybe<
                      { __typename?: 'Address' } & Pick<
                        Address,
                        'street' | 'postalCode' | 'city'
                      >
                    >
                    premium: { __typename?: 'MonetaryAmountV2' } & Pick<
                      MonetaryAmountV2,
                      'amount' | 'currency'
                    >
                  }
              >
            }
        >
        trials: Array<{ __typename?: 'Trial' } & Pick<Trial, 'id'>>
      }
  >
}

export type ClaimPageQueryVariables = Exact<{
  claimId: Scalars['ID']
}>

export type ClaimPageQuery = { __typename?: 'QueryType' } & {
  claim?: Maybe<
    { __typename?: 'Claim' } & Pick<
      Claim,
      | 'id'
      | 'recordingUrl'
      | 'registrationDate'
      | 'state'
      | 'coveringEmployee'
      | 'claimType'
      | 'dateOfOccurrence'
      | 'outcome'
      | 'reserves'
    > & {
        restriction?: Maybe<
          { __typename?: 'ResourceAccessInformation' } & Pick<
            ResourceAccessInformation,
            'resourceId' | 'restrictedByMe' | 'rolesGranted' | 'rolesRestricted'
          > & {
              restrictedBy: { __typename?: 'User' } & Pick<
                User,
                'id' | 'email' | 'fullName' | 'role'
              >
              usersGranted: Array<
                { __typename?: 'User' } & Pick<
                  User,
                  'id' | 'email' | 'fullName' | 'role'
                >
              >
              usersRestricted: Array<
                { __typename?: 'User' } & Pick<
                  User,
                  'id' | 'email' | 'fullName' | 'role'
                >
              >
            }
        >
        propertySelections: Array<
          { __typename?: 'ClaimPropertySelection' } & Pick<
            ClaimPropertySelection,
            'claimType'
          > & {
              property: { __typename?: 'ClaimProperty' } & Pick<
                ClaimProperty,
                'id' | 'name'
              >
              option: { __typename?: 'ClaimPropertyOption' } & Pick<
                ClaimPropertyOption,
                'id' | 'name'
              >
            }
        >
        coInsured?: Maybe<
          { __typename?: 'CoInsured' } & Pick<
            CoInsured,
            'id' | 'fullName' | 'personalNumber' | 'email' | 'phoneNumber'
          >
        >
        member: { __typename?: 'Member' } & Pick<Member, 'memberId'>
        contract?: Maybe<
          { __typename?: 'Contract' } & Pick<
            Contract,
            | 'id'
            | 'market'
            | 'currentAgreementId'
            | 'contractTypeName'
            | 'preferredCurrency'
            | 'typeOfContract'
            | 'masterInception'
            | 'terminationDate'
          > & {
              genericAgreements: Array<
                { __typename?: 'GenericAgreement' } & Pick<
                  GenericAgreement,
                  | 'id'
                  | 'lineOfBusinessName'
                  | 'status'
                  | 'carrier'
                  | 'typeOfContract'
                  | 'createdAt'
                > & {
                    address?: Maybe<
                      { __typename?: 'Address' } & Pick<
                        Address,
                        'street' | 'postalCode' | 'city'
                      >
                    >
                    premium: { __typename?: 'MonetaryAmountV2' } & Pick<
                      MonetaryAmountV2,
                      'amount' | 'currency'
                    >
                  }
              >
            }
        >
        agreement?: Maybe<
          { __typename?: 'GenericAgreement' } & Pick<
            GenericAgreement,
            'id' | 'typeOfContract' | 'lineOfBusinessName' | 'carrier'
          > & {
              address?: Maybe<
                { __typename?: 'Address' } & Pick<
                  Address,
                  'street' | 'postalCode' | 'city'
                >
              >
            }
        >
        transcriptions: Array<
          { __typename?: 'ClaimTranscription' } & Pick<
            ClaimTranscription,
            'confidenceScore' | 'languageCode' | 'text'
          >
        >
        notes: Array<
          { __typename?: 'ClaimNote' } & Pick<
            ClaimNote,
            'date' | 'handlerReference' | 'text'
          >
        >
        claimFiles: Array<
          { __typename?: 'ClaimFileUpload' } & Pick<
            ClaimFileUpload,
            | 'claimFileId'
            | 'claimId'
            | 'category'
            | 'contentType'
            | 'fileUploadUrl'
            | 'uploadedAt'
          >
        >
        payments: Array<
          { __typename?: 'ClaimPayment' } & Pick<
            ClaimPayment,
            | 'id'
            | 'deductible'
            | 'amount'
            | 'exGratia'
            | 'status'
            | 'note'
            | 'type'
            | 'timestamp'
          >
        >
        events: Array<
          { __typename?: 'ClaimEvent' } & Pick<ClaimEvent, 'date' | 'text'>
        >
      }
  >
}

export type ClaimPaymentsQueryVariables = Exact<{
  claimId: Scalars['ID']
}>

export type ClaimPaymentsQuery = { __typename?: 'QueryType' } & {
  claim?: Maybe<
    { __typename?: 'Claim' } & Pick<Claim, 'id'> & {
        contract?: Maybe<
          { __typename?: 'Contract' } & Pick<Contract, 'id' | 'market'>
        >
        agreement?: Maybe<
          { __typename?: 'GenericAgreement' } & Pick<
            GenericAgreement,
            'id' | 'carrier'
          >
        >
        member: { __typename?: 'Member' } & Pick<
          Member,
          'memberId' | 'sanctionStatus'
        > & {
            identity?: Maybe<
              { __typename?: 'Identity' } & Pick<
                Identity,
                'firstName' | 'lastName'
              > & {
                  nationalIdentification: {
                    __typename?: 'NationalIdentification'
                  } & Pick<
                    NationalIdentification,
                    'identification' | 'nationality'
                  >
                }
            >
          }
        payments: Array<
          { __typename?: 'ClaimPayment' } & Pick<
            ClaimPayment,
            | 'id'
            | 'deductible'
            | 'amount'
            | 'exGratia'
            | 'status'
            | 'note'
            | 'type'
            | 'timestamp'
          >
        >
      }
  >
}

export type ClaimReserveQueryVariables = Exact<{
  claimId: Scalars['ID']
}>

export type ClaimReserveQuery = { __typename?: 'QueryType' } & {
  claim?: Maybe<{ __typename?: 'Claim' } & Pick<Claim, 'id' | 'reserves'>>
}

export type UpdateReserveMutationVariables = Exact<{
  claimId: Scalars['ID']
  amount: Scalars['MonetaryAmount']
}>

export type UpdateReserveMutation = { __typename?: 'MutationType' } & {
  updateReserve?: Maybe<
    { __typename?: 'Claim' } & Pick<Claim, 'id' | 'reserves'> & {
        events: Array<
          { __typename?: 'ClaimEvent' } & Pick<ClaimEvent, 'text' | 'date'>
        >
      }
  >
}

export type CreateClaimPaymentMutationVariables = Exact<{
  id: Scalars['ID']
  payment: ClaimPaymentInput
}>

export type CreateClaimPaymentMutation = { __typename?: 'MutationType' } & {
  createClaimPayment?: Maybe<
    { __typename?: 'Claim' } & Pick<Claim, 'id'> & {
        payments: Array<
          { __typename?: 'ClaimPayment' } & Pick<
            ClaimPayment,
            | 'id'
            | 'amount'
            | 'deductible'
            | 'exGratia'
            | 'note'
            | 'timestamp'
            | 'type'
            | 'status'
          >
        >
      }
  >
}

export type CreateSwishClaimPaymentMutationVariables = Exact<{
  id: Scalars['ID']
  payment: ClaimSwishPaymentInput
}>

export type CreateSwishClaimPaymentMutation = {
  __typename?: 'MutationType'
} & {
  createClaimSwishPayment?: Maybe<
    { __typename?: 'Claim' } & Pick<Claim, 'id'> & {
        payments: Array<
          { __typename?: 'ClaimPayment' } & Pick<
            ClaimPayment,
            | 'id'
            | 'amount'
            | 'deductible'
            | 'exGratia'
            | 'note'
            | 'timestamp'
            | 'type'
            | 'status'
          >
        >
      }
  >
}

export type MarkClaimFileAsDeletedMutationVariables = Exact<{
  claimId: Scalars['ID']
  claimFileId: Scalars['ID']
}>

export type MarkClaimFileAsDeletedMutation = {
  __typename?: 'MutationType'
} & Pick<MutationType, 'markClaimFileAsDeleted'>

export type RestrictResourceAccessMutationVariables = Exact<{
  resourceId: Scalars['ID']
}>

export type RestrictResourceAccessMutation = { __typename?: 'MutationType' } & {
  restrictResourceAccess: { __typename?: 'ResourceAccessInformation' } & Pick<
    ResourceAccessInformation,
    'resourceId' | 'rolesGranted' | 'rolesRestricted'
  > & {
      usersGranted: Array<
        { __typename?: 'User' } & Pick<
          User,
          'id' | 'email' | 'fullName' | 'role'
        >
      >
      usersRestricted: Array<
        { __typename?: 'User' } & Pick<
          User,
          'id' | 'email' | 'fullName' | 'role'
        >
      >
    }
}

export type SetClaimFileCategoryMutationVariables = Exact<{
  claimId: Scalars['ID']
  claimFileId: Scalars['ID']
  category?: Maybe<Scalars['String']>
}>

export type SetClaimFileCategoryMutation = { __typename?: 'MutationType' } & {
  setClaimFileCategory?: Maybe<
    { __typename?: 'ClaimFileUpload' } & Pick<
      ClaimFileUpload,
      'claimId' | 'claimFileId'
    >
  >
}

export type SetClaimTypeMutationVariables = Exact<{
  id: Scalars['ID']
  type?: Maybe<Scalars['String']>
}>

export type SetClaimTypeMutation = { __typename?: 'MutationType' } & {
  setClaimType?: Maybe<
    { __typename?: 'Claim' } & Pick<Claim, 'id' | 'claimType'> & {
        events: Array<
          { __typename?: 'ClaimEvent' } & Pick<ClaimEvent, 'text' | 'date'>
        >
      }
  >
}

export type SetContractForClaimMutationVariables = Exact<{
  request: SetContractForClaim
}>

export type SetContractForClaimMutation = { __typename?: 'MutationType' } & {
  setContractForClaim: { __typename?: 'Claim' } & Pick<Claim, 'id'> & {
      member: { __typename?: 'Member' } & Pick<Member, 'memberId'>
      contract?: Maybe<{ __typename?: 'Contract' } & Pick<Contract, 'id'>>
    }
}

export type SetCoveringEmployeeMutationVariables = Exact<{
  id: Scalars['ID']
  coveringEmployee: Scalars['Boolean']
}>

export type SetCoveringEmployeeMutation = { __typename?: 'MutationType' } & {
  setCoveringEmployee?: Maybe<
    { __typename?: 'Claim' } & Pick<Claim, 'id' | 'coveringEmployee'> & {
        events: Array<
          { __typename?: 'ClaimEvent' } & Pick<ClaimEvent, 'text' | 'date'>
        >
      }
  >
}

export type UpdateClaimStateMutationVariables = Exact<{
  id: Scalars['ID']
  state: ClaimState
}>

export type UpdateClaimStateMutation = { __typename?: 'MutationType' } & {
  updateClaimState?: Maybe<
    { __typename?: 'Claim' } & Pick<Claim, 'id' | 'state'> & {
        events: Array<
          { __typename?: 'ClaimEvent' } & Pick<ClaimEvent, 'text' | 'date'>
        >
      }
  >
}

export type ListClaimsQueryVariables = Exact<{
  options: ListClaimsOptions
}>

export type ListClaimsQuery = { __typename?: 'QueryType' } & {
  listClaims: { __typename?: 'ListClaimsResult' } & Pick<
    ListClaimsResult,
    'page' | 'totalPages'
  > & {
      claims: Array<
        { __typename?: 'Claim' } & Pick<
          Claim,
          | 'id'
          | 'registrationDate'
          | 'claimType'
          | 'outcome'
          | 'state'
          | 'reserves'
        > & {
            member: { __typename?: 'Member' } & Pick<
              Member,
              'memberId' | 'firstName' | 'lastName'
            >
          }
      >
    }
}

export type GetMessageHistoryQueryVariables = Exact<{
  memberId: Scalars['ID']
}>

export type GetMessageHistoryQuery = { __typename?: 'QueryType' } & {
  messageHistory: Array<
    { __typename?: 'ChatMessage' } & Pick<
      ChatMessage,
      'globalId' | 'author' | 'fromId' | 'timestamp' | 'messageBodyJsonString'
    >
  >
}

export type AddAccountEntryToMemberMutationVariables = Exact<{
  memberId: Scalars['ID']
  accountEntry: AccountEntryInput
}>

export type AddAccountEntryToMemberMutation = {
  __typename?: 'MutationType'
} & {
  addAccountEntryToMember: { __typename?: 'Member' } & Pick<Member, 'memberId'>
}

export type AddMonthlyEntryMutationVariables = Exact<{
  memberId: Scalars['ID']
  input: MonthlyEntryInput
}>

export type AddMonthlyEntryMutation = { __typename?: 'MutationType' } & {
  addMonthlyEntryToMember: { __typename?: 'Member' } & Pick<Member, 'memberId'>
}

export type BackfillSubscriptionsMutationVariables = Exact<{
  memberId: Scalars['ID']
}>

export type BackfillSubscriptionsMutation = { __typename?: 'MutationType' } & {
  backfillSubscriptions: { __typename?: 'Member' } & Pick<Member, 'memberId'>
}

export type GetAccountQueryVariables = Exact<{
  memberId: Scalars['ID']
}>

export type GetAccountQuery = { __typename?: 'QueryType' } & {
  member?: Maybe<
    { __typename?: 'Member' } & Pick<Member, 'memberId'> & {
        account?: Maybe<
          { __typename?: 'Account' } & Pick<Account, 'id'> & {
              currentBalance: { __typename?: 'MonetaryAmountV2' } & Pick<
                MonetaryAmountV2,
                'amount' | 'currency'
              >
              totalBalance: { __typename?: 'MonetaryAmountV2' } & Pick<
                MonetaryAmountV2,
                'amount' | 'currency'
              >
              chargeEstimation: {
                __typename?: 'AccountChargeEstimation'
              } & Pick<AccountChargeEstimation, 'discountCodes'> & {
                  subscription: { __typename?: 'MonetaryAmountV2' } & Pick<
                    MonetaryAmountV2,
                    'amount' | 'currency'
                  >
                  charge: { __typename?: 'MonetaryAmountV2' } & Pick<
                    MonetaryAmountV2,
                    'amount' | 'currency'
                  >
                  discount: { __typename?: 'MonetaryAmountV2' } & Pick<
                    MonetaryAmountV2,
                    'amount' | 'currency'
                  >
                }
              entries: Array<
                { __typename?: 'AccountEntry' } & Pick<
                  AccountEntry,
                  | 'id'
                  | 'fromDate'
                  | 'title'
                  | 'source'
                  | 'reference'
                  | 'comment'
                  | 'type'
                  | 'failedAt'
                  | 'chargedAt'
                > & {
                    amount: { __typename?: 'MonetaryAmountV2' } & Pick<
                      MonetaryAmountV2,
                      'amount' | 'currency'
                    >
                  }
              >
              monthlyEntries: Array<
                { __typename?: 'MonthlyEntry' } & Pick<
                  MonthlyEntry,
                  | 'id'
                  | 'externalId'
                  | 'type'
                  | 'source'
                  | 'addedAt'
                  | 'addedBy'
                  | 'title'
                  | 'comment'
                > & {
                    amount: { __typename?: 'MonetaryAmountV2' } & Pick<
                      MonetaryAmountV2,
                      'amount' | 'currency'
                    >
                  }
              >
            }
        >
      }
  >
}

export type RemoveMonthlyEntryMutationVariables = Exact<{
  id: Scalars['ID']
}>

export type RemoveMonthlyEntryMutation = { __typename?: 'MutationType' } & Pick<
  MutationType,
  'removeMonthlyEntry'
>

export type GetReferralInformationQueryVariables = Exact<{
  memberId: Scalars['ID']
}>

export type GetReferralInformationQuery = { __typename?: 'QueryType' } & {
  member?: Maybe<
    { __typename?: 'Member' } & Pick<Member, 'memberId'> & {
        referralInformation?: Maybe<
          { __typename?: 'ReferralInformation' } & Pick<
            ReferralInformation,
            'eligible'
          > & {
              redeemedCampaigns: Array<
                { __typename?: 'RedeemedCampaign' } & Pick<
                  RedeemedCampaign,
                  'code' | 'type'
                > & {
                    redemptionState: { __typename?: 'RedemptionState' } & Pick<
                      RedemptionState,
                      'redeemedAt' | 'activatedAt' | 'activeTo' | 'unRedeemedAt'
                    >
                    incentive:
                      | { __typename: 'MonthlyPercentageDiscountFixedPeriod' }
                      | { __typename: 'FreeMonths' }
                      | { __typename: 'CostDeduction' }
                      | { __typename: 'NoDiscount' }
                      | { __typename: 'IndefinitePercentageDiscount' }
                      | { __typename: 'VisibleNoDiscount' }
                      | { __typename: 'UnknownIncentive' }
                  }
              >
              campaign: { __typename?: 'ReferralCampaign' } & Pick<
                ReferralCampaign,
                'code'
              > & {
                  incentive?: Maybe<
                    | ({
                        __typename: 'MonthlyPercentageDiscountFixedPeriod'
                      } & Pick<
                        MonthlyPercentageDiscountFixedPeriod,
                        'numberOfMonths' | 'percentage'
                      >)
                    | ({ __typename: 'FreeMonths' } & Pick<
                        FreeMonths,
                        'numberOfMonths'
                      >)
                    | ({ __typename: 'CostDeduction' } & Pick<
                        CostDeduction,
                        'amount'
                      >)
                    | ({ __typename: 'NoDiscount' } & Pick<NoDiscount, '_'>)
                    | ({ __typename: 'IndefinitePercentageDiscount' } & Pick<
                        IndefinitePercentageDiscount,
                        'percentageDiscount'
                      >)
                    | { __typename: 'VisibleNoDiscount' }
                    | { __typename: 'UnknownIncentive' }
                  >
                }
              referredBy?: Maybe<
                { __typename?: 'MemberReferral' } & Pick<
                  MemberReferral,
                  'memberId' | 'name' | 'status'
                >
              >
              hasReferred: Array<
                { __typename?: 'MemberReferral' } & Pick<
                  MemberReferral,
                  'memberId' | 'name' | 'status'
                >
              >
            }
        >
      }
  >
}

export type ManualRedeemCampaignMutationVariables = Exact<{
  memberId: Scalars['ID']
  request: ManualRedeemCampaignInput
}>

export type ManualRedeemCampaignMutation = { __typename?: 'MutationType' } & {
  manualRedeemCampaign: { __typename?: 'Member' } & Pick<Member, 'memberId'> & {
      referralInformation?: Maybe<
        { __typename?: 'ReferralInformation' } & {
          redeemedCampaigns: Array<
            { __typename?: 'RedeemedCampaign' } & Pick<RedeemedCampaign, 'code'>
          >
        }
      >
    }
}

export type ManualUnRedeemCampaignMutationVariables = Exact<{
  memberId: Scalars['ID']
  request: ManualUnRedeemCampaignInput
}>

export type ManualUnRedeemCampaignMutation = { __typename?: 'MutationType' } & {
  manualUnRedeemCampaign: { __typename?: 'Member' } & Pick<
    Member,
    'memberId'
  > & {
      referralInformation?: Maybe<
        { __typename?: 'ReferralInformation' } & {
          redeemedCampaigns: Array<
            { __typename?: 'RedeemedCampaign' } & Pick<RedeemedCampaign, 'code'>
          >
        }
      >
    }
}

export type CreateClaimMutationVariables = Exact<{
  memberId: Scalars['ID']
  date: Scalars['LocalDateTime']
  source: ClaimSource
}>

export type CreateClaimMutation = { __typename?: 'MutationType' } & {
  createClaim?: Maybe<
    { __typename?: 'Claim' } & Pick<
      Claim,
      'id' | 'state' | 'registrationDate'
    > & {
        member: { __typename?: 'Member' } & Pick<
          Member,
          'memberId' | 'firstName' | 'lastName'
        >
      }
  >
}

export type GetMemberClaimsQueryVariables = Exact<{
  memberId: Scalars['ID']
}>

export type GetMemberClaimsQuery = { __typename?: 'QueryType' } & {
  member?: Maybe<
    { __typename?: 'Member' } & Pick<Member, 'memberId'> & {
        claims: Array<
          { __typename?: 'Claim' } & Pick<
            Claim,
            'id' | 'registrationDate' | 'claimType' | 'state' | 'reserves'
          > & {
              member: { __typename?: 'Member' } & Pick<
                Member,
                'memberId' | 'firstName' | 'lastName'
              >
            }
        >
      }
  >
}

export type RevertTerminationMutationVariables = Exact<{
  contractId: Scalars['ID']
}>

export type RevertTerminationMutation = { __typename?: 'MutationType' } & {
  revertTermination: { __typename?: 'Contract' } & Pick<
    Contract,
    'id' | 'holderMemberId' | 'terminationDate'
  >
}

export type ActivatePendingAgreementMutationVariables = Exact<{
  contractId: Scalars['ID']
  request?: Maybe<ActivatePendingAgreementInput>
}>

export type ActivatePendingAgreementMutation = {
  __typename?: 'MutationType'
} & {
  activatePendingAgreement: { __typename?: 'Contract' } & Pick<
    Contract,
    'id' | 'holderMemberId'
  >
}

export type ChangeFromDateMutationVariables = Exact<{
  agreementId: Scalars['ID']
  request?: Maybe<ChangeFromDateInput>
}>

export type ChangeFromDateMutation = { __typename?: 'MutationType' } & {
  changeFromDate: { __typename?: 'Contract' } & Pick<Contract, 'id'> & {
      genericAgreements: Array<
        { __typename?: 'GenericAgreement' } & Pick<
          GenericAgreement,
          'id' | 'fromDate'
        >
      >
    }
}

export type ChangeTerminationDateMutationVariables = Exact<{
  contractId: Scalars['ID']
  request?: Maybe<ChangeTerminationDateInput>
}>

export type ChangeTerminationDateMutation = { __typename?: 'MutationType' } & {
  changeTerminationDate: { __typename?: 'Contract' } & Pick<
    Contract,
    'id' | 'holderMemberId' | 'terminationDate'
  >
}

export type ChangeToDateMutationVariables = Exact<{
  agreementId: Scalars['ID']
  request?: Maybe<ChangeToDateInput>
}>

export type ChangeToDateMutation = { __typename?: 'MutationType' } & {
  changeToDate: { __typename?: 'Contract' } & Pick<Contract, 'id'> & {
      genericAgreements: Array<
        { __typename?: 'GenericAgreement' } & Pick<
          GenericAgreement,
          'id' | 'toDate'
        >
      >
    }
}

export type GetContractsQueryVariables = Exact<{
  memberId: Scalars['ID']
}>

export type GetContractsQuery = { __typename?: 'QueryType' } & {
  member?: Maybe<
    { __typename?: 'Member' } & Pick<Member, 'memberId'> & {
        contracts: Array<
          { __typename?: 'Contract' } & Pick<
            Contract,
            | 'id'
            | 'holderMemberId'
            | 'holderFirstName'
            | 'holderLastName'
            | 'switchedFrom'
            | 'masterInception'
            | 'status'
            | 'isTerminated'
            | 'terminationDate'
            | 'currentAgreementId'
            | 'hasPendingAgreement'
            | 'hasQueuedRenewal'
            | 'preferredCurrency'
            | 'market'
            | 'signSource'
            | 'typeOfContract'
            | 'contractTypeName'
            | 'createdAt'
            | 'isLocked'
          > & {
              genericAgreements: Array<
                { __typename?: 'GenericAgreement' } & Pick<
                  GenericAgreement,
                  | 'id'
                  | 'fromDate'
                  | 'toDate'
                  | 'certificateUrl'
                  | 'status'
                  | 'typeOfContract'
                  | 'numberCoInsured'
                  | 'squareMeters'
                  | 'ancillaryArea'
                  | 'yearOfConstruction'
                  | 'numberOfBathrooms'
                  | 'isSubleted'
                  | 'lineOfBusinessName'
                  | 'carrier'
                  | 'partner'
                  | 'createdAt'
                > & {
                    premium: { __typename?: 'MonetaryAmountV2' } & Pick<
                      MonetaryAmountV2,
                      'amount' | 'currency'
                    >
                    address?: Maybe<
                      { __typename?: 'Address' } & Pick<
                        Address,
                        'street' | 'city' | 'postalCode'
                      >
                    >
                    extraBuildings?: Maybe<
                      Array<
                        { __typename?: 'ExtraBuilding' } & Pick<
                          ExtraBuilding,
                          | 'id'
                          | 'type'
                          | 'area'
                          | 'displayName'
                          | 'hasWaterConnected'
                        >
                      >
                    >
                  }
              >
              renewal?: Maybe<
                { __typename?: 'Renewal' } & Pick<
                  Renewal,
                  'renewalDate' | 'draftCertificateUrl' | 'draftOfAgreementId'
                >
              >
            }
        >
      }
  >
}

export type GetTrialsQueryVariables = Exact<{
  memberId: Scalars['ID']
}>

export type GetTrialsQuery = { __typename?: 'QueryType' } & {
  member?: Maybe<
    { __typename?: 'Member' } & Pick<Member, 'memberId'> & {
        trials: Array<
          { __typename?: 'Trial' } & Pick<
            Trial,
            | 'id'
            | 'fromDate'
            | 'toDate'
            | 'displayName'
            | 'partner'
            | 'certificateUrl'
            | 'status'
            | 'createdAt'
          > & {
              address: { __typename?: 'TrialAddress' } & Pick<
                TrialAddress,
                | 'street'
                | 'city'
                | 'zipCode'
                | 'livingSpace'
                | 'apartmentNo'
                | 'floor'
              >
            }
        >
      }
  >
}

export type RegenerateCertificateMutationVariables = Exact<{
  agreementId: Scalars['ID']
}>

export type RegenerateCertificateMutation = { __typename?: 'MutationType' } & {
  regenerateCertificate: { __typename?: 'Contract' } & Pick<Contract, 'id'> & {
      genericAgreements: Array<
        { __typename?: 'GenericAgreement' } & Pick<
          GenericAgreement,
          'id' | 'certificateUrl'
        >
      >
    }
}

export type SafelyEditAgreementMutationVariables = Exact<{
  agreementId: Scalars['ID']
  request: SafelyEditAgreementInput
}>

export type SafelyEditAgreementMutation = { __typename?: 'MutationType' } & {
  safelyEdit: { __typename?: 'Contract' } & {
    genericAgreements: Array<
      { __typename?: 'GenericAgreement' } & Pick<GenericAgreement, 'id'> & {
          address?: Maybe<{ __typename?: 'Address' } & Pick<Address, 'street'>>
        }
    >
  }
}

export type TerminateContractMutationVariables = Exact<{
  contractId: Scalars['ID']
  request?: Maybe<TerminateContractInput>
}>

export type TerminateContractMutation = { __typename?: 'MutationType' } & {
  terminateContract: { __typename?: 'Contract' } & Pick<
    Contract,
    'id' | 'holderMemberId' | 'terminationDate'
  >
}

export type GetMemberNameQueryVariables = Exact<{
  memberId: Scalars['ID']
}>

export type GetMemberNameQuery = { __typename?: 'QueryType' } & {
  member?: Maybe<
    { __typename?: 'Member' } & Pick<
      Member,
      'memberId' | 'firstName' | 'lastName'
    >
  >
}

export type GetPersonQueryVariables = Exact<{
  memberId: Scalars['ID']
}>

export type GetPersonQuery = { __typename?: 'QueryType' } & {
  member?: Maybe<
    { __typename?: 'Member' } & Pick<Member, 'memberId' | 'pickedLocale'> & {
        contractMarketInfo?: Maybe<
          { __typename?: 'ContractMarketInfo' } & Pick<
            ContractMarketInfo,
            'market'
          >
        >
        person?: Maybe<
          { __typename?: 'Person' } & Pick<Person, 'debtFlag'> & {
              status?: Maybe<
                { __typename?: 'PersonStatus' } & Pick<
                  PersonStatus,
                  'flag' | 'whitelisted'
                >
              >
              whitelisted?: Maybe<
                { __typename?: 'Whitelisted' } & Pick<
                  Whitelisted,
                  'whitelistedAt' | 'whitelistedBy'
                >
              >
            }
        >
      }
  >
}

export type WhitelistMemberMutationVariables = Exact<{
  memberId: Scalars['ID']
}>

export type WhitelistMemberMutation = { __typename?: 'MutationType' } & {
  whitelistMember: { __typename?: 'Member' } & Pick<Member, 'memberId'>
}

export type FileUploadsQueryQueryVariables = Exact<{
  memberId: Scalars['ID']
}>

export type FileUploadsQueryQuery = { __typename?: 'QueryType' } & {
  member?: Maybe<
    { __typename?: 'Member' } & Pick<Member, 'memberId'> & {
        fileUploads: Array<
          { __typename?: 'FileUpload' } & Pick<
            FileUpload,
            'fileUploadUrl' | 'memberId' | 'timestamp' | 'mimeType'
          >
        >
      }
  >
}

export type EditMemberInfoMutationVariables = Exact<{
  request: EditMemberInfoInput
}>

export type EditMemberInfoMutation = { __typename?: 'MutationType' } & {
  editMemberInfo: { __typename?: 'Member' } & Pick<
    Member,
    'memberId' | 'firstName' | 'lastName' | 'email' | 'phoneNumber'
  >
}

export type GetMemberInfoQueryVariables = Exact<{
  memberId: Scalars['ID']
}>

export type GetMemberInfoQuery = { __typename?: 'QueryType' } & {
  member?: Maybe<
    { __typename?: 'Member' } & Pick<
      Member,
      | 'memberId'
      | 'email'
      | 'phoneNumber'
      | 'firstName'
      | 'lastName'
      | 'birthDate'
      | 'personalNumber'
      | 'fraudulentStatus'
      | 'fraudulentStatusDescription'
      | 'status'
      | 'signedOn'
      | 'createdOn'
      | 'pickedLocale'
    > & {
        contractMarketInfo?: Maybe<
          { __typename?: 'ContractMarketInfo' } & Pick<
            ContractMarketInfo,
            'market'
          >
        >
        claims: Array<
          { __typename?: 'Claim' } & Pick<
            Claim,
            'id' | 'registrationDate' | 'state' | 'claimType'
          >
        >
      }
  >
}

export type SetFraudulentStatusMutationVariables = Exact<{
  memberId: Scalars['ID']
  request: MemberFraudulentStatusInput
}>

export type SetFraudulentStatusMutation = { __typename?: 'MutationType' } & {
  setFraudulentStatus: { __typename?: 'Member' } & Pick<
    Member,
    'memberId' | 'fraudulentStatus' | 'fraudulentStatusDescription'
  >
}

export type CreatePaymentCompletionLinkMutationVariables = Exact<{
  memberId: Scalars['ID']
}>

export type CreatePaymentCompletionLinkMutation = {
  __typename?: 'MutationType'
} & {
  createPaymentCompletionLink: {
    __typename?: 'PaymentCompletionResponse'
  } & Pick<PaymentCompletionResponse, 'url'>
}

export type GetContractMarketInfoQueryVariables = Exact<{
  memberId: Scalars['ID']
}>

export type GetContractMarketInfoQuery = { __typename?: 'QueryType' } & {
  member?: Maybe<
    { __typename?: 'Member' } & Pick<Member, 'memberId'> & {
        contractMarketInfo?: Maybe<
          { __typename?: 'ContractMarketInfo' } & Pick<
            ContractMarketInfo,
            'market' | 'preferredCurrency'
          >
        >
      }
  >
}

export type GetMemberTransactionsQueryVariables = Exact<{
  id: Scalars['ID']
}>

export type GetMemberTransactionsQuery = { __typename?: 'QueryType' } & {
  member?: Maybe<
    { __typename?: 'Member' } & Pick<Member, 'memberId'> & {
        contractMarketInfo?: Maybe<
          { __typename?: 'ContractMarketInfo' } & Pick<
            ContractMarketInfo,
            'market' | 'preferredCurrency'
          >
        >
        directDebitStatus?: Maybe<
          { __typename?: 'DirectDebitStatus' } & Pick<
            DirectDebitStatus,
            'activated'
          >
        >
        payoutMethodStatus?: Maybe<
          { __typename?: 'PayoutMethodStatus' } & Pick<
            PayoutMethodStatus,
            'activated'
          >
        >
        identity?: Maybe<
          { __typename?: 'Identity' } & Pick<
            Identity,
            'firstName' | 'lastName'
          > & {
              nationalIdentification: {
                __typename?: 'NationalIdentification'
              } & Pick<NationalIdentification, 'identification' | 'nationality'>
            }
        >
        transactions?: Maybe<
          Array<
            Maybe<
              { __typename?: 'Transaction' } & Pick<
                Transaction,
                'id' | 'timestamp' | 'type' | 'status'
              > & {
                  amount?: Maybe<
                    { __typename?: 'MonetaryAmountV2' } & Pick<
                      MonetaryAmountV2,
                      'amount' | 'currency'
                    >
                  >
                }
            >
          >
        >
      }
  >
}

export type PayoutMemberMutationVariables = Exact<{
  memberId: Scalars['ID']
  request: PayoutMemberInput
}>

export type PayoutMemberMutation = { __typename?: 'MutationType' } & {
  payoutMember?: Maybe<
    { __typename?: 'Transaction' } & Pick<
      Transaction,
      'id' | 'timestamp' | 'type' | 'status'
    > & {
        amount?: Maybe<
          { __typename?: 'MonetaryAmountV2' } & Pick<
            MonetaryAmountV2,
            'amount' | 'currency'
          >
        >
      }
  >
}

export type AddAgreementFromQuoteMutationVariables = Exact<{
  id: Scalars['ID']
  contractId: Scalars['ID']
  activeFrom?: Maybe<Scalars['LocalDate']>
  activeTo?: Maybe<Scalars['LocalDate']>
  previousAgreementActiveTo?: Maybe<Scalars['LocalDate']>
}>

export type AddAgreementFromQuoteMutation = { __typename?: 'MutationType' } & {
  addAgreementFromQuote: { __typename?: 'Quote' } & Pick<Quote, 'id'>
}

export type CreateQuoteForMemberBySchemaMutationVariables = Exact<{
  memberId: Scalars['ID']
  schemaData: Scalars['JSON']
  bypassUnderwritingGuidelines: Scalars['Boolean']
}>

export type CreateQuoteForMemberBySchemaMutation = {
  __typename?: 'MutationType'
} & {
  createQuoteForMemberBySchema: { __typename?: 'Quote' } & Pick<Quote, 'id'>
}

export type CreateQuoteFromAgreementMutationVariables = Exact<{
  agreementId: Scalars['ID']
  memberId: Scalars['ID']
}>

export type CreateQuoteFromAgreementMutation = {
  __typename?: 'MutationType'
} & { createQuoteFromAgreement: { __typename?: 'Quote' } & Pick<Quote, 'id'> }

export type GetQuotesQueryVariables = Exact<{
  memberId: Scalars['ID']
}>

export type GetQuotesQuery = { __typename?: 'QueryType' } & {
  member?: Maybe<
    { __typename?: 'Member' } & Pick<Member, 'memberId' | 'pickedLocale'> & {
        contractMarketInfo?: Maybe<
          { __typename?: 'ContractMarketInfo' } & Pick<
            ContractMarketInfo,
            'market' | 'preferredCurrency'
          >
        >
        quotes: Array<
          { __typename?: 'Quote' } & Pick<
            Quote,
            | 'id'
            | 'memberId'
            | 'price'
            | 'currency'
            | 'productType'
            | 'state'
            | 'startDate'
            | 'validity'
            | 'isComplete'
            | 'createdAt'
            | 'breachedUnderwritingGuidelines'
            | 'originatingProductId'
            | 'signedProductId'
            | 'isReadyToSign'
            | 'schema'
            | 'schemaData'
          >
        >
      }
  >
}

export type GetSchemaForContractTypeQueryVariables = Exact<{
  contractType: Scalars['String']
}>

export type GetSchemaForContractTypeQuery = { __typename?: 'QueryType' } & Pick<
  QueryType,
  'quoteSchemaForContractType'
>

export type OverrideQuotePriceMutationVariables = Exact<{
  input: OverrideQuotePriceInput
}>

export type OverrideQuotePriceMutation = { __typename?: 'MutationType' } & {
  overrideQuotePrice: { __typename?: 'Quote' } & Pick<Quote, 'id'>
}

export type SignQuoteForNewContractMutationVariables = Exact<{
  quoteId: Scalars['ID']
  activationDate?: Maybe<Scalars['LocalDate']>
}>

export type SignQuoteForNewContractMutation = {
  __typename?: 'MutationType'
} & { signQuoteForNewContract: { __typename?: 'Quote' } & Pick<Quote, 'id'> }

export type UpdateQuoteBySchemaMutationVariables = Exact<{
  quoteId: Scalars['ID']
  schemaData: Scalars['JSON']
  bypassUnderwritingGuidelines: Scalars['Boolean']
}>

export type UpdateQuoteBySchemaMutation = { __typename?: 'MutationType' } & {
  updateQuoteBySchema: { __typename?: 'Quote' } & Pick<Quote, 'id'>
}

export type MemberSearchQueryVariables = Exact<{
  query: Scalars['String']
  options: MemberSearchOptions
}>

export type MemberSearchQuery = { __typename?: 'QueryType' } & {
  memberSearch: { __typename?: 'MemberSearchResult' } & Pick<
    MemberSearchResult,
    'page' | 'totalPages'
  > & {
      members: Array<
        { __typename?: 'Member' } & Pick<
          Member,
          | 'memberId'
          | 'firstName'
          | 'lastName'
          | 'status'
          | 'signedOn'
          | 'birthDate'
        > & {
            contractMarketInfo?: Maybe<
              { __typename?: 'ContractMarketInfo' } & Pick<
                ContractMarketInfo,
                'market'
              >
            >
            contracts: Array<
              { __typename?: 'Contract' } & Pick<
                Contract,
                'status' | 'masterInception' | 'terminationDate'
              >
            >
          }
      >
    }
}

export type AnswerQuestionMutationVariables = Exact<{
  memberId: Scalars['ID']
  answer: Scalars['String']
}>

export type AnswerQuestionMutation = { __typename?: 'MutationType' } & Pick<
  MutationType,
  'answerQuestion'
>

export type GetQuestionsGroupsQueryVariables = Exact<{ [key: string]: never }>

export type GetQuestionsGroupsQuery = { __typename?: 'QueryType' } & {
  questionGroups: Array<
    { __typename?: 'QuestionGroup' } & Pick<
      QuestionGroup,
      'id' | 'memberId'
    > & {
        questions: Array<
          { __typename?: 'Question' } & Pick<
            Question,
            'id' | 'messageJsonString' | 'timestamp'
          >
        >
        member?: Maybe<
          { __typename?: 'Member' } & Pick<
            Member,
            'memberId' | 'firstName' | 'lastName' | 'pickedLocale'
          > & {
              contractMarketInfo?: Maybe<
                { __typename?: 'ContractMarketInfo' } & Pick<
                  ContractMarketInfo,
                  'market'
                >
              >
              claims: Array<
                { __typename?: 'Claim' } & Pick<Claim, 'id' | 'state'>
              >
            }
        >
      }
  >
}

export type MarkQuestionAsResolvedMutationVariables = Exact<{
  memberId: Scalars['ID']
}>

export type MarkQuestionAsResolvedMutation = {
  __typename?: 'MutationType'
} & Pick<MutationType, 'markQuestionAsResolved'>

export type MemberNameAndContractMarketInfoQueryVariables = Exact<{
  memberId: Scalars['ID']
}>

export type MemberNameAndContractMarketInfoQuery = {
  __typename?: 'QueryType'
} & {
  member?: Maybe<
    { __typename?: 'Member' } & Pick<
      Member,
      'memberId' | 'firstName' | 'lastName' | 'pickedLocale'
    > & {
        contractMarketInfo?: Maybe<
          { __typename?: 'ContractMarketInfo' } & Pick<
            ContractMarketInfo,
            'market'
          >
        >
      }
  >
}

export type SendMessageMutationVariables = Exact<{
  input: SendMessageInput
}>

export type SendMessageMutation = { __typename?: 'MutationType' } & {
  sendMessage:
    | ({ __typename?: 'SendMessageSuccessful' } & Pick<
        SendMessageSuccessful,
        'memberId'
      >)
    | ({ __typename?: 'SendMessageFailed' } & Pick<
        SendMessageFailed,
        'memberId' | 'errorCode' | 'errorMessage'
      >)
}

export type GrantResourceAccessMutationVariables = Exact<{
  resourceId: Scalars['ID']
  grantHolder: Scalars['String']
  grantHolderType: GrantHolderType
}>

export type GrantResourceAccessMutation = { __typename?: 'MutationType' } & {
  grantResourceAccess: { __typename?: 'ResourceAccessInformation' } & Pick<
    ResourceAccessInformation,
    'resourceId' | 'rolesGranted' | 'rolesRestricted'
  > & {
      usersGranted: Array<
        { __typename?: 'User' } & Pick<
          User,
          'id' | 'email' | 'fullName' | 'role'
        >
      >
      usersRestricted: Array<
        { __typename?: 'User' } & Pick<
          User,
          'id' | 'email' | 'fullName' | 'role'
        >
      >
    }
}

export type ReleaseResourceAccessMutationVariables = Exact<{
  resourceId: Scalars['ID']
}>

export type ReleaseResourceAccessMutation = {
  __typename?: 'MutationType'
} & Pick<MutationType, 'releaseResourceAccess'>

export type ResourceAccessInformationQueryVariables = Exact<{
  resourceId: Scalars['String']
}>

export type ResourceAccessInformationQuery = { __typename?: 'QueryType' } & {
  resourceAccess?: Maybe<
    { __typename?: 'ResourceAccessInformation' } & Pick<
      ResourceAccessInformation,
      'resourceId' | 'restrictedByMe' | 'rolesGranted' | 'rolesRestricted'
    > & {
        restrictedBy: { __typename?: 'User' } & Pick<
          User,
          'id' | 'email' | 'fullName' | 'role'
        >
        usersGranted: Array<
          { __typename?: 'User' } & Pick<
            User,
            'id' | 'email' | 'fullName' | 'role'
          >
        >
        usersRestricted: Array<
          { __typename?: 'User' } & Pick<
            User,
            'id' | 'email' | 'fullName' | 'role'
          >
        >
      }
  >
}

export type AssignCampaignToPartnerFreeMonthsMutationVariables = Exact<{
  request?: Maybe<AssignVoucherFreeMonths>
}>

export type AssignCampaignToPartnerFreeMonthsMutation = {
  __typename?: 'MutationType'
} & Pick<MutationType, 'assignCampaignToPartnerFreeMonths'>

export type AssignCampaignToPartnerNoDiscountMutationVariables = Exact<{
  request?: Maybe<AssignVoucherNoDiscount>
}>

export type AssignCampaignToPartnerNoDiscountMutation = {
  __typename?: 'MutationType'
} & Pick<MutationType, 'assignCampaignToPartnerNoDiscount'>

export type AssignCampaignToPartnerPercentageDiscountMutationVariables = Exact<{
  request?: Maybe<AssignVoucherPercentageDiscount>
}>

export type AssignCampaignToPartnerPercentageDiscountMutation = {
  __typename?: 'MutationType'
} & Pick<MutationType, 'assignCampaignToPartnerPercentageDiscount'>

export type AssignCampaignToPartnerVisibleNoDiscountMutationVariables = Exact<{
  request?: Maybe<AssignVoucherVisibleNoDiscount>
}>

export type AssignCampaignToPartnerVisibleNoDiscountMutation = {
  __typename?: 'MutationType'
} & Pick<MutationType, 'assignCampaignToPartnerVisibleNoDiscount'>

export type AvailableCampaignCodeTypesQueryVariables = Exact<{
  [key: string]: never
}>

export type AvailableCampaignCodeTypesQuery = {
  __typename?: 'QueryType'
} & Pick<QueryType, 'availableCampaignCodeTypes'>

export type CreateCampaignPartnerMutationVariables = Exact<{
  partnerId: Scalars['ID']
  partnerName: Scalars['String']
}>

export type CreateCampaignPartnerMutation = {
  __typename?: 'MutationType'
} & Pick<MutationType, 'createCampaignPartner'>

export type GetPartnerCampaignOwnersQueryVariables = Exact<{
  [key: string]: never
}>

export type GetPartnerCampaignOwnersQuery = { __typename?: 'QueryType' } & {
  getPartnerCampaignOwners: Array<
    { __typename?: 'CampaignOwnerPartner' } & Pick<
      CampaignOwnerPartner,
      'partnerId'
    >
  >
}

export type FindPartnerCampaignsQueryVariables = Exact<{
  input: CampaignFilter
}>

export type FindPartnerCampaignsQuery = { __typename?: 'QueryType' } & {
  findPartnerCampaigns: Array<
    { __typename?: 'VoucherCampaign' } & Pick<
      VoucherCampaign,
      | 'id'
      | 'campaignCode'
      | 'partnerId'
      | 'partnerName'
      | 'validFrom'
      | 'validTo'
      | 'codeType'
    > & {
        incentive?: Maybe<
          | ({ __typename?: 'MonthlyPercentageDiscountFixedPeriod' } & Pick<
              MonthlyPercentageDiscountFixedPeriod,
              'numberOfMonths' | 'percentage'
            >)
          | ({ __typename?: 'FreeMonths' } & Pick<FreeMonths, 'numberOfMonths'>)
          | ({ __typename?: 'CostDeduction' } & Pick<CostDeduction, 'amount'>)
          | { __typename: 'NoDiscount' }
          | ({ __typename?: 'IndefinitePercentageDiscount' } & Pick<
              IndefinitePercentageDiscount,
              'percentageDiscount'
            >)
          | { __typename?: 'VisibleNoDiscount' }
          | { __typename?: 'UnknownIncentive' }
        >
      }
  >
}

export type SetCampaignCodeTypeMutationVariables = Exact<{
  id: Scalars['ID']
  codeType: Scalars['String']
}>

export type SetCampaignCodeTypeMutation = { __typename?: 'MutationType' } & {
  setCampaignCodeType?: Maybe<
    { __typename?: 'VoucherCampaign' } & Pick<
      VoucherCampaign,
      | 'id'
      | 'campaignCode'
      | 'partnerId'
      | 'partnerName'
      | 'validFrom'
      | 'validTo'
      | 'codeType'
    > & {
        incentive?: Maybe<
          | ({ __typename?: 'MonthlyPercentageDiscountFixedPeriod' } & Pick<
              MonthlyPercentageDiscountFixedPeriod,
              'numberOfMonths' | 'percentage'
            >)
          | ({ __typename?: 'FreeMonths' } & Pick<FreeMonths, 'numberOfMonths'>)
          | ({ __typename?: 'CostDeduction' } & Pick<CostDeduction, 'amount'>)
          | { __typename: 'NoDiscount' }
          | ({ __typename?: 'IndefinitePercentageDiscount' } & Pick<
              IndefinitePercentageDiscount,
              'percentageDiscount'
            >)
          | { __typename?: 'VisibleNoDiscount' }
          | { __typename?: 'UnknownIncentive' }
        >
      }
  >
}

export type PaymentScheduleQueryQueryVariables = Exact<{
  month: Scalars['YearMonth']
}>

export type PaymentScheduleQueryQuery = { __typename?: 'QueryType' } & {
  paymentSchedule?: Maybe<
    Array<
      Maybe<
        { __typename?: 'SchedulerState' } & Pick<
          SchedulerState,
          'id' | 'status' | 'amount'
        > & {
            member?: Maybe<
              { __typename?: 'Member' } & Pick<
                Member,
                'memberId' | 'firstName' | 'lastName'
              > & {
                  monthlySubscription?: Maybe<
                    { __typename?: 'MonthlySubscription' } & Pick<
                      MonthlySubscription,
                      'amount'
                    >
                  >
                  account?: Maybe<
                    { __typename?: 'Account' } & {
                      currentBalance: {
                        __typename?: 'MonetaryAmountV2'
                      } & Pick<MonetaryAmountV2, 'amount' | 'currency'>
                    }
                  >
                }
            >
          }
      >
    >
  >
}

export type CreateClaimPropertyOptionMutationVariables = Exact<{
  name: Scalars['String']
}>

export type CreateClaimPropertyOptionMutation = {
  __typename?: 'MutationType'
} & {
  createClaimPropertyOption: { __typename?: 'ClaimPropertyOption' } & Pick<
    ClaimPropertyOption,
    'id' | 'name'
  >
}

export type CreateClaimPropertyMutationVariables = Exact<{
  name: Scalars['String']
}>

export type CreateClaimPropertyMutation = { __typename?: 'MutationType' } & {
  createClaimProperty: { __typename?: 'ClaimProperty' } & Pick<
    ClaimProperty,
    'id' | 'name'
  >
}

export type CreateClaimTypeRelationMutationVariables = Exact<{
  request?: Maybe<CreateClaimTypeRelationInput>
}>

export type CreateClaimTypeRelationMutation = {
  __typename?: 'MutationType'
} & {
  createClaimTypeRelation: { __typename?: 'ClaimTypeRelation' } & Pick<
    ClaimTypeRelation,
    'id' | 'claimType'
  > & {
      property: { __typename?: 'ClaimProperty' } & Pick<
        ClaimProperty,
        'id' | 'name'
      >
      propertyOption: { __typename?: 'ClaimPropertyOption' } & Pick<
        ClaimPropertyOption,
        'id' | 'name'
      >
    }
}

export type DeleteClaimTypeRelationMutationVariables = Exact<{
  id: Scalars['ID']
}>

export type DeleteClaimTypeRelationMutation = {
  __typename?: 'MutationType'
} & Pick<MutationType, 'deleteClaimTypeRelation'>

export type DeprecateClaimPropertyOptionMutationVariables = Exact<{
  id: Scalars['ID']
}>

export type DeprecateClaimPropertyOptionMutation = {
  __typename?: 'MutationType'
} & Pick<MutationType, 'deprecateClaimPropertyOption'>

export type DeprecateClaimPropertyMutationVariables = Exact<{
  id: Scalars['ID']
}>

export type DeprecateClaimPropertyMutation = {
  __typename?: 'MutationType'
} & Pick<MutationType, 'deprecateClaimProperty'>

export type UpdateClaimPropertyOptionMutationVariables = Exact<{
  id: Scalars['ID']
  name: Scalars['String']
}>

export type UpdateClaimPropertyOptionMutation = {
  __typename?: 'MutationType'
} & {
  updateClaimPropertyOption: { __typename?: 'ClaimPropertyOption' } & Pick<
    ClaimPropertyOption,
    'id' | 'name'
  >
}

export type UpdateClaimPropertyMutationVariables = Exact<{
  id: Scalars['ID']
  name: Scalars['String']
}>

export type UpdateClaimPropertyMutation = { __typename?: 'MutationType' } & {
  updateClaimProperty: { __typename?: 'ClaimProperty' } & Pick<
    ClaimProperty,
    'id' | 'name'
  >
}

export type GetClaimPropertiesQueryVariables = Exact<{ [key: string]: never }>

export type GetClaimPropertiesQuery = { __typename?: 'QueryType' } & {
  claimProperties: Array<
    { __typename?: 'ClaimProperty' } & Pick<ClaimProperty, 'id' | 'name'>
  >
}

export type GetClaimPropertyOptionQueryVariables = Exact<{
  id: Scalars['ID']
}>

export type GetClaimPropertyOptionQuery = { __typename?: 'QueryType' } & {
  claimPropertyOption: { __typename?: 'ClaimPropertyOption' } & Pick<
    ClaimPropertyOption,
    'id' | 'name'
  >
}

export type GetClaimPropertyOptionsQueryVariables = Exact<{
  [key: string]: never
}>

export type GetClaimPropertyOptionsQuery = { __typename?: 'QueryType' } & {
  claimPropertyOptions: Array<
    { __typename?: 'ClaimPropertyOption' } & Pick<
      ClaimPropertyOption,
      'id' | 'name'
    >
  >
}

export type GetClaimPropertyQueryVariables = Exact<{
  id: Scalars['ID']
}>

export type GetClaimPropertyQuery = { __typename?: 'QueryType' } & {
  claimProperty: { __typename?: 'ClaimProperty' } & Pick<
    ClaimProperty,
    'id' | 'name'
  >
}

export type GetClaimTypeRelationsQueryVariables = Exact<{
  [key: string]: never
}>

export type GetClaimTypeRelationsQuery = { __typename?: 'QueryType' } & {
  claimTypeRelations: Array<
    { __typename?: 'ClaimTypeRelation' } & Pick<
      ClaimTypeRelation,
      'id' | 'claimType'
    > & {
        property: { __typename?: 'ClaimProperty' } & Pick<
          ClaimProperty,
          'id' | 'name'
        >
        propertyOption: { __typename?: 'ClaimPropertyOption' } & Pick<
          ClaimPropertyOption,
          'id' | 'name'
        >
      }
  >
}

export type GetClaimTypeTemplateQueryVariables = Exact<{
  claimType: Scalars['String']
}>

export type GetClaimTypeTemplateQuery = { __typename?: 'QueryType' } & {
  claimTypeTemplate?: Maybe<
    { __typename?: 'ClaimTypeTemplate' } & Pick<
      ClaimTypeTemplate,
      'claimType'
    > & {
        properties: Array<
          { __typename?: 'ClaimPropertyTemplate' } & Pick<
            ClaimPropertyTemplate,
            'propertyId' | 'name'
          > & {
              options: Array<
                { __typename?: 'ClaimPropertyOption' } & Pick<
                  ClaimPropertyOption,
                  'id' | 'name'
                >
              >
            }
        >
      }
  >
}

export type GetClaimTypeTemplatesQueryVariables = Exact<{
  [key: string]: never
}>

export type GetClaimTypeTemplatesQuery = { __typename?: 'QueryType' } & {
  claimTypeTemplates: Array<
    { __typename?: 'ClaimTypeTemplate' } & Pick<
      ClaimTypeTemplate,
      'claimType'
    > & {
        properties: Array<
          { __typename?: 'ClaimPropertyTemplate' } & Pick<
            ClaimPropertyTemplate,
            'propertyId' | 'name'
          > & {
              options: Array<
                { __typename?: 'ClaimPropertyOption' } & Pick<
                  ClaimPropertyOption,
                  'id' | 'name'
                >
              >
            }
        >
      }
  >
}

export type GetClaimTypesQueryVariables = Exact<{ [key: string]: never }>

export type GetClaimTypesQuery = { __typename?: 'QueryType' } & Pick<
  QueryType,
  'claimTypes'
>

export type AvailableEmployeeRolesQueryVariables = Exact<{
  [key: string]: never
}>

export type AvailableEmployeeRolesQuery = { __typename?: 'QueryType' } & Pick<
  QueryType,
  'availableEmployeeRoles'
>

export type CreateEmployeeMutationVariables = Exact<{
  email: Scalars['String']
  role: Scalars['String']
}>

export type CreateEmployeeMutation = { __typename?: 'MutationType' } & {
  createEmployee: { __typename?: 'Employee' } & Pick<
    Employee,
    'id' | 'email' | 'role' | 'firstGrantedAt'
  >
}

export type EmployeesQueryVariables = Exact<{ [key: string]: never }>

export type EmployeesQuery = { __typename?: 'QueryType' } & {
  employees: Array<
    { __typename?: 'Employee' } & Pick<
      Employee,
      'id' | 'email' | 'role' | 'firstGrantedAt'
    >
  >
}

export type RemoveEmployeeMutationVariables = Exact<{
  id: Scalars['ID']
}>

export type RemoveEmployeeMutation = { __typename?: 'MutationType' } & Pick<
  MutationType,
  'removeEmployee'
>

export type UpdateEmployeeRoleMutationVariables = Exact<{
  id: Scalars['ID']
  role: Scalars['String']
}>

export type UpdateEmployeeRoleMutation = { __typename?: 'MutationType' } & {
  updateEmployeeRole: { __typename?: 'Employee' } & Pick<
    Employee,
    'id' | 'email' | 'role' | 'firstGrantedAt'
  >
}

export type GetSwitcherEmailsQueryVariables = Exact<{ [key: string]: never }>

export type GetSwitcherEmailsQuery = { __typename?: 'QueryType' } & {
  switchableSwitcherEmails: Array<
    { __typename?: 'SwitchableSwitcherEmail' } & Pick<
      SwitchableSwitcherEmail,
      | 'id'
      | 'switcherCompany'
      | 'queuedAt'
      | 'sentAt'
      | 'remindedAt'
      | 'cancellationDate'
      | 'switcherType'
      | 'note'
    > & {
        member: { __typename?: 'Member' } & Pick<
          Member,
          'memberId' | 'signedOn' | 'firstName' | 'lastName' | 'email'
        >
        contract?: Maybe<
          { __typename?: 'Contract' } & Pick<
            Contract,
            | 'id'
            | 'currentAgreementId'
            | 'masterInception'
            | 'status'
            | 'contractTypeName'
            | 'isTerminated'
            | 'terminationDate'
          >
        >
      }
  >
}

export type MarkSwitcherEmailAsRemindedMutationVariables = Exact<{
  id: Scalars['ID']
}>

export type MarkSwitcherEmailAsRemindedMutation = {
  __typename?: 'MutationType'
} & {
  markSwitchableSwitcherEmailAsReminded: {
    __typename?: 'SwitchableSwitcherEmail'
  } & Pick<SwitchableSwitcherEmail, 'id'>
}

export type GetMeQueryVariables = Exact<{ [key: string]: never }>

export type GetMeQuery = { __typename?: 'QueryType' } & {
  me: { __typename?: 'Me' } & Pick<Me, 'scopes' | 'role'> & {
      user: { __typename?: 'User' } & Pick<
        User,
        'id' | 'email' | 'fullName' | 'phoneNumber' | 'role'
      >
      settings: Array<
        { __typename?: 'UserSetting' } & Pick<UserSetting, 'key' | 'value'>
      >
    }
}

export type UpdateUserSettingsMutationVariables = Exact<{
  settings: Array<UpsertUserSettingInput> | UpsertUserSettingInput
}>

export type UpdateUserSettingsMutation = { __typename?: 'MutationType' } & {
  upsertUserSettings: Array<
    { __typename?: 'UserSetting' } & Pick<UserSetting, 'key' | 'value'>
  >
}

export type UpdateUserMutationVariables = Exact<{
  input: UpdateUserInput
}>

export type UpdateUserMutation = { __typename?: 'MutationType' } & {
  updateUser: { __typename?: 'User' } & Pick<
    User,
    'id' | 'fullName' | 'email' | 'phoneNumber'
  >
}

export type UsersOnPathQueryVariables = Exact<{
  path: Scalars['String']
}>

export type UsersOnPathQuery = { __typename?: 'QueryType' } & {
  usersOnPath: Array<
    { __typename?: 'User' } & Pick<
      User,
      'id' | 'fullName' | 'email' | 'latestPresence'
    >
  >
}

export type UsersQueryVariables = Exact<{ [key: string]: never }>

export type UsersQuery = { __typename?: 'QueryType' } & {
  users: Array<
    { __typename?: 'User' } & Pick<
      User,
      'id' | 'fullName' | 'role' | 'email' | 'latestPresence' | 'latestLocation'
    >
  >
}

export const SetClaimDateDocument = gql`
  mutation SetClaimDate($id: ID!, $date: LocalDate!) {
    setDateOfOccurrence(id: $id, date: $date) {
      id
      dateOfOccurrence
      contract {
        id
        market
        currentAgreementId
        genericAgreements {
          id
          address {
            street
            postalCode
            city
          }
          lineOfBusinessName
          premium {
            amount
            currency
          }
          status
          carrier
          typeOfContract
          createdAt
        }
        contractTypeName
        preferredCurrency
        typeOfContract
        masterInception
        terminationDate
      }
      agreement {
        id
        address {
          street
          postalCode
          city
        }
        typeOfContract
        lineOfBusinessName
        carrier
      }
    }
  }
`
export type SetClaimDateMutationFn = ApolloReactCommon.MutationFunction<
  SetClaimDateMutation,
  SetClaimDateMutationVariables
>

/**
 * __useSetClaimDateMutation__
 *
 * To run a mutation, you first call `useSetClaimDateMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useSetClaimDateMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [setClaimDateMutation, { data, loading, error }] = useSetClaimDateMutation({
 *   variables: {
 *      id: // value for 'id'
 *      date: // value for 'date'
 *   },
 * });
 */
export function useSetClaimDateMutation(
  baseOptions?: ApolloReactHooks.MutationHookOptions<
    SetClaimDateMutation,
    SetClaimDateMutationVariables
  >,
) {
  const options = { ...defaultOptions, ...baseOptions }
  return ApolloReactHooks.useMutation<
    SetClaimDateMutation,
    SetClaimDateMutationVariables
  >(SetClaimDateDocument, options)
}
export type SetClaimDateMutationHookResult = ReturnType<
  typeof useSetClaimDateMutation
>
export type SetClaimDateMutationResult = ApolloReactCommon.MutationResult<
  SetClaimDateMutation
>
export type SetClaimDateMutationOptions = ApolloReactCommon.BaseMutationOptions<
  SetClaimDateMutation,
  SetClaimDateMutationVariables
>
export const SetClaimOutcomeDocument = gql`
  mutation SetClaimOutcome($id: ID!, $outcome: String) {
    setClaimOutcome(id: $id, outcome: $outcome) {
      id
      outcome
    }
  }
`
export type SetClaimOutcomeMutationFn = ApolloReactCommon.MutationFunction<
  SetClaimOutcomeMutation,
  SetClaimOutcomeMutationVariables
>

/**
 * __useSetClaimOutcomeMutation__
 *
 * To run a mutation, you first call `useSetClaimOutcomeMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useSetClaimOutcomeMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [setClaimOutcomeMutation, { data, loading, error }] = useSetClaimOutcomeMutation({
 *   variables: {
 *      id: // value for 'id'
 *      outcome: // value for 'outcome'
 *   },
 * });
 */
export function useSetClaimOutcomeMutation(
  baseOptions?: ApolloReactHooks.MutationHookOptions<
    SetClaimOutcomeMutation,
    SetClaimOutcomeMutationVariables
  >,
) {
  const options = { ...defaultOptions, ...baseOptions }
  return ApolloReactHooks.useMutation<
    SetClaimOutcomeMutation,
    SetClaimOutcomeMutationVariables
  >(SetClaimOutcomeDocument, options)
}
export type SetClaimOutcomeMutationHookResult = ReturnType<
  typeof useSetClaimOutcomeMutation
>
export type SetClaimOutcomeMutationResult = ApolloReactCommon.MutationResult<
  SetClaimOutcomeMutation
>
export type SetClaimOutcomeMutationOptions = ApolloReactCommon.BaseMutationOptions<
  SetClaimOutcomeMutation,
  SetClaimOutcomeMutationVariables
>
export const SetClaimPropertySelectionDocument = gql`
  mutation SetClaimPropertySelection(
    $id: ID!
    $claimType: String!
    $propertyId: ID!
    $optionIds: [ID!]!
  ) {
    setClaimPropertySelection(
      id: $id
      claimType: $claimType
      propertyId: $propertyId
      optionIds: $optionIds
    ) {
      id
      propertySelections {
        claimType
        property {
          id
          name
        }
        option {
          id
          name
        }
      }
    }
  }
`
export type SetClaimPropertySelectionMutationFn = ApolloReactCommon.MutationFunction<
  SetClaimPropertySelectionMutation,
  SetClaimPropertySelectionMutationVariables
>

/**
 * __useSetClaimPropertySelectionMutation__
 *
 * To run a mutation, you first call `useSetClaimPropertySelectionMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useSetClaimPropertySelectionMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [setClaimPropertySelectionMutation, { data, loading, error }] = useSetClaimPropertySelectionMutation({
 *   variables: {
 *      id: // value for 'id'
 *      claimType: // value for 'claimType'
 *      propertyId: // value for 'propertyId'
 *      optionIds: // value for 'optionIds'
 *   },
 * });
 */
export function useSetClaimPropertySelectionMutation(
  baseOptions?: ApolloReactHooks.MutationHookOptions<
    SetClaimPropertySelectionMutation,
    SetClaimPropertySelectionMutationVariables
  >,
) {
  const options = { ...defaultOptions, ...baseOptions }
  return ApolloReactHooks.useMutation<
    SetClaimPropertySelectionMutation,
    SetClaimPropertySelectionMutationVariables
  >(SetClaimPropertySelectionDocument, options)
}
export type SetClaimPropertySelectionMutationHookResult = ReturnType<
  typeof useSetClaimPropertySelectionMutation
>
export type SetClaimPropertySelectionMutationResult = ApolloReactCommon.MutationResult<
  SetClaimPropertySelectionMutation
>
export type SetClaimPropertySelectionMutationOptions = ApolloReactCommon.BaseMutationOptions<
  SetClaimPropertySelectionMutation,
  SetClaimPropertySelectionMutationVariables
>
export const DeleteCoInsuredDocument = gql`
  mutation DeleteCoInsured($claimId: ID!) {
    deleteCoInsured(claimId: $claimId)
  }
`
export type DeleteCoInsuredMutationFn = ApolloReactCommon.MutationFunction<
  DeleteCoInsuredMutation,
  DeleteCoInsuredMutationVariables
>

/**
 * __useDeleteCoInsuredMutation__
 *
 * To run a mutation, you first call `useDeleteCoInsuredMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useDeleteCoInsuredMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [deleteCoInsuredMutation, { data, loading, error }] = useDeleteCoInsuredMutation({
 *   variables: {
 *      claimId: // value for 'claimId'
 *   },
 * });
 */
export function useDeleteCoInsuredMutation(
  baseOptions?: ApolloReactHooks.MutationHookOptions<
    DeleteCoInsuredMutation,
    DeleteCoInsuredMutationVariables
  >,
) {
  const options = { ...defaultOptions, ...baseOptions }
  return ApolloReactHooks.useMutation<
    DeleteCoInsuredMutation,
    DeleteCoInsuredMutationVariables
  >(DeleteCoInsuredDocument, options)
}
export type DeleteCoInsuredMutationHookResult = ReturnType<
  typeof useDeleteCoInsuredMutation
>
export type DeleteCoInsuredMutationResult = ApolloReactCommon.MutationResult<
  DeleteCoInsuredMutation
>
export type DeleteCoInsuredMutationOptions = ApolloReactCommon.BaseMutationOptions<
  DeleteCoInsuredMutation,
  DeleteCoInsuredMutationVariables
>
export const UpsertCoInsuredDocument = gql`
  mutation UpsertCoInsured($claimId: ID!, $request: UpsertCoInsuredInput!) {
    upsertCoInsured(claimId: $claimId, request: $request) {
      id
      coInsured {
        id
        fullName
        personalNumber
        email
        phoneNumber
      }
    }
  }
`
export type UpsertCoInsuredMutationFn = ApolloReactCommon.MutationFunction<
  UpsertCoInsuredMutation,
  UpsertCoInsuredMutationVariables
>

/**
 * __useUpsertCoInsuredMutation__
 *
 * To run a mutation, you first call `useUpsertCoInsuredMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useUpsertCoInsuredMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [upsertCoInsuredMutation, { data, loading, error }] = useUpsertCoInsuredMutation({
 *   variables: {
 *      claimId: // value for 'claimId'
 *      request: // value for 'request'
 *   },
 * });
 */
export function useUpsertCoInsuredMutation(
  baseOptions?: ApolloReactHooks.MutationHookOptions<
    UpsertCoInsuredMutation,
    UpsertCoInsuredMutationVariables
  >,
) {
  const options = { ...defaultOptions, ...baseOptions }
  return ApolloReactHooks.useMutation<
    UpsertCoInsuredMutation,
    UpsertCoInsuredMutationVariables
  >(UpsertCoInsuredDocument, options)
}
export type UpsertCoInsuredMutationHookResult = ReturnType<
  typeof useUpsertCoInsuredMutation
>
export type UpsertCoInsuredMutationResult = ApolloReactCommon.MutationResult<
  UpsertCoInsuredMutation
>
export type UpsertCoInsuredMutationOptions = ApolloReactCommon.BaseMutationOptions<
  UpsertCoInsuredMutation,
  UpsertCoInsuredMutationVariables
>
export const ClaimAddClaimNoteDocument = gql`
  mutation ClaimAddClaimNote($claimId: ID!, $note: ClaimNoteInput!) {
    addClaimNote(id: $claimId, note: $note) {
      id
      notes {
        text
        date
        handlerReference
      }
      events {
        text
        date
      }
    }
  }
`
export type ClaimAddClaimNoteMutationFn = ApolloReactCommon.MutationFunction<
  ClaimAddClaimNoteMutation,
  ClaimAddClaimNoteMutationVariables
>

/**
 * __useClaimAddClaimNoteMutation__
 *
 * To run a mutation, you first call `useClaimAddClaimNoteMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useClaimAddClaimNoteMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [claimAddClaimNoteMutation, { data, loading, error }] = useClaimAddClaimNoteMutation({
 *   variables: {
 *      claimId: // value for 'claimId'
 *      note: // value for 'note'
 *   },
 * });
 */
export function useClaimAddClaimNoteMutation(
  baseOptions?: ApolloReactHooks.MutationHookOptions<
    ClaimAddClaimNoteMutation,
    ClaimAddClaimNoteMutationVariables
  >,
) {
  const options = { ...defaultOptions, ...baseOptions }
  return ApolloReactHooks.useMutation<
    ClaimAddClaimNoteMutation,
    ClaimAddClaimNoteMutationVariables
  >(ClaimAddClaimNoteDocument, options)
}
export type ClaimAddClaimNoteMutationHookResult = ReturnType<
  typeof useClaimAddClaimNoteMutation
>
export type ClaimAddClaimNoteMutationResult = ApolloReactCommon.MutationResult<
  ClaimAddClaimNoteMutation
>
export type ClaimAddClaimNoteMutationOptions = ApolloReactCommon.BaseMutationOptions<
  ClaimAddClaimNoteMutation,
  ClaimAddClaimNoteMutationVariables
>
export const ClaimMemberContractsMasterInceptionDocument = gql`
  query ClaimMemberContractsMasterInception($memberId: ID!) {
    member(id: $memberId) {
      memberId
      signedOn
      firstName
      lastName
      person {
        debtFlag
      }
      personalNumber
      directDebitStatus {
        activated
      }
      fraudulentStatus
      sanctionStatus
      numberFailedCharges {
        numberFailedCharges
        lastFailedChargeAt
      }
      totalNumberOfClaims
      account {
        id
        totalBalance {
          amount
          currency
        }
      }
      identity {
        nationalIdentification {
          identification
          nationality
        }
        firstName
        lastName
      }
      contractMarketInfo {
        market
        preferredCurrency
      }
      pickedLocale
      contracts {
        id
        currentAgreementId
        contractTypeName
        typeOfContract
        masterInception
        terminationDate
        isTerminated
        genericAgreements {
          id
          address {
            street
            postalCode
            city
          }
          status
          typeOfContract
          lineOfBusinessName
          carrier
          premium {
            amount
            currency
          }
          createdAt
        }
      }
      trials {
        id
      }
    }
  }
`

/**
 * __useClaimMemberContractsMasterInceptionQuery__
 *
 * To run a query within a React component, call `useClaimMemberContractsMasterInceptionQuery` and pass it any options that fit your needs.
 * When your component renders, `useClaimMemberContractsMasterInceptionQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useClaimMemberContractsMasterInceptionQuery({
 *   variables: {
 *      memberId: // value for 'memberId'
 *   },
 * });
 */
export function useClaimMemberContractsMasterInceptionQuery(
  baseOptions: ApolloReactHooks.QueryHookOptions<
    ClaimMemberContractsMasterInceptionQuery,
    ClaimMemberContractsMasterInceptionQueryVariables
  >,
) {
  const options = { ...defaultOptions, ...baseOptions }
  return ApolloReactHooks.useQuery<
    ClaimMemberContractsMasterInceptionQuery,
    ClaimMemberContractsMasterInceptionQueryVariables
  >(ClaimMemberContractsMasterInceptionDocument, options)
}
export function useClaimMemberContractsMasterInceptionLazyQuery(
  baseOptions?: ApolloReactHooks.LazyQueryHookOptions<
    ClaimMemberContractsMasterInceptionQuery,
    ClaimMemberContractsMasterInceptionQueryVariables
  >,
) {
  const options = { ...defaultOptions, ...baseOptions }
  return ApolloReactHooks.useLazyQuery<
    ClaimMemberContractsMasterInceptionQuery,
    ClaimMemberContractsMasterInceptionQueryVariables
  >(ClaimMemberContractsMasterInceptionDocument, options)
}
export type ClaimMemberContractsMasterInceptionQueryHookResult = ReturnType<
  typeof useClaimMemberContractsMasterInceptionQuery
>
export type ClaimMemberContractsMasterInceptionLazyQueryHookResult = ReturnType<
  typeof useClaimMemberContractsMasterInceptionLazyQuery
>
export type ClaimMemberContractsMasterInceptionQueryResult = ApolloReactCommon.QueryResult<
  ClaimMemberContractsMasterInceptionQuery,
  ClaimMemberContractsMasterInceptionQueryVariables
>
export const ClaimPageDocument = gql`
  query ClaimPage($claimId: ID!) {
    claim(id: $claimId) {
      id
      recordingUrl
      registrationDate
      state
      coveringEmployee
      claimType
      dateOfOccurrence
      outcome
      restriction {
        resourceId
        restrictedByMe
        restrictedBy {
          id
          email
          fullName
          role
        }
        usersGranted {
          id
          email
          fullName
          role
        }
        usersRestricted {
          id
          email
          fullName
          role
        }
        rolesGranted
        rolesRestricted
      }
      propertySelections {
        claimType
        property {
          id
          name
        }
        option {
          id
          name
        }
      }
      coInsured {
        id
        fullName
        personalNumber
        email
        phoneNumber
      }
      member {
        memberId
      }
      reserves
      state
      contract {
        id
        market
        currentAgreementId
        genericAgreements {
          id
          address {
            street
            postalCode
            city
          }
          lineOfBusinessName
          premium {
            amount
            currency
          }
          status
          carrier
          typeOfContract
          createdAt
        }
        contractTypeName
        preferredCurrency
        typeOfContract
        masterInception
        terminationDate
      }
      agreement {
        id
        address {
          street
          postalCode
          city
        }
        typeOfContract
        lineOfBusinessName
        carrier
      }
      transcriptions {
        confidenceScore
        languageCode
        text
      }
      notes {
        date
        handlerReference
        text
      }
      claimFiles {
        claimFileId
        claimId
        category
        contentType
        fileUploadUrl
        uploadedAt
      }
      payments {
        id
        deductible
        amount
        exGratia
        status
        note
        type
        timestamp
      }
      events {
        date
        text
      }
    }
  }
`

/**
 * __useClaimPageQuery__
 *
 * To run a query within a React component, call `useClaimPageQuery` and pass it any options that fit your needs.
 * When your component renders, `useClaimPageQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useClaimPageQuery({
 *   variables: {
 *      claimId: // value for 'claimId'
 *   },
 * });
 */
export function useClaimPageQuery(
  baseOptions: ApolloReactHooks.QueryHookOptions<
    ClaimPageQuery,
    ClaimPageQueryVariables
  >,
) {
  const options = { ...defaultOptions, ...baseOptions }
  return ApolloReactHooks.useQuery<ClaimPageQuery, ClaimPageQueryVariables>(
    ClaimPageDocument,
    options,
  )
}
export function useClaimPageLazyQuery(
  baseOptions?: ApolloReactHooks.LazyQueryHookOptions<
    ClaimPageQuery,
    ClaimPageQueryVariables
  >,
) {
  const options = { ...defaultOptions, ...baseOptions }
  return ApolloReactHooks.useLazyQuery<ClaimPageQuery, ClaimPageQueryVariables>(
    ClaimPageDocument,
    options,
  )
}
export type ClaimPageQueryHookResult = ReturnType<typeof useClaimPageQuery>
export type ClaimPageLazyQueryHookResult = ReturnType<
  typeof useClaimPageLazyQuery
>
export type ClaimPageQueryResult = ApolloReactCommon.QueryResult<
  ClaimPageQuery,
  ClaimPageQueryVariables
>
export const ClaimPaymentsDocument = gql`
  query ClaimPayments($claimId: ID!) {
    claim(id: $claimId) {
      id
      contract {
        id
        market
      }
      agreement {
        id
        carrier
      }
      member {
        memberId
        sanctionStatus
        identity {
          firstName
          lastName
          nationalIdentification {
            identification
            nationality
          }
        }
      }
      payments {
        id
        deductible
        amount
        exGratia
        status
        note
        type
        timestamp
      }
    }
  }
`

/**
 * __useClaimPaymentsQuery__
 *
 * To run a query within a React component, call `useClaimPaymentsQuery` and pass it any options that fit your needs.
 * When your component renders, `useClaimPaymentsQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useClaimPaymentsQuery({
 *   variables: {
 *      claimId: // value for 'claimId'
 *   },
 * });
 */
export function useClaimPaymentsQuery(
  baseOptions: ApolloReactHooks.QueryHookOptions<
    ClaimPaymentsQuery,
    ClaimPaymentsQueryVariables
  >,
) {
  const options = { ...defaultOptions, ...baseOptions }
  return ApolloReactHooks.useQuery<
    ClaimPaymentsQuery,
    ClaimPaymentsQueryVariables
  >(ClaimPaymentsDocument, options)
}
export function useClaimPaymentsLazyQuery(
  baseOptions?: ApolloReactHooks.LazyQueryHookOptions<
    ClaimPaymentsQuery,
    ClaimPaymentsQueryVariables
  >,
) {
  const options = { ...defaultOptions, ...baseOptions }
  return ApolloReactHooks.useLazyQuery<
    ClaimPaymentsQuery,
    ClaimPaymentsQueryVariables
  >(ClaimPaymentsDocument, options)
}
export type ClaimPaymentsQueryHookResult = ReturnType<
  typeof useClaimPaymentsQuery
>
export type ClaimPaymentsLazyQueryHookResult = ReturnType<
  typeof useClaimPaymentsLazyQuery
>
export type ClaimPaymentsQueryResult = ApolloReactCommon.QueryResult<
  ClaimPaymentsQuery,
  ClaimPaymentsQueryVariables
>
export const ClaimReserveDocument = gql`
  query ClaimReserve($claimId: ID!) {
    claim(id: $claimId) {
      id
      reserves
    }
  }
`

/**
 * __useClaimReserveQuery__
 *
 * To run a query within a React component, call `useClaimReserveQuery` and pass it any options that fit your needs.
 * When your component renders, `useClaimReserveQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useClaimReserveQuery({
 *   variables: {
 *      claimId: // value for 'claimId'
 *   },
 * });
 */
export function useClaimReserveQuery(
  baseOptions: ApolloReactHooks.QueryHookOptions<
    ClaimReserveQuery,
    ClaimReserveQueryVariables
  >,
) {
  const options = { ...defaultOptions, ...baseOptions }
  return ApolloReactHooks.useQuery<
    ClaimReserveQuery,
    ClaimReserveQueryVariables
  >(ClaimReserveDocument, options)
}
export function useClaimReserveLazyQuery(
  baseOptions?: ApolloReactHooks.LazyQueryHookOptions<
    ClaimReserveQuery,
    ClaimReserveQueryVariables
  >,
) {
  const options = { ...defaultOptions, ...baseOptions }
  return ApolloReactHooks.useLazyQuery<
    ClaimReserveQuery,
    ClaimReserveQueryVariables
  >(ClaimReserveDocument, options)
}
export type ClaimReserveQueryHookResult = ReturnType<
  typeof useClaimReserveQuery
>
export type ClaimReserveLazyQueryHookResult = ReturnType<
  typeof useClaimReserveLazyQuery
>
export type ClaimReserveQueryResult = ApolloReactCommon.QueryResult<
  ClaimReserveQuery,
  ClaimReserveQueryVariables
>
export const UpdateReserveDocument = gql`
  mutation UpdateReserve($claimId: ID!, $amount: MonetaryAmount!) {
    updateReserve(id: $claimId, amount: $amount) {
      id
      reserves
      events {
        text
        date
      }
    }
  }
`
export type UpdateReserveMutationFn = ApolloReactCommon.MutationFunction<
  UpdateReserveMutation,
  UpdateReserveMutationVariables
>

/**
 * __useUpdateReserveMutation__
 *
 * To run a mutation, you first call `useUpdateReserveMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useUpdateReserveMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [updateReserveMutation, { data, loading, error }] = useUpdateReserveMutation({
 *   variables: {
 *      claimId: // value for 'claimId'
 *      amount: // value for 'amount'
 *   },
 * });
 */
export function useUpdateReserveMutation(
  baseOptions?: ApolloReactHooks.MutationHookOptions<
    UpdateReserveMutation,
    UpdateReserveMutationVariables
  >,
) {
  const options = { ...defaultOptions, ...baseOptions }
  return ApolloReactHooks.useMutation<
    UpdateReserveMutation,
    UpdateReserveMutationVariables
  >(UpdateReserveDocument, options)
}
export type UpdateReserveMutationHookResult = ReturnType<
  typeof useUpdateReserveMutation
>
export type UpdateReserveMutationResult = ApolloReactCommon.MutationResult<
  UpdateReserveMutation
>
export type UpdateReserveMutationOptions = ApolloReactCommon.BaseMutationOptions<
  UpdateReserveMutation,
  UpdateReserveMutationVariables
>
export const CreateClaimPaymentDocument = gql`
  mutation CreateClaimPayment($id: ID!, $payment: ClaimPaymentInput!) {
    createClaimPayment(id: $id, payment: $payment) {
      id
      payments {
        id
        amount
        deductible
        exGratia
        note
        timestamp
        type
        status
      }
    }
  }
`
export type CreateClaimPaymentMutationFn = ApolloReactCommon.MutationFunction<
  CreateClaimPaymentMutation,
  CreateClaimPaymentMutationVariables
>

/**
 * __useCreateClaimPaymentMutation__
 *
 * To run a mutation, you first call `useCreateClaimPaymentMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useCreateClaimPaymentMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [createClaimPaymentMutation, { data, loading, error }] = useCreateClaimPaymentMutation({
 *   variables: {
 *      id: // value for 'id'
 *      payment: // value for 'payment'
 *   },
 * });
 */
export function useCreateClaimPaymentMutation(
  baseOptions?: ApolloReactHooks.MutationHookOptions<
    CreateClaimPaymentMutation,
    CreateClaimPaymentMutationVariables
  >,
) {
  const options = { ...defaultOptions, ...baseOptions }
  return ApolloReactHooks.useMutation<
    CreateClaimPaymentMutation,
    CreateClaimPaymentMutationVariables
  >(CreateClaimPaymentDocument, options)
}
export type CreateClaimPaymentMutationHookResult = ReturnType<
  typeof useCreateClaimPaymentMutation
>
export type CreateClaimPaymentMutationResult = ApolloReactCommon.MutationResult<
  CreateClaimPaymentMutation
>
export type CreateClaimPaymentMutationOptions = ApolloReactCommon.BaseMutationOptions<
  CreateClaimPaymentMutation,
  CreateClaimPaymentMutationVariables
>
export const CreateSwishClaimPaymentDocument = gql`
  mutation CreateSwishClaimPayment(
    $id: ID!
    $payment: ClaimSwishPaymentInput!
  ) {
    createClaimSwishPayment(id: $id, payment: $payment) {
      id
      payments {
        id
        amount
        deductible
        exGratia
        note
        timestamp
        type
        status
      }
    }
  }
`
export type CreateSwishClaimPaymentMutationFn = ApolloReactCommon.MutationFunction<
  CreateSwishClaimPaymentMutation,
  CreateSwishClaimPaymentMutationVariables
>

/**
 * __useCreateSwishClaimPaymentMutation__
 *
 * To run a mutation, you first call `useCreateSwishClaimPaymentMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useCreateSwishClaimPaymentMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [createSwishClaimPaymentMutation, { data, loading, error }] = useCreateSwishClaimPaymentMutation({
 *   variables: {
 *      id: // value for 'id'
 *      payment: // value for 'payment'
 *   },
 * });
 */
export function useCreateSwishClaimPaymentMutation(
  baseOptions?: ApolloReactHooks.MutationHookOptions<
    CreateSwishClaimPaymentMutation,
    CreateSwishClaimPaymentMutationVariables
  >,
) {
  const options = { ...defaultOptions, ...baseOptions }
  return ApolloReactHooks.useMutation<
    CreateSwishClaimPaymentMutation,
    CreateSwishClaimPaymentMutationVariables
  >(CreateSwishClaimPaymentDocument, options)
}
export type CreateSwishClaimPaymentMutationHookResult = ReturnType<
  typeof useCreateSwishClaimPaymentMutation
>
export type CreateSwishClaimPaymentMutationResult = ApolloReactCommon.MutationResult<
  CreateSwishClaimPaymentMutation
>
export type CreateSwishClaimPaymentMutationOptions = ApolloReactCommon.BaseMutationOptions<
  CreateSwishClaimPaymentMutation,
  CreateSwishClaimPaymentMutationVariables
>
export const MarkClaimFileAsDeletedDocument = gql`
  mutation MarkClaimFileAsDeleted($claimId: ID!, $claimFileId: ID!) {
    markClaimFileAsDeleted(claimId: $claimId, claimFileId: $claimFileId)
  }
`
export type MarkClaimFileAsDeletedMutationFn = ApolloReactCommon.MutationFunction<
  MarkClaimFileAsDeletedMutation,
  MarkClaimFileAsDeletedMutationVariables
>

/**
 * __useMarkClaimFileAsDeletedMutation__
 *
 * To run a mutation, you first call `useMarkClaimFileAsDeletedMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useMarkClaimFileAsDeletedMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [markClaimFileAsDeletedMutation, { data, loading, error }] = useMarkClaimFileAsDeletedMutation({
 *   variables: {
 *      claimId: // value for 'claimId'
 *      claimFileId: // value for 'claimFileId'
 *   },
 * });
 */
export function useMarkClaimFileAsDeletedMutation(
  baseOptions?: ApolloReactHooks.MutationHookOptions<
    MarkClaimFileAsDeletedMutation,
    MarkClaimFileAsDeletedMutationVariables
  >,
) {
  const options = { ...defaultOptions, ...baseOptions }
  return ApolloReactHooks.useMutation<
    MarkClaimFileAsDeletedMutation,
    MarkClaimFileAsDeletedMutationVariables
  >(MarkClaimFileAsDeletedDocument, options)
}
export type MarkClaimFileAsDeletedMutationHookResult = ReturnType<
  typeof useMarkClaimFileAsDeletedMutation
>
export type MarkClaimFileAsDeletedMutationResult = ApolloReactCommon.MutationResult<
  MarkClaimFileAsDeletedMutation
>
export type MarkClaimFileAsDeletedMutationOptions = ApolloReactCommon.BaseMutationOptions<
  MarkClaimFileAsDeletedMutation,
  MarkClaimFileAsDeletedMutationVariables
>
export const RestrictResourceAccessDocument = gql`
  mutation RestrictResourceAccess($resourceId: ID!) {
    restrictResourceAccess(resourceId: $resourceId) {
      resourceId
      usersGranted {
        id
        email
        fullName
        role
      }
      usersRestricted {
        id
        email
        fullName
        role
      }
      rolesGranted
      rolesRestricted
    }
  }
`
export type RestrictResourceAccessMutationFn = ApolloReactCommon.MutationFunction<
  RestrictResourceAccessMutation,
  RestrictResourceAccessMutationVariables
>

/**
 * __useRestrictResourceAccessMutation__
 *
 * To run a mutation, you first call `useRestrictResourceAccessMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useRestrictResourceAccessMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [restrictResourceAccessMutation, { data, loading, error }] = useRestrictResourceAccessMutation({
 *   variables: {
 *      resourceId: // value for 'resourceId'
 *   },
 * });
 */
export function useRestrictResourceAccessMutation(
  baseOptions?: ApolloReactHooks.MutationHookOptions<
    RestrictResourceAccessMutation,
    RestrictResourceAccessMutationVariables
  >,
) {
  const options = { ...defaultOptions, ...baseOptions }
  return ApolloReactHooks.useMutation<
    RestrictResourceAccessMutation,
    RestrictResourceAccessMutationVariables
  >(RestrictResourceAccessDocument, options)
}
export type RestrictResourceAccessMutationHookResult = ReturnType<
  typeof useRestrictResourceAccessMutation
>
export type RestrictResourceAccessMutationResult = ApolloReactCommon.MutationResult<
  RestrictResourceAccessMutation
>
export type RestrictResourceAccessMutationOptions = ApolloReactCommon.BaseMutationOptions<
  RestrictResourceAccessMutation,
  RestrictResourceAccessMutationVariables
>
export const SetClaimFileCategoryDocument = gql`
  mutation SetClaimFileCategory(
    $claimId: ID!
    $claimFileId: ID!
    $category: String
  ) {
    setClaimFileCategory(
      claimId: $claimId
      claimFileId: $claimFileId
      category: $category
    ) {
      claimId
      claimFileId
    }
  }
`
export type SetClaimFileCategoryMutationFn = ApolloReactCommon.MutationFunction<
  SetClaimFileCategoryMutation,
  SetClaimFileCategoryMutationVariables
>

/**
 * __useSetClaimFileCategoryMutation__
 *
 * To run a mutation, you first call `useSetClaimFileCategoryMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useSetClaimFileCategoryMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [setClaimFileCategoryMutation, { data, loading, error }] = useSetClaimFileCategoryMutation({
 *   variables: {
 *      claimId: // value for 'claimId'
 *      claimFileId: // value for 'claimFileId'
 *      category: // value for 'category'
 *   },
 * });
 */
export function useSetClaimFileCategoryMutation(
  baseOptions?: ApolloReactHooks.MutationHookOptions<
    SetClaimFileCategoryMutation,
    SetClaimFileCategoryMutationVariables
  >,
) {
  const options = { ...defaultOptions, ...baseOptions }
  return ApolloReactHooks.useMutation<
    SetClaimFileCategoryMutation,
    SetClaimFileCategoryMutationVariables
  >(SetClaimFileCategoryDocument, options)
}
export type SetClaimFileCategoryMutationHookResult = ReturnType<
  typeof useSetClaimFileCategoryMutation
>
export type SetClaimFileCategoryMutationResult = ApolloReactCommon.MutationResult<
  SetClaimFileCategoryMutation
>
export type SetClaimFileCategoryMutationOptions = ApolloReactCommon.BaseMutationOptions<
  SetClaimFileCategoryMutation,
  SetClaimFileCategoryMutationVariables
>
export const SetClaimTypeDocument = gql`
  mutation SetClaimType($id: ID!, $type: String) {
    setClaimType(id: $id, type: $type) {
      id
      claimType
      events {
        text
        date
      }
    }
  }
`
export type SetClaimTypeMutationFn = ApolloReactCommon.MutationFunction<
  SetClaimTypeMutation,
  SetClaimTypeMutationVariables
>

/**
 * __useSetClaimTypeMutation__
 *
 * To run a mutation, you first call `useSetClaimTypeMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useSetClaimTypeMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [setClaimTypeMutation, { data, loading, error }] = useSetClaimTypeMutation({
 *   variables: {
 *      id: // value for 'id'
 *      type: // value for 'type'
 *   },
 * });
 */
export function useSetClaimTypeMutation(
  baseOptions?: ApolloReactHooks.MutationHookOptions<
    SetClaimTypeMutation,
    SetClaimTypeMutationVariables
  >,
) {
  const options = { ...defaultOptions, ...baseOptions }
  return ApolloReactHooks.useMutation<
    SetClaimTypeMutation,
    SetClaimTypeMutationVariables
  >(SetClaimTypeDocument, options)
}
export type SetClaimTypeMutationHookResult = ReturnType<
  typeof useSetClaimTypeMutation
>
export type SetClaimTypeMutationResult = ApolloReactCommon.MutationResult<
  SetClaimTypeMutation
>
export type SetClaimTypeMutationOptions = ApolloReactCommon.BaseMutationOptions<
  SetClaimTypeMutation,
  SetClaimTypeMutationVariables
>
export const SetContractForClaimDocument = gql`
  mutation SetContractForClaim($request: SetContractForClaim!) {
    setContractForClaim(request: $request) {
      id
      member {
        memberId
      }
      contract {
        id
      }
    }
  }
`
export type SetContractForClaimMutationFn = ApolloReactCommon.MutationFunction<
  SetContractForClaimMutation,
  SetContractForClaimMutationVariables
>

/**
 * __useSetContractForClaimMutation__
 *
 * To run a mutation, you first call `useSetContractForClaimMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useSetContractForClaimMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [setContractForClaimMutation, { data, loading, error }] = useSetContractForClaimMutation({
 *   variables: {
 *      request: // value for 'request'
 *   },
 * });
 */
export function useSetContractForClaimMutation(
  baseOptions?: ApolloReactHooks.MutationHookOptions<
    SetContractForClaimMutation,
    SetContractForClaimMutationVariables
  >,
) {
  const options = { ...defaultOptions, ...baseOptions }
  return ApolloReactHooks.useMutation<
    SetContractForClaimMutation,
    SetContractForClaimMutationVariables
  >(SetContractForClaimDocument, options)
}
export type SetContractForClaimMutationHookResult = ReturnType<
  typeof useSetContractForClaimMutation
>
export type SetContractForClaimMutationResult = ApolloReactCommon.MutationResult<
  SetContractForClaimMutation
>
export type SetContractForClaimMutationOptions = ApolloReactCommon.BaseMutationOptions<
  SetContractForClaimMutation,
  SetContractForClaimMutationVariables
>
export const SetCoveringEmployeeDocument = gql`
  mutation SetCoveringEmployee($id: ID!, $coveringEmployee: Boolean!) {
    setCoveringEmployee(id: $id, coveringEmployee: $coveringEmployee) {
      id
      coveringEmployee
      events {
        text
        date
      }
    }
  }
`
export type SetCoveringEmployeeMutationFn = ApolloReactCommon.MutationFunction<
  SetCoveringEmployeeMutation,
  SetCoveringEmployeeMutationVariables
>

/**
 * __useSetCoveringEmployeeMutation__
 *
 * To run a mutation, you first call `useSetCoveringEmployeeMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useSetCoveringEmployeeMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [setCoveringEmployeeMutation, { data, loading, error }] = useSetCoveringEmployeeMutation({
 *   variables: {
 *      id: // value for 'id'
 *      coveringEmployee: // value for 'coveringEmployee'
 *   },
 * });
 */
export function useSetCoveringEmployeeMutation(
  baseOptions?: ApolloReactHooks.MutationHookOptions<
    SetCoveringEmployeeMutation,
    SetCoveringEmployeeMutationVariables
  >,
) {
  const options = { ...defaultOptions, ...baseOptions }
  return ApolloReactHooks.useMutation<
    SetCoveringEmployeeMutation,
    SetCoveringEmployeeMutationVariables
  >(SetCoveringEmployeeDocument, options)
}
export type SetCoveringEmployeeMutationHookResult = ReturnType<
  typeof useSetCoveringEmployeeMutation
>
export type SetCoveringEmployeeMutationResult = ApolloReactCommon.MutationResult<
  SetCoveringEmployeeMutation
>
export type SetCoveringEmployeeMutationOptions = ApolloReactCommon.BaseMutationOptions<
  SetCoveringEmployeeMutation,
  SetCoveringEmployeeMutationVariables
>
export const UpdateClaimStateDocument = gql`
  mutation UpdateClaimState($id: ID!, $state: ClaimState!) {
    updateClaimState(id: $id, state: $state) {
      id
      state
      events {
        text
        date
      }
    }
  }
`
export type UpdateClaimStateMutationFn = ApolloReactCommon.MutationFunction<
  UpdateClaimStateMutation,
  UpdateClaimStateMutationVariables
>

/**
 * __useUpdateClaimStateMutation__
 *
 * To run a mutation, you first call `useUpdateClaimStateMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useUpdateClaimStateMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [updateClaimStateMutation, { data, loading, error }] = useUpdateClaimStateMutation({
 *   variables: {
 *      id: // value for 'id'
 *      state: // value for 'state'
 *   },
 * });
 */
export function useUpdateClaimStateMutation(
  baseOptions?: ApolloReactHooks.MutationHookOptions<
    UpdateClaimStateMutation,
    UpdateClaimStateMutationVariables
  >,
) {
  const options = { ...defaultOptions, ...baseOptions }
  return ApolloReactHooks.useMutation<
    UpdateClaimStateMutation,
    UpdateClaimStateMutationVariables
  >(UpdateClaimStateDocument, options)
}
export type UpdateClaimStateMutationHookResult = ReturnType<
  typeof useUpdateClaimStateMutation
>
export type UpdateClaimStateMutationResult = ApolloReactCommon.MutationResult<
  UpdateClaimStateMutation
>
export type UpdateClaimStateMutationOptions = ApolloReactCommon.BaseMutationOptions<
  UpdateClaimStateMutation,
  UpdateClaimStateMutationVariables
>
export const ListClaimsDocument = gql`
  query ListClaims($options: ListClaimsOptions!) {
    listClaims(options: $options) {
      claims {
        id
        member {
          memberId
          firstName
          lastName
        }
        registrationDate
        claimType
        outcome
        state
        reserves
      }
      page
      totalPages
    }
  }
`

/**
 * __useListClaimsQuery__
 *
 * To run a query within a React component, call `useListClaimsQuery` and pass it any options that fit your needs.
 * When your component renders, `useListClaimsQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useListClaimsQuery({
 *   variables: {
 *      options: // value for 'options'
 *   },
 * });
 */
export function useListClaimsQuery(
  baseOptions: ApolloReactHooks.QueryHookOptions<
    ListClaimsQuery,
    ListClaimsQueryVariables
  >,
) {
  const options = { ...defaultOptions, ...baseOptions }
  return ApolloReactHooks.useQuery<ListClaimsQuery, ListClaimsQueryVariables>(
    ListClaimsDocument,
    options,
  )
}
export function useListClaimsLazyQuery(
  baseOptions?: ApolloReactHooks.LazyQueryHookOptions<
    ListClaimsQuery,
    ListClaimsQueryVariables
  >,
) {
  const options = { ...defaultOptions, ...baseOptions }
  return ApolloReactHooks.useLazyQuery<
    ListClaimsQuery,
    ListClaimsQueryVariables
  >(ListClaimsDocument, options)
}
export type ListClaimsQueryHookResult = ReturnType<typeof useListClaimsQuery>
export type ListClaimsLazyQueryHookResult = ReturnType<
  typeof useListClaimsLazyQuery
>
export type ListClaimsQueryResult = ApolloReactCommon.QueryResult<
  ListClaimsQuery,
  ListClaimsQueryVariables
>
export const GetMessageHistoryDocument = gql`
  query GetMessageHistory($memberId: ID!) {
    messageHistory(memberId: $memberId) {
      globalId
      author
      fromId
      timestamp
      messageBodyJsonString
    }
  }
`

/**
 * __useGetMessageHistoryQuery__
 *
 * To run a query within a React component, call `useGetMessageHistoryQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetMessageHistoryQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetMessageHistoryQuery({
 *   variables: {
 *      memberId: // value for 'memberId'
 *   },
 * });
 */
export function useGetMessageHistoryQuery(
  baseOptions: ApolloReactHooks.QueryHookOptions<
    GetMessageHistoryQuery,
    GetMessageHistoryQueryVariables
  >,
) {
  const options = { ...defaultOptions, ...baseOptions }
  return ApolloReactHooks.useQuery<
    GetMessageHistoryQuery,
    GetMessageHistoryQueryVariables
  >(GetMessageHistoryDocument, options)
}
export function useGetMessageHistoryLazyQuery(
  baseOptions?: ApolloReactHooks.LazyQueryHookOptions<
    GetMessageHistoryQuery,
    GetMessageHistoryQueryVariables
  >,
) {
  const options = { ...defaultOptions, ...baseOptions }
  return ApolloReactHooks.useLazyQuery<
    GetMessageHistoryQuery,
    GetMessageHistoryQueryVariables
  >(GetMessageHistoryDocument, options)
}
export type GetMessageHistoryQueryHookResult = ReturnType<
  typeof useGetMessageHistoryQuery
>
export type GetMessageHistoryLazyQueryHookResult = ReturnType<
  typeof useGetMessageHistoryLazyQuery
>
export type GetMessageHistoryQueryResult = ApolloReactCommon.QueryResult<
  GetMessageHistoryQuery,
  GetMessageHistoryQueryVariables
>
export const AddAccountEntryToMemberDocument = gql`
  mutation addAccountEntryToMember(
    $memberId: ID!
    $accountEntry: AccountEntryInput!
  ) {
    addAccountEntryToMember(memberId: $memberId, accountEntry: $accountEntry) {
      memberId
    }
  }
`
export type AddAccountEntryToMemberMutationFn = ApolloReactCommon.MutationFunction<
  AddAccountEntryToMemberMutation,
  AddAccountEntryToMemberMutationVariables
>

/**
 * __useAddAccountEntryToMemberMutation__
 *
 * To run a mutation, you first call `useAddAccountEntryToMemberMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useAddAccountEntryToMemberMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [addAccountEntryToMemberMutation, { data, loading, error }] = useAddAccountEntryToMemberMutation({
 *   variables: {
 *      memberId: // value for 'memberId'
 *      accountEntry: // value for 'accountEntry'
 *   },
 * });
 */
export function useAddAccountEntryToMemberMutation(
  baseOptions?: ApolloReactHooks.MutationHookOptions<
    AddAccountEntryToMemberMutation,
    AddAccountEntryToMemberMutationVariables
  >,
) {
  const options = { ...defaultOptions, ...baseOptions }
  return ApolloReactHooks.useMutation<
    AddAccountEntryToMemberMutation,
    AddAccountEntryToMemberMutationVariables
  >(AddAccountEntryToMemberDocument, options)
}
export type AddAccountEntryToMemberMutationHookResult = ReturnType<
  typeof useAddAccountEntryToMemberMutation
>
export type AddAccountEntryToMemberMutationResult = ApolloReactCommon.MutationResult<
  AddAccountEntryToMemberMutation
>
export type AddAccountEntryToMemberMutationOptions = ApolloReactCommon.BaseMutationOptions<
  AddAccountEntryToMemberMutation,
  AddAccountEntryToMemberMutationVariables
>
export const AddMonthlyEntryDocument = gql`
  mutation AddMonthlyEntry($memberId: ID!, $input: MonthlyEntryInput!) {
    addMonthlyEntryToMember(memberId: $memberId, monthlyEntry: $input) {
      memberId
    }
  }
`
export type AddMonthlyEntryMutationFn = ApolloReactCommon.MutationFunction<
  AddMonthlyEntryMutation,
  AddMonthlyEntryMutationVariables
>

/**
 * __useAddMonthlyEntryMutation__
 *
 * To run a mutation, you first call `useAddMonthlyEntryMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useAddMonthlyEntryMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [addMonthlyEntryMutation, { data, loading, error }] = useAddMonthlyEntryMutation({
 *   variables: {
 *      memberId: // value for 'memberId'
 *      input: // value for 'input'
 *   },
 * });
 */
export function useAddMonthlyEntryMutation(
  baseOptions?: ApolloReactHooks.MutationHookOptions<
    AddMonthlyEntryMutation,
    AddMonthlyEntryMutationVariables
  >,
) {
  const options = { ...defaultOptions, ...baseOptions }
  return ApolloReactHooks.useMutation<
    AddMonthlyEntryMutation,
    AddMonthlyEntryMutationVariables
  >(AddMonthlyEntryDocument, options)
}
export type AddMonthlyEntryMutationHookResult = ReturnType<
  typeof useAddMonthlyEntryMutation
>
export type AddMonthlyEntryMutationResult = ApolloReactCommon.MutationResult<
  AddMonthlyEntryMutation
>
export type AddMonthlyEntryMutationOptions = ApolloReactCommon.BaseMutationOptions<
  AddMonthlyEntryMutation,
  AddMonthlyEntryMutationVariables
>
export const BackfillSubscriptionsDocument = gql`
  mutation backfillSubscriptions($memberId: ID!) {
    backfillSubscriptions(memberId: $memberId) {
      memberId
    }
  }
`
export type BackfillSubscriptionsMutationFn = ApolloReactCommon.MutationFunction<
  BackfillSubscriptionsMutation,
  BackfillSubscriptionsMutationVariables
>

/**
 * __useBackfillSubscriptionsMutation__
 *
 * To run a mutation, you first call `useBackfillSubscriptionsMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useBackfillSubscriptionsMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [backfillSubscriptionsMutation, { data, loading, error }] = useBackfillSubscriptionsMutation({
 *   variables: {
 *      memberId: // value for 'memberId'
 *   },
 * });
 */
export function useBackfillSubscriptionsMutation(
  baseOptions?: ApolloReactHooks.MutationHookOptions<
    BackfillSubscriptionsMutation,
    BackfillSubscriptionsMutationVariables
  >,
) {
  const options = { ...defaultOptions, ...baseOptions }
  return ApolloReactHooks.useMutation<
    BackfillSubscriptionsMutation,
    BackfillSubscriptionsMutationVariables
  >(BackfillSubscriptionsDocument, options)
}
export type BackfillSubscriptionsMutationHookResult = ReturnType<
  typeof useBackfillSubscriptionsMutation
>
export type BackfillSubscriptionsMutationResult = ApolloReactCommon.MutationResult<
  BackfillSubscriptionsMutation
>
export type BackfillSubscriptionsMutationOptions = ApolloReactCommon.BaseMutationOptions<
  BackfillSubscriptionsMutation,
  BackfillSubscriptionsMutationVariables
>
export const GetAccountDocument = gql`
  query GetAccount($memberId: ID!) {
    member(id: $memberId) {
      memberId
      account {
        id
        currentBalance {
          amount
          currency
        }
        totalBalance {
          amount
          currency
        }
        chargeEstimation {
          subscription {
            amount
            currency
          }
          discountCodes
          charge {
            amount
            currency
          }
          discount {
            amount
            currency
          }
        }
        entries {
          id
          amount {
            amount
            currency
          }
          fromDate
          title
          source
          reference
          comment
          type
          failedAt
          chargedAt
        }
        monthlyEntries {
          id
          externalId
          amount {
            amount
            currency
          }
          type
          source
          addedAt
          addedBy
          title
          comment
        }
      }
    }
  }
`

/**
 * __useGetAccountQuery__
 *
 * To run a query within a React component, call `useGetAccountQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetAccountQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetAccountQuery({
 *   variables: {
 *      memberId: // value for 'memberId'
 *   },
 * });
 */
export function useGetAccountQuery(
  baseOptions: ApolloReactHooks.QueryHookOptions<
    GetAccountQuery,
    GetAccountQueryVariables
  >,
) {
  const options = { ...defaultOptions, ...baseOptions }
  return ApolloReactHooks.useQuery<GetAccountQuery, GetAccountQueryVariables>(
    GetAccountDocument,
    options,
  )
}
export function useGetAccountLazyQuery(
  baseOptions?: ApolloReactHooks.LazyQueryHookOptions<
    GetAccountQuery,
    GetAccountQueryVariables
  >,
) {
  const options = { ...defaultOptions, ...baseOptions }
  return ApolloReactHooks.useLazyQuery<
    GetAccountQuery,
    GetAccountQueryVariables
  >(GetAccountDocument, options)
}
export type GetAccountQueryHookResult = ReturnType<typeof useGetAccountQuery>
export type GetAccountLazyQueryHookResult = ReturnType<
  typeof useGetAccountLazyQuery
>
export type GetAccountQueryResult = ApolloReactCommon.QueryResult<
  GetAccountQuery,
  GetAccountQueryVariables
>
export const RemoveMonthlyEntryDocument = gql`
  mutation RemoveMonthlyEntry($id: ID!) {
    removeMonthlyEntry(id: $id)
  }
`
export type RemoveMonthlyEntryMutationFn = ApolloReactCommon.MutationFunction<
  RemoveMonthlyEntryMutation,
  RemoveMonthlyEntryMutationVariables
>

/**
 * __useRemoveMonthlyEntryMutation__
 *
 * To run a mutation, you first call `useRemoveMonthlyEntryMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useRemoveMonthlyEntryMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [removeMonthlyEntryMutation, { data, loading, error }] = useRemoveMonthlyEntryMutation({
 *   variables: {
 *      id: // value for 'id'
 *   },
 * });
 */
export function useRemoveMonthlyEntryMutation(
  baseOptions?: ApolloReactHooks.MutationHookOptions<
    RemoveMonthlyEntryMutation,
    RemoveMonthlyEntryMutationVariables
  >,
) {
  const options = { ...defaultOptions, ...baseOptions }
  return ApolloReactHooks.useMutation<
    RemoveMonthlyEntryMutation,
    RemoveMonthlyEntryMutationVariables
  >(RemoveMonthlyEntryDocument, options)
}
export type RemoveMonthlyEntryMutationHookResult = ReturnType<
  typeof useRemoveMonthlyEntryMutation
>
export type RemoveMonthlyEntryMutationResult = ApolloReactCommon.MutationResult<
  RemoveMonthlyEntryMutation
>
export type RemoveMonthlyEntryMutationOptions = ApolloReactCommon.BaseMutationOptions<
  RemoveMonthlyEntryMutation,
  RemoveMonthlyEntryMutationVariables
>
export const GetReferralInformationDocument = gql`
  query GetReferralInformation($memberId: ID!) {
    member(id: $memberId) {
      memberId
      referralInformation {
        eligible
        redeemedCampaigns {
          code
          type
          redemptionState {
            redeemedAt
            activatedAt
            activeTo
            unRedeemedAt
          }
          incentive {
            __typename
          }
        }
        campaign {
          code
          incentive {
            __typename
            ... on MonthlyPercentageDiscountFixedPeriod {
              numberOfMonths
              percentage
            }
            ... on FreeMonths {
              numberOfMonths
            }
            ... on CostDeduction {
              amount
            }
            ... on NoDiscount {
              _
            }
            ... on IndefinitePercentageDiscount {
              percentageDiscount
            }
          }
        }
        referredBy {
          memberId
          name
          status
        }
        hasReferred {
          memberId
          name
          status
        }
      }
    }
  }
`

/**
 * __useGetReferralInformationQuery__
 *
 * To run a query within a React component, call `useGetReferralInformationQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetReferralInformationQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetReferralInformationQuery({
 *   variables: {
 *      memberId: // value for 'memberId'
 *   },
 * });
 */
export function useGetReferralInformationQuery(
  baseOptions: ApolloReactHooks.QueryHookOptions<
    GetReferralInformationQuery,
    GetReferralInformationQueryVariables
  >,
) {
  const options = { ...defaultOptions, ...baseOptions }
  return ApolloReactHooks.useQuery<
    GetReferralInformationQuery,
    GetReferralInformationQueryVariables
  >(GetReferralInformationDocument, options)
}
export function useGetReferralInformationLazyQuery(
  baseOptions?: ApolloReactHooks.LazyQueryHookOptions<
    GetReferralInformationQuery,
    GetReferralInformationQueryVariables
  >,
) {
  const options = { ...defaultOptions, ...baseOptions }
  return ApolloReactHooks.useLazyQuery<
    GetReferralInformationQuery,
    GetReferralInformationQueryVariables
  >(GetReferralInformationDocument, options)
}
export type GetReferralInformationQueryHookResult = ReturnType<
  typeof useGetReferralInformationQuery
>
export type GetReferralInformationLazyQueryHookResult = ReturnType<
  typeof useGetReferralInformationLazyQuery
>
export type GetReferralInformationQueryResult = ApolloReactCommon.QueryResult<
  GetReferralInformationQuery,
  GetReferralInformationQueryVariables
>
export const ManualRedeemCampaignDocument = gql`
  mutation ManualRedeemCampaign(
    $memberId: ID!
    $request: ManualRedeemCampaignInput!
  ) {
    manualRedeemCampaign(memberId: $memberId, request: $request) {
      memberId
      referralInformation {
        redeemedCampaigns {
          code
        }
      }
    }
  }
`
export type ManualRedeemCampaignMutationFn = ApolloReactCommon.MutationFunction<
  ManualRedeemCampaignMutation,
  ManualRedeemCampaignMutationVariables
>

/**
 * __useManualRedeemCampaignMutation__
 *
 * To run a mutation, you first call `useManualRedeemCampaignMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useManualRedeemCampaignMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [manualRedeemCampaignMutation, { data, loading, error }] = useManualRedeemCampaignMutation({
 *   variables: {
 *      memberId: // value for 'memberId'
 *      request: // value for 'request'
 *   },
 * });
 */
export function useManualRedeemCampaignMutation(
  baseOptions?: ApolloReactHooks.MutationHookOptions<
    ManualRedeemCampaignMutation,
    ManualRedeemCampaignMutationVariables
  >,
) {
  const options = { ...defaultOptions, ...baseOptions }
  return ApolloReactHooks.useMutation<
    ManualRedeemCampaignMutation,
    ManualRedeemCampaignMutationVariables
  >(ManualRedeemCampaignDocument, options)
}
export type ManualRedeemCampaignMutationHookResult = ReturnType<
  typeof useManualRedeemCampaignMutation
>
export type ManualRedeemCampaignMutationResult = ApolloReactCommon.MutationResult<
  ManualRedeemCampaignMutation
>
export type ManualRedeemCampaignMutationOptions = ApolloReactCommon.BaseMutationOptions<
  ManualRedeemCampaignMutation,
  ManualRedeemCampaignMutationVariables
>
export const ManualUnRedeemCampaignDocument = gql`
  mutation ManualUnRedeemCampaign(
    $memberId: ID!
    $request: ManualUnRedeemCampaignInput!
  ) {
    manualUnRedeemCampaign(memberId: $memberId, request: $request) {
      memberId
      referralInformation {
        redeemedCampaigns {
          code
        }
      }
    }
  }
`
export type ManualUnRedeemCampaignMutationFn = ApolloReactCommon.MutationFunction<
  ManualUnRedeemCampaignMutation,
  ManualUnRedeemCampaignMutationVariables
>

/**
 * __useManualUnRedeemCampaignMutation__
 *
 * To run a mutation, you first call `useManualUnRedeemCampaignMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useManualUnRedeemCampaignMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [manualUnRedeemCampaignMutation, { data, loading, error }] = useManualUnRedeemCampaignMutation({
 *   variables: {
 *      memberId: // value for 'memberId'
 *      request: // value for 'request'
 *   },
 * });
 */
export function useManualUnRedeemCampaignMutation(
  baseOptions?: ApolloReactHooks.MutationHookOptions<
    ManualUnRedeemCampaignMutation,
    ManualUnRedeemCampaignMutationVariables
  >,
) {
  const options = { ...defaultOptions, ...baseOptions }
  return ApolloReactHooks.useMutation<
    ManualUnRedeemCampaignMutation,
    ManualUnRedeemCampaignMutationVariables
  >(ManualUnRedeemCampaignDocument, options)
}
export type ManualUnRedeemCampaignMutationHookResult = ReturnType<
  typeof useManualUnRedeemCampaignMutation
>
export type ManualUnRedeemCampaignMutationResult = ApolloReactCommon.MutationResult<
  ManualUnRedeemCampaignMutation
>
export type ManualUnRedeemCampaignMutationOptions = ApolloReactCommon.BaseMutationOptions<
  ManualUnRedeemCampaignMutation,
  ManualUnRedeemCampaignMutationVariables
>
export const CreateClaimDocument = gql`
  mutation createClaim(
    $memberId: ID!
    $date: LocalDateTime!
    $source: ClaimSource!
  ) {
    createClaim(memberId: $memberId, date: $date, source: $source) {
      id
      state
      registrationDate
      member {
        memberId
        firstName
        lastName
      }
    }
  }
`
export type CreateClaimMutationFn = ApolloReactCommon.MutationFunction<
  CreateClaimMutation,
  CreateClaimMutationVariables
>

/**
 * __useCreateClaimMutation__
 *
 * To run a mutation, you first call `useCreateClaimMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useCreateClaimMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [createClaimMutation, { data, loading, error }] = useCreateClaimMutation({
 *   variables: {
 *      memberId: // value for 'memberId'
 *      date: // value for 'date'
 *      source: // value for 'source'
 *   },
 * });
 */
export function useCreateClaimMutation(
  baseOptions?: ApolloReactHooks.MutationHookOptions<
    CreateClaimMutation,
    CreateClaimMutationVariables
  >,
) {
  const options = { ...defaultOptions, ...baseOptions }
  return ApolloReactHooks.useMutation<
    CreateClaimMutation,
    CreateClaimMutationVariables
  >(CreateClaimDocument, options)
}
export type CreateClaimMutationHookResult = ReturnType<
  typeof useCreateClaimMutation
>
export type CreateClaimMutationResult = ApolloReactCommon.MutationResult<
  CreateClaimMutation
>
export type CreateClaimMutationOptions = ApolloReactCommon.BaseMutationOptions<
  CreateClaimMutation,
  CreateClaimMutationVariables
>
export const GetMemberClaimsDocument = gql`
  query GetMemberClaims($memberId: ID!) {
    member(id: $memberId) {
      memberId
      claims {
        id
        member {
          memberId
          firstName
          lastName
        }
        registrationDate
        claimType
        state
        reserves
      }
    }
  }
`

/**
 * __useGetMemberClaimsQuery__
 *
 * To run a query within a React component, call `useGetMemberClaimsQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetMemberClaimsQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetMemberClaimsQuery({
 *   variables: {
 *      memberId: // value for 'memberId'
 *   },
 * });
 */
export function useGetMemberClaimsQuery(
  baseOptions: ApolloReactHooks.QueryHookOptions<
    GetMemberClaimsQuery,
    GetMemberClaimsQueryVariables
  >,
) {
  const options = { ...defaultOptions, ...baseOptions }
  return ApolloReactHooks.useQuery<
    GetMemberClaimsQuery,
    GetMemberClaimsQueryVariables
  >(GetMemberClaimsDocument, options)
}
export function useGetMemberClaimsLazyQuery(
  baseOptions?: ApolloReactHooks.LazyQueryHookOptions<
    GetMemberClaimsQuery,
    GetMemberClaimsQueryVariables
  >,
) {
  const options = { ...defaultOptions, ...baseOptions }
  return ApolloReactHooks.useLazyQuery<
    GetMemberClaimsQuery,
    GetMemberClaimsQueryVariables
  >(GetMemberClaimsDocument, options)
}
export type GetMemberClaimsQueryHookResult = ReturnType<
  typeof useGetMemberClaimsQuery
>
export type GetMemberClaimsLazyQueryHookResult = ReturnType<
  typeof useGetMemberClaimsLazyQuery
>
export type GetMemberClaimsQueryResult = ApolloReactCommon.QueryResult<
  GetMemberClaimsQuery,
  GetMemberClaimsQueryVariables
>
export const RevertTerminationDocument = gql`
  mutation RevertTermination($contractId: ID!) {
    revertTermination(contractId: $contractId) {
      id
      holderMemberId
      terminationDate
    }
  }
`
export type RevertTerminationMutationFn = ApolloReactCommon.MutationFunction<
  RevertTerminationMutation,
  RevertTerminationMutationVariables
>

/**
 * __useRevertTerminationMutation__
 *
 * To run a mutation, you first call `useRevertTerminationMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useRevertTerminationMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [revertTerminationMutation, { data, loading, error }] = useRevertTerminationMutation({
 *   variables: {
 *      contractId: // value for 'contractId'
 *   },
 * });
 */
export function useRevertTerminationMutation(
  baseOptions?: ApolloReactHooks.MutationHookOptions<
    RevertTerminationMutation,
    RevertTerminationMutationVariables
  >,
) {
  const options = { ...defaultOptions, ...baseOptions }
  return ApolloReactHooks.useMutation<
    RevertTerminationMutation,
    RevertTerminationMutationVariables
  >(RevertTerminationDocument, options)
}
export type RevertTerminationMutationHookResult = ReturnType<
  typeof useRevertTerminationMutation
>
export type RevertTerminationMutationResult = ApolloReactCommon.MutationResult<
  RevertTerminationMutation
>
export type RevertTerminationMutationOptions = ApolloReactCommon.BaseMutationOptions<
  RevertTerminationMutation,
  RevertTerminationMutationVariables
>
export const ActivatePendingAgreementDocument = gql`
  mutation ActivatePendingAgreement(
    $contractId: ID!
    $request: ActivatePendingAgreementInput
  ) {
    activatePendingAgreement(contractId: $contractId, request: $request) {
      id
      holderMemberId
    }
  }
`
export type ActivatePendingAgreementMutationFn = ApolloReactCommon.MutationFunction<
  ActivatePendingAgreementMutation,
  ActivatePendingAgreementMutationVariables
>

/**
 * __useActivatePendingAgreementMutation__
 *
 * To run a mutation, you first call `useActivatePendingAgreementMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useActivatePendingAgreementMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [activatePendingAgreementMutation, { data, loading, error }] = useActivatePendingAgreementMutation({
 *   variables: {
 *      contractId: // value for 'contractId'
 *      request: // value for 'request'
 *   },
 * });
 */
export function useActivatePendingAgreementMutation(
  baseOptions?: ApolloReactHooks.MutationHookOptions<
    ActivatePendingAgreementMutation,
    ActivatePendingAgreementMutationVariables
  >,
) {
  const options = { ...defaultOptions, ...baseOptions }
  return ApolloReactHooks.useMutation<
    ActivatePendingAgreementMutation,
    ActivatePendingAgreementMutationVariables
  >(ActivatePendingAgreementDocument, options)
}
export type ActivatePendingAgreementMutationHookResult = ReturnType<
  typeof useActivatePendingAgreementMutation
>
export type ActivatePendingAgreementMutationResult = ApolloReactCommon.MutationResult<
  ActivatePendingAgreementMutation
>
export type ActivatePendingAgreementMutationOptions = ApolloReactCommon.BaseMutationOptions<
  ActivatePendingAgreementMutation,
  ActivatePendingAgreementMutationVariables
>
export const ChangeFromDateDocument = gql`
  mutation ChangeFromDate($agreementId: ID!, $request: ChangeFromDateInput) {
    changeFromDate(agreementId: $agreementId, request: $request) {
      id
      genericAgreements {
        id
        fromDate
      }
    }
  }
`
export type ChangeFromDateMutationFn = ApolloReactCommon.MutationFunction<
  ChangeFromDateMutation,
  ChangeFromDateMutationVariables
>

/**
 * __useChangeFromDateMutation__
 *
 * To run a mutation, you first call `useChangeFromDateMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useChangeFromDateMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [changeFromDateMutation, { data, loading, error }] = useChangeFromDateMutation({
 *   variables: {
 *      agreementId: // value for 'agreementId'
 *      request: // value for 'request'
 *   },
 * });
 */
export function useChangeFromDateMutation(
  baseOptions?: ApolloReactHooks.MutationHookOptions<
    ChangeFromDateMutation,
    ChangeFromDateMutationVariables
  >,
) {
  const options = { ...defaultOptions, ...baseOptions }
  return ApolloReactHooks.useMutation<
    ChangeFromDateMutation,
    ChangeFromDateMutationVariables
  >(ChangeFromDateDocument, options)
}
export type ChangeFromDateMutationHookResult = ReturnType<
  typeof useChangeFromDateMutation
>
export type ChangeFromDateMutationResult = ApolloReactCommon.MutationResult<
  ChangeFromDateMutation
>
export type ChangeFromDateMutationOptions = ApolloReactCommon.BaseMutationOptions<
  ChangeFromDateMutation,
  ChangeFromDateMutationVariables
>
export const ChangeTerminationDateDocument = gql`
  mutation ChangeTerminationDate(
    $contractId: ID!
    $request: ChangeTerminationDateInput
  ) {
    changeTerminationDate(contractId: $contractId, request: $request) {
      id
      holderMemberId
      terminationDate
    }
  }
`
export type ChangeTerminationDateMutationFn = ApolloReactCommon.MutationFunction<
  ChangeTerminationDateMutation,
  ChangeTerminationDateMutationVariables
>

/**
 * __useChangeTerminationDateMutation__
 *
 * To run a mutation, you first call `useChangeTerminationDateMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useChangeTerminationDateMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [changeTerminationDateMutation, { data, loading, error }] = useChangeTerminationDateMutation({
 *   variables: {
 *      contractId: // value for 'contractId'
 *      request: // value for 'request'
 *   },
 * });
 */
export function useChangeTerminationDateMutation(
  baseOptions?: ApolloReactHooks.MutationHookOptions<
    ChangeTerminationDateMutation,
    ChangeTerminationDateMutationVariables
  >,
) {
  const options = { ...defaultOptions, ...baseOptions }
  return ApolloReactHooks.useMutation<
    ChangeTerminationDateMutation,
    ChangeTerminationDateMutationVariables
  >(ChangeTerminationDateDocument, options)
}
export type ChangeTerminationDateMutationHookResult = ReturnType<
  typeof useChangeTerminationDateMutation
>
export type ChangeTerminationDateMutationResult = ApolloReactCommon.MutationResult<
  ChangeTerminationDateMutation
>
export type ChangeTerminationDateMutationOptions = ApolloReactCommon.BaseMutationOptions<
  ChangeTerminationDateMutation,
  ChangeTerminationDateMutationVariables
>
export const ChangeToDateDocument = gql`
  mutation ChangeToDate($agreementId: ID!, $request: ChangeToDateInput) {
    changeToDate(agreementId: $agreementId, request: $request) {
      id
      genericAgreements {
        id
        toDate
      }
    }
  }
`
export type ChangeToDateMutationFn = ApolloReactCommon.MutationFunction<
  ChangeToDateMutation,
  ChangeToDateMutationVariables
>

/**
 * __useChangeToDateMutation__
 *
 * To run a mutation, you first call `useChangeToDateMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useChangeToDateMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [changeToDateMutation, { data, loading, error }] = useChangeToDateMutation({
 *   variables: {
 *      agreementId: // value for 'agreementId'
 *      request: // value for 'request'
 *   },
 * });
 */
export function useChangeToDateMutation(
  baseOptions?: ApolloReactHooks.MutationHookOptions<
    ChangeToDateMutation,
    ChangeToDateMutationVariables
  >,
) {
  const options = { ...defaultOptions, ...baseOptions }
  return ApolloReactHooks.useMutation<
    ChangeToDateMutation,
    ChangeToDateMutationVariables
  >(ChangeToDateDocument, options)
}
export type ChangeToDateMutationHookResult = ReturnType<
  typeof useChangeToDateMutation
>
export type ChangeToDateMutationResult = ApolloReactCommon.MutationResult<
  ChangeToDateMutation
>
export type ChangeToDateMutationOptions = ApolloReactCommon.BaseMutationOptions<
  ChangeToDateMutation,
  ChangeToDateMutationVariables
>
export const GetContractsDocument = gql`
  query GetContracts($memberId: ID!) {
    member(id: $memberId) {
      memberId
      contracts {
        id
        holderMemberId
        holderFirstName
        holderLastName
        switchedFrom
        masterInception
        status
        isTerminated
        terminationDate
        currentAgreementId
        hasPendingAgreement
        genericAgreements {
          id
          fromDate
          toDate
          premium {
            amount
            currency
          }
          certificateUrl
          status
          typeOfContract
          address {
            street
            city
            postalCode
          }
          numberCoInsured
          squareMeters
          ancillaryArea
          yearOfConstruction
          numberOfBathrooms
          extraBuildings {
            id
            type
            area
            displayName
            hasWaterConnected
          }
          isSubleted
          lineOfBusinessName
          carrier
          partner
          createdAt
        }
        hasQueuedRenewal
        renewal {
          renewalDate
          draftCertificateUrl
          draftOfAgreementId
        }
        preferredCurrency
        market
        signSource
        typeOfContract
        contractTypeName
        createdAt
        isLocked
      }
    }
  }
`

/**
 * __useGetContractsQuery__
 *
 * To run a query within a React component, call `useGetContractsQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetContractsQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetContractsQuery({
 *   variables: {
 *      memberId: // value for 'memberId'
 *   },
 * });
 */
export function useGetContractsQuery(
  baseOptions: ApolloReactHooks.QueryHookOptions<
    GetContractsQuery,
    GetContractsQueryVariables
  >,
) {
  const options = { ...defaultOptions, ...baseOptions }
  return ApolloReactHooks.useQuery<
    GetContractsQuery,
    GetContractsQueryVariables
  >(GetContractsDocument, options)
}
export function useGetContractsLazyQuery(
  baseOptions?: ApolloReactHooks.LazyQueryHookOptions<
    GetContractsQuery,
    GetContractsQueryVariables
  >,
) {
  const options = { ...defaultOptions, ...baseOptions }
  return ApolloReactHooks.useLazyQuery<
    GetContractsQuery,
    GetContractsQueryVariables
  >(GetContractsDocument, options)
}
export type GetContractsQueryHookResult = ReturnType<
  typeof useGetContractsQuery
>
export type GetContractsLazyQueryHookResult = ReturnType<
  typeof useGetContractsLazyQuery
>
export type GetContractsQueryResult = ApolloReactCommon.QueryResult<
  GetContractsQuery,
  GetContractsQueryVariables
>
export const GetTrialsDocument = gql`
  query GetTrials($memberId: ID!) {
    member(id: $memberId) {
      memberId
      trials {
        id
        fromDate
        toDate
        displayName
        partner
        address {
          street
          city
          zipCode
          livingSpace
          apartmentNo
          floor
        }
        certificateUrl
        status
        createdAt
      }
    }
  }
`

/**
 * __useGetTrialsQuery__
 *
 * To run a query within a React component, call `useGetTrialsQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetTrialsQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetTrialsQuery({
 *   variables: {
 *      memberId: // value for 'memberId'
 *   },
 * });
 */
export function useGetTrialsQuery(
  baseOptions: ApolloReactHooks.QueryHookOptions<
    GetTrialsQuery,
    GetTrialsQueryVariables
  >,
) {
  const options = { ...defaultOptions, ...baseOptions }
  return ApolloReactHooks.useQuery<GetTrialsQuery, GetTrialsQueryVariables>(
    GetTrialsDocument,
    options,
  )
}
export function useGetTrialsLazyQuery(
  baseOptions?: ApolloReactHooks.LazyQueryHookOptions<
    GetTrialsQuery,
    GetTrialsQueryVariables
  >,
) {
  const options = { ...defaultOptions, ...baseOptions }
  return ApolloReactHooks.useLazyQuery<GetTrialsQuery, GetTrialsQueryVariables>(
    GetTrialsDocument,
    options,
  )
}
export type GetTrialsQueryHookResult = ReturnType<typeof useGetTrialsQuery>
export type GetTrialsLazyQueryHookResult = ReturnType<
  typeof useGetTrialsLazyQuery
>
export type GetTrialsQueryResult = ApolloReactCommon.QueryResult<
  GetTrialsQuery,
  GetTrialsQueryVariables
>
export const RegenerateCertificateDocument = gql`
  mutation RegenerateCertificate($agreementId: ID!) {
    regenerateCertificate(agreementId: $agreementId) {
      id
      genericAgreements {
        id
        certificateUrl
      }
    }
  }
`
export type RegenerateCertificateMutationFn = ApolloReactCommon.MutationFunction<
  RegenerateCertificateMutation,
  RegenerateCertificateMutationVariables
>

/**
 * __useRegenerateCertificateMutation__
 *
 * To run a mutation, you first call `useRegenerateCertificateMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useRegenerateCertificateMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [regenerateCertificateMutation, { data, loading, error }] = useRegenerateCertificateMutation({
 *   variables: {
 *      agreementId: // value for 'agreementId'
 *   },
 * });
 */
export function useRegenerateCertificateMutation(
  baseOptions?: ApolloReactHooks.MutationHookOptions<
    RegenerateCertificateMutation,
    RegenerateCertificateMutationVariables
  >,
) {
  const options = { ...defaultOptions, ...baseOptions }
  return ApolloReactHooks.useMutation<
    RegenerateCertificateMutation,
    RegenerateCertificateMutationVariables
  >(RegenerateCertificateDocument, options)
}
export type RegenerateCertificateMutationHookResult = ReturnType<
  typeof useRegenerateCertificateMutation
>
export type RegenerateCertificateMutationResult = ApolloReactCommon.MutationResult<
  RegenerateCertificateMutation
>
export type RegenerateCertificateMutationOptions = ApolloReactCommon.BaseMutationOptions<
  RegenerateCertificateMutation,
  RegenerateCertificateMutationVariables
>
export const SafelyEditAgreementDocument = gql`
  mutation SafelyEditAgreement(
    $agreementId: ID!
    $request: SafelyEditAgreementInput!
  ) {
    safelyEdit(agreementId: $agreementId, request: $request) {
      genericAgreements {
        id
        address {
          street
        }
      }
    }
  }
`
export type SafelyEditAgreementMutationFn = ApolloReactCommon.MutationFunction<
  SafelyEditAgreementMutation,
  SafelyEditAgreementMutationVariables
>

/**
 * __useSafelyEditAgreementMutation__
 *
 * To run a mutation, you first call `useSafelyEditAgreementMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useSafelyEditAgreementMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [safelyEditAgreementMutation, { data, loading, error }] = useSafelyEditAgreementMutation({
 *   variables: {
 *      agreementId: // value for 'agreementId'
 *      request: // value for 'request'
 *   },
 * });
 */
export function useSafelyEditAgreementMutation(
  baseOptions?: ApolloReactHooks.MutationHookOptions<
    SafelyEditAgreementMutation,
    SafelyEditAgreementMutationVariables
  >,
) {
  const options = { ...defaultOptions, ...baseOptions }
  return ApolloReactHooks.useMutation<
    SafelyEditAgreementMutation,
    SafelyEditAgreementMutationVariables
  >(SafelyEditAgreementDocument, options)
}
export type SafelyEditAgreementMutationHookResult = ReturnType<
  typeof useSafelyEditAgreementMutation
>
export type SafelyEditAgreementMutationResult = ApolloReactCommon.MutationResult<
  SafelyEditAgreementMutation
>
export type SafelyEditAgreementMutationOptions = ApolloReactCommon.BaseMutationOptions<
  SafelyEditAgreementMutation,
  SafelyEditAgreementMutationVariables
>
export const TerminateContractDocument = gql`
  mutation TerminateContract(
    $contractId: ID!
    $request: TerminateContractInput
  ) {
    terminateContract(contractId: $contractId, request: $request) {
      id
      holderMemberId
      terminationDate
    }
  }
`
export type TerminateContractMutationFn = ApolloReactCommon.MutationFunction<
  TerminateContractMutation,
  TerminateContractMutationVariables
>

/**
 * __useTerminateContractMutation__
 *
 * To run a mutation, you first call `useTerminateContractMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useTerminateContractMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [terminateContractMutation, { data, loading, error }] = useTerminateContractMutation({
 *   variables: {
 *      contractId: // value for 'contractId'
 *      request: // value for 'request'
 *   },
 * });
 */
export function useTerminateContractMutation(
  baseOptions?: ApolloReactHooks.MutationHookOptions<
    TerminateContractMutation,
    TerminateContractMutationVariables
  >,
) {
  const options = { ...defaultOptions, ...baseOptions }
  return ApolloReactHooks.useMutation<
    TerminateContractMutation,
    TerminateContractMutationVariables
  >(TerminateContractDocument, options)
}
export type TerminateContractMutationHookResult = ReturnType<
  typeof useTerminateContractMutation
>
export type TerminateContractMutationResult = ApolloReactCommon.MutationResult<
  TerminateContractMutation
>
export type TerminateContractMutationOptions = ApolloReactCommon.BaseMutationOptions<
  TerminateContractMutation,
  TerminateContractMutationVariables
>
export const GetMemberNameDocument = gql`
  query GetMemberName($memberId: ID!) {
    member(id: $memberId) {
      memberId
      firstName
      lastName
    }
  }
`

/**
 * __useGetMemberNameQuery__
 *
 * To run a query within a React component, call `useGetMemberNameQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetMemberNameQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetMemberNameQuery({
 *   variables: {
 *      memberId: // value for 'memberId'
 *   },
 * });
 */
export function useGetMemberNameQuery(
  baseOptions: ApolloReactHooks.QueryHookOptions<
    GetMemberNameQuery,
    GetMemberNameQueryVariables
  >,
) {
  const options = { ...defaultOptions, ...baseOptions }
  return ApolloReactHooks.useQuery<
    GetMemberNameQuery,
    GetMemberNameQueryVariables
  >(GetMemberNameDocument, options)
}
export function useGetMemberNameLazyQuery(
  baseOptions?: ApolloReactHooks.LazyQueryHookOptions<
    GetMemberNameQuery,
    GetMemberNameQueryVariables
  >,
) {
  const options = { ...defaultOptions, ...baseOptions }
  return ApolloReactHooks.useLazyQuery<
    GetMemberNameQuery,
    GetMemberNameQueryVariables
  >(GetMemberNameDocument, options)
}
export type GetMemberNameQueryHookResult = ReturnType<
  typeof useGetMemberNameQuery
>
export type GetMemberNameLazyQueryHookResult = ReturnType<
  typeof useGetMemberNameLazyQuery
>
export type GetMemberNameQueryResult = ApolloReactCommon.QueryResult<
  GetMemberNameQuery,
  GetMemberNameQueryVariables
>
export const GetPersonDocument = gql`
  query GetPerson($memberId: ID!) {
    member(id: $memberId) {
      memberId
      pickedLocale
      contractMarketInfo {
        market
      }
      person {
        debtFlag
        status {
          flag
          whitelisted
        }
        whitelisted {
          whitelistedAt
          whitelistedBy
        }
      }
    }
  }
`

/**
 * __useGetPersonQuery__
 *
 * To run a query within a React component, call `useGetPersonQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetPersonQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetPersonQuery({
 *   variables: {
 *      memberId: // value for 'memberId'
 *   },
 * });
 */
export function useGetPersonQuery(
  baseOptions: ApolloReactHooks.QueryHookOptions<
    GetPersonQuery,
    GetPersonQueryVariables
  >,
) {
  const options = { ...defaultOptions, ...baseOptions }
  return ApolloReactHooks.useQuery<GetPersonQuery, GetPersonQueryVariables>(
    GetPersonDocument,
    options,
  )
}
export function useGetPersonLazyQuery(
  baseOptions?: ApolloReactHooks.LazyQueryHookOptions<
    GetPersonQuery,
    GetPersonQueryVariables
  >,
) {
  const options = { ...defaultOptions, ...baseOptions }
  return ApolloReactHooks.useLazyQuery<GetPersonQuery, GetPersonQueryVariables>(
    GetPersonDocument,
    options,
  )
}
export type GetPersonQueryHookResult = ReturnType<typeof useGetPersonQuery>
export type GetPersonLazyQueryHookResult = ReturnType<
  typeof useGetPersonLazyQuery
>
export type GetPersonQueryResult = ApolloReactCommon.QueryResult<
  GetPersonQuery,
  GetPersonQueryVariables
>
export const WhitelistMemberDocument = gql`
  mutation whitelistMember($memberId: ID!) {
    whitelistMember(memberId: $memberId) {
      memberId
    }
  }
`
export type WhitelistMemberMutationFn = ApolloReactCommon.MutationFunction<
  WhitelistMemberMutation,
  WhitelistMemberMutationVariables
>

/**
 * __useWhitelistMemberMutation__
 *
 * To run a mutation, you first call `useWhitelistMemberMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useWhitelistMemberMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [whitelistMemberMutation, { data, loading, error }] = useWhitelistMemberMutation({
 *   variables: {
 *      memberId: // value for 'memberId'
 *   },
 * });
 */
export function useWhitelistMemberMutation(
  baseOptions?: ApolloReactHooks.MutationHookOptions<
    WhitelistMemberMutation,
    WhitelistMemberMutationVariables
  >,
) {
  const options = { ...defaultOptions, ...baseOptions }
  return ApolloReactHooks.useMutation<
    WhitelistMemberMutation,
    WhitelistMemberMutationVariables
  >(WhitelistMemberDocument, options)
}
export type WhitelistMemberMutationHookResult = ReturnType<
  typeof useWhitelistMemberMutation
>
export type WhitelistMemberMutationResult = ApolloReactCommon.MutationResult<
  WhitelistMemberMutation
>
export type WhitelistMemberMutationOptions = ApolloReactCommon.BaseMutationOptions<
  WhitelistMemberMutation,
  WhitelistMemberMutationVariables
>
export const FileUploadsQueryDocument = gql`
  query FileUploadsQuery($memberId: ID!) {
    member(id: $memberId) {
      memberId
      fileUploads {
        fileUploadUrl
        memberId
        timestamp
        mimeType
      }
    }
  }
`

/**
 * __useFileUploadsQueryQuery__
 *
 * To run a query within a React component, call `useFileUploadsQueryQuery` and pass it any options that fit your needs.
 * When your component renders, `useFileUploadsQueryQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useFileUploadsQueryQuery({
 *   variables: {
 *      memberId: // value for 'memberId'
 *   },
 * });
 */
export function useFileUploadsQueryQuery(
  baseOptions: ApolloReactHooks.QueryHookOptions<
    FileUploadsQueryQuery,
    FileUploadsQueryQueryVariables
  >,
) {
  const options = { ...defaultOptions, ...baseOptions }
  return ApolloReactHooks.useQuery<
    FileUploadsQueryQuery,
    FileUploadsQueryQueryVariables
  >(FileUploadsQueryDocument, options)
}
export function useFileUploadsQueryLazyQuery(
  baseOptions?: ApolloReactHooks.LazyQueryHookOptions<
    FileUploadsQueryQuery,
    FileUploadsQueryQueryVariables
  >,
) {
  const options = { ...defaultOptions, ...baseOptions }
  return ApolloReactHooks.useLazyQuery<
    FileUploadsQueryQuery,
    FileUploadsQueryQueryVariables
  >(FileUploadsQueryDocument, options)
}
export type FileUploadsQueryQueryHookResult = ReturnType<
  typeof useFileUploadsQueryQuery
>
export type FileUploadsQueryLazyQueryHookResult = ReturnType<
  typeof useFileUploadsQueryLazyQuery
>
export type FileUploadsQueryQueryResult = ApolloReactCommon.QueryResult<
  FileUploadsQueryQuery,
  FileUploadsQueryQueryVariables
>
export const EditMemberInfoDocument = gql`
  mutation EditMemberInfo($request: EditMemberInfoInput!) {
    editMemberInfo(request: $request) {
      memberId
      firstName
      lastName
      email
      phoneNumber
    }
  }
`
export type EditMemberInfoMutationFn = ApolloReactCommon.MutationFunction<
  EditMemberInfoMutation,
  EditMemberInfoMutationVariables
>

/**
 * __useEditMemberInfoMutation__
 *
 * To run a mutation, you first call `useEditMemberInfoMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useEditMemberInfoMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [editMemberInfoMutation, { data, loading, error }] = useEditMemberInfoMutation({
 *   variables: {
 *      request: // value for 'request'
 *   },
 * });
 */
export function useEditMemberInfoMutation(
  baseOptions?: ApolloReactHooks.MutationHookOptions<
    EditMemberInfoMutation,
    EditMemberInfoMutationVariables
  >,
) {
  const options = { ...defaultOptions, ...baseOptions }
  return ApolloReactHooks.useMutation<
    EditMemberInfoMutation,
    EditMemberInfoMutationVariables
  >(EditMemberInfoDocument, options)
}
export type EditMemberInfoMutationHookResult = ReturnType<
  typeof useEditMemberInfoMutation
>
export type EditMemberInfoMutationResult = ApolloReactCommon.MutationResult<
  EditMemberInfoMutation
>
export type EditMemberInfoMutationOptions = ApolloReactCommon.BaseMutationOptions<
  EditMemberInfoMutation,
  EditMemberInfoMutationVariables
>
export const GetMemberInfoDocument = gql`
  query GetMemberInfo($memberId: ID!) {
    member(id: $memberId) {
      memberId
      email
      phoneNumber
      firstName
      lastName
      birthDate
      personalNumber
      fraudulentStatus
      fraudulentStatusDescription
      status
      signedOn
      createdOn
      contractMarketInfo {
        market
      }
      pickedLocale
      claims {
        id
        registrationDate
        state
        claimType
      }
    }
  }
`

/**
 * __useGetMemberInfoQuery__
 *
 * To run a query within a React component, call `useGetMemberInfoQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetMemberInfoQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetMemberInfoQuery({
 *   variables: {
 *      memberId: // value for 'memberId'
 *   },
 * });
 */
export function useGetMemberInfoQuery(
  baseOptions: ApolloReactHooks.QueryHookOptions<
    GetMemberInfoQuery,
    GetMemberInfoQueryVariables
  >,
) {
  const options = { ...defaultOptions, ...baseOptions }
  return ApolloReactHooks.useQuery<
    GetMemberInfoQuery,
    GetMemberInfoQueryVariables
  >(GetMemberInfoDocument, options)
}
export function useGetMemberInfoLazyQuery(
  baseOptions?: ApolloReactHooks.LazyQueryHookOptions<
    GetMemberInfoQuery,
    GetMemberInfoQueryVariables
  >,
) {
  const options = { ...defaultOptions, ...baseOptions }
  return ApolloReactHooks.useLazyQuery<
    GetMemberInfoQuery,
    GetMemberInfoQueryVariables
  >(GetMemberInfoDocument, options)
}
export type GetMemberInfoQueryHookResult = ReturnType<
  typeof useGetMemberInfoQuery
>
export type GetMemberInfoLazyQueryHookResult = ReturnType<
  typeof useGetMemberInfoLazyQuery
>
export type GetMemberInfoQueryResult = ApolloReactCommon.QueryResult<
  GetMemberInfoQuery,
  GetMemberInfoQueryVariables
>
export const SetFraudulentStatusDocument = gql`
  mutation SetFraudulentStatus(
    $memberId: ID!
    $request: MemberFraudulentStatusInput!
  ) {
    setFraudulentStatus(memberId: $memberId, request: $request) {
      memberId
      fraudulentStatus
      fraudulentStatusDescription
    }
  }
`
export type SetFraudulentStatusMutationFn = ApolloReactCommon.MutationFunction<
  SetFraudulentStatusMutation,
  SetFraudulentStatusMutationVariables
>

/**
 * __useSetFraudulentStatusMutation__
 *
 * To run a mutation, you first call `useSetFraudulentStatusMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useSetFraudulentStatusMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [setFraudulentStatusMutation, { data, loading, error }] = useSetFraudulentStatusMutation({
 *   variables: {
 *      memberId: // value for 'memberId'
 *      request: // value for 'request'
 *   },
 * });
 */
export function useSetFraudulentStatusMutation(
  baseOptions?: ApolloReactHooks.MutationHookOptions<
    SetFraudulentStatusMutation,
    SetFraudulentStatusMutationVariables
  >,
) {
  const options = { ...defaultOptions, ...baseOptions }
  return ApolloReactHooks.useMutation<
    SetFraudulentStatusMutation,
    SetFraudulentStatusMutationVariables
  >(SetFraudulentStatusDocument, options)
}
export type SetFraudulentStatusMutationHookResult = ReturnType<
  typeof useSetFraudulentStatusMutation
>
export type SetFraudulentStatusMutationResult = ApolloReactCommon.MutationResult<
  SetFraudulentStatusMutation
>
export type SetFraudulentStatusMutationOptions = ApolloReactCommon.BaseMutationOptions<
  SetFraudulentStatusMutation,
  SetFraudulentStatusMutationVariables
>
export const CreatePaymentCompletionLinkDocument = gql`
  mutation CreatePaymentCompletionLink($memberId: ID!) {
    createPaymentCompletionLink(memberId: $memberId) {
      url
    }
  }
`
export type CreatePaymentCompletionLinkMutationFn = ApolloReactCommon.MutationFunction<
  CreatePaymentCompletionLinkMutation,
  CreatePaymentCompletionLinkMutationVariables
>

/**
 * __useCreatePaymentCompletionLinkMutation__
 *
 * To run a mutation, you first call `useCreatePaymentCompletionLinkMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useCreatePaymentCompletionLinkMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [createPaymentCompletionLinkMutation, { data, loading, error }] = useCreatePaymentCompletionLinkMutation({
 *   variables: {
 *      memberId: // value for 'memberId'
 *   },
 * });
 */
export function useCreatePaymentCompletionLinkMutation(
  baseOptions?: ApolloReactHooks.MutationHookOptions<
    CreatePaymentCompletionLinkMutation,
    CreatePaymentCompletionLinkMutationVariables
  >,
) {
  const options = { ...defaultOptions, ...baseOptions }
  return ApolloReactHooks.useMutation<
    CreatePaymentCompletionLinkMutation,
    CreatePaymentCompletionLinkMutationVariables
  >(CreatePaymentCompletionLinkDocument, options)
}
export type CreatePaymentCompletionLinkMutationHookResult = ReturnType<
  typeof useCreatePaymentCompletionLinkMutation
>
export type CreatePaymentCompletionLinkMutationResult = ApolloReactCommon.MutationResult<
  CreatePaymentCompletionLinkMutation
>
export type CreatePaymentCompletionLinkMutationOptions = ApolloReactCommon.BaseMutationOptions<
  CreatePaymentCompletionLinkMutation,
  CreatePaymentCompletionLinkMutationVariables
>
export const GetContractMarketInfoDocument = gql`
  query GetContractMarketInfo($memberId: ID!) {
    member(id: $memberId) {
      memberId
      contractMarketInfo {
        market
        preferredCurrency
      }
    }
  }
`

/**
 * __useGetContractMarketInfoQuery__
 *
 * To run a query within a React component, call `useGetContractMarketInfoQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetContractMarketInfoQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetContractMarketInfoQuery({
 *   variables: {
 *      memberId: // value for 'memberId'
 *   },
 * });
 */
export function useGetContractMarketInfoQuery(
  baseOptions: ApolloReactHooks.QueryHookOptions<
    GetContractMarketInfoQuery,
    GetContractMarketInfoQueryVariables
  >,
) {
  const options = { ...defaultOptions, ...baseOptions }
  return ApolloReactHooks.useQuery<
    GetContractMarketInfoQuery,
    GetContractMarketInfoQueryVariables
  >(GetContractMarketInfoDocument, options)
}
export function useGetContractMarketInfoLazyQuery(
  baseOptions?: ApolloReactHooks.LazyQueryHookOptions<
    GetContractMarketInfoQuery,
    GetContractMarketInfoQueryVariables
  >,
) {
  const options = { ...defaultOptions, ...baseOptions }
  return ApolloReactHooks.useLazyQuery<
    GetContractMarketInfoQuery,
    GetContractMarketInfoQueryVariables
  >(GetContractMarketInfoDocument, options)
}
export type GetContractMarketInfoQueryHookResult = ReturnType<
  typeof useGetContractMarketInfoQuery
>
export type GetContractMarketInfoLazyQueryHookResult = ReturnType<
  typeof useGetContractMarketInfoLazyQuery
>
export type GetContractMarketInfoQueryResult = ApolloReactCommon.QueryResult<
  GetContractMarketInfoQuery,
  GetContractMarketInfoQueryVariables
>
export const GetMemberTransactionsDocument = gql`
  query GetMemberTransactions($id: ID!) {
    member(id: $id) {
      memberId
      contractMarketInfo {
        market
        preferredCurrency
      }
      directDebitStatus {
        activated
      }
      payoutMethodStatus {
        activated
      }
      identity {
        nationalIdentification {
          identification
          nationality
        }
        firstName
        lastName
      }
      transactions {
        id
        amount {
          amount
          currency
        }
        timestamp
        type
        status
      }
    }
  }
`

/**
 * __useGetMemberTransactionsQuery__
 *
 * To run a query within a React component, call `useGetMemberTransactionsQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetMemberTransactionsQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetMemberTransactionsQuery({
 *   variables: {
 *      id: // value for 'id'
 *   },
 * });
 */
export function useGetMemberTransactionsQuery(
  baseOptions: ApolloReactHooks.QueryHookOptions<
    GetMemberTransactionsQuery,
    GetMemberTransactionsQueryVariables
  >,
) {
  const options = { ...defaultOptions, ...baseOptions }
  return ApolloReactHooks.useQuery<
    GetMemberTransactionsQuery,
    GetMemberTransactionsQueryVariables
  >(GetMemberTransactionsDocument, options)
}
export function useGetMemberTransactionsLazyQuery(
  baseOptions?: ApolloReactHooks.LazyQueryHookOptions<
    GetMemberTransactionsQuery,
    GetMemberTransactionsQueryVariables
  >,
) {
  const options = { ...defaultOptions, ...baseOptions }
  return ApolloReactHooks.useLazyQuery<
    GetMemberTransactionsQuery,
    GetMemberTransactionsQueryVariables
  >(GetMemberTransactionsDocument, options)
}
export type GetMemberTransactionsQueryHookResult = ReturnType<
  typeof useGetMemberTransactionsQuery
>
export type GetMemberTransactionsLazyQueryHookResult = ReturnType<
  typeof useGetMemberTransactionsLazyQuery
>
export type GetMemberTransactionsQueryResult = ApolloReactCommon.QueryResult<
  GetMemberTransactionsQuery,
  GetMemberTransactionsQueryVariables
>
export const PayoutMemberDocument = gql`
  mutation PayoutMember($memberId: ID!, $request: PayoutMemberInput!) {
    payoutMember(memberId: $memberId, request: $request) {
      id
      amount {
        amount
        currency
      }
      timestamp
      type
      status
    }
  }
`
export type PayoutMemberMutationFn = ApolloReactCommon.MutationFunction<
  PayoutMemberMutation,
  PayoutMemberMutationVariables
>

/**
 * __usePayoutMemberMutation__
 *
 * To run a mutation, you first call `usePayoutMemberMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `usePayoutMemberMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [payoutMemberMutation, { data, loading, error }] = usePayoutMemberMutation({
 *   variables: {
 *      memberId: // value for 'memberId'
 *      request: // value for 'request'
 *   },
 * });
 */
export function usePayoutMemberMutation(
  baseOptions?: ApolloReactHooks.MutationHookOptions<
    PayoutMemberMutation,
    PayoutMemberMutationVariables
  >,
) {
  const options = { ...defaultOptions, ...baseOptions }
  return ApolloReactHooks.useMutation<
    PayoutMemberMutation,
    PayoutMemberMutationVariables
  >(PayoutMemberDocument, options)
}
export type PayoutMemberMutationHookResult = ReturnType<
  typeof usePayoutMemberMutation
>
export type PayoutMemberMutationResult = ApolloReactCommon.MutationResult<
  PayoutMemberMutation
>
export type PayoutMemberMutationOptions = ApolloReactCommon.BaseMutationOptions<
  PayoutMemberMutation,
  PayoutMemberMutationVariables
>
export const AddAgreementFromQuoteDocument = gql`
  mutation AddAgreementFromQuote(
    $id: ID!
    $contractId: ID!
    $activeFrom: LocalDate
    $activeTo: LocalDate
    $previousAgreementActiveTo: LocalDate
  ) {
    addAgreementFromQuote(
      id: $id
      contractId: $contractId
      activeFrom: $activeFrom
      activeTo: $activeTo
      previousAgreementActiveTo: $previousAgreementActiveTo
    ) {
      id
    }
  }
`
export type AddAgreementFromQuoteMutationFn = ApolloReactCommon.MutationFunction<
  AddAgreementFromQuoteMutation,
  AddAgreementFromQuoteMutationVariables
>

/**
 * __useAddAgreementFromQuoteMutation__
 *
 * To run a mutation, you first call `useAddAgreementFromQuoteMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useAddAgreementFromQuoteMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [addAgreementFromQuoteMutation, { data, loading, error }] = useAddAgreementFromQuoteMutation({
 *   variables: {
 *      id: // value for 'id'
 *      contractId: // value for 'contractId'
 *      activeFrom: // value for 'activeFrom'
 *      activeTo: // value for 'activeTo'
 *      previousAgreementActiveTo: // value for 'previousAgreementActiveTo'
 *   },
 * });
 */
export function useAddAgreementFromQuoteMutation(
  baseOptions?: ApolloReactHooks.MutationHookOptions<
    AddAgreementFromQuoteMutation,
    AddAgreementFromQuoteMutationVariables
  >,
) {
  const options = { ...defaultOptions, ...baseOptions }
  return ApolloReactHooks.useMutation<
    AddAgreementFromQuoteMutation,
    AddAgreementFromQuoteMutationVariables
  >(AddAgreementFromQuoteDocument, options)
}
export type AddAgreementFromQuoteMutationHookResult = ReturnType<
  typeof useAddAgreementFromQuoteMutation
>
export type AddAgreementFromQuoteMutationResult = ApolloReactCommon.MutationResult<
  AddAgreementFromQuoteMutation
>
export type AddAgreementFromQuoteMutationOptions = ApolloReactCommon.BaseMutationOptions<
  AddAgreementFromQuoteMutation,
  AddAgreementFromQuoteMutationVariables
>
export const CreateQuoteForMemberBySchemaDocument = gql`
  mutation CreateQuoteForMemberBySchema(
    $memberId: ID!
    $schemaData: JSON!
    $bypassUnderwritingGuidelines: Boolean!
  ) {
    createQuoteForMemberBySchema(
      memberId: $memberId
      schemaData: $schemaData
      bypassUnderwritingGuidelines: $bypassUnderwritingGuidelines
    ) {
      id
    }
  }
`
export type CreateQuoteForMemberBySchemaMutationFn = ApolloReactCommon.MutationFunction<
  CreateQuoteForMemberBySchemaMutation,
  CreateQuoteForMemberBySchemaMutationVariables
>

/**
 * __useCreateQuoteForMemberBySchemaMutation__
 *
 * To run a mutation, you first call `useCreateQuoteForMemberBySchemaMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useCreateQuoteForMemberBySchemaMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [createQuoteForMemberBySchemaMutation, { data, loading, error }] = useCreateQuoteForMemberBySchemaMutation({
 *   variables: {
 *      memberId: // value for 'memberId'
 *      schemaData: // value for 'schemaData'
 *      bypassUnderwritingGuidelines: // value for 'bypassUnderwritingGuidelines'
 *   },
 * });
 */
export function useCreateQuoteForMemberBySchemaMutation(
  baseOptions?: ApolloReactHooks.MutationHookOptions<
    CreateQuoteForMemberBySchemaMutation,
    CreateQuoteForMemberBySchemaMutationVariables
  >,
) {
  const options = { ...defaultOptions, ...baseOptions }
  return ApolloReactHooks.useMutation<
    CreateQuoteForMemberBySchemaMutation,
    CreateQuoteForMemberBySchemaMutationVariables
  >(CreateQuoteForMemberBySchemaDocument, options)
}
export type CreateQuoteForMemberBySchemaMutationHookResult = ReturnType<
  typeof useCreateQuoteForMemberBySchemaMutation
>
export type CreateQuoteForMemberBySchemaMutationResult = ApolloReactCommon.MutationResult<
  CreateQuoteForMemberBySchemaMutation
>
export type CreateQuoteForMemberBySchemaMutationOptions = ApolloReactCommon.BaseMutationOptions<
  CreateQuoteForMemberBySchemaMutation,
  CreateQuoteForMemberBySchemaMutationVariables
>
export const CreateQuoteFromAgreementDocument = gql`
  mutation CreateQuoteFromAgreement($agreementId: ID!, $memberId: ID!) {
    createQuoteFromAgreement(agreementId: $agreementId, memberId: $memberId) {
      id
    }
  }
`
export type CreateQuoteFromAgreementMutationFn = ApolloReactCommon.MutationFunction<
  CreateQuoteFromAgreementMutation,
  CreateQuoteFromAgreementMutationVariables
>

/**
 * __useCreateQuoteFromAgreementMutation__
 *
 * To run a mutation, you first call `useCreateQuoteFromAgreementMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useCreateQuoteFromAgreementMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [createQuoteFromAgreementMutation, { data, loading, error }] = useCreateQuoteFromAgreementMutation({
 *   variables: {
 *      agreementId: // value for 'agreementId'
 *      memberId: // value for 'memberId'
 *   },
 * });
 */
export function useCreateQuoteFromAgreementMutation(
  baseOptions?: ApolloReactHooks.MutationHookOptions<
    CreateQuoteFromAgreementMutation,
    CreateQuoteFromAgreementMutationVariables
  >,
) {
  const options = { ...defaultOptions, ...baseOptions }
  return ApolloReactHooks.useMutation<
    CreateQuoteFromAgreementMutation,
    CreateQuoteFromAgreementMutationVariables
  >(CreateQuoteFromAgreementDocument, options)
}
export type CreateQuoteFromAgreementMutationHookResult = ReturnType<
  typeof useCreateQuoteFromAgreementMutation
>
export type CreateQuoteFromAgreementMutationResult = ApolloReactCommon.MutationResult<
  CreateQuoteFromAgreementMutation
>
export type CreateQuoteFromAgreementMutationOptions = ApolloReactCommon.BaseMutationOptions<
  CreateQuoteFromAgreementMutation,
  CreateQuoteFromAgreementMutationVariables
>
export const GetQuotesDocument = gql`
  query GetQuotes($memberId: ID!) {
    member(id: $memberId) {
      memberId
      contractMarketInfo {
        market
        preferredCurrency
      }
      pickedLocale
      quotes {
        id
        memberId
        price
        currency
        productType
        state
        startDate
        validity
        isComplete
        createdAt
        breachedUnderwritingGuidelines
        originatingProductId
        signedProductId
        isReadyToSign
        schema
        schemaData
      }
    }
  }
`

/**
 * __useGetQuotesQuery__
 *
 * To run a query within a React component, call `useGetQuotesQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetQuotesQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetQuotesQuery({
 *   variables: {
 *      memberId: // value for 'memberId'
 *   },
 * });
 */
export function useGetQuotesQuery(
  baseOptions: ApolloReactHooks.QueryHookOptions<
    GetQuotesQuery,
    GetQuotesQueryVariables
  >,
) {
  const options = { ...defaultOptions, ...baseOptions }
  return ApolloReactHooks.useQuery<GetQuotesQuery, GetQuotesQueryVariables>(
    GetQuotesDocument,
    options,
  )
}
export function useGetQuotesLazyQuery(
  baseOptions?: ApolloReactHooks.LazyQueryHookOptions<
    GetQuotesQuery,
    GetQuotesQueryVariables
  >,
) {
  const options = { ...defaultOptions, ...baseOptions }
  return ApolloReactHooks.useLazyQuery<GetQuotesQuery, GetQuotesQueryVariables>(
    GetQuotesDocument,
    options,
  )
}
export type GetQuotesQueryHookResult = ReturnType<typeof useGetQuotesQuery>
export type GetQuotesLazyQueryHookResult = ReturnType<
  typeof useGetQuotesLazyQuery
>
export type GetQuotesQueryResult = ApolloReactCommon.QueryResult<
  GetQuotesQuery,
  GetQuotesQueryVariables
>
export const GetSchemaForContractTypeDocument = gql`
  query GetSchemaForContractType($contractType: String!) {
    quoteSchemaForContractType(contractType: $contractType)
  }
`

/**
 * __useGetSchemaForContractTypeQuery__
 *
 * To run a query within a React component, call `useGetSchemaForContractTypeQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetSchemaForContractTypeQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetSchemaForContractTypeQuery({
 *   variables: {
 *      contractType: // value for 'contractType'
 *   },
 * });
 */
export function useGetSchemaForContractTypeQuery(
  baseOptions: ApolloReactHooks.QueryHookOptions<
    GetSchemaForContractTypeQuery,
    GetSchemaForContractTypeQueryVariables
  >,
) {
  const options = { ...defaultOptions, ...baseOptions }
  return ApolloReactHooks.useQuery<
    GetSchemaForContractTypeQuery,
    GetSchemaForContractTypeQueryVariables
  >(GetSchemaForContractTypeDocument, options)
}
export function useGetSchemaForContractTypeLazyQuery(
  baseOptions?: ApolloReactHooks.LazyQueryHookOptions<
    GetSchemaForContractTypeQuery,
    GetSchemaForContractTypeQueryVariables
  >,
) {
  const options = { ...defaultOptions, ...baseOptions }
  return ApolloReactHooks.useLazyQuery<
    GetSchemaForContractTypeQuery,
    GetSchemaForContractTypeQueryVariables
  >(GetSchemaForContractTypeDocument, options)
}
export type GetSchemaForContractTypeQueryHookResult = ReturnType<
  typeof useGetSchemaForContractTypeQuery
>
export type GetSchemaForContractTypeLazyQueryHookResult = ReturnType<
  typeof useGetSchemaForContractTypeLazyQuery
>
export type GetSchemaForContractTypeQueryResult = ApolloReactCommon.QueryResult<
  GetSchemaForContractTypeQuery,
  GetSchemaForContractTypeQueryVariables
>
export const OverrideQuotePriceDocument = gql`
  mutation OverrideQuotePrice($input: OverrideQuotePriceInput!) {
    overrideQuotePrice(input: $input) {
      id
    }
  }
`
export type OverrideQuotePriceMutationFn = ApolloReactCommon.MutationFunction<
  OverrideQuotePriceMutation,
  OverrideQuotePriceMutationVariables
>

/**
 * __useOverrideQuotePriceMutation__
 *
 * To run a mutation, you first call `useOverrideQuotePriceMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useOverrideQuotePriceMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [overrideQuotePriceMutation, { data, loading, error }] = useOverrideQuotePriceMutation({
 *   variables: {
 *      input: // value for 'input'
 *   },
 * });
 */
export function useOverrideQuotePriceMutation(
  baseOptions?: ApolloReactHooks.MutationHookOptions<
    OverrideQuotePriceMutation,
    OverrideQuotePriceMutationVariables
  >,
) {
  const options = { ...defaultOptions, ...baseOptions }
  return ApolloReactHooks.useMutation<
    OverrideQuotePriceMutation,
    OverrideQuotePriceMutationVariables
  >(OverrideQuotePriceDocument, options)
}
export type OverrideQuotePriceMutationHookResult = ReturnType<
  typeof useOverrideQuotePriceMutation
>
export type OverrideQuotePriceMutationResult = ApolloReactCommon.MutationResult<
  OverrideQuotePriceMutation
>
export type OverrideQuotePriceMutationOptions = ApolloReactCommon.BaseMutationOptions<
  OverrideQuotePriceMutation,
  OverrideQuotePriceMutationVariables
>
export const SignQuoteForNewContractDocument = gql`
  mutation SignQuoteForNewContract($quoteId: ID!, $activationDate: LocalDate) {
    signQuoteForNewContract(
      quoteId: $quoteId
      activationDate: $activationDate
    ) {
      id
    }
  }
`
export type SignQuoteForNewContractMutationFn = ApolloReactCommon.MutationFunction<
  SignQuoteForNewContractMutation,
  SignQuoteForNewContractMutationVariables
>

/**
 * __useSignQuoteForNewContractMutation__
 *
 * To run a mutation, you first call `useSignQuoteForNewContractMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useSignQuoteForNewContractMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [signQuoteForNewContractMutation, { data, loading, error }] = useSignQuoteForNewContractMutation({
 *   variables: {
 *      quoteId: // value for 'quoteId'
 *      activationDate: // value for 'activationDate'
 *   },
 * });
 */
export function useSignQuoteForNewContractMutation(
  baseOptions?: ApolloReactHooks.MutationHookOptions<
    SignQuoteForNewContractMutation,
    SignQuoteForNewContractMutationVariables
  >,
) {
  const options = { ...defaultOptions, ...baseOptions }
  return ApolloReactHooks.useMutation<
    SignQuoteForNewContractMutation,
    SignQuoteForNewContractMutationVariables
  >(SignQuoteForNewContractDocument, options)
}
export type SignQuoteForNewContractMutationHookResult = ReturnType<
  typeof useSignQuoteForNewContractMutation
>
export type SignQuoteForNewContractMutationResult = ApolloReactCommon.MutationResult<
  SignQuoteForNewContractMutation
>
export type SignQuoteForNewContractMutationOptions = ApolloReactCommon.BaseMutationOptions<
  SignQuoteForNewContractMutation,
  SignQuoteForNewContractMutationVariables
>
export const UpdateQuoteBySchemaDocument = gql`
  mutation UpdateQuoteBySchema(
    $quoteId: ID!
    $schemaData: JSON!
    $bypassUnderwritingGuidelines: Boolean!
  ) {
    updateQuoteBySchema(
      quoteId: $quoteId
      schemaData: $schemaData
      bypassUnderwritingGuidelines: $bypassUnderwritingGuidelines
    ) {
      id
    }
  }
`
export type UpdateQuoteBySchemaMutationFn = ApolloReactCommon.MutationFunction<
  UpdateQuoteBySchemaMutation,
  UpdateQuoteBySchemaMutationVariables
>

/**
 * __useUpdateQuoteBySchemaMutation__
 *
 * To run a mutation, you first call `useUpdateQuoteBySchemaMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useUpdateQuoteBySchemaMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [updateQuoteBySchemaMutation, { data, loading, error }] = useUpdateQuoteBySchemaMutation({
 *   variables: {
 *      quoteId: // value for 'quoteId'
 *      schemaData: // value for 'schemaData'
 *      bypassUnderwritingGuidelines: // value for 'bypassUnderwritingGuidelines'
 *   },
 * });
 */
export function useUpdateQuoteBySchemaMutation(
  baseOptions?: ApolloReactHooks.MutationHookOptions<
    UpdateQuoteBySchemaMutation,
    UpdateQuoteBySchemaMutationVariables
  >,
) {
  const options = { ...defaultOptions, ...baseOptions }
  return ApolloReactHooks.useMutation<
    UpdateQuoteBySchemaMutation,
    UpdateQuoteBySchemaMutationVariables
  >(UpdateQuoteBySchemaDocument, options)
}
export type UpdateQuoteBySchemaMutationHookResult = ReturnType<
  typeof useUpdateQuoteBySchemaMutation
>
export type UpdateQuoteBySchemaMutationResult = ApolloReactCommon.MutationResult<
  UpdateQuoteBySchemaMutation
>
export type UpdateQuoteBySchemaMutationOptions = ApolloReactCommon.BaseMutationOptions<
  UpdateQuoteBySchemaMutation,
  UpdateQuoteBySchemaMutationVariables
>
export const MemberSearchDocument = gql`
  query MemberSearch($query: String!, $options: MemberSearchOptions!) {
    memberSearch(query: $query, options: $options) {
      members {
        memberId
        firstName
        lastName
        status
        signedOn
        birthDate
        contractMarketInfo {
          market
        }
        contracts {
          status
          masterInception
          terminationDate
        }
      }
      page
      totalPages
    }
  }
`

/**
 * __useMemberSearchQuery__
 *
 * To run a query within a React component, call `useMemberSearchQuery` and pass it any options that fit your needs.
 * When your component renders, `useMemberSearchQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useMemberSearchQuery({
 *   variables: {
 *      query: // value for 'query'
 *      options: // value for 'options'
 *   },
 * });
 */
export function useMemberSearchQuery(
  baseOptions: ApolloReactHooks.QueryHookOptions<
    MemberSearchQuery,
    MemberSearchQueryVariables
  >,
) {
  const options = { ...defaultOptions, ...baseOptions }
  return ApolloReactHooks.useQuery<
    MemberSearchQuery,
    MemberSearchQueryVariables
  >(MemberSearchDocument, options)
}
export function useMemberSearchLazyQuery(
  baseOptions?: ApolloReactHooks.LazyQueryHookOptions<
    MemberSearchQuery,
    MemberSearchQueryVariables
  >,
) {
  const options = { ...defaultOptions, ...baseOptions }
  return ApolloReactHooks.useLazyQuery<
    MemberSearchQuery,
    MemberSearchQueryVariables
  >(MemberSearchDocument, options)
}
export type MemberSearchQueryHookResult = ReturnType<
  typeof useMemberSearchQuery
>
export type MemberSearchLazyQueryHookResult = ReturnType<
  typeof useMemberSearchLazyQuery
>
export type MemberSearchQueryResult = ApolloReactCommon.QueryResult<
  MemberSearchQuery,
  MemberSearchQueryVariables
>
export const AnswerQuestionDocument = gql`
  mutation AnswerQuestion($memberId: ID!, $answer: String!) {
    answerQuestion(memberId: $memberId, answer: $answer)
  }
`
export type AnswerQuestionMutationFn = ApolloReactCommon.MutationFunction<
  AnswerQuestionMutation,
  AnswerQuestionMutationVariables
>

/**
 * __useAnswerQuestionMutation__
 *
 * To run a mutation, you first call `useAnswerQuestionMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useAnswerQuestionMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [answerQuestionMutation, { data, loading, error }] = useAnswerQuestionMutation({
 *   variables: {
 *      memberId: // value for 'memberId'
 *      answer: // value for 'answer'
 *   },
 * });
 */
export function useAnswerQuestionMutation(
  baseOptions?: ApolloReactHooks.MutationHookOptions<
    AnswerQuestionMutation,
    AnswerQuestionMutationVariables
  >,
) {
  const options = { ...defaultOptions, ...baseOptions }
  return ApolloReactHooks.useMutation<
    AnswerQuestionMutation,
    AnswerQuestionMutationVariables
  >(AnswerQuestionDocument, options)
}
export type AnswerQuestionMutationHookResult = ReturnType<
  typeof useAnswerQuestionMutation
>
export type AnswerQuestionMutationResult = ApolloReactCommon.MutationResult<
  AnswerQuestionMutation
>
export type AnswerQuestionMutationOptions = ApolloReactCommon.BaseMutationOptions<
  AnswerQuestionMutation,
  AnswerQuestionMutationVariables
>
export const GetQuestionsGroupsDocument = gql`
  query GetQuestionsGroups {
    questionGroups {
      id
      memberId
      questions {
        id
        messageJsonString
        timestamp
      }
      member {
        memberId
        firstName
        lastName
        contractMarketInfo {
          market
        }
        pickedLocale
        claims(filterByStates: [OPEN, REOPENED]) {
          id
          state
        }
      }
    }
  }
`

/**
 * __useGetQuestionsGroupsQuery__
 *
 * To run a query within a React component, call `useGetQuestionsGroupsQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetQuestionsGroupsQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetQuestionsGroupsQuery({
 *   variables: {
 *   },
 * });
 */
export function useGetQuestionsGroupsQuery(
  baseOptions?: ApolloReactHooks.QueryHookOptions<
    GetQuestionsGroupsQuery,
    GetQuestionsGroupsQueryVariables
  >,
) {
  const options = { ...defaultOptions, ...baseOptions }
  return ApolloReactHooks.useQuery<
    GetQuestionsGroupsQuery,
    GetQuestionsGroupsQueryVariables
  >(GetQuestionsGroupsDocument, options)
}
export function useGetQuestionsGroupsLazyQuery(
  baseOptions?: ApolloReactHooks.LazyQueryHookOptions<
    GetQuestionsGroupsQuery,
    GetQuestionsGroupsQueryVariables
  >,
) {
  const options = { ...defaultOptions, ...baseOptions }
  return ApolloReactHooks.useLazyQuery<
    GetQuestionsGroupsQuery,
    GetQuestionsGroupsQueryVariables
  >(GetQuestionsGroupsDocument, options)
}
export type GetQuestionsGroupsQueryHookResult = ReturnType<
  typeof useGetQuestionsGroupsQuery
>
export type GetQuestionsGroupsLazyQueryHookResult = ReturnType<
  typeof useGetQuestionsGroupsLazyQuery
>
export type GetQuestionsGroupsQueryResult = ApolloReactCommon.QueryResult<
  GetQuestionsGroupsQuery,
  GetQuestionsGroupsQueryVariables
>
export const MarkQuestionAsResolvedDocument = gql`
  mutation MarkQuestionAsResolved($memberId: ID!) {
    markQuestionAsResolved(memberId: $memberId)
  }
`
export type MarkQuestionAsResolvedMutationFn = ApolloReactCommon.MutationFunction<
  MarkQuestionAsResolvedMutation,
  MarkQuestionAsResolvedMutationVariables
>

/**
 * __useMarkQuestionAsResolvedMutation__
 *
 * To run a mutation, you first call `useMarkQuestionAsResolvedMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useMarkQuestionAsResolvedMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [markQuestionAsResolvedMutation, { data, loading, error }] = useMarkQuestionAsResolvedMutation({
 *   variables: {
 *      memberId: // value for 'memberId'
 *   },
 * });
 */
export function useMarkQuestionAsResolvedMutation(
  baseOptions?: ApolloReactHooks.MutationHookOptions<
    MarkQuestionAsResolvedMutation,
    MarkQuestionAsResolvedMutationVariables
  >,
) {
  const options = { ...defaultOptions, ...baseOptions }
  return ApolloReactHooks.useMutation<
    MarkQuestionAsResolvedMutation,
    MarkQuestionAsResolvedMutationVariables
  >(MarkQuestionAsResolvedDocument, options)
}
export type MarkQuestionAsResolvedMutationHookResult = ReturnType<
  typeof useMarkQuestionAsResolvedMutation
>
export type MarkQuestionAsResolvedMutationResult = ApolloReactCommon.MutationResult<
  MarkQuestionAsResolvedMutation
>
export type MarkQuestionAsResolvedMutationOptions = ApolloReactCommon.BaseMutationOptions<
  MarkQuestionAsResolvedMutation,
  MarkQuestionAsResolvedMutationVariables
>
export const MemberNameAndContractMarketInfoDocument = gql`
  query MemberNameAndContractMarketInfo($memberId: ID!) {
    member(id: $memberId) {
      memberId
      firstName
      lastName
      contractMarketInfo {
        market
      }
      pickedLocale
    }
  }
`

/**
 * __useMemberNameAndContractMarketInfoQuery__
 *
 * To run a query within a React component, call `useMemberNameAndContractMarketInfoQuery` and pass it any options that fit your needs.
 * When your component renders, `useMemberNameAndContractMarketInfoQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useMemberNameAndContractMarketInfoQuery({
 *   variables: {
 *      memberId: // value for 'memberId'
 *   },
 * });
 */
export function useMemberNameAndContractMarketInfoQuery(
  baseOptions: ApolloReactHooks.QueryHookOptions<
    MemberNameAndContractMarketInfoQuery,
    MemberNameAndContractMarketInfoQueryVariables
  >,
) {
  const options = { ...defaultOptions, ...baseOptions }
  return ApolloReactHooks.useQuery<
    MemberNameAndContractMarketInfoQuery,
    MemberNameAndContractMarketInfoQueryVariables
  >(MemberNameAndContractMarketInfoDocument, options)
}
export function useMemberNameAndContractMarketInfoLazyQuery(
  baseOptions?: ApolloReactHooks.LazyQueryHookOptions<
    MemberNameAndContractMarketInfoQuery,
    MemberNameAndContractMarketInfoQueryVariables
  >,
) {
  const options = { ...defaultOptions, ...baseOptions }
  return ApolloReactHooks.useLazyQuery<
    MemberNameAndContractMarketInfoQuery,
    MemberNameAndContractMarketInfoQueryVariables
  >(MemberNameAndContractMarketInfoDocument, options)
}
export type MemberNameAndContractMarketInfoQueryHookResult = ReturnType<
  typeof useMemberNameAndContractMarketInfoQuery
>
export type MemberNameAndContractMarketInfoLazyQueryHookResult = ReturnType<
  typeof useMemberNameAndContractMarketInfoLazyQuery
>
export type MemberNameAndContractMarketInfoQueryResult = ApolloReactCommon.QueryResult<
  MemberNameAndContractMarketInfoQuery,
  MemberNameAndContractMarketInfoQueryVariables
>
export const SendMessageDocument = gql`
  mutation SendMessage($input: SendMessageInput!) {
    sendMessage(input: $input) {
      ... on SendMessageFailed {
        memberId
        errorCode
        errorMessage
      }
      ... on SendMessageSuccessful {
        memberId
      }
    }
  }
`
export type SendMessageMutationFn = ApolloReactCommon.MutationFunction<
  SendMessageMutation,
  SendMessageMutationVariables
>

/**
 * __useSendMessageMutation__
 *
 * To run a mutation, you first call `useSendMessageMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useSendMessageMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [sendMessageMutation, { data, loading, error }] = useSendMessageMutation({
 *   variables: {
 *      input: // value for 'input'
 *   },
 * });
 */
export function useSendMessageMutation(
  baseOptions?: ApolloReactHooks.MutationHookOptions<
    SendMessageMutation,
    SendMessageMutationVariables
  >,
) {
  const options = { ...defaultOptions, ...baseOptions }
  return ApolloReactHooks.useMutation<
    SendMessageMutation,
    SendMessageMutationVariables
  >(SendMessageDocument, options)
}
export type SendMessageMutationHookResult = ReturnType<
  typeof useSendMessageMutation
>
export type SendMessageMutationResult = ApolloReactCommon.MutationResult<
  SendMessageMutation
>
export type SendMessageMutationOptions = ApolloReactCommon.BaseMutationOptions<
  SendMessageMutation,
  SendMessageMutationVariables
>
export const GrantResourceAccessDocument = gql`
  mutation GrantResourceAccess(
    $resourceId: ID!
    $grantHolder: String!
    $grantHolderType: GrantHolderType!
  ) {
    grantResourceAccess(
      resourceId: $resourceId
      grantHolder: $grantHolder
      grantHolderType: $grantHolderType
    ) {
      resourceId
      usersGranted {
        id
        email
        fullName
        role
      }
      usersRestricted {
        id
        email
        fullName
        role
      }
      rolesGranted
      rolesRestricted
    }
  }
`
export type GrantResourceAccessMutationFn = ApolloReactCommon.MutationFunction<
  GrantResourceAccessMutation,
  GrantResourceAccessMutationVariables
>

/**
 * __useGrantResourceAccessMutation__
 *
 * To run a mutation, you first call `useGrantResourceAccessMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useGrantResourceAccessMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [grantResourceAccessMutation, { data, loading, error }] = useGrantResourceAccessMutation({
 *   variables: {
 *      resourceId: // value for 'resourceId'
 *      grantHolder: // value for 'grantHolder'
 *      grantHolderType: // value for 'grantHolderType'
 *   },
 * });
 */
export function useGrantResourceAccessMutation(
  baseOptions?: ApolloReactHooks.MutationHookOptions<
    GrantResourceAccessMutation,
    GrantResourceAccessMutationVariables
  >,
) {
  const options = { ...defaultOptions, ...baseOptions }
  return ApolloReactHooks.useMutation<
    GrantResourceAccessMutation,
    GrantResourceAccessMutationVariables
  >(GrantResourceAccessDocument, options)
}
export type GrantResourceAccessMutationHookResult = ReturnType<
  typeof useGrantResourceAccessMutation
>
export type GrantResourceAccessMutationResult = ApolloReactCommon.MutationResult<
  GrantResourceAccessMutation
>
export type GrantResourceAccessMutationOptions = ApolloReactCommon.BaseMutationOptions<
  GrantResourceAccessMutation,
  GrantResourceAccessMutationVariables
>
export const ReleaseResourceAccessDocument = gql`
  mutation ReleaseResourceAccess($resourceId: ID!) {
    releaseResourceAccess(resourceId: $resourceId)
  }
`
export type ReleaseResourceAccessMutationFn = ApolloReactCommon.MutationFunction<
  ReleaseResourceAccessMutation,
  ReleaseResourceAccessMutationVariables
>

/**
 * __useReleaseResourceAccessMutation__
 *
 * To run a mutation, you first call `useReleaseResourceAccessMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useReleaseResourceAccessMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [releaseResourceAccessMutation, { data, loading, error }] = useReleaseResourceAccessMutation({
 *   variables: {
 *      resourceId: // value for 'resourceId'
 *   },
 * });
 */
export function useReleaseResourceAccessMutation(
  baseOptions?: ApolloReactHooks.MutationHookOptions<
    ReleaseResourceAccessMutation,
    ReleaseResourceAccessMutationVariables
  >,
) {
  const options = { ...defaultOptions, ...baseOptions }
  return ApolloReactHooks.useMutation<
    ReleaseResourceAccessMutation,
    ReleaseResourceAccessMutationVariables
  >(ReleaseResourceAccessDocument, options)
}
export type ReleaseResourceAccessMutationHookResult = ReturnType<
  typeof useReleaseResourceAccessMutation
>
export type ReleaseResourceAccessMutationResult = ApolloReactCommon.MutationResult<
  ReleaseResourceAccessMutation
>
export type ReleaseResourceAccessMutationOptions = ApolloReactCommon.BaseMutationOptions<
  ReleaseResourceAccessMutation,
  ReleaseResourceAccessMutationVariables
>
export const ResourceAccessInformationDocument = gql`
  query ResourceAccessInformation($resourceId: String!) {
    resourceAccess(resourceId: $resourceId) {
      resourceId
      restrictedByMe
      restrictedBy {
        id
        email
        fullName
        role
      }
      usersGranted {
        id
        email
        fullName
        role
      }
      usersRestricted {
        id
        email
        fullName
        role
      }
      rolesGranted
      rolesRestricted
    }
  }
`

/**
 * __useResourceAccessInformationQuery__
 *
 * To run a query within a React component, call `useResourceAccessInformationQuery` and pass it any options that fit your needs.
 * When your component renders, `useResourceAccessInformationQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useResourceAccessInformationQuery({
 *   variables: {
 *      resourceId: // value for 'resourceId'
 *   },
 * });
 */
export function useResourceAccessInformationQuery(
  baseOptions: ApolloReactHooks.QueryHookOptions<
    ResourceAccessInformationQuery,
    ResourceAccessInformationQueryVariables
  >,
) {
  const options = { ...defaultOptions, ...baseOptions }
  return ApolloReactHooks.useQuery<
    ResourceAccessInformationQuery,
    ResourceAccessInformationQueryVariables
  >(ResourceAccessInformationDocument, options)
}
export function useResourceAccessInformationLazyQuery(
  baseOptions?: ApolloReactHooks.LazyQueryHookOptions<
    ResourceAccessInformationQuery,
    ResourceAccessInformationQueryVariables
  >,
) {
  const options = { ...defaultOptions, ...baseOptions }
  return ApolloReactHooks.useLazyQuery<
    ResourceAccessInformationQuery,
    ResourceAccessInformationQueryVariables
  >(ResourceAccessInformationDocument, options)
}
export type ResourceAccessInformationQueryHookResult = ReturnType<
  typeof useResourceAccessInformationQuery
>
export type ResourceAccessInformationLazyQueryHookResult = ReturnType<
  typeof useResourceAccessInformationLazyQuery
>
export type ResourceAccessInformationQueryResult = ApolloReactCommon.QueryResult<
  ResourceAccessInformationQuery,
  ResourceAccessInformationQueryVariables
>
export const AssignCampaignToPartnerFreeMonthsDocument = gql`
  mutation AssignCampaignToPartnerFreeMonths(
    $request: AssignVoucherFreeMonths
  ) {
    assignCampaignToPartnerFreeMonths(request: $request)
  }
`
export type AssignCampaignToPartnerFreeMonthsMutationFn = ApolloReactCommon.MutationFunction<
  AssignCampaignToPartnerFreeMonthsMutation,
  AssignCampaignToPartnerFreeMonthsMutationVariables
>

/**
 * __useAssignCampaignToPartnerFreeMonthsMutation__
 *
 * To run a mutation, you first call `useAssignCampaignToPartnerFreeMonthsMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useAssignCampaignToPartnerFreeMonthsMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [assignCampaignToPartnerFreeMonthsMutation, { data, loading, error }] = useAssignCampaignToPartnerFreeMonthsMutation({
 *   variables: {
 *      request: // value for 'request'
 *   },
 * });
 */
export function useAssignCampaignToPartnerFreeMonthsMutation(
  baseOptions?: ApolloReactHooks.MutationHookOptions<
    AssignCampaignToPartnerFreeMonthsMutation,
    AssignCampaignToPartnerFreeMonthsMutationVariables
  >,
) {
  const options = { ...defaultOptions, ...baseOptions }
  return ApolloReactHooks.useMutation<
    AssignCampaignToPartnerFreeMonthsMutation,
    AssignCampaignToPartnerFreeMonthsMutationVariables
  >(AssignCampaignToPartnerFreeMonthsDocument, options)
}
export type AssignCampaignToPartnerFreeMonthsMutationHookResult = ReturnType<
  typeof useAssignCampaignToPartnerFreeMonthsMutation
>
export type AssignCampaignToPartnerFreeMonthsMutationResult = ApolloReactCommon.MutationResult<
  AssignCampaignToPartnerFreeMonthsMutation
>
export type AssignCampaignToPartnerFreeMonthsMutationOptions = ApolloReactCommon.BaseMutationOptions<
  AssignCampaignToPartnerFreeMonthsMutation,
  AssignCampaignToPartnerFreeMonthsMutationVariables
>
export const AssignCampaignToPartnerNoDiscountDocument = gql`
  mutation AssignCampaignToPartnerNoDiscount(
    $request: AssignVoucherNoDiscount
  ) {
    assignCampaignToPartnerNoDiscount(request: $request)
  }
`
export type AssignCampaignToPartnerNoDiscountMutationFn = ApolloReactCommon.MutationFunction<
  AssignCampaignToPartnerNoDiscountMutation,
  AssignCampaignToPartnerNoDiscountMutationVariables
>

/**
 * __useAssignCampaignToPartnerNoDiscountMutation__
 *
 * To run a mutation, you first call `useAssignCampaignToPartnerNoDiscountMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useAssignCampaignToPartnerNoDiscountMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [assignCampaignToPartnerNoDiscountMutation, { data, loading, error }] = useAssignCampaignToPartnerNoDiscountMutation({
 *   variables: {
 *      request: // value for 'request'
 *   },
 * });
 */
export function useAssignCampaignToPartnerNoDiscountMutation(
  baseOptions?: ApolloReactHooks.MutationHookOptions<
    AssignCampaignToPartnerNoDiscountMutation,
    AssignCampaignToPartnerNoDiscountMutationVariables
  >,
) {
  const options = { ...defaultOptions, ...baseOptions }
  return ApolloReactHooks.useMutation<
    AssignCampaignToPartnerNoDiscountMutation,
    AssignCampaignToPartnerNoDiscountMutationVariables
  >(AssignCampaignToPartnerNoDiscountDocument, options)
}
export type AssignCampaignToPartnerNoDiscountMutationHookResult = ReturnType<
  typeof useAssignCampaignToPartnerNoDiscountMutation
>
export type AssignCampaignToPartnerNoDiscountMutationResult = ApolloReactCommon.MutationResult<
  AssignCampaignToPartnerNoDiscountMutation
>
export type AssignCampaignToPartnerNoDiscountMutationOptions = ApolloReactCommon.BaseMutationOptions<
  AssignCampaignToPartnerNoDiscountMutation,
  AssignCampaignToPartnerNoDiscountMutationVariables
>
export const AssignCampaignToPartnerPercentageDiscountDocument = gql`
  mutation AssignCampaignToPartnerPercentageDiscount(
    $request: AssignVoucherPercentageDiscount
  ) {
    assignCampaignToPartnerPercentageDiscount(request: $request)
  }
`
export type AssignCampaignToPartnerPercentageDiscountMutationFn = ApolloReactCommon.MutationFunction<
  AssignCampaignToPartnerPercentageDiscountMutation,
  AssignCampaignToPartnerPercentageDiscountMutationVariables
>

/**
 * __useAssignCampaignToPartnerPercentageDiscountMutation__
 *
 * To run a mutation, you first call `useAssignCampaignToPartnerPercentageDiscountMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useAssignCampaignToPartnerPercentageDiscountMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [assignCampaignToPartnerPercentageDiscountMutation, { data, loading, error }] = useAssignCampaignToPartnerPercentageDiscountMutation({
 *   variables: {
 *      request: // value for 'request'
 *   },
 * });
 */
export function useAssignCampaignToPartnerPercentageDiscountMutation(
  baseOptions?: ApolloReactHooks.MutationHookOptions<
    AssignCampaignToPartnerPercentageDiscountMutation,
    AssignCampaignToPartnerPercentageDiscountMutationVariables
  >,
) {
  const options = { ...defaultOptions, ...baseOptions }
  return ApolloReactHooks.useMutation<
    AssignCampaignToPartnerPercentageDiscountMutation,
    AssignCampaignToPartnerPercentageDiscountMutationVariables
  >(AssignCampaignToPartnerPercentageDiscountDocument, options)
}
export type AssignCampaignToPartnerPercentageDiscountMutationHookResult = ReturnType<
  typeof useAssignCampaignToPartnerPercentageDiscountMutation
>
export type AssignCampaignToPartnerPercentageDiscountMutationResult = ApolloReactCommon.MutationResult<
  AssignCampaignToPartnerPercentageDiscountMutation
>
export type AssignCampaignToPartnerPercentageDiscountMutationOptions = ApolloReactCommon.BaseMutationOptions<
  AssignCampaignToPartnerPercentageDiscountMutation,
  AssignCampaignToPartnerPercentageDiscountMutationVariables
>
export const AssignCampaignToPartnerVisibleNoDiscountDocument = gql`
  mutation AssignCampaignToPartnerVisibleNoDiscount(
    $request: AssignVoucherVisibleNoDiscount
  ) {
    assignCampaignToPartnerVisibleNoDiscount(request: $request)
  }
`
export type AssignCampaignToPartnerVisibleNoDiscountMutationFn = ApolloReactCommon.MutationFunction<
  AssignCampaignToPartnerVisibleNoDiscountMutation,
  AssignCampaignToPartnerVisibleNoDiscountMutationVariables
>

/**
 * __useAssignCampaignToPartnerVisibleNoDiscountMutation__
 *
 * To run a mutation, you first call `useAssignCampaignToPartnerVisibleNoDiscountMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useAssignCampaignToPartnerVisibleNoDiscountMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [assignCampaignToPartnerVisibleNoDiscountMutation, { data, loading, error }] = useAssignCampaignToPartnerVisibleNoDiscountMutation({
 *   variables: {
 *      request: // value for 'request'
 *   },
 * });
 */
export function useAssignCampaignToPartnerVisibleNoDiscountMutation(
  baseOptions?: ApolloReactHooks.MutationHookOptions<
    AssignCampaignToPartnerVisibleNoDiscountMutation,
    AssignCampaignToPartnerVisibleNoDiscountMutationVariables
  >,
) {
  const options = { ...defaultOptions, ...baseOptions }
  return ApolloReactHooks.useMutation<
    AssignCampaignToPartnerVisibleNoDiscountMutation,
    AssignCampaignToPartnerVisibleNoDiscountMutationVariables
  >(AssignCampaignToPartnerVisibleNoDiscountDocument, options)
}
export type AssignCampaignToPartnerVisibleNoDiscountMutationHookResult = ReturnType<
  typeof useAssignCampaignToPartnerVisibleNoDiscountMutation
>
export type AssignCampaignToPartnerVisibleNoDiscountMutationResult = ApolloReactCommon.MutationResult<
  AssignCampaignToPartnerVisibleNoDiscountMutation
>
export type AssignCampaignToPartnerVisibleNoDiscountMutationOptions = ApolloReactCommon.BaseMutationOptions<
  AssignCampaignToPartnerVisibleNoDiscountMutation,
  AssignCampaignToPartnerVisibleNoDiscountMutationVariables
>
export const AvailableCampaignCodeTypesDocument = gql`
  query AvailableCampaignCodeTypes {
    availableCampaignCodeTypes
  }
`

/**
 * __useAvailableCampaignCodeTypesQuery__
 *
 * To run a query within a React component, call `useAvailableCampaignCodeTypesQuery` and pass it any options that fit your needs.
 * When your component renders, `useAvailableCampaignCodeTypesQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useAvailableCampaignCodeTypesQuery({
 *   variables: {
 *   },
 * });
 */
export function useAvailableCampaignCodeTypesQuery(
  baseOptions?: ApolloReactHooks.QueryHookOptions<
    AvailableCampaignCodeTypesQuery,
    AvailableCampaignCodeTypesQueryVariables
  >,
) {
  const options = { ...defaultOptions, ...baseOptions }
  return ApolloReactHooks.useQuery<
    AvailableCampaignCodeTypesQuery,
    AvailableCampaignCodeTypesQueryVariables
  >(AvailableCampaignCodeTypesDocument, options)
}
export function useAvailableCampaignCodeTypesLazyQuery(
  baseOptions?: ApolloReactHooks.LazyQueryHookOptions<
    AvailableCampaignCodeTypesQuery,
    AvailableCampaignCodeTypesQueryVariables
  >,
) {
  const options = { ...defaultOptions, ...baseOptions }
  return ApolloReactHooks.useLazyQuery<
    AvailableCampaignCodeTypesQuery,
    AvailableCampaignCodeTypesQueryVariables
  >(AvailableCampaignCodeTypesDocument, options)
}
export type AvailableCampaignCodeTypesQueryHookResult = ReturnType<
  typeof useAvailableCampaignCodeTypesQuery
>
export type AvailableCampaignCodeTypesLazyQueryHookResult = ReturnType<
  typeof useAvailableCampaignCodeTypesLazyQuery
>
export type AvailableCampaignCodeTypesQueryResult = ApolloReactCommon.QueryResult<
  AvailableCampaignCodeTypesQuery,
  AvailableCampaignCodeTypesQueryVariables
>
export const CreateCampaignPartnerDocument = gql`
  mutation CreateCampaignPartner($partnerId: ID!, $partnerName: String!) {
    createCampaignPartner(partnerId: $partnerId, partnerName: $partnerName)
  }
`
export type CreateCampaignPartnerMutationFn = ApolloReactCommon.MutationFunction<
  CreateCampaignPartnerMutation,
  CreateCampaignPartnerMutationVariables
>

/**
 * __useCreateCampaignPartnerMutation__
 *
 * To run a mutation, you first call `useCreateCampaignPartnerMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useCreateCampaignPartnerMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [createCampaignPartnerMutation, { data, loading, error }] = useCreateCampaignPartnerMutation({
 *   variables: {
 *      partnerId: // value for 'partnerId'
 *      partnerName: // value for 'partnerName'
 *   },
 * });
 */
export function useCreateCampaignPartnerMutation(
  baseOptions?: ApolloReactHooks.MutationHookOptions<
    CreateCampaignPartnerMutation,
    CreateCampaignPartnerMutationVariables
  >,
) {
  const options = { ...defaultOptions, ...baseOptions }
  return ApolloReactHooks.useMutation<
    CreateCampaignPartnerMutation,
    CreateCampaignPartnerMutationVariables
  >(CreateCampaignPartnerDocument, options)
}
export type CreateCampaignPartnerMutationHookResult = ReturnType<
  typeof useCreateCampaignPartnerMutation
>
export type CreateCampaignPartnerMutationResult = ApolloReactCommon.MutationResult<
  CreateCampaignPartnerMutation
>
export type CreateCampaignPartnerMutationOptions = ApolloReactCommon.BaseMutationOptions<
  CreateCampaignPartnerMutation,
  CreateCampaignPartnerMutationVariables
>
export const GetPartnerCampaignOwnersDocument = gql`
  query GetPartnerCampaignOwners {
    getPartnerCampaignOwners {
      partnerId
    }
  }
`

/**
 * __useGetPartnerCampaignOwnersQuery__
 *
 * To run a query within a React component, call `useGetPartnerCampaignOwnersQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetPartnerCampaignOwnersQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetPartnerCampaignOwnersQuery({
 *   variables: {
 *   },
 * });
 */
export function useGetPartnerCampaignOwnersQuery(
  baseOptions?: ApolloReactHooks.QueryHookOptions<
    GetPartnerCampaignOwnersQuery,
    GetPartnerCampaignOwnersQueryVariables
  >,
) {
  const options = { ...defaultOptions, ...baseOptions }
  return ApolloReactHooks.useQuery<
    GetPartnerCampaignOwnersQuery,
    GetPartnerCampaignOwnersQueryVariables
  >(GetPartnerCampaignOwnersDocument, options)
}
export function useGetPartnerCampaignOwnersLazyQuery(
  baseOptions?: ApolloReactHooks.LazyQueryHookOptions<
    GetPartnerCampaignOwnersQuery,
    GetPartnerCampaignOwnersQueryVariables
  >,
) {
  const options = { ...defaultOptions, ...baseOptions }
  return ApolloReactHooks.useLazyQuery<
    GetPartnerCampaignOwnersQuery,
    GetPartnerCampaignOwnersQueryVariables
  >(GetPartnerCampaignOwnersDocument, options)
}
export type GetPartnerCampaignOwnersQueryHookResult = ReturnType<
  typeof useGetPartnerCampaignOwnersQuery
>
export type GetPartnerCampaignOwnersLazyQueryHookResult = ReturnType<
  typeof useGetPartnerCampaignOwnersLazyQuery
>
export type GetPartnerCampaignOwnersQueryResult = ApolloReactCommon.QueryResult<
  GetPartnerCampaignOwnersQuery,
  GetPartnerCampaignOwnersQueryVariables
>
export const FindPartnerCampaignsDocument = gql`
  query FindPartnerCampaigns($input: CampaignFilter!) {
    findPartnerCampaigns(input: $input) {
      id
      campaignCode
      partnerId
      partnerName
      validFrom
      validTo
      incentive {
        ... on MonthlyPercentageDiscountFixedPeriod {
          numberOfMonths
          percentage
        }
        ... on FreeMonths {
          numberOfMonths
        }
        ... on CostDeduction {
          amount
        }
        ... on NoDiscount {
          __typename
        }
        ... on IndefinitePercentageDiscount {
          percentageDiscount
        }
      }
      codeType
    }
  }
`

/**
 * __useFindPartnerCampaignsQuery__
 *
 * To run a query within a React component, call `useFindPartnerCampaignsQuery` and pass it any options that fit your needs.
 * When your component renders, `useFindPartnerCampaignsQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useFindPartnerCampaignsQuery({
 *   variables: {
 *      input: // value for 'input'
 *   },
 * });
 */
export function useFindPartnerCampaignsQuery(
  baseOptions: ApolloReactHooks.QueryHookOptions<
    FindPartnerCampaignsQuery,
    FindPartnerCampaignsQueryVariables
  >,
) {
  const options = { ...defaultOptions, ...baseOptions }
  return ApolloReactHooks.useQuery<
    FindPartnerCampaignsQuery,
    FindPartnerCampaignsQueryVariables
  >(FindPartnerCampaignsDocument, options)
}
export function useFindPartnerCampaignsLazyQuery(
  baseOptions?: ApolloReactHooks.LazyQueryHookOptions<
    FindPartnerCampaignsQuery,
    FindPartnerCampaignsQueryVariables
  >,
) {
  const options = { ...defaultOptions, ...baseOptions }
  return ApolloReactHooks.useLazyQuery<
    FindPartnerCampaignsQuery,
    FindPartnerCampaignsQueryVariables
  >(FindPartnerCampaignsDocument, options)
}
export type FindPartnerCampaignsQueryHookResult = ReturnType<
  typeof useFindPartnerCampaignsQuery
>
export type FindPartnerCampaignsLazyQueryHookResult = ReturnType<
  typeof useFindPartnerCampaignsLazyQuery
>
export type FindPartnerCampaignsQueryResult = ApolloReactCommon.QueryResult<
  FindPartnerCampaignsQuery,
  FindPartnerCampaignsQueryVariables
>
export const SetCampaignCodeTypeDocument = gql`
  mutation SetCampaignCodeType($id: ID!, $codeType: String!) {
    setCampaignCodeType(id: $id, codeType: $codeType) {
      id
      campaignCode
      partnerId
      partnerName
      validFrom
      validTo
      incentive {
        ... on MonthlyPercentageDiscountFixedPeriod {
          numberOfMonths
          percentage
        }
        ... on FreeMonths {
          numberOfMonths
        }
        ... on CostDeduction {
          amount
        }
        ... on NoDiscount {
          __typename
        }
        ... on IndefinitePercentageDiscount {
          percentageDiscount
        }
      }
      codeType
    }
  }
`
export type SetCampaignCodeTypeMutationFn = ApolloReactCommon.MutationFunction<
  SetCampaignCodeTypeMutation,
  SetCampaignCodeTypeMutationVariables
>

/**
 * __useSetCampaignCodeTypeMutation__
 *
 * To run a mutation, you first call `useSetCampaignCodeTypeMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useSetCampaignCodeTypeMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [setCampaignCodeTypeMutation, { data, loading, error }] = useSetCampaignCodeTypeMutation({
 *   variables: {
 *      id: // value for 'id'
 *      codeType: // value for 'codeType'
 *   },
 * });
 */
export function useSetCampaignCodeTypeMutation(
  baseOptions?: ApolloReactHooks.MutationHookOptions<
    SetCampaignCodeTypeMutation,
    SetCampaignCodeTypeMutationVariables
  >,
) {
  const options = { ...defaultOptions, ...baseOptions }
  return ApolloReactHooks.useMutation<
    SetCampaignCodeTypeMutation,
    SetCampaignCodeTypeMutationVariables
  >(SetCampaignCodeTypeDocument, options)
}
export type SetCampaignCodeTypeMutationHookResult = ReturnType<
  typeof useSetCampaignCodeTypeMutation
>
export type SetCampaignCodeTypeMutationResult = ApolloReactCommon.MutationResult<
  SetCampaignCodeTypeMutation
>
export type SetCampaignCodeTypeMutationOptions = ApolloReactCommon.BaseMutationOptions<
  SetCampaignCodeTypeMutation,
  SetCampaignCodeTypeMutationVariables
>
export const PaymentScheduleQueryDocument = gql`
  query PaymentScheduleQuery($month: YearMonth!) {
    paymentSchedule(status: SUBSCRIPTION_SCHEDULED_AND_WAITING_FOR_APPROVAL) {
      id
      member {
        memberId
        firstName
        lastName
        monthlySubscription(month: $month) {
          amount
        }
        account {
          currentBalance {
            amount
            currency
          }
        }
      }
      status
      amount
    }
  }
`

/**
 * __usePaymentScheduleQueryQuery__
 *
 * To run a query within a React component, call `usePaymentScheduleQueryQuery` and pass it any options that fit your needs.
 * When your component renders, `usePaymentScheduleQueryQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = usePaymentScheduleQueryQuery({
 *   variables: {
 *      month: // value for 'month'
 *   },
 * });
 */
export function usePaymentScheduleQueryQuery(
  baseOptions: ApolloReactHooks.QueryHookOptions<
    PaymentScheduleQueryQuery,
    PaymentScheduleQueryQueryVariables
  >,
) {
  const options = { ...defaultOptions, ...baseOptions }
  return ApolloReactHooks.useQuery<
    PaymentScheduleQueryQuery,
    PaymentScheduleQueryQueryVariables
  >(PaymentScheduleQueryDocument, options)
}
export function usePaymentScheduleQueryLazyQuery(
  baseOptions?: ApolloReactHooks.LazyQueryHookOptions<
    PaymentScheduleQueryQuery,
    PaymentScheduleQueryQueryVariables
  >,
) {
  const options = { ...defaultOptions, ...baseOptions }
  return ApolloReactHooks.useLazyQuery<
    PaymentScheduleQueryQuery,
    PaymentScheduleQueryQueryVariables
  >(PaymentScheduleQueryDocument, options)
}
export type PaymentScheduleQueryQueryHookResult = ReturnType<
  typeof usePaymentScheduleQueryQuery
>
export type PaymentScheduleQueryLazyQueryHookResult = ReturnType<
  typeof usePaymentScheduleQueryLazyQuery
>
export type PaymentScheduleQueryQueryResult = ApolloReactCommon.QueryResult<
  PaymentScheduleQueryQuery,
  PaymentScheduleQueryQueryVariables
>
export const CreateClaimPropertyOptionDocument = gql`
  mutation CreateClaimPropertyOption($name: String!) {
    createClaimPropertyOption(name: $name) {
      id
      name
    }
  }
`
export type CreateClaimPropertyOptionMutationFn = ApolloReactCommon.MutationFunction<
  CreateClaimPropertyOptionMutation,
  CreateClaimPropertyOptionMutationVariables
>

/**
 * __useCreateClaimPropertyOptionMutation__
 *
 * To run a mutation, you first call `useCreateClaimPropertyOptionMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useCreateClaimPropertyOptionMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [createClaimPropertyOptionMutation, { data, loading, error }] = useCreateClaimPropertyOptionMutation({
 *   variables: {
 *      name: // value for 'name'
 *   },
 * });
 */
export function useCreateClaimPropertyOptionMutation(
  baseOptions?: ApolloReactHooks.MutationHookOptions<
    CreateClaimPropertyOptionMutation,
    CreateClaimPropertyOptionMutationVariables
  >,
) {
  const options = { ...defaultOptions, ...baseOptions }
  return ApolloReactHooks.useMutation<
    CreateClaimPropertyOptionMutation,
    CreateClaimPropertyOptionMutationVariables
  >(CreateClaimPropertyOptionDocument, options)
}
export type CreateClaimPropertyOptionMutationHookResult = ReturnType<
  typeof useCreateClaimPropertyOptionMutation
>
export type CreateClaimPropertyOptionMutationResult = ApolloReactCommon.MutationResult<
  CreateClaimPropertyOptionMutation
>
export type CreateClaimPropertyOptionMutationOptions = ApolloReactCommon.BaseMutationOptions<
  CreateClaimPropertyOptionMutation,
  CreateClaimPropertyOptionMutationVariables
>
export const CreateClaimPropertyDocument = gql`
  mutation CreateClaimProperty($name: String!) {
    createClaimProperty(name: $name) {
      id
      name
    }
  }
`
export type CreateClaimPropertyMutationFn = ApolloReactCommon.MutationFunction<
  CreateClaimPropertyMutation,
  CreateClaimPropertyMutationVariables
>

/**
 * __useCreateClaimPropertyMutation__
 *
 * To run a mutation, you first call `useCreateClaimPropertyMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useCreateClaimPropertyMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [createClaimPropertyMutation, { data, loading, error }] = useCreateClaimPropertyMutation({
 *   variables: {
 *      name: // value for 'name'
 *   },
 * });
 */
export function useCreateClaimPropertyMutation(
  baseOptions?: ApolloReactHooks.MutationHookOptions<
    CreateClaimPropertyMutation,
    CreateClaimPropertyMutationVariables
  >,
) {
  const options = { ...defaultOptions, ...baseOptions }
  return ApolloReactHooks.useMutation<
    CreateClaimPropertyMutation,
    CreateClaimPropertyMutationVariables
  >(CreateClaimPropertyDocument, options)
}
export type CreateClaimPropertyMutationHookResult = ReturnType<
  typeof useCreateClaimPropertyMutation
>
export type CreateClaimPropertyMutationResult = ApolloReactCommon.MutationResult<
  CreateClaimPropertyMutation
>
export type CreateClaimPropertyMutationOptions = ApolloReactCommon.BaseMutationOptions<
  CreateClaimPropertyMutation,
  CreateClaimPropertyMutationVariables
>
export const CreateClaimTypeRelationDocument = gql`
  mutation CreateClaimTypeRelation($request: CreateClaimTypeRelationInput) {
    createClaimTypeRelation(request: $request) {
      id
      claimType
      property {
        id
        name
      }
      propertyOption {
        id
        name
      }
    }
  }
`
export type CreateClaimTypeRelationMutationFn = ApolloReactCommon.MutationFunction<
  CreateClaimTypeRelationMutation,
  CreateClaimTypeRelationMutationVariables
>

/**
 * __useCreateClaimTypeRelationMutation__
 *
 * To run a mutation, you first call `useCreateClaimTypeRelationMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useCreateClaimTypeRelationMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [createClaimTypeRelationMutation, { data, loading, error }] = useCreateClaimTypeRelationMutation({
 *   variables: {
 *      request: // value for 'request'
 *   },
 * });
 */
export function useCreateClaimTypeRelationMutation(
  baseOptions?: ApolloReactHooks.MutationHookOptions<
    CreateClaimTypeRelationMutation,
    CreateClaimTypeRelationMutationVariables
  >,
) {
  const options = { ...defaultOptions, ...baseOptions }
  return ApolloReactHooks.useMutation<
    CreateClaimTypeRelationMutation,
    CreateClaimTypeRelationMutationVariables
  >(CreateClaimTypeRelationDocument, options)
}
export type CreateClaimTypeRelationMutationHookResult = ReturnType<
  typeof useCreateClaimTypeRelationMutation
>
export type CreateClaimTypeRelationMutationResult = ApolloReactCommon.MutationResult<
  CreateClaimTypeRelationMutation
>
export type CreateClaimTypeRelationMutationOptions = ApolloReactCommon.BaseMutationOptions<
  CreateClaimTypeRelationMutation,
  CreateClaimTypeRelationMutationVariables
>
export const DeleteClaimTypeRelationDocument = gql`
  mutation DeleteClaimTypeRelation($id: ID!) {
    deleteClaimTypeRelation(id: $id)
  }
`
export type DeleteClaimTypeRelationMutationFn = ApolloReactCommon.MutationFunction<
  DeleteClaimTypeRelationMutation,
  DeleteClaimTypeRelationMutationVariables
>

/**
 * __useDeleteClaimTypeRelationMutation__
 *
 * To run a mutation, you first call `useDeleteClaimTypeRelationMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useDeleteClaimTypeRelationMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [deleteClaimTypeRelationMutation, { data, loading, error }] = useDeleteClaimTypeRelationMutation({
 *   variables: {
 *      id: // value for 'id'
 *   },
 * });
 */
export function useDeleteClaimTypeRelationMutation(
  baseOptions?: ApolloReactHooks.MutationHookOptions<
    DeleteClaimTypeRelationMutation,
    DeleteClaimTypeRelationMutationVariables
  >,
) {
  const options = { ...defaultOptions, ...baseOptions }
  return ApolloReactHooks.useMutation<
    DeleteClaimTypeRelationMutation,
    DeleteClaimTypeRelationMutationVariables
  >(DeleteClaimTypeRelationDocument, options)
}
export type DeleteClaimTypeRelationMutationHookResult = ReturnType<
  typeof useDeleteClaimTypeRelationMutation
>
export type DeleteClaimTypeRelationMutationResult = ApolloReactCommon.MutationResult<
  DeleteClaimTypeRelationMutation
>
export type DeleteClaimTypeRelationMutationOptions = ApolloReactCommon.BaseMutationOptions<
  DeleteClaimTypeRelationMutation,
  DeleteClaimTypeRelationMutationVariables
>
export const DeprecateClaimPropertyOptionDocument = gql`
  mutation DeprecateClaimPropertyOption($id: ID!) {
    deprecateClaimPropertyOption(id: $id)
  }
`
export type DeprecateClaimPropertyOptionMutationFn = ApolloReactCommon.MutationFunction<
  DeprecateClaimPropertyOptionMutation,
  DeprecateClaimPropertyOptionMutationVariables
>

/**
 * __useDeprecateClaimPropertyOptionMutation__
 *
 * To run a mutation, you first call `useDeprecateClaimPropertyOptionMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useDeprecateClaimPropertyOptionMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [deprecateClaimPropertyOptionMutation, { data, loading, error }] = useDeprecateClaimPropertyOptionMutation({
 *   variables: {
 *      id: // value for 'id'
 *   },
 * });
 */
export function useDeprecateClaimPropertyOptionMutation(
  baseOptions?: ApolloReactHooks.MutationHookOptions<
    DeprecateClaimPropertyOptionMutation,
    DeprecateClaimPropertyOptionMutationVariables
  >,
) {
  const options = { ...defaultOptions, ...baseOptions }
  return ApolloReactHooks.useMutation<
    DeprecateClaimPropertyOptionMutation,
    DeprecateClaimPropertyOptionMutationVariables
  >(DeprecateClaimPropertyOptionDocument, options)
}
export type DeprecateClaimPropertyOptionMutationHookResult = ReturnType<
  typeof useDeprecateClaimPropertyOptionMutation
>
export type DeprecateClaimPropertyOptionMutationResult = ApolloReactCommon.MutationResult<
  DeprecateClaimPropertyOptionMutation
>
export type DeprecateClaimPropertyOptionMutationOptions = ApolloReactCommon.BaseMutationOptions<
  DeprecateClaimPropertyOptionMutation,
  DeprecateClaimPropertyOptionMutationVariables
>
export const DeprecateClaimPropertyDocument = gql`
  mutation DeprecateClaimProperty($id: ID!) {
    deprecateClaimProperty(id: $id)
  }
`
export type DeprecateClaimPropertyMutationFn = ApolloReactCommon.MutationFunction<
  DeprecateClaimPropertyMutation,
  DeprecateClaimPropertyMutationVariables
>

/**
 * __useDeprecateClaimPropertyMutation__
 *
 * To run a mutation, you first call `useDeprecateClaimPropertyMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useDeprecateClaimPropertyMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [deprecateClaimPropertyMutation, { data, loading, error }] = useDeprecateClaimPropertyMutation({
 *   variables: {
 *      id: // value for 'id'
 *   },
 * });
 */
export function useDeprecateClaimPropertyMutation(
  baseOptions?: ApolloReactHooks.MutationHookOptions<
    DeprecateClaimPropertyMutation,
    DeprecateClaimPropertyMutationVariables
  >,
) {
  const options = { ...defaultOptions, ...baseOptions }
  return ApolloReactHooks.useMutation<
    DeprecateClaimPropertyMutation,
    DeprecateClaimPropertyMutationVariables
  >(DeprecateClaimPropertyDocument, options)
}
export type DeprecateClaimPropertyMutationHookResult = ReturnType<
  typeof useDeprecateClaimPropertyMutation
>
export type DeprecateClaimPropertyMutationResult = ApolloReactCommon.MutationResult<
  DeprecateClaimPropertyMutation
>
export type DeprecateClaimPropertyMutationOptions = ApolloReactCommon.BaseMutationOptions<
  DeprecateClaimPropertyMutation,
  DeprecateClaimPropertyMutationVariables
>
export const UpdateClaimPropertyOptionDocument = gql`
  mutation UpdateClaimPropertyOption($id: ID!, $name: String!) {
    updateClaimPropertyOption(id: $id, name: $name) {
      id
      name
    }
  }
`
export type UpdateClaimPropertyOptionMutationFn = ApolloReactCommon.MutationFunction<
  UpdateClaimPropertyOptionMutation,
  UpdateClaimPropertyOptionMutationVariables
>

/**
 * __useUpdateClaimPropertyOptionMutation__
 *
 * To run a mutation, you first call `useUpdateClaimPropertyOptionMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useUpdateClaimPropertyOptionMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [updateClaimPropertyOptionMutation, { data, loading, error }] = useUpdateClaimPropertyOptionMutation({
 *   variables: {
 *      id: // value for 'id'
 *      name: // value for 'name'
 *   },
 * });
 */
export function useUpdateClaimPropertyOptionMutation(
  baseOptions?: ApolloReactHooks.MutationHookOptions<
    UpdateClaimPropertyOptionMutation,
    UpdateClaimPropertyOptionMutationVariables
  >,
) {
  const options = { ...defaultOptions, ...baseOptions }
  return ApolloReactHooks.useMutation<
    UpdateClaimPropertyOptionMutation,
    UpdateClaimPropertyOptionMutationVariables
  >(UpdateClaimPropertyOptionDocument, options)
}
export type UpdateClaimPropertyOptionMutationHookResult = ReturnType<
  typeof useUpdateClaimPropertyOptionMutation
>
export type UpdateClaimPropertyOptionMutationResult = ApolloReactCommon.MutationResult<
  UpdateClaimPropertyOptionMutation
>
export type UpdateClaimPropertyOptionMutationOptions = ApolloReactCommon.BaseMutationOptions<
  UpdateClaimPropertyOptionMutation,
  UpdateClaimPropertyOptionMutationVariables
>
export const UpdateClaimPropertyDocument = gql`
  mutation UpdateClaimProperty($id: ID!, $name: String!) {
    updateClaimProperty(id: $id, name: $name) {
      id
      name
    }
  }
`
export type UpdateClaimPropertyMutationFn = ApolloReactCommon.MutationFunction<
  UpdateClaimPropertyMutation,
  UpdateClaimPropertyMutationVariables
>

/**
 * __useUpdateClaimPropertyMutation__
 *
 * To run a mutation, you first call `useUpdateClaimPropertyMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useUpdateClaimPropertyMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [updateClaimPropertyMutation, { data, loading, error }] = useUpdateClaimPropertyMutation({
 *   variables: {
 *      id: // value for 'id'
 *      name: // value for 'name'
 *   },
 * });
 */
export function useUpdateClaimPropertyMutation(
  baseOptions?: ApolloReactHooks.MutationHookOptions<
    UpdateClaimPropertyMutation,
    UpdateClaimPropertyMutationVariables
  >,
) {
  const options = { ...defaultOptions, ...baseOptions }
  return ApolloReactHooks.useMutation<
    UpdateClaimPropertyMutation,
    UpdateClaimPropertyMutationVariables
  >(UpdateClaimPropertyDocument, options)
}
export type UpdateClaimPropertyMutationHookResult = ReturnType<
  typeof useUpdateClaimPropertyMutation
>
export type UpdateClaimPropertyMutationResult = ApolloReactCommon.MutationResult<
  UpdateClaimPropertyMutation
>
export type UpdateClaimPropertyMutationOptions = ApolloReactCommon.BaseMutationOptions<
  UpdateClaimPropertyMutation,
  UpdateClaimPropertyMutationVariables
>
export const GetClaimPropertiesDocument = gql`
  query GetClaimProperties {
    claimProperties {
      id
      name
    }
  }
`

/**
 * __useGetClaimPropertiesQuery__
 *
 * To run a query within a React component, call `useGetClaimPropertiesQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetClaimPropertiesQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetClaimPropertiesQuery({
 *   variables: {
 *   },
 * });
 */
export function useGetClaimPropertiesQuery(
  baseOptions?: ApolloReactHooks.QueryHookOptions<
    GetClaimPropertiesQuery,
    GetClaimPropertiesQueryVariables
  >,
) {
  const options = { ...defaultOptions, ...baseOptions }
  return ApolloReactHooks.useQuery<
    GetClaimPropertiesQuery,
    GetClaimPropertiesQueryVariables
  >(GetClaimPropertiesDocument, options)
}
export function useGetClaimPropertiesLazyQuery(
  baseOptions?: ApolloReactHooks.LazyQueryHookOptions<
    GetClaimPropertiesQuery,
    GetClaimPropertiesQueryVariables
  >,
) {
  const options = { ...defaultOptions, ...baseOptions }
  return ApolloReactHooks.useLazyQuery<
    GetClaimPropertiesQuery,
    GetClaimPropertiesQueryVariables
  >(GetClaimPropertiesDocument, options)
}
export type GetClaimPropertiesQueryHookResult = ReturnType<
  typeof useGetClaimPropertiesQuery
>
export type GetClaimPropertiesLazyQueryHookResult = ReturnType<
  typeof useGetClaimPropertiesLazyQuery
>
export type GetClaimPropertiesQueryResult = ApolloReactCommon.QueryResult<
  GetClaimPropertiesQuery,
  GetClaimPropertiesQueryVariables
>
export const GetClaimPropertyOptionDocument = gql`
  query GetClaimPropertyOption($id: ID!) {
    claimPropertyOption(id: $id) {
      id
      name
    }
  }
`

/**
 * __useGetClaimPropertyOptionQuery__
 *
 * To run a query within a React component, call `useGetClaimPropertyOptionQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetClaimPropertyOptionQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetClaimPropertyOptionQuery({
 *   variables: {
 *      id: // value for 'id'
 *   },
 * });
 */
export function useGetClaimPropertyOptionQuery(
  baseOptions: ApolloReactHooks.QueryHookOptions<
    GetClaimPropertyOptionQuery,
    GetClaimPropertyOptionQueryVariables
  >,
) {
  const options = { ...defaultOptions, ...baseOptions }
  return ApolloReactHooks.useQuery<
    GetClaimPropertyOptionQuery,
    GetClaimPropertyOptionQueryVariables
  >(GetClaimPropertyOptionDocument, options)
}
export function useGetClaimPropertyOptionLazyQuery(
  baseOptions?: ApolloReactHooks.LazyQueryHookOptions<
    GetClaimPropertyOptionQuery,
    GetClaimPropertyOptionQueryVariables
  >,
) {
  const options = { ...defaultOptions, ...baseOptions }
  return ApolloReactHooks.useLazyQuery<
    GetClaimPropertyOptionQuery,
    GetClaimPropertyOptionQueryVariables
  >(GetClaimPropertyOptionDocument, options)
}
export type GetClaimPropertyOptionQueryHookResult = ReturnType<
  typeof useGetClaimPropertyOptionQuery
>
export type GetClaimPropertyOptionLazyQueryHookResult = ReturnType<
  typeof useGetClaimPropertyOptionLazyQuery
>
export type GetClaimPropertyOptionQueryResult = ApolloReactCommon.QueryResult<
  GetClaimPropertyOptionQuery,
  GetClaimPropertyOptionQueryVariables
>
export const GetClaimPropertyOptionsDocument = gql`
  query GetClaimPropertyOptions {
    claimPropertyOptions {
      id
      name
    }
  }
`

/**
 * __useGetClaimPropertyOptionsQuery__
 *
 * To run a query within a React component, call `useGetClaimPropertyOptionsQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetClaimPropertyOptionsQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetClaimPropertyOptionsQuery({
 *   variables: {
 *   },
 * });
 */
export function useGetClaimPropertyOptionsQuery(
  baseOptions?: ApolloReactHooks.QueryHookOptions<
    GetClaimPropertyOptionsQuery,
    GetClaimPropertyOptionsQueryVariables
  >,
) {
  const options = { ...defaultOptions, ...baseOptions }
  return ApolloReactHooks.useQuery<
    GetClaimPropertyOptionsQuery,
    GetClaimPropertyOptionsQueryVariables
  >(GetClaimPropertyOptionsDocument, options)
}
export function useGetClaimPropertyOptionsLazyQuery(
  baseOptions?: ApolloReactHooks.LazyQueryHookOptions<
    GetClaimPropertyOptionsQuery,
    GetClaimPropertyOptionsQueryVariables
  >,
) {
  const options = { ...defaultOptions, ...baseOptions }
  return ApolloReactHooks.useLazyQuery<
    GetClaimPropertyOptionsQuery,
    GetClaimPropertyOptionsQueryVariables
  >(GetClaimPropertyOptionsDocument, options)
}
export type GetClaimPropertyOptionsQueryHookResult = ReturnType<
  typeof useGetClaimPropertyOptionsQuery
>
export type GetClaimPropertyOptionsLazyQueryHookResult = ReturnType<
  typeof useGetClaimPropertyOptionsLazyQuery
>
export type GetClaimPropertyOptionsQueryResult = ApolloReactCommon.QueryResult<
  GetClaimPropertyOptionsQuery,
  GetClaimPropertyOptionsQueryVariables
>
export const GetClaimPropertyDocument = gql`
  query GetClaimProperty($id: ID!) {
    claimProperty(id: $id) {
      id
      name
    }
  }
`

/**
 * __useGetClaimPropertyQuery__
 *
 * To run a query within a React component, call `useGetClaimPropertyQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetClaimPropertyQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetClaimPropertyQuery({
 *   variables: {
 *      id: // value for 'id'
 *   },
 * });
 */
export function useGetClaimPropertyQuery(
  baseOptions: ApolloReactHooks.QueryHookOptions<
    GetClaimPropertyQuery,
    GetClaimPropertyQueryVariables
  >,
) {
  const options = { ...defaultOptions, ...baseOptions }
  return ApolloReactHooks.useQuery<
    GetClaimPropertyQuery,
    GetClaimPropertyQueryVariables
  >(GetClaimPropertyDocument, options)
}
export function useGetClaimPropertyLazyQuery(
  baseOptions?: ApolloReactHooks.LazyQueryHookOptions<
    GetClaimPropertyQuery,
    GetClaimPropertyQueryVariables
  >,
) {
  const options = { ...defaultOptions, ...baseOptions }
  return ApolloReactHooks.useLazyQuery<
    GetClaimPropertyQuery,
    GetClaimPropertyQueryVariables
  >(GetClaimPropertyDocument, options)
}
export type GetClaimPropertyQueryHookResult = ReturnType<
  typeof useGetClaimPropertyQuery
>
export type GetClaimPropertyLazyQueryHookResult = ReturnType<
  typeof useGetClaimPropertyLazyQuery
>
export type GetClaimPropertyQueryResult = ApolloReactCommon.QueryResult<
  GetClaimPropertyQuery,
  GetClaimPropertyQueryVariables
>
export const GetClaimTypeRelationsDocument = gql`
  query GetClaimTypeRelations {
    claimTypeRelations {
      id
      claimType
      property {
        id
        name
      }
      propertyOption {
        id
        name
      }
    }
  }
`

/**
 * __useGetClaimTypeRelationsQuery__
 *
 * To run a query within a React component, call `useGetClaimTypeRelationsQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetClaimTypeRelationsQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetClaimTypeRelationsQuery({
 *   variables: {
 *   },
 * });
 */
export function useGetClaimTypeRelationsQuery(
  baseOptions?: ApolloReactHooks.QueryHookOptions<
    GetClaimTypeRelationsQuery,
    GetClaimTypeRelationsQueryVariables
  >,
) {
  const options = { ...defaultOptions, ...baseOptions }
  return ApolloReactHooks.useQuery<
    GetClaimTypeRelationsQuery,
    GetClaimTypeRelationsQueryVariables
  >(GetClaimTypeRelationsDocument, options)
}
export function useGetClaimTypeRelationsLazyQuery(
  baseOptions?: ApolloReactHooks.LazyQueryHookOptions<
    GetClaimTypeRelationsQuery,
    GetClaimTypeRelationsQueryVariables
  >,
) {
  const options = { ...defaultOptions, ...baseOptions }
  return ApolloReactHooks.useLazyQuery<
    GetClaimTypeRelationsQuery,
    GetClaimTypeRelationsQueryVariables
  >(GetClaimTypeRelationsDocument, options)
}
export type GetClaimTypeRelationsQueryHookResult = ReturnType<
  typeof useGetClaimTypeRelationsQuery
>
export type GetClaimTypeRelationsLazyQueryHookResult = ReturnType<
  typeof useGetClaimTypeRelationsLazyQuery
>
export type GetClaimTypeRelationsQueryResult = ApolloReactCommon.QueryResult<
  GetClaimTypeRelationsQuery,
  GetClaimTypeRelationsQueryVariables
>
export const GetClaimTypeTemplateDocument = gql`
  query GetClaimTypeTemplate($claimType: String!) {
    claimTypeTemplate(claimType: $claimType) {
      claimType
      properties {
        propertyId
        name
        options {
          id
          name
        }
      }
    }
  }
`

/**
 * __useGetClaimTypeTemplateQuery__
 *
 * To run a query within a React component, call `useGetClaimTypeTemplateQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetClaimTypeTemplateQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetClaimTypeTemplateQuery({
 *   variables: {
 *      claimType: // value for 'claimType'
 *   },
 * });
 */
export function useGetClaimTypeTemplateQuery(
  baseOptions: ApolloReactHooks.QueryHookOptions<
    GetClaimTypeTemplateQuery,
    GetClaimTypeTemplateQueryVariables
  >,
) {
  const options = { ...defaultOptions, ...baseOptions }
  return ApolloReactHooks.useQuery<
    GetClaimTypeTemplateQuery,
    GetClaimTypeTemplateQueryVariables
  >(GetClaimTypeTemplateDocument, options)
}
export function useGetClaimTypeTemplateLazyQuery(
  baseOptions?: ApolloReactHooks.LazyQueryHookOptions<
    GetClaimTypeTemplateQuery,
    GetClaimTypeTemplateQueryVariables
  >,
) {
  const options = { ...defaultOptions, ...baseOptions }
  return ApolloReactHooks.useLazyQuery<
    GetClaimTypeTemplateQuery,
    GetClaimTypeTemplateQueryVariables
  >(GetClaimTypeTemplateDocument, options)
}
export type GetClaimTypeTemplateQueryHookResult = ReturnType<
  typeof useGetClaimTypeTemplateQuery
>
export type GetClaimTypeTemplateLazyQueryHookResult = ReturnType<
  typeof useGetClaimTypeTemplateLazyQuery
>
export type GetClaimTypeTemplateQueryResult = ApolloReactCommon.QueryResult<
  GetClaimTypeTemplateQuery,
  GetClaimTypeTemplateQueryVariables
>
export const GetClaimTypeTemplatesDocument = gql`
  query GetClaimTypeTemplates {
    claimTypeTemplates {
      claimType
      properties {
        propertyId
        name
        options {
          id
          name
        }
      }
    }
  }
`

/**
 * __useGetClaimTypeTemplatesQuery__
 *
 * To run a query within a React component, call `useGetClaimTypeTemplatesQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetClaimTypeTemplatesQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetClaimTypeTemplatesQuery({
 *   variables: {
 *   },
 * });
 */
export function useGetClaimTypeTemplatesQuery(
  baseOptions?: ApolloReactHooks.QueryHookOptions<
    GetClaimTypeTemplatesQuery,
    GetClaimTypeTemplatesQueryVariables
  >,
) {
  const options = { ...defaultOptions, ...baseOptions }
  return ApolloReactHooks.useQuery<
    GetClaimTypeTemplatesQuery,
    GetClaimTypeTemplatesQueryVariables
  >(GetClaimTypeTemplatesDocument, options)
}
export function useGetClaimTypeTemplatesLazyQuery(
  baseOptions?: ApolloReactHooks.LazyQueryHookOptions<
    GetClaimTypeTemplatesQuery,
    GetClaimTypeTemplatesQueryVariables
  >,
) {
  const options = { ...defaultOptions, ...baseOptions }
  return ApolloReactHooks.useLazyQuery<
    GetClaimTypeTemplatesQuery,
    GetClaimTypeTemplatesQueryVariables
  >(GetClaimTypeTemplatesDocument, options)
}
export type GetClaimTypeTemplatesQueryHookResult = ReturnType<
  typeof useGetClaimTypeTemplatesQuery
>
export type GetClaimTypeTemplatesLazyQueryHookResult = ReturnType<
  typeof useGetClaimTypeTemplatesLazyQuery
>
export type GetClaimTypeTemplatesQueryResult = ApolloReactCommon.QueryResult<
  GetClaimTypeTemplatesQuery,
  GetClaimTypeTemplatesQueryVariables
>
export const GetClaimTypesDocument = gql`
  query GetClaimTypes {
    claimTypes
  }
`

/**
 * __useGetClaimTypesQuery__
 *
 * To run a query within a React component, call `useGetClaimTypesQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetClaimTypesQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetClaimTypesQuery({
 *   variables: {
 *   },
 * });
 */
export function useGetClaimTypesQuery(
  baseOptions?: ApolloReactHooks.QueryHookOptions<
    GetClaimTypesQuery,
    GetClaimTypesQueryVariables
  >,
) {
  const options = { ...defaultOptions, ...baseOptions }
  return ApolloReactHooks.useQuery<
    GetClaimTypesQuery,
    GetClaimTypesQueryVariables
  >(GetClaimTypesDocument, options)
}
export function useGetClaimTypesLazyQuery(
  baseOptions?: ApolloReactHooks.LazyQueryHookOptions<
    GetClaimTypesQuery,
    GetClaimTypesQueryVariables
  >,
) {
  const options = { ...defaultOptions, ...baseOptions }
  return ApolloReactHooks.useLazyQuery<
    GetClaimTypesQuery,
    GetClaimTypesQueryVariables
  >(GetClaimTypesDocument, options)
}
export type GetClaimTypesQueryHookResult = ReturnType<
  typeof useGetClaimTypesQuery
>
export type GetClaimTypesLazyQueryHookResult = ReturnType<
  typeof useGetClaimTypesLazyQuery
>
export type GetClaimTypesQueryResult = ApolloReactCommon.QueryResult<
  GetClaimTypesQuery,
  GetClaimTypesQueryVariables
>
export const AvailableEmployeeRolesDocument = gql`
  query AvailableEmployeeRoles {
    availableEmployeeRoles
  }
`

/**
 * __useAvailableEmployeeRolesQuery__
 *
 * To run a query within a React component, call `useAvailableEmployeeRolesQuery` and pass it any options that fit your needs.
 * When your component renders, `useAvailableEmployeeRolesQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useAvailableEmployeeRolesQuery({
 *   variables: {
 *   },
 * });
 */
export function useAvailableEmployeeRolesQuery(
  baseOptions?: ApolloReactHooks.QueryHookOptions<
    AvailableEmployeeRolesQuery,
    AvailableEmployeeRolesQueryVariables
  >,
) {
  const options = { ...defaultOptions, ...baseOptions }
  return ApolloReactHooks.useQuery<
    AvailableEmployeeRolesQuery,
    AvailableEmployeeRolesQueryVariables
  >(AvailableEmployeeRolesDocument, options)
}
export function useAvailableEmployeeRolesLazyQuery(
  baseOptions?: ApolloReactHooks.LazyQueryHookOptions<
    AvailableEmployeeRolesQuery,
    AvailableEmployeeRolesQueryVariables
  >,
) {
  const options = { ...defaultOptions, ...baseOptions }
  return ApolloReactHooks.useLazyQuery<
    AvailableEmployeeRolesQuery,
    AvailableEmployeeRolesQueryVariables
  >(AvailableEmployeeRolesDocument, options)
}
export type AvailableEmployeeRolesQueryHookResult = ReturnType<
  typeof useAvailableEmployeeRolesQuery
>
export type AvailableEmployeeRolesLazyQueryHookResult = ReturnType<
  typeof useAvailableEmployeeRolesLazyQuery
>
export type AvailableEmployeeRolesQueryResult = ApolloReactCommon.QueryResult<
  AvailableEmployeeRolesQuery,
  AvailableEmployeeRolesQueryVariables
>
export const CreateEmployeeDocument = gql`
  mutation CreateEmployee($email: String!, $role: String!) {
    createEmployee(email: $email, role: $role) {
      id
      email
      role
      firstGrantedAt
    }
  }
`
export type CreateEmployeeMutationFn = ApolloReactCommon.MutationFunction<
  CreateEmployeeMutation,
  CreateEmployeeMutationVariables
>

/**
 * __useCreateEmployeeMutation__
 *
 * To run a mutation, you first call `useCreateEmployeeMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useCreateEmployeeMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [createEmployeeMutation, { data, loading, error }] = useCreateEmployeeMutation({
 *   variables: {
 *      email: // value for 'email'
 *      role: // value for 'role'
 *   },
 * });
 */
export function useCreateEmployeeMutation(
  baseOptions?: ApolloReactHooks.MutationHookOptions<
    CreateEmployeeMutation,
    CreateEmployeeMutationVariables
  >,
) {
  const options = { ...defaultOptions, ...baseOptions }
  return ApolloReactHooks.useMutation<
    CreateEmployeeMutation,
    CreateEmployeeMutationVariables
  >(CreateEmployeeDocument, options)
}
export type CreateEmployeeMutationHookResult = ReturnType<
  typeof useCreateEmployeeMutation
>
export type CreateEmployeeMutationResult = ApolloReactCommon.MutationResult<
  CreateEmployeeMutation
>
export type CreateEmployeeMutationOptions = ApolloReactCommon.BaseMutationOptions<
  CreateEmployeeMutation,
  CreateEmployeeMutationVariables
>
export const EmployeesDocument = gql`
  query Employees {
    employees {
      id
      email
      role
      firstGrantedAt
    }
  }
`

/**
 * __useEmployeesQuery__
 *
 * To run a query within a React component, call `useEmployeesQuery` and pass it any options that fit your needs.
 * When your component renders, `useEmployeesQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useEmployeesQuery({
 *   variables: {
 *   },
 * });
 */
export function useEmployeesQuery(
  baseOptions?: ApolloReactHooks.QueryHookOptions<
    EmployeesQuery,
    EmployeesQueryVariables
  >,
) {
  const options = { ...defaultOptions, ...baseOptions }
  return ApolloReactHooks.useQuery<EmployeesQuery, EmployeesQueryVariables>(
    EmployeesDocument,
    options,
  )
}
export function useEmployeesLazyQuery(
  baseOptions?: ApolloReactHooks.LazyQueryHookOptions<
    EmployeesQuery,
    EmployeesQueryVariables
  >,
) {
  const options = { ...defaultOptions, ...baseOptions }
  return ApolloReactHooks.useLazyQuery<EmployeesQuery, EmployeesQueryVariables>(
    EmployeesDocument,
    options,
  )
}
export type EmployeesQueryHookResult = ReturnType<typeof useEmployeesQuery>
export type EmployeesLazyQueryHookResult = ReturnType<
  typeof useEmployeesLazyQuery
>
export type EmployeesQueryResult = ApolloReactCommon.QueryResult<
  EmployeesQuery,
  EmployeesQueryVariables
>
export const RemoveEmployeeDocument = gql`
  mutation RemoveEmployee($id: ID!) {
    removeEmployee(id: $id)
  }
`
export type RemoveEmployeeMutationFn = ApolloReactCommon.MutationFunction<
  RemoveEmployeeMutation,
  RemoveEmployeeMutationVariables
>

/**
 * __useRemoveEmployeeMutation__
 *
 * To run a mutation, you first call `useRemoveEmployeeMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useRemoveEmployeeMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [removeEmployeeMutation, { data, loading, error }] = useRemoveEmployeeMutation({
 *   variables: {
 *      id: // value for 'id'
 *   },
 * });
 */
export function useRemoveEmployeeMutation(
  baseOptions?: ApolloReactHooks.MutationHookOptions<
    RemoveEmployeeMutation,
    RemoveEmployeeMutationVariables
  >,
) {
  const options = { ...defaultOptions, ...baseOptions }
  return ApolloReactHooks.useMutation<
    RemoveEmployeeMutation,
    RemoveEmployeeMutationVariables
  >(RemoveEmployeeDocument, options)
}
export type RemoveEmployeeMutationHookResult = ReturnType<
  typeof useRemoveEmployeeMutation
>
export type RemoveEmployeeMutationResult = ApolloReactCommon.MutationResult<
  RemoveEmployeeMutation
>
export type RemoveEmployeeMutationOptions = ApolloReactCommon.BaseMutationOptions<
  RemoveEmployeeMutation,
  RemoveEmployeeMutationVariables
>
export const UpdateEmployeeRoleDocument = gql`
  mutation UpdateEmployeeRole($id: ID!, $role: String!) {
    updateEmployeeRole(id: $id, role: $role) {
      id
      email
      role
      firstGrantedAt
    }
  }
`
export type UpdateEmployeeRoleMutationFn = ApolloReactCommon.MutationFunction<
  UpdateEmployeeRoleMutation,
  UpdateEmployeeRoleMutationVariables
>

/**
 * __useUpdateEmployeeRoleMutation__
 *
 * To run a mutation, you first call `useUpdateEmployeeRoleMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useUpdateEmployeeRoleMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [updateEmployeeRoleMutation, { data, loading, error }] = useUpdateEmployeeRoleMutation({
 *   variables: {
 *      id: // value for 'id'
 *      role: // value for 'role'
 *   },
 * });
 */
export function useUpdateEmployeeRoleMutation(
  baseOptions?: ApolloReactHooks.MutationHookOptions<
    UpdateEmployeeRoleMutation,
    UpdateEmployeeRoleMutationVariables
  >,
) {
  const options = { ...defaultOptions, ...baseOptions }
  return ApolloReactHooks.useMutation<
    UpdateEmployeeRoleMutation,
    UpdateEmployeeRoleMutationVariables
  >(UpdateEmployeeRoleDocument, options)
}
export type UpdateEmployeeRoleMutationHookResult = ReturnType<
  typeof useUpdateEmployeeRoleMutation
>
export type UpdateEmployeeRoleMutationResult = ApolloReactCommon.MutationResult<
  UpdateEmployeeRoleMutation
>
export type UpdateEmployeeRoleMutationOptions = ApolloReactCommon.BaseMutationOptions<
  UpdateEmployeeRoleMutation,
  UpdateEmployeeRoleMutationVariables
>
export const GetSwitcherEmailsDocument = gql`
  query GetSwitcherEmails {
    switchableSwitcherEmails {
      id
      member {
        memberId
        signedOn
        firstName
        lastName
        email
      }
      switcherCompany
      queuedAt
      contract {
        id
        currentAgreementId
        masterInception
        status
        contractTypeName
        isTerminated
        terminationDate
      }
      sentAt
      remindedAt
      cancellationDate
      switcherType
      note
    }
  }
`

/**
 * __useGetSwitcherEmailsQuery__
 *
 * To run a query within a React component, call `useGetSwitcherEmailsQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetSwitcherEmailsQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetSwitcherEmailsQuery({
 *   variables: {
 *   },
 * });
 */
export function useGetSwitcherEmailsQuery(
  baseOptions?: ApolloReactHooks.QueryHookOptions<
    GetSwitcherEmailsQuery,
    GetSwitcherEmailsQueryVariables
  >,
) {
  const options = { ...defaultOptions, ...baseOptions }
  return ApolloReactHooks.useQuery<
    GetSwitcherEmailsQuery,
    GetSwitcherEmailsQueryVariables
  >(GetSwitcherEmailsDocument, options)
}
export function useGetSwitcherEmailsLazyQuery(
  baseOptions?: ApolloReactHooks.LazyQueryHookOptions<
    GetSwitcherEmailsQuery,
    GetSwitcherEmailsQueryVariables
  >,
) {
  const options = { ...defaultOptions, ...baseOptions }
  return ApolloReactHooks.useLazyQuery<
    GetSwitcherEmailsQuery,
    GetSwitcherEmailsQueryVariables
  >(GetSwitcherEmailsDocument, options)
}
export type GetSwitcherEmailsQueryHookResult = ReturnType<
  typeof useGetSwitcherEmailsQuery
>
export type GetSwitcherEmailsLazyQueryHookResult = ReturnType<
  typeof useGetSwitcherEmailsLazyQuery
>
export type GetSwitcherEmailsQueryResult = ApolloReactCommon.QueryResult<
  GetSwitcherEmailsQuery,
  GetSwitcherEmailsQueryVariables
>
export const MarkSwitcherEmailAsRemindedDocument = gql`
  mutation MarkSwitcherEmailAsReminded($id: ID!) {
    markSwitchableSwitcherEmailAsReminded(id: $id) {
      id
    }
  }
`
export type MarkSwitcherEmailAsRemindedMutationFn = ApolloReactCommon.MutationFunction<
  MarkSwitcherEmailAsRemindedMutation,
  MarkSwitcherEmailAsRemindedMutationVariables
>

/**
 * __useMarkSwitcherEmailAsRemindedMutation__
 *
 * To run a mutation, you first call `useMarkSwitcherEmailAsRemindedMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useMarkSwitcherEmailAsRemindedMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [markSwitcherEmailAsRemindedMutation, { data, loading, error }] = useMarkSwitcherEmailAsRemindedMutation({
 *   variables: {
 *      id: // value for 'id'
 *   },
 * });
 */
export function useMarkSwitcherEmailAsRemindedMutation(
  baseOptions?: ApolloReactHooks.MutationHookOptions<
    MarkSwitcherEmailAsRemindedMutation,
    MarkSwitcherEmailAsRemindedMutationVariables
  >,
) {
  const options = { ...defaultOptions, ...baseOptions }
  return ApolloReactHooks.useMutation<
    MarkSwitcherEmailAsRemindedMutation,
    MarkSwitcherEmailAsRemindedMutationVariables
  >(MarkSwitcherEmailAsRemindedDocument, options)
}
export type MarkSwitcherEmailAsRemindedMutationHookResult = ReturnType<
  typeof useMarkSwitcherEmailAsRemindedMutation
>
export type MarkSwitcherEmailAsRemindedMutationResult = ApolloReactCommon.MutationResult<
  MarkSwitcherEmailAsRemindedMutation
>
export type MarkSwitcherEmailAsRemindedMutationOptions = ApolloReactCommon.BaseMutationOptions<
  MarkSwitcherEmailAsRemindedMutation,
  MarkSwitcherEmailAsRemindedMutationVariables
>
export const GetMeDocument = gql`
  query GetMe {
    me {
      scopes
      role
      user {
        id
        email
        fullName
        phoneNumber
        role
      }
      settings {
        key
        value
      }
    }
  }
`

/**
 * __useGetMeQuery__
 *
 * To run a query within a React component, call `useGetMeQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetMeQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetMeQuery({
 *   variables: {
 *   },
 * });
 */
export function useGetMeQuery(
  baseOptions?: ApolloReactHooks.QueryHookOptions<
    GetMeQuery,
    GetMeQueryVariables
  >,
) {
  const options = { ...defaultOptions, ...baseOptions }
  return ApolloReactHooks.useQuery<GetMeQuery, GetMeQueryVariables>(
    GetMeDocument,
    options,
  )
}
export function useGetMeLazyQuery(
  baseOptions?: ApolloReactHooks.LazyQueryHookOptions<
    GetMeQuery,
    GetMeQueryVariables
  >,
) {
  const options = { ...defaultOptions, ...baseOptions }
  return ApolloReactHooks.useLazyQuery<GetMeQuery, GetMeQueryVariables>(
    GetMeDocument,
    options,
  )
}
export type GetMeQueryHookResult = ReturnType<typeof useGetMeQuery>
export type GetMeLazyQueryHookResult = ReturnType<typeof useGetMeLazyQuery>
export type GetMeQueryResult = ApolloReactCommon.QueryResult<
  GetMeQuery,
  GetMeQueryVariables
>
export const UpdateUserSettingsDocument = gql`
  mutation UpdateUserSettings($settings: [UpsertUserSettingInput!]!) {
    upsertUserSettings(settings: $settings) {
      key
      value
    }
  }
`
export type UpdateUserSettingsMutationFn = ApolloReactCommon.MutationFunction<
  UpdateUserSettingsMutation,
  UpdateUserSettingsMutationVariables
>

/**
 * __useUpdateUserSettingsMutation__
 *
 * To run a mutation, you first call `useUpdateUserSettingsMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useUpdateUserSettingsMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [updateUserSettingsMutation, { data, loading, error }] = useUpdateUserSettingsMutation({
 *   variables: {
 *      settings: // value for 'settings'
 *   },
 * });
 */
export function useUpdateUserSettingsMutation(
  baseOptions?: ApolloReactHooks.MutationHookOptions<
    UpdateUserSettingsMutation,
    UpdateUserSettingsMutationVariables
  >,
) {
  const options = { ...defaultOptions, ...baseOptions }
  return ApolloReactHooks.useMutation<
    UpdateUserSettingsMutation,
    UpdateUserSettingsMutationVariables
  >(UpdateUserSettingsDocument, options)
}
export type UpdateUserSettingsMutationHookResult = ReturnType<
  typeof useUpdateUserSettingsMutation
>
export type UpdateUserSettingsMutationResult = ApolloReactCommon.MutationResult<
  UpdateUserSettingsMutation
>
export type UpdateUserSettingsMutationOptions = ApolloReactCommon.BaseMutationOptions<
  UpdateUserSettingsMutation,
  UpdateUserSettingsMutationVariables
>
export const UpdateUserDocument = gql`
  mutation UpdateUser($input: UpdateUserInput!) {
    updateUser(input: $input) {
      id
      fullName
      email
      phoneNumber
    }
  }
`
export type UpdateUserMutationFn = ApolloReactCommon.MutationFunction<
  UpdateUserMutation,
  UpdateUserMutationVariables
>

/**
 * __useUpdateUserMutation__
 *
 * To run a mutation, you first call `useUpdateUserMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useUpdateUserMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [updateUserMutation, { data, loading, error }] = useUpdateUserMutation({
 *   variables: {
 *      input: // value for 'input'
 *   },
 * });
 */
export function useUpdateUserMutation(
  baseOptions?: ApolloReactHooks.MutationHookOptions<
    UpdateUserMutation,
    UpdateUserMutationVariables
  >,
) {
  const options = { ...defaultOptions, ...baseOptions }
  return ApolloReactHooks.useMutation<
    UpdateUserMutation,
    UpdateUserMutationVariables
  >(UpdateUserDocument, options)
}
export type UpdateUserMutationHookResult = ReturnType<
  typeof useUpdateUserMutation
>
export type UpdateUserMutationResult = ApolloReactCommon.MutationResult<
  UpdateUserMutation
>
export type UpdateUserMutationOptions = ApolloReactCommon.BaseMutationOptions<
  UpdateUserMutation,
  UpdateUserMutationVariables
>
export const UsersOnPathDocument = gql`
  query UsersOnPath($path: String!) {
    usersOnPath(path: $path) {
      id
      fullName
      email
      latestPresence
    }
  }
`

/**
 * __useUsersOnPathQuery__
 *
 * To run a query within a React component, call `useUsersOnPathQuery` and pass it any options that fit your needs.
 * When your component renders, `useUsersOnPathQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useUsersOnPathQuery({
 *   variables: {
 *      path: // value for 'path'
 *   },
 * });
 */
export function useUsersOnPathQuery(
  baseOptions: ApolloReactHooks.QueryHookOptions<
    UsersOnPathQuery,
    UsersOnPathQueryVariables
  >,
) {
  const options = { ...defaultOptions, ...baseOptions }
  return ApolloReactHooks.useQuery<UsersOnPathQuery, UsersOnPathQueryVariables>(
    UsersOnPathDocument,
    options,
  )
}
export function useUsersOnPathLazyQuery(
  baseOptions?: ApolloReactHooks.LazyQueryHookOptions<
    UsersOnPathQuery,
    UsersOnPathQueryVariables
  >,
) {
  const options = { ...defaultOptions, ...baseOptions }
  return ApolloReactHooks.useLazyQuery<
    UsersOnPathQuery,
    UsersOnPathQueryVariables
  >(UsersOnPathDocument, options)
}
export type UsersOnPathQueryHookResult = ReturnType<typeof useUsersOnPathQuery>
export type UsersOnPathLazyQueryHookResult = ReturnType<
  typeof useUsersOnPathLazyQuery
>
export type UsersOnPathQueryResult = ApolloReactCommon.QueryResult<
  UsersOnPathQuery,
  UsersOnPathQueryVariables
>
export const UsersDocument = gql`
  query Users {
    users {
      id
      fullName
      role
      email
      latestPresence
      latestLocation
    }
  }
`

/**
 * __useUsersQuery__
 *
 * To run a query within a React component, call `useUsersQuery` and pass it any options that fit your needs.
 * When your component renders, `useUsersQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useUsersQuery({
 *   variables: {
 *   },
 * });
 */
export function useUsersQuery(
  baseOptions?: ApolloReactHooks.QueryHookOptions<
    UsersQuery,
    UsersQueryVariables
  >,
) {
  const options = { ...defaultOptions, ...baseOptions }
  return ApolloReactHooks.useQuery<UsersQuery, UsersQueryVariables>(
    UsersDocument,
    options,
  )
}
export function useUsersLazyQuery(
  baseOptions?: ApolloReactHooks.LazyQueryHookOptions<
    UsersQuery,
    UsersQueryVariables
  >,
) {
  const options = { ...defaultOptions, ...baseOptions }
  return ApolloReactHooks.useLazyQuery<UsersQuery, UsersQueryVariables>(
    UsersDocument,
    options,
  )
}
export type UsersQueryHookResult = ReturnType<typeof useUsersQuery>
export type UsersLazyQueryHookResult = ReturnType<typeof useUsersLazyQuery>
export type UsersQueryResult = ApolloReactCommon.QueryResult<
  UsersQuery,
  UsersQueryVariables
>

export interface PossibleTypesResultData {
  possibleTypes: {
    [key: string]: string[]
  }
}
const result: PossibleTypesResultData = {
  possibleTypes: {
    Incentive: [
      'MonthlyPercentageDiscountFixedPeriod',
      'FreeMonths',
      'CostDeduction',
      'NoDiscount',
      'IndefinitePercentageDiscount',
      'VisibleNoDiscount',
      'UnknownIncentive',
    ],
    SendMessageResponse: ['SendMessageSuccessful', 'SendMessageFailed'],
  },
}
export default result
