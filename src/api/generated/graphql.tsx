import gql from 'graphql-tag';
export type Maybe<T> = T | null;
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: string,
  String: string,
  Boolean: boolean,
  Int: number,
  Float: number,
  /** A String-representation of `java.time.Instant`. ex: `"2018-06-11T20:08:30.123456"` */
  Instant: any,
  /** An object-representation of `javax.money.MonetaryAmount`. ex: `{"amount": 100,  "currency": "SEK"}` */
  MonetaryAmount: any,
  /** A String-representation of `java.time.LocalDate`, ex:  `"2018-09-26"` */
  LocalDate: any,
  /** A String-representation of `java.net.URL`, ex: "https://www.google.com/" */
  URL: any,
  /** A String-representation of `java.time.YearMonth`. ex: `"2018-06"` */
  YearMonth: any,
  /** A String-representation of `java.time.LocalDateTIme`. ex: `"2018-06-11T20:08:30.123456"` */
  LocalDateTime: any,
  /** A String-representation of `java.time.LocalTime`, */
  LocalTime: any,
};

export type AccidentalDamageClaim = {
   __typename?: 'AccidentalDamageClaim',
  date?: Maybe<Scalars['LocalDate']>,
  item?: Maybe<Scalars['String']>,
  location?: Maybe<Scalars['String']>,
  policeReport?: Maybe<Scalars['String']>,
  receipt?: Maybe<Scalars['String']>,
};

export type Account = {
   __typename?: 'Account',
  currentBalance: Scalars['MonetaryAmount'],
  entries: Array<AccountEntry>,
  id: Scalars['ID'],
  totalBalance: Scalars['MonetaryAmount'],
};

export type AccountEntry = {
   __typename?: 'AccountEntry',
  amount: Scalars['MonetaryAmount'],
  chargedAt?: Maybe<Scalars['Instant']>,
  comment?: Maybe<Scalars['String']>,
  failedAt?: Maybe<Scalars['Instant']>,
  fromDate: Scalars['LocalDate'],
  id: Scalars['ID'],
  reference: Scalars['String'],
  source: Scalars['String'],
  title?: Maybe<Scalars['String']>,
  type: AccountEntryType,
};

export type AccountEntryInput = {
  amount: Scalars['MonetaryAmount'],
  comment?: Maybe<Scalars['String']>,
  fromDate: Scalars['LocalDate'],
  reference: Scalars['String'],
  source: Scalars['String'],
  title?: Maybe<Scalars['String']>,
  type: AccountEntryType,
};

export enum AccountEntryType {
  Campaign = 'CAMPAIGN',
  Charge = 'CHARGE',
  Correction = 'CORRECTION',
  FreeMonthDiscount = 'FREE_MONTH_DISCOUNT',
  Payout = 'PAYOUT',
  ReferralDiscount = 'REFERRAL_DISCOUNT',
  Subscription = 'SUBSCRIPTION'
}

export type AllRepliesEntry = {
   __typename?: 'AllRepliesEntry',
  intent: Scalars['String'],
  reply: Scalars['String'],
};

export type ApartmentQuoteData = IQuoteData & {
   __typename?: 'ApartmentQuoteData',
  city?: Maybe<Scalars['String']>,
  firstName?: Maybe<Scalars['String']>,
  householdSize?: Maybe<Scalars['Int']>,
  id: Scalars['ID'],
  lastName?: Maybe<Scalars['String']>,
  livingSpace?: Maybe<Scalars['Int']>,
  ssn?: Maybe<Scalars['String']>,
  street?: Maybe<Scalars['String']>,
  subType?: Maybe<ApartmentSubType>,
  zipCode?: Maybe<Scalars['String']>,
};

export type ApartmentQuoteDataInput = {
  city?: Maybe<Scalars['String']>,
  firstName?: Maybe<Scalars['String']>,
  householdSize?: Maybe<Scalars['Int']>,
  lastName?: Maybe<Scalars['String']>,
  livingSpace?: Maybe<Scalars['Int']>,
  ssn?: Maybe<Scalars['String']>,
  street?: Maybe<Scalars['String']>,
  subType?: Maybe<ApartmentSubType>,
  zipCode?: Maybe<Scalars['String']>,
};

export type ApartmentQuoteInput = {
  city?: Maybe<Scalars['String']>,
  householdSize?: Maybe<Scalars['Int']>,
  livingSpace?: Maybe<Scalars['Int']>,
  street?: Maybe<Scalars['String']>,
  subType?: Maybe<ApartmentSubType>,
  zipCode?: Maybe<Scalars['String']>,
};

export enum ApartmentSubType {
  Brf = 'BRF',
  Rent = 'RENT',
  StudentBrf = 'STUDENT_BRF',
  StudentRent = 'STUDENT_RENT',
  SubletBrf = 'SUBLET_BRF',
  SubletRental = 'SUBLET_RENTAL'
}

export type ApplianceClaim = {
   __typename?: 'ApplianceClaim',
  date?: Maybe<Scalars['LocalDate']>,
  item?: Maybe<Scalars['String']>,
  location?: Maybe<Scalars['String']>,
};

