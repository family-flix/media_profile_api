export type Request = {
  url: string;
  hostname: string;
  search: string;
  query: Record<string, string>;
};

export type Resp<T> = {
  data: T extends null ? null : T;
  code?: number | string;
  error: T extends null ? Error : null;
};
export type Result<T> = Resp<T> | Resp<null>;
export type UnpackedResult<T> = NonNullable<T extends Resp<infer U> ? (U extends null ? U : U) : T>;
/** 构造一个结果对象 */
export const Result = {
  /** 构造成功结果 */
  Ok: <T>(value: T) => {
    const result = {
      data: value,
      error: null,
    } as Result<T>;
    return result;
  },
  /** 构造失败结果 */
  Err: <T>(message: string | Error | Result<null>, code?: number | string, data: unknown = null) => {
    const result = {
      data,
      /**
       * @deprecated 把 error 类型改为 BizError 后取 error.code
       */
      code,
      error: (() => {
        if (message === undefined) {
          const e = new Error("未知错误");
          // @ts-ignore
          e.code = code;
          return e;
        }
        if (typeof message === "string") {
          const e = new Error(message);
          // @ts-ignore
          e.code = code;
          return e;
        }
        if (message instanceof Error) {
          // @ts-ignore
          message.code = code;
          return message;
        }
        const r = message as Result<null>;
        if (code) {
          // @ts-ignore
          r.error.code = code;
        }
        return r.error;
      })(),
    } as Result<null>;
    return result;
  },
  All: async <T extends any>(pending: Promise<Result<T>>[]) => {
    let count = 0;
    const r = new Promise((resolve) => {
      const result: { order: number; r: Result<T> }[] = [];
      for (let i = 0; i < pending.length; i += 1) {
        const p = pending[i];
        p.then((r) => {
          count += 1;
          result.push({
            order: i,
            r,
          });
          if (count === pending.length) {
            resolve(result.sort((a, b) => a.order - b.order).map((r) => r.r));
          }
        });
      }
    }) as Promise<Result<T>[]>;
    return r;
  },
};

/** 将一个返回 promise 的函数转换成返回 Result 的函数 */
export function resultify<F extends (...args: any[]) => Promise<any>>(fn: F) {
  return async (...args: Parameters<F>) => {
    try {
      const data = await fn(...args);
      const r = Result.Ok(data) as Result<Unpacked<ReturnType<F>>>;
      return r;
    } catch (err) {
      const e = err as Error;
      return Result.Err(e.message);
    }
  };
}

export type Unpacked<T> = T extends (infer U)[]
  ? U
  : T extends (...args: any[]) => infer U
  ? U
  : T extends Promise<infer U>
  ? U
  : T extends Result<infer U>
  ? U
  : T;

export type BaseApiResp<T> = {
  code: number;
  msg: string;
  data: T;
};

export type ListResponse<T> = {
  total: number;
  page: number;
  page_size: number;
  list: T[];
};

export type RequestedResource<T extends (...args: any[]) => any> = UnpackedResult<Unpacked<ReturnType<T>>>;

export interface JSONArray extends Array<JSONValue> {}
export type JSONValue = string | number | boolean | JSONObject | JSONArray | null;
export type JSONObject = { [Key in string]?: JSONValue };
