declare module "next/server" {
  export type NextApiRequest = {
    headers: Record<string, string>;
    body: Record<string, string>;
    body: unknown;
  };
  export type NextRequest = {
    url: string;
  };
  export interface NextApiResponse<T> {
    status(code: number): {
      json(v: any): T;
    };
  }
}