export type AssaultClaim = {
   __typename?: 'AssaultClaim',
  date?: Maybe<Scalars['LocalDate']>,
  location?: Maybe<Scalars['String']>,
  policeReport?: Maybe<Scalars['String']>,
};

export type AutoLabel = {
   __typename?: 'AutoLabel',
  message?: Maybe<Scalars['Boolean']>,
};

export type BurglaryClaim = {
   __typename?: 'BurglaryClaim',
  date?: Maybe<Scalars['LocalDate']>,
  item?: Maybe<Scalars['String']>,
  location?: Maybe<Scalars['String']>,
  policeReport?: Maybe<Scalars['String']>,
  receipt?: Maybe<Scalars['String']>,
};

export type Category = {
   __typename?: 'Category',
  id: Scalars['String'],
  name: Scalars['String'],
};

export enum ChargeStatus {
  ApprovedForCharge = 'APPROVED_FOR_CHARGE',
  ChargeCompleted = 'CHARGE_COMPLETED',
  ChargeFailed = 'CHARGE_FAILED',
  ChargeInitiated = 'CHARGE_INITIATED',
  ChargeRequesting = 'CHARGE_REQUESTING',
  ChargeRequestFailed = 'CHARGE_REQUEST_FAILED',
  Initiated = 'INITIATED',
  ScheduleSubscriptionFailed = 'SCHEDULE_SUBSCRIPTION_FAILED',
  SchedulingCharge = 'SCHEDULING_CHARGE',
  SchedulingSubscription = 'SCHEDULING_SUBSCRIPTION',
  SubscriptionScheduledAndWaitingForApproval = 'SUBSCRIPTION_SCHEDULED_AND_WAITING_FOR_APPROVAL',
  WaitingForSubscription = 'WAITING_FOR_SUBSCRIPTION'
}

export type Claim = {
   __typename?: 'Claim',
  coveringEmployee: Scalars['Boolean'],
  events?: Maybe<Array<Maybe<ClaimEvent>>>,
  id?: Maybe<Scalars['ID']>,
  member?: Maybe<Member>,
  notes?: Maybe<Array<Maybe<ClaimNote>>>,
  payments?: Maybe<Array<Maybe<ClaimPayment>>>,
  recordingUrl?: Maybe<Scalars['String']>,
  registrationDate?: Maybe<Scalars['Instant']>,
  reserves?: Maybe<Scalars['MonetaryAmount']>,
  state?: Maybe<ClaimState>,
  type?: Maybe<ClaimType>,
};

export type ClaimEvent = {
   __typename?: 'ClaimEvent',
  date?: Maybe<Scalars['Instant']>,
  text?: Maybe<Scalars['String']>,
};

export type ClaimInformationInput = {
  date?: Maybe<Scalars['LocalDate']>,
  item?: Maybe<Scalars['String']>,
  location?: Maybe<Scalars['String']>,
  policeReport?: Maybe<Scalars['String']>,
  receipt?: Maybe<Scalars['String']>,
  ticket?: Maybe<Scalars['String']>,
};

export type ClaimNote = {
   __typename?: 'ClaimNote',
  date?: Maybe<Scalars['LocalDateTime']>,
  text?: Maybe<Scalars['String']>,
};

export type ClaimNoteInput = {
  text: Scalars['String'],
};

export type ClaimPayment = {
   __typename?: 'ClaimPayment',
  amount?: Maybe<Scalars['MonetaryAmount']>,
  deductible?: Maybe<Scalars['MonetaryAmount']>,
  exGratia?: Maybe<Scalars['Boolean']>,
  id?: Maybe<Scalars['String']>,
  note?: Maybe<Scalars['String']>,
  status?: Maybe<ClaimPaymentStatus>,
  timestamp?: Maybe<Scalars['Instant']>,
  transaction?: Maybe<Transaction>,
  type?: Maybe<ClaimPaymentType>,
};

export type ClaimPaymentInput = {
  amount: Scalars['MonetaryAmount'],
  deductible: Scalars['MonetaryAmount'],
  exGratia: Scalars['Boolean'],
  note: Scalars['String'],
  sanctionListSkipped: Scalars['Boolean'],
  type: ClaimPaymentType,
};

export enum ClaimPaymentStatus {
  Completed = 'COMPLETED',
  Failed = 'FAILED',
  Initiated = 'INITIATED',
  Prepared = 'PREPARED',
  SanctionListHit = 'SANCTION_LIST_HIT'
}

export enum ClaimPaymentType {
  Automatic = 'Automatic',
  Manual = 'Manual'
}

export enum ClaimSource {
  App = 'APP',
  Chat = 'CHAT',
  Email = 'EMAIL',
  Intercom = 'INTERCOM',
  Phone = 'PHONE'
}

export enum ClaimState {
  Closed = 'CLOSED',
  Open = 'OPEN',
  Reopened = 'REOPENED'
}

export type ClaimType = AccidentalDamageClaim | ApplianceClaim | AssaultClaim | BurglaryClaim | ConfirmedFraudClaim | EarthquakeClaim | FireDamageClaim | FloodingClaim | InstallationsClaim | LegalProtectionClaim | LiabilityClaim | LuggageDelayClaim | NotCoveredClaim | SnowPressureClaim | StormDamageClaim | TestClaim | TheftClaim | TravelAccidentClaim | VerminAndPestsClaim | WaterDamageBathroomClaim | WaterDamageClaim | WaterDamageKitchenClaim;

