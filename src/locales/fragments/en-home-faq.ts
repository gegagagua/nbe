import type { HomeFaqItem } from '@/types/home-tabs';

export const homeFaqItemsEn = [
  {
    question: 'When does compulsory enforcement begin?',
    answer:
      'Compulsory enforcement begins when there is an enforceable document (e.g. a court decision, an enforcement sheet issued by a notary, an order on debt recovery, etc.) and the creditor’s written application.',
  },
  {
    question: 'How is a debtor informed that enforcement proceedings have started?',
    answer:
      'When proceedings begin, the debtor is served a notice of voluntary performance in accordance with the Civil Procedure Code.',
  },
  {
    question: 'What is the deadline for voluntary performance of a claim?',
    answer: 'The deadline for voluntary performance is 7 days from delivery of the notice.',
  },
  {
    question: 'What if the debtor is not served the notice to comply with the decision?',
    answer:
      'If personal service fails, the notice is published publicly and is deemed served on the 7th day after publication under the Civil Procedure Code.',
  },
  {
    question: 'Can parties settle during compulsory enforcement?',
    answer:
      'At any stage of enforcement the parties may settle. The National Bureau of Enforcement has a department for party interests and mediation that assists parties in reaching agreement.',
  },
  {
    question: 'When and for how long can debt repayment be rescheduled at the NBE?',
    answer:
      'For money claims the NBE may reschedule performance for up to 12 months; for state-budget cases on its own initiative, otherwise with the creditor’s consent. Breach of rescheduling terms resumes the case.',
  },
  {
    question: 'When and how is the debtor’s property sold?',
    answer:
      'Within one month of seizure the NBE schedules a public auction. A public notice must be published on www.eauction.ge and/or www.nbe.gov.ge.',
  },
  {
    question: 'What is the limitation period for compulsory enforcement of a decision?',
    answer:
      'For money claims the limitation period is generally 10 years, with specific exceptions (alimony, employment injury, certain state-budget and fine cases where shorter periods apply).',
  },
  {
    question: 'What is the debtors register, when is a person listed, and what restrictions apply?',
    answer:
      'The debtors register is a structured electronic database. A person is listed when enforcement begins against them; registration restricts disposition of property subject to registration under the relevant rules.',
  },
  {
    question: 'What is the fee and turnaround for a certificate from the debtors register?',
    answer: 'The fee is GEL 10; the certificate is issued the same or next business day.',
  },
] as const satisfies readonly HomeFaqItem[];
