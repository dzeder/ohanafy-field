// Day-2 demo fixture for the Yellowhammer Beverage pilot. Replaces real SF data
// when EXPO_PUBLIC_USE_SEED_DATA=true. Day 4 deletes this in favor of live SF sync.
//
// 5 accounts (Birmingham AL retailers — fictional), 10 products (kegs, cases, energy),
// one recent visit and one recent order per account so the UI has things to render.

export interface SeedAccount {
  sfId: string;
  name: string;
  accountType: 'on_premise' | 'off_premise_chain' | 'off_premise_indie' | 'convenience';
  channel: string;
  territoryId: string;
  contactName: string;
  contactTitle: string;
  contactPhone: string;
  addressStreet: string;
  addressCity: string;
  addressState: string;
  latitude: number;
  longitude: number;
  daysSinceLastOrder: number;
  ytdRevenue: number;
  needsAttention: boolean;
}

export interface SeedProduct {
  sfId: string;
  name: string;
  category: 'beer_keg' | 'beer_case' | 'energy' | 'other';
  unit: 'keg' | 'case';
  unitLabel: string;
  pricePerUnit: number;
  supplierId: string;
  skuCode: string;
}

export interface SeedVisit {
  accountSfId: string;
  daysAgo: number;
  durationMinutes: number;
  note: string;
}

export interface SeedOrderLine {
  productSfId: string;
  quantity: number;
}

export interface SeedOrder {
  accountSfId: string;
  daysAgo: number;
  status: 'synced';
  notes?: string;
  lines: SeedOrderLine[];
}

export const SEED_ACCOUNTS: SeedAccount[] = [
  {
    sfId: 'a01_the_rail',
    name: 'The Rail',
    accountType: 'on_premise',
    channel: 'Bar',
    territoryId: 't_birmingham',
    contactName: 'Marcus Lee',
    contactTitle: 'Owner',
    contactPhone: '+12055551001',
    addressStreet: '1140 22nd St S',
    addressCity: 'Birmingham',
    addressState: 'AL',
    latitude: 33.5031,
    longitude: -86.7964,
    daysSinceLastOrder: 32,
    ytdRevenue: 41250,
    needsAttention: true,
  },
  {
    sfId: 'a02_oak_alley',
    name: 'Oak Alley Tavern',
    accountType: 'on_premise',
    channel: 'Bar & Grill',
    territoryId: 't_birmingham',
    contactName: 'Priya Shah',
    contactTitle: 'GM',
    contactPhone: '+12055551002',
    addressStreet: '2300 7th Ave S',
    addressCity: 'Birmingham',
    addressState: 'AL',
    latitude: 33.5089,
    longitude: -86.788,
    daysSinceLastOrder: 8,
    ytdRevenue: 78400,
    needsAttention: false,
  },
  {
    sfId: 'a03_southside_market',
    name: 'Southside Market',
    accountType: 'off_premise_indie',
    channel: 'Bottle Shop',
    territoryId: 't_birmingham',
    contactName: 'Devin Carter',
    contactTitle: 'Buyer',
    contactPhone: '+12055551003',
    addressStreet: '1936 Magnolia Ave S',
    addressCity: 'Birmingham',
    addressState: 'AL',
    latitude: 33.4892,
    longitude: -86.7937,
    daysSinceLastOrder: 14,
    ytdRevenue: 29800,
    needsAttention: false,
  },
  {
    sfId: 'a04_homewood_bottle',
    name: 'Homewood Bottle Co.',
    accountType: 'off_premise_indie',
    channel: 'Bottle Shop',
    territoryId: 't_homewood',
    contactName: 'Shauna Robins',
    contactTitle: 'Owner',
    contactPhone: '+12055551004',
    addressStreet: '2912 18th St S',
    addressCity: 'Homewood',
    addressState: 'AL',
    latitude: 33.4731,
    longitude: -86.8023,
    daysSinceLastOrder: 27,
    ytdRevenue: 33500,
    needsAttention: true,
  },
  {
    sfId: 'a05_quickstop_vestavia',
    name: 'QuickStop Vestavia',
    accountType: 'convenience',
    channel: 'Convenience',
    territoryId: 't_vestavia',
    contactName: 'Rohan Patel',
    contactTitle: 'Manager',
    contactPhone: '+12055551005',
    addressStreet: '700 Montgomery Hwy',
    addressCity: 'Vestavia Hills',
    addressState: 'AL',
    latitude: 33.4451,
    longitude: -86.7856,
    daysSinceLastOrder: 6,
    ytdRevenue: 18200,
    needsAttention: false,
  },
];