export enum ClaimTypes {
  AccidentalDamageClaim = 'AccidentalDamageClaim',
  ApplianceClaim = 'ApplianceClaim',
  AssaultClaim = 'AssaultClaim',
  BurglaryClaim = 'BurglaryClaim',
  ConfirmedFraudClaim = 'ConfirmedFraudClaim',
  EarthquakeClaim = 'EarthquakeClaim',
  FireDamageClaim = 'FireDamageClaim',
  FloodingClaim = 'FloodingClaim',
  InstallationsClaim = 'InstallationsClaim',
  LegalProtectionClaim = 'LegalProtectionClaim',
  LiabilityClaim = 'LiabilityClaim',
  LuggageDelayClaim = 'LuggageDelayClaim',
  NotCoveredClaim = 'NotCoveredClaim',
  SnowPressureClaim = 'SnowPressureClaim',
  StormDamageClaim = 'StormDamageClaim',
  TestClaim = 'TestClaim',
  TheftClaim = 'TheftClaim',
  TravelAccidentClaim = 'TravelAccidentClaim',
  VerminAndPestsClaim = 'VerminAndPestsClaim',
  WaterDamageBathroomClaim = 'WaterDamageBathroomClaim',
  WaterDamageClaim = 'WaterDamageClaim',
  WaterDamageKitchenClaim = 'WaterDamageKitchenClaim'
}

export type ConfirmedFraudClaim = {
   __typename?: 'ConfirmedFraudClaim',
  date?: Maybe<Scalars['LocalDate']>,
};

export type Debt = {
   __typename?: 'Debt',
  checkedAt?: Maybe<Scalars['Instant']>,
  debtDate?: Maybe<Scalars['LocalDate']>,
  fromDateTime?: Maybe<Scalars['LocalDateTime']>,
  numberPrivateDebts?: Maybe<Scalars['Int']>,
  numberPublicDebts?: Maybe<Scalars['Int']>,
  paymentDefaults?: Maybe<Array<Maybe<PaymentDefault>>>,
  totalAmountDebt?: Maybe<Scalars['MonetaryAmount']>,
  totalAmountPrivateDebt?: Maybe<Scalars['MonetaryAmount']>,
  totalAmountPublicDebt?: Maybe<Scalars['MonetaryAmount']>,
};

export type DirectDebitStatus = {
   __typename?: 'DirectDebitStatus',
  activated?: Maybe<Scalars['Boolean']>,
};

export type EarthquakeClaim = {
   __typename?: 'EarthquakeClaim',
  date?: Maybe<Scalars['LocalDate']>,
};

export type ExtraBuilding = {
   __typename?: 'ExtraBuilding',
  area: Scalars['Int'],
  hasWaterConnected: Scalars['Boolean'],
  type: ExtraBuildingType,
};

export type ExtraBuildingInput = {
  area: Scalars['Int'],
  displayName?: Maybe<Scalars['String']>,
  hasWaterConnected: Scalars['Boolean'],
  type: Scalars['String'],
};

export enum ExtraBuildingType {
  Attefall = 'ATTEFALL',
  Barn = 'BARN',
  Boathouse = 'BOATHOUSE',
  Carport = 'CARPORT',
  Friggebod = 'FRIGGEBOD',
  Garage = 'GARAGE',
  Gazebo = 'GAZEBO',
  Greenhouse = 'GREENHOUSE',
  Guesthouse = 'GUESTHOUSE',
  Other = 'OTHER',
  Outhouse = 'OUTHOUSE',
  Sauna = 'SAUNA',
  Shed = 'SHED',
  Storehouse = 'STOREHOUSE'
}

export type FileUpload = {
   __typename?: 'FileUpload',
  fileUploadUrl?: Maybe<Scalars['URL']>,
  memberId?: Maybe<Scalars['ID']>,
  mimeType?: Maybe<Scalars['String']>,
  timestamp?: Maybe<Scalars['Instant']>,
};

export type Filter = {
  name: Scalars['String'],
  value: Scalars['String'],
};

export type FilterOutput = {
   __typename?: 'FilterOutput',
  name: Scalars['String'],
  value: Scalars['String'],
};

export type FilterSuggestion = {
   __typename?: 'FilterSuggestion',
  items: Array<Scalars['String']>,
  name: Scalars['String'],
  others: Array<Scalars['String']>,
};

export type FireDamageClaim = {
   __typename?: 'FireDamageClaim',
  date?: Maybe<Scalars['LocalDate']>,
  location?: Maybe<Scalars['String']>,
};

export enum Flag {
  Amber = 'AMBER',
  Green = 'GREEN',
  Red = 'RED'
}

export type FloodingClaim = {
   __typename?: 'FloodingClaim',
  date?: Maybe<Scalars['LocalDate']>,
};

