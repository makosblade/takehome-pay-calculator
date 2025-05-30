import type { TaxBracket } from '../types';

// 2024 Federal Tax Brackets (accurate as of May 2024)
export const federalTaxBrackets: Record<string, TaxBracket[]> = {
  single: [
    { min: 0, max: 11600, rate: 0.10 },
    { min: 11600, max: 47150, rate: 0.12 },
    { min: 47150, max: 100525, rate: 0.22 },
    { min: 100525, max: 191950, rate: 0.24 },
    { min: 191950, max: 243725, rate: 0.32 },
    { min: 243725, max: 609350, rate: 0.35 },
    { min: 609350, max: null, rate: 0.37 }
  ],
  married: [
    { min: 0, max: 23200, rate: 0.10 },
    { min: 23200, max: 94300, rate: 0.12 },
    { min: 94300, max: 201050, rate: 0.22 },
    { min: 201050, max: 383900, rate: 0.24 },
    { min: 383900, max: 487450, rate: 0.32 },
    { min: 487450, max: 731200, rate: 0.35 },
    { min: 731200, max: null, rate: 0.37 }
  ],
  headOfHousehold: [
    { min: 0, max: 16550, rate: 0.10 },
    { min: 16550, max: 63100, rate: 0.12 },
    { min: 63100, max: 100500, rate: 0.22 },
    { min: 100500, max: 191950, rate: 0.24 },
    { min: 191950, max: 243700, rate: 0.32 },
    { min: 243700, max: 609350, rate: 0.35 },
    { min: 609350, max: null, rate: 0.37 }
  ]
};

// 2024 State tax rates (accurate as of May 2024)
export interface StateTaxRate {
  type: 'flat' | 'progressive';
  rate?: number; // Used for flat tax states
  brackets?: TaxBracket[]; // Used for progressive tax states
}

