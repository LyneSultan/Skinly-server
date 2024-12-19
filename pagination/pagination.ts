export const paginateData=(data: any[], page: number, pageSize: number) =>{
  const skip = (page - 1) * pageSize;
  const paginatedData = data.slice(skip, skip + pageSize);
  return paginatedData;
}