export const SEED_PRODUCTS: SeedProduct[] = [
  {
    sfId: 'p01_yh_pale_ale_hb',
    name: 'Yellowhammer Pale Ale',
    category: 'beer_keg',
    unit: 'keg',
    unitLabel: '1/2 bbl',
    pricePerUnit: 178,
    supplierId: 'sup_yellowhammer',
    skuCode: 'YH-PA-HB',
  },
  {
    sfId: 'p02_yh_pale_ale_case',
    name: 'Yellowhammer Pale Ale 12pk',
    category: 'beer_case',
    unit: 'case',
    unitLabel: '24-unit',
    pricePerUnit: 32,
    supplierId: 'sup_yellowhammer',
    skuCode: 'YH-PA-CS',
  },
  {
    sfId: 'p03_yh_belgian_white',
    name: 'Yellowhammer Belgian White',
    category: 'beer_keg',
    unit: 'keg',
    unitLabel: '1/2 bbl',
    pricePerUnit: 184,
    supplierId: 'sup_yellowhammer',
    skuCode: 'YH-BW-HB',
  },
  {
    sfId: 'p04_modelo_keg',
    name: 'Modelo Especial',
    category: 'beer_keg',
    unit: 'keg',
    unitLabel: '1/2 bbl',
    pricePerUnit: 192,
    supplierId: 'sup_modelo',
    skuCode: 'MD-ESP-HB',
  },
  {
    sfId: 'p05_modelo_case',
    name: 'Modelo Especial 12pk',
    category: 'beer_case',
    unit: 'case',
    unitLabel: '24-unit',
    pricePerUnit: 36,
    supplierId: 'sup_modelo',
    skuCode: 'MD-ESP-CS',
  },
  {
    sfId: 'p06_corona_case',
    name: 'Corona Extra 12pk',
    category: 'beer_case',
    unit: 'case',
    unitLabel: '24-unit',
    pricePerUnit: 35,
    supplierId: 'sup_corona',
    skuCode: 'CR-EX-CS',
  },
  {
    sfId: 'p07_redbull_original',
    name: 'Red Bull 8.4oz',
    category: 'energy',
    unit: 'case',
    unitLabel: '24-can',
    pricePerUnit: 48,
    supplierId: 'sup_redbull',
    skuCode: 'RB-OG-CS',
  },
  {
    sfId: 'p08_redbull_sugarfree',
    name: 'Red Bull Sugarfree 8.4oz',
    category: 'energy',
    unit: 'case',
    unitLabel: '24-can',
    pricePerUnit: 48,
    supplierId: 'sup_redbull',
    skuCode: 'RB-SF-CS',
  },
  {
    sfId: 'p09_redbull_total_zero',
    name: 'Red Bull Total Zero 12oz',
    category: 'energy',
    unit: 'case',
    unitLabel: '24-can',
    pricePerUnit: 52,
    supplierId: 'sup_redbull',
    skuCode: 'RB-TZ-CS',
  },
  {
    sfId: 'p10_white_claw_variety',
    name: 'White Claw Variety 12pk',
    category: 'beer_case',
    unit: 'case',
    unitLabel: '24-unit',
    pricePerUnit: 38,
    supplierId: 'sup_whiteclaw',
    skuCode: 'WC-VAR-CS',
  },
];

export const SEED_VISITS: SeedVisit[] = [
  {
    accountSfId: 'a01_the_rail',
    daysAgo: 28,
    durationMinutes: 22,
    note: 'Tap issue on the lager line — Marcus said theyd flush the lines this week.',
  },
  {
    accountSfId: 'a02_oak_alley',
    daysAgo: 6,
    durationMinutes: 18,
    note: 'New summer menu launches Friday. Priya is interested in the Belgian White.',
  },
  {
    accountSfId: 'a03_southside_market',
    daysAgo: 12,
    durationMinutes: 14,
    note: 'Devin wants to try a Red Bull Total Zero endcap for July.',
  },
  {
    accountSfId: 'a04_homewood_bottle',
    daysAgo: 24,
    durationMinutes: 16,
    note: 'Shauna mentioned slow sell-through on the Pale Ale 12pk.',
  },
  {
    accountSfId: 'a05_quickstop_vestavia',
    daysAgo: 5,
    durationMinutes: 10,
    note: 'Cooler reset Wednesday; Rohan keeping Modelo case position.',
  },
];

export const SEED_ORDERS: SeedOrder[] = [
  {
    accountSfId: 'a01_the_rail',
    daysAgo: 32,
    status: 'synced',
    lines: [
      { productSfId: 'p01_yh_pale_ale_hb', quantity: 2 },
      { productSfId: 'p03_yh_belgian_white', quantity: 1 },
    ],
  },
  {
    accountSfId: 'a02_oak_alley',
    daysAgo: 8,
    status: 'synced',
    lines: [
      { productSfId: 'p04_modelo_keg', quantity: 3 },
      { productSfId: 'p07_redbull_original', quantity: 4 },
    ],
  },
  {
    accountSfId: 'a03_southside_market',
    daysAgo: 14,
    status: 'synced',
    lines: [
      { productSfId: 'p06_corona_case', quantity: 6 },
      { productSfId: 'p08_redbull_sugarfree', quantity: 5 },
    ],
  },
  {
    accountSfId: 'a04_homewood_bottle',
    daysAgo: 27,
    status: 'synced',
    lines: [
      { productSfId: 'p02_yh_pale_ale_case', quantity: 4 },
      { productSfId: 'p10_white_claw_variety', quantity: 8 },
    ],
  },
  {
    accountSfId: 'a05_quickstop_vestavia',
    daysAgo: 6,
    status: 'synced',
    lines: [
      { productSfId: 'p05_modelo_case', quantity: 12 },
      { productSfId: 'p07_redbull_original', quantity: 6 },
      { productSfId: 'p09_redbull_total_zero', quantity: 4 },
    ],
  },
];