export type HouseQuoteData = IQuoteData & {
   __typename?: 'HouseQuoteData',
  ancillaryArea?: Maybe<Scalars['Int']>,
  city?: Maybe<Scalars['String']>,
  extraBuildings: Array<ExtraBuilding>,
  firstName?: Maybe<Scalars['String']>,
  householdSize?: Maybe<Scalars['Int']>,
  id: Scalars['ID'],
  isSubleted?: Maybe<Scalars['Boolean']>,
  lastName?: Maybe<Scalars['String']>,
  livingSpace?: Maybe<Scalars['Int']>,
  numberOfBathrooms?: Maybe<Scalars['Int']>,
  ssn?: Maybe<Scalars['String']>,
  street?: Maybe<Scalars['String']>,
  yearOfConstruction?: Maybe<Scalars['Int']>,
  zipCode?: Maybe<Scalars['String']>,
};

export type HouseQuoteDataInput = {
  ancillaryArea?: Maybe<Scalars['Int']>,
  city?: Maybe<Scalars['String']>,
  extraBuildings: Array<ExtraBuildingInput>,
  firstName?: Maybe<Scalars['String']>,
  householdSize?: Maybe<Scalars['Int']>,
  isSubleted?: Maybe<Scalars['Boolean']>,
  lastName?: Maybe<Scalars['String']>,
  livingSpace?: Maybe<Scalars['Int']>,
  numberOfBathrooms?: Maybe<Scalars['Int']>,
  ssn?: Maybe<Scalars['String']>,
  street?: Maybe<Scalars['String']>,
  yearOfConstruction?: Maybe<Scalars['Int']>,
  zipCode?: Maybe<Scalars['String']>,
};

export type HouseQuoteInput = {
  ancillaryArea?: Maybe<Scalars['Int']>,
  city?: Maybe<Scalars['String']>,
  extraBuildings?: Maybe<Array<ExtraBuildingInput>>,
  householdSize?: Maybe<Scalars['Int']>,
  isSubleted?: Maybe<Scalars['Boolean']>,
  livingSpace?: Maybe<Scalars['Int']>,
  numberOfBathrooms?: Maybe<Scalars['Int']>,
  street?: Maybe<Scalars['String']>,
  yearOfConstruction?: Maybe<Scalars['Int']>,
  zipCode?: Maybe<Scalars['String']>,
};

export type InstallationsClaim = {
   __typename?: 'InstallationsClaim',
  date?: Maybe<Scalars['LocalDate']>,
  item?: Maybe<Scalars['String']>,
  location?: Maybe<Scalars['String']>,
};


export type InventoryItem = {
   __typename?: 'InventoryItem',
  categoryId: Scalars['String'],
  categoryName: Scalars['String'],
  claimId: Scalars['String'],
  filters?: Maybe<Array<Maybe<FilterOutput>>>,
  inventoryItemId: Scalars['ID'],
  itemId?: Maybe<Scalars['String']>,
  itemName: Scalars['String'],
  lowerRange?: Maybe<Scalars['Float']>,
  source: Scalars['String'],
  upperRange?: Maybe<Scalars['Float']>,
  value: Scalars['Float'],
};

export type InventoryItemInput = {
  categoryId: Scalars['String'],
  categoryName: Scalars['String'],
  claimId: Scalars['String'],
  filters?: Maybe<Array<Maybe<Filter>>>,
  inventoryItemId?: Maybe<Scalars['String']>,
  itemId?: Maybe<Scalars['String']>,
  itemName: Scalars['String'],
  lowerRange?: Maybe<Scalars['Float']>,
  source: Scalars['String'],
  upperRange?: Maybe<Scalars['Float']>,
  value: Scalars['Float'],
};

export type IQuoteData = {
  city?: Maybe<Scalars['String']>,
  firstName?: Maybe<Scalars['String']>,
  householdSize?: Maybe<Scalars['Int']>,
  id: Scalars['ID'],
  lastName?: Maybe<Scalars['String']>,
  livingSpace?: Maybe<Scalars['Int']>,
  ssn?: Maybe<Scalars['String']>,
  street?: Maybe<Scalars['String']>,
  zipCode?: Maybe<Scalars['String']>,
};

export type Item = {
   __typename?: 'Item',
  category: Scalars['String'],
  id: Scalars['String'],
  name: Scalars['String'],
};

export type ItemSearch = {
   __typename?: 'ItemSearch',
  products: Array<Item>,
  suggestions: Array<FilterSuggestion>,
};

export type LegalProtectionClaim = {
   __typename?: 'LegalProtectionClaim',
  date?: Maybe<Scalars['LocalDate']>,
};

export type LiabilityClaim = {
   __typename?: 'LiabilityClaim',
  date?: Maybe<Scalars['LocalDate']>,
  location?: Maybe<Scalars['String']>,
};




export type LuggageDelayClaim = {
   __typename?: 'LuggageDelayClaim',
  date?: Maybe<Scalars['LocalDate']>,
  location?: Maybe<Scalars['String']>,
  ticket?: Maybe<Scalars['String']>,
};

