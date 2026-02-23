import { Option } from '@/components/ui/inputs/Select';

export const mapToOptions = <T>(list: T[]): Option[] => {
  return list.map((item) => ({
    value: String(item),
    label: String(item),
  }));
};

export const getCandidateMatchScore = () => {
  return 80;
};
