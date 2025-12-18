import { callToAction } from "./navigation";

// FAQ item types
export interface FAQItem {
  id: string;
  question: string;
  answer: string;
}

// Global FAQ data
export const faqItems: FAQItem[] = [
  {
    id: "life-legacy-planning",
    question: "What is Life & Legacy Planning?",
    answer: `Life & Legacy Planning is more than estate planning — it's peace of mind for you and lasting connection for your family. At Small Planet Law, we provide a holistic planning process that:

- **Keeps families out of court and out of conflict**
- **Protects children and equips fiduciaries**
- **Preserves stories, values, and life lessons**
- **Keeps plans current** with free reviews every three years

It's not just documents — it's a living plan that grows with you. One of the most cherished features is our **Legacy Interview**, where your memories and values are recorded for future generations. That's why we call it *Life & Legacy Planning*.`,
  },
  {
    id: "legal-documents",
    question: "What Legal Documents Are Included in a Life & Legacy Plan?",
    answer: `Every Life & Legacy Plan is customized, but most include:

- **Core Documents:** Wills, Trusts, Durable Powers of Attorney
- **Health Protection:** Healthcare Directives (Living Will), Healthcare Agents, HIPAA Authorizations
- **Kids Protection Plan:** Short and Long-term Guardians, Kids' Health Care Agents, Important Medical Information, and Instructions to Guardians and Caregivers
- **Extras Clients Love:** Family Wealth Inventory, Fiduciary Letters for all roles, Full Color Estate Plan Diagram, Trust ID Cards, Legacy Interviews, Ongoing Support & Regular Plan Updates`,
  },
  {
    id: "legacy-interview",
    question: "What is a Legacy Interview?",
    answer: `Given the choice to pass on either your "things" or your values, memories, life lessons, and dreams for the future of your loved ones and our living world — you would likely choose the latter. Estate planning with Small Planet Law covers it all.

Our Legacy Interviews preserve your most precious assets so that your loved ones can enjoy them for generations to come. After your documents are signed, we conduct and record your Legacy Interview using the questions you select from our customized list designed to make it easy, meaningful, and rewarding. We also record another Legacy Interview during each free review of your plan every three years, so you can keep adding to and enriching the intangible assets of your legacy.

Our Legacy Interviews are often the most cherished part of the whole process — families tell us these recordings become priceless gifts.`,
  },
  {
    id: "who-we-serve",
    question: "Who does Small Planet Law serve?",
    answer: `We serve individuals and families across Colorado who want security, clarity, and connection. Our clients include:

- **Parents raising minor children** — safeguarding kids with special protections
- **Families of all shapes and sizes** — single parents, multi-parent households, blended families
- **Committed partners** — with or without children, ensuring intentions are honored
- **Families of children with special needs** — guaranteeing lifelong care while preserving benefits
- **Anyone planning their legacy** — ensuring wishes are respected and trusted individuals are prepared`,
  },
  {
    id: "planning-process",
    question: "What does the planning process look like?",
    answer: `**Welcome!** We start with a 15-minute Discovery Call to learn where you're coming from and how we can meet your estate planning needs. During the Discovery Call, we can schedule your Life and Legacy Planning Session. [Book a Discovery Call Now!](${callToAction.href})

**The Prep Work:** The Life and Legacy Planning Session is a 2-hour in-depth working session focused entirely on you and your family. To make the most of that time together, we'll send you information to prepare ahead of time to identify your top goals and priorities, and begin the process of getting your legal and financial life in order.

**The Life & Legacy Planning Session:** During the Planning Session, we'll explore together what would happen to your loved ones and assets as things currently stand should something happen to you. If there is anything that you would like to happen differently, we'll discuss how to make those changes, and identify what planning options are the best fit for you. Then we'll design your estate plan!

**The Signing Ceremony:** About 4 weeks after design, we'll meet to sign all your documents and, for trust-based plans, we'll begin the process of transferring your assets into the trust.

**Plan Delivery & Legacy Interview:** About 4 weeks after that, we'll meet again for your Legacy Interview and you'll receive your complete estate plan and owner's manual, including a full color diagram of your plan.

**Regular Review:** Every three years, we'll get together again for a free plan review and another Legacy Interview to ensure your plan stays current and your intangible assets grow along with you and your family.`,
  },
  {
    id: "flat-fees",
    question: "What are the Flat Fees?",
    answer: `No hourly billing. No surprise invoices. Just one flat fee you choose upfront — so you can focus on your family, not your lawyer's clock. Our clients love our flat fee system because it's transparent, empowering, and encourages open communication.

- **You select your fee** based on the plan level and protections you want.
- **50% at design, 50% at signing** — with flexible payment options if needed.
- **Unlimited communication included** — call or email without worrying about extra charges.

This approach empowers you to make confident choices and ensures you get the right plan for your family. Every level provides security, clarity, and peace of mind.`,
  },
  {
    id: "green-estate-planning",
    question: "What is \"green\" estate planning?",
    answer: `As an eco-conscious Colorado small business, sustainability is at the heart of everything we do at Small Planet Law, from our net zero-carbon practices to the partners we recommend. And, to the extent you choose, Small Planet Law can weave sustainability and green causes into your plan itself. With our unique expertise and connections across the Colorado environmental movement, you can create an estate plan that honors both your loved ones and the Earth.

- **Sustainable Farewells** — eco-conscious burial and memorial options
- **Legacy-Driven Giving** — incorporate the causes you care about into your plan
- **Ethical Financial Guidance** — referrals to financial advisors with expertise in ESG (Environmental, Social, and Governance) investing, renewable energy, and climate solutions
- **Giving Back, Together** — With each plan we craft, Small Planet Law makes a donation to the client's choice of our featured environmental nonprofits.`,
  },
];
