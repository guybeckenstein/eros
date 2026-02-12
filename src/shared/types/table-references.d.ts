export interface JobTitleRef {
  title: string;
}

export interface CityRef {
  country: CountryRef;
  name: string;
}

export interface CountryRef {
  id: number;
  name: string;
  is_active: boolean;
}

export interface CurrencyRef {
  name: string;
  symbol: string;
}
