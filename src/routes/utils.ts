import type { ResultSet, SqlValue } from "@libsql/client";

/***
 * @description Adapter for formatting db query results to proper objects for json responses
 * @param {ResultSet} data - Db query response data
 */
export function responseDataAdapter(data: ResultSet): NewsletterSubscriber[] {
  if (!data?.columns || !data?.rows) {
    throw new Error("Malformed response from turso")
  }

  const { columns, rows } = data;
  const formattedData: NewsletterSubscriber[] = [];

  for (const row of rows) {
    const rowData: { [k: string]: SqlValue } = {};
    for (let i = 0; i < columns.length; i++) {
      rowData[columns[i]] = row[i];
    }

    // This line of code is assuming that all of the fields of
    // NewsletterSubscriber are present in the columns and rows of the
    // ResultSet, and their types match. Ideally, this code checks the presence
    // and validity of each value in the ResultSet before passing it along to
    // the caller.
    formattedData.push(rowData as unknown as NewsletterSubscriber);
  }

  return formattedData;
}

export interface NewsletterSubscriber {
  website: string;
  email: string;
  id: number;
  created_at: number;
}
