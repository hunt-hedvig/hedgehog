import gql from 'graphql-tag'
import * as ApolloReactCommon from '@apollo/react-common'
import * as ApolloReactHooks from '@apollo/react-hooks'
export type Maybe<T> = T | null
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: string
  String: string
  Boolean: boolean
  Int: number
  Float: number
  /** A String-representation of `java.time.YearMonth`, ex: `"2018-06"` */
  YearMonth: any
  /** An object-representation of `javax.money.MonetaryAmount`, ex: `{"amount": 100  "currency": "SEK"}` */
  MonetaryAmount: any
  /** A String-representation of `java.time.Instant`, ex: `"2018-06-11T20:08:30.123456"` */
  Instant: any
  /** A String-representation of `java.time.LocalDate`, ex:  `"2018-09-26"` */
  LocalDate: any
  /** A String-representation of `java.net.URL`, ex: "https://www.google.com/" */
  URL: any
  /** A String-representation of `java.time.LocalDateTIme`, ex: `"2018-06-11T20:08:30.123456"` */
  LocalDateTime: any
  /** A String-representation of `java.time.LocalTime` */
  LocalTime: any
  /** A String-representation of `java.time.ZonedDateTime`, ex: `"2018-09-21T14:17:46.536405+02:00[Europe/Stockholm]"` */
  ZonedDateTime: any
}

export type AccidentalDamageClaim = {
  __typename?: 'AccidentalDamageClaim'
  location?: Maybe<Scalars['String']>
  date?: Maybe<Scalars['LocalDate']>
  item?: Maybe<Scalars['String']>
  policeReport?: Maybe<Scalars['String']>
  receipt?: Maybe<Scalars['String']>
}

export type Account = {
  __typename?: 'Account'
  id: Scalars['ID']
  currentBalance: Scalars['MonetaryAmount']
  totalBalance: Scalars['MonetaryAmount']
  chargeEstimation: AccountChargeEstimation
  entries: Array<AccountEntry>
}

export type AccountChargeEstimation = {
  __typename?: 'AccountChargeEstimation'
  subscription: Scalars['MonetaryAmount']
  discount: Scalars['MonetaryAmount']
  charge: Scalars['MonetaryAmount']
  discountCodes: Array<Scalars['String']>
}

export type AccountEntry = {
  __typename?: 'AccountEntry'
  id: Scalars['ID']
  type: AccountEntryType
  amount: Scalars['MonetaryAmount']
  fromDate: Scalars['LocalDate']
  reference: Scalars['String']
  source: Scalars['String']
  title?: Maybe<Scalars['String']>
  comment?: Maybe<Scalars['String']>
  failedAt?: Maybe<Scalars['Instant']>
  chargedAt?: Maybe<Scalars['Instant']>
}

export type AccountEntryInput = {
  type: AccountEntryType
  amount: Scalars['MonetaryAmount']
  fromDate: Scalars['LocalDate']
  reference: Scalars['String']
  source: Scalars['String']
  title?: Maybe<Scalars['String']>
  comment?: Maybe<Scalars['String']>
}