export const stateTaxRates: Record<string, StateTaxRate> = {
  'Alabama': { type: 'flat', rate: 0.05 },
  'Alaska': { type: 'flat', rate: 0.00 }, // No state income tax
  'Arizona': { type: 'flat', rate: 0.0459 },
  'Arkansas': { type: 'flat', rate: 0.047 }, // Flat tax rate as of 2024
  'California': { type: 'flat', rate: 0.133 }, // Top marginal rate (simplified)
  'Colorado': { type: 'flat', rate: 0.044 }, // Flat tax rate
  'Connecticut': { type: 'flat', rate: 0.0699 }, // Top marginal rate (simplified)
  'Delaware': { type: 'flat', rate: 0.066 }, // Top marginal rate (simplified)
  'Florida': { type: 'flat', rate: 0.00 }, // No state income tax
  'Georgia': { type: 'flat', rate: 0.0575 },
  'Hawaii': { type: 'flat', rate: 0.11 }, // Top marginal rate (simplified)
  'Idaho': { type: 'flat', rate: 0.059 }, // Flat tax rate as of 2024
  'Illinois': { type: 'flat', rate: 0.0495 }, // Flat tax rate
  'Indiana': { type: 'flat', rate: 0.0323 }, // Flat tax rate
  'Iowa': { type: 'flat', rate: 0.0575 }, // Moving to flat tax by 2026
  'Kansas': { type: 'flat', rate: 0.057 }, // Top marginal rate (simplified)
  'Kentucky': { type: 'flat', rate: 0.045 }, // Flat tax rate as of 2024
  'Louisiana': { type: 'flat', rate: 0.0425 }, // Top marginal rate (simplified)
  'Maine': { type: 'flat', rate: 0.0715 }, // Top marginal rate (simplified)
  'Maryland': { type: 'flat', rate: 0.0575 }, // Top marginal rate (simplified)
  'Massachusetts': { type: 'flat', rate: 0.05 }, // Flat tax rate
  'Michigan': { type: 'flat', rate: 0.0425 }, // Flat tax rate
  'Minnesota': { type: 'flat', rate: 0.0985 }, // Top marginal rate (simplified)
  'Mississippi': { type: 'flat', rate: 0.05 }, // Flat tax rate as of 2024
  'Missouri': { type: 'flat', rate: 0.049 }, // Top marginal rate as of 2024
  'Montana': { type: 'flat', rate: 0.0675 }, // Top marginal rate (simplified)
  'Nebraska': { type: 'flat', rate: 0.0664 }, // Top marginal rate (simplified)
  'Nevada': { type: 'flat', rate: 0.00 }, // No state income tax
  'New Hampshire': { type: 'flat', rate: 0.05 }, // Only taxes interest and dividends
  'New Jersey': { type: 'flat', rate: 0.1075 }, // Top marginal rate (simplified)
  'New Mexico': { type: 'flat', rate: 0.059 }, // Top marginal rate (simplified)
  'New York': { type: 'flat', rate: 0.109 }, // Top marginal rate (simplified)
  'North Carolina': { type: 'flat', rate: 0.0475 }, // Flat tax rate as of 2024
  'North Dakota': { type: 'flat', rate: 0.0290 }, // Top marginal rate (simplified)
  'Ohio': { type: 'flat', rate: 0.0399 }, // Top marginal rate (simplified)
  'Oklahoma': { type: 'flat', rate: 0.0475 }, // Top marginal rate (simplified)
  'Oregon': { type: 'flat', rate: 0.099 }, // Top marginal rate (simplified)
  'Pennsylvania': { type: 'flat', rate: 0.0307 }, // Flat tax rate
  'Rhode Island': { type: 'flat', rate: 0.0599 }, // Top marginal rate (simplified)
  'South Carolina': { type: 'flat', rate: 0.07 }, // Top marginal rate (simplified)
  'South Dakota': { type: 'flat', rate: 0.00 }, // No state income tax
  'Tennessee': { type: 'flat', rate: 0.00 }, // No state income tax
  'Texas': { type: 'flat', rate: 0.00 }, // No state income tax
  'Utah': { type: 'flat', rate: 0.0485 }, // Flat tax rate as of 2024
  'Vermont': { type: 'flat', rate: 0.0875 }, // Top marginal rate (simplified)
  'Virginia': { type: 'flat', rate: 0.0575 }, // Top marginal rate (simplified)
  'Washington': { type: 'flat', rate: 0.00 }, // No state income tax
  'West Virginia': { type: 'flat', rate: 0.065 }, // Top marginal rate (simplified)
  'Wisconsin': { type: 'flat', rate: 0.0765 }, // Top marginal rate (simplified)
  'Wyoming': { type: 'flat', rate: 0.00 }, // No state income tax
  'District of Columbia': { type: 'flat', rate: 0.0995 } // Top marginal rate (simplified)
};

// City tax rates (accurate as of May 2024)
export interface CityTaxRate {
  state: string;
  rate: number;
}