export type Member = {
   __typename?: 'Member',
  account?: Maybe<Account>,
  address?: Maybe<Scalars['String']>,
  city?: Maybe<Scalars['String']>,
  directDebitStatus?: Maybe<DirectDebitStatus>,
  fileUploads: Array<FileUpload>,
  firstName?: Maybe<Scalars['String']>,
  fraudulentStatus?: Maybe<Scalars['String']>,
  fraudulentStatusDescription?: Maybe<Scalars['String']>,
  lastName?: Maybe<Scalars['String']>,
  memberId: Scalars['ID'],
  monthlySubscription?: Maybe<MonthlySubscription>,
  numberFailedCharges?: Maybe<NumberFailedCharges>,
  person?: Maybe<Person>,
  personalNumber?: Maybe<Scalars['String']>,
  postalNumber?: Maybe<Scalars['String']>,
  quotes: Array<Quote>,
  sanctionStatus?: Maybe<SanctionStatus>,
  signedOn?: Maybe<Scalars['Instant']>,
  transactions?: Maybe<Array<Maybe<Transaction>>>,
};


export type MemberMonthlySubscriptionArgs = {
  month: Scalars['YearMonth']
};

export type MemberChargeApproval = {
  amount: Scalars['MonetaryAmount'],
  memberId: Scalars['ID'],
};


export type MonthlySubscription = {
   __typename?: 'MonthlySubscription',
  amount?: Maybe<Scalars['MonetaryAmount']>,
  member?: Maybe<Member>,
};

export type MutationType = {
   __typename?: 'MutationType',
  activateQuote: Quote,
  addAccountEntryToMember: Member,
  addClaimNote?: Maybe<Claim>,
  addInventoryItem?: Maybe<Scalars['Boolean']>,
  approveMemberCharge?: Maybe<Scalars['Boolean']>,
  assignTicketToTeamMember?: Maybe<Scalars['ID']>,
  autoLabelQuestion?: Maybe<AutoLabel>,
  backfillSubscriptions: Member,
  changeTicketDescription?: Maybe<Scalars['ID']>,
  changeTicketPriority?: Maybe<Scalars['ID']>,
  changeTicketReminder?: Maybe<Scalars['ID']>,
  changeTicketStatus?: Maybe<Scalars['ID']>,
  chargeMember?: Maybe<Member>,
  createClaim?: Maybe<Scalars['ID']>,
  createClaimPayment?: Maybe<Claim>,
  /** Creates a quote from a product and returns the quote id */
  createQuoteFromProduct: Quote,
  createTicket?: Maybe<Scalars['ID']>,
  questionIsDone?: Maybe<Scalars['Boolean']>,
  removeInventoryItem?: Maybe<Scalars['Boolean']>,
  setClaimInformation?: Maybe<Claim>,
  setClaimType?: Maybe<Claim>,
  setCoveringEmployee?: Maybe<Claim>,
  updateClaimState?: Maybe<Claim>,
  updateQuote: Quote,
  updateReserve?: Maybe<Claim>,
  whitelistMember?: Maybe<Scalars['Boolean']>,
};


export type MutationTypeActivateQuoteArgs = {
  activationDate: Scalars['LocalDate'],
  id: Scalars['ID'],
  terminationDate?: Maybe<Scalars['LocalDate']>
};


export type MutationTypeAddAccountEntryToMemberArgs = {
  accountEntry: AccountEntryInput,
  memberId: Scalars['ID']
};


export type MutationTypeAddClaimNoteArgs = {
  id: Scalars['ID'],
  note: ClaimNoteInput
};


export type MutationTypeAddInventoryItemArgs = {
  item: InventoryItemInput
};


export type MutationTypeApproveMemberChargeArgs = {
  approvals: Array<MemberChargeApproval>
};


export type MutationTypeAssignTicketToTeamMemberArgs = {
  teamMemberId: Scalars['ID'],
  ticketId: Scalars['ID']
};


export type MutationTypeAutoLabelQuestionArgs = {
  label: Scalars['String'],
  memberId?: Maybe<Scalars['String']>,
  messageIds?: Maybe<Array<Scalars['String']>>,
  question: Scalars['String']
};


export type MutationTypeBackfillSubscriptionsArgs = {
  memberId: Scalars['ID']
};


export type MutationTypeChangeTicketDescriptionArgs = {
  newDescription?: Maybe<Scalars['String']>,
  ticketId: Scalars['ID']
};


export type MutationTypeChangeTicketPriorityArgs = {
  newPriority?: Maybe<Scalars['Float']>,
  ticketId: Scalars['ID']
};


export type MutationTypeChangeTicketReminderArgs = {
  newReminder?: Maybe<RemindNotification>,
  ticketId: Scalars['ID']
};


export type MutationTypeChangeTicketStatusArgs = {
  newStatus?: Maybe<TicketStatus>,
  ticketId: Scalars['ID']
};


export type MutationTypeChargeMemberArgs = {
  amount: Scalars['MonetaryAmount'],
  id: Scalars['ID']
};


export type MutationTypeCreateClaimArgs = {
  date: Scalars['LocalDateTime'],
  memberId: Scalars['ID'],
  source: ClaimSource
};


export type MutationTypeCreateClaimPaymentArgs = {
  id: Scalars['ID'],
  payment: ClaimPaymentInput
};


