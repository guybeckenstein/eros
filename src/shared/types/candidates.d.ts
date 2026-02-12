import { SimpleUserData } from './auth';
import { CityRef, CurrencyRef, JobTitleRef } from './table-references';

type DiscoverCandidate = {
  seeker_id: number;
  users: SimpleUserData;
  job_titles_ref: JobTitleRef;
  city: CityRef;
  years_of_experience: number;
  work_availability: string;
  work_model: string;
  expected_salary_min: number;
  expected_salary_max: number;
  currencies_ref: CurrencyRef;
};

export interface FlattenCandidate {
  id: number;
  full_name: string;
  profile_pic_url: string;
  job_title: string;
  years_of_experience: number;
  work_availability: string;
  work_type: string;
  city: string;
  expected_salary_min: number;
  expected_salary_max: number;
  currency_name: string;
  currency_symbol: string;
}

export default DiscoverCandidate;
