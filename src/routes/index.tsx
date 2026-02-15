import { createFileRoute } from '@tanstack/react-router';

import { supabase } from '../utils/supabase';

export const Route = createFileRoute('/')({
  loader: async () => {
    const { data, error } = await supabase
      .from('company_industries')
      .select('company_id, industry_id');

    if (error) {
      console.error('Supabase error:', error);
      throw error;
    } else {
      console.log(data);
      return { companyIndustries: data.length ? data : [] };
    }
  },
  component: Home,
});

function Home() {
  const { companyIndustries = [] } = Route.useLoaderData();

  return (
    // <ul>
    //   {companyIndustries.map((instrument) => (
    //     <li key={`${instrument.company_id}-${instrument.industry_id}`}>
    //       {instrument.company_id}, {instrument.industry_id}
    //     </li>
    //   ))}
    // </ul>
    <div></div>
  );
}