export type MutationTypeCreateQuoteFromProductArgs = {
  memberId: Scalars['ID'],
  quoteData: QuoteFromProductInput
};


export type MutationTypeCreateTicketArgs = {
  ticket?: Maybe<TicketInput>
};


export type MutationTypeQuestionIsDoneArgs = {
  memberId: Scalars['ID']
};


export type MutationTypeRemoveInventoryItemArgs = {
  inventoryItemId: Scalars['ID']
};


export type MutationTypeSetClaimInformationArgs = {
  id: Scalars['ID'],
  information: ClaimInformationInput
};


export type MutationTypeSetClaimTypeArgs = {
  id: Scalars['ID'],
  type: ClaimTypes
};


export type MutationTypeSetCoveringEmployeeArgs = {
  coveringEmployee: Scalars['Boolean'],
  id: Scalars['ID']
};


export type MutationTypeUpdateClaimStateArgs = {
  id: Scalars['ID'],
  state: ClaimState
};


export type MutationTypeUpdateQuoteArgs = {
  quoteData: QuoteInput,
  quoteId: Scalars['ID']
};


export type MutationTypeUpdateReserveArgs = {
  amount: Scalars['MonetaryAmount'],
  id: Scalars['ID']
};


export type MutationTypeWhitelistMemberArgs = {
  memberId: Scalars['ID']
};

export type NotCoveredClaim = {
   __typename?: 'NotCoveredClaim',
  date?: Maybe<Scalars['LocalDate']>,
};

export type NumberFailedCharges = {
   __typename?: 'NumberFailedCharges',
  lastFailedChargeAt?: Maybe<Scalars['Instant']>,
  numberFailedCharges: Scalars['Int'],
};

export type Payload = {
  category: Scalars['String'],
  filters: Array<Filter>,
  query: Scalars['String'],
};

export type PaymentDefault = {
   __typename?: 'PaymentDefault',
  amount?: Maybe<Scalars['MonetaryAmount']>,
  caseId?: Maybe<Scalars['String']>,
  claimant?: Maybe<Scalars['String']>,
  paymentDefaultType?: Maybe<Scalars['String']>,
  paymentDefaultTypeText?: Maybe<Scalars['String']>,
  week?: Maybe<Scalars['Int']>,
  year?: Maybe<Scalars['Int']>,
};

export type Person = {
   __typename?: 'Person',
  debt?: Maybe<Debt>,
  personFlags?: Maybe<Array<Maybe<Flag>>>,
  status?: Maybe<PersonStatus>,
  whitelisted?: Maybe<Whitelisted>,
};

export type PersonStatus = {
   __typename?: 'PersonStatus',
  flag?: Maybe<Flag>,
  whitelisted?: Maybe<Scalars['Boolean']>,
};

export type PricePoint = {
   __typename?: 'PricePoint',
  date: Scalars['String'],
  id: Scalars['String'],
  itemId: Scalars['String'],
  lower: Scalars['Float'],
  mean: Scalars['Float'],
  upper: Scalars['Float'],
};

export type QueryType = {
   __typename?: 'QueryType',
  categories?: Maybe<Array<Category>>,
  claim?: Maybe<Claim>,
  filters: Array<FilterSuggestion>,
  getAnswerSuggestion: Array<Suggestion>,
  getFullTicketHistory?: Maybe<TicketHistory>,
  inventory: Array<Maybe<InventoryItem>>,
  inventoryItemFilters?: Maybe<Array<Maybe<FilterOutput>>>,
  items: ItemSearch,
  me?: Maybe<Scalars['String']>,
  member?: Maybe<Member>,
  monthlyPayments?: Maybe<Array<Maybe<MonthlySubscription>>>,
  paymentSchedule?: Maybe<Array<Maybe<SchedulerState>>>,
  prices: Array<PricePoint>,
  ticket?: Maybe<Ticket>,
  tickets: Array<Ticket>,
};


export type QueryTypeClaimArgs = {
  id: Scalars['ID']
};


export type QueryTypeFiltersArgs = {
  categoryId: Scalars['String']
};


export type QueryTypeGetAnswerSuggestionArgs = {
  question?: Maybe<Scalars['String']>
};


export type QueryTypeGetFullTicketHistoryArgs = {
  id: Scalars['ID']
};


export type QueryTypeInventoryArgs = {
  claimId: Scalars['ID']
};


export type QueryTypeInventoryItemFiltersArgs = {
  inventoryItemId: Scalars['String']
};


export type QueryTypeItemsArgs = {
  payload: Payload
};


export type QueryTypeMemberArgs = {
  id: Scalars['ID']
};


export type QueryTypeMonthlyPaymentsArgs = {
  month: Scalars['YearMonth']
};


export type QueryTypePaymentScheduleArgs = {
  status: ChargeStatus
};


export type QueryTypePricesArgs = {
  date: Scalars['String'],
  ids: Array<Scalars['String']>
};


export type QueryTypeTicketArgs = {
  id: Scalars['ID']
};


export type QueryTypeTicketsArgs = {
  resolved?: Maybe<Scalars['Boolean']>
};

