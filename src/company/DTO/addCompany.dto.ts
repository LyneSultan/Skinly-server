type addCompanyAsUser = {
  name: string;
  email: string;
};
type addCompanyInCompanyCollection =  {
  name: string;
  scraping_file: string;
  company_logo?: string;
  products?: string;
};
export type addCompany = addCompanyAsUser & addCompanyInCompanyCollection;
