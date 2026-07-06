import type { CaseDetailData } from '@/types/case-detail-data';

const PAY = '2621711711';

export const CASE_DETAIL_LAYOUT_MOCK: CaseDetailData = {
  officialCaseNo: 'A26412496',
  bureauLines: ['თბილისის სააღსრულებო ბიურო', 'სამცხე-ჯავახეთის სააღსრულებო ბიურო'],
  categoryRight: '09/1 სისხლის სამართლის ჯარიმა ან/და გირაოს პირობების დარღვევა',
  categoryPrefix: '09/1',
  creditors: [
    {
      party: {
        titleLine: 'სახელმწიფო ბიუჯეტი (0)',
        addressLines: [],
        paymentIdentifier: PAY,
      },
      representative: null,
    },
  ],
  debtors: [
    {
      titleLine: 'ხვიჩა შარიძე (05001012696)',
      addressLines: [
        'ასპინძა ს. თოკი — იურ. მისამართი თბილისი, გლდანი მე-6 მ/რ კორპ 20, ბ 18',
      ],
      paymentIdentifier: PAY,
    },
  ],
  writRows: [{ court: 'თბილისის საქალაქო სასამართლო', orderNo: '1/3286-25', orderDate: '31/03/2026' }],
  claimsSummary: 'დაეკისროს ჯარიმის, 3000 ლარი ბიუჯეტის სასარგებლოდ გადახდევინება.',
  claimRows: [
    { amount: '3000 GEL', creditorsCell: 'სახელმწიფო ბიუჯეტი', debtorsCell: 'ხვიჩა შარიძე (05001012696)' },
  ],
  proceedings: [
    {
      codeLine: 'A16037552-031',
      title: 'სააუქციონო მომსახურების დასრულება',
      dateTime: '19/09/2018 16:21',
      documents: [],
    },
    {
      codeLine: 'A16037552-025',
      title: 'ცნობა სააღსრულებო საქმისწარმოების დასრულების თაობაზე',
      dateTime: '21/08/2014 15:59',
      documents: [
        {
          title: 'ცნობა სააღსრულებო წარმოების დამთავრების შესახებ',
          actor: 'ილია მანჯგალაძე',
          href: 'https://example.com/doc-mock',
        },
      ],
    },
  ],
  fundsSummaryLines: ['ზოგადი ინფორმაცია გადახდილი/გადასახდელი თანხების შესახებ (მარქაფი).'],
  fundsCreditor: {
    title: 'კრედიტორი',
    bodyLines: ['გადახდილი / გადასახდელი / მიმდინარე დავალიანება — API-დან.'],
  },
  fundsDebtor: {
    title: 'მოვალე',
    bodyLines: ['გადახდილი / გადასახდელი / მიმდინარე დავალიანება — API-დან.'],
  },
  // Auction lots are loaded live (useAuctionLots); kept empty in the mock.
  auctionLots: [],
  installmentNote: 'განწილვადება — სერვისიდან (მარქაფი).',
  contact: {
    bureau: 'თბილისის სააღსრულებო ბიურო',
    address: 'საქართველო, თბილისი 0131, დ. აღმაშენებლის ხეივანი N99',
    phone: '+ (995 32) 274 96 49',
    email: 'info@nbe.gov.ge',
    fax: '+ (995 32) 274 96 49',
    website: 'www.nbe.gov.ge',
  },
};

export function getCaseDetailLayoutMock(_id: string): CaseDetailData {
  return CASE_DETAIL_LAYOUT_MOCK;
}