export type Quote = {
   __typename?: 'Quote',
  attributedTo?: Maybe<Scalars['String']>,
  createdAt?: Maybe<Scalars['Instant']>,
  currentInsurer?: Maybe<Scalars['String']>,
  data?: Maybe<QuoteData>,
  id: Scalars['ID'],
  initiatedFrom?: Maybe<Scalars['String']>,
  isComplete?: Maybe<Scalars['Boolean']>,
  memberId?: Maybe<Scalars['ID']>,
  originatingProductId?: Maybe<Scalars['ID']>,
  price?: Maybe<Scalars['Float']>,
  productType?: Maybe<QuoteProductType>,
  signedProductId?: Maybe<Scalars['ID']>,
  startDate?: Maybe<Scalars['String']>,
  state?: Maybe<QuoteState>,
  validity?: Maybe<Scalars['Int']>,
};

export type QuoteData = ApartmentQuoteData | HouseQuoteData;

export type QuoteFromProductInput = {
  currentInsurer?: Maybe<Scalars['String']>,
  incompleteApartmentQuoteData?: Maybe<ApartmentQuoteDataInput>,
  incompleteHouseQuoteData?: Maybe<HouseQuoteDataInput>,
  originatingProductId?: Maybe<Scalars['ID']>,
};

export type QuoteInput = {
  apartmentData?: Maybe<ApartmentQuoteInput>,
  currentInsurer?: Maybe<Scalars['String']>,
  houseData?: Maybe<HouseQuoteInput>,
  originatingProductId?: Maybe<Scalars['ID']>,
  productType?: Maybe<QuoteProductType>,
};

export enum QuoteProductType {
  Apartment = 'APARTMENT',
  House = 'HOUSE',
  Object = 'OBJECT'
}

export enum QuoteState {
  Expired = 'EXPIRED',
  Incomplete = 'INCOMPLETE',
  Quoted = 'QUOTED',
  Signed = 'SIGNED'
}

export type RemindNotification = {
  date?: Maybe<Scalars['LocalDate']>,
  message?: Maybe<Scalars['String']>,
  time?: Maybe<Scalars['LocalTime']>,
};

export enum SanctionStatus {
  FullHit = 'FullHit',
  NoHit = 'NoHit',
  PartialHit = 'PartialHit',
  Undetermined = 'Undetermined'
}

export type SchedulerState = {
   __typename?: 'SchedulerState',
  amount?: Maybe<Scalars['MonetaryAmount']>,
  changedAt: Scalars['Instant'],
  changedBy: Scalars['String'],
  id: Scalars['ID'],
  member?: Maybe<Member>,
  status: ChargeStatus,
  transactionId?: Maybe<Scalars['ID']>,
};

export type SnowPressureClaim = {
   __typename?: 'SnowPressureClaim',
  date?: Maybe<Scalars['LocalDate']>,
};

export type StormDamageClaim = {
   __typename?: 'StormDamageClaim',
  date?: Maybe<Scalars['LocalDate']>,
};

export type Suggestion = {
   __typename?: 'Suggestion',
  allReplies: Array<AllRepliesEntry>,
  confidence: Scalars['Float'],
  intent: Scalars['String'],
  reply: Scalars['String'],
  text: Scalars['String'],
};

export type TestClaim = {
   __typename?: 'TestClaim',
  date?: Maybe<Scalars['LocalDate']>,
};

export type TheftClaim = {
   __typename?: 'TheftClaim',
  date?: Maybe<Scalars['LocalDate']>,
  item?: Maybe<Scalars['String']>,
  location?: Maybe<Scalars['String']>,
  policeReport?: Maybe<Scalars['String']>,
  receipt?: Maybe<Scalars['String']>,
};

export type Ticket = {
   __typename?: 'Ticket',
  assignedTo?: Maybe<Scalars['String']>,
  createdAt?: Maybe<Scalars['Instant']>,
  createdBy?: Maybe<Scalars['String']>,
  description?: Maybe<Scalars['String']>,
  id?: Maybe<Scalars['ID']>,
  memberId?: Maybe<Scalars['String']>,
  priority?: Maybe<Scalars['Float']>,
  referenceId?: Maybe<Scalars['String']>,
  remindMessage?: Maybe<Scalars['String']>,
  remindNotificationDate?: Maybe<Scalars['LocalDate']>,
  remindNotificationTime?: Maybe<Scalars['LocalTime']>,
  status?: Maybe<TicketStatus>,
  type?: Maybe<TicketType>,
};

export enum TicketChangeType {
  ChangedAssignedTo = 'CHANGED_ASSIGNED_TO',
  ChangedDescription = 'CHANGED_DESCRIPTION',
  ChangedPriority = 'CHANGED_PRIORITY',
  ChangedReminder = 'CHANGED_REMINDER',
  ChangedStatus = 'CHANGED_STATUS',
  TicketCreated = 'TICKET_CREATED'
}

export type TicketHistory = {
   __typename?: 'TicketHistory',
  createdAt?: Maybe<Scalars['Instant']>,
  createdBy?: Maybe<Scalars['String']>,
  id?: Maybe<Scalars['ID']>,
  revisions?: Maybe<Array<Maybe<TicketRevision>>>,
  type?: Maybe<TicketType>,
};