export enum AccountEntryType {
  Correction = 'CORRECTION',
  Subscription = 'SUBSCRIPTION',
  Campaign = 'CAMPAIGN',
  Payout = 'PAYOUT',
  Charge = 'CHARGE',
  ReferralDiscount = 'REFERRAL_DISCOUNT',
  FreeMonthDiscount = 'FREE_MONTH_DISCOUNT',
  Loss = 'LOSS',
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

export type Agreement =
  | SwedishApartment
  | SwedishHouse
  | NorwegianHomeContent
  | NorwegianTravel

export type AgreementCore = {
  id: Scalars['ID']
  fromDate?: Maybe<Scalars['LocalDate']>
  toDate?: Maybe<Scalars['LocalDate']>
  premium: MonetaryAmountV2
  certificateUrl?: Maybe<Scalars['String']>
  status: AgreementStatus
}

export enum AgreementStatus {
  Pending = 'PENDING',
  ActiveInFuture = 'ACTIVE_IN_FUTURE',
  Active = 'ACTIVE',
  ActiveInPast = 'ACTIVE_IN_PAST',
  Terminated = 'TERMINATED',
}

export type AllRepliesEntry = {
  __typename?: 'AllRepliesEntry'
  intent: Scalars['String']
  reply: Scalars['String']
}

export type ApartmentQuoteData = IQuoteData & {
  __typename?: 'ApartmentQuoteData'
  id: Scalars['ID']
  street?: Maybe<Scalars['String']>
  city?: Maybe<Scalars['String']>
  zipCode?: Maybe<Scalars['String']>
  householdSize?: Maybe<Scalars['Int']>
  livingSpace?: Maybe<Scalars['Int']>
  subType?: Maybe<ApartmentSubType>
}

export type ApartmentQuoteDataInput = {
  ssn?: Maybe<Scalars['String']>
  firstName?: Maybe<Scalars['String']>
  lastName?: Maybe<Scalars['String']>
  street?: Maybe<Scalars['String']>
  city?: Maybe<Scalars['String']>
  zipCode?: Maybe<Scalars['String']>
  householdSize?: Maybe<Scalars['Int']>
  livingSpace?: Maybe<Scalars['Int']>
  subType?: Maybe<ApartmentSubType>
}

export type ApartmentQuoteInput = {
  street?: Maybe<Scalars['String']>
  city?: Maybe<Scalars['String']>
  zipCode?: Maybe<Scalars['String']>
  householdSize?: Maybe<Scalars['Int']>
  livingSpace?: Maybe<Scalars['Int']>
  subType?: Maybe<ApartmentSubType>
}

export enum ApartmentSubType {
  Brf = 'BRF',
  Rent = 'RENT',
  StudentBrf = 'STUDENT_BRF',
  StudentRent = 'STUDENT_RENT',
}

export type ApplianceClaim = {
  __typename?: 'ApplianceClaim'
  location?: Maybe<Scalars['String']>
  date?: Maybe<Scalars['LocalDate']>
  item?: Maybe<Scalars['String']>
}

export type AssaultClaim = {
  __typename?: 'AssaultClaim'
  location?: Maybe<Scalars['String']>
  date?: Maybe<Scalars['LocalDate']>
  policeReport?: Maybe<Scalars['String']>
}

export type AutoLabel = {
  __typename?: 'AutoLabel'
  message?: Maybe<Scalars['Boolean']>
}

export type BurglaryClaim = {
  __typename?: 'BurglaryClaim'
  location?: Maybe<Scalars['String']>
  date?: Maybe<Scalars['LocalDate']>
  item?: Maybe<Scalars['String']>
  policeReport?: Maybe<Scalars['String']>
  receipt?: Maybe<Scalars['String']>
}

export type Category = {
  __typename?: 'Category'
  id: Scalars['String']
  name: Scalars['String']
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

export type Claim = {
  __typename?: 'Claim'
  id?: Maybe<Scalars['ID']>
  member?: Maybe<Member>
  recordingUrl?: Maybe<Scalars['String']>
  state?: Maybe<ClaimState>
  type?: Maybe<ClaimType>
  reserves?: Maybe<Scalars['MonetaryAmount']>
  registrationDate?: Maybe<Scalars['Instant']>
  notes?: Maybe<Array<Maybe<ClaimNote>>>
  payments?: Maybe<Array<Maybe<ClaimPayment>>>
  events?: Maybe<Array<Maybe<ClaimEvent>>>
  coveringEmployee: Scalars['Boolean']
  claimFiles: Array<ClaimFileUpload>
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

export type ClaimInformationInput = {
  location?: Maybe<Scalars['String']>
  date?: Maybe<Scalars['LocalDate']>
  item?: Maybe<Scalars['String']>
  policeReport?: Maybe<Scalars['String']>
  receipt?: Maybe<Scalars['String']>
  ticket?: Maybe<Scalars['String']>
}

export type ClaimNote = {
  __typename?: 'ClaimNote'
  text?: Maybe<Scalars['String']>
  date?: Maybe<Scalars['LocalDateTime']>
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

export type ClaimType =
  | TheftClaim
  | AccidentalDamageClaim
  | AssaultClaim
  | WaterDamageClaim
  | TravelAccidentClaim
  | LuggageDelayClaim
  | NotCoveredClaim
  | FireDamageClaim
  | ConfirmedFraudClaim
  | LiabilityClaim
  | ApplianceClaim
  | LegalProtectionClaim
  | WaterDamageBathroomClaim
  | WaterDamageKitchenClaim
  | BurglaryClaim
  | FloodingClaim
  | EarthquakeClaim
  | InstallationsClaim
  | SnowPressureClaim
  | StormDamageClaim
  | VerminAndPestsClaim
  | TestClaim

export enum ClaimTypes {
  TheftClaim = 'TheftClaim',
  AccidentalDamageClaim = 'AccidentalDamageClaim',
  AssaultClaim = 'AssaultClaim',
  WaterDamageClaim = 'WaterDamageClaim',
  TravelAccidentClaim = 'TravelAccidentClaim',
  LuggageDelayClaim = 'LuggageDelayClaim',
  NotCoveredClaim = 'NotCoveredClaim',
  FireDamageClaim = 'FireDamageClaim',
  ApplianceClaim = 'ApplianceClaim',
  ConfirmedFraudClaim = 'ConfirmedFraudClaim',
  LiabilityClaim = 'LiabilityClaim',
  LegalProtectionClaim = 'LegalProtectionClaim',
  WaterDamageBathroomClaim = 'WaterDamageBathroomClaim',
  WaterDamageKitchenClaim = 'WaterDamageKitchenClaim',
  BurglaryClaim = 'BurglaryClaim',
  FloodingClaim = 'FloodingClaim',
  EarthquakeClaim = 'EarthquakeClaim',
  InstallationsClaim = 'InstallationsClaim',
  SnowPressureClaim = 'SnowPressureClaim',
  StormDamageClaim = 'StormDamageClaim',
  VerminAndPestsClaim = 'VerminAndPestsClaim',
  TestClaim = 'TestClaim',
}

export type ConfirmedFraudClaim = {
  __typename?: 'ConfirmedFraudClaim'
  date?: Maybe<Scalars['LocalDate']>
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
  isTerminated: Scalars['Boolean']
  terminationDate?: Maybe<Scalars['LocalDate']>
  currentAgreementId: Scalars['ID']
  hasPendingAgreement: Scalars['Boolean']
  agreements: Array<Agreement>
  hasQueuedRenewal: Scalars['Boolean']
  renewal?: Maybe<Renewal>
  preferredCurrency: Scalars['String']
  market: Market
  signSource?: Maybe<SignSource>
  contractTypeName: Scalars['String']
  createdAt: Scalars['Instant']
}

export type ContractMarketInfo = {
  __typename?: 'ContractMarketInfo'
  market: Market
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

export type CreateNorwegianGripenInput = {
  baseFactorString?: Maybe<Scalars['String']>
  factors: Array<NorwegianGripenFactorInput>
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

export type EarthquakeClaim = {
  __typename?: 'EarthquakeClaim'
  date?: Maybe<Scalars['LocalDate']>
}

export type ExtraBuilding = {
  __typename?: 'ExtraBuilding'
  id?: Maybe<Scalars['ID']>
  type: ExtraBuildingType
  area: Scalars['Int']
  hasWaterConnected: Scalars['Boolean']
  displayName?: Maybe<Scalars['String']>
}

export type ExtraBuildingInput = {
  type: Scalars['String']
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

export type Filter = {
  name: Scalars['String']
  value: Scalars['String']
}

export type FilterOutput = {
  __typename?: 'FilterOutput'
  name: Scalars['String']
  value: Scalars['String']
}

export type FilterPayload = {
  filters: Array<Filter>
  inventoryItemId: Scalars['ID']
}

export type FilterSuggestion = {
  __typename?: 'FilterSuggestion'
  name: Scalars['String']
  items: Array<Scalars['String']>
  others: Array<Scalars['String']>
}

export type FireDamageClaim = {
  __typename?: 'FireDamageClaim'
  location?: Maybe<Scalars['String']>
  date?: Maybe<Scalars['LocalDate']>
}

export enum Flag {
  Green = 'GREEN',
  Amber = 'AMBER',
  Red = 'RED',
}

export type FloodingClaim = {
  __typename?: 'FloodingClaim'
  date?: Maybe<Scalars['LocalDate']>
}

export enum Gender {
  Male = 'MALE',
  Female = 'FEMALE',
  Other = 'OTHER',
}

export type HouseQuoteData = IQuoteData & {
  __typename?: 'HouseQuoteData'
  id: Scalars['ID']
  ssn?: Maybe<Scalars['String']>
  firstName?: Maybe<Scalars['String']>
  lastName?: Maybe<Scalars['String']>
  street?: Maybe<Scalars['String']>
  city?: Maybe<Scalars['String']>
  zipCode?: Maybe<Scalars['String']>
  householdSize?: Maybe<Scalars['Int']>
  livingSpace?: Maybe<Scalars['Int']>
  ancillaryArea?: Maybe<Scalars['Int']>
  yearOfConstruction?: Maybe<Scalars['Int']>
  numberOfBathrooms?: Maybe<Scalars['Int']>
  extraBuildings: Array<ExtraBuilding>
  isSubleted?: Maybe<Scalars['Boolean']>
}

export type HouseQuoteDataInput = {
  ssn?: Maybe<Scalars['String']>
  firstName?: Maybe<Scalars['String']>
  lastName?: Maybe<Scalars['String']>
  street?: Maybe<Scalars['String']>
  city?: Maybe<Scalars['String']>
  zipCode?: Maybe<Scalars['String']>
  householdSize?: Maybe<Scalars['Int']>
  livingSpace?: Maybe<Scalars['Int']>
  ancillaryArea?: Maybe<Scalars['Int']>
  yearOfConstruction?: Maybe<Scalars['Int']>
  numberOfBathrooms?: Maybe<Scalars['Int']>
  extraBuildings: Array<ExtraBuildingInput>
  isSubleted?: Maybe<Scalars['Boolean']>
}

export type HouseQuoteInput = {
  street?: Maybe<Scalars['String']>
  city?: Maybe<Scalars['String']>
  zipCode?: Maybe<Scalars['String']>
  householdSize?: Maybe<Scalars['Int']>
  livingSpace?: Maybe<Scalars['Int']>
  ancillaryArea?: Maybe<Scalars['Int']>
  yearOfConstruction?: Maybe<Scalars['Int']>
  numberOfBathrooms?: Maybe<Scalars['Int']>
  extraBuildings?: Maybe<Array<ExtraBuildingInput>>
  isSubleted?: Maybe<Scalars['Boolean']>
}

export type InstallationsClaim = {
  __typename?: 'InstallationsClaim'
  date?: Maybe<Scalars['LocalDate']>
  item?: Maybe<Scalars['String']>
  location?: Maybe<Scalars['String']>
}

export type InventoryItem = {
  __typename?: 'InventoryItem'
  inventoryItemId: Scalars['ID']
  claimId: Scalars['String']
  itemName: Scalars['String']
  categoryName: Scalars['String']
  categoryId: Scalars['String']
  value: Scalars['Float']
  source: Scalars['String']
  upperRange?: Maybe<Scalars['Float']>
  lowerRange?: Maybe<Scalars['Float']>
  itemId?: Maybe<Scalars['String']>
  filters?: Maybe<Array<Maybe<FilterOutput>>>
}

export type InventoryItemInput = {
  inventoryItemId?: Maybe<Scalars['String']>
  claimId: Scalars['String']
  itemName: Scalars['String']
  categoryName: Scalars['String']
  categoryId: Scalars['String']
  value: Scalars['Float']
  source: Scalars['String']
  upperRange?: Maybe<Scalars['Float']>
  lowerRange?: Maybe<Scalars['Float']>
  itemId?: Maybe<Scalars['String']>
  filters?: Maybe<Array<Maybe<Filter>>>
}

export type IQuoteData = {
  id: Scalars['ID']
  householdSize?: Maybe<Scalars['Int']>
}

export type Item = {
  __typename?: 'Item'
  category: Scalars['String']
  id: Scalars['String']
  name: Scalars['String']
}

export type ItemSearch = {
  __typename?: 'ItemSearch'
  products: Array<Item>
  suggestions: Array<FilterSuggestion>
}

export type LegalProtectionClaim = {
  __typename?: 'LegalProtectionClaim'
  date?: Maybe<Scalars['LocalDate']>
}

export type LiabilityClaim = {
  __typename?: 'LiabilityClaim'
  date?: Maybe<Scalars['LocalDate']>
  location?: Maybe<Scalars['String']>
}

export type LuggageDelayClaim = {
  __typename?: 'LuggageDelayClaim'
  location?: Maybe<Scalars['String']>
  date?: Maybe<Scalars['LocalDate']>
  ticket?: Maybe<Scalars['String']>
}

export enum Market {
  Sweden = 'SWEDEN',
  Norway = 'NORWAY',
}

export type Member = {
  __typename?: 'Member'
  memberId: Scalars['ID']
  signedOn?: Maybe<Scalars['Instant']>
  firstName?: Maybe<Scalars['String']>
  lastName?: Maybe<Scalars['String']>
  personalNumber?: Maybe<Scalars['String']>
  gender?: Maybe<Gender>
  address?: Maybe<Scalars['String']>
  postalNumber?: Maybe<Scalars['String']>
  city?: Maybe<Scalars['String']>
  transactions?: Maybe<Array<Maybe<Transaction>>>
  directDebitStatus?: Maybe<DirectDebitStatus>
  monthlySubscription?: Maybe<MonthlySubscription>
  fraudulentStatus?: Maybe<Scalars['String']>
  fraudulentStatusDescription?: Maybe<Scalars['String']>
  sanctionStatus?: Maybe<SanctionStatus>
  account?: Maybe<Account>
  fileUploads: Array<FileUpload>
  person?: Maybe<Person>
  numberFailedCharges?: Maybe<NumberFailedCharges>
  quotes: Array<Quote>
  contracts: Array<Contract>
  contractMarketInfo?: Maybe<ContractMarketInfo>
}

export type MemberMonthlySubscriptionArgs = {
  month: Scalars['YearMonth']
}

export type MemberChargeApproval = {
  memberId: Scalars['ID']
  amount: Scalars['MonetaryAmount']
}

export type MonetaryAmountV2 = {
  __typename?: 'MonetaryAmountV2'
  amount: Scalars['String']
  currency: Scalars['String']
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
  approveMemberCharge?: Maybe<Scalars['Boolean']>
  updateClaimState?: Maybe<Claim>
  createClaim?: Maybe<Scalars['ID']>
  addClaimNote?: Maybe<Claim>
  createClaimPayment?: Maybe<Claim>
  setClaimType?: Maybe<Claim>
  setClaimInformation?: Maybe<Claim>
  updateReserve?: Maybe<Claim>
  setCoveringEmployee?: Maybe<Claim>
  createTicket?: Maybe<Scalars['ID']>
  changeTicketDescription?: Maybe<Scalars['ID']>
  assignTicketToTeamMember?: Maybe<Scalars['ID']>
  changeTicketStatus?: Maybe<Scalars['ID']>
  changeTicketReminder?: Maybe<Scalars['ID']>
  changeTicketPriority?: Maybe<Scalars['ID']>
  autoLabelQuestion?: Maybe<AutoLabel>
  questionIsDone?: Maybe<Scalars['Boolean']>
  whitelistMember?: Maybe<Scalars['Boolean']>
  markClaimFileAsDeleted?: Maybe<Scalars['Boolean']>
  backfillSubscriptions: Member
  setClaimFileCategory?: Maybe<Scalars['String']>
  addInventoryItem?: Maybe<Scalars['Boolean']>
  removeInventoryItem?: Maybe<Scalars['Boolean']>
  activateQuote: Quote
  addAgreementFromQuote: Quote
  /** Creates a quote from a product and returns the quote id */
  createQuoteFromProduct: Quote
  createQuoteFromBackOffice: Quote
  updateQuote: Quote
  markSwitchableSwitcherEmailAsReminded: Scalars['Boolean']
  terminateContract: Contract
  activatePendingAgreement: Contract
  changeTerminationDate: Contract
  revertTermination: Contract
  createNorwegianGripenPriceEngine: Scalars['Boolean']
  addNorwegianPostalCodes: Scalars['Boolean']
  changeToDate: Scalars['ID']
  changeFromDate: Scalars['ID']
  regenerateCertificate: Scalars['ID']
}

export type MutationTypeChargeMemberArgs = {
  id: Scalars['ID']
  amount: Scalars['MonetaryAmount']
}

export type MutationTypeAddAccountEntryToMemberArgs = {
  memberId: Scalars['ID']
  accountEntry: AccountEntryInput
}

export type MutationTypeApproveMemberChargeArgs = {
  approvals: Array<MemberChargeApproval>
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

export type MutationTypeSetClaimTypeArgs = {
  id: Scalars['ID']
  type: ClaimTypes
}

export type MutationTypeSetClaimInformationArgs = {
  id: Scalars['ID']
  information: ClaimInformationInput
}

export type MutationTypeUpdateReserveArgs = {
  id: Scalars['ID']
  amount: Scalars['MonetaryAmount']
}

export type MutationTypeSetCoveringEmployeeArgs = {
  id: Scalars['ID']
  coveringEmployee: Scalars['Boolean']
}

export type MutationTypeCreateTicketArgs = {
  ticket?: Maybe<TicketInput>
}

export type MutationTypeChangeTicketDescriptionArgs = {
  ticketId: Scalars['ID']
  newDescription?: Maybe<Scalars['String']>
}

export type MutationTypeAssignTicketToTeamMemberArgs = {
  ticketId: Scalars['ID']
  teamMemberId: Scalars['ID']
}

export type MutationTypeChangeTicketStatusArgs = {
  ticketId: Scalars['ID']
  newStatus?: Maybe<TicketStatus>
}

export type MutationTypeChangeTicketReminderArgs = {
  ticketId: Scalars['ID']
  newReminder?: Maybe<RemindNotification>
}

export type MutationTypeChangeTicketPriorityArgs = {
  ticketId: Scalars['ID']
  newPriority?: Maybe<Scalars['Float']>
}

export type MutationTypeAutoLabelQuestionArgs = {
  question: Scalars['String']
  label: Scalars['String']
  memberId?: Maybe<Scalars['String']>
  messageIds?: Maybe<Array<Scalars['String']>>
}

export type MutationTypeQuestionIsDoneArgs = {
  memberId: Scalars['ID']
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

export type MutationTypeAddInventoryItemArgs = {
  item: InventoryItemInput
}

export type MutationTypeRemoveInventoryItemArgs = {
  inventoryItemId: Scalars['ID']
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

export type MutationTypeCreateQuoteFromProductArgs = {
  memberId: Scalars['ID']
  quoteData: QuoteFromProductInput
}

export type MutationTypeCreateQuoteFromBackOfficeArgs = {
  agreementId: Scalars['ID']
  memberId: Scalars['ID']
}

export type MutationTypeUpdateQuoteArgs = {
  quoteId: Scalars['ID']
  quoteData: QuoteInput
  bypassUnderwritingGuidelines?: Maybe<Scalars['Boolean']>
}

export type MutationTypeMarkSwitchableSwitcherEmailAsRemindedArgs = {
  id: Scalars['ID']
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

export type MutationTypeRegenerateCertificateArgs = {
  agreementId: Scalars['ID']
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

export type NorwegianHomeContent = AgreementCore & {
  __typename?: 'NorwegianHomeContent'
  id: Scalars['ID']
  fromDate?: Maybe<Scalars['LocalDate']>
  toDate?: Maybe<Scalars['LocalDate']>
  premium: MonetaryAmountV2
  certificateUrl?: Maybe<Scalars['String']>
  status: AgreementStatus
  lineOfBusiness: NorwegianHomeContentLineOfBusiness
  address: Address
  numberCoInsured: Scalars['Int']
  squareMeters: Scalars['Int']
}

export enum NorwegianHomeContentLineOfBusiness {
  Rent = 'RENT',
  Own = 'OWN',
  YouthRent = 'YOUTH_RENT',
  YouthOwn = 'YOUTH_OWN',
}

export type NorwegianHomeContentQuoteData = IQuoteData & {
  __typename?: 'NorwegianHomeContentQuoteData'
  id: Scalars['ID']
  ssn?: Maybe<Scalars['String']>
  firstName?: Maybe<Scalars['String']>
  lastName?: Maybe<Scalars['String']>
  street?: Maybe<Scalars['String']>
  city?: Maybe<Scalars['String']>
  zipCode?: Maybe<Scalars['String']>
  householdSize?: Maybe<Scalars['Int']>
  livingSpace?: Maybe<Scalars['Int']>
  type?: Maybe<NorwegianHomeContentType>
}

export type NorwegianHomeContentQuoteDataInput = {
  ssn?: Maybe<Scalars['String']>
  firstName?: Maybe<Scalars['String']>
  lastName?: Maybe<Scalars['String']>
  street?: Maybe<Scalars['String']>
  city?: Maybe<Scalars['String']>
  zipCode?: Maybe<Scalars['String']>
  householdSize?: Maybe<Scalars['Int']>
  livingSpace?: Maybe<Scalars['Int']>
  type?: Maybe<NorwegianHomeContentType>
}

export type NorwegianHomeContentQuoteInput = {
  street?: Maybe<Scalars['String']>
  city?: Maybe<Scalars['String']>
  zipCode?: Maybe<Scalars['String']>
  householdSize?: Maybe<Scalars['Int']>
  livingSpace?: Maybe<Scalars['Int']>
  type?: Maybe<NorwegianHomeContentType>
}

export enum NorwegianHomeContentType {
  Own = 'OWN',
  Rent = 'RENT',
  StudentOwn = 'STUDENT_OWN',
  StudentRent = 'STUDENT_RENT',
}

export type NorwegianTravel = AgreementCore & {
  __typename?: 'NorwegianTravel'
  id: Scalars['ID']
  fromDate?: Maybe<Scalars['LocalDate']>
  toDate?: Maybe<Scalars['LocalDate']>
  premium: MonetaryAmountV2
  certificateUrl?: Maybe<Scalars['String']>
  status: AgreementStatus
  lineOfBusiness: NorwegianTravelLineOfBusiness
  numberCoInsured: Scalars['Int']
}

export enum NorwegianTravelLineOfBusiness {
  Regular = 'REGULAR',
  Youth = 'YOUTH',
}

export type NorwegianTravelQuoteData = IQuoteData & {
  __typename?: 'NorwegianTravelQuoteData'
  id: Scalars['ID']
  ssn?: Maybe<Scalars['String']>
  firstName?: Maybe<Scalars['String']>
  lastName?: Maybe<Scalars['String']>
  householdSize?: Maybe<Scalars['Int']>
}

export type NorwegianTravelQuoteDataInput = {
  ssn?: Maybe<Scalars['String']>
  firstName?: Maybe<Scalars['String']>
  lastName?: Maybe<Scalars['String']>
  householdSize?: Maybe<Scalars['Int']>
}

export type NorwegianTravelQuoteInput = {
  householdSize?: Maybe<Scalars['Int']>
}

export type NotCoveredClaim = {
  __typename?: 'NotCoveredClaim'
  date?: Maybe<Scalars['LocalDate']>
}

export type NumberFailedCharges = {
  __typename?: 'NumberFailedCharges'
  numberFailedCharges: Scalars['Int']
  lastFailedChargeAt?: Maybe<Scalars['Instant']>
}

export type Payload = {
  category: Scalars['String']
  query: Scalars['String']
  filters: Array<Filter>
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

export type Person = {
  __typename?: 'Person'
  personFlags?: Maybe<Array<Maybe<Flag>>>
  debt?: Maybe<Debt>
  whitelisted?: Maybe<Whitelisted>
  status?: Maybe<PersonStatus>
}

export type PersonStatus = {
  __typename?: 'PersonStatus'
  flag?: Maybe<Flag>
  whitelisted?: Maybe<Scalars['Boolean']>
}

export type PricePoint = {
  __typename?: 'PricePoint'
  id: Scalars['String']
  itemId: Scalars['String']
  date: Scalars['String']
  lower: Scalars['Float']
  mean: Scalars['Float']
  upper: Scalars['Float']
}

export type QueryType = {
  __typename?: 'QueryType'
  monthlyPayments?: Maybe<Array<Maybe<MonthlySubscription>>>
  member?: Maybe<Member>
  claim?: Maybe<Claim>
  paymentSchedule?: Maybe<Array<Maybe<SchedulerState>>>
  categories?: Maybe<Array<Category>>
  items: ItemSearch
  prices: Array<PricePoint>
  ticket?: Maybe<Ticket>
  getFullTicketHistory?: Maybe<TicketHistory>
  tickets: Array<Ticket>
  getAnswerSuggestion: Array<Suggestion>
  me?: Maybe<Scalars['String']>
  inventory: Array<Maybe<InventoryItem>>
  filters: Array<FilterSuggestion>
  inventoryItemFilters?: Maybe<Array<Maybe<FilterOutput>>>
  switchableSwitcherEmails: Array<SwitchableSwitcherEmail>
}

export type QueryTypeMonthlyPaymentsArgs = {
  month: Scalars['YearMonth']
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

export type QueryTypeItemsArgs = {
  payload: Payload
}

export type QueryTypePricesArgs = {
  date: Scalars['String']
  ids: Array<Scalars['String']>
}

export type QueryTypeTicketArgs = {
  id: Scalars['ID']
}

export type QueryTypeGetFullTicketHistoryArgs = {
  id: Scalars['ID']
}

export type QueryTypeTicketsArgs = {
  resolved?: Maybe<Scalars['Boolean']>
}

export type QueryTypeGetAnswerSuggestionArgs = {
  question?: Maybe<Scalars['String']>
}

export type QueryTypeInventoryArgs = {
  claimId: Scalars['ID']
}

export type QueryTypeFiltersArgs = {
  categoryId: Scalars['String']
}

export type QueryTypeInventoryItemFiltersArgs = {
  inventoryItemId: Scalars['String']
}

export type Quote = {
  __typename?: 'Quote'
  id: Scalars['ID']
  createdAt?: Maybe<Scalars['Instant']>
  price?: Maybe<Scalars['Float']>
  productType?: Maybe<QuoteProductType>
  state?: Maybe<QuoteState>
  initiatedFrom?: Maybe<Scalars['String']>
  attributedTo?: Maybe<Scalars['String']>
  currentInsurer?: Maybe<Scalars['String']>
  startDate?: Maybe<Scalars['String']>
  validity?: Maybe<Scalars['Int']>
  memberId?: Maybe<Scalars['ID']>
  breachedUnderwritingGuidelines?: Maybe<Array<Scalars['String']>>
  isComplete?: Maybe<Scalars['Boolean']>
  data?: Maybe<QuoteData>
  signedProductId?: Maybe<Scalars['ID']>
  originatingProductId?: Maybe<Scalars['ID']>
}

export type QuoteData =
  | ApartmentQuoteData
  | HouseQuoteData
  | NorwegianHomeContentQuoteData
  | NorwegianTravelQuoteData

export type QuoteFromProductInput = {
  incompleteHouseQuoteData?: Maybe<HouseQuoteDataInput>
  incompleteApartmentQuoteData?: Maybe<ApartmentQuoteDataInput>
  norwegianHomeContentQuoteData?: Maybe<NorwegianHomeContentQuoteDataInput>
  norwegianTravelQuoteData?: Maybe<NorwegianTravelQuoteDataInput>
  originatingProductId?: Maybe<Scalars['ID']>
  currentInsurer?: Maybe<Scalars['String']>
}

export type QuoteInput = {
  productType?: Maybe<QuoteProductType>
  currentInsurer?: Maybe<Scalars['String']>
  apartmentData?: Maybe<ApartmentQuoteInput>
  houseData?: Maybe<HouseQuoteInput>
  norwegianHomeContentData?: Maybe<NorwegianHomeContentQuoteInput>
  norwegianTravelData?: Maybe<NorwegianTravelQuoteInput>
  originatingProductId?: Maybe<Scalars['ID']>
}

export enum QuoteProductType {
  Apartment = 'APARTMENT',
  House = 'HOUSE',
  Object = 'OBJECT',
  HomeContent = 'HOME_CONTENT',
  Travel = 'TRAVEL',
}

export enum QuoteState {
  Incomplete = 'INCOMPLETE',
  Quoted = 'QUOTED',
  Signed = 'SIGNED',
  Expired = 'EXPIRED',
}

export type RemindNotification = {
  date?: Maybe<Scalars['LocalDate']>
  time?: Maybe<Scalars['LocalTime']>
  message?: Maybe<Scalars['String']>
}

export type Renewal = {
  __typename?: 'Renewal'
  renewalDate: Scalars['LocalDate']
  draftCertificateUrl?: Maybe<Scalars['String']>
  draftOfAgreementId?: Maybe<Scalars['ID']>
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

export enum SignSource {
  Rapio = 'RAPIO',
  Webonboarding = 'WEBONBOARDING',
  Web = 'WEB',
  App = 'APP',
  Ios = 'IOS',
  Android = 'ANDROID',
  Hope = 'HOPE',
}

export type SnowPressureClaim = {
  __typename?: 'SnowPressureClaim'
  date?: Maybe<Scalars['LocalDate']>
}

export type StormDamageClaim = {
  __typename?: 'StormDamageClaim'
  date?: Maybe<Scalars['LocalDate']>
}

export type Suggestion = {
  __typename?: 'Suggestion'
  intent: Scalars['String']
  reply: Scalars['String']
  text: Scalars['String']
  confidence: Scalars['Float']
  allReplies: Array<AllRepliesEntry>
}

export type SwedishApartment = AgreementCore & {
  __typename?: 'SwedishApartment'
  id: Scalars['ID']
  fromDate?: Maybe<Scalars['LocalDate']>
  toDate?: Maybe<Scalars['LocalDate']>
  premium: MonetaryAmountV2
  certificateUrl?: Maybe<Scalars['String']>
  status: AgreementStatus
  lineOfBusiness: SwedishApartmentLineOfBusiness
  address: Address
  numberCoInsured: Scalars['Int']
  squareMeters: Scalars['Int']
}

export enum SwedishApartmentLineOfBusiness {
  Rent = 'RENT',
  Brf = 'BRF',
  StudentRent = 'STUDENT_RENT',
  StudentBrf = 'STUDENT_BRF',
}

export type SwedishHouse = AgreementCore & {
  __typename?: 'SwedishHouse'
  id: Scalars['ID']
  fromDate?: Maybe<Scalars['LocalDate']>
  toDate?: Maybe<Scalars['LocalDate']>
  premium: MonetaryAmountV2
  certificateUrl?: Maybe<Scalars['String']>
  status: AgreementStatus
  address: Address
  numberCoInsured: Scalars['Int']
  squareMeters: Scalars['Int']
  ancillaryArea: Scalars['Int']
  yearOfConstruction: Scalars['Int']
  numberOfBathrooms: Scalars['Int']
  extraBuildings: Array<ExtraBuilding>
  isSubleted: Scalars['Boolean']
}

export type SwitchableSwitcherEmail = {
  __typename?: 'SwitchableSwitcherEmail'
  id: Scalars['ID']
  member: Member
  switcherCompany: Scalars['String']
  queuedAt: Scalars['Instant']
  sentAt?: Maybe<Scalars['Instant']>
  remindedAt?: Maybe<Scalars['Instant']>
}

export type TerminateContractInput = {
  terminationDate: Scalars['LocalDate']
  terminationReason: TerminationReason
  comment?: Maybe<Scalars['String']>
}

export enum TerminationReason {
  NoFeedback = 'NO_FEEDBACK',
  DissatisfiedWithService = 'DISSATISFIED_WITH_SERVICE',
  DissatisfiedWithApp = 'DISSATISFIED_WITH_APP',
  DissatisfiedWithHedvig = 'DISSATISFIED_WITH_HEDVIG',
  DissatisfiedWithOther = 'DISSATISFIED_WITH_OTHER',
  AlreadyHaveInsurance = 'ALREADY_HAVE_INSURANCE',
  CoveredByPartnersInsurance = 'COVERED_BY_PARTNERS_INSURANCE',
  PartnerAlreadyHasHedvigInsurance = 'PARTNER_ALREADY_HAS_HEDVIG_INSURANCE',
  GotOfferFromJobOrUnionOrSimilar = 'GOT_OFFER_FROM_JOB_OR_UNION_OR_SIMILAR',
  WantToKeepOldInsurance = 'WANT_TO_KEEP_OLD_INSURANCE',
  StuckWithOldInsurance = 'STUCK_WITH_OLD_INSURANCE',
  DontNeedInsurance = 'DONT_NEED_INSURANCE',
  WantedOtherTypeOfInsurance = 'WANTED_OTHER_TYPE_OF_INSURANCE',
  RegretByRightToWithraw = 'REGRET_BY_RIGHT_TO_WITHRAW',
  Moved = 'MOVED',
  MovedAbroad = 'MOVED_ABROAD',
  MovedInWithParents = 'MOVED_IN_WITH_PARENTS',
  Price = 'PRICE',
  MissedPayments = 'MISSED_PAYMENTS',
  MissedPaymentsBadRisk = 'MISSED_PAYMENTS_BAD_RISK',
  PaymentIssues = 'PAYMENT_ISSUES',
  DiscountPeriodOver = 'DISCOUNT_PERIOD_OVER',
  ConfirmedFraud = 'CONFIRMED_FRAUD',
  SuspectedFraud = 'SUSPECTED_FRAUD',
  Other = 'OTHER',
  Unknown = 'UNKNOWN',
}

export type TestClaim = {
  __typename?: 'TestClaim'
  date?: Maybe<Scalars['LocalDate']>
}

export type TheftClaim = {
  __typename?: 'TheftClaim'
  location?: Maybe<Scalars['String']>
  date?: Maybe<Scalars['LocalDate']>
  item?: Maybe<Scalars['String']>
  policeReport?: Maybe<Scalars['String']>
  receipt?: Maybe<Scalars['String']>
}

export type Ticket = {
  __typename?: 'Ticket'
  id?: Maybe<Scalars['ID']>
  assignedTo?: Maybe<Scalars['String']>
  createdAt?: Maybe<Scalars['Instant']>
  createdBy?: Maybe<Scalars['String']>
  memberId?: Maybe<Scalars['String']>
  referenceId?: Maybe<Scalars['String']>
  priority?: Maybe<Scalars['Float']>
  type?: Maybe<TicketType>
  remindNotificationDate?: Maybe<Scalars['LocalDate']>
  remindNotificationTime?: Maybe<Scalars['LocalTime']>
  remindMessage?: Maybe<Scalars['String']>
  description?: Maybe<Scalars['String']>
  status?: Maybe<TicketStatus>
}

export enum TicketChangeType {
  TicketCreated = 'TICKET_CREATED',
  ChangedReminder = 'CHANGED_REMINDER',
  ChangedAssignedTo = 'CHANGED_ASSIGNED_TO',
  ChangedDescription = 'CHANGED_DESCRIPTION',
  ChangedStatus = 'CHANGED_STATUS',
  ChangedPriority = 'CHANGED_PRIORITY',
}

export type TicketHistory = {
  __typename?: 'TicketHistory'
  id?: Maybe<Scalars['ID']>
  createdAt?: Maybe<Scalars['Instant']>
  createdBy?: Maybe<Scalars['String']>
  type?: Maybe<TicketType>
  revisions?: Maybe<Array<Maybe<TicketRevision>>>
}

export type TicketInput = {
  assignedTo?: Maybe<Scalars['String']>
  priority?: Maybe<Scalars['Float']>
  type?: Maybe<TicketType>
  remindNotificationDate?: Maybe<Scalars['LocalDate']>
  remindNotificationTime?: Maybe<Scalars['LocalTime']>
  remindMessage?: Maybe<Scalars['String']>
  description?: Maybe<Scalars['String']>
  status?: Maybe<TicketStatus>
  referenceId?: Maybe<Scalars['String']>
  memberId?: Maybe<Scalars['String']>
}

export type TicketRevision = {
  __typename?: 'TicketRevision'
  assignedTo?: Maybe<Scalars['String']>
  manualPriority?: Maybe<Scalars['Float']>
  remindDate?: Maybe<Scalars['LocalDate']>
  remindTime?: Maybe<Scalars['LocalTime']>
  remindMessage?: Maybe<Scalars['String']>
  status?: Maybe<TicketStatus>
  changedAt?: Maybe<Scalars['Instant']>
  changeType?: Maybe<TicketChangeType>
  changedBy?: Maybe<Scalars['String']>
  description?: Maybe<Scalars['String']>
}

export enum TicketStatus {
  Waiting = 'WAITING',
  WorkingOn = 'WORKING_ON',
  OnHold = 'ON_HOLD',
  Resolved = 'RESOLVED',
}

export enum TicketType {
  Remind = 'REMIND',
  Message = 'MESSAGE',
  Claim = 'CLAIM',
  CallMe = 'CALL_ME',
  Other = 'OTHER',
}

export type Transaction = {
  __typename?: 'Transaction'
  id?: Maybe<Scalars['ID']>
  amount?: Maybe<Scalars['MonetaryAmount']>
  timestamp?: Maybe<Scalars['Instant']>
  type?: Maybe<Scalars['String']>
  status?: Maybe<Scalars['String']>
}

export type TravelAccidentClaim = {
  __typename?: 'TravelAccidentClaim'
  location?: Maybe<Scalars['String']>
  date?: Maybe<Scalars['LocalDate']>
  policeReport?: Maybe<Scalars['String']>
  receipt?: Maybe<Scalars['String']>
}

export type VerminAndPestsClaim = {
  __typename?: 'VerminAndPestsClaim'
  date?: Maybe<Scalars['LocalDate']>
}

export type WaterDamageBathroomClaim = {
  __typename?: 'WaterDamageBathroomClaim'
  date?: Maybe<Scalars['LocalDate']>
}

export type WaterDamageClaim = {
  __typename?: 'WaterDamageClaim'
  date?: Maybe<Scalars['LocalDate']>
}

export type WaterDamageKitchenClaim = {
  __typename?: 'WaterDamageKitchenClaim'
  date?: Maybe<Scalars['LocalDate']>
}

export type Whitelisted = {
  __typename?: 'Whitelisted'
  whitelistedAt?: Maybe<Scalars['Instant']>
  whitelistedBy?: Maybe<Scalars['String']>
}

export type MemberNameAndContractMarketInfoQueryVariables = {
  memberId: Scalars['ID']
}

export type MemberNameAndContractMarketInfoQuery = {
  __typename?: 'QueryType'
} & {
  member: Maybe<
    { __typename?: 'Member' } & Pick<Member, 'firstName' | 'lastName'> & {
        contractMarketInfo: Maybe<
          { __typename?: 'ContractMarketInfo' } & Pick<
            ContractMarketInfo,
            'market'
          >
        >
      }
  >
}

export type AddNorwegainPostalCodesMutationVariables = {
  postalCodesString?: Maybe<Scalars['String']>
}

export type AddNorwegainPostalCodesMutation = {
  __typename?: 'MutationType'
} & Pick<MutationType, 'addNorwegianPostalCodes'>

export type CreateNorwegianGripenPriceEngineMutationVariables = {
  request?: Maybe<CreateNorwegianGripenInput>
}

export type CreateNorwegianGripenPriceEngineMutation = {
  __typename?: 'MutationType'
} & Pick<MutationType, 'createNorwegianGripenPriceEngine'>

export type GetSwitcherEmailsQueryVariables = {}

export type GetSwitcherEmailsQuery = { __typename?: 'QueryType' } & {
  switchableSwitcherEmails: Array<
    { __typename?: 'SwitchableSwitcherEmail' } & Pick<
      SwitchableSwitcherEmail,
      'id' | 'switcherCompany' | 'queuedAt' | 'sentAt' | 'remindedAt'
    > & {
        member: { __typename?: 'Member' } & Pick<
          Member,
          'memberId' | 'signedOn' | 'firstName' | 'lastName'
        >
      }
  >
}

export type MarkSwitcherEmailAsRemindedMutationVariables = {
  id: Scalars['ID']
}

export type MarkSwitcherEmailAsRemindedMutation = {
  __typename?: 'MutationType'
} & Pick<MutationType, 'markSwitchableSwitcherEmailAsReminded'>

export type ActivatePendingAgreementMutationVariables = {
  contractId: Scalars['ID']
  request?: Maybe<ActivatePendingAgreementInput>
}

export type ActivatePendingAgreementMutation = {
  __typename?: 'MutationType'
} & {
  activatePendingAgreement: { __typename?: 'Contract' } & Pick<
    Contract,
    'id' | 'holderMemberId'
  >
}

export type AddAgreementFromQuoteMutationVariables = {
  id: Scalars['ID']
  contractId: Scalars['ID']
  activeFrom?: Maybe<Scalars['LocalDate']>
  activeTo?: Maybe<Scalars['LocalDate']>
  previousAgreementActiveTo?: Maybe<Scalars['LocalDate']>
}

export type AddAgreementFromQuoteMutation = { __typename?: 'MutationType' } & {
  addAgreementFromQuote: { __typename?: 'Quote' } & Pick<Quote, 'id'>
}

export type ChangeFromDateMutationVariables = {
  agreementId: Scalars['ID']
  request?: Maybe<ChangeFromDateInput>
}

export type ChangeFromDateMutation = { __typename?: 'MutationType' } & Pick<
  MutationType,
  'changeFromDate'
>

export type ChangeTerminationDateMutationVariables = {
  contractId: Scalars['ID']
  request?: Maybe<ChangeTerminationDateInput>
}

export type ChangeTerminationDateMutation = { __typename?: 'MutationType' } & {
  changeTerminationDate: { __typename?: 'Contract' } & Pick<
    Contract,
    'id' | 'holderMemberId'
  >
}

export type ChangeToDateMutationVariables = {
  agreementId: Scalars['ID']
  request?: Maybe<ChangeToDateInput>
}

export type ChangeToDateMutation = { __typename?: 'MutationType' } & Pick<
  MutationType,
  'changeToDate'
>

export type CreateQuoteFromBackOfficeMutationVariables = {
  agreementId: Scalars['ID']
  memberId: Scalars['ID']
}

export type CreateQuoteFromBackOfficeMutation = {
  __typename?: 'MutationType'
} & { createQuoteFromBackOffice: { __typename?: 'Quote' } & Pick<Quote, 'id'> }

export type GetContractMarketInfoQueryVariables = {
  memberId: Scalars['ID']
}

export type GetContractMarketInfoQuery = { __typename?: 'QueryType' } & {
  member: Maybe<
    { __typename?: 'Member' } & {
      contractMarketInfo: Maybe<
        { __typename?: 'ContractMarketInfo' } & Pick<
          ContractMarketInfo,
          'market' | 'preferredCurrency'
        >
      >
    }
  >
}

export type GetContractsQueryVariables = {
  memberId: Scalars['ID']
}

export type GetContractsQuery = { __typename?: 'QueryType' } & {
  member: Maybe<
    { __typename?: 'Member' } & {
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
          | 'contractTypeName'
          | 'createdAt'
        > & {
            agreements: Array<
              | ({ __typename?: 'SwedishApartment' } & Pick<
                  SwedishApartment,
                  | 'id'
                  | 'fromDate'
                  | 'toDate'
                  | 'certificateUrl'
                  | 'status'
                  | 'numberCoInsured'
                  | 'squareMeters'
                > & {
                    swedishApartmentLineOfBusiness: SwedishApartment['lineOfBusiness']
                  } & {
                    premium: { __typename?: 'MonetaryAmountV2' } & Pick<
                      MonetaryAmountV2,
                      'amount' | 'currency'
                    >
                    address: { __typename?: 'Address' } & Pick<
                      Address,
                      'street' | 'postalCode' | 'city'
                    >
                  })
              | ({ __typename?: 'SwedishHouse' } & Pick<
                  SwedishHouse,
                  | 'id'
                  | 'fromDate'
                  | 'toDate'
                  | 'certificateUrl'
                  | 'status'
                  | 'numberCoInsured'
                  | 'squareMeters'
                  | 'ancillaryArea'
                  | 'yearOfConstruction'
                  | 'numberOfBathrooms'
                  | 'isSubleted'
                > & {
                    premium: { __typename?: 'MonetaryAmountV2' } & Pick<
                      MonetaryAmountV2,
                      'amount' | 'currency'
                    >
                    address: { __typename?: 'Address' } & Pick<
                      Address,
                      'street' | 'postalCode' | 'city'
                    >
                    extraBuildings: Array<
                      { __typename?: 'ExtraBuilding' } & Pick<
                        ExtraBuilding,
                        | 'id'
                        | 'type'
                        | 'area'
                        | 'hasWaterConnected'
                        | 'displayName'
                      >
                    >
                  })
              | ({ __typename?: 'NorwegianHomeContent' } & Pick<
                  NorwegianHomeContent,
                  | 'id'
                  | 'fromDate'
                  | 'toDate'
                  | 'certificateUrl'
                  | 'status'
                  | 'numberCoInsured'
                  | 'squareMeters'
                > & {
                    norwegianHomeContentLineOfBusiness: NorwegianHomeContent['lineOfBusiness']
                  } & {
                    premium: { __typename?: 'MonetaryAmountV2' } & Pick<
                      MonetaryAmountV2,
                      'amount' | 'currency'
                    >
                    address: { __typename?: 'Address' } & Pick<
                      Address,
                      'street' | 'postalCode' | 'city'
                    >
                  })
              | ({ __typename?: 'NorwegianTravel' } & Pick<
                  NorwegianTravel,
                  | 'id'
                  | 'fromDate'
                  | 'toDate'
                  | 'certificateUrl'
                  | 'status'
                  | 'numberCoInsured'
                > & {
                    norwegianTravelLineOfBusiness: NorwegianTravel['lineOfBusiness']
                  } & {
                    premium: { __typename?: 'MonetaryAmountV2' } & Pick<
                      MonetaryAmountV2,
                      'amount' | 'currency'
                    >
                  })
            >
            renewal: Maybe<
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

export type GetQuotesQueryVariables = {
  memberId: Scalars['ID']
}

export type GetQuotesQuery = { __typename?: 'QueryType' } & {
  member: Maybe<
    { __typename?: 'Member' } & {
      quotes: Array<
        { __typename?: 'Quote' } & Pick<
          Quote,
          | 'id'
          | 'price'
          | 'productType'
          | 'state'
          | 'startDate'
          | 'validity'
          | 'isComplete'
          | 'createdAt'
          | 'breachedUnderwritingGuidelines'
          | 'originatingProductId'
          | 'signedProductId'
        > & {
            data: Maybe<
              | ({ __typename?: 'ApartmentQuoteData' } & Pick<
                  ApartmentQuoteData,
                  | 'street'
                  | 'zipCode'
                  | 'city'
                  | 'householdSize'
                  | 'livingSpace'
                  | 'subType'
                >)
              | ({ __typename?: 'HouseQuoteData' } & Pick<
                  HouseQuoteData,
                  | 'street'
                  | 'zipCode'
                  | 'city'
                  | 'householdSize'
                  | 'livingSpace'
                  | 'ancillaryArea'
                  | 'yearOfConstruction'
                  | 'numberOfBathrooms'
                  | 'isSubleted'
                > & {
                    extraBuildings: Array<
                      { __typename?: 'ExtraBuilding' } & Pick<
                        ExtraBuilding,
                        'type' | 'area' | 'hasWaterConnected'
                      >
                    >
                  })
              | { __typename?: 'NorwegianHomeContentQuoteData' }
              | { __typename?: 'NorwegianTravelQuoteData' }
            >
          }
      >
    }
  >
}

export type RegenerateCertificateMutationVariables = {
  agreementId: Scalars['ID']
}

export type RegenerateCertificateMutation = {
  __typename?: 'MutationType'
} & Pick<MutationType, 'regenerateCertificate'>

export type RevertTerminationMutationVariables = {
  contractId: Scalars['ID']
}

export type RevertTerminationMutation = { __typename?: 'MutationType' } & {
  revertTermination: { __typename?: 'Contract' } & Pick<
    Contract,
    'id' | 'holderMemberId'
  >
}

export type TerminateContractMutationVariables = {
  contractId: Scalars['ID']
  request?: Maybe<TerminateContractInput>
}

export type TerminateContractMutation = { __typename?: 'MutationType' } & {
  terminateContract: { __typename?: 'Contract' } & Pick<
    Contract,
    'id' | 'holderMemberId'
  >
}

export const MemberNameAndContractMarketInfoDocument = gql`
  query MemberNameAndContractMarketInfo($memberId: ID!) {
    member(id: $memberId) {
      firstName
      lastName
      contractMarketInfo {
        market
      }
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
  baseOptions?: ApolloReactHooks.QueryHookOptions<
    MemberNameAndContractMarketInfoQuery,
    MemberNameAndContractMarketInfoQueryVariables
  >,
) {
  return ApolloReactHooks.useQuery<
    MemberNameAndContractMarketInfoQuery,
    MemberNameAndContractMarketInfoQueryVariables
  >(MemberNameAndContractMarketInfoDocument, baseOptions)
}
export function useMemberNameAndContractMarketInfoLazyQuery(
  baseOptions?: ApolloReactHooks.LazyQueryHookOptions<
    MemberNameAndContractMarketInfoQuery,
    MemberNameAndContractMarketInfoQueryVariables
  >,
) {
  return ApolloReactHooks.useLazyQuery<
    MemberNameAndContractMarketInfoQuery,
    MemberNameAndContractMarketInfoQueryVariables
  >(MemberNameAndContractMarketInfoDocument, baseOptions)
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
export const AddNorwegainPostalCodesDocument = gql`
  mutation AddNorwegainPostalCodes($postalCodesString: String) {
    addNorwegianPostalCodes(postalCodesString: $postalCodesString)
  }
`
export type AddNorwegainPostalCodesMutationFn = ApolloReactCommon.MutationFunction<
  AddNorwegainPostalCodesMutation,
  AddNorwegainPostalCodesMutationVariables
>

/**
 * __useAddNorwegainPostalCodesMutation__
 *
 * To run a mutation, you first call `useAddNorwegainPostalCodesMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useAddNorwegainPostalCodesMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [addNorwegainPostalCodesMutation, { data, loading, error }] = useAddNorwegainPostalCodesMutation({
 *   variables: {
 *      postalCodesString: // value for 'postalCodesString'
 *   },
 * });
 */
export function useAddNorwegainPostalCodesMutation(
  baseOptions?: ApolloReactHooks.MutationHookOptions<
    AddNorwegainPostalCodesMutation,
    AddNorwegainPostalCodesMutationVariables
  >,
) {
  return ApolloReactHooks.useMutation<
    AddNorwegainPostalCodesMutation,
    AddNorwegainPostalCodesMutationVariables
  >(AddNorwegainPostalCodesDocument, baseOptions)
}
export type AddNorwegainPostalCodesMutationHookResult = ReturnType<
  typeof useAddNorwegainPostalCodesMutation
>
export type AddNorwegainPostalCodesMutationResult = ApolloReactCommon.MutationResult<
  AddNorwegainPostalCodesMutation
>
export type AddNorwegainPostalCodesMutationOptions = ApolloReactCommon.BaseMutationOptions<
  AddNorwegainPostalCodesMutation,
  AddNorwegainPostalCodesMutationVariables
>
export const CreateNorwegianGripenPriceEngineDocument = gql`
  mutation CreateNorwegianGripenPriceEngine(
    $request: CreateNorwegianGripenInput
  ) {
    createNorwegianGripenPriceEngine(request: $request)
  }
`
export type CreateNorwegianGripenPriceEngineMutationFn = ApolloReactCommon.MutationFunction<
  CreateNorwegianGripenPriceEngineMutation,
  CreateNorwegianGripenPriceEngineMutationVariables
>

/**
 * __useCreateNorwegianGripenPriceEngineMutation__
 *
 * To run a mutation, you first call `useCreateNorwegianGripenPriceEngineMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useCreateNorwegianGripenPriceEngineMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [createNorwegianGripenPriceEngineMutation, { data, loading, error }] = useCreateNorwegianGripenPriceEngineMutation({
 *   variables: {
 *      request: // value for 'request'
 *   },
 * });
 */
export function useCreateNorwegianGripenPriceEngineMutation(
  baseOptions?: ApolloReactHooks.MutationHookOptions<
    CreateNorwegianGripenPriceEngineMutation,
    CreateNorwegianGripenPriceEngineMutationVariables
  >,
) {
  return ApolloReactHooks.useMutation<
    CreateNorwegianGripenPriceEngineMutation,
    CreateNorwegianGripenPriceEngineMutationVariables
  >(CreateNorwegianGripenPriceEngineDocument, baseOptions)
}
export type CreateNorwegianGripenPriceEngineMutationHookResult = ReturnType<
  typeof useCreateNorwegianGripenPriceEngineMutation
>
export type CreateNorwegianGripenPriceEngineMutationResult = ApolloReactCommon.MutationResult<
  CreateNorwegianGripenPriceEngineMutation
>
export type CreateNorwegianGripenPriceEngineMutationOptions = ApolloReactCommon.BaseMutationOptions<
  CreateNorwegianGripenPriceEngineMutation,
  CreateNorwegianGripenPriceEngineMutationVariables
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
      }
      switcherCompany
      queuedAt
      sentAt
      remindedAt
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
  return ApolloReactHooks.useQuery<
    GetSwitcherEmailsQuery,
    GetSwitcherEmailsQueryVariables
  >(GetSwitcherEmailsDocument, baseOptions)
}
export function useGetSwitcherEmailsLazyQuery(
  baseOptions?: ApolloReactHooks.LazyQueryHookOptions<
    GetSwitcherEmailsQuery,
    GetSwitcherEmailsQueryVariables
  >,
) {
  return ApolloReactHooks.useLazyQuery<
    GetSwitcherEmailsQuery,
    GetSwitcherEmailsQueryVariables
  >(GetSwitcherEmailsDocument, baseOptions)
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
    markSwitchableSwitcherEmailAsReminded(id: $id)
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
  return ApolloReactHooks.useMutation<
    MarkSwitcherEmailAsRemindedMutation,
    MarkSwitcherEmailAsRemindedMutationVariables
  >(MarkSwitcherEmailAsRemindedDocument, baseOptions)
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
  return ApolloReactHooks.useMutation<
    ActivatePendingAgreementMutation,
    ActivatePendingAgreementMutationVariables
  >(ActivatePendingAgreementDocument, baseOptions)
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
  return ApolloReactHooks.useMutation<
    AddAgreementFromQuoteMutation,
    AddAgreementFromQuoteMutationVariables
  >(AddAgreementFromQuoteDocument, baseOptions)
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
export const ChangeFromDateDocument = gql`
  mutation ChangeFromDate($agreementId: ID!, $request: ChangeFromDateInput) {
    changeFromDate(agreementId: $agreementId, request: $request)
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
  return ApolloReactHooks.useMutation<
    ChangeFromDateMutation,
    ChangeFromDateMutationVariables
  >(ChangeFromDateDocument, baseOptions)
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
  return ApolloReactHooks.useMutation<
    ChangeTerminationDateMutation,
    ChangeTerminationDateMutationVariables
  >(ChangeTerminationDateDocument, baseOptions)
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
    changeToDate(agreementId: $agreementId, request: $request)
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
  return ApolloReactHooks.useMutation<
    ChangeToDateMutation,
    ChangeToDateMutationVariables
  >(ChangeToDateDocument, baseOptions)
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
export const CreateQuoteFromBackOfficeDocument = gql`
  mutation CreateQuoteFromBackOffice($agreementId: ID!, $memberId: ID!) {
    createQuoteFromBackOffice(agreementId: $agreementId, memberId: $memberId) {
      id
    }
  }
`
export type CreateQuoteFromBackOfficeMutationFn = ApolloReactCommon.MutationFunction<
  CreateQuoteFromBackOfficeMutation,
  CreateQuoteFromBackOfficeMutationVariables
>

/**
 * __useCreateQuoteFromBackOfficeMutation__
 *
 * To run a mutation, you first call `useCreateQuoteFromBackOfficeMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useCreateQuoteFromBackOfficeMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [createQuoteFromBackOfficeMutation, { data, loading, error }] = useCreateQuoteFromBackOfficeMutation({
 *   variables: {
 *      agreementId: // value for 'agreementId'
 *      memberId: // value for 'memberId'
 *   },
 * });
 */
export function useCreateQuoteFromBackOfficeMutation(
  baseOptions?: ApolloReactHooks.MutationHookOptions<
    CreateQuoteFromBackOfficeMutation,
    CreateQuoteFromBackOfficeMutationVariables
  >,
) {
  return ApolloReactHooks.useMutation<
    CreateQuoteFromBackOfficeMutation,
    CreateQuoteFromBackOfficeMutationVariables
  >(CreateQuoteFromBackOfficeDocument, baseOptions)
}
export type CreateQuoteFromBackOfficeMutationHookResult = ReturnType<
  typeof useCreateQuoteFromBackOfficeMutation
>
export type CreateQuoteFromBackOfficeMutationResult = ApolloReactCommon.MutationResult<
  CreateQuoteFromBackOfficeMutation
>
export type CreateQuoteFromBackOfficeMutationOptions = ApolloReactCommon.BaseMutationOptions<
  CreateQuoteFromBackOfficeMutation,
  CreateQuoteFromBackOfficeMutationVariables
>
export const GetContractMarketInfoDocument = gql`
  query GetContractMarketInfo($memberId: ID!) {
    member(id: $memberId) {
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
  baseOptions?: ApolloReactHooks.QueryHookOptions<
    GetContractMarketInfoQuery,
    GetContractMarketInfoQueryVariables
  >,
) {
  return ApolloReactHooks.useQuery<
    GetContractMarketInfoQuery,
    GetContractMarketInfoQueryVariables
  >(GetContractMarketInfoDocument, baseOptions)
}
export function useGetContractMarketInfoLazyQuery(
  baseOptions?: ApolloReactHooks.LazyQueryHookOptions<
    GetContractMarketInfoQuery,
    GetContractMarketInfoQueryVariables
  >,
) {
  return ApolloReactHooks.useLazyQuery<
    GetContractMarketInfoQuery,
    GetContractMarketInfoQueryVariables
  >(GetContractMarketInfoDocument, baseOptions)
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
export const GetContractsDocument = gql`
  query GetContracts($memberId: ID!) {
    member(id: $memberId) {
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
        agreements {
          ... on SwedishApartment {
            id
            fromDate
            toDate
            certificateUrl
            status
            premium {
              amount
              currency
            }
            swedishApartmentLineOfBusiness: lineOfBusiness
            address {
              street
              postalCode
              city
            }
            numberCoInsured
            squareMeters
          }
          ... on SwedishHouse {
            id
            fromDate
            toDate
            certificateUrl
            status
            premium {
              amount
              currency
            }
            address {
              street
              postalCode
              city
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
              hasWaterConnected
              displayName
            }
            isSubleted
          }
          ... on NorwegianHomeContent {
            id
            fromDate
            toDate
            certificateUrl
            status
            premium {
              amount
              currency
            }
            norwegianHomeContentLineOfBusiness: lineOfBusiness
            address {
              street
              postalCode
              city
            }
            numberCoInsured
            squareMeters
          }
          ... on NorwegianTravel {
            id
            fromDate
            toDate
            certificateUrl
            status
            premium {
              amount
              currency
            }
            norwegianTravelLineOfBusiness: lineOfBusiness
            numberCoInsured
          }
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
        contractTypeName
        createdAt
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
  baseOptions?: ApolloReactHooks.QueryHookOptions<
    GetContractsQuery,
    GetContractsQueryVariables
  >,
) {
  return ApolloReactHooks.useQuery<
    GetContractsQuery,
    GetContractsQueryVariables
  >(GetContractsDocument, baseOptions)
}
export function useGetContractsLazyQuery(
  baseOptions?: ApolloReactHooks.LazyQueryHookOptions<
    GetContractsQuery,
    GetContractsQueryVariables
  >,
) {
  return ApolloReactHooks.useLazyQuery<
    GetContractsQuery,
    GetContractsQueryVariables
  >(GetContractsDocument, baseOptions)
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
export const GetQuotesDocument = gql`
  query GetQuotes($memberId: ID!) {
    member(id: $memberId) {
      quotes {
        id
        price
        productType
        state
        startDate
        validity
        isComplete
        createdAt
        breachedUnderwritingGuidelines
        originatingProductId
        signedProductId
        data {
          ... on ApartmentQuoteData {
            street
            zipCode
            city
            householdSize
            livingSpace
            subType
          }
          ... on HouseQuoteData {
            street
            zipCode
            city
            householdSize
            livingSpace
            ancillaryArea
            yearOfConstruction
            numberOfBathrooms
            extraBuildings {
              type
              area
              hasWaterConnected
            }
            isSubleted
          }
        }
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
  baseOptions?: ApolloReactHooks.QueryHookOptions<
    GetQuotesQuery,
    GetQuotesQueryVariables
  >,
) {
  return ApolloReactHooks.useQuery<GetQuotesQuery, GetQuotesQueryVariables>(
    GetQuotesDocument,
    baseOptions,
  )
}
export function useGetQuotesLazyQuery(
  baseOptions?: ApolloReactHooks.LazyQueryHookOptions<
    GetQuotesQuery,
    GetQuotesQueryVariables
  >,
) {
  return ApolloReactHooks.useLazyQuery<GetQuotesQuery, GetQuotesQueryVariables>(
    GetQuotesDocument,
    baseOptions,
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
export const RegenerateCertificateDocument = gql`
  mutation RegenerateCertificate($agreementId: ID!) {
    regenerateCertificate(agreementId: $agreementId)
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
  return ApolloReactHooks.useMutation<
    RegenerateCertificateMutation,
    RegenerateCertificateMutationVariables
  >(RegenerateCertificateDocument, baseOptions)
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
export const RevertTerminationDocument = gql`
  mutation RevertTermination($contractId: ID!) {
    revertTermination(contractId: $contractId) {
      id
      holderMemberId
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
  return ApolloReactHooks.useMutation<
    RevertTerminationMutation,
    RevertTerminationMutationVariables
  >(RevertTerminationDocument, baseOptions)
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
export const TerminateContractDocument = gql`
  mutation TerminateContract(
    $contractId: ID!
    $request: TerminateContractInput
  ) {
    terminateContract(contractId: $contractId, request: $request) {
      id
      holderMemberId
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
  return ApolloReactHooks.useMutation<
    TerminateContractMutation,
    TerminateContractMutationVariables
  >(TerminateContractDocument, baseOptions)
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

export interface IntrospectionResultData {
  __schema: {
    types: {
      kind: string
      name: string
      possibleTypes: {
        name: string
      }[]
    }[]
  }
}
const result: IntrospectionResultData = {
  __schema: {
    types: [
      {
        kind: 'UNION',
        name: 'QuoteData',
        possibleTypes: [
          {
            name: 'ApartmentQuoteData',
          },
          {
            name: 'HouseQuoteData',
          },
          {
            name: 'NorwegianHomeContentQuoteData',
          },
          {
            name: 'NorwegianTravelQuoteData',
          },
        ],
      },
      {
        kind: 'INTERFACE',
        name: 'IQuoteData',
        possibleTypes: [
          {
            name: 'ApartmentQuoteData',
          },
          {
            name: 'HouseQuoteData',
          },
          {
            name: 'NorwegianHomeContentQuoteData',
          },
          {
            name: 'NorwegianTravelQuoteData',
          },
        ],
      },
      {
        kind: 'UNION',
        name: 'Agreement',
        possibleTypes: [
          {
            name: 'SwedishApartment',
          },
          {
            name: 'SwedishHouse',
          },
          {
            name: 'NorwegianHomeContent',
          },
          {
            name: 'NorwegianTravel',
          },
        ],
      },
      {
        kind: 'INTERFACE',
        name: 'AgreementCore',
        possibleTypes: [
          {
            name: 'SwedishApartment',
          },
          {
            name: 'SwedishHouse',
          },
          {
            name: 'NorwegianHomeContent',
          },
          {
            name: 'NorwegianTravel',
          },
        ],
      },
      {
        kind: 'UNION',
        name: 'ClaimType',
        possibleTypes: [
          {
            name: 'TheftClaim',
          },
          {
            name: 'AccidentalDamageClaim',
          },
          {
            name: 'AssaultClaim',
          },
          {
            name: 'WaterDamageClaim',
          },
          {
            name: 'TravelAccidentClaim',
          },
          {
            name: 'LuggageDelayClaim',
          },
          {
            name: 'NotCoveredClaim',
          },
          {
            name: 'FireDamageClaim',
          },
          {
            name: 'ConfirmedFraudClaim',
          },
          {
            name: 'LiabilityClaim',
          },
          {
            name: 'ApplianceClaim',
          },
          {
            name: 'LegalProtectionClaim',
          },
          {
            name: 'WaterDamageBathroomClaim',
          },
          {
            name: 'WaterDamageKitchenClaim',
          },
          {
            name: 'BurglaryClaim',
          },
          {
            name: 'FloodingClaim',
          },
          {
            name: 'EarthquakeClaim',
          },
          {
            name: 'InstallationsClaim',
          },
          {
            name: 'SnowPressureClaim',
          },
          {
            name: 'StormDamageClaim',
          },
          {
            name: 'VerminAndPestsClaim',
          },
          {
            name: 'TestClaim',
          },
        ],
      },
    ],
  },
}
export default result