export const cityTaxRates: Record<string, CityTaxRate> = {
  // New York
  'New York City': { state: 'New York', rate: 0.03876 },
  'Yonkers': { state: 'New York', rate: 0.016 },
  
  // Pennsylvania
  'Philadelphia': { state: 'Pennsylvania', rate: 0.0399 },
  'Pittsburgh': { state: 'Pennsylvania', rate: 0.03 },
  'Scranton': { state: 'Pennsylvania', rate: 0.0295 },
  'Reading': { state: 'Pennsylvania', rate: 0.0235 },
  'Allentown': { state: 'Pennsylvania', rate: 0.0235 },
  
  // Ohio
  'Columbus': { state: 'Ohio', rate: 0.025 },
  'Cleveland': { state: 'Ohio', rate: 0.025 },
  'Cincinnati': { state: 'Ohio', rate: 0.019 },
  'Toledo': { state: 'Ohio', rate: 0.0225 },
  'Akron': { state: 'Ohio', rate: 0.025 },
  'Dayton': { state: 'Ohio', rate: 0.0225 },
  
  // Michigan
  'Detroit': { state: 'Michigan', rate: 0.024 },
  'Grand Rapids': { state: 'Michigan', rate: 0.015 },
  'Lansing': { state: 'Michigan', rate: 0.01 },
  'Flint': { state: 'Michigan', rate: 0.01 },
  
  // Missouri
  'St. Louis': { state: 'Missouri', rate: 0.01 },
  'Kansas City': { state: 'Missouri', rate: 0.01 },
  
  // Kentucky
  'Louisville': { state: 'Kentucky', rate: 0.0285 },
  'Lexington': { state: 'Kentucky', rate: 0.0225 },
  
  // Alabama
  'Birmingham': { state: 'Alabama', rate: 0.01 },
  'Montgomery': { state: 'Alabama', rate: 0.01 },
  
  // Maryland
  'Baltimore': { state: 'Maryland', rate: 0.032 },
  'Annapolis': { state: 'Maryland', rate: 0.025 },
  
  // Indiana
  'Indianapolis': { state: 'Indiana', rate: 0.0202 },
  'Fort Wayne': { state: 'Indiana', rate: 0.015 },
  
  // Iowa
  'Des Moines': { state: 'Iowa', rate: 0.01 },
  'Cedar Rapids': { state: 'Iowa', rate: 0.01 },
  
  // California
  'San Francisco': { state: 'California', rate: 0.01 },
  'Los Angeles': { state: 'California', rate: 0.00 },
  'San Diego': { state: 'California', rate: 0.00 },
  
  // Illinois
  'Chicago': { state: 'Illinois', rate: 0.00 },
  'Springfield': { state: 'Illinois', rate: 0.00 },
  
  // Texas
  'Dallas': { state: 'Texas', rate: 0.00 },
  'Houston': { state: 'Texas', rate: 0.00 },
  'Austin': { state: 'Texas', rate: 0.00 },
  
  // Florida
  'Miami': { state: 'Florida', rate: 0.00 },
  'Orlando': { state: 'Florida', rate: 0.00 },
  'Tampa': { state: 'Florida', rate: 0.00 },
  
  // Washington
  'Seattle': { state: 'Washington', rate: 0.00 },
  'Spokane': { state: 'Washington', rate: 0.00 },
  
  // Oregon
  'Portland': { state: 'Oregon', rate: 0.00 },
  'Salem': { state: 'Oregon', rate: 0.00 },
  
  // Colorado
  'Denver': { state: 'Colorado', rate: 0.00 },
  'Boulder': { state: 'Colorado', rate: 0.00 },
  
  // Arizona
  'Phoenix': { state: 'Arizona', rate: 0.00 },
  'Tucson': { state: 'Arizona', rate: 0.00 },
  
  // Nevada
  'Las Vegas': { state: 'Nevada', rate: 0.00 },
  'Reno': { state: 'Nevada', rate: 0.00 },
  
  // Utah
  'Salt Lake City': { state: 'Utah', rate: 0.00 },
  'Provo': { state: 'Utah', rate: 0.00 },
  
  // Massachusetts
  'Boston': { state: 'Massachusetts', rate: 0.00 },
  'Cambridge': { state: 'Massachusetts', rate: 0.00 },
  
  // Connecticut
  'Hartford': { state: 'Connecticut', rate: 0.00 },
  'New Haven': { state: 'Connecticut', rate: 0.00 },
  
  // New Jersey
  'Newark': { state: 'New Jersey', rate: 0.01 },
  'Jersey City': { state: 'New Jersey', rate: 0.01 },
  
  // Virginia
  'Richmond': { state: 'Virginia', rate: 0.00 },
  'Virginia Beach': { state: 'Virginia', rate: 0.00 },
  
  // North Carolina
  'Charlotte': { state: 'North Carolina', rate: 0.00 },
  'Raleigh': { state: 'North Carolina', rate: 0.00 },
  
  // Georgia
  'Atlanta': { state: 'Georgia', rate: 0.00 },
  'Savannah': { state: 'Georgia', rate: 0.00 },
  
  // Tennessee
  'Nashville': { state: 'Tennessee', rate: 0.00 },
  'Memphis': { state: 'Tennessee', rate: 0.00 },
  
  // District of Columbia
  'Washington D.C.': { state: 'District of Columbia', rate: 0.00 }
};

// FICA (Social Security) and Medicare rates (accurate as of 2024)
export const FICA_RATE = 0.062;
export const FICA_WAGE_CAP = 168600; // 2024 wage cap
export const MEDICARE_RATE = 0.0145;
export const ADDITIONAL_MEDICARE_RATE = 0.009; // Additional Medicare tax for high earners
export const MEDICARE_THRESHOLD_SINGLE = 200000; // Threshold for additional Medicare tax
export const MEDICARE_THRESHOLD_MARRIED = 250000; // Threshold for additional Medicare tax