export type TicketInput = {
  assignedTo?: Maybe<Scalars['String']>,
  description?: Maybe<Scalars['String']>,
  priority?: Maybe<Scalars['Float']>,
  remindMessage?: Maybe<Scalars['String']>,
  remindNotificationDate?: Maybe<Scalars['LocalDate']>,
  remindNotificationTime?: Maybe<Scalars['LocalTime']>,
  status?: Maybe<TicketStatus>,
  type?: Maybe<TicketType>,
};

export type TicketRevision = {
   __typename?: 'TicketRevision',
  assignedTo?: Maybe<Scalars['String']>,
  changeType?: Maybe<TicketChangeType>,
  changedAt?: Maybe<Scalars['Instant']>,
  changedBy?: Maybe<Scalars['String']>,
  description?: Maybe<Scalars['String']>,
  manualPriority?: Maybe<Scalars['Float']>,
  remindDate?: Maybe<Scalars['LocalDate']>,
  remindMessage?: Maybe<Scalars['String']>,
  remindTime?: Maybe<Scalars['LocalTime']>,
  status?: Maybe<TicketStatus>,
};

export enum TicketStatus {
  OnHold = 'ON_HOLD',
  Resolved = 'RESOLVED',
  Waiting = 'WAITING',
  WorkingOn = 'WORKING_ON'
}

export enum TicketType {
  CallMe = 'CALL_ME',
  Claim = 'CLAIM',
  Message = 'MESSAGE',
  Other = 'OTHER',
  Remind = 'REMIND'
}

export type Transaction = {
   __typename?: 'Transaction',
  amount?: Maybe<Scalars['MonetaryAmount']>,
  id?: Maybe<Scalars['ID']>,
  status?: Maybe<Scalars['String']>,
  timestamp?: Maybe<Scalars['Instant']>,
  type?: Maybe<Scalars['String']>,
};

export type TravelAccidentClaim = {
   __typename?: 'TravelAccidentClaim',
  date?: Maybe<Scalars['LocalDate']>,
  location?: Maybe<Scalars['String']>,
  policeReport?: Maybe<Scalars['String']>,
  receipt?: Maybe<Scalars['String']>,
};


export type VerminAndPestsClaim = {
   __typename?: 'VerminAndPestsClaim',
  date?: Maybe<Scalars['LocalDate']>,
};

export type WaterDamageBathroomClaim = {
   __typename?: 'WaterDamageBathroomClaim',
  date?: Maybe<Scalars['LocalDate']>,
};

export type WaterDamageClaim = {
   __typename?: 'WaterDamageClaim',
  date?: Maybe<Scalars['LocalDate']>,
};

export type WaterDamageKitchenClaim = {
   __typename?: 'WaterDamageKitchenClaim',
  date?: Maybe<Scalars['LocalDate']>,
};

export type Whitelisted = {
   __typename?: 'Whitelisted',
  whitelistedAt?: Maybe<Scalars['Instant']>,
  whitelistedBy?: Maybe<Scalars['String']>,
};





      export interface IntrospectionResultData {
        __schema: {
          types: {
            kind: string;
            name: string;
            possibleTypes: {
              name: string;
            }[];
          }[];
        };
      }
      const result: IntrospectionResultData = {
  "__schema": {
    "types": [
      {
        "kind": "UNION",
        "name": "QuoteData",
        "possibleTypes": [
          {
            "name": "ApartmentQuoteData"
          },
          {
            "name": "HouseQuoteData"
          }
        ]
      },
      {
        "kind": "INTERFACE",
        "name": "IQuoteData",
        "possibleTypes": [
          {
            "name": "ApartmentQuoteData"
          },
          {
            "name": "HouseQuoteData"
          }
        ]
      },
      {
        "kind": "UNION",
        "name": "ClaimType",
        "possibleTypes": [
          {
            "name": "AccidentalDamageClaim"
          },
          {
            "name": "ApplianceClaim"
          },
          {
            "name": "AssaultClaim"
          },
          {
            "name": "BurglaryClaim"
          },
          {
            "name": "ConfirmedFraudClaim"
          },
          {
            "name": "EarthquakeClaim"
          },
          {
            "name": "FireDamageClaim"
          },
          {
            "name": "FloodingClaim"
          },
          {
            "name": "InstallationsClaim"
          },
          {
            "name": "LegalProtectionClaim"
          },
          {
            "name": "LiabilityClaim"
          },
          {
            "name": "LuggageDelayClaim"
          },
          {
            "name": "NotCoveredClaim"
          },
          {
            "name": "SnowPressureClaim"
          },
          {
            "name": "StormDamageClaim"
          },
          {
            "name": "TestClaim"
          },
          {
            "name": "TheftClaim"
          },
          {
            "name": "TravelAccidentClaim"
          },
          {
            "name": "VerminAndPestsClaim"
          },
          {
            "name": "WaterDamageBathroomClaim"
          },
          {
            "name": "WaterDamageClaim"
          },
          {
            "name": "WaterDamageKitchenClaim"
          }
        ]
      }
    ]
  }
};
      export default result;
    