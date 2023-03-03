/***
 * @description Adapter for formating db query results to proper objects for json responses
 * @param {any} data - Db query response data
 */
export function responseDataAdapter(data: any) {
  if (!data?.columns || !data?.rows) {
    return data;
  }

  const { columns, rows } = data;
  const formattedData = [];

  for (const row of rows) {
    const rowData: any = {};
    for (const key of columns.keys()) {
      rowData[columns[key]] = row[key];
    }
    formattedData.push(rowData);
  }

  return formattedData;
}

export interface NewsletterSubscriber {
  website: string;
  email: string;
  id: number;
  created_at: number;
}
