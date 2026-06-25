export type CaseDetailCreditorParty = {
  titleLine: string;
  addressLines: string[];
  paymentIdentifier: string;
};

export type CaseDetailCreditorRow = {
  party: CaseDetailCreditorParty;
  representative: CaseDetailCreditorParty | null;
};

export type CaseDetailDebtorRow = {
  titleLine: string;
  addressLines: string[];
  paymentIdentifier: string;
};

export type CaseDetailWritRow = { court: string; orderNo: string; orderDate: string };
export type CaseDetailClaimRow = { amount: string; creditorsCell: string; debtorsCell: string };
export type CaseDetailProceedingDoc = { title: string; actor: string; href: string };
export type CaseDetailProceedingStatus = {
  codeLine: string;
  title: string;
  dateTime: string;
  documents: CaseDetailProceedingDoc[];
  /** Identifiers used to fetch downloadable files for this status. */
  appStatusId?: number;
  appId?: number;
};

/** A downloadable file attached to a proceeding status. */
export type CaseDetailProceedingFile = {
  fileId: number;
  title: string;
  fileName: string;
  mimeType: string;
  uploadedBy: string;
  createdDate: string;
};

// MIA property rows (შსს ქონების სია) are fetched live via useMiaProperties.
export type CaseDetailSearchPropertyRow = {
  nameObject: string;
  plateOrExtra?: string;
  orderRef: string;
  orderAction: string;
  initiator: string;
  initiatorWhen: string;
};

// SSA rows (სოც. სააგენტო) are fetched live via useSsaRequests.
export type CaseDetailSocialRow = {
  /** First + last name ("სახელი გვარი"). */
  name: string;
  /** Personal number ("პ.ნ"). */
  personalId: string;
  addressPhone: string;
  sent: boolean;
  receivedAt: string;
  active: boolean;
  vulnerable: boolean;
};

// Business notifications (სამეწარმეო რეესტრი) are fetched live via useEnregInfos.
export type CaseDetailBusinessNotifyRow = {
  debtor: string;
  initiator: string;
  createdAt: string; // sendDate
  sent: boolean;
  response: string; // answer
  soleProp: boolean;
};

// Registry rows (საჯარო რეესტრი) are fetched live via useRegistrySearch.
export type CaseDetailRegistryInfoRow = {
  person: string;
  sent: boolean;
  sentDate: string;
  found: boolean; // answer !== 0
};

export type CaseDetailRegistryEstateRow = {
  cadCode: string;
  address: string;
  /** Owner identity ("name surname, personal N / org code"); may be a legal entity. */
  ownerName: string;
  status: string;
};

export type CaseDetailRegistrySearch = {
  infos: CaseDetailRegistryInfoRow[];
  estates: CaseDetailRegistryEstateRow[];
};

export type CaseDetailBusinessShareRow = {
  owner: string;
  title: string;
  orgNo: string;
  regDate: string;
  share: string;
  status: string;
};

export type CaseDetailBusinessRegistry = {
  notify: CaseDetailBusinessNotifyRow[];
  shares: CaseDetailBusinessShareRow[];
};

export type CaseDetailAuctionStage = {
  type: string;
  startDate: string;
  endDate: string;
  eaucUrl: string;
};

export type CaseDetailAuctionLot = {
  lotNo: string;
  category: string;
  name: string;
  price: string;
  winDate: string;
  url: string;
  stages: CaseDetailAuctionStage[];
};

export type CaseDetailFundsPartyBlock = { title: string; bodyLines: string[] };

/** One registered-money row in the funds table (per demand / currency). */
export type CaseDetailFundsMoneyRow = {
  name: string;
  /** Total due (სულ გადასახდელი). */
  due: string;
  /** Total paid (სულ გადახდილი). */
  paid: string;
  /** Current debt = due − paid, computed client-side. */
  debt: string;
};

/** Money info for one party (creditor or debtor) on the funds sub-tab. */
export type CaseDetailFundsPartyInfo = {
  partyLines: string[];
  totalDue: string;
  totalPaid: string;
  totalDebt: string;
  rows: CaseDetailFundsMoneyRow[];
};

/** Funds sub-tab data, fetched from the reg-money debtor/creditor endpoints. */
export type CaseDetailFundsInfo = {
  creditor: CaseDetailFundsPartyInfo | null;
  debtor: CaseDetailFundsPartyInfo | null;
};

export type CaseDetailInstallmentPayment = {
  paymentDate: string;
  amountToPay: string;
  amountPayed: string;
  remainedAmount: string;
  status: string;
  confirmedBy: string;
  confirmDate: string;
};

export type CaseDetailInstallment = {
  installmentId: number;
  headerLine: string;
  partyLine: string;
  status: string;
  payments: CaseDetailInstallmentPayment[];
};

export type CaseDetailContactBlock = {
  bureau: string;
  address: string;
  phone: string;
  email: string;
  fax: string;
  website: string;
};

export type CaseDetailData = {
  officialCaseNo: string;
  bureauLines: string[];
  categoryRight: string;
  creditors: CaseDetailCreditorRow[];
  debtors: CaseDetailDebtorRow[];
  writRows: CaseDetailWritRow[];
  claimsSummary: string;
  claimRows: CaseDetailClaimRow[];
  proceedings: CaseDetailProceedingStatus[];
  fundsSummaryLines: string[];
  fundsCreditor: CaseDetailFundsPartyBlock;
  fundsDebtor: CaseDetailFundsPartyBlock;
  auctionLots: CaseDetailAuctionLot[];
  installmentNote: string;
  contact: CaseDetailContactBlock;
};
