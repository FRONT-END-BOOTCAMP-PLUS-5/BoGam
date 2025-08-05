
/**
 * Client
**/

import * as runtime from './runtime/library.js';
import $Types = runtime.Types // general types
import $Public = runtime.Types.Public
import $Utils = runtime.Types.Utils
import $Extensions = runtime.Types.Extensions
import $Result = runtime.Types.Result

export type PrismaPromise<T> = $Public.PrismaPromise<T>


/**
 * Model User
 * 
 */
export type User = $Result.DefaultSelection<Prisma.$UserPayload>
/**
 * Model TaxCert
 * 
 */
export type TaxCert = $Result.DefaultSelection<Prisma.$TaxCertPayload>
/**
 * Model Address
 * 
 */
export type Address = $Result.DefaultSelection<Prisma.$AddressPayload>
/**
 * Model UserAddress
 * 
 */
export type UserAddress = $Result.DefaultSelection<Prisma.$UserAddressPayload>
/**
 * Model RealEstate
 * 
 */
export type RealEstate = $Result.DefaultSelection<Prisma.$RealEstatePayload>
/**
 * Model Step
 * 
 */
export type Step = $Result.DefaultSelection<Prisma.$StepPayload>
/**
 * Model StepResult
 * 
 */
export type StepResult = $Result.DefaultSelection<Prisma.$StepResultPayload>

/**
 * ##  Prisma Client ʲˢ
 *
 * Type-safe database client for TypeScript & Node.js
 * @example
 * ```
 * const prisma = new PrismaClient()
 * // Fetch zero or more Users
 * const users = await prisma.user.findMany()
 * ```
 *
 *
 * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client).
 */
export class PrismaClient<
  ClientOptions extends Prisma.PrismaClientOptions = Prisma.PrismaClientOptions,
  const U = 'log' extends keyof ClientOptions ? ClientOptions['log'] extends Array<Prisma.LogLevel | Prisma.LogDefinition> ? Prisma.GetEvents<ClientOptions['log']> : never : never,
  ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs
> {
  [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['other'] }

    /**
   * ##  Prisma Client ʲˢ
   *
   * Type-safe database client for TypeScript & Node.js
   * @example
   * ```
   * const prisma = new PrismaClient()
   * // Fetch zero or more Users
   * const users = await prisma.user.findMany()
   * ```
   *
   *
   * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client).
   */

  constructor(optionsArg ?: Prisma.Subset<ClientOptions, Prisma.PrismaClientOptions>);
  $on<V extends U>(eventType: V, callback: (event: V extends 'query' ? Prisma.QueryEvent : Prisma.LogEvent) => void): PrismaClient;

  /**
   * Connect with the database
   */
  $connect(): $Utils.JsPromise<void>;

  /**
   * Disconnect from the database
   */
  $disconnect(): $Utils.JsPromise<void>;

  /**
   * Add a middleware
   * @deprecated since 4.16.0. For new code, prefer client extensions instead.
   * @see https://pris.ly/d/extensions
   */
  $use(cb: Prisma.Middleware): void

/**
   * Executes a prepared raw query and returns the number of affected rows.
   * @example
   * ```
   * const result = await prisma.$executeRaw`UPDATE User SET cool = ${true} WHERE email = ${'user@email.com'};`
   * ```
   *
   * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client/raw-database-access).
   */
  $executeRaw<T = unknown>(query: TemplateStringsArray | Prisma.Sql, ...values: any[]): Prisma.PrismaPromise<number>;

  /**
   * Executes a raw query and returns the number of affected rows.
   * Susceptible to SQL injections, see documentation.
   * @example
   * ```
   * const result = await prisma.$executeRawUnsafe('UPDATE User SET cool = $1 WHERE email = $2 ;', true, 'user@email.com')
   * ```
   *
   * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client/raw-database-access).
   */
  $executeRawUnsafe<T = unknown>(query: string, ...values: any[]): Prisma.PrismaPromise<number>;

  /**
   * Performs a prepared raw query and returns the `SELECT` data.
   * @example
   * ```
   * const result = await prisma.$queryRaw`SELECT * FROM User WHERE id = ${1} OR email = ${'user@email.com'};`
   * ```
   *
   * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client/raw-database-access).
   */
  $queryRaw<T = unknown>(query: TemplateStringsArray | Prisma.Sql, ...values: any[]): Prisma.PrismaPromise<T>;

  /**
   * Performs a raw query and returns the `SELECT` data.
   * Susceptible to SQL injections, see documentation.
   * @example
   * ```
   * const result = await prisma.$queryRawUnsafe('SELECT * FROM User WHERE id = $1 OR email = $2;', 1, 'user@email.com')
   * ```
   *
   * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client/raw-database-access).
   */
  $queryRawUnsafe<T = unknown>(query: string, ...values: any[]): Prisma.PrismaPromise<T>;


  /**
   * Allows the running of a sequence of read/write operations that are guaranteed to either succeed or fail as a whole.
   * @example
   * ```
   * const [george, bob, alice] = await prisma.$transaction([
   *   prisma.user.create({ data: { name: 'George' } }),
   *   prisma.user.create({ data: { name: 'Bob' } }),
   *   prisma.user.create({ data: { name: 'Alice' } }),
   * ])
   * ```
   * 
   * Read more in our [docs](https://www.prisma.io/docs/concepts/components/prisma-client/transactions).
   */
  $transaction<P extends Prisma.PrismaPromise<any>[]>(arg: [...P], options?: { isolationLevel?: Prisma.TransactionIsolationLevel }): $Utils.JsPromise<runtime.Types.Utils.UnwrapTuple<P>>

  $transaction<R>(fn: (prisma: Omit<PrismaClient, runtime.ITXClientDenyList>) => $Utils.JsPromise<R>, options?: { maxWait?: number, timeout?: number, isolationLevel?: Prisma.TransactionIsolationLevel }): $Utils.JsPromise<R>


  $extends: $Extensions.ExtendsHook<"extends", Prisma.TypeMapCb<ClientOptions>, ExtArgs, $Utils.Call<Prisma.TypeMapCb<ClientOptions>, {
    extArgs: ExtArgs
  }>>

      /**
   * `prisma.user`: Exposes CRUD operations for the **User** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more Users
    * const users = await prisma.user.findMany()
    * ```
    */
  get user(): Prisma.UserDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.taxCert`: Exposes CRUD operations for the **TaxCert** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more TaxCerts
    * const taxCerts = await prisma.taxCert.findMany()
    * ```
    */
  get taxCert(): Prisma.TaxCertDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.address`: Exposes CRUD operations for the **Address** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more Addresses
    * const addresses = await prisma.address.findMany()
    * ```
    */
  get address(): Prisma.AddressDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.userAddress`: Exposes CRUD operations for the **UserAddress** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more UserAddresses
    * const userAddresses = await prisma.userAddress.findMany()
    * ```
    */
  get userAddress(): Prisma.UserAddressDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.realEstate`: Exposes CRUD operations for the **RealEstate** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more RealEstates
    * const realEstates = await prisma.realEstate.findMany()
    * ```
    */
  get realEstate(): Prisma.RealEstateDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.step`: Exposes CRUD operations for the **Step** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more Steps
    * const steps = await prisma.step.findMany()
    * ```
    */
  get step(): Prisma.StepDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.stepResult`: Exposes CRUD operations for the **StepResult** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more StepResults
    * const stepResults = await prisma.stepResult.findMany()
    * ```
    */
  get stepResult(): Prisma.StepResultDelegate<ExtArgs, ClientOptions>;
}

export namespace Prisma {
  export import DMMF = runtime.DMMF

  export type PrismaPromise<T> = $Public.PrismaPromise<T>

  /**
   * Validator
   */
  export import validator = runtime.Public.validator

  /**
   * Prisma Errors
   */
  export import PrismaClientKnownRequestError = runtime.PrismaClientKnownRequestError
  export import PrismaClientUnknownRequestError = runtime.PrismaClientUnknownRequestError
  export import PrismaClientRustPanicError = runtime.PrismaClientRustPanicError
  export import PrismaClientInitializationError = runtime.PrismaClientInitializationError
  export import PrismaClientValidationError = runtime.PrismaClientValidationError

  /**
   * Re-export of sql-template-tag
   */
  export import sql = runtime.sqltag
  export import empty = runtime.empty
  export import join = runtime.join
  export import raw = runtime.raw
  export import Sql = runtime.Sql



  /**
   * Decimal.js
   */
  export import Decimal = runtime.Decimal

  export type DecimalJsLike = runtime.DecimalJsLike

  /**
   * Metrics
   */
  export type Metrics = runtime.Metrics
  export type Metric<T> = runtime.Metric<T>
  export type MetricHistogram = runtime.MetricHistogram
  export type MetricHistogramBucket = runtime.MetricHistogramBucket

  /**
  * Extensions
  */
  export import Extension = $Extensions.UserArgs
  export import getExtensionContext = runtime.Extensions.getExtensionContext
  export import Args = $Public.Args
  export import Payload = $Public.Payload
  export import Result = $Public.Result
  export import Exact = $Public.Exact

  /**
   * Prisma Client JS version: 6.13.0
   * Query Engine version: 361e86d0ea4987e9f53a565309b3eed797a6bcbd
   */
  export type PrismaVersion = {
    client: string
  }

  export const prismaVersion: PrismaVersion

  /**
   * Utility Types
   */


  export import JsonObject = runtime.JsonObject
  export import JsonArray = runtime.JsonArray
  export import JsonValue = runtime.JsonValue
  export import InputJsonObject = runtime.InputJsonObject
  export import InputJsonArray = runtime.InputJsonArray
  export import InputJsonValue = runtime.InputJsonValue

  /**
   * Types of the values used to represent different kinds of `null` values when working with JSON fields.
   *
   * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
   */
  namespace NullTypes {
    /**
    * Type of `Prisma.DbNull`.
    *
    * You cannot use other instances of this class. Please use the `Prisma.DbNull` value.
    *
    * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
    */
    class DbNull {
      private DbNull: never
      private constructor()
    }

    /**
    * Type of `Prisma.JsonNull`.
    *
    * You cannot use other instances of this class. Please use the `Prisma.JsonNull` value.
    *
    * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
    */
    class JsonNull {
      private JsonNull: never
      private constructor()
    }

    /**
    * Type of `Prisma.AnyNull`.
    *
    * You cannot use other instances of this class. Please use the `Prisma.AnyNull` value.
    *
    * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
    */
    class AnyNull {
      private AnyNull: never
      private constructor()
    }
  }

  /**
   * Helper for filtering JSON entries that have `null` on the database (empty on the db)
   *
   * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
   */
  export const DbNull: NullTypes.DbNull

  /**
   * Helper for filtering JSON entries that have JSON `null` values (not empty on the db)
   *
   * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
   */
  export const JsonNull: NullTypes.JsonNull

  /**
   * Helper for filtering JSON entries that are `Prisma.DbNull` or `Prisma.JsonNull`
   *
   * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
   */
  export const AnyNull: NullTypes.AnyNull

  type SelectAndInclude = {
    select: any
    include: any
  }

  type SelectAndOmit = {
    select: any
    omit: any
  }

  /**
   * Get the type of the value, that the Promise holds.
   */
  export type PromiseType<T extends PromiseLike<any>> = T extends PromiseLike<infer U> ? U : T;

  /**
   * Get the return type of a function which returns a Promise.
   */
  export type PromiseReturnType<T extends (...args: any) => $Utils.JsPromise<any>> = PromiseType<ReturnType<T>>

  /**
   * From T, pick a set of properties whose keys are in the union K
   */
  type Prisma__Pick<T, K extends keyof T> = {
      [P in K]: T[P];
  };


  export type Enumerable<T> = T | Array<T>;

  export type RequiredKeys<T> = {
    [K in keyof T]-?: {} extends Prisma__Pick<T, K> ? never : K
  }[keyof T]

  export type TruthyKeys<T> = keyof {
    [K in keyof T as T[K] extends false | undefined | null ? never : K]: K
  }

  export type TrueKeys<T> = TruthyKeys<Prisma__Pick<T, RequiredKeys<T>>>

  /**
   * Subset
   * @desc From `T` pick properties that exist in `U`. Simple version of Intersection
   */
  export type Subset<T, U> = {
    [key in keyof T]: key extends keyof U ? T[key] : never;
  };

  /**
   * SelectSubset
   * @desc From `T` pick properties that exist in `U`. Simple version of Intersection.
   * Additionally, it validates, if both select and include are present. If the case, it errors.
   */
  export type SelectSubset<T, U> = {
    [key in keyof T]: key extends keyof U ? T[key] : never
  } &
    (T extends SelectAndInclude
      ? 'Please either choose `select` or `include`.'
      : T extends SelectAndOmit
        ? 'Please either choose `select` or `omit`.'
        : {})

  /**
   * Subset + Intersection
   * @desc From `T` pick properties that exist in `U` and intersect `K`
   */
  export type SubsetIntersection<T, U, K> = {
    [key in keyof T]: key extends keyof U ? T[key] : never
  } &
    K

  type Without<T, U> = { [P in Exclude<keyof T, keyof U>]?: never };

  /**
   * XOR is needed to have a real mutually exclusive union type
   * https://stackoverflow.com/questions/42123407/does-typescript-support-mutually-exclusive-types
   */
  type XOR<T, U> =
    T extends object ?
    U extends object ?
      (Without<T, U> & U) | (Without<U, T> & T)
    : U : T


  /**
   * Is T a Record?
   */
  type IsObject<T extends any> = T extends Array<any>
  ? False
  : T extends Date
  ? False
  : T extends Uint8Array
  ? False
  : T extends BigInt
  ? False
  : T extends object
  ? True
  : False


  /**
   * If it's T[], return T
   */
  export type UnEnumerate<T extends unknown> = T extends Array<infer U> ? U : T

  /**
   * From ts-toolbelt
   */

  type __Either<O extends object, K extends Key> = Omit<O, K> &
    {
      // Merge all but K
      [P in K]: Prisma__Pick<O, P & keyof O> // With K possibilities
    }[K]

  type EitherStrict<O extends object, K extends Key> = Strict<__Either<O, K>>

  type EitherLoose<O extends object, K extends Key> = ComputeRaw<__Either<O, K>>

  type _Either<
    O extends object,
    K extends Key,
    strict extends Boolean
  > = {
    1: EitherStrict<O, K>
    0: EitherLoose<O, K>
  }[strict]

  type Either<
    O extends object,
    K extends Key,
    strict extends Boolean = 1
  > = O extends unknown ? _Either<O, K, strict> : never

  export type Union = any

  type PatchUndefined<O extends object, O1 extends object> = {
    [K in keyof O]: O[K] extends undefined ? At<O1, K> : O[K]
  } & {}

  /** Helper Types for "Merge" **/
  export type IntersectOf<U extends Union> = (
    U extends unknown ? (k: U) => void : never
  ) extends (k: infer I) => void
    ? I
    : never

  export type Overwrite<O extends object, O1 extends object> = {
      [K in keyof O]: K extends keyof O1 ? O1[K] : O[K];
  } & {};

  type _Merge<U extends object> = IntersectOf<Overwrite<U, {
      [K in keyof U]-?: At<U, K>;
  }>>;

  type Key = string | number | symbol;
  type AtBasic<O extends object, K extends Key> = K extends keyof O ? O[K] : never;
  type AtStrict<O extends object, K extends Key> = O[K & keyof O];
  type AtLoose<O extends object, K extends Key> = O extends unknown ? AtStrict<O, K> : never;
  export type At<O extends object, K extends Key, strict extends Boolean = 1> = {
      1: AtStrict<O, K>;
      0: AtLoose<O, K>;
  }[strict];

  export type ComputeRaw<A extends any> = A extends Function ? A : {
    [K in keyof A]: A[K];
  } & {};

  export type OptionalFlat<O> = {
    [K in keyof O]?: O[K];
  } & {};

  type _Record<K extends keyof any, T> = {
    [P in K]: T;
  };

  // cause typescript not to expand types and preserve names
  type NoExpand<T> = T extends unknown ? T : never;

  // this type assumes the passed object is entirely optional
  type AtLeast<O extends object, K extends string> = NoExpand<
    O extends unknown
    ? | (K extends keyof O ? { [P in K]: O[P] } & O : O)
      | {[P in keyof O as P extends K ? P : never]-?: O[P]} & O
    : never>;

  type _Strict<U, _U = U> = U extends unknown ? U & OptionalFlat<_Record<Exclude<Keys<_U>, keyof U>, never>> : never;

  export type Strict<U extends object> = ComputeRaw<_Strict<U>>;
  /** End Helper Types for "Merge" **/

  export type Merge<U extends object> = ComputeRaw<_Merge<Strict<U>>>;

  /**
  A [[Boolean]]
  */
  export type Boolean = True | False

  // /**
  // 1
  // */
  export type True = 1

  /**
  0
  */
  export type False = 0

  export type Not<B extends Boolean> = {
    0: 1
    1: 0
  }[B]

  export type Extends<A1 extends any, A2 extends any> = [A1] extends [never]
    ? 0 // anything `never` is false
    : A1 extends A2
    ? 1
    : 0

  export type Has<U extends Union, U1 extends Union> = Not<
    Extends<Exclude<U1, U>, U1>
  >

  export type Or<B1 extends Boolean, B2 extends Boolean> = {
    0: {
      0: 0
      1: 1
    }
    1: {
      0: 1
      1: 1
    }
  }[B1][B2]

  export type Keys<U extends Union> = U extends unknown ? keyof U : never

  type Cast<A, B> = A extends B ? A : B;

  export const type: unique symbol;



  /**
   * Used by group by
   */

  export type GetScalarType<T, O> = O extends object ? {
    [P in keyof T]: P extends keyof O
      ? O[P]
      : never
  } : never

  type FieldPaths<
    T,
    U = Omit<T, '_avg' | '_sum' | '_count' | '_min' | '_max'>
  > = IsObject<T> extends True ? U : T

  type GetHavingFields<T> = {
    [K in keyof T]: Or<
      Or<Extends<'OR', K>, Extends<'AND', K>>,
      Extends<'NOT', K>
    > extends True
      ? // infer is only needed to not hit TS limit
        // based on the brilliant idea of Pierre-Antoine Mills
        // https://github.com/microsoft/TypeScript/issues/30188#issuecomment-478938437
        T[K] extends infer TK
        ? GetHavingFields<UnEnumerate<TK> extends object ? Merge<UnEnumerate<TK>> : never>
        : never
      : {} extends FieldPaths<T[K]>
      ? never
      : K
  }[keyof T]

  /**
   * Convert tuple to union
   */
  type _TupleToUnion<T> = T extends (infer E)[] ? E : never
  type TupleToUnion<K extends readonly any[]> = _TupleToUnion<K>
  type MaybeTupleToUnion<T> = T extends any[] ? TupleToUnion<T> : T

  /**
   * Like `Pick`, but additionally can also accept an array of keys
   */
  type PickEnumerable<T, K extends Enumerable<keyof T> | keyof T> = Prisma__Pick<T, MaybeTupleToUnion<K>>

  /**
   * Exclude all keys with underscores
   */
  type ExcludeUnderscoreKeys<T extends string> = T extends `_${string}` ? never : T


  export type FieldRef<Model, FieldType> = runtime.FieldRef<Model, FieldType>

  type FieldRefInputType<Model, FieldType> = Model extends never ? never : FieldRef<Model, FieldType>


  export const ModelName: {
    User: 'User',
    TaxCert: 'TaxCert',
    Address: 'Address',
    UserAddress: 'UserAddress',
    RealEstate: 'RealEstate',
    Step: 'Step',
    StepResult: 'StepResult'
  };

  export type ModelName = (typeof ModelName)[keyof typeof ModelName]


  export type Datasources = {
    db?: Datasource
  }

  interface TypeMapCb<ClientOptions = {}> extends $Utils.Fn<{extArgs: $Extensions.InternalArgs }, $Utils.Record<string, any>> {
    returns: Prisma.TypeMap<this['params']['extArgs'], ClientOptions extends { omit: infer OmitOptions } ? OmitOptions : {}>
  }

  export type TypeMap<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> = {
    globalOmitOptions: {
      omit: GlobalOmitOptions
    }
    meta: {
      modelProps: "user" | "taxCert" | "address" | "userAddress" | "realEstate" | "step" | "stepResult"
      txIsolationLevel: Prisma.TransactionIsolationLevel
    }
    model: {
      User: {
        payload: Prisma.$UserPayload<ExtArgs>
        fields: Prisma.UserFieldRefs
        operations: {
          findUnique: {
            args: Prisma.UserFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.UserFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload>
          }
          findFirst: {
            args: Prisma.UserFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.UserFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload>
          }
          findMany: {
            args: Prisma.UserFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload>[]
          }
          create: {
            args: Prisma.UserCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload>
          }
          createMany: {
            args: Prisma.UserCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.UserCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload>[]
          }
          delete: {
            args: Prisma.UserDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload>
          }
          update: {
            args: Prisma.UserUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload>
          }
          deleteMany: {
            args: Prisma.UserDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.UserUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.UserUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload>[]
          }
          upsert: {
            args: Prisma.UserUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload>
          }
          aggregate: {
            args: Prisma.UserAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateUser>
          }
          groupBy: {
            args: Prisma.UserGroupByArgs<ExtArgs>
            result: $Utils.Optional<UserGroupByOutputType>[]
          }
          count: {
            args: Prisma.UserCountArgs<ExtArgs>
            result: $Utils.Optional<UserCountAggregateOutputType> | number
          }
        }
      }
      TaxCert: {
        payload: Prisma.$TaxCertPayload<ExtArgs>
        fields: Prisma.TaxCertFieldRefs
        operations: {
          findUnique: {
            args: Prisma.TaxCertFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TaxCertPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.TaxCertFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TaxCertPayload>
          }
          findFirst: {
            args: Prisma.TaxCertFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TaxCertPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.TaxCertFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TaxCertPayload>
          }
          findMany: {
            args: Prisma.TaxCertFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TaxCertPayload>[]
          }
          create: {
            args: Prisma.TaxCertCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TaxCertPayload>
          }
          createMany: {
            args: Prisma.TaxCertCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.TaxCertCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TaxCertPayload>[]
          }
          delete: {
            args: Prisma.TaxCertDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TaxCertPayload>
          }
          update: {
            args: Prisma.TaxCertUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TaxCertPayload>
          }
          deleteMany: {
            args: Prisma.TaxCertDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.TaxCertUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.TaxCertUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TaxCertPayload>[]
          }
          upsert: {
            args: Prisma.TaxCertUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TaxCertPayload>
          }
          aggregate: {
            args: Prisma.TaxCertAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateTaxCert>
          }
          groupBy: {
            args: Prisma.TaxCertGroupByArgs<ExtArgs>
            result: $Utils.Optional<TaxCertGroupByOutputType>[]
          }
          count: {
            args: Prisma.TaxCertCountArgs<ExtArgs>
            result: $Utils.Optional<TaxCertCountAggregateOutputType> | number
          }
        }
      }
      Address: {
        payload: Prisma.$AddressPayload<ExtArgs>
        fields: Prisma.AddressFieldRefs
        operations: {
          findUnique: {
            args: Prisma.AddressFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AddressPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.AddressFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AddressPayload>
          }
          findFirst: {
            args: Prisma.AddressFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AddressPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.AddressFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AddressPayload>
          }
          findMany: {
            args: Prisma.AddressFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AddressPayload>[]
          }
          create: {
            args: Prisma.AddressCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AddressPayload>
          }
          createMany: {
            args: Prisma.AddressCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.AddressCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AddressPayload>[]
          }
          delete: {
            args: Prisma.AddressDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AddressPayload>
          }
          update: {
            args: Prisma.AddressUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AddressPayload>
          }
          deleteMany: {
            args: Prisma.AddressDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.AddressUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.AddressUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AddressPayload>[]
          }
          upsert: {
            args: Prisma.AddressUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AddressPayload>
          }
          aggregate: {
            args: Prisma.AddressAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateAddress>
          }
          groupBy: {
            args: Prisma.AddressGroupByArgs<ExtArgs>
            result: $Utils.Optional<AddressGroupByOutputType>[]
          }
          count: {
            args: Prisma.AddressCountArgs<ExtArgs>
            result: $Utils.Optional<AddressCountAggregateOutputType> | number
          }
        }
      }
      UserAddress: {
        payload: Prisma.$UserAddressPayload<ExtArgs>
        fields: Prisma.UserAddressFieldRefs
        operations: {
          findUnique: {
            args: Prisma.UserAddressFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserAddressPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.UserAddressFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserAddressPayload>
          }
          findFirst: {
            args: Prisma.UserAddressFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserAddressPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.UserAddressFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserAddressPayload>
          }
          findMany: {
            args: Prisma.UserAddressFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserAddressPayload>[]
          }
          create: {
            args: Prisma.UserAddressCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserAddressPayload>
          }
          createMany: {
            args: Prisma.UserAddressCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.UserAddressCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserAddressPayload>[]
          }
          delete: {
            args: Prisma.UserAddressDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserAddressPayload>
          }
          update: {
            args: Prisma.UserAddressUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserAddressPayload>
          }
          deleteMany: {
            args: Prisma.UserAddressDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.UserAddressUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.UserAddressUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserAddressPayload>[]
          }
          upsert: {
            args: Prisma.UserAddressUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserAddressPayload>
          }
          aggregate: {
            args: Prisma.UserAddressAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateUserAddress>
          }
          groupBy: {
            args: Prisma.UserAddressGroupByArgs<ExtArgs>
            result: $Utils.Optional<UserAddressGroupByOutputType>[]
          }
          count: {
            args: Prisma.UserAddressCountArgs<ExtArgs>
            result: $Utils.Optional<UserAddressCountAggregateOutputType> | number
          }
        }
      }
      RealEstate: {
        payload: Prisma.$RealEstatePayload<ExtArgs>
        fields: Prisma.RealEstateFieldRefs
        operations: {
          findUnique: {
            args: Prisma.RealEstateFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$RealEstatePayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.RealEstateFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$RealEstatePayload>
          }
          findFirst: {
            args: Prisma.RealEstateFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$RealEstatePayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.RealEstateFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$RealEstatePayload>
          }
          findMany: {
            args: Prisma.RealEstateFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$RealEstatePayload>[]
          }
          create: {
            args: Prisma.RealEstateCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$RealEstatePayload>
          }
          createMany: {
            args: Prisma.RealEstateCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.RealEstateCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$RealEstatePayload>[]
          }
          delete: {
            args: Prisma.RealEstateDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$RealEstatePayload>
          }
          update: {
            args: Prisma.RealEstateUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$RealEstatePayload>
          }
          deleteMany: {
            args: Prisma.RealEstateDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.RealEstateUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.RealEstateUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$RealEstatePayload>[]
          }
          upsert: {
            args: Prisma.RealEstateUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$RealEstatePayload>
          }
          aggregate: {
            args: Prisma.RealEstateAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateRealEstate>
          }
          groupBy: {
            args: Prisma.RealEstateGroupByArgs<ExtArgs>
            result: $Utils.Optional<RealEstateGroupByOutputType>[]
          }
          count: {
            args: Prisma.RealEstateCountArgs<ExtArgs>
            result: $Utils.Optional<RealEstateCountAggregateOutputType> | number
          }
        }
      }
      Step: {
        payload: Prisma.$StepPayload<ExtArgs>
        fields: Prisma.StepFieldRefs
        operations: {
          findUnique: {
            args: Prisma.StepFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$StepPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.StepFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$StepPayload>
          }
          findFirst: {
            args: Prisma.StepFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$StepPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.StepFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$StepPayload>
          }
          findMany: {
            args: Prisma.StepFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$StepPayload>[]
          }
          create: {
            args: Prisma.StepCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$StepPayload>
          }
          createMany: {
            args: Prisma.StepCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.StepCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$StepPayload>[]
          }
          delete: {
            args: Prisma.StepDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$StepPayload>
          }
          update: {
            args: Prisma.StepUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$StepPayload>
          }
          deleteMany: {
            args: Prisma.StepDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.StepUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.StepUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$StepPayload>[]
          }
          upsert: {
            args: Prisma.StepUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$StepPayload>
          }
          aggregate: {
            args: Prisma.StepAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateStep>
          }
          groupBy: {
            args: Prisma.StepGroupByArgs<ExtArgs>
            result: $Utils.Optional<StepGroupByOutputType>[]
          }
          count: {
            args: Prisma.StepCountArgs<ExtArgs>
            result: $Utils.Optional<StepCountAggregateOutputType> | number
          }
        }
      }
      StepResult: {
        payload: Prisma.$StepResultPayload<ExtArgs>
        fields: Prisma.StepResultFieldRefs
        operations: {
          findUnique: {
            args: Prisma.StepResultFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$StepResultPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.StepResultFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$StepResultPayload>
          }
          findFirst: {
            args: Prisma.StepResultFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$StepResultPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.StepResultFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$StepResultPayload>
          }
          findMany: {
            args: Prisma.StepResultFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$StepResultPayload>[]
          }
          create: {
            args: Prisma.StepResultCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$StepResultPayload>
          }
          createMany: {
            args: Prisma.StepResultCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.StepResultCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$StepResultPayload>[]
          }
          delete: {
            args: Prisma.StepResultDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$StepResultPayload>
          }
          update: {
            args: Prisma.StepResultUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$StepResultPayload>
          }
          deleteMany: {
            args: Prisma.StepResultDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.StepResultUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.StepResultUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$StepResultPayload>[]
          }
          upsert: {
            args: Prisma.StepResultUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$StepResultPayload>
          }
          aggregate: {
            args: Prisma.StepResultAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateStepResult>
          }
          groupBy: {
            args: Prisma.StepResultGroupByArgs<ExtArgs>
            result: $Utils.Optional<StepResultGroupByOutputType>[]
          }
          count: {
            args: Prisma.StepResultCountArgs<ExtArgs>
            result: $Utils.Optional<StepResultCountAggregateOutputType> | number
          }
        }
      }
    }
  } & {
    other: {
      payload: any
      operations: {
        $executeRaw: {
          args: [query: TemplateStringsArray | Prisma.Sql, ...values: any[]],
          result: any
        }
        $executeRawUnsafe: {
          args: [query: string, ...values: any[]],
          result: any
        }
        $queryRaw: {
          args: [query: TemplateStringsArray | Prisma.Sql, ...values: any[]],
          result: any
        }
        $queryRawUnsafe: {
          args: [query: string, ...values: any[]],
          result: any
        }
      }
    }
  }
  export const defineExtension: $Extensions.ExtendsHook<"define", Prisma.TypeMapCb, $Extensions.DefaultArgs>
  export type DefaultPrismaClient = PrismaClient
  export type ErrorFormat = 'pretty' | 'colorless' | 'minimal'
  export interface PrismaClientOptions {
    /**
     * Overwrites the datasource url from your schema.prisma file
     */
    datasources?: Datasources
    /**
     * Overwrites the datasource url from your schema.prisma file
     */
    datasourceUrl?: string
    /**
     * @default "colorless"
     */
    errorFormat?: ErrorFormat
    /**
     * @example
     * ```
     * // Shorthand for `emit: 'stdout'`
     * log: ['query', 'info', 'warn', 'error']
     * 
     * // Emit as events only
     * log: [
     *   { emit: 'event', level: 'query' },
     *   { emit: 'event', level: 'info' },
     *   { emit: 'event', level: 'warn' }
     *   { emit: 'event', level: 'error' }
     * ]
     * 
     * / Emit as events and log to stdout
     * og: [
     *  { emit: 'stdout', level: 'query' },
     *  { emit: 'stdout', level: 'info' },
     *  { emit: 'stdout', level: 'warn' }
     *  { emit: 'stdout', level: 'error' }
     * 
     * ```
     * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client/logging#the-log-option).
     */
    log?: (LogLevel | LogDefinition)[]
    /**
     * The default values for transactionOptions
     * maxWait ?= 2000
     * timeout ?= 5000
     */
    transactionOptions?: {
      maxWait?: number
      timeout?: number
      isolationLevel?: Prisma.TransactionIsolationLevel
    }
    /**
     * Global configuration for omitting model fields by default.
     * 
     * @example
     * ```
     * const prisma = new PrismaClient({
     *   omit: {
     *     user: {
     *       password: true
     *     }
     *   }
     * })
     * ```
     */
    omit?: Prisma.GlobalOmitConfig
  }
  export type GlobalOmitConfig = {
    user?: UserOmit
    taxCert?: TaxCertOmit
    address?: AddressOmit
    userAddress?: UserAddressOmit
    realEstate?: RealEstateOmit
    step?: StepOmit
    stepResult?: StepResultOmit
  }

  /* Types for Logging */
  export type LogLevel = 'info' | 'query' | 'warn' | 'error'
  export type LogDefinition = {
    level: LogLevel
    emit: 'stdout' | 'event'
  }

  export type CheckIsLogLevel<T> = T extends LogLevel ? T : never;

  export type GetLogType<T> = CheckIsLogLevel<
    T extends LogDefinition ? T['level'] : T
  >;

  export type GetEvents<T extends any[]> = T extends Array<LogLevel | LogDefinition>
    ? GetLogType<T[number]>
    : never;

  export type QueryEvent = {
    timestamp: Date
    query: string
    params: string
    duration: number
    target: string
  }

  export type LogEvent = {
    timestamp: Date
    message: string
    target: string
  }
  /* End Types for Logging */


  export type PrismaAction =
    | 'findUnique'
    | 'findUniqueOrThrow'
    | 'findMany'
    | 'findFirst'
    | 'findFirstOrThrow'
    | 'create'
    | 'createMany'
    | 'createManyAndReturn'
    | 'update'
    | 'updateMany'
    | 'updateManyAndReturn'
    | 'upsert'
    | 'delete'
    | 'deleteMany'
    | 'executeRaw'
    | 'queryRaw'
    | 'aggregate'
    | 'count'
    | 'runCommandRaw'
    | 'findRaw'
    | 'groupBy'

  /**
   * These options are being passed into the middleware as "params"
   */
  export type MiddlewareParams = {
    model?: ModelName
    action: PrismaAction
    args: any
    dataPath: string[]
    runInTransaction: boolean
  }

  /**
   * The `T` type makes sure, that the `return proceed` is not forgotten in the middleware implementation
   */
  export type Middleware<T = any> = (
    params: MiddlewareParams,
    next: (params: MiddlewareParams) => $Utils.JsPromise<T>,
  ) => $Utils.JsPromise<T>

  // tested in getLogLevel.test.ts
  export function getLogLevel(log: Array<LogLevel | LogDefinition>): LogLevel | undefined;

  /**
   * `PrismaClient` proxy available in interactive transactions.
   */
  export type TransactionClient = Omit<Prisma.DefaultPrismaClient, runtime.ITXClientDenyList>

  export type Datasource = {
    url?: string
  }

  /**
   * Count Types
   */


  /**
   * Count Type UserCountOutputType
   */

  export type UserCountOutputType = {
    taxCerts: number
    userAddresses: number
  }

  export type UserCountOutputTypeSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    taxCerts?: boolean | UserCountOutputTypeCountTaxCertsArgs
    userAddresses?: boolean | UserCountOutputTypeCountUserAddressesArgs
  }

  // Custom InputTypes
  /**
   * UserCountOutputType without action
   */
  export type UserCountOutputTypeDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the UserCountOutputType
     */
    select?: UserCountOutputTypeSelect<ExtArgs> | null
  }

  /**
   * UserCountOutputType without action
   */
  export type UserCountOutputTypeCountTaxCertsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: TaxCertWhereInput
  }

  /**
   * UserCountOutputType without action
   */
  export type UserCountOutputTypeCountUserAddressesArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: UserAddressWhereInput
  }


  /**
   * Count Type AddressCountOutputType
   */

  export type AddressCountOutputType = {
    userAddresses: number
  }

  export type AddressCountOutputTypeSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    userAddresses?: boolean | AddressCountOutputTypeCountUserAddressesArgs
  }

  // Custom InputTypes
  /**
   * AddressCountOutputType without action
   */
  export type AddressCountOutputTypeDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AddressCountOutputType
     */
    select?: AddressCountOutputTypeSelect<ExtArgs> | null
  }

  /**
   * AddressCountOutputType without action
   */
  export type AddressCountOutputTypeCountUserAddressesArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: UserAddressWhereInput
  }


  /**
   * Count Type UserAddressCountOutputType
   */

  export type UserAddressCountOutputType = {
    realEstates: number
    stepResults: number
  }

  export type UserAddressCountOutputTypeSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    realEstates?: boolean | UserAddressCountOutputTypeCountRealEstatesArgs
    stepResults?: boolean | UserAddressCountOutputTypeCountStepResultsArgs
  }

  // Custom InputTypes
  /**
   * UserAddressCountOutputType without action
   */
  export type UserAddressCountOutputTypeDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the UserAddressCountOutputType
     */
    select?: UserAddressCountOutputTypeSelect<ExtArgs> | null
  }

  /**
   * UserAddressCountOutputType without action
   */
  export type UserAddressCountOutputTypeCountRealEstatesArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: RealEstateWhereInput
  }

  /**
   * UserAddressCountOutputType without action
   */
  export type UserAddressCountOutputTypeCountStepResultsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: StepResultWhereInput
  }


  /**
   * Count Type StepCountOutputType
   */

  export type StepCountOutputType = {
    stepResults: number
  }

  export type StepCountOutputTypeSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    stepResults?: boolean | StepCountOutputTypeCountStepResultsArgs
  }

  // Custom InputTypes
  /**
   * StepCountOutputType without action
   */
  export type StepCountOutputTypeDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the StepCountOutputType
     */
    select?: StepCountOutputTypeSelect<ExtArgs> | null
  }

  /**
   * StepCountOutputType without action
   */
  export type StepCountOutputTypeCountStepResultsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: StepResultWhereInput
  }


  /**
   * Models
   */

  /**
   * Model User
   */

  export type AggregateUser = {
    _count: UserCountAggregateOutputType | null
    _min: UserMinAggregateOutputType | null
    _max: UserMaxAggregateOutputType | null
  }

  export type UserMinAggregateOutputType = {
    id: string | null
    name: string | null
    nickname: string | null
    username: string | null
    password: string | null
    pinNumber: string | null
    phoneNumber: string | null
  }

  export type UserMaxAggregateOutputType = {
    id: string | null
    name: string | null
    nickname: string | null
    username: string | null
    password: string | null
    pinNumber: string | null
    phoneNumber: string | null
  }

  export type UserCountAggregateOutputType = {
    id: number
    name: number
    nickname: number
    username: number
    password: number
    pinNumber: number
    phoneNumber: number
    _all: number
  }


  export type UserMinAggregateInputType = {
    id?: true
    name?: true
    nickname?: true
    username?: true
    password?: true
    pinNumber?: true
    phoneNumber?: true
  }

  export type UserMaxAggregateInputType = {
    id?: true
    name?: true
    nickname?: true
    username?: true
    password?: true
    pinNumber?: true
    phoneNumber?: true
  }

  export type UserCountAggregateInputType = {
    id?: true
    name?: true
    nickname?: true
    username?: true
    password?: true
    pinNumber?: true
    phoneNumber?: true
    _all?: true
  }

  export type UserAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which User to aggregate.
     */
    where?: UserWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Users to fetch.
     */
    orderBy?: UserOrderByWithRelationInput | UserOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: UserWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Users from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Users.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned Users
    **/
    _count?: true | UserCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: UserMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: UserMaxAggregateInputType
  }

  export type GetUserAggregateType<T extends UserAggregateArgs> = {
        [P in keyof T & keyof AggregateUser]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateUser[P]>
      : GetScalarType<T[P], AggregateUser[P]>
  }




  export type UserGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: UserWhereInput
    orderBy?: UserOrderByWithAggregationInput | UserOrderByWithAggregationInput[]
    by: UserScalarFieldEnum[] | UserScalarFieldEnum
    having?: UserScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: UserCountAggregateInputType | true
    _min?: UserMinAggregateInputType
    _max?: UserMaxAggregateInputType
  }

  export type UserGroupByOutputType = {
    id: string
    name: string | null
    nickname: string | null
    username: string | null
    password: string | null
    pinNumber: string | null
    phoneNumber: string | null
    _count: UserCountAggregateOutputType | null
    _min: UserMinAggregateOutputType | null
    _max: UserMaxAggregateOutputType | null
  }

  type GetUserGroupByPayload<T extends UserGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<UserGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof UserGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], UserGroupByOutputType[P]>
            : GetScalarType<T[P], UserGroupByOutputType[P]>
        }
      >
    >


  export type UserSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    name?: boolean
    nickname?: boolean
    username?: boolean
    password?: boolean
    pinNumber?: boolean
    phoneNumber?: boolean
    taxCerts?: boolean | User$taxCertsArgs<ExtArgs>
    userAddresses?: boolean | User$userAddressesArgs<ExtArgs>
    _count?: boolean | UserCountOutputTypeDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["user"]>

  export type UserSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    name?: boolean
    nickname?: boolean
    username?: boolean
    password?: boolean
    pinNumber?: boolean
    phoneNumber?: boolean
  }, ExtArgs["result"]["user"]>

  export type UserSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    name?: boolean
    nickname?: boolean
    username?: boolean
    password?: boolean
    pinNumber?: boolean
    phoneNumber?: boolean
  }, ExtArgs["result"]["user"]>

  export type UserSelectScalar = {
    id?: boolean
    name?: boolean
    nickname?: boolean
    username?: boolean
    password?: boolean
    pinNumber?: boolean
    phoneNumber?: boolean
  }

  export type UserOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "name" | "nickname" | "username" | "password" | "pinNumber" | "phoneNumber", ExtArgs["result"]["user"]>
  export type UserInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    taxCerts?: boolean | User$taxCertsArgs<ExtArgs>
    userAddresses?: boolean | User$userAddressesArgs<ExtArgs>
    _count?: boolean | UserCountOutputTypeDefaultArgs<ExtArgs>
  }
  export type UserIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {}
  export type UserIncludeUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {}

  export type $UserPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "User"
    objects: {
      taxCerts: Prisma.$TaxCertPayload<ExtArgs>[]
      userAddresses: Prisma.$UserAddressPayload<ExtArgs>[]
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      name: string | null
      nickname: string | null
      username: string | null
      password: string | null
      pinNumber: string | null
      phoneNumber: string | null
    }, ExtArgs["result"]["user"]>
    composites: {}
  }

  type UserGetPayload<S extends boolean | null | undefined | UserDefaultArgs> = $Result.GetResult<Prisma.$UserPayload, S>

  type UserCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<UserFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: UserCountAggregateInputType | true
    }

  export interface UserDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['User'], meta: { name: 'User' } }
    /**
     * Find zero or one User that matches the filter.
     * @param {UserFindUniqueArgs} args - Arguments to find a User
     * @example
     * // Get one User
     * const user = await prisma.user.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends UserFindUniqueArgs>(args: SelectSubset<T, UserFindUniqueArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one User that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {UserFindUniqueOrThrowArgs} args - Arguments to find a User
     * @example
     * // Get one User
     * const user = await prisma.user.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends UserFindUniqueOrThrowArgs>(args: SelectSubset<T, UserFindUniqueOrThrowArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first User that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserFindFirstArgs} args - Arguments to find a User
     * @example
     * // Get one User
     * const user = await prisma.user.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends UserFindFirstArgs>(args?: SelectSubset<T, UserFindFirstArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first User that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserFindFirstOrThrowArgs} args - Arguments to find a User
     * @example
     * // Get one User
     * const user = await prisma.user.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends UserFindFirstOrThrowArgs>(args?: SelectSubset<T, UserFindFirstOrThrowArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more Users that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all Users
     * const users = await prisma.user.findMany()
     * 
     * // Get first 10 Users
     * const users = await prisma.user.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const userWithIdOnly = await prisma.user.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends UserFindManyArgs>(args?: SelectSubset<T, UserFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a User.
     * @param {UserCreateArgs} args - Arguments to create a User.
     * @example
     * // Create one User
     * const User = await prisma.user.create({
     *   data: {
     *     // ... data to create a User
     *   }
     * })
     * 
     */
    create<T extends UserCreateArgs>(args: SelectSubset<T, UserCreateArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many Users.
     * @param {UserCreateManyArgs} args - Arguments to create many Users.
     * @example
     * // Create many Users
     * const user = await prisma.user.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends UserCreateManyArgs>(args?: SelectSubset<T, UserCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many Users and returns the data saved in the database.
     * @param {UserCreateManyAndReturnArgs} args - Arguments to create many Users.
     * @example
     * // Create many Users
     * const user = await prisma.user.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many Users and only return the `id`
     * const userWithIdOnly = await prisma.user.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends UserCreateManyAndReturnArgs>(args?: SelectSubset<T, UserCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a User.
     * @param {UserDeleteArgs} args - Arguments to delete one User.
     * @example
     * // Delete one User
     * const User = await prisma.user.delete({
     *   where: {
     *     // ... filter to delete one User
     *   }
     * })
     * 
     */
    delete<T extends UserDeleteArgs>(args: SelectSubset<T, UserDeleteArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one User.
     * @param {UserUpdateArgs} args - Arguments to update one User.
     * @example
     * // Update one User
     * const user = await prisma.user.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends UserUpdateArgs>(args: SelectSubset<T, UserUpdateArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more Users.
     * @param {UserDeleteManyArgs} args - Arguments to filter Users to delete.
     * @example
     * // Delete a few Users
     * const { count } = await prisma.user.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends UserDeleteManyArgs>(args?: SelectSubset<T, UserDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Users.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many Users
     * const user = await prisma.user.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends UserUpdateManyArgs>(args: SelectSubset<T, UserUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Users and returns the data updated in the database.
     * @param {UserUpdateManyAndReturnArgs} args - Arguments to update many Users.
     * @example
     * // Update many Users
     * const user = await prisma.user.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more Users and only return the `id`
     * const userWithIdOnly = await prisma.user.updateManyAndReturn({
     *   select: { id: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    updateManyAndReturn<T extends UserUpdateManyAndReturnArgs>(args: SelectSubset<T, UserUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one User.
     * @param {UserUpsertArgs} args - Arguments to update or create a User.
     * @example
     * // Update or create a User
     * const user = await prisma.user.upsert({
     *   create: {
     *     // ... data to create a User
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the User we want to update
     *   }
     * })
     */
    upsert<T extends UserUpsertArgs>(args: SelectSubset<T, UserUpsertArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of Users.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserCountArgs} args - Arguments to filter Users to count.
     * @example
     * // Count the number of Users
     * const count = await prisma.user.count({
     *   where: {
     *     // ... the filter for the Users we want to count
     *   }
     * })
    **/
    count<T extends UserCountArgs>(
      args?: Subset<T, UserCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], UserCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a User.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends UserAggregateArgs>(args: Subset<T, UserAggregateArgs>): Prisma.PrismaPromise<GetUserAggregateType<T>>

    /**
     * Group by User.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends UserGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: UserGroupByArgs['orderBy'] }
        : { orderBy?: UserGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, UserGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetUserGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the User model
   */
  readonly fields: UserFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for User.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__UserClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    taxCerts<T extends User$taxCertsArgs<ExtArgs> = {}>(args?: Subset<T, User$taxCertsArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$TaxCertPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
    userAddresses<T extends User$userAddressesArgs<ExtArgs> = {}>(args?: Subset<T, User$userAddressesArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$UserAddressPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the User model
   */
  interface UserFieldRefs {
    readonly id: FieldRef<"User", 'String'>
    readonly name: FieldRef<"User", 'String'>
    readonly nickname: FieldRef<"User", 'String'>
    readonly username: FieldRef<"User", 'String'>
    readonly password: FieldRef<"User", 'String'>
    readonly pinNumber: FieldRef<"User", 'String'>
    readonly phoneNumber: FieldRef<"User", 'String'>
  }
    

  // Custom InputTypes
  /**
   * User findUnique
   */
  export type UserFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Omit specific fields from the User
     */
    omit?: UserOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
    /**
     * Filter, which User to fetch.
     */
    where: UserWhereUniqueInput
  }

  /**
   * User findUniqueOrThrow
   */
  export type UserFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Omit specific fields from the User
     */
    omit?: UserOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
    /**
     * Filter, which User to fetch.
     */
    where: UserWhereUniqueInput
  }

  /**
   * User findFirst
   */
  export type UserFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Omit specific fields from the User
     */
    omit?: UserOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
    /**
     * Filter, which User to fetch.
     */
    where?: UserWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Users to fetch.
     */
    orderBy?: UserOrderByWithRelationInput | UserOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Users.
     */
    cursor?: UserWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Users from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Users.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Users.
     */
    distinct?: UserScalarFieldEnum | UserScalarFieldEnum[]
  }

  /**
   * User findFirstOrThrow
   */
  export type UserFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Omit specific fields from the User
     */
    omit?: UserOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
    /**
     * Filter, which User to fetch.
     */
    where?: UserWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Users to fetch.
     */
    orderBy?: UserOrderByWithRelationInput | UserOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Users.
     */
    cursor?: UserWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Users from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Users.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Users.
     */
    distinct?: UserScalarFieldEnum | UserScalarFieldEnum[]
  }

  /**
   * User findMany
   */
  export type UserFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Omit specific fields from the User
     */
    omit?: UserOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
    /**
     * Filter, which Users to fetch.
     */
    where?: UserWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Users to fetch.
     */
    orderBy?: UserOrderByWithRelationInput | UserOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing Users.
     */
    cursor?: UserWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Users from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Users.
     */
    skip?: number
    distinct?: UserScalarFieldEnum | UserScalarFieldEnum[]
  }

  /**
   * User create
   */
  export type UserCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Omit specific fields from the User
     */
    omit?: UserOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
    /**
     * The data needed to create a User.
     */
    data?: XOR<UserCreateInput, UserUncheckedCreateInput>
  }

  /**
   * User createMany
   */
  export type UserCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many Users.
     */
    data: UserCreateManyInput | UserCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * User createManyAndReturn
   */
  export type UserCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the User
     */
    omit?: UserOmit<ExtArgs> | null
    /**
     * The data used to create many Users.
     */
    data: UserCreateManyInput | UserCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * User update
   */
  export type UserUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Omit specific fields from the User
     */
    omit?: UserOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
    /**
     * The data needed to update a User.
     */
    data: XOR<UserUpdateInput, UserUncheckedUpdateInput>
    /**
     * Choose, which User to update.
     */
    where: UserWhereUniqueInput
  }

  /**
   * User updateMany
   */
  export type UserUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update Users.
     */
    data: XOR<UserUpdateManyMutationInput, UserUncheckedUpdateManyInput>
    /**
     * Filter which Users to update
     */
    where?: UserWhereInput
    /**
     * Limit how many Users to update.
     */
    limit?: number
  }

  /**
   * User updateManyAndReturn
   */
  export type UserUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the User
     */
    omit?: UserOmit<ExtArgs> | null
    /**
     * The data used to update Users.
     */
    data: XOR<UserUpdateManyMutationInput, UserUncheckedUpdateManyInput>
    /**
     * Filter which Users to update
     */
    where?: UserWhereInput
    /**
     * Limit how many Users to update.
     */
    limit?: number
  }

  /**
   * User upsert
   */
  export type UserUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Omit specific fields from the User
     */
    omit?: UserOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
    /**
     * The filter to search for the User to update in case it exists.
     */
    where: UserWhereUniqueInput
    /**
     * In case the User found by the `where` argument doesn't exist, create a new User with this data.
     */
    create: XOR<UserCreateInput, UserUncheckedCreateInput>
    /**
     * In case the User was found with the provided `where` argument, update it with this data.
     */
    update: XOR<UserUpdateInput, UserUncheckedUpdateInput>
  }

  /**
   * User delete
   */
  export type UserDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Omit specific fields from the User
     */
    omit?: UserOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
    /**
     * Filter which User to delete.
     */
    where: UserWhereUniqueInput
  }

  /**
   * User deleteMany
   */
  export type UserDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Users to delete
     */
    where?: UserWhereInput
    /**
     * Limit how many Users to delete.
     */
    limit?: number
  }

  /**
   * User.taxCerts
   */
  export type User$taxCertsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the TaxCert
     */
    select?: TaxCertSelect<ExtArgs> | null
    /**
     * Omit specific fields from the TaxCert
     */
    omit?: TaxCertOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TaxCertInclude<ExtArgs> | null
    where?: TaxCertWhereInput
    orderBy?: TaxCertOrderByWithRelationInput | TaxCertOrderByWithRelationInput[]
    cursor?: TaxCertWhereUniqueInput
    take?: number
    skip?: number
    distinct?: TaxCertScalarFieldEnum | TaxCertScalarFieldEnum[]
  }

  /**
   * User.userAddresses
   */
  export type User$userAddressesArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the UserAddress
     */
    select?: UserAddressSelect<ExtArgs> | null
    /**
     * Omit specific fields from the UserAddress
     */
    omit?: UserAddressOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserAddressInclude<ExtArgs> | null
    where?: UserAddressWhereInput
    orderBy?: UserAddressOrderByWithRelationInput | UserAddressOrderByWithRelationInput[]
    cursor?: UserAddressWhereUniqueInput
    take?: number
    skip?: number
    distinct?: UserAddressScalarFieldEnum | UserAddressScalarFieldEnum[]
  }

  /**
   * User without action
   */
  export type UserDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Omit specific fields from the User
     */
    omit?: UserOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
  }


  /**
   * Model TaxCert
   */

  export type AggregateTaxCert = {
    _count: TaxCertCountAggregateOutputType | null
    _avg: TaxCertAvgAggregateOutputType | null
    _sum: TaxCertSumAggregateOutputType | null
    _min: TaxCertMinAggregateOutputType | null
    _max: TaxCertMaxAggregateOutputType | null
  }

  export type TaxCertAvgAggregateOutputType = {
    id: number | null
  }

  export type TaxCertSumAggregateOutputType = {
    id: number | null
  }

  export type TaxCertMinAggregateOutputType = {
    id: number | null
    userId: string | null
  }

  export type TaxCertMaxAggregateOutputType = {
    id: number | null
    userId: string | null
  }

  export type TaxCertCountAggregateOutputType = {
    id: number
    userId: number
    taxCertJson: number
    _all: number
  }


  export type TaxCertAvgAggregateInputType = {
    id?: true
  }

  export type TaxCertSumAggregateInputType = {
    id?: true
  }

  export type TaxCertMinAggregateInputType = {
    id?: true
    userId?: true
  }

  export type TaxCertMaxAggregateInputType = {
    id?: true
    userId?: true
  }

  export type TaxCertCountAggregateInputType = {
    id?: true
    userId?: true
    taxCertJson?: true
    _all?: true
  }

  export type TaxCertAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which TaxCert to aggregate.
     */
    where?: TaxCertWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of TaxCerts to fetch.
     */
    orderBy?: TaxCertOrderByWithRelationInput | TaxCertOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: TaxCertWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` TaxCerts from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` TaxCerts.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned TaxCerts
    **/
    _count?: true | TaxCertCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: TaxCertAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: TaxCertSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: TaxCertMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: TaxCertMaxAggregateInputType
  }

  export type GetTaxCertAggregateType<T extends TaxCertAggregateArgs> = {
        [P in keyof T & keyof AggregateTaxCert]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateTaxCert[P]>
      : GetScalarType<T[P], AggregateTaxCert[P]>
  }




  export type TaxCertGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: TaxCertWhereInput
    orderBy?: TaxCertOrderByWithAggregationInput | TaxCertOrderByWithAggregationInput[]
    by: TaxCertScalarFieldEnum[] | TaxCertScalarFieldEnum
    having?: TaxCertScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: TaxCertCountAggregateInputType | true
    _avg?: TaxCertAvgAggregateInputType
    _sum?: TaxCertSumAggregateInputType
    _min?: TaxCertMinAggregateInputType
    _max?: TaxCertMaxAggregateInputType
  }

  export type TaxCertGroupByOutputType = {
    id: number
    userId: string
    taxCertJson: JsonValue | null
    _count: TaxCertCountAggregateOutputType | null
    _avg: TaxCertAvgAggregateOutputType | null
    _sum: TaxCertSumAggregateOutputType | null
    _min: TaxCertMinAggregateOutputType | null
    _max: TaxCertMaxAggregateOutputType | null
  }

  type GetTaxCertGroupByPayload<T extends TaxCertGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<TaxCertGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof TaxCertGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], TaxCertGroupByOutputType[P]>
            : GetScalarType<T[P], TaxCertGroupByOutputType[P]>
        }
      >
    >


  export type TaxCertSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    userId?: boolean
    taxCertJson?: boolean
    user?: boolean | UserDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["taxCert"]>

  export type TaxCertSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    userId?: boolean
    taxCertJson?: boolean
    user?: boolean | UserDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["taxCert"]>

  export type TaxCertSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    userId?: boolean
    taxCertJson?: boolean
    user?: boolean | UserDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["taxCert"]>

  export type TaxCertSelectScalar = {
    id?: boolean
    userId?: boolean
    taxCertJson?: boolean
  }

  export type TaxCertOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "userId" | "taxCertJson", ExtArgs["result"]["taxCert"]>
  export type TaxCertInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    user?: boolean | UserDefaultArgs<ExtArgs>
  }
  export type TaxCertIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    user?: boolean | UserDefaultArgs<ExtArgs>
  }
  export type TaxCertIncludeUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    user?: boolean | UserDefaultArgs<ExtArgs>
  }

  export type $TaxCertPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "TaxCert"
    objects: {
      user: Prisma.$UserPayload<ExtArgs>
    }
    scalars: $Extensions.GetPayloadResult<{
      id: number
      userId: string
      taxCertJson: Prisma.JsonValue | null
    }, ExtArgs["result"]["taxCert"]>
    composites: {}
  }

  type TaxCertGetPayload<S extends boolean | null | undefined | TaxCertDefaultArgs> = $Result.GetResult<Prisma.$TaxCertPayload, S>

  type TaxCertCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<TaxCertFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: TaxCertCountAggregateInputType | true
    }

  export interface TaxCertDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['TaxCert'], meta: { name: 'TaxCert' } }
    /**
     * Find zero or one TaxCert that matches the filter.
     * @param {TaxCertFindUniqueArgs} args - Arguments to find a TaxCert
     * @example
     * // Get one TaxCert
     * const taxCert = await prisma.taxCert.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends TaxCertFindUniqueArgs>(args: SelectSubset<T, TaxCertFindUniqueArgs<ExtArgs>>): Prisma__TaxCertClient<$Result.GetResult<Prisma.$TaxCertPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one TaxCert that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {TaxCertFindUniqueOrThrowArgs} args - Arguments to find a TaxCert
     * @example
     * // Get one TaxCert
     * const taxCert = await prisma.taxCert.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends TaxCertFindUniqueOrThrowArgs>(args: SelectSubset<T, TaxCertFindUniqueOrThrowArgs<ExtArgs>>): Prisma__TaxCertClient<$Result.GetResult<Prisma.$TaxCertPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first TaxCert that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {TaxCertFindFirstArgs} args - Arguments to find a TaxCert
     * @example
     * // Get one TaxCert
     * const taxCert = await prisma.taxCert.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends TaxCertFindFirstArgs>(args?: SelectSubset<T, TaxCertFindFirstArgs<ExtArgs>>): Prisma__TaxCertClient<$Result.GetResult<Prisma.$TaxCertPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first TaxCert that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {TaxCertFindFirstOrThrowArgs} args - Arguments to find a TaxCert
     * @example
     * // Get one TaxCert
     * const taxCert = await prisma.taxCert.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends TaxCertFindFirstOrThrowArgs>(args?: SelectSubset<T, TaxCertFindFirstOrThrowArgs<ExtArgs>>): Prisma__TaxCertClient<$Result.GetResult<Prisma.$TaxCertPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more TaxCerts that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {TaxCertFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all TaxCerts
     * const taxCerts = await prisma.taxCert.findMany()
     * 
     * // Get first 10 TaxCerts
     * const taxCerts = await prisma.taxCert.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const taxCertWithIdOnly = await prisma.taxCert.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends TaxCertFindManyArgs>(args?: SelectSubset<T, TaxCertFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$TaxCertPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a TaxCert.
     * @param {TaxCertCreateArgs} args - Arguments to create a TaxCert.
     * @example
     * // Create one TaxCert
     * const TaxCert = await prisma.taxCert.create({
     *   data: {
     *     // ... data to create a TaxCert
     *   }
     * })
     * 
     */
    create<T extends TaxCertCreateArgs>(args: SelectSubset<T, TaxCertCreateArgs<ExtArgs>>): Prisma__TaxCertClient<$Result.GetResult<Prisma.$TaxCertPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many TaxCerts.
     * @param {TaxCertCreateManyArgs} args - Arguments to create many TaxCerts.
     * @example
     * // Create many TaxCerts
     * const taxCert = await prisma.taxCert.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends TaxCertCreateManyArgs>(args?: SelectSubset<T, TaxCertCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many TaxCerts and returns the data saved in the database.
     * @param {TaxCertCreateManyAndReturnArgs} args - Arguments to create many TaxCerts.
     * @example
     * // Create many TaxCerts
     * const taxCert = await prisma.taxCert.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many TaxCerts and only return the `id`
     * const taxCertWithIdOnly = await prisma.taxCert.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends TaxCertCreateManyAndReturnArgs>(args?: SelectSubset<T, TaxCertCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$TaxCertPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a TaxCert.
     * @param {TaxCertDeleteArgs} args - Arguments to delete one TaxCert.
     * @example
     * // Delete one TaxCert
     * const TaxCert = await prisma.taxCert.delete({
     *   where: {
     *     // ... filter to delete one TaxCert
     *   }
     * })
     * 
     */
    delete<T extends TaxCertDeleteArgs>(args: SelectSubset<T, TaxCertDeleteArgs<ExtArgs>>): Prisma__TaxCertClient<$Result.GetResult<Prisma.$TaxCertPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one TaxCert.
     * @param {TaxCertUpdateArgs} args - Arguments to update one TaxCert.
     * @example
     * // Update one TaxCert
     * const taxCert = await prisma.taxCert.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends TaxCertUpdateArgs>(args: SelectSubset<T, TaxCertUpdateArgs<ExtArgs>>): Prisma__TaxCertClient<$Result.GetResult<Prisma.$TaxCertPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more TaxCerts.
     * @param {TaxCertDeleteManyArgs} args - Arguments to filter TaxCerts to delete.
     * @example
     * // Delete a few TaxCerts
     * const { count } = await prisma.taxCert.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends TaxCertDeleteManyArgs>(args?: SelectSubset<T, TaxCertDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more TaxCerts.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {TaxCertUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many TaxCerts
     * const taxCert = await prisma.taxCert.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends TaxCertUpdateManyArgs>(args: SelectSubset<T, TaxCertUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more TaxCerts and returns the data updated in the database.
     * @param {TaxCertUpdateManyAndReturnArgs} args - Arguments to update many TaxCerts.
     * @example
     * // Update many TaxCerts
     * const taxCert = await prisma.taxCert.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more TaxCerts and only return the `id`
     * const taxCertWithIdOnly = await prisma.taxCert.updateManyAndReturn({
     *   select: { id: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    updateManyAndReturn<T extends TaxCertUpdateManyAndReturnArgs>(args: SelectSubset<T, TaxCertUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$TaxCertPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one TaxCert.
     * @param {TaxCertUpsertArgs} args - Arguments to update or create a TaxCert.
     * @example
     * // Update or create a TaxCert
     * const taxCert = await prisma.taxCert.upsert({
     *   create: {
     *     // ... data to create a TaxCert
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the TaxCert we want to update
     *   }
     * })
     */
    upsert<T extends TaxCertUpsertArgs>(args: SelectSubset<T, TaxCertUpsertArgs<ExtArgs>>): Prisma__TaxCertClient<$Result.GetResult<Prisma.$TaxCertPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of TaxCerts.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {TaxCertCountArgs} args - Arguments to filter TaxCerts to count.
     * @example
     * // Count the number of TaxCerts
     * const count = await prisma.taxCert.count({
     *   where: {
     *     // ... the filter for the TaxCerts we want to count
     *   }
     * })
    **/
    count<T extends TaxCertCountArgs>(
      args?: Subset<T, TaxCertCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], TaxCertCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a TaxCert.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {TaxCertAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends TaxCertAggregateArgs>(args: Subset<T, TaxCertAggregateArgs>): Prisma.PrismaPromise<GetTaxCertAggregateType<T>>

    /**
     * Group by TaxCert.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {TaxCertGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends TaxCertGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: TaxCertGroupByArgs['orderBy'] }
        : { orderBy?: TaxCertGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, TaxCertGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetTaxCertGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the TaxCert model
   */
  readonly fields: TaxCertFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for TaxCert.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__TaxCertClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    user<T extends UserDefaultArgs<ExtArgs> = {}>(args?: Subset<T, UserDefaultArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the TaxCert model
   */
  interface TaxCertFieldRefs {
    readonly id: FieldRef<"TaxCert", 'Int'>
    readonly userId: FieldRef<"TaxCert", 'String'>
    readonly taxCertJson: FieldRef<"TaxCert", 'Json'>
  }
    

  // Custom InputTypes
  /**
   * TaxCert findUnique
   */
  export type TaxCertFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the TaxCert
     */
    select?: TaxCertSelect<ExtArgs> | null
    /**
     * Omit specific fields from the TaxCert
     */
    omit?: TaxCertOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TaxCertInclude<ExtArgs> | null
    /**
     * Filter, which TaxCert to fetch.
     */
    where: TaxCertWhereUniqueInput
  }

  /**
   * TaxCert findUniqueOrThrow
   */
  export type TaxCertFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the TaxCert
     */
    select?: TaxCertSelect<ExtArgs> | null
    /**
     * Omit specific fields from the TaxCert
     */
    omit?: TaxCertOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TaxCertInclude<ExtArgs> | null
    /**
     * Filter, which TaxCert to fetch.
     */
    where: TaxCertWhereUniqueInput
  }

  /**
   * TaxCert findFirst
   */
  export type TaxCertFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the TaxCert
     */
    select?: TaxCertSelect<ExtArgs> | null
    /**
     * Omit specific fields from the TaxCert
     */
    omit?: TaxCertOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TaxCertInclude<ExtArgs> | null
    /**
     * Filter, which TaxCert to fetch.
     */
    where?: TaxCertWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of TaxCerts to fetch.
     */
    orderBy?: TaxCertOrderByWithRelationInput | TaxCertOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for TaxCerts.
     */
    cursor?: TaxCertWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` TaxCerts from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` TaxCerts.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of TaxCerts.
     */
    distinct?: TaxCertScalarFieldEnum | TaxCertScalarFieldEnum[]
  }

  /**
   * TaxCert findFirstOrThrow
   */
  export type TaxCertFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the TaxCert
     */
    select?: TaxCertSelect<ExtArgs> | null
    /**
     * Omit specific fields from the TaxCert
     */
    omit?: TaxCertOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TaxCertInclude<ExtArgs> | null
    /**
     * Filter, which TaxCert to fetch.
     */
    where?: TaxCertWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of TaxCerts to fetch.
     */
    orderBy?: TaxCertOrderByWithRelationInput | TaxCertOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for TaxCerts.
     */
    cursor?: TaxCertWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` TaxCerts from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` TaxCerts.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of TaxCerts.
     */
    distinct?: TaxCertScalarFieldEnum | TaxCertScalarFieldEnum[]
  }

  /**
   * TaxCert findMany
   */
  export type TaxCertFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the TaxCert
     */
    select?: TaxCertSelect<ExtArgs> | null
    /**
     * Omit specific fields from the TaxCert
     */
    omit?: TaxCertOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TaxCertInclude<ExtArgs> | null
    /**
     * Filter, which TaxCerts to fetch.
     */
    where?: TaxCertWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of TaxCerts to fetch.
     */
    orderBy?: TaxCertOrderByWithRelationInput | TaxCertOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing TaxCerts.
     */
    cursor?: TaxCertWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` TaxCerts from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` TaxCerts.
     */
    skip?: number
    distinct?: TaxCertScalarFieldEnum | TaxCertScalarFieldEnum[]
  }

  /**
   * TaxCert create
   */
  export type TaxCertCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the TaxCert
     */
    select?: TaxCertSelect<ExtArgs> | null
    /**
     * Omit specific fields from the TaxCert
     */
    omit?: TaxCertOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TaxCertInclude<ExtArgs> | null
    /**
     * The data needed to create a TaxCert.
     */
    data: XOR<TaxCertCreateInput, TaxCertUncheckedCreateInput>
  }

  /**
   * TaxCert createMany
   */
  export type TaxCertCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many TaxCerts.
     */
    data: TaxCertCreateManyInput | TaxCertCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * TaxCert createManyAndReturn
   */
  export type TaxCertCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the TaxCert
     */
    select?: TaxCertSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the TaxCert
     */
    omit?: TaxCertOmit<ExtArgs> | null
    /**
     * The data used to create many TaxCerts.
     */
    data: TaxCertCreateManyInput | TaxCertCreateManyInput[]
    skipDuplicates?: boolean
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TaxCertIncludeCreateManyAndReturn<ExtArgs> | null
  }

  /**
   * TaxCert update
   */
  export type TaxCertUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the TaxCert
     */
    select?: TaxCertSelect<ExtArgs> | null
    /**
     * Omit specific fields from the TaxCert
     */
    omit?: TaxCertOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TaxCertInclude<ExtArgs> | null
    /**
     * The data needed to update a TaxCert.
     */
    data: XOR<TaxCertUpdateInput, TaxCertUncheckedUpdateInput>
    /**
     * Choose, which TaxCert to update.
     */
    where: TaxCertWhereUniqueInput
  }

  /**
   * TaxCert updateMany
   */
  export type TaxCertUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update TaxCerts.
     */
    data: XOR<TaxCertUpdateManyMutationInput, TaxCertUncheckedUpdateManyInput>
    /**
     * Filter which TaxCerts to update
     */
    where?: TaxCertWhereInput
    /**
     * Limit how many TaxCerts to update.
     */
    limit?: number
  }

  /**
   * TaxCert updateManyAndReturn
   */
  export type TaxCertUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the TaxCert
     */
    select?: TaxCertSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the TaxCert
     */
    omit?: TaxCertOmit<ExtArgs> | null
    /**
     * The data used to update TaxCerts.
     */
    data: XOR<TaxCertUpdateManyMutationInput, TaxCertUncheckedUpdateManyInput>
    /**
     * Filter which TaxCerts to update
     */
    where?: TaxCertWhereInput
    /**
     * Limit how many TaxCerts to update.
     */
    limit?: number
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TaxCertIncludeUpdateManyAndReturn<ExtArgs> | null
  }

  /**
   * TaxCert upsert
   */
  export type TaxCertUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the TaxCert
     */
    select?: TaxCertSelect<ExtArgs> | null
    /**
     * Omit specific fields from the TaxCert
     */
    omit?: TaxCertOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TaxCertInclude<ExtArgs> | null
    /**
     * The filter to search for the TaxCert to update in case it exists.
     */
    where: TaxCertWhereUniqueInput
    /**
     * In case the TaxCert found by the `where` argument doesn't exist, create a new TaxCert with this data.
     */
    create: XOR<TaxCertCreateInput, TaxCertUncheckedCreateInput>
    /**
     * In case the TaxCert was found with the provided `where` argument, update it with this data.
     */
    update: XOR<TaxCertUpdateInput, TaxCertUncheckedUpdateInput>
  }

  /**
   * TaxCert delete
   */
  export type TaxCertDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the TaxCert
     */
    select?: TaxCertSelect<ExtArgs> | null
    /**
     * Omit specific fields from the TaxCert
     */
    omit?: TaxCertOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TaxCertInclude<ExtArgs> | null
    /**
     * Filter which TaxCert to delete.
     */
    where: TaxCertWhereUniqueInput
  }

  /**
   * TaxCert deleteMany
   */
  export type TaxCertDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which TaxCerts to delete
     */
    where?: TaxCertWhereInput
    /**
     * Limit how many TaxCerts to delete.
     */
    limit?: number
  }

  /**
   * TaxCert without action
   */
  export type TaxCertDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the TaxCert
     */
    select?: TaxCertSelect<ExtArgs> | null
    /**
     * Omit specific fields from the TaxCert
     */
    omit?: TaxCertOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TaxCertInclude<ExtArgs> | null
  }


  /**
   * Model Address
   */

  export type AggregateAddress = {
    _count: AddressCountAggregateOutputType | null
    _avg: AddressAvgAggregateOutputType | null
    _sum: AddressSumAggregateOutputType | null
    _min: AddressMinAggregateOutputType | null
    _max: AddressMaxAggregateOutputType | null
  }

  export type AddressAvgAggregateOutputType = {
    id: number | null
    latitude: number | null
    longitude: number | null
  }

  export type AddressSumAggregateOutputType = {
    id: number | null
    latitude: number | null
    longitude: number | null
  }

  export type AddressMinAggregateOutputType = {
    id: number | null
    latitude: number | null
    longitude: number | null
    legalDistrictCode: string | null
    dong: string | null
    ho: string | null
  }

  export type AddressMaxAggregateOutputType = {
    id: number | null
    latitude: number | null
    longitude: number | null
    legalDistrictCode: string | null
    dong: string | null
    ho: string | null
  }

  export type AddressCountAggregateOutputType = {
    id: number
    latitude: number
    longitude: number
    legalDistrictCode: number
    dong: number
    ho: number
    _all: number
  }


  export type AddressAvgAggregateInputType = {
    id?: true
    latitude?: true
    longitude?: true
  }

  export type AddressSumAggregateInputType = {
    id?: true
    latitude?: true
    longitude?: true
  }

  export type AddressMinAggregateInputType = {
    id?: true
    latitude?: true
    longitude?: true
    legalDistrictCode?: true
    dong?: true
    ho?: true
  }

  export type AddressMaxAggregateInputType = {
    id?: true
    latitude?: true
    longitude?: true
    legalDistrictCode?: true
    dong?: true
    ho?: true
  }

  export type AddressCountAggregateInputType = {
    id?: true
    latitude?: true
    longitude?: true
    legalDistrictCode?: true
    dong?: true
    ho?: true
    _all?: true
  }

  export type AddressAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Address to aggregate.
     */
    where?: AddressWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Addresses to fetch.
     */
    orderBy?: AddressOrderByWithRelationInput | AddressOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: AddressWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Addresses from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Addresses.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned Addresses
    **/
    _count?: true | AddressCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: AddressAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: AddressSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: AddressMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: AddressMaxAggregateInputType
  }

  export type GetAddressAggregateType<T extends AddressAggregateArgs> = {
        [P in keyof T & keyof AggregateAddress]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateAddress[P]>
      : GetScalarType<T[P], AggregateAddress[P]>
  }




  export type AddressGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: AddressWhereInput
    orderBy?: AddressOrderByWithAggregationInput | AddressOrderByWithAggregationInput[]
    by: AddressScalarFieldEnum[] | AddressScalarFieldEnum
    having?: AddressScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: AddressCountAggregateInputType | true
    _avg?: AddressAvgAggregateInputType
    _sum?: AddressSumAggregateInputType
    _min?: AddressMinAggregateInputType
    _max?: AddressMaxAggregateInputType
  }

  export type AddressGroupByOutputType = {
    id: number
    latitude: number | null
    longitude: number | null
    legalDistrictCode: string | null
    dong: string | null
    ho: string | null
    _count: AddressCountAggregateOutputType | null
    _avg: AddressAvgAggregateOutputType | null
    _sum: AddressSumAggregateOutputType | null
    _min: AddressMinAggregateOutputType | null
    _max: AddressMaxAggregateOutputType | null
  }

  type GetAddressGroupByPayload<T extends AddressGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<AddressGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof AddressGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], AddressGroupByOutputType[P]>
            : GetScalarType<T[P], AddressGroupByOutputType[P]>
        }
      >
    >


  export type AddressSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    latitude?: boolean
    longitude?: boolean
    legalDistrictCode?: boolean
    dong?: boolean
    ho?: boolean
    userAddresses?: boolean | Address$userAddressesArgs<ExtArgs>
    _count?: boolean | AddressCountOutputTypeDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["address"]>

  export type AddressSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    latitude?: boolean
    longitude?: boolean
    legalDistrictCode?: boolean
    dong?: boolean
    ho?: boolean
  }, ExtArgs["result"]["address"]>

  export type AddressSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    latitude?: boolean
    longitude?: boolean
    legalDistrictCode?: boolean
    dong?: boolean
    ho?: boolean
  }, ExtArgs["result"]["address"]>

  export type AddressSelectScalar = {
    id?: boolean
    latitude?: boolean
    longitude?: boolean
    legalDistrictCode?: boolean
    dong?: boolean
    ho?: boolean
  }

  export type AddressOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "latitude" | "longitude" | "legalDistrictCode" | "dong" | "ho", ExtArgs["result"]["address"]>
  export type AddressInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    userAddresses?: boolean | Address$userAddressesArgs<ExtArgs>
    _count?: boolean | AddressCountOutputTypeDefaultArgs<ExtArgs>
  }
  export type AddressIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {}
  export type AddressIncludeUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {}

  export type $AddressPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "Address"
    objects: {
      userAddresses: Prisma.$UserAddressPayload<ExtArgs>[]
    }
    scalars: $Extensions.GetPayloadResult<{
      id: number
      latitude: number | null
      longitude: number | null
      legalDistrictCode: string | null
      dong: string | null
      ho: string | null
    }, ExtArgs["result"]["address"]>
    composites: {}
  }

  type AddressGetPayload<S extends boolean | null | undefined | AddressDefaultArgs> = $Result.GetResult<Prisma.$AddressPayload, S>

  type AddressCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<AddressFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: AddressCountAggregateInputType | true
    }

  export interface AddressDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['Address'], meta: { name: 'Address' } }
    /**
     * Find zero or one Address that matches the filter.
     * @param {AddressFindUniqueArgs} args - Arguments to find a Address
     * @example
     * // Get one Address
     * const address = await prisma.address.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends AddressFindUniqueArgs>(args: SelectSubset<T, AddressFindUniqueArgs<ExtArgs>>): Prisma__AddressClient<$Result.GetResult<Prisma.$AddressPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one Address that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {AddressFindUniqueOrThrowArgs} args - Arguments to find a Address
     * @example
     * // Get one Address
     * const address = await prisma.address.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends AddressFindUniqueOrThrowArgs>(args: SelectSubset<T, AddressFindUniqueOrThrowArgs<ExtArgs>>): Prisma__AddressClient<$Result.GetResult<Prisma.$AddressPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Address that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AddressFindFirstArgs} args - Arguments to find a Address
     * @example
     * // Get one Address
     * const address = await prisma.address.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends AddressFindFirstArgs>(args?: SelectSubset<T, AddressFindFirstArgs<ExtArgs>>): Prisma__AddressClient<$Result.GetResult<Prisma.$AddressPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Address that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AddressFindFirstOrThrowArgs} args - Arguments to find a Address
     * @example
     * // Get one Address
     * const address = await prisma.address.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends AddressFindFirstOrThrowArgs>(args?: SelectSubset<T, AddressFindFirstOrThrowArgs<ExtArgs>>): Prisma__AddressClient<$Result.GetResult<Prisma.$AddressPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more Addresses that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AddressFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all Addresses
     * const addresses = await prisma.address.findMany()
     * 
     * // Get first 10 Addresses
     * const addresses = await prisma.address.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const addressWithIdOnly = await prisma.address.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends AddressFindManyArgs>(args?: SelectSubset<T, AddressFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$AddressPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a Address.
     * @param {AddressCreateArgs} args - Arguments to create a Address.
     * @example
     * // Create one Address
     * const Address = await prisma.address.create({
     *   data: {
     *     // ... data to create a Address
     *   }
     * })
     * 
     */
    create<T extends AddressCreateArgs>(args: SelectSubset<T, AddressCreateArgs<ExtArgs>>): Prisma__AddressClient<$Result.GetResult<Prisma.$AddressPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many Addresses.
     * @param {AddressCreateManyArgs} args - Arguments to create many Addresses.
     * @example
     * // Create many Addresses
     * const address = await prisma.address.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends AddressCreateManyArgs>(args?: SelectSubset<T, AddressCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many Addresses and returns the data saved in the database.
     * @param {AddressCreateManyAndReturnArgs} args - Arguments to create many Addresses.
     * @example
     * // Create many Addresses
     * const address = await prisma.address.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many Addresses and only return the `id`
     * const addressWithIdOnly = await prisma.address.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends AddressCreateManyAndReturnArgs>(args?: SelectSubset<T, AddressCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$AddressPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a Address.
     * @param {AddressDeleteArgs} args - Arguments to delete one Address.
     * @example
     * // Delete one Address
     * const Address = await prisma.address.delete({
     *   where: {
     *     // ... filter to delete one Address
     *   }
     * })
     * 
     */
    delete<T extends AddressDeleteArgs>(args: SelectSubset<T, AddressDeleteArgs<ExtArgs>>): Prisma__AddressClient<$Result.GetResult<Prisma.$AddressPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one Address.
     * @param {AddressUpdateArgs} args - Arguments to update one Address.
     * @example
     * // Update one Address
     * const address = await prisma.address.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends AddressUpdateArgs>(args: SelectSubset<T, AddressUpdateArgs<ExtArgs>>): Prisma__AddressClient<$Result.GetResult<Prisma.$AddressPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more Addresses.
     * @param {AddressDeleteManyArgs} args - Arguments to filter Addresses to delete.
     * @example
     * // Delete a few Addresses
     * const { count } = await prisma.address.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends AddressDeleteManyArgs>(args?: SelectSubset<T, AddressDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Addresses.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AddressUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many Addresses
     * const address = await prisma.address.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends AddressUpdateManyArgs>(args: SelectSubset<T, AddressUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Addresses and returns the data updated in the database.
     * @param {AddressUpdateManyAndReturnArgs} args - Arguments to update many Addresses.
     * @example
     * // Update many Addresses
     * const address = await prisma.address.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more Addresses and only return the `id`
     * const addressWithIdOnly = await prisma.address.updateManyAndReturn({
     *   select: { id: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    updateManyAndReturn<T extends AddressUpdateManyAndReturnArgs>(args: SelectSubset<T, AddressUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$AddressPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one Address.
     * @param {AddressUpsertArgs} args - Arguments to update or create a Address.
     * @example
     * // Update or create a Address
     * const address = await prisma.address.upsert({
     *   create: {
     *     // ... data to create a Address
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the Address we want to update
     *   }
     * })
     */
    upsert<T extends AddressUpsertArgs>(args: SelectSubset<T, AddressUpsertArgs<ExtArgs>>): Prisma__AddressClient<$Result.GetResult<Prisma.$AddressPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of Addresses.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AddressCountArgs} args - Arguments to filter Addresses to count.
     * @example
     * // Count the number of Addresses
     * const count = await prisma.address.count({
     *   where: {
     *     // ... the filter for the Addresses we want to count
     *   }
     * })
    **/
    count<T extends AddressCountArgs>(
      args?: Subset<T, AddressCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], AddressCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a Address.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AddressAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends AddressAggregateArgs>(args: Subset<T, AddressAggregateArgs>): Prisma.PrismaPromise<GetAddressAggregateType<T>>

    /**
     * Group by Address.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AddressGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends AddressGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: AddressGroupByArgs['orderBy'] }
        : { orderBy?: AddressGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, AddressGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetAddressGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the Address model
   */
  readonly fields: AddressFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for Address.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__AddressClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    userAddresses<T extends Address$userAddressesArgs<ExtArgs> = {}>(args?: Subset<T, Address$userAddressesArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$UserAddressPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the Address model
   */
  interface AddressFieldRefs {
    readonly id: FieldRef<"Address", 'Int'>
    readonly latitude: FieldRef<"Address", 'Float'>
    readonly longitude: FieldRef<"Address", 'Float'>
    readonly legalDistrictCode: FieldRef<"Address", 'String'>
    readonly dong: FieldRef<"Address", 'String'>
    readonly ho: FieldRef<"Address", 'String'>
  }
    

  // Custom InputTypes
  /**
   * Address findUnique
   */
  export type AddressFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Address
     */
    select?: AddressSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Address
     */
    omit?: AddressOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AddressInclude<ExtArgs> | null
    /**
     * Filter, which Address to fetch.
     */
    where: AddressWhereUniqueInput
  }

  /**
   * Address findUniqueOrThrow
   */
  export type AddressFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Address
     */
    select?: AddressSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Address
     */
    omit?: AddressOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AddressInclude<ExtArgs> | null
    /**
     * Filter, which Address to fetch.
     */
    where: AddressWhereUniqueInput
  }

  /**
   * Address findFirst
   */
  export type AddressFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Address
     */
    select?: AddressSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Address
     */
    omit?: AddressOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AddressInclude<ExtArgs> | null
    /**
     * Filter, which Address to fetch.
     */
    where?: AddressWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Addresses to fetch.
     */
    orderBy?: AddressOrderByWithRelationInput | AddressOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Addresses.
     */
    cursor?: AddressWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Addresses from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Addresses.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Addresses.
     */
    distinct?: AddressScalarFieldEnum | AddressScalarFieldEnum[]
  }

  /**
   * Address findFirstOrThrow
   */
  export type AddressFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Address
     */
    select?: AddressSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Address
     */
    omit?: AddressOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AddressInclude<ExtArgs> | null
    /**
     * Filter, which Address to fetch.
     */
    where?: AddressWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Addresses to fetch.
     */
    orderBy?: AddressOrderByWithRelationInput | AddressOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Addresses.
     */
    cursor?: AddressWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Addresses from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Addresses.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Addresses.
     */
    distinct?: AddressScalarFieldEnum | AddressScalarFieldEnum[]
  }

  /**
   * Address findMany
   */
  export type AddressFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Address
     */
    select?: AddressSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Address
     */
    omit?: AddressOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AddressInclude<ExtArgs> | null
    /**
     * Filter, which Addresses to fetch.
     */
    where?: AddressWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Addresses to fetch.
     */
    orderBy?: AddressOrderByWithRelationInput | AddressOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing Addresses.
     */
    cursor?: AddressWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Addresses from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Addresses.
     */
    skip?: number
    distinct?: AddressScalarFieldEnum | AddressScalarFieldEnum[]
  }

  /**
   * Address create
   */
  export type AddressCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Address
     */
    select?: AddressSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Address
     */
    omit?: AddressOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AddressInclude<ExtArgs> | null
    /**
     * The data needed to create a Address.
     */
    data?: XOR<AddressCreateInput, AddressUncheckedCreateInput>
  }

  /**
   * Address createMany
   */
  export type AddressCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many Addresses.
     */
    data: AddressCreateManyInput | AddressCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * Address createManyAndReturn
   */
  export type AddressCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Address
     */
    select?: AddressSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the Address
     */
    omit?: AddressOmit<ExtArgs> | null
    /**
     * The data used to create many Addresses.
     */
    data: AddressCreateManyInput | AddressCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * Address update
   */
  export type AddressUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Address
     */
    select?: AddressSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Address
     */
    omit?: AddressOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AddressInclude<ExtArgs> | null
    /**
     * The data needed to update a Address.
     */
    data: XOR<AddressUpdateInput, AddressUncheckedUpdateInput>
    /**
     * Choose, which Address to update.
     */
    where: AddressWhereUniqueInput
  }

  /**
   * Address updateMany
   */
  export type AddressUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update Addresses.
     */
    data: XOR<AddressUpdateManyMutationInput, AddressUncheckedUpdateManyInput>
    /**
     * Filter which Addresses to update
     */
    where?: AddressWhereInput
    /**
     * Limit how many Addresses to update.
     */
    limit?: number
  }

  /**
   * Address updateManyAndReturn
   */
  export type AddressUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Address
     */
    select?: AddressSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the Address
     */
    omit?: AddressOmit<ExtArgs> | null
    /**
     * The data used to update Addresses.
     */
    data: XOR<AddressUpdateManyMutationInput, AddressUncheckedUpdateManyInput>
    /**
     * Filter which Addresses to update
     */
    where?: AddressWhereInput
    /**
     * Limit how many Addresses to update.
     */
    limit?: number
  }

  /**
   * Address upsert
   */
  export type AddressUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Address
     */
    select?: AddressSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Address
     */
    omit?: AddressOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AddressInclude<ExtArgs> | null
    /**
     * The filter to search for the Address to update in case it exists.
     */
    where: AddressWhereUniqueInput
    /**
     * In case the Address found by the `where` argument doesn't exist, create a new Address with this data.
     */
    create: XOR<AddressCreateInput, AddressUncheckedCreateInput>
    /**
     * In case the Address was found with the provided `where` argument, update it with this data.
     */
    update: XOR<AddressUpdateInput, AddressUncheckedUpdateInput>
  }

  /**
   * Address delete
   */
  export type AddressDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Address
     */
    select?: AddressSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Address
     */
    omit?: AddressOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AddressInclude<ExtArgs> | null
    /**
     * Filter which Address to delete.
     */
    where: AddressWhereUniqueInput
  }

  /**
   * Address deleteMany
   */
  export type AddressDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Addresses to delete
     */
    where?: AddressWhereInput
    /**
     * Limit how many Addresses to delete.
     */
    limit?: number
  }

  /**
   * Address.userAddresses
   */
  export type Address$userAddressesArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the UserAddress
     */
    select?: UserAddressSelect<ExtArgs> | null
    /**
     * Omit specific fields from the UserAddress
     */
    omit?: UserAddressOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserAddressInclude<ExtArgs> | null
    where?: UserAddressWhereInput
    orderBy?: UserAddressOrderByWithRelationInput | UserAddressOrderByWithRelationInput[]
    cursor?: UserAddressWhereUniqueInput
    take?: number
    skip?: number
    distinct?: UserAddressScalarFieldEnum | UserAddressScalarFieldEnum[]
  }

  /**
   * Address without action
   */
  export type AddressDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Address
     */
    select?: AddressSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Address
     */
    omit?: AddressOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AddressInclude<ExtArgs> | null
  }


  /**
   * Model UserAddress
   */

  export type AggregateUserAddress = {
    _count: UserAddressCountAggregateOutputType | null
    _avg: UserAddressAvgAggregateOutputType | null
    _sum: UserAddressSumAggregateOutputType | null
    _min: UserAddressMinAggregateOutputType | null
    _max: UserAddressMaxAggregateOutputType | null
  }

  export type UserAddressAvgAggregateOutputType = {
    id: number | null
    addressId: number | null
  }

  export type UserAddressSumAggregateOutputType = {
    id: number | null
    addressId: number | null
  }

  export type UserAddressMinAggregateOutputType = {
    id: number | null
    userId: string | null
    addressId: number | null
    isPrimary: boolean | null
    createdAt: Date | null
    nickname: string | null
  }

  export type UserAddressMaxAggregateOutputType = {
    id: number | null
    userId: string | null
    addressId: number | null
    isPrimary: boolean | null
    createdAt: Date | null
    nickname: string | null
  }

  export type UserAddressCountAggregateOutputType = {
    id: number
    userId: number
    addressId: number
    isPrimary: number
    createdAt: number
    nickname: number
    _all: number
  }


  export type UserAddressAvgAggregateInputType = {
    id?: true
    addressId?: true
  }

  export type UserAddressSumAggregateInputType = {
    id?: true
    addressId?: true
  }

  export type UserAddressMinAggregateInputType = {
    id?: true
    userId?: true
    addressId?: true
    isPrimary?: true
    createdAt?: true
    nickname?: true
  }

  export type UserAddressMaxAggregateInputType = {
    id?: true
    userId?: true
    addressId?: true
    isPrimary?: true
    createdAt?: true
    nickname?: true
  }

  export type UserAddressCountAggregateInputType = {
    id?: true
    userId?: true
    addressId?: true
    isPrimary?: true
    createdAt?: true
    nickname?: true
    _all?: true
  }

  export type UserAddressAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which UserAddress to aggregate.
     */
    where?: UserAddressWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of UserAddresses to fetch.
     */
    orderBy?: UserAddressOrderByWithRelationInput | UserAddressOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: UserAddressWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` UserAddresses from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` UserAddresses.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned UserAddresses
    **/
    _count?: true | UserAddressCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: UserAddressAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: UserAddressSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: UserAddressMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: UserAddressMaxAggregateInputType
  }

  export type GetUserAddressAggregateType<T extends UserAddressAggregateArgs> = {
        [P in keyof T & keyof AggregateUserAddress]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateUserAddress[P]>
      : GetScalarType<T[P], AggregateUserAddress[P]>
  }




  export type UserAddressGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: UserAddressWhereInput
    orderBy?: UserAddressOrderByWithAggregationInput | UserAddressOrderByWithAggregationInput[]
    by: UserAddressScalarFieldEnum[] | UserAddressScalarFieldEnum
    having?: UserAddressScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: UserAddressCountAggregateInputType | true
    _avg?: UserAddressAvgAggregateInputType
    _sum?: UserAddressSumAggregateInputType
    _min?: UserAddressMinAggregateInputType
    _max?: UserAddressMaxAggregateInputType
  }

  export type UserAddressGroupByOutputType = {
    id: number
    userId: string
    addressId: number
    isPrimary: boolean | null
    createdAt: Date
    nickname: string | null
    _count: UserAddressCountAggregateOutputType | null
    _avg: UserAddressAvgAggregateOutputType | null
    _sum: UserAddressSumAggregateOutputType | null
    _min: UserAddressMinAggregateOutputType | null
    _max: UserAddressMaxAggregateOutputType | null
  }

  type GetUserAddressGroupByPayload<T extends UserAddressGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<UserAddressGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof UserAddressGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], UserAddressGroupByOutputType[P]>
            : GetScalarType<T[P], UserAddressGroupByOutputType[P]>
        }
      >
    >


  export type UserAddressSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    userId?: boolean
    addressId?: boolean
    isPrimary?: boolean
    createdAt?: boolean
    nickname?: boolean
    user?: boolean | UserDefaultArgs<ExtArgs>
    address?: boolean | AddressDefaultArgs<ExtArgs>
    realEstates?: boolean | UserAddress$realEstatesArgs<ExtArgs>
    stepResults?: boolean | UserAddress$stepResultsArgs<ExtArgs>
    _count?: boolean | UserAddressCountOutputTypeDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["userAddress"]>

  export type UserAddressSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    userId?: boolean
    addressId?: boolean
    isPrimary?: boolean
    createdAt?: boolean
    nickname?: boolean
    user?: boolean | UserDefaultArgs<ExtArgs>
    address?: boolean | AddressDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["userAddress"]>

  export type UserAddressSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    userId?: boolean
    addressId?: boolean
    isPrimary?: boolean
    createdAt?: boolean
    nickname?: boolean
    user?: boolean | UserDefaultArgs<ExtArgs>
    address?: boolean | AddressDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["userAddress"]>

  export type UserAddressSelectScalar = {
    id?: boolean
    userId?: boolean
    addressId?: boolean
    isPrimary?: boolean
    createdAt?: boolean
    nickname?: boolean
  }

  export type UserAddressOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "userId" | "addressId" | "isPrimary" | "createdAt" | "nickname", ExtArgs["result"]["userAddress"]>
  export type UserAddressInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    user?: boolean | UserDefaultArgs<ExtArgs>
    address?: boolean | AddressDefaultArgs<ExtArgs>
    realEstates?: boolean | UserAddress$realEstatesArgs<ExtArgs>
    stepResults?: boolean | UserAddress$stepResultsArgs<ExtArgs>
    _count?: boolean | UserAddressCountOutputTypeDefaultArgs<ExtArgs>
  }
  export type UserAddressIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    user?: boolean | UserDefaultArgs<ExtArgs>
    address?: boolean | AddressDefaultArgs<ExtArgs>
  }
  export type UserAddressIncludeUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    user?: boolean | UserDefaultArgs<ExtArgs>
    address?: boolean | AddressDefaultArgs<ExtArgs>
  }

  export type $UserAddressPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "UserAddress"
    objects: {
      user: Prisma.$UserPayload<ExtArgs>
      address: Prisma.$AddressPayload<ExtArgs>
      realEstates: Prisma.$RealEstatePayload<ExtArgs>[]
      stepResults: Prisma.$StepResultPayload<ExtArgs>[]
    }
    scalars: $Extensions.GetPayloadResult<{
      id: number
      userId: string
      addressId: number
      isPrimary: boolean | null
      createdAt: Date
      nickname: string | null
    }, ExtArgs["result"]["userAddress"]>
    composites: {}
  }

  type UserAddressGetPayload<S extends boolean | null | undefined | UserAddressDefaultArgs> = $Result.GetResult<Prisma.$UserAddressPayload, S>

  type UserAddressCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<UserAddressFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: UserAddressCountAggregateInputType | true
    }

  export interface UserAddressDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['UserAddress'], meta: { name: 'UserAddress' } }
    /**
     * Find zero or one UserAddress that matches the filter.
     * @param {UserAddressFindUniqueArgs} args - Arguments to find a UserAddress
     * @example
     * // Get one UserAddress
     * const userAddress = await prisma.userAddress.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends UserAddressFindUniqueArgs>(args: SelectSubset<T, UserAddressFindUniqueArgs<ExtArgs>>): Prisma__UserAddressClient<$Result.GetResult<Prisma.$UserAddressPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one UserAddress that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {UserAddressFindUniqueOrThrowArgs} args - Arguments to find a UserAddress
     * @example
     * // Get one UserAddress
     * const userAddress = await prisma.userAddress.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends UserAddressFindUniqueOrThrowArgs>(args: SelectSubset<T, UserAddressFindUniqueOrThrowArgs<ExtArgs>>): Prisma__UserAddressClient<$Result.GetResult<Prisma.$UserAddressPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first UserAddress that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserAddressFindFirstArgs} args - Arguments to find a UserAddress
     * @example
     * // Get one UserAddress
     * const userAddress = await prisma.userAddress.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends UserAddressFindFirstArgs>(args?: SelectSubset<T, UserAddressFindFirstArgs<ExtArgs>>): Prisma__UserAddressClient<$Result.GetResult<Prisma.$UserAddressPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first UserAddress that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserAddressFindFirstOrThrowArgs} args - Arguments to find a UserAddress
     * @example
     * // Get one UserAddress
     * const userAddress = await prisma.userAddress.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends UserAddressFindFirstOrThrowArgs>(args?: SelectSubset<T, UserAddressFindFirstOrThrowArgs<ExtArgs>>): Prisma__UserAddressClient<$Result.GetResult<Prisma.$UserAddressPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more UserAddresses that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserAddressFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all UserAddresses
     * const userAddresses = await prisma.userAddress.findMany()
     * 
     * // Get first 10 UserAddresses
     * const userAddresses = await prisma.userAddress.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const userAddressWithIdOnly = await prisma.userAddress.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends UserAddressFindManyArgs>(args?: SelectSubset<T, UserAddressFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$UserAddressPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a UserAddress.
     * @param {UserAddressCreateArgs} args - Arguments to create a UserAddress.
     * @example
     * // Create one UserAddress
     * const UserAddress = await prisma.userAddress.create({
     *   data: {
     *     // ... data to create a UserAddress
     *   }
     * })
     * 
     */
    create<T extends UserAddressCreateArgs>(args: SelectSubset<T, UserAddressCreateArgs<ExtArgs>>): Prisma__UserAddressClient<$Result.GetResult<Prisma.$UserAddressPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many UserAddresses.
     * @param {UserAddressCreateManyArgs} args - Arguments to create many UserAddresses.
     * @example
     * // Create many UserAddresses
     * const userAddress = await prisma.userAddress.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends UserAddressCreateManyArgs>(args?: SelectSubset<T, UserAddressCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many UserAddresses and returns the data saved in the database.
     * @param {UserAddressCreateManyAndReturnArgs} args - Arguments to create many UserAddresses.
     * @example
     * // Create many UserAddresses
     * const userAddress = await prisma.userAddress.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many UserAddresses and only return the `id`
     * const userAddressWithIdOnly = await prisma.userAddress.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends UserAddressCreateManyAndReturnArgs>(args?: SelectSubset<T, UserAddressCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$UserAddressPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a UserAddress.
     * @param {UserAddressDeleteArgs} args - Arguments to delete one UserAddress.
     * @example
     * // Delete one UserAddress
     * const UserAddress = await prisma.userAddress.delete({
     *   where: {
     *     // ... filter to delete one UserAddress
     *   }
     * })
     * 
     */
    delete<T extends UserAddressDeleteArgs>(args: SelectSubset<T, UserAddressDeleteArgs<ExtArgs>>): Prisma__UserAddressClient<$Result.GetResult<Prisma.$UserAddressPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one UserAddress.
     * @param {UserAddressUpdateArgs} args - Arguments to update one UserAddress.
     * @example
     * // Update one UserAddress
     * const userAddress = await prisma.userAddress.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends UserAddressUpdateArgs>(args: SelectSubset<T, UserAddressUpdateArgs<ExtArgs>>): Prisma__UserAddressClient<$Result.GetResult<Prisma.$UserAddressPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more UserAddresses.
     * @param {UserAddressDeleteManyArgs} args - Arguments to filter UserAddresses to delete.
     * @example
     * // Delete a few UserAddresses
     * const { count } = await prisma.userAddress.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends UserAddressDeleteManyArgs>(args?: SelectSubset<T, UserAddressDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more UserAddresses.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserAddressUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many UserAddresses
     * const userAddress = await prisma.userAddress.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends UserAddressUpdateManyArgs>(args: SelectSubset<T, UserAddressUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more UserAddresses and returns the data updated in the database.
     * @param {UserAddressUpdateManyAndReturnArgs} args - Arguments to update many UserAddresses.
     * @example
     * // Update many UserAddresses
     * const userAddress = await prisma.userAddress.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more UserAddresses and only return the `id`
     * const userAddressWithIdOnly = await prisma.userAddress.updateManyAndReturn({
     *   select: { id: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    updateManyAndReturn<T extends UserAddressUpdateManyAndReturnArgs>(args: SelectSubset<T, UserAddressUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$UserAddressPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one UserAddress.
     * @param {UserAddressUpsertArgs} args - Arguments to update or create a UserAddress.
     * @example
     * // Update or create a UserAddress
     * const userAddress = await prisma.userAddress.upsert({
     *   create: {
     *     // ... data to create a UserAddress
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the UserAddress we want to update
     *   }
     * })
     */
    upsert<T extends UserAddressUpsertArgs>(args: SelectSubset<T, UserAddressUpsertArgs<ExtArgs>>): Prisma__UserAddressClient<$Result.GetResult<Prisma.$UserAddressPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of UserAddresses.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserAddressCountArgs} args - Arguments to filter UserAddresses to count.
     * @example
     * // Count the number of UserAddresses
     * const count = await prisma.userAddress.count({
     *   where: {
     *     // ... the filter for the UserAddresses we want to count
     *   }
     * })
    **/
    count<T extends UserAddressCountArgs>(
      args?: Subset<T, UserAddressCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], UserAddressCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a UserAddress.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserAddressAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends UserAddressAggregateArgs>(args: Subset<T, UserAddressAggregateArgs>): Prisma.PrismaPromise<GetUserAddressAggregateType<T>>

    /**
     * Group by UserAddress.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserAddressGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends UserAddressGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: UserAddressGroupByArgs['orderBy'] }
        : { orderBy?: UserAddressGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, UserAddressGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetUserAddressGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the UserAddress model
   */
  readonly fields: UserAddressFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for UserAddress.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__UserAddressClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    user<T extends UserDefaultArgs<ExtArgs> = {}>(args?: Subset<T, UserDefaultArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>
    address<T extends AddressDefaultArgs<ExtArgs> = {}>(args?: Subset<T, AddressDefaultArgs<ExtArgs>>): Prisma__AddressClient<$Result.GetResult<Prisma.$AddressPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>
    realEstates<T extends UserAddress$realEstatesArgs<ExtArgs> = {}>(args?: Subset<T, UserAddress$realEstatesArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$RealEstatePayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
    stepResults<T extends UserAddress$stepResultsArgs<ExtArgs> = {}>(args?: Subset<T, UserAddress$stepResultsArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$StepResultPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the UserAddress model
   */
  interface UserAddressFieldRefs {
    readonly id: FieldRef<"UserAddress", 'Int'>
    readonly userId: FieldRef<"UserAddress", 'String'>
    readonly addressId: FieldRef<"UserAddress", 'Int'>
    readonly isPrimary: FieldRef<"UserAddress", 'Boolean'>
    readonly createdAt: FieldRef<"UserAddress", 'DateTime'>
    readonly nickname: FieldRef<"UserAddress", 'String'>
  }
    

  // Custom InputTypes
  /**
   * UserAddress findUnique
   */
  export type UserAddressFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the UserAddress
     */
    select?: UserAddressSelect<ExtArgs> | null
    /**
     * Omit specific fields from the UserAddress
     */
    omit?: UserAddressOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserAddressInclude<ExtArgs> | null
    /**
     * Filter, which UserAddress to fetch.
     */
    where: UserAddressWhereUniqueInput
  }

  /**
   * UserAddress findUniqueOrThrow
   */
  export type UserAddressFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the UserAddress
     */
    select?: UserAddressSelect<ExtArgs> | null
    /**
     * Omit specific fields from the UserAddress
     */
    omit?: UserAddressOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserAddressInclude<ExtArgs> | null
    /**
     * Filter, which UserAddress to fetch.
     */
    where: UserAddressWhereUniqueInput
  }

  /**
   * UserAddress findFirst
   */
  export type UserAddressFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the UserAddress
     */
    select?: UserAddressSelect<ExtArgs> | null
    /**
     * Omit specific fields from the UserAddress
     */
    omit?: UserAddressOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserAddressInclude<ExtArgs> | null
    /**
     * Filter, which UserAddress to fetch.
     */
    where?: UserAddressWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of UserAddresses to fetch.
     */
    orderBy?: UserAddressOrderByWithRelationInput | UserAddressOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for UserAddresses.
     */
    cursor?: UserAddressWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` UserAddresses from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` UserAddresses.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of UserAddresses.
     */
    distinct?: UserAddressScalarFieldEnum | UserAddressScalarFieldEnum[]
  }

  /**
   * UserAddress findFirstOrThrow
   */
  export type UserAddressFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the UserAddress
     */
    select?: UserAddressSelect<ExtArgs> | null
    /**
     * Omit specific fields from the UserAddress
     */
    omit?: UserAddressOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserAddressInclude<ExtArgs> | null
    /**
     * Filter, which UserAddress to fetch.
     */
    where?: UserAddressWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of UserAddresses to fetch.
     */
    orderBy?: UserAddressOrderByWithRelationInput | UserAddressOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for UserAddresses.
     */
    cursor?: UserAddressWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` UserAddresses from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` UserAddresses.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of UserAddresses.
     */
    distinct?: UserAddressScalarFieldEnum | UserAddressScalarFieldEnum[]
  }

  /**
   * UserAddress findMany
   */
  export type UserAddressFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the UserAddress
     */
    select?: UserAddressSelect<ExtArgs> | null
    /**
     * Omit specific fields from the UserAddress
     */
    omit?: UserAddressOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserAddressInclude<ExtArgs> | null
    /**
     * Filter, which UserAddresses to fetch.
     */
    where?: UserAddressWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of UserAddresses to fetch.
     */
    orderBy?: UserAddressOrderByWithRelationInput | UserAddressOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing UserAddresses.
     */
    cursor?: UserAddressWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` UserAddresses from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` UserAddresses.
     */
    skip?: number
    distinct?: UserAddressScalarFieldEnum | UserAddressScalarFieldEnum[]
  }

  /**
   * UserAddress create
   */
  export type UserAddressCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the UserAddress
     */
    select?: UserAddressSelect<ExtArgs> | null
    /**
     * Omit specific fields from the UserAddress
     */
    omit?: UserAddressOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserAddressInclude<ExtArgs> | null
    /**
     * The data needed to create a UserAddress.
     */
    data: XOR<UserAddressCreateInput, UserAddressUncheckedCreateInput>
  }

  /**
   * UserAddress createMany
   */
  export type UserAddressCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many UserAddresses.
     */
    data: UserAddressCreateManyInput | UserAddressCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * UserAddress createManyAndReturn
   */
  export type UserAddressCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the UserAddress
     */
    select?: UserAddressSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the UserAddress
     */
    omit?: UserAddressOmit<ExtArgs> | null
    /**
     * The data used to create many UserAddresses.
     */
    data: UserAddressCreateManyInput | UserAddressCreateManyInput[]
    skipDuplicates?: boolean
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserAddressIncludeCreateManyAndReturn<ExtArgs> | null
  }

  /**
   * UserAddress update
   */
  export type UserAddressUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the UserAddress
     */
    select?: UserAddressSelect<ExtArgs> | null
    /**
     * Omit specific fields from the UserAddress
     */
    omit?: UserAddressOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserAddressInclude<ExtArgs> | null
    /**
     * The data needed to update a UserAddress.
     */
    data: XOR<UserAddressUpdateInput, UserAddressUncheckedUpdateInput>
    /**
     * Choose, which UserAddress to update.
     */
    where: UserAddressWhereUniqueInput
  }

  /**
   * UserAddress updateMany
   */
  export type UserAddressUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update UserAddresses.
     */
    data: XOR<UserAddressUpdateManyMutationInput, UserAddressUncheckedUpdateManyInput>
    /**
     * Filter which UserAddresses to update
     */
    where?: UserAddressWhereInput
    /**
     * Limit how many UserAddresses to update.
     */
    limit?: number
  }

  /**
   * UserAddress updateManyAndReturn
   */
  export type UserAddressUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the UserAddress
     */
    select?: UserAddressSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the UserAddress
     */
    omit?: UserAddressOmit<ExtArgs> | null
    /**
     * The data used to update UserAddresses.
     */
    data: XOR<UserAddressUpdateManyMutationInput, UserAddressUncheckedUpdateManyInput>
    /**
     * Filter which UserAddresses to update
     */
    where?: UserAddressWhereInput
    /**
     * Limit how many UserAddresses to update.
     */
    limit?: number
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserAddressIncludeUpdateManyAndReturn<ExtArgs> | null
  }

  /**
   * UserAddress upsert
   */
  export type UserAddressUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the UserAddress
     */
    select?: UserAddressSelect<ExtArgs> | null
    /**
     * Omit specific fields from the UserAddress
     */
    omit?: UserAddressOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserAddressInclude<ExtArgs> | null
    /**
     * The filter to search for the UserAddress to update in case it exists.
     */
    where: UserAddressWhereUniqueInput
    /**
     * In case the UserAddress found by the `where` argument doesn't exist, create a new UserAddress with this data.
     */
    create: XOR<UserAddressCreateInput, UserAddressUncheckedCreateInput>
    /**
     * In case the UserAddress was found with the provided `where` argument, update it with this data.
     */
    update: XOR<UserAddressUpdateInput, UserAddressUncheckedUpdateInput>
  }

  /**
   * UserAddress delete
   */
  export type UserAddressDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the UserAddress
     */
    select?: UserAddressSelect<ExtArgs> | null
    /**
     * Omit specific fields from the UserAddress
     */
    omit?: UserAddressOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserAddressInclude<ExtArgs> | null
    /**
     * Filter which UserAddress to delete.
     */
    where: UserAddressWhereUniqueInput
  }

  /**
   * UserAddress deleteMany
   */
  export type UserAddressDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which UserAddresses to delete
     */
    where?: UserAddressWhereInput
    /**
     * Limit how many UserAddresses to delete.
     */
    limit?: number
  }

  /**
   * UserAddress.realEstates
   */
  export type UserAddress$realEstatesArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the RealEstate
     */
    select?: RealEstateSelect<ExtArgs> | null
    /**
     * Omit specific fields from the RealEstate
     */
    omit?: RealEstateOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: RealEstateInclude<ExtArgs> | null
    where?: RealEstateWhereInput
    orderBy?: RealEstateOrderByWithRelationInput | RealEstateOrderByWithRelationInput[]
    cursor?: RealEstateWhereUniqueInput
    take?: number
    skip?: number
    distinct?: RealEstateScalarFieldEnum | RealEstateScalarFieldEnum[]
  }

  /**
   * UserAddress.stepResults
   */
  export type UserAddress$stepResultsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the StepResult
     */
    select?: StepResultSelect<ExtArgs> | null
    /**
     * Omit specific fields from the StepResult
     */
    omit?: StepResultOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: StepResultInclude<ExtArgs> | null
    where?: StepResultWhereInput
    orderBy?: StepResultOrderByWithRelationInput | StepResultOrderByWithRelationInput[]
    cursor?: StepResultWhereUniqueInput
    take?: number
    skip?: number
    distinct?: StepResultScalarFieldEnum | StepResultScalarFieldEnum[]
  }

  /**
   * UserAddress without action
   */
  export type UserAddressDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the UserAddress
     */
    select?: UserAddressSelect<ExtArgs> | null
    /**
     * Omit specific fields from the UserAddress
     */
    omit?: UserAddressOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserAddressInclude<ExtArgs> | null
  }


  /**
   * Model RealEstate
   */

  export type AggregateRealEstate = {
    _count: RealEstateCountAggregateOutputType | null
    _avg: RealEstateAvgAggregateOutputType | null
    _sum: RealEstateSumAggregateOutputType | null
    _min: RealEstateMinAggregateOutputType | null
    _max: RealEstateMaxAggregateOutputType | null
  }

  export type RealEstateAvgAggregateOutputType = {
    id: number | null
    userAddressId: number | null
  }

  export type RealEstateSumAggregateOutputType = {
    id: number | null
    userAddressId: number | null
  }

  export type RealEstateMinAggregateOutputType = {
    id: number | null
    userAddressId: number | null
  }

  export type RealEstateMaxAggregateOutputType = {
    id: number | null
    userAddressId: number | null
  }

  export type RealEstateCountAggregateOutputType = {
    id: number
    userAddressId: number
    realEstateJson: number
    _all: number
  }


  export type RealEstateAvgAggregateInputType = {
    id?: true
    userAddressId?: true
  }

  export type RealEstateSumAggregateInputType = {
    id?: true
    userAddressId?: true
  }

  export type RealEstateMinAggregateInputType = {
    id?: true
    userAddressId?: true
  }

  export type RealEstateMaxAggregateInputType = {
    id?: true
    userAddressId?: true
  }

  export type RealEstateCountAggregateInputType = {
    id?: true
    userAddressId?: true
    realEstateJson?: true
    _all?: true
  }

  export type RealEstateAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which RealEstate to aggregate.
     */
    where?: RealEstateWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of RealEstates to fetch.
     */
    orderBy?: RealEstateOrderByWithRelationInput | RealEstateOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: RealEstateWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` RealEstates from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` RealEstates.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned RealEstates
    **/
    _count?: true | RealEstateCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: RealEstateAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: RealEstateSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: RealEstateMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: RealEstateMaxAggregateInputType
  }

  export type GetRealEstateAggregateType<T extends RealEstateAggregateArgs> = {
        [P in keyof T & keyof AggregateRealEstate]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateRealEstate[P]>
      : GetScalarType<T[P], AggregateRealEstate[P]>
  }




  export type RealEstateGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: RealEstateWhereInput
    orderBy?: RealEstateOrderByWithAggregationInput | RealEstateOrderByWithAggregationInput[]
    by: RealEstateScalarFieldEnum[] | RealEstateScalarFieldEnum
    having?: RealEstateScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: RealEstateCountAggregateInputType | true
    _avg?: RealEstateAvgAggregateInputType
    _sum?: RealEstateSumAggregateInputType
    _min?: RealEstateMinAggregateInputType
    _max?: RealEstateMaxAggregateInputType
  }

  export type RealEstateGroupByOutputType = {
    id: number
    userAddressId: number
    realEstateJson: JsonValue | null
    _count: RealEstateCountAggregateOutputType | null
    _avg: RealEstateAvgAggregateOutputType | null
    _sum: RealEstateSumAggregateOutputType | null
    _min: RealEstateMinAggregateOutputType | null
    _max: RealEstateMaxAggregateOutputType | null
  }

  type GetRealEstateGroupByPayload<T extends RealEstateGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<RealEstateGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof RealEstateGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], RealEstateGroupByOutputType[P]>
            : GetScalarType<T[P], RealEstateGroupByOutputType[P]>
        }
      >
    >


  export type RealEstateSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    userAddressId?: boolean
    realEstateJson?: boolean
    userAddress?: boolean | UserAddressDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["realEstate"]>

  export type RealEstateSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    userAddressId?: boolean
    realEstateJson?: boolean
    userAddress?: boolean | UserAddressDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["realEstate"]>

  export type RealEstateSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    userAddressId?: boolean
    realEstateJson?: boolean
    userAddress?: boolean | UserAddressDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["realEstate"]>

  export type RealEstateSelectScalar = {
    id?: boolean
    userAddressId?: boolean
    realEstateJson?: boolean
  }

  export type RealEstateOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "userAddressId" | "realEstateJson", ExtArgs["result"]["realEstate"]>
  export type RealEstateInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    userAddress?: boolean | UserAddressDefaultArgs<ExtArgs>
  }
  export type RealEstateIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    userAddress?: boolean | UserAddressDefaultArgs<ExtArgs>
  }
  export type RealEstateIncludeUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    userAddress?: boolean | UserAddressDefaultArgs<ExtArgs>
  }

  export type $RealEstatePayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "RealEstate"
    objects: {
      userAddress: Prisma.$UserAddressPayload<ExtArgs>
    }
    scalars: $Extensions.GetPayloadResult<{
      id: number
      userAddressId: number
      realEstateJson: Prisma.JsonValue | null
    }, ExtArgs["result"]["realEstate"]>
    composites: {}
  }

  type RealEstateGetPayload<S extends boolean | null | undefined | RealEstateDefaultArgs> = $Result.GetResult<Prisma.$RealEstatePayload, S>

  type RealEstateCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<RealEstateFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: RealEstateCountAggregateInputType | true
    }

  export interface RealEstateDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['RealEstate'], meta: { name: 'RealEstate' } }
    /**
     * Find zero or one RealEstate that matches the filter.
     * @param {RealEstateFindUniqueArgs} args - Arguments to find a RealEstate
     * @example
     * // Get one RealEstate
     * const realEstate = await prisma.realEstate.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends RealEstateFindUniqueArgs>(args: SelectSubset<T, RealEstateFindUniqueArgs<ExtArgs>>): Prisma__RealEstateClient<$Result.GetResult<Prisma.$RealEstatePayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one RealEstate that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {RealEstateFindUniqueOrThrowArgs} args - Arguments to find a RealEstate
     * @example
     * // Get one RealEstate
     * const realEstate = await prisma.realEstate.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends RealEstateFindUniqueOrThrowArgs>(args: SelectSubset<T, RealEstateFindUniqueOrThrowArgs<ExtArgs>>): Prisma__RealEstateClient<$Result.GetResult<Prisma.$RealEstatePayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first RealEstate that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {RealEstateFindFirstArgs} args - Arguments to find a RealEstate
     * @example
     * // Get one RealEstate
     * const realEstate = await prisma.realEstate.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends RealEstateFindFirstArgs>(args?: SelectSubset<T, RealEstateFindFirstArgs<ExtArgs>>): Prisma__RealEstateClient<$Result.GetResult<Prisma.$RealEstatePayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first RealEstate that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {RealEstateFindFirstOrThrowArgs} args - Arguments to find a RealEstate
     * @example
     * // Get one RealEstate
     * const realEstate = await prisma.realEstate.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends RealEstateFindFirstOrThrowArgs>(args?: SelectSubset<T, RealEstateFindFirstOrThrowArgs<ExtArgs>>): Prisma__RealEstateClient<$Result.GetResult<Prisma.$RealEstatePayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more RealEstates that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {RealEstateFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all RealEstates
     * const realEstates = await prisma.realEstate.findMany()
     * 
     * // Get first 10 RealEstates
     * const realEstates = await prisma.realEstate.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const realEstateWithIdOnly = await prisma.realEstate.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends RealEstateFindManyArgs>(args?: SelectSubset<T, RealEstateFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$RealEstatePayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a RealEstate.
     * @param {RealEstateCreateArgs} args - Arguments to create a RealEstate.
     * @example
     * // Create one RealEstate
     * const RealEstate = await prisma.realEstate.create({
     *   data: {
     *     // ... data to create a RealEstate
     *   }
     * })
     * 
     */
    create<T extends RealEstateCreateArgs>(args: SelectSubset<T, RealEstateCreateArgs<ExtArgs>>): Prisma__RealEstateClient<$Result.GetResult<Prisma.$RealEstatePayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many RealEstates.
     * @param {RealEstateCreateManyArgs} args - Arguments to create many RealEstates.
     * @example
     * // Create many RealEstates
     * const realEstate = await prisma.realEstate.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends RealEstateCreateManyArgs>(args?: SelectSubset<T, RealEstateCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many RealEstates and returns the data saved in the database.
     * @param {RealEstateCreateManyAndReturnArgs} args - Arguments to create many RealEstates.
     * @example
     * // Create many RealEstates
     * const realEstate = await prisma.realEstate.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many RealEstates and only return the `id`
     * const realEstateWithIdOnly = await prisma.realEstate.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends RealEstateCreateManyAndReturnArgs>(args?: SelectSubset<T, RealEstateCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$RealEstatePayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a RealEstate.
     * @param {RealEstateDeleteArgs} args - Arguments to delete one RealEstate.
     * @example
     * // Delete one RealEstate
     * const RealEstate = await prisma.realEstate.delete({
     *   where: {
     *     // ... filter to delete one RealEstate
     *   }
     * })
     * 
     */
    delete<T extends RealEstateDeleteArgs>(args: SelectSubset<T, RealEstateDeleteArgs<ExtArgs>>): Prisma__RealEstateClient<$Result.GetResult<Prisma.$RealEstatePayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one RealEstate.
     * @param {RealEstateUpdateArgs} args - Arguments to update one RealEstate.
     * @example
     * // Update one RealEstate
     * const realEstate = await prisma.realEstate.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends RealEstateUpdateArgs>(args: SelectSubset<T, RealEstateUpdateArgs<ExtArgs>>): Prisma__RealEstateClient<$Result.GetResult<Prisma.$RealEstatePayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more RealEstates.
     * @param {RealEstateDeleteManyArgs} args - Arguments to filter RealEstates to delete.
     * @example
     * // Delete a few RealEstates
     * const { count } = await prisma.realEstate.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends RealEstateDeleteManyArgs>(args?: SelectSubset<T, RealEstateDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more RealEstates.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {RealEstateUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many RealEstates
     * const realEstate = await prisma.realEstate.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends RealEstateUpdateManyArgs>(args: SelectSubset<T, RealEstateUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more RealEstates and returns the data updated in the database.
     * @param {RealEstateUpdateManyAndReturnArgs} args - Arguments to update many RealEstates.
     * @example
     * // Update many RealEstates
     * const realEstate = await prisma.realEstate.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more RealEstates and only return the `id`
     * const realEstateWithIdOnly = await prisma.realEstate.updateManyAndReturn({
     *   select: { id: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    updateManyAndReturn<T extends RealEstateUpdateManyAndReturnArgs>(args: SelectSubset<T, RealEstateUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$RealEstatePayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one RealEstate.
     * @param {RealEstateUpsertArgs} args - Arguments to update or create a RealEstate.
     * @example
     * // Update or create a RealEstate
     * const realEstate = await prisma.realEstate.upsert({
     *   create: {
     *     // ... data to create a RealEstate
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the RealEstate we want to update
     *   }
     * })
     */
    upsert<T extends RealEstateUpsertArgs>(args: SelectSubset<T, RealEstateUpsertArgs<ExtArgs>>): Prisma__RealEstateClient<$Result.GetResult<Prisma.$RealEstatePayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of RealEstates.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {RealEstateCountArgs} args - Arguments to filter RealEstates to count.
     * @example
     * // Count the number of RealEstates
     * const count = await prisma.realEstate.count({
     *   where: {
     *     // ... the filter for the RealEstates we want to count
     *   }
     * })
    **/
    count<T extends RealEstateCountArgs>(
      args?: Subset<T, RealEstateCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], RealEstateCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a RealEstate.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {RealEstateAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends RealEstateAggregateArgs>(args: Subset<T, RealEstateAggregateArgs>): Prisma.PrismaPromise<GetRealEstateAggregateType<T>>

    /**
     * Group by RealEstate.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {RealEstateGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends RealEstateGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: RealEstateGroupByArgs['orderBy'] }
        : { orderBy?: RealEstateGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, RealEstateGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetRealEstateGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the RealEstate model
   */
  readonly fields: RealEstateFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for RealEstate.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__RealEstateClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    userAddress<T extends UserAddressDefaultArgs<ExtArgs> = {}>(args?: Subset<T, UserAddressDefaultArgs<ExtArgs>>): Prisma__UserAddressClient<$Result.GetResult<Prisma.$UserAddressPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the RealEstate model
   */
  interface RealEstateFieldRefs {
    readonly id: FieldRef<"RealEstate", 'Int'>
    readonly userAddressId: FieldRef<"RealEstate", 'Int'>
    readonly realEstateJson: FieldRef<"RealEstate", 'Json'>
  }
    

  // Custom InputTypes
  /**
   * RealEstate findUnique
   */
  export type RealEstateFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the RealEstate
     */
    select?: RealEstateSelect<ExtArgs> | null
    /**
     * Omit specific fields from the RealEstate
     */
    omit?: RealEstateOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: RealEstateInclude<ExtArgs> | null
    /**
     * Filter, which RealEstate to fetch.
     */
    where: RealEstateWhereUniqueInput
  }

  /**
   * RealEstate findUniqueOrThrow
   */
  export type RealEstateFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the RealEstate
     */
    select?: RealEstateSelect<ExtArgs> | null
    /**
     * Omit specific fields from the RealEstate
     */
    omit?: RealEstateOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: RealEstateInclude<ExtArgs> | null
    /**
     * Filter, which RealEstate to fetch.
     */
    where: RealEstateWhereUniqueInput
  }

  /**
   * RealEstate findFirst
   */
  export type RealEstateFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the RealEstate
     */
    select?: RealEstateSelect<ExtArgs> | null
    /**
     * Omit specific fields from the RealEstate
     */
    omit?: RealEstateOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: RealEstateInclude<ExtArgs> | null
    /**
     * Filter, which RealEstate to fetch.
     */
    where?: RealEstateWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of RealEstates to fetch.
     */
    orderBy?: RealEstateOrderByWithRelationInput | RealEstateOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for RealEstates.
     */
    cursor?: RealEstateWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` RealEstates from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` RealEstates.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of RealEstates.
     */
    distinct?: RealEstateScalarFieldEnum | RealEstateScalarFieldEnum[]
  }

  /**
   * RealEstate findFirstOrThrow
   */
  export type RealEstateFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the RealEstate
     */
    select?: RealEstateSelect<ExtArgs> | null
    /**
     * Omit specific fields from the RealEstate
     */
    omit?: RealEstateOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: RealEstateInclude<ExtArgs> | null
    /**
     * Filter, which RealEstate to fetch.
     */
    where?: RealEstateWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of RealEstates to fetch.
     */
    orderBy?: RealEstateOrderByWithRelationInput | RealEstateOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for RealEstates.
     */
    cursor?: RealEstateWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` RealEstates from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` RealEstates.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of RealEstates.
     */
    distinct?: RealEstateScalarFieldEnum | RealEstateScalarFieldEnum[]
  }

  /**
   * RealEstate findMany
   */
  export type RealEstateFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the RealEstate
     */
    select?: RealEstateSelect<ExtArgs> | null
    /**
     * Omit specific fields from the RealEstate
     */
    omit?: RealEstateOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: RealEstateInclude<ExtArgs> | null
    /**
     * Filter, which RealEstates to fetch.
     */
    where?: RealEstateWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of RealEstates to fetch.
     */
    orderBy?: RealEstateOrderByWithRelationInput | RealEstateOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing RealEstates.
     */
    cursor?: RealEstateWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` RealEstates from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` RealEstates.
     */
    skip?: number
    distinct?: RealEstateScalarFieldEnum | RealEstateScalarFieldEnum[]
  }

  /**
   * RealEstate create
   */
  export type RealEstateCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the RealEstate
     */
    select?: RealEstateSelect<ExtArgs> | null
    /**
     * Omit specific fields from the RealEstate
     */
    omit?: RealEstateOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: RealEstateInclude<ExtArgs> | null
    /**
     * The data needed to create a RealEstate.
     */
    data: XOR<RealEstateCreateInput, RealEstateUncheckedCreateInput>
  }

  /**
   * RealEstate createMany
   */
  export type RealEstateCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many RealEstates.
     */
    data: RealEstateCreateManyInput | RealEstateCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * RealEstate createManyAndReturn
   */
  export type RealEstateCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the RealEstate
     */
    select?: RealEstateSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the RealEstate
     */
    omit?: RealEstateOmit<ExtArgs> | null
    /**
     * The data used to create many RealEstates.
     */
    data: RealEstateCreateManyInput | RealEstateCreateManyInput[]
    skipDuplicates?: boolean
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: RealEstateIncludeCreateManyAndReturn<ExtArgs> | null
  }

  /**
   * RealEstate update
   */
  export type RealEstateUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the RealEstate
     */
    select?: RealEstateSelect<ExtArgs> | null
    /**
     * Omit specific fields from the RealEstate
     */
    omit?: RealEstateOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: RealEstateInclude<ExtArgs> | null
    /**
     * The data needed to update a RealEstate.
     */
    data: XOR<RealEstateUpdateInput, RealEstateUncheckedUpdateInput>
    /**
     * Choose, which RealEstate to update.
     */
    where: RealEstateWhereUniqueInput
  }

  /**
   * RealEstate updateMany
   */
  export type RealEstateUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update RealEstates.
     */
    data: XOR<RealEstateUpdateManyMutationInput, RealEstateUncheckedUpdateManyInput>
    /**
     * Filter which RealEstates to update
     */
    where?: RealEstateWhereInput
    /**
     * Limit how many RealEstates to update.
     */
    limit?: number
  }

  /**
   * RealEstate updateManyAndReturn
   */
  export type RealEstateUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the RealEstate
     */
    select?: RealEstateSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the RealEstate
     */
    omit?: RealEstateOmit<ExtArgs> | null
    /**
     * The data used to update RealEstates.
     */
    data: XOR<RealEstateUpdateManyMutationInput, RealEstateUncheckedUpdateManyInput>
    /**
     * Filter which RealEstates to update
     */
    where?: RealEstateWhereInput
    /**
     * Limit how many RealEstates to update.
     */
    limit?: number
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: RealEstateIncludeUpdateManyAndReturn<ExtArgs> | null
  }

  /**
   * RealEstate upsert
   */
  export type RealEstateUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the RealEstate
     */
    select?: RealEstateSelect<ExtArgs> | null
    /**
     * Omit specific fields from the RealEstate
     */
    omit?: RealEstateOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: RealEstateInclude<ExtArgs> | null
    /**
     * The filter to search for the RealEstate to update in case it exists.
     */
    where: RealEstateWhereUniqueInput
    /**
     * In case the RealEstate found by the `where` argument doesn't exist, create a new RealEstate with this data.
     */
    create: XOR<RealEstateCreateInput, RealEstateUncheckedCreateInput>
    /**
     * In case the RealEstate was found with the provided `where` argument, update it with this data.
     */
    update: XOR<RealEstateUpdateInput, RealEstateUncheckedUpdateInput>
  }

  /**
   * RealEstate delete
   */
  export type RealEstateDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the RealEstate
     */
    select?: RealEstateSelect<ExtArgs> | null
    /**
     * Omit specific fields from the RealEstate
     */
    omit?: RealEstateOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: RealEstateInclude<ExtArgs> | null
    /**
     * Filter which RealEstate to delete.
     */
    where: RealEstateWhereUniqueInput
  }

  /**
   * RealEstate deleteMany
   */
  export type RealEstateDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which RealEstates to delete
     */
    where?: RealEstateWhereInput
    /**
     * Limit how many RealEstates to delete.
     */
    limit?: number
  }

  /**
   * RealEstate without action
   */
  export type RealEstateDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the RealEstate
     */
    select?: RealEstateSelect<ExtArgs> | null
    /**
     * Omit specific fields from the RealEstate
     */
    omit?: RealEstateOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: RealEstateInclude<ExtArgs> | null
  }


  /**
   * Model Step
   */

  export type AggregateStep = {
    _count: StepCountAggregateOutputType | null
    _avg: StepAvgAggregateOutputType | null
    _sum: StepSumAggregateOutputType | null
    _min: StepMinAggregateOutputType | null
    _max: StepMaxAggregateOutputType | null
  }

  export type StepAvgAggregateOutputType = {
    id: number | null
    mainNum: number | null
    subNum: number | null
  }

  export type StepSumAggregateOutputType = {
    id: number | null
    mainNum: number | null
    subNum: number | null
  }

  export type StepMinAggregateOutputType = {
    id: number | null
    mainNum: number | null
    subNum: number | null
  }

  export type StepMaxAggregateOutputType = {
    id: number | null
    mainNum: number | null
    subNum: number | null
  }

  export type StepCountAggregateOutputType = {
    id: number
    mainNum: number
    subNum: number
    _all: number
  }


  export type StepAvgAggregateInputType = {
    id?: true
    mainNum?: true
    subNum?: true
  }

  export type StepSumAggregateInputType = {
    id?: true
    mainNum?: true
    subNum?: true
  }

  export type StepMinAggregateInputType = {
    id?: true
    mainNum?: true
    subNum?: true
  }

  export type StepMaxAggregateInputType = {
    id?: true
    mainNum?: true
    subNum?: true
  }

  export type StepCountAggregateInputType = {
    id?: true
    mainNum?: true
    subNum?: true
    _all?: true
  }

  export type StepAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Step to aggregate.
     */
    where?: StepWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Steps to fetch.
     */
    orderBy?: StepOrderByWithRelationInput | StepOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: StepWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Steps from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Steps.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned Steps
    **/
    _count?: true | StepCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: StepAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: StepSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: StepMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: StepMaxAggregateInputType
  }

  export type GetStepAggregateType<T extends StepAggregateArgs> = {
        [P in keyof T & keyof AggregateStep]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateStep[P]>
      : GetScalarType<T[P], AggregateStep[P]>
  }




  export type StepGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: StepWhereInput
    orderBy?: StepOrderByWithAggregationInput | StepOrderByWithAggregationInput[]
    by: StepScalarFieldEnum[] | StepScalarFieldEnum
    having?: StepScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: StepCountAggregateInputType | true
    _avg?: StepAvgAggregateInputType
    _sum?: StepSumAggregateInputType
    _min?: StepMinAggregateInputType
    _max?: StepMaxAggregateInputType
  }

  export type StepGroupByOutputType = {
    id: number
    mainNum: number
    subNum: number
    _count: StepCountAggregateOutputType | null
    _avg: StepAvgAggregateOutputType | null
    _sum: StepSumAggregateOutputType | null
    _min: StepMinAggregateOutputType | null
    _max: StepMaxAggregateOutputType | null
  }

  type GetStepGroupByPayload<T extends StepGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<StepGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof StepGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], StepGroupByOutputType[P]>
            : GetScalarType<T[P], StepGroupByOutputType[P]>
        }
      >
    >


  export type StepSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    mainNum?: boolean
    subNum?: boolean
    stepResults?: boolean | Step$stepResultsArgs<ExtArgs>
    _count?: boolean | StepCountOutputTypeDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["step"]>

  export type StepSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    mainNum?: boolean
    subNum?: boolean
  }, ExtArgs["result"]["step"]>

  export type StepSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    mainNum?: boolean
    subNum?: boolean
  }, ExtArgs["result"]["step"]>

  export type StepSelectScalar = {
    id?: boolean
    mainNum?: boolean
    subNum?: boolean
  }

  export type StepOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "mainNum" | "subNum", ExtArgs["result"]["step"]>
  export type StepInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    stepResults?: boolean | Step$stepResultsArgs<ExtArgs>
    _count?: boolean | StepCountOutputTypeDefaultArgs<ExtArgs>
  }
  export type StepIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {}
  export type StepIncludeUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {}

  export type $StepPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "Step"
    objects: {
      stepResults: Prisma.$StepResultPayload<ExtArgs>[]
    }
    scalars: $Extensions.GetPayloadResult<{
      id: number
      mainNum: number
      subNum: number
    }, ExtArgs["result"]["step"]>
    composites: {}
  }

  type StepGetPayload<S extends boolean | null | undefined | StepDefaultArgs> = $Result.GetResult<Prisma.$StepPayload, S>

  type StepCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<StepFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: StepCountAggregateInputType | true
    }

  export interface StepDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['Step'], meta: { name: 'Step' } }
    /**
     * Find zero or one Step that matches the filter.
     * @param {StepFindUniqueArgs} args - Arguments to find a Step
     * @example
     * // Get one Step
     * const step = await prisma.step.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends StepFindUniqueArgs>(args: SelectSubset<T, StepFindUniqueArgs<ExtArgs>>): Prisma__StepClient<$Result.GetResult<Prisma.$StepPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one Step that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {StepFindUniqueOrThrowArgs} args - Arguments to find a Step
     * @example
     * // Get one Step
     * const step = await prisma.step.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends StepFindUniqueOrThrowArgs>(args: SelectSubset<T, StepFindUniqueOrThrowArgs<ExtArgs>>): Prisma__StepClient<$Result.GetResult<Prisma.$StepPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Step that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {StepFindFirstArgs} args - Arguments to find a Step
     * @example
     * // Get one Step
     * const step = await prisma.step.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends StepFindFirstArgs>(args?: SelectSubset<T, StepFindFirstArgs<ExtArgs>>): Prisma__StepClient<$Result.GetResult<Prisma.$StepPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Step that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {StepFindFirstOrThrowArgs} args - Arguments to find a Step
     * @example
     * // Get one Step
     * const step = await prisma.step.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends StepFindFirstOrThrowArgs>(args?: SelectSubset<T, StepFindFirstOrThrowArgs<ExtArgs>>): Prisma__StepClient<$Result.GetResult<Prisma.$StepPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more Steps that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {StepFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all Steps
     * const steps = await prisma.step.findMany()
     * 
     * // Get first 10 Steps
     * const steps = await prisma.step.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const stepWithIdOnly = await prisma.step.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends StepFindManyArgs>(args?: SelectSubset<T, StepFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$StepPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a Step.
     * @param {StepCreateArgs} args - Arguments to create a Step.
     * @example
     * // Create one Step
     * const Step = await prisma.step.create({
     *   data: {
     *     // ... data to create a Step
     *   }
     * })
     * 
     */
    create<T extends StepCreateArgs>(args: SelectSubset<T, StepCreateArgs<ExtArgs>>): Prisma__StepClient<$Result.GetResult<Prisma.$StepPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many Steps.
     * @param {StepCreateManyArgs} args - Arguments to create many Steps.
     * @example
     * // Create many Steps
     * const step = await prisma.step.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends StepCreateManyArgs>(args?: SelectSubset<T, StepCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many Steps and returns the data saved in the database.
     * @param {StepCreateManyAndReturnArgs} args - Arguments to create many Steps.
     * @example
     * // Create many Steps
     * const step = await prisma.step.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many Steps and only return the `id`
     * const stepWithIdOnly = await prisma.step.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends StepCreateManyAndReturnArgs>(args?: SelectSubset<T, StepCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$StepPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a Step.
     * @param {StepDeleteArgs} args - Arguments to delete one Step.
     * @example
     * // Delete one Step
     * const Step = await prisma.step.delete({
     *   where: {
     *     // ... filter to delete one Step
     *   }
     * })
     * 
     */
    delete<T extends StepDeleteArgs>(args: SelectSubset<T, StepDeleteArgs<ExtArgs>>): Prisma__StepClient<$Result.GetResult<Prisma.$StepPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one Step.
     * @param {StepUpdateArgs} args - Arguments to update one Step.
     * @example
     * // Update one Step
     * const step = await prisma.step.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends StepUpdateArgs>(args: SelectSubset<T, StepUpdateArgs<ExtArgs>>): Prisma__StepClient<$Result.GetResult<Prisma.$StepPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more Steps.
     * @param {StepDeleteManyArgs} args - Arguments to filter Steps to delete.
     * @example
     * // Delete a few Steps
     * const { count } = await prisma.step.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends StepDeleteManyArgs>(args?: SelectSubset<T, StepDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Steps.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {StepUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many Steps
     * const step = await prisma.step.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends StepUpdateManyArgs>(args: SelectSubset<T, StepUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Steps and returns the data updated in the database.
     * @param {StepUpdateManyAndReturnArgs} args - Arguments to update many Steps.
     * @example
     * // Update many Steps
     * const step = await prisma.step.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more Steps and only return the `id`
     * const stepWithIdOnly = await prisma.step.updateManyAndReturn({
     *   select: { id: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    updateManyAndReturn<T extends StepUpdateManyAndReturnArgs>(args: SelectSubset<T, StepUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$StepPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one Step.
     * @param {StepUpsertArgs} args - Arguments to update or create a Step.
     * @example
     * // Update or create a Step
     * const step = await prisma.step.upsert({
     *   create: {
     *     // ... data to create a Step
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the Step we want to update
     *   }
     * })
     */
    upsert<T extends StepUpsertArgs>(args: SelectSubset<T, StepUpsertArgs<ExtArgs>>): Prisma__StepClient<$Result.GetResult<Prisma.$StepPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of Steps.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {StepCountArgs} args - Arguments to filter Steps to count.
     * @example
     * // Count the number of Steps
     * const count = await prisma.step.count({
     *   where: {
     *     // ... the filter for the Steps we want to count
     *   }
     * })
    **/
    count<T extends StepCountArgs>(
      args?: Subset<T, StepCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], StepCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a Step.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {StepAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends StepAggregateArgs>(args: Subset<T, StepAggregateArgs>): Prisma.PrismaPromise<GetStepAggregateType<T>>

    /**
     * Group by Step.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {StepGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends StepGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: StepGroupByArgs['orderBy'] }
        : { orderBy?: StepGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, StepGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetStepGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the Step model
   */
  readonly fields: StepFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for Step.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__StepClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    stepResults<T extends Step$stepResultsArgs<ExtArgs> = {}>(args?: Subset<T, Step$stepResultsArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$StepResultPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the Step model
   */
  interface StepFieldRefs {
    readonly id: FieldRef<"Step", 'Int'>
    readonly mainNum: FieldRef<"Step", 'Int'>
    readonly subNum: FieldRef<"Step", 'Int'>
  }
    

  // Custom InputTypes
  /**
   * Step findUnique
   */
  export type StepFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Step
     */
    select?: StepSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Step
     */
    omit?: StepOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: StepInclude<ExtArgs> | null
    /**
     * Filter, which Step to fetch.
     */
    where: StepWhereUniqueInput
  }

  /**
   * Step findUniqueOrThrow
   */
  export type StepFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Step
     */
    select?: StepSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Step
     */
    omit?: StepOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: StepInclude<ExtArgs> | null
    /**
     * Filter, which Step to fetch.
     */
    where: StepWhereUniqueInput
  }

  /**
   * Step findFirst
   */
  export type StepFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Step
     */
    select?: StepSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Step
     */
    omit?: StepOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: StepInclude<ExtArgs> | null
    /**
     * Filter, which Step to fetch.
     */
    where?: StepWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Steps to fetch.
     */
    orderBy?: StepOrderByWithRelationInput | StepOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Steps.
     */
    cursor?: StepWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Steps from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Steps.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Steps.
     */
    distinct?: StepScalarFieldEnum | StepScalarFieldEnum[]
  }

  /**
   * Step findFirstOrThrow
   */
  export type StepFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Step
     */
    select?: StepSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Step
     */
    omit?: StepOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: StepInclude<ExtArgs> | null
    /**
     * Filter, which Step to fetch.
     */
    where?: StepWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Steps to fetch.
     */
    orderBy?: StepOrderByWithRelationInput | StepOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Steps.
     */
    cursor?: StepWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Steps from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Steps.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Steps.
     */
    distinct?: StepScalarFieldEnum | StepScalarFieldEnum[]
  }

  /**
   * Step findMany
   */
  export type StepFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Step
     */
    select?: StepSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Step
     */
    omit?: StepOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: StepInclude<ExtArgs> | null
    /**
     * Filter, which Steps to fetch.
     */
    where?: StepWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Steps to fetch.
     */
    orderBy?: StepOrderByWithRelationInput | StepOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing Steps.
     */
    cursor?: StepWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Steps from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Steps.
     */
    skip?: number
    distinct?: StepScalarFieldEnum | StepScalarFieldEnum[]
  }

  /**
   * Step create
   */
  export type StepCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Step
     */
    select?: StepSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Step
     */
    omit?: StepOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: StepInclude<ExtArgs> | null
    /**
     * The data needed to create a Step.
     */
    data: XOR<StepCreateInput, StepUncheckedCreateInput>
  }

  /**
   * Step createMany
   */
  export type StepCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many Steps.
     */
    data: StepCreateManyInput | StepCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * Step createManyAndReturn
   */
  export type StepCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Step
     */
    select?: StepSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the Step
     */
    omit?: StepOmit<ExtArgs> | null
    /**
     * The data used to create many Steps.
     */
    data: StepCreateManyInput | StepCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * Step update
   */
  export type StepUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Step
     */
    select?: StepSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Step
     */
    omit?: StepOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: StepInclude<ExtArgs> | null
    /**
     * The data needed to update a Step.
     */
    data: XOR<StepUpdateInput, StepUncheckedUpdateInput>
    /**
     * Choose, which Step to update.
     */
    where: StepWhereUniqueInput
  }

  /**
   * Step updateMany
   */
  export type StepUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update Steps.
     */
    data: XOR<StepUpdateManyMutationInput, StepUncheckedUpdateManyInput>
    /**
     * Filter which Steps to update
     */
    where?: StepWhereInput
    /**
     * Limit how many Steps to update.
     */
    limit?: number
  }

  /**
   * Step updateManyAndReturn
   */
  export type StepUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Step
     */
    select?: StepSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the Step
     */
    omit?: StepOmit<ExtArgs> | null
    /**
     * The data used to update Steps.
     */
    data: XOR<StepUpdateManyMutationInput, StepUncheckedUpdateManyInput>
    /**
     * Filter which Steps to update
     */
    where?: StepWhereInput
    /**
     * Limit how many Steps to update.
     */
    limit?: number
  }

  /**
   * Step upsert
   */
  export type StepUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Step
     */
    select?: StepSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Step
     */
    omit?: StepOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: StepInclude<ExtArgs> | null
    /**
     * The filter to search for the Step to update in case it exists.
     */
    where: StepWhereUniqueInput
    /**
     * In case the Step found by the `where` argument doesn't exist, create a new Step with this data.
     */
    create: XOR<StepCreateInput, StepUncheckedCreateInput>
    /**
     * In case the Step was found with the provided `where` argument, update it with this data.
     */
    update: XOR<StepUpdateInput, StepUncheckedUpdateInput>
  }

  /**
   * Step delete
   */
  export type StepDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Step
     */
    select?: StepSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Step
     */
    omit?: StepOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: StepInclude<ExtArgs> | null
    /**
     * Filter which Step to delete.
     */
    where: StepWhereUniqueInput
  }

  /**
   * Step deleteMany
   */
  export type StepDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Steps to delete
     */
    where?: StepWhereInput
    /**
     * Limit how many Steps to delete.
     */
    limit?: number
  }

  /**
   * Step.stepResults
   */
  export type Step$stepResultsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the StepResult
     */
    select?: StepResultSelect<ExtArgs> | null
    /**
     * Omit specific fields from the StepResult
     */
    omit?: StepResultOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: StepResultInclude<ExtArgs> | null
    where?: StepResultWhereInput
    orderBy?: StepResultOrderByWithRelationInput | StepResultOrderByWithRelationInput[]
    cursor?: StepResultWhereUniqueInput
    take?: number
    skip?: number
    distinct?: StepResultScalarFieldEnum | StepResultScalarFieldEnum[]
  }

  /**
   * Step without action
   */
  export type StepDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Step
     */
    select?: StepSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Step
     */
    omit?: StepOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: StepInclude<ExtArgs> | null
  }


  /**
   * Model StepResult
   */

  export type AggregateStepResult = {
    _count: StepResultCountAggregateOutputType | null
    _avg: StepResultAvgAggregateOutputType | null
    _sum: StepResultSumAggregateOutputType | null
    _min: StepResultMinAggregateOutputType | null
    _max: StepResultMaxAggregateOutputType | null
  }

  export type StepResultAvgAggregateOutputType = {
    id: number | null
    userAddressId: number | null
    stepId: number | null
    mismatch: number | null
    match: number | null
    unchecked: number | null
  }

  export type StepResultSumAggregateOutputType = {
    id: number | null
    userAddressId: number | null
    stepId: number | null
    mismatch: number | null
    match: number | null
    unchecked: number | null
  }

  export type StepResultMinAggregateOutputType = {
    id: number | null
    userAddressId: number | null
    stepId: number | null
    mismatch: number | null
    match: number | null
    unchecked: number | null
    createdAt: Date | null
  }

  export type StepResultMaxAggregateOutputType = {
    id: number | null
    userAddressId: number | null
    stepId: number | null
    mismatch: number | null
    match: number | null
    unchecked: number | null
    createdAt: Date | null
  }

  export type StepResultCountAggregateOutputType = {
    id: number
    userAddressId: number
    stepId: number
    mismatch: number
    match: number
    unchecked: number
    createdAt: number
    _all: number
  }


  export type StepResultAvgAggregateInputType = {
    id?: true
    userAddressId?: true
    stepId?: true
    mismatch?: true
    match?: true
    unchecked?: true
  }

  export type StepResultSumAggregateInputType = {
    id?: true
    userAddressId?: true
    stepId?: true
    mismatch?: true
    match?: true
    unchecked?: true
  }

  export type StepResultMinAggregateInputType = {
    id?: true
    userAddressId?: true
    stepId?: true
    mismatch?: true
    match?: true
    unchecked?: true
    createdAt?: true
  }

  export type StepResultMaxAggregateInputType = {
    id?: true
    userAddressId?: true
    stepId?: true
    mismatch?: true
    match?: true
    unchecked?: true
    createdAt?: true
  }

  export type StepResultCountAggregateInputType = {
    id?: true
    userAddressId?: true
    stepId?: true
    mismatch?: true
    match?: true
    unchecked?: true
    createdAt?: true
    _all?: true
  }

  export type StepResultAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which StepResult to aggregate.
     */
    where?: StepResultWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of StepResults to fetch.
     */
    orderBy?: StepResultOrderByWithRelationInput | StepResultOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: StepResultWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` StepResults from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` StepResults.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned StepResults
    **/
    _count?: true | StepResultCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: StepResultAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: StepResultSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: StepResultMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: StepResultMaxAggregateInputType
  }

  export type GetStepResultAggregateType<T extends StepResultAggregateArgs> = {
        [P in keyof T & keyof AggregateStepResult]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateStepResult[P]>
      : GetScalarType<T[P], AggregateStepResult[P]>
  }




  export type StepResultGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: StepResultWhereInput
    orderBy?: StepResultOrderByWithAggregationInput | StepResultOrderByWithAggregationInput[]
    by: StepResultScalarFieldEnum[] | StepResultScalarFieldEnum
    having?: StepResultScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: StepResultCountAggregateInputType | true
    _avg?: StepResultAvgAggregateInputType
    _sum?: StepResultSumAggregateInputType
    _min?: StepResultMinAggregateInputType
    _max?: StepResultMaxAggregateInputType
  }

  export type StepResultGroupByOutputType = {
    id: number
    userAddressId: number
    stepId: number
    mismatch: number | null
    match: number | null
    unchecked: number | null
    createdAt: Date
    _count: StepResultCountAggregateOutputType | null
    _avg: StepResultAvgAggregateOutputType | null
    _sum: StepResultSumAggregateOutputType | null
    _min: StepResultMinAggregateOutputType | null
    _max: StepResultMaxAggregateOutputType | null
  }

  type GetStepResultGroupByPayload<T extends StepResultGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<StepResultGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof StepResultGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], StepResultGroupByOutputType[P]>
            : GetScalarType<T[P], StepResultGroupByOutputType[P]>
        }
      >
    >


  export type StepResultSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    userAddressId?: boolean
    stepId?: boolean
    mismatch?: boolean
    match?: boolean
    unchecked?: boolean
    createdAt?: boolean
    userAddress?: boolean | UserAddressDefaultArgs<ExtArgs>
    step?: boolean | StepDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["stepResult"]>

  export type StepResultSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    userAddressId?: boolean
    stepId?: boolean
    mismatch?: boolean
    match?: boolean
    unchecked?: boolean
    createdAt?: boolean
    userAddress?: boolean | UserAddressDefaultArgs<ExtArgs>
    step?: boolean | StepDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["stepResult"]>

  export type StepResultSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    userAddressId?: boolean
    stepId?: boolean
    mismatch?: boolean
    match?: boolean
    unchecked?: boolean
    createdAt?: boolean
    userAddress?: boolean | UserAddressDefaultArgs<ExtArgs>
    step?: boolean | StepDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["stepResult"]>

  export type StepResultSelectScalar = {
    id?: boolean
    userAddressId?: boolean
    stepId?: boolean
    mismatch?: boolean
    match?: boolean
    unchecked?: boolean
    createdAt?: boolean
  }

  export type StepResultOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "userAddressId" | "stepId" | "mismatch" | "match" | "unchecked" | "createdAt", ExtArgs["result"]["stepResult"]>
  export type StepResultInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    userAddress?: boolean | UserAddressDefaultArgs<ExtArgs>
    step?: boolean | StepDefaultArgs<ExtArgs>
  }
  export type StepResultIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    userAddress?: boolean | UserAddressDefaultArgs<ExtArgs>
    step?: boolean | StepDefaultArgs<ExtArgs>
  }
  export type StepResultIncludeUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    userAddress?: boolean | UserAddressDefaultArgs<ExtArgs>
    step?: boolean | StepDefaultArgs<ExtArgs>
  }

  export type $StepResultPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "StepResult"
    objects: {
      userAddress: Prisma.$UserAddressPayload<ExtArgs>
      step: Prisma.$StepPayload<ExtArgs>
    }
    scalars: $Extensions.GetPayloadResult<{
      id: number
      userAddressId: number
      stepId: number
      mismatch: number | null
      match: number | null
      unchecked: number | null
      createdAt: Date
    }, ExtArgs["result"]["stepResult"]>
    composites: {}
  }

  type StepResultGetPayload<S extends boolean | null | undefined | StepResultDefaultArgs> = $Result.GetResult<Prisma.$StepResultPayload, S>

  type StepResultCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<StepResultFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: StepResultCountAggregateInputType | true
    }

  export interface StepResultDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['StepResult'], meta: { name: 'StepResult' } }
    /**
     * Find zero or one StepResult that matches the filter.
     * @param {StepResultFindUniqueArgs} args - Arguments to find a StepResult
     * @example
     * // Get one StepResult
     * const stepResult = await prisma.stepResult.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends StepResultFindUniqueArgs>(args: SelectSubset<T, StepResultFindUniqueArgs<ExtArgs>>): Prisma__StepResultClient<$Result.GetResult<Prisma.$StepResultPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one StepResult that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {StepResultFindUniqueOrThrowArgs} args - Arguments to find a StepResult
     * @example
     * // Get one StepResult
     * const stepResult = await prisma.stepResult.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends StepResultFindUniqueOrThrowArgs>(args: SelectSubset<T, StepResultFindUniqueOrThrowArgs<ExtArgs>>): Prisma__StepResultClient<$Result.GetResult<Prisma.$StepResultPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first StepResult that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {StepResultFindFirstArgs} args - Arguments to find a StepResult
     * @example
     * // Get one StepResult
     * const stepResult = await prisma.stepResult.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends StepResultFindFirstArgs>(args?: SelectSubset<T, StepResultFindFirstArgs<ExtArgs>>): Prisma__StepResultClient<$Result.GetResult<Prisma.$StepResultPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first StepResult that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {StepResultFindFirstOrThrowArgs} args - Arguments to find a StepResult
     * @example
     * // Get one StepResult
     * const stepResult = await prisma.stepResult.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends StepResultFindFirstOrThrowArgs>(args?: SelectSubset<T, StepResultFindFirstOrThrowArgs<ExtArgs>>): Prisma__StepResultClient<$Result.GetResult<Prisma.$StepResultPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more StepResults that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {StepResultFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all StepResults
     * const stepResults = await prisma.stepResult.findMany()
     * 
     * // Get first 10 StepResults
     * const stepResults = await prisma.stepResult.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const stepResultWithIdOnly = await prisma.stepResult.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends StepResultFindManyArgs>(args?: SelectSubset<T, StepResultFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$StepResultPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a StepResult.
     * @param {StepResultCreateArgs} args - Arguments to create a StepResult.
     * @example
     * // Create one StepResult
     * const StepResult = await prisma.stepResult.create({
     *   data: {
     *     // ... data to create a StepResult
     *   }
     * })
     * 
     */
    create<T extends StepResultCreateArgs>(args: SelectSubset<T, StepResultCreateArgs<ExtArgs>>): Prisma__StepResultClient<$Result.GetResult<Prisma.$StepResultPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many StepResults.
     * @param {StepResultCreateManyArgs} args - Arguments to create many StepResults.
     * @example
     * // Create many StepResults
     * const stepResult = await prisma.stepResult.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends StepResultCreateManyArgs>(args?: SelectSubset<T, StepResultCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many StepResults and returns the data saved in the database.
     * @param {StepResultCreateManyAndReturnArgs} args - Arguments to create many StepResults.
     * @example
     * // Create many StepResults
     * const stepResult = await prisma.stepResult.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many StepResults and only return the `id`
     * const stepResultWithIdOnly = await prisma.stepResult.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends StepResultCreateManyAndReturnArgs>(args?: SelectSubset<T, StepResultCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$StepResultPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a StepResult.
     * @param {StepResultDeleteArgs} args - Arguments to delete one StepResult.
     * @example
     * // Delete one StepResult
     * const StepResult = await prisma.stepResult.delete({
     *   where: {
     *     // ... filter to delete one StepResult
     *   }
     * })
     * 
     */
    delete<T extends StepResultDeleteArgs>(args: SelectSubset<T, StepResultDeleteArgs<ExtArgs>>): Prisma__StepResultClient<$Result.GetResult<Prisma.$StepResultPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one StepResult.
     * @param {StepResultUpdateArgs} args - Arguments to update one StepResult.
     * @example
     * // Update one StepResult
     * const stepResult = await prisma.stepResult.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends StepResultUpdateArgs>(args: SelectSubset<T, StepResultUpdateArgs<ExtArgs>>): Prisma__StepResultClient<$Result.GetResult<Prisma.$StepResultPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more StepResults.
     * @param {StepResultDeleteManyArgs} args - Arguments to filter StepResults to delete.
     * @example
     * // Delete a few StepResults
     * const { count } = await prisma.stepResult.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends StepResultDeleteManyArgs>(args?: SelectSubset<T, StepResultDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more StepResults.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {StepResultUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many StepResults
     * const stepResult = await prisma.stepResult.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends StepResultUpdateManyArgs>(args: SelectSubset<T, StepResultUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more StepResults and returns the data updated in the database.
     * @param {StepResultUpdateManyAndReturnArgs} args - Arguments to update many StepResults.
     * @example
     * // Update many StepResults
     * const stepResult = await prisma.stepResult.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more StepResults and only return the `id`
     * const stepResultWithIdOnly = await prisma.stepResult.updateManyAndReturn({
     *   select: { id: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    updateManyAndReturn<T extends StepResultUpdateManyAndReturnArgs>(args: SelectSubset<T, StepResultUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$StepResultPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one StepResult.
     * @param {StepResultUpsertArgs} args - Arguments to update or create a StepResult.
     * @example
     * // Update or create a StepResult
     * const stepResult = await prisma.stepResult.upsert({
     *   create: {
     *     // ... data to create a StepResult
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the StepResult we want to update
     *   }
     * })
     */
    upsert<T extends StepResultUpsertArgs>(args: SelectSubset<T, StepResultUpsertArgs<ExtArgs>>): Prisma__StepResultClient<$Result.GetResult<Prisma.$StepResultPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of StepResults.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {StepResultCountArgs} args - Arguments to filter StepResults to count.
     * @example
     * // Count the number of StepResults
     * const count = await prisma.stepResult.count({
     *   where: {
     *     // ... the filter for the StepResults we want to count
     *   }
     * })
    **/
    count<T extends StepResultCountArgs>(
      args?: Subset<T, StepResultCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], StepResultCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a StepResult.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {StepResultAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends StepResultAggregateArgs>(args: Subset<T, StepResultAggregateArgs>): Prisma.PrismaPromise<GetStepResultAggregateType<T>>

    /**
     * Group by StepResult.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {StepResultGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends StepResultGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: StepResultGroupByArgs['orderBy'] }
        : { orderBy?: StepResultGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, StepResultGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetStepResultGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the StepResult model
   */
  readonly fields: StepResultFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for StepResult.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__StepResultClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    userAddress<T extends UserAddressDefaultArgs<ExtArgs> = {}>(args?: Subset<T, UserAddressDefaultArgs<ExtArgs>>): Prisma__UserAddressClient<$Result.GetResult<Prisma.$UserAddressPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>
    step<T extends StepDefaultArgs<ExtArgs> = {}>(args?: Subset<T, StepDefaultArgs<ExtArgs>>): Prisma__StepClient<$Result.GetResult<Prisma.$StepPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the StepResult model
   */
  interface StepResultFieldRefs {
    readonly id: FieldRef<"StepResult", 'Int'>
    readonly userAddressId: FieldRef<"StepResult", 'Int'>
    readonly stepId: FieldRef<"StepResult", 'Int'>
    readonly mismatch: FieldRef<"StepResult", 'Int'>
    readonly match: FieldRef<"StepResult", 'Int'>
    readonly unchecked: FieldRef<"StepResult", 'Int'>
    readonly createdAt: FieldRef<"StepResult", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * StepResult findUnique
   */
  export type StepResultFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the StepResult
     */
    select?: StepResultSelect<ExtArgs> | null
    /**
     * Omit specific fields from the StepResult
     */
    omit?: StepResultOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: StepResultInclude<ExtArgs> | null
    /**
     * Filter, which StepResult to fetch.
     */
    where: StepResultWhereUniqueInput
  }

  /**
   * StepResult findUniqueOrThrow
   */
  export type StepResultFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the StepResult
     */
    select?: StepResultSelect<ExtArgs> | null
    /**
     * Omit specific fields from the StepResult
     */
    omit?: StepResultOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: StepResultInclude<ExtArgs> | null
    /**
     * Filter, which StepResult to fetch.
     */
    where: StepResultWhereUniqueInput
  }

  /**
   * StepResult findFirst
   */
  export type StepResultFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the StepResult
     */
    select?: StepResultSelect<ExtArgs> | null
    /**
     * Omit specific fields from the StepResult
     */
    omit?: StepResultOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: StepResultInclude<ExtArgs> | null
    /**
     * Filter, which StepResult to fetch.
     */
    where?: StepResultWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of StepResults to fetch.
     */
    orderBy?: StepResultOrderByWithRelationInput | StepResultOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for StepResults.
     */
    cursor?: StepResultWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` StepResults from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` StepResults.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of StepResults.
     */
    distinct?: StepResultScalarFieldEnum | StepResultScalarFieldEnum[]
  }

  /**
   * StepResult findFirstOrThrow
   */
  export type StepResultFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the StepResult
     */
    select?: StepResultSelect<ExtArgs> | null
    /**
     * Omit specific fields from the StepResult
     */
    omit?: StepResultOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: StepResultInclude<ExtArgs> | null
    /**
     * Filter, which StepResult to fetch.
     */
    where?: StepResultWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of StepResults to fetch.
     */
    orderBy?: StepResultOrderByWithRelationInput | StepResultOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for StepResults.
     */
    cursor?: StepResultWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` StepResults from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` StepResults.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of StepResults.
     */
    distinct?: StepResultScalarFieldEnum | StepResultScalarFieldEnum[]
  }

  /**
   * StepResult findMany
   */
  export type StepResultFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the StepResult
     */
    select?: StepResultSelect<ExtArgs> | null
    /**
     * Omit specific fields from the StepResult
     */
    omit?: StepResultOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: StepResultInclude<ExtArgs> | null
    /**
     * Filter, which StepResults to fetch.
     */
    where?: StepResultWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of StepResults to fetch.
     */
    orderBy?: StepResultOrderByWithRelationInput | StepResultOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing StepResults.
     */
    cursor?: StepResultWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` StepResults from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` StepResults.
     */
    skip?: number
    distinct?: StepResultScalarFieldEnum | StepResultScalarFieldEnum[]
  }

  /**
   * StepResult create
   */
  export type StepResultCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the StepResult
     */
    select?: StepResultSelect<ExtArgs> | null
    /**
     * Omit specific fields from the StepResult
     */
    omit?: StepResultOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: StepResultInclude<ExtArgs> | null
    /**
     * The data needed to create a StepResult.
     */
    data: XOR<StepResultCreateInput, StepResultUncheckedCreateInput>
  }

  /**
   * StepResult createMany
   */
  export type StepResultCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many StepResults.
     */
    data: StepResultCreateManyInput | StepResultCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * StepResult createManyAndReturn
   */
  export type StepResultCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the StepResult
     */
    select?: StepResultSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the StepResult
     */
    omit?: StepResultOmit<ExtArgs> | null
    /**
     * The data used to create many StepResults.
     */
    data: StepResultCreateManyInput | StepResultCreateManyInput[]
    skipDuplicates?: boolean
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: StepResultIncludeCreateManyAndReturn<ExtArgs> | null
  }

  /**
   * StepResult update
   */
  export type StepResultUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the StepResult
     */
    select?: StepResultSelect<ExtArgs> | null
    /**
     * Omit specific fields from the StepResult
     */
    omit?: StepResultOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: StepResultInclude<ExtArgs> | null
    /**
     * The data needed to update a StepResult.
     */
    data: XOR<StepResultUpdateInput, StepResultUncheckedUpdateInput>
    /**
     * Choose, which StepResult to update.
     */
    where: StepResultWhereUniqueInput
  }

  /**
   * StepResult updateMany
   */
  export type StepResultUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update StepResults.
     */
    data: XOR<StepResultUpdateManyMutationInput, StepResultUncheckedUpdateManyInput>
    /**
     * Filter which StepResults to update
     */
    where?: StepResultWhereInput
    /**
     * Limit how many StepResults to update.
     */
    limit?: number
  }

  /**
   * StepResult updateManyAndReturn
   */
  export type StepResultUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the StepResult
     */
    select?: StepResultSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the StepResult
     */
    omit?: StepResultOmit<ExtArgs> | null
    /**
     * The data used to update StepResults.
     */
    data: XOR<StepResultUpdateManyMutationInput, StepResultUncheckedUpdateManyInput>
    /**
     * Filter which StepResults to update
     */
    where?: StepResultWhereInput
    /**
     * Limit how many StepResults to update.
     */
    limit?: number
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: StepResultIncludeUpdateManyAndReturn<ExtArgs> | null
  }

  /**
   * StepResult upsert
   */
  export type StepResultUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the StepResult
     */
    select?: StepResultSelect<ExtArgs> | null
    /**
     * Omit specific fields from the StepResult
     */
    omit?: StepResultOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: StepResultInclude<ExtArgs> | null
    /**
     * The filter to search for the StepResult to update in case it exists.
     */
    where: StepResultWhereUniqueInput
    /**
     * In case the StepResult found by the `where` argument doesn't exist, create a new StepResult with this data.
     */
    create: XOR<StepResultCreateInput, StepResultUncheckedCreateInput>
    /**
     * In case the StepResult was found with the provided `where` argument, update it with this data.
     */
    update: XOR<StepResultUpdateInput, StepResultUncheckedUpdateInput>
  }

  /**
   * StepResult delete
   */
  export type StepResultDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the StepResult
     */
    select?: StepResultSelect<ExtArgs> | null
    /**
     * Omit specific fields from the StepResult
     */
    omit?: StepResultOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: StepResultInclude<ExtArgs> | null
    /**
     * Filter which StepResult to delete.
     */
    where: StepResultWhereUniqueInput
  }

  /**
   * StepResult deleteMany
   */
  export type StepResultDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which StepResults to delete
     */
    where?: StepResultWhereInput
    /**
     * Limit how many StepResults to delete.
     */
    limit?: number
  }

  /**
   * StepResult without action
   */
  export type StepResultDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the StepResult
     */
    select?: StepResultSelect<ExtArgs> | null
    /**
     * Omit specific fields from the StepResult
     */
    omit?: StepResultOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: StepResultInclude<ExtArgs> | null
  }


  /**
   * Enums
   */

  export const TransactionIsolationLevel: {
    ReadUncommitted: 'ReadUncommitted',
    ReadCommitted: 'ReadCommitted',
    RepeatableRead: 'RepeatableRead',
    Serializable: 'Serializable'
  };

  export type TransactionIsolationLevel = (typeof TransactionIsolationLevel)[keyof typeof TransactionIsolationLevel]


  export const UserScalarFieldEnum: {
    id: 'id',
    name: 'name',
    nickname: 'nickname',
    username: 'username',
    password: 'password',
    pinNumber: 'pinNumber',
    phoneNumber: 'phoneNumber'
  };

  export type UserScalarFieldEnum = (typeof UserScalarFieldEnum)[keyof typeof UserScalarFieldEnum]


  export const TaxCertScalarFieldEnum: {
    id: 'id',
    userId: 'userId',
    taxCertJson: 'taxCertJson'
  };

  export type TaxCertScalarFieldEnum = (typeof TaxCertScalarFieldEnum)[keyof typeof TaxCertScalarFieldEnum]


  export const AddressScalarFieldEnum: {
    id: 'id',
    latitude: 'latitude',
    longitude: 'longitude',
    legalDistrictCode: 'legalDistrictCode',
    dong: 'dong',
    ho: 'ho'
  };

  export type AddressScalarFieldEnum = (typeof AddressScalarFieldEnum)[keyof typeof AddressScalarFieldEnum]


  export const UserAddressScalarFieldEnum: {
    id: 'id',
    userId: 'userId',
    addressId: 'addressId',
    isPrimary: 'isPrimary',
    createdAt: 'createdAt',
    nickname: 'nickname'
  };

  export type UserAddressScalarFieldEnum = (typeof UserAddressScalarFieldEnum)[keyof typeof UserAddressScalarFieldEnum]


  export const RealEstateScalarFieldEnum: {
    id: 'id',
    userAddressId: 'userAddressId',
    realEstateJson: 'realEstateJson'
  };

  export type RealEstateScalarFieldEnum = (typeof RealEstateScalarFieldEnum)[keyof typeof RealEstateScalarFieldEnum]


  export const StepScalarFieldEnum: {
    id: 'id',
    mainNum: 'mainNum',
    subNum: 'subNum'
  };

  export type StepScalarFieldEnum = (typeof StepScalarFieldEnum)[keyof typeof StepScalarFieldEnum]


  export const StepResultScalarFieldEnum: {
    id: 'id',
    userAddressId: 'userAddressId',
    stepId: 'stepId',
    mismatch: 'mismatch',
    match: 'match',
    unchecked: 'unchecked',
    createdAt: 'createdAt'
  };

  export type StepResultScalarFieldEnum = (typeof StepResultScalarFieldEnum)[keyof typeof StepResultScalarFieldEnum]


  export const SortOrder: {
    asc: 'asc',
    desc: 'desc'
  };

  export type SortOrder = (typeof SortOrder)[keyof typeof SortOrder]


  export const NullableJsonNullValueInput: {
    DbNull: typeof DbNull,
    JsonNull: typeof JsonNull
  };

  export type NullableJsonNullValueInput = (typeof NullableJsonNullValueInput)[keyof typeof NullableJsonNullValueInput]


  export const QueryMode: {
    default: 'default',
    insensitive: 'insensitive'
  };

  export type QueryMode = (typeof QueryMode)[keyof typeof QueryMode]


  export const NullsOrder: {
    first: 'first',
    last: 'last'
  };

  export type NullsOrder = (typeof NullsOrder)[keyof typeof NullsOrder]


  export const JsonNullValueFilter: {
    DbNull: typeof DbNull,
    JsonNull: typeof JsonNull,
    AnyNull: typeof AnyNull
  };

  export type JsonNullValueFilter = (typeof JsonNullValueFilter)[keyof typeof JsonNullValueFilter]


  /**
   * Field references
   */


  /**
   * Reference to a field of type 'String'
   */
  export type StringFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'String'>
    


  /**
   * Reference to a field of type 'String[]'
   */
  export type ListStringFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'String[]'>
    


  /**
   * Reference to a field of type 'Int'
   */
  export type IntFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Int'>
    


  /**
   * Reference to a field of type 'Int[]'
   */
  export type ListIntFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Int[]'>
    


  /**
   * Reference to a field of type 'Json'
   */
  export type JsonFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Json'>
    


  /**
   * Reference to a field of type 'QueryMode'
   */
  export type EnumQueryModeFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'QueryMode'>
    


  /**
   * Reference to a field of type 'Float'
   */
  export type FloatFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Float'>
    


  /**
   * Reference to a field of type 'Float[]'
   */
  export type ListFloatFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Float[]'>
    


  /**
   * Reference to a field of type 'Boolean'
   */
  export type BooleanFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Boolean'>
    


  /**
   * Reference to a field of type 'DateTime'
   */
  export type DateTimeFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'DateTime'>
    


  /**
   * Reference to a field of type 'DateTime[]'
   */
  export type ListDateTimeFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'DateTime[]'>
    
  /**
   * Deep Input Types
   */


  export type UserWhereInput = {
    AND?: UserWhereInput | UserWhereInput[]
    OR?: UserWhereInput[]
    NOT?: UserWhereInput | UserWhereInput[]
    id?: UuidFilter<"User"> | string
    name?: StringNullableFilter<"User"> | string | null
    nickname?: StringNullableFilter<"User"> | string | null
    username?: StringNullableFilter<"User"> | string | null
    password?: StringNullableFilter<"User"> | string | null
    pinNumber?: StringNullableFilter<"User"> | string | null
    phoneNumber?: StringNullableFilter<"User"> | string | null
    taxCerts?: TaxCertListRelationFilter
    userAddresses?: UserAddressListRelationFilter
  }

  export type UserOrderByWithRelationInput = {
    id?: SortOrder
    name?: SortOrderInput | SortOrder
    nickname?: SortOrderInput | SortOrder
    username?: SortOrderInput | SortOrder
    password?: SortOrderInput | SortOrder
    pinNumber?: SortOrderInput | SortOrder
    phoneNumber?: SortOrderInput | SortOrder
    taxCerts?: TaxCertOrderByRelationAggregateInput
    userAddresses?: UserAddressOrderByRelationAggregateInput
  }

  export type UserWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    AND?: UserWhereInput | UserWhereInput[]
    OR?: UserWhereInput[]
    NOT?: UserWhereInput | UserWhereInput[]
    name?: StringNullableFilter<"User"> | string | null
    nickname?: StringNullableFilter<"User"> | string | null
    username?: StringNullableFilter<"User"> | string | null
    password?: StringNullableFilter<"User"> | string | null
    pinNumber?: StringNullableFilter<"User"> | string | null
    phoneNumber?: StringNullableFilter<"User"> | string | null
    taxCerts?: TaxCertListRelationFilter
    userAddresses?: UserAddressListRelationFilter
  }, "id">

  export type UserOrderByWithAggregationInput = {
    id?: SortOrder
    name?: SortOrderInput | SortOrder
    nickname?: SortOrderInput | SortOrder
    username?: SortOrderInput | SortOrder
    password?: SortOrderInput | SortOrder
    pinNumber?: SortOrderInput | SortOrder
    phoneNumber?: SortOrderInput | SortOrder
    _count?: UserCountOrderByAggregateInput
    _max?: UserMaxOrderByAggregateInput
    _min?: UserMinOrderByAggregateInput
  }

  export type UserScalarWhereWithAggregatesInput = {
    AND?: UserScalarWhereWithAggregatesInput | UserScalarWhereWithAggregatesInput[]
    OR?: UserScalarWhereWithAggregatesInput[]
    NOT?: UserScalarWhereWithAggregatesInput | UserScalarWhereWithAggregatesInput[]
    id?: UuidWithAggregatesFilter<"User"> | string
    name?: StringNullableWithAggregatesFilter<"User"> | string | null
    nickname?: StringNullableWithAggregatesFilter<"User"> | string | null
    username?: StringNullableWithAggregatesFilter<"User"> | string | null
    password?: StringNullableWithAggregatesFilter<"User"> | string | null
    pinNumber?: StringNullableWithAggregatesFilter<"User"> | string | null
    phoneNumber?: StringNullableWithAggregatesFilter<"User"> | string | null
  }

  export type TaxCertWhereInput = {
    AND?: TaxCertWhereInput | TaxCertWhereInput[]
    OR?: TaxCertWhereInput[]
    NOT?: TaxCertWhereInput | TaxCertWhereInput[]
    id?: IntFilter<"TaxCert"> | number
    userId?: UuidFilter<"TaxCert"> | string
    taxCertJson?: JsonNullableFilter<"TaxCert">
    user?: XOR<UserScalarRelationFilter, UserWhereInput>
  }

  export type TaxCertOrderByWithRelationInput = {
    id?: SortOrder
    userId?: SortOrder
    taxCertJson?: SortOrderInput | SortOrder
    user?: UserOrderByWithRelationInput
  }

  export type TaxCertWhereUniqueInput = Prisma.AtLeast<{
    id?: number
    AND?: TaxCertWhereInput | TaxCertWhereInput[]
    OR?: TaxCertWhereInput[]
    NOT?: TaxCertWhereInput | TaxCertWhereInput[]
    userId?: UuidFilter<"TaxCert"> | string
    taxCertJson?: JsonNullableFilter<"TaxCert">
    user?: XOR<UserScalarRelationFilter, UserWhereInput>
  }, "id">

  export type TaxCertOrderByWithAggregationInput = {
    id?: SortOrder
    userId?: SortOrder
    taxCertJson?: SortOrderInput | SortOrder
    _count?: TaxCertCountOrderByAggregateInput
    _avg?: TaxCertAvgOrderByAggregateInput
    _max?: TaxCertMaxOrderByAggregateInput
    _min?: TaxCertMinOrderByAggregateInput
    _sum?: TaxCertSumOrderByAggregateInput
  }

  export type TaxCertScalarWhereWithAggregatesInput = {
    AND?: TaxCertScalarWhereWithAggregatesInput | TaxCertScalarWhereWithAggregatesInput[]
    OR?: TaxCertScalarWhereWithAggregatesInput[]
    NOT?: TaxCertScalarWhereWithAggregatesInput | TaxCertScalarWhereWithAggregatesInput[]
    id?: IntWithAggregatesFilter<"TaxCert"> | number
    userId?: UuidWithAggregatesFilter<"TaxCert"> | string
    taxCertJson?: JsonNullableWithAggregatesFilter<"TaxCert">
  }

  export type AddressWhereInput = {
    AND?: AddressWhereInput | AddressWhereInput[]
    OR?: AddressWhereInput[]
    NOT?: AddressWhereInput | AddressWhereInput[]
    id?: IntFilter<"Address"> | number
    latitude?: FloatNullableFilter<"Address"> | number | null
    longitude?: FloatNullableFilter<"Address"> | number | null
    legalDistrictCode?: StringNullableFilter<"Address"> | string | null
    dong?: StringNullableFilter<"Address"> | string | null
    ho?: StringNullableFilter<"Address"> | string | null
    userAddresses?: UserAddressListRelationFilter
  }

  export type AddressOrderByWithRelationInput = {
    id?: SortOrder
    latitude?: SortOrderInput | SortOrder
    longitude?: SortOrderInput | SortOrder
    legalDistrictCode?: SortOrderInput | SortOrder
    dong?: SortOrderInput | SortOrder
    ho?: SortOrderInput | SortOrder
    userAddresses?: UserAddressOrderByRelationAggregateInput
  }

  export type AddressWhereUniqueInput = Prisma.AtLeast<{
    id?: number
    AND?: AddressWhereInput | AddressWhereInput[]
    OR?: AddressWhereInput[]
    NOT?: AddressWhereInput | AddressWhereInput[]
    latitude?: FloatNullableFilter<"Address"> | number | null
    longitude?: FloatNullableFilter<"Address"> | number | null
    legalDistrictCode?: StringNullableFilter<"Address"> | string | null
    dong?: StringNullableFilter<"Address"> | string | null
    ho?: StringNullableFilter<"Address"> | string | null
    userAddresses?: UserAddressListRelationFilter
  }, "id">

  export type AddressOrderByWithAggregationInput = {
    id?: SortOrder
    latitude?: SortOrderInput | SortOrder
    longitude?: SortOrderInput | SortOrder
    legalDistrictCode?: SortOrderInput | SortOrder
    dong?: SortOrderInput | SortOrder
    ho?: SortOrderInput | SortOrder
    _count?: AddressCountOrderByAggregateInput
    _avg?: AddressAvgOrderByAggregateInput
    _max?: AddressMaxOrderByAggregateInput
    _min?: AddressMinOrderByAggregateInput
    _sum?: AddressSumOrderByAggregateInput
  }

  export type AddressScalarWhereWithAggregatesInput = {
    AND?: AddressScalarWhereWithAggregatesInput | AddressScalarWhereWithAggregatesInput[]
    OR?: AddressScalarWhereWithAggregatesInput[]
    NOT?: AddressScalarWhereWithAggregatesInput | AddressScalarWhereWithAggregatesInput[]
    id?: IntWithAggregatesFilter<"Address"> | number
    latitude?: FloatNullableWithAggregatesFilter<"Address"> | number | null
    longitude?: FloatNullableWithAggregatesFilter<"Address"> | number | null
    legalDistrictCode?: StringNullableWithAggregatesFilter<"Address"> | string | null
    dong?: StringNullableWithAggregatesFilter<"Address"> | string | null
    ho?: StringNullableWithAggregatesFilter<"Address"> | string | null
  }

  export type UserAddressWhereInput = {
    AND?: UserAddressWhereInput | UserAddressWhereInput[]
    OR?: UserAddressWhereInput[]
    NOT?: UserAddressWhereInput | UserAddressWhereInput[]
    id?: IntFilter<"UserAddress"> | number
    userId?: UuidFilter<"UserAddress"> | string
    addressId?: IntFilter<"UserAddress"> | number
    isPrimary?: BoolNullableFilter<"UserAddress"> | boolean | null
    createdAt?: DateTimeFilter<"UserAddress"> | Date | string
    nickname?: StringNullableFilter<"UserAddress"> | string | null
    user?: XOR<UserScalarRelationFilter, UserWhereInput>
    address?: XOR<AddressScalarRelationFilter, AddressWhereInput>
    realEstates?: RealEstateListRelationFilter
    stepResults?: StepResultListRelationFilter
  }

  export type UserAddressOrderByWithRelationInput = {
    id?: SortOrder
    userId?: SortOrder
    addressId?: SortOrder
    isPrimary?: SortOrderInput | SortOrder
    createdAt?: SortOrder
    nickname?: SortOrderInput | SortOrder
    user?: UserOrderByWithRelationInput
    address?: AddressOrderByWithRelationInput
    realEstates?: RealEstateOrderByRelationAggregateInput
    stepResults?: StepResultOrderByRelationAggregateInput
  }

  export type UserAddressWhereUniqueInput = Prisma.AtLeast<{
    id?: number
    AND?: UserAddressWhereInput | UserAddressWhereInput[]
    OR?: UserAddressWhereInput[]
    NOT?: UserAddressWhereInput | UserAddressWhereInput[]
    userId?: UuidFilter<"UserAddress"> | string
    addressId?: IntFilter<"UserAddress"> | number
    isPrimary?: BoolNullableFilter<"UserAddress"> | boolean | null
    createdAt?: DateTimeFilter<"UserAddress"> | Date | string
    nickname?: StringNullableFilter<"UserAddress"> | string | null
    user?: XOR<UserScalarRelationFilter, UserWhereInput>
    address?: XOR<AddressScalarRelationFilter, AddressWhereInput>
    realEstates?: RealEstateListRelationFilter
    stepResults?: StepResultListRelationFilter
  }, "id">

  export type UserAddressOrderByWithAggregationInput = {
    id?: SortOrder
    userId?: SortOrder
    addressId?: SortOrder
    isPrimary?: SortOrderInput | SortOrder
    createdAt?: SortOrder
    nickname?: SortOrderInput | SortOrder
    _count?: UserAddressCountOrderByAggregateInput
    _avg?: UserAddressAvgOrderByAggregateInput
    _max?: UserAddressMaxOrderByAggregateInput
    _min?: UserAddressMinOrderByAggregateInput
    _sum?: UserAddressSumOrderByAggregateInput
  }

  export type UserAddressScalarWhereWithAggregatesInput = {
    AND?: UserAddressScalarWhereWithAggregatesInput | UserAddressScalarWhereWithAggregatesInput[]
    OR?: UserAddressScalarWhereWithAggregatesInput[]
    NOT?: UserAddressScalarWhereWithAggregatesInput | UserAddressScalarWhereWithAggregatesInput[]
    id?: IntWithAggregatesFilter<"UserAddress"> | number
    userId?: UuidWithAggregatesFilter<"UserAddress"> | string
    addressId?: IntWithAggregatesFilter<"UserAddress"> | number
    isPrimary?: BoolNullableWithAggregatesFilter<"UserAddress"> | boolean | null
    createdAt?: DateTimeWithAggregatesFilter<"UserAddress"> | Date | string
    nickname?: StringNullableWithAggregatesFilter<"UserAddress"> | string | null
  }

  export type RealEstateWhereInput = {
    AND?: RealEstateWhereInput | RealEstateWhereInput[]
    OR?: RealEstateWhereInput[]
    NOT?: RealEstateWhereInput | RealEstateWhereInput[]
    id?: IntFilter<"RealEstate"> | number
    userAddressId?: IntFilter<"RealEstate"> | number
    realEstateJson?: JsonNullableFilter<"RealEstate">
    userAddress?: XOR<UserAddressScalarRelationFilter, UserAddressWhereInput>
  }

  export type RealEstateOrderByWithRelationInput = {
    id?: SortOrder
    userAddressId?: SortOrder
    realEstateJson?: SortOrderInput | SortOrder
    userAddress?: UserAddressOrderByWithRelationInput
  }

  export type RealEstateWhereUniqueInput = Prisma.AtLeast<{
    id?: number
    AND?: RealEstateWhereInput | RealEstateWhereInput[]
    OR?: RealEstateWhereInput[]
    NOT?: RealEstateWhereInput | RealEstateWhereInput[]
    userAddressId?: IntFilter<"RealEstate"> | number
    realEstateJson?: JsonNullableFilter<"RealEstate">
    userAddress?: XOR<UserAddressScalarRelationFilter, UserAddressWhereInput>
  }, "id">

  export type RealEstateOrderByWithAggregationInput = {
    id?: SortOrder
    userAddressId?: SortOrder
    realEstateJson?: SortOrderInput | SortOrder
    _count?: RealEstateCountOrderByAggregateInput
    _avg?: RealEstateAvgOrderByAggregateInput
    _max?: RealEstateMaxOrderByAggregateInput
    _min?: RealEstateMinOrderByAggregateInput
    _sum?: RealEstateSumOrderByAggregateInput
  }

  export type RealEstateScalarWhereWithAggregatesInput = {
    AND?: RealEstateScalarWhereWithAggregatesInput | RealEstateScalarWhereWithAggregatesInput[]
    OR?: RealEstateScalarWhereWithAggregatesInput[]
    NOT?: RealEstateScalarWhereWithAggregatesInput | RealEstateScalarWhereWithAggregatesInput[]
    id?: IntWithAggregatesFilter<"RealEstate"> | number
    userAddressId?: IntWithAggregatesFilter<"RealEstate"> | number
    realEstateJson?: JsonNullableWithAggregatesFilter<"RealEstate">
  }

  export type StepWhereInput = {
    AND?: StepWhereInput | StepWhereInput[]
    OR?: StepWhereInput[]
    NOT?: StepWhereInput | StepWhereInput[]
    id?: IntFilter<"Step"> | number
    mainNum?: IntFilter<"Step"> | number
    subNum?: IntFilter<"Step"> | number
    stepResults?: StepResultListRelationFilter
  }

  export type StepOrderByWithRelationInput = {
    id?: SortOrder
    mainNum?: SortOrder
    subNum?: SortOrder
    stepResults?: StepResultOrderByRelationAggregateInput
  }

  export type StepWhereUniqueInput = Prisma.AtLeast<{
    id?: number
    AND?: StepWhereInput | StepWhereInput[]
    OR?: StepWhereInput[]
    NOT?: StepWhereInput | StepWhereInput[]
    mainNum?: IntFilter<"Step"> | number
    subNum?: IntFilter<"Step"> | number
    stepResults?: StepResultListRelationFilter
  }, "id">

  export type StepOrderByWithAggregationInput = {
    id?: SortOrder
    mainNum?: SortOrder
    subNum?: SortOrder
    _count?: StepCountOrderByAggregateInput
    _avg?: StepAvgOrderByAggregateInput
    _max?: StepMaxOrderByAggregateInput
    _min?: StepMinOrderByAggregateInput
    _sum?: StepSumOrderByAggregateInput
  }

  export type StepScalarWhereWithAggregatesInput = {
    AND?: StepScalarWhereWithAggregatesInput | StepScalarWhereWithAggregatesInput[]
    OR?: StepScalarWhereWithAggregatesInput[]
    NOT?: StepScalarWhereWithAggregatesInput | StepScalarWhereWithAggregatesInput[]
    id?: IntWithAggregatesFilter<"Step"> | number
    mainNum?: IntWithAggregatesFilter<"Step"> | number
    subNum?: IntWithAggregatesFilter<"Step"> | number
  }

  export type StepResultWhereInput = {
    AND?: StepResultWhereInput | StepResultWhereInput[]
    OR?: StepResultWhereInput[]
    NOT?: StepResultWhereInput | StepResultWhereInput[]
    id?: IntFilter<"StepResult"> | number
    userAddressId?: IntFilter<"StepResult"> | number
    stepId?: IntFilter<"StepResult"> | number
    mismatch?: IntNullableFilter<"StepResult"> | number | null
    match?: IntNullableFilter<"StepResult"> | number | null
    unchecked?: IntNullableFilter<"StepResult"> | number | null
    createdAt?: DateTimeFilter<"StepResult"> | Date | string
    userAddress?: XOR<UserAddressScalarRelationFilter, UserAddressWhereInput>
    step?: XOR<StepScalarRelationFilter, StepWhereInput>
  }

  export type StepResultOrderByWithRelationInput = {
    id?: SortOrder
    userAddressId?: SortOrder
    stepId?: SortOrder
    mismatch?: SortOrderInput | SortOrder
    match?: SortOrderInput | SortOrder
    unchecked?: SortOrderInput | SortOrder
    createdAt?: SortOrder
    userAddress?: UserAddressOrderByWithRelationInput
    step?: StepOrderByWithRelationInput
  }

  export type StepResultWhereUniqueInput = Prisma.AtLeast<{
    id?: number
    AND?: StepResultWhereInput | StepResultWhereInput[]
    OR?: StepResultWhereInput[]
    NOT?: StepResultWhereInput | StepResultWhereInput[]
    userAddressId?: IntFilter<"StepResult"> | number
    stepId?: IntFilter<"StepResult"> | number
    mismatch?: IntNullableFilter<"StepResult"> | number | null
    match?: IntNullableFilter<"StepResult"> | number | null
    unchecked?: IntNullableFilter<"StepResult"> | number | null
    createdAt?: DateTimeFilter<"StepResult"> | Date | string
    userAddress?: XOR<UserAddressScalarRelationFilter, UserAddressWhereInput>
    step?: XOR<StepScalarRelationFilter, StepWhereInput>
  }, "id">

  export type StepResultOrderByWithAggregationInput = {
    id?: SortOrder
    userAddressId?: SortOrder
    stepId?: SortOrder
    mismatch?: SortOrderInput | SortOrder
    match?: SortOrderInput | SortOrder
    unchecked?: SortOrderInput | SortOrder
    createdAt?: SortOrder
    _count?: StepResultCountOrderByAggregateInput
    _avg?: StepResultAvgOrderByAggregateInput
    _max?: StepResultMaxOrderByAggregateInput
    _min?: StepResultMinOrderByAggregateInput
    _sum?: StepResultSumOrderByAggregateInput
  }

  export type StepResultScalarWhereWithAggregatesInput = {
    AND?: StepResultScalarWhereWithAggregatesInput | StepResultScalarWhereWithAggregatesInput[]
    OR?: StepResultScalarWhereWithAggregatesInput[]
    NOT?: StepResultScalarWhereWithAggregatesInput | StepResultScalarWhereWithAggregatesInput[]
    id?: IntWithAggregatesFilter<"StepResult"> | number
    userAddressId?: IntWithAggregatesFilter<"StepResult"> | number
    stepId?: IntWithAggregatesFilter<"StepResult"> | number
    mismatch?: IntNullableWithAggregatesFilter<"StepResult"> | number | null
    match?: IntNullableWithAggregatesFilter<"StepResult"> | number | null
    unchecked?: IntNullableWithAggregatesFilter<"StepResult"> | number | null
    createdAt?: DateTimeWithAggregatesFilter<"StepResult"> | Date | string
  }

  export type UserCreateInput = {
    id?: string
    name?: string | null
    nickname?: string | null
    username?: string | null
    password?: string | null
    pinNumber?: string | null
    phoneNumber?: string | null
    taxCerts?: TaxCertCreateNestedManyWithoutUserInput
    userAddresses?: UserAddressCreateNestedManyWithoutUserInput
  }

  export type UserUncheckedCreateInput = {
    id?: string
    name?: string | null
    nickname?: string | null
    username?: string | null
    password?: string | null
    pinNumber?: string | null
    phoneNumber?: string | null
    taxCerts?: TaxCertUncheckedCreateNestedManyWithoutUserInput
    userAddresses?: UserAddressUncheckedCreateNestedManyWithoutUserInput
  }

  export type UserUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: NullableStringFieldUpdateOperationsInput | string | null
    nickname?: NullableStringFieldUpdateOperationsInput | string | null
    username?: NullableStringFieldUpdateOperationsInput | string | null
    password?: NullableStringFieldUpdateOperationsInput | string | null
    pinNumber?: NullableStringFieldUpdateOperationsInput | string | null
    phoneNumber?: NullableStringFieldUpdateOperationsInput | string | null
    taxCerts?: TaxCertUpdateManyWithoutUserNestedInput
    userAddresses?: UserAddressUpdateManyWithoutUserNestedInput
  }

  export type UserUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: NullableStringFieldUpdateOperationsInput | string | null
    nickname?: NullableStringFieldUpdateOperationsInput | string | null
    username?: NullableStringFieldUpdateOperationsInput | string | null
    password?: NullableStringFieldUpdateOperationsInput | string | null
    pinNumber?: NullableStringFieldUpdateOperationsInput | string | null
    phoneNumber?: NullableStringFieldUpdateOperationsInput | string | null
    taxCerts?: TaxCertUncheckedUpdateManyWithoutUserNestedInput
    userAddresses?: UserAddressUncheckedUpdateManyWithoutUserNestedInput
  }

  export type UserCreateManyInput = {
    id?: string
    name?: string | null
    nickname?: string | null
    username?: string | null
    password?: string | null
    pinNumber?: string | null
    phoneNumber?: string | null
  }

  export type UserUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: NullableStringFieldUpdateOperationsInput | string | null
    nickname?: NullableStringFieldUpdateOperationsInput | string | null
    username?: NullableStringFieldUpdateOperationsInput | string | null
    password?: NullableStringFieldUpdateOperationsInput | string | null
    pinNumber?: NullableStringFieldUpdateOperationsInput | string | null
    phoneNumber?: NullableStringFieldUpdateOperationsInput | string | null
  }

  export type UserUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: NullableStringFieldUpdateOperationsInput | string | null
    nickname?: NullableStringFieldUpdateOperationsInput | string | null
    username?: NullableStringFieldUpdateOperationsInput | string | null
    password?: NullableStringFieldUpdateOperationsInput | string | null
    pinNumber?: NullableStringFieldUpdateOperationsInput | string | null
    phoneNumber?: NullableStringFieldUpdateOperationsInput | string | null
  }

  export type TaxCertCreateInput = {
    taxCertJson?: NullableJsonNullValueInput | InputJsonValue
    user: UserCreateNestedOneWithoutTaxCertsInput
  }

  export type TaxCertUncheckedCreateInput = {
    id?: number
    userId: string
    taxCertJson?: NullableJsonNullValueInput | InputJsonValue
  }

  export type TaxCertUpdateInput = {
    taxCertJson?: NullableJsonNullValueInput | InputJsonValue
    user?: UserUpdateOneRequiredWithoutTaxCertsNestedInput
  }

  export type TaxCertUncheckedUpdateInput = {
    id?: IntFieldUpdateOperationsInput | number
    userId?: StringFieldUpdateOperationsInput | string
    taxCertJson?: NullableJsonNullValueInput | InputJsonValue
  }

  export type TaxCertCreateManyInput = {
    id?: number
    userId: string
    taxCertJson?: NullableJsonNullValueInput | InputJsonValue
  }

  export type TaxCertUpdateManyMutationInput = {
    taxCertJson?: NullableJsonNullValueInput | InputJsonValue
  }

  export type TaxCertUncheckedUpdateManyInput = {
    id?: IntFieldUpdateOperationsInput | number
    userId?: StringFieldUpdateOperationsInput | string
    taxCertJson?: NullableJsonNullValueInput | InputJsonValue
  }

  export type AddressCreateInput = {
    latitude?: number | null
    longitude?: number | null
    legalDistrictCode?: string | null
    dong?: string | null
    ho?: string | null
    userAddresses?: UserAddressCreateNestedManyWithoutAddressInput
  }

  export type AddressUncheckedCreateInput = {
    id?: number
    latitude?: number | null
    longitude?: number | null
    legalDistrictCode?: string | null
    dong?: string | null
    ho?: string | null
    userAddresses?: UserAddressUncheckedCreateNestedManyWithoutAddressInput
  }

  export type AddressUpdateInput = {
    latitude?: NullableFloatFieldUpdateOperationsInput | number | null
    longitude?: NullableFloatFieldUpdateOperationsInput | number | null
    legalDistrictCode?: NullableStringFieldUpdateOperationsInput | string | null
    dong?: NullableStringFieldUpdateOperationsInput | string | null
    ho?: NullableStringFieldUpdateOperationsInput | string | null
    userAddresses?: UserAddressUpdateManyWithoutAddressNestedInput
  }

  export type AddressUncheckedUpdateInput = {
    id?: IntFieldUpdateOperationsInput | number
    latitude?: NullableFloatFieldUpdateOperationsInput | number | null
    longitude?: NullableFloatFieldUpdateOperationsInput | number | null
    legalDistrictCode?: NullableStringFieldUpdateOperationsInput | string | null
    dong?: NullableStringFieldUpdateOperationsInput | string | null
    ho?: NullableStringFieldUpdateOperationsInput | string | null
    userAddresses?: UserAddressUncheckedUpdateManyWithoutAddressNestedInput
  }

  export type AddressCreateManyInput = {
    id?: number
    latitude?: number | null
    longitude?: number | null
    legalDistrictCode?: string | null
    dong?: string | null
    ho?: string | null
  }

  export type AddressUpdateManyMutationInput = {
    latitude?: NullableFloatFieldUpdateOperationsInput | number | null
    longitude?: NullableFloatFieldUpdateOperationsInput | number | null
    legalDistrictCode?: NullableStringFieldUpdateOperationsInput | string | null
    dong?: NullableStringFieldUpdateOperationsInput | string | null
    ho?: NullableStringFieldUpdateOperationsInput | string | null
  }

  export type AddressUncheckedUpdateManyInput = {
    id?: IntFieldUpdateOperationsInput | number
    latitude?: NullableFloatFieldUpdateOperationsInput | number | null
    longitude?: NullableFloatFieldUpdateOperationsInput | number | null
    legalDistrictCode?: NullableStringFieldUpdateOperationsInput | string | null
    dong?: NullableStringFieldUpdateOperationsInput | string | null
    ho?: NullableStringFieldUpdateOperationsInput | string | null
  }

  export type UserAddressCreateInput = {
    isPrimary?: boolean | null
    createdAt?: Date | string
    nickname?: string | null
    user: UserCreateNestedOneWithoutUserAddressesInput
    address: AddressCreateNestedOneWithoutUserAddressesInput
    realEstates?: RealEstateCreateNestedManyWithoutUserAddressInput
    stepResults?: StepResultCreateNestedManyWithoutUserAddressInput
  }

  export type UserAddressUncheckedCreateInput = {
    id?: number
    userId: string
    addressId: number
    isPrimary?: boolean | null
    createdAt?: Date | string
    nickname?: string | null
    realEstates?: RealEstateUncheckedCreateNestedManyWithoutUserAddressInput
    stepResults?: StepResultUncheckedCreateNestedManyWithoutUserAddressInput
  }

  export type UserAddressUpdateInput = {
    isPrimary?: NullableBoolFieldUpdateOperationsInput | boolean | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    nickname?: NullableStringFieldUpdateOperationsInput | string | null
    user?: UserUpdateOneRequiredWithoutUserAddressesNestedInput
    address?: AddressUpdateOneRequiredWithoutUserAddressesNestedInput
    realEstates?: RealEstateUpdateManyWithoutUserAddressNestedInput
    stepResults?: StepResultUpdateManyWithoutUserAddressNestedInput
  }

  export type UserAddressUncheckedUpdateInput = {
    id?: IntFieldUpdateOperationsInput | number
    userId?: StringFieldUpdateOperationsInput | string
    addressId?: IntFieldUpdateOperationsInput | number
    isPrimary?: NullableBoolFieldUpdateOperationsInput | boolean | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    nickname?: NullableStringFieldUpdateOperationsInput | string | null
    realEstates?: RealEstateUncheckedUpdateManyWithoutUserAddressNestedInput
    stepResults?: StepResultUncheckedUpdateManyWithoutUserAddressNestedInput
  }

  export type UserAddressCreateManyInput = {
    id?: number
    userId: string
    addressId: number
    isPrimary?: boolean | null
    createdAt?: Date | string
    nickname?: string | null
  }

  export type UserAddressUpdateManyMutationInput = {
    isPrimary?: NullableBoolFieldUpdateOperationsInput | boolean | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    nickname?: NullableStringFieldUpdateOperationsInput | string | null
  }

  export type UserAddressUncheckedUpdateManyInput = {
    id?: IntFieldUpdateOperationsInput | number
    userId?: StringFieldUpdateOperationsInput | string
    addressId?: IntFieldUpdateOperationsInput | number
    isPrimary?: NullableBoolFieldUpdateOperationsInput | boolean | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    nickname?: NullableStringFieldUpdateOperationsInput | string | null
  }

  export type RealEstateCreateInput = {
    realEstateJson?: NullableJsonNullValueInput | InputJsonValue
    userAddress: UserAddressCreateNestedOneWithoutRealEstatesInput
  }

  export type RealEstateUncheckedCreateInput = {
    id?: number
    userAddressId: number
    realEstateJson?: NullableJsonNullValueInput | InputJsonValue
  }

  export type RealEstateUpdateInput = {
    realEstateJson?: NullableJsonNullValueInput | InputJsonValue
    userAddress?: UserAddressUpdateOneRequiredWithoutRealEstatesNestedInput
  }

  export type RealEstateUncheckedUpdateInput = {
    id?: IntFieldUpdateOperationsInput | number
    userAddressId?: IntFieldUpdateOperationsInput | number
    realEstateJson?: NullableJsonNullValueInput | InputJsonValue
  }

  export type RealEstateCreateManyInput = {
    id?: number
    userAddressId: number
    realEstateJson?: NullableJsonNullValueInput | InputJsonValue
  }

  export type RealEstateUpdateManyMutationInput = {
    realEstateJson?: NullableJsonNullValueInput | InputJsonValue
  }

  export type RealEstateUncheckedUpdateManyInput = {
    id?: IntFieldUpdateOperationsInput | number
    userAddressId?: IntFieldUpdateOperationsInput | number
    realEstateJson?: NullableJsonNullValueInput | InputJsonValue
  }

  export type StepCreateInput = {
    mainNum: number
    subNum: number
    stepResults?: StepResultCreateNestedManyWithoutStepInput
  }

  export type StepUncheckedCreateInput = {
    id?: number
    mainNum: number
    subNum: number
    stepResults?: StepResultUncheckedCreateNestedManyWithoutStepInput
  }

  export type StepUpdateInput = {
    mainNum?: IntFieldUpdateOperationsInput | number
    subNum?: IntFieldUpdateOperationsInput | number
    stepResults?: StepResultUpdateManyWithoutStepNestedInput
  }

  export type StepUncheckedUpdateInput = {
    id?: IntFieldUpdateOperationsInput | number
    mainNum?: IntFieldUpdateOperationsInput | number
    subNum?: IntFieldUpdateOperationsInput | number
    stepResults?: StepResultUncheckedUpdateManyWithoutStepNestedInput
  }

  export type StepCreateManyInput = {
    id?: number
    mainNum: number
    subNum: number
  }

  export type StepUpdateManyMutationInput = {
    mainNum?: IntFieldUpdateOperationsInput | number
    subNum?: IntFieldUpdateOperationsInput | number
  }

  export type StepUncheckedUpdateManyInput = {
    id?: IntFieldUpdateOperationsInput | number
    mainNum?: IntFieldUpdateOperationsInput | number
    subNum?: IntFieldUpdateOperationsInput | number
  }

  export type StepResultCreateInput = {
    mismatch?: number | null
    match?: number | null
    unchecked?: number | null
    createdAt?: Date | string
    userAddress: UserAddressCreateNestedOneWithoutStepResultsInput
    step: StepCreateNestedOneWithoutStepResultsInput
  }

  export type StepResultUncheckedCreateInput = {
    id?: number
    userAddressId: number
    stepId: number
    mismatch?: number | null
    match?: number | null
    unchecked?: number | null
    createdAt?: Date | string
  }

  export type StepResultUpdateInput = {
    mismatch?: NullableIntFieldUpdateOperationsInput | number | null
    match?: NullableIntFieldUpdateOperationsInput | number | null
    unchecked?: NullableIntFieldUpdateOperationsInput | number | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    userAddress?: UserAddressUpdateOneRequiredWithoutStepResultsNestedInput
    step?: StepUpdateOneRequiredWithoutStepResultsNestedInput
  }

  export type StepResultUncheckedUpdateInput = {
    id?: IntFieldUpdateOperationsInput | number
    userAddressId?: IntFieldUpdateOperationsInput | number
    stepId?: IntFieldUpdateOperationsInput | number
    mismatch?: NullableIntFieldUpdateOperationsInput | number | null
    match?: NullableIntFieldUpdateOperationsInput | number | null
    unchecked?: NullableIntFieldUpdateOperationsInput | number | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type StepResultCreateManyInput = {
    id?: number
    userAddressId: number
    stepId: number
    mismatch?: number | null
    match?: number | null
    unchecked?: number | null
    createdAt?: Date | string
  }

  export type StepResultUpdateManyMutationInput = {
    mismatch?: NullableIntFieldUpdateOperationsInput | number | null
    match?: NullableIntFieldUpdateOperationsInput | number | null
    unchecked?: NullableIntFieldUpdateOperationsInput | number | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type StepResultUncheckedUpdateManyInput = {
    id?: IntFieldUpdateOperationsInput | number
    userAddressId?: IntFieldUpdateOperationsInput | number
    stepId?: IntFieldUpdateOperationsInput | number
    mismatch?: NullableIntFieldUpdateOperationsInput | number | null
    match?: NullableIntFieldUpdateOperationsInput | number | null
    unchecked?: NullableIntFieldUpdateOperationsInput | number | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type UuidFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel>
    in?: string[] | ListStringFieldRefInput<$PrismaModel>
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel>
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    mode?: QueryMode
    not?: NestedUuidFilter<$PrismaModel> | string
  }

  export type StringNullableFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel> | null
    in?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    mode?: QueryMode
    not?: NestedStringNullableFilter<$PrismaModel> | string | null
  }

  export type TaxCertListRelationFilter = {
    every?: TaxCertWhereInput
    some?: TaxCertWhereInput
    none?: TaxCertWhereInput
  }

  export type UserAddressListRelationFilter = {
    every?: UserAddressWhereInput
    some?: UserAddressWhereInput
    none?: UserAddressWhereInput
  }

  export type SortOrderInput = {
    sort: SortOrder
    nulls?: NullsOrder
  }

  export type TaxCertOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type UserAddressOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type UserCountOrderByAggregateInput = {
    id?: SortOrder
    name?: SortOrder
    nickname?: SortOrder
    username?: SortOrder
    password?: SortOrder
    pinNumber?: SortOrder
    phoneNumber?: SortOrder
  }

  export type UserMaxOrderByAggregateInput = {
    id?: SortOrder
    name?: SortOrder
    nickname?: SortOrder
    username?: SortOrder
    password?: SortOrder
    pinNumber?: SortOrder
    phoneNumber?: SortOrder
  }

  export type UserMinOrderByAggregateInput = {
    id?: SortOrder
    name?: SortOrder
    nickname?: SortOrder
    username?: SortOrder
    password?: SortOrder
    pinNumber?: SortOrder
    phoneNumber?: SortOrder
  }

  export type UuidWithAggregatesFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel>
    in?: string[] | ListStringFieldRefInput<$PrismaModel>
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel>
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    mode?: QueryMode
    not?: NestedUuidWithAggregatesFilter<$PrismaModel> | string
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedStringFilter<$PrismaModel>
    _max?: NestedStringFilter<$PrismaModel>
  }

  export type StringNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel> | null
    in?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    mode?: QueryMode
    not?: NestedStringNullableWithAggregatesFilter<$PrismaModel> | string | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedStringNullableFilter<$PrismaModel>
    _max?: NestedStringNullableFilter<$PrismaModel>
  }

  export type IntFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel>
    in?: number[] | ListIntFieldRefInput<$PrismaModel>
    notIn?: number[] | ListIntFieldRefInput<$PrismaModel>
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntFilter<$PrismaModel> | number
  }
  export type JsonNullableFilter<$PrismaModel = never> =
    | PatchUndefined<
        Either<Required<JsonNullableFilterBase<$PrismaModel>>, Exclude<keyof Required<JsonNullableFilterBase<$PrismaModel>>, 'path'>>,
        Required<JsonNullableFilterBase<$PrismaModel>>
      >
    | OptionalFlat<Omit<Required<JsonNullableFilterBase<$PrismaModel>>, 'path'>>

  export type JsonNullableFilterBase<$PrismaModel = never> = {
    equals?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | JsonNullValueFilter
    path?: string[]
    mode?: QueryMode | EnumQueryModeFieldRefInput<$PrismaModel>
    string_contains?: string | StringFieldRefInput<$PrismaModel>
    string_starts_with?: string | StringFieldRefInput<$PrismaModel>
    string_ends_with?: string | StringFieldRefInput<$PrismaModel>
    array_starts_with?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    array_ends_with?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    array_contains?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    lt?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    lte?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    gt?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    gte?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    not?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | JsonNullValueFilter
  }

  export type UserScalarRelationFilter = {
    is?: UserWhereInput
    isNot?: UserWhereInput
  }

  export type TaxCertCountOrderByAggregateInput = {
    id?: SortOrder
    userId?: SortOrder
    taxCertJson?: SortOrder
  }

  export type TaxCertAvgOrderByAggregateInput = {
    id?: SortOrder
  }

  export type TaxCertMaxOrderByAggregateInput = {
    id?: SortOrder
    userId?: SortOrder
  }

  export type TaxCertMinOrderByAggregateInput = {
    id?: SortOrder
    userId?: SortOrder
  }

  export type TaxCertSumOrderByAggregateInput = {
    id?: SortOrder
  }

  export type IntWithAggregatesFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel>
    in?: number[] | ListIntFieldRefInput<$PrismaModel>
    notIn?: number[] | ListIntFieldRefInput<$PrismaModel>
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntWithAggregatesFilter<$PrismaModel> | number
    _count?: NestedIntFilter<$PrismaModel>
    _avg?: NestedFloatFilter<$PrismaModel>
    _sum?: NestedIntFilter<$PrismaModel>
    _min?: NestedIntFilter<$PrismaModel>
    _max?: NestedIntFilter<$PrismaModel>
  }
  export type JsonNullableWithAggregatesFilter<$PrismaModel = never> =
    | PatchUndefined<
        Either<Required<JsonNullableWithAggregatesFilterBase<$PrismaModel>>, Exclude<keyof Required<JsonNullableWithAggregatesFilterBase<$PrismaModel>>, 'path'>>,
        Required<JsonNullableWithAggregatesFilterBase<$PrismaModel>>
      >
    | OptionalFlat<Omit<Required<JsonNullableWithAggregatesFilterBase<$PrismaModel>>, 'path'>>

  export type JsonNullableWithAggregatesFilterBase<$PrismaModel = never> = {
    equals?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | JsonNullValueFilter
    path?: string[]
    mode?: QueryMode | EnumQueryModeFieldRefInput<$PrismaModel>
    string_contains?: string | StringFieldRefInput<$PrismaModel>
    string_starts_with?: string | StringFieldRefInput<$PrismaModel>
    string_ends_with?: string | StringFieldRefInput<$PrismaModel>
    array_starts_with?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    array_ends_with?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    array_contains?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    lt?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    lte?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    gt?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    gte?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    not?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | JsonNullValueFilter
    _count?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedJsonNullableFilter<$PrismaModel>
    _max?: NestedJsonNullableFilter<$PrismaModel>
  }

  export type FloatNullableFilter<$PrismaModel = never> = {
    equals?: number | FloatFieldRefInput<$PrismaModel> | null
    in?: number[] | ListFloatFieldRefInput<$PrismaModel> | null
    notIn?: number[] | ListFloatFieldRefInput<$PrismaModel> | null
    lt?: number | FloatFieldRefInput<$PrismaModel>
    lte?: number | FloatFieldRefInput<$PrismaModel>
    gt?: number | FloatFieldRefInput<$PrismaModel>
    gte?: number | FloatFieldRefInput<$PrismaModel>
    not?: NestedFloatNullableFilter<$PrismaModel> | number | null
  }

  export type AddressCountOrderByAggregateInput = {
    id?: SortOrder
    latitude?: SortOrder
    longitude?: SortOrder
    legalDistrictCode?: SortOrder
    dong?: SortOrder
    ho?: SortOrder
  }

  export type AddressAvgOrderByAggregateInput = {
    id?: SortOrder
    latitude?: SortOrder
    longitude?: SortOrder
  }

  export type AddressMaxOrderByAggregateInput = {
    id?: SortOrder
    latitude?: SortOrder
    longitude?: SortOrder
    legalDistrictCode?: SortOrder
    dong?: SortOrder
    ho?: SortOrder
  }

  export type AddressMinOrderByAggregateInput = {
    id?: SortOrder
    latitude?: SortOrder
    longitude?: SortOrder
    legalDistrictCode?: SortOrder
    dong?: SortOrder
    ho?: SortOrder
  }

  export type AddressSumOrderByAggregateInput = {
    id?: SortOrder
    latitude?: SortOrder
    longitude?: SortOrder
  }

  export type FloatNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: number | FloatFieldRefInput<$PrismaModel> | null
    in?: number[] | ListFloatFieldRefInput<$PrismaModel> | null
    notIn?: number[] | ListFloatFieldRefInput<$PrismaModel> | null
    lt?: number | FloatFieldRefInput<$PrismaModel>
    lte?: number | FloatFieldRefInput<$PrismaModel>
    gt?: number | FloatFieldRefInput<$PrismaModel>
    gte?: number | FloatFieldRefInput<$PrismaModel>
    not?: NestedFloatNullableWithAggregatesFilter<$PrismaModel> | number | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _avg?: NestedFloatNullableFilter<$PrismaModel>
    _sum?: NestedFloatNullableFilter<$PrismaModel>
    _min?: NestedFloatNullableFilter<$PrismaModel>
    _max?: NestedFloatNullableFilter<$PrismaModel>
  }

  export type BoolNullableFilter<$PrismaModel = never> = {
    equals?: boolean | BooleanFieldRefInput<$PrismaModel> | null
    not?: NestedBoolNullableFilter<$PrismaModel> | boolean | null
  }

  export type DateTimeFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeFilter<$PrismaModel> | Date | string
  }

  export type AddressScalarRelationFilter = {
    is?: AddressWhereInput
    isNot?: AddressWhereInput
  }

  export type RealEstateListRelationFilter = {
    every?: RealEstateWhereInput
    some?: RealEstateWhereInput
    none?: RealEstateWhereInput
  }

  export type StepResultListRelationFilter = {
    every?: StepResultWhereInput
    some?: StepResultWhereInput
    none?: StepResultWhereInput
  }

  export type RealEstateOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type StepResultOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type UserAddressCountOrderByAggregateInput = {
    id?: SortOrder
    userId?: SortOrder
    addressId?: SortOrder
    isPrimary?: SortOrder
    createdAt?: SortOrder
    nickname?: SortOrder
  }

  export type UserAddressAvgOrderByAggregateInput = {
    id?: SortOrder
    addressId?: SortOrder
  }

  export type UserAddressMaxOrderByAggregateInput = {
    id?: SortOrder
    userId?: SortOrder
    addressId?: SortOrder
    isPrimary?: SortOrder
    createdAt?: SortOrder
    nickname?: SortOrder
  }

  export type UserAddressMinOrderByAggregateInput = {
    id?: SortOrder
    userId?: SortOrder
    addressId?: SortOrder
    isPrimary?: SortOrder
    createdAt?: SortOrder
    nickname?: SortOrder
  }

  export type UserAddressSumOrderByAggregateInput = {
    id?: SortOrder
    addressId?: SortOrder
  }

  export type BoolNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: boolean | BooleanFieldRefInput<$PrismaModel> | null
    not?: NestedBoolNullableWithAggregatesFilter<$PrismaModel> | boolean | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedBoolNullableFilter<$PrismaModel>
    _max?: NestedBoolNullableFilter<$PrismaModel>
  }

  export type DateTimeWithAggregatesFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeWithAggregatesFilter<$PrismaModel> | Date | string
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedDateTimeFilter<$PrismaModel>
    _max?: NestedDateTimeFilter<$PrismaModel>
  }

  export type UserAddressScalarRelationFilter = {
    is?: UserAddressWhereInput
    isNot?: UserAddressWhereInput
  }

  export type RealEstateCountOrderByAggregateInput = {
    id?: SortOrder
    userAddressId?: SortOrder
    realEstateJson?: SortOrder
  }

  export type RealEstateAvgOrderByAggregateInput = {
    id?: SortOrder
    userAddressId?: SortOrder
  }

  export type RealEstateMaxOrderByAggregateInput = {
    id?: SortOrder
    userAddressId?: SortOrder
  }

  export type RealEstateMinOrderByAggregateInput = {
    id?: SortOrder
    userAddressId?: SortOrder
  }

  export type RealEstateSumOrderByAggregateInput = {
    id?: SortOrder
    userAddressId?: SortOrder
  }

  export type StepCountOrderByAggregateInput = {
    id?: SortOrder
    mainNum?: SortOrder
    subNum?: SortOrder
  }

  export type StepAvgOrderByAggregateInput = {
    id?: SortOrder
    mainNum?: SortOrder
    subNum?: SortOrder
  }

  export type StepMaxOrderByAggregateInput = {
    id?: SortOrder
    mainNum?: SortOrder
    subNum?: SortOrder
  }

  export type StepMinOrderByAggregateInput = {
    id?: SortOrder
    mainNum?: SortOrder
    subNum?: SortOrder
  }

  export type StepSumOrderByAggregateInput = {
    id?: SortOrder
    mainNum?: SortOrder
    subNum?: SortOrder
  }

  export type IntNullableFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel> | null
    in?: number[] | ListIntFieldRefInput<$PrismaModel> | null
    notIn?: number[] | ListIntFieldRefInput<$PrismaModel> | null
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntNullableFilter<$PrismaModel> | number | null
  }

  export type StepScalarRelationFilter = {
    is?: StepWhereInput
    isNot?: StepWhereInput
  }

  export type StepResultCountOrderByAggregateInput = {
    id?: SortOrder
    userAddressId?: SortOrder
    stepId?: SortOrder
    mismatch?: SortOrder
    match?: SortOrder
    unchecked?: SortOrder
    createdAt?: SortOrder
  }

  export type StepResultAvgOrderByAggregateInput = {
    id?: SortOrder
    userAddressId?: SortOrder
    stepId?: SortOrder
    mismatch?: SortOrder
    match?: SortOrder
    unchecked?: SortOrder
  }

  export type StepResultMaxOrderByAggregateInput = {
    id?: SortOrder
    userAddressId?: SortOrder
    stepId?: SortOrder
    mismatch?: SortOrder
    match?: SortOrder
    unchecked?: SortOrder
    createdAt?: SortOrder
  }

  export type StepResultMinOrderByAggregateInput = {
    id?: SortOrder
    userAddressId?: SortOrder
    stepId?: SortOrder
    mismatch?: SortOrder
    match?: SortOrder
    unchecked?: SortOrder
    createdAt?: SortOrder
  }

  export type StepResultSumOrderByAggregateInput = {
    id?: SortOrder
    userAddressId?: SortOrder
    stepId?: SortOrder
    mismatch?: SortOrder
    match?: SortOrder
    unchecked?: SortOrder
  }

  export type IntNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel> | null
    in?: number[] | ListIntFieldRefInput<$PrismaModel> | null
    notIn?: number[] | ListIntFieldRefInput<$PrismaModel> | null
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntNullableWithAggregatesFilter<$PrismaModel> | number | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _avg?: NestedFloatNullableFilter<$PrismaModel>
    _sum?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedIntNullableFilter<$PrismaModel>
    _max?: NestedIntNullableFilter<$PrismaModel>
  }

  export type TaxCertCreateNestedManyWithoutUserInput = {
    create?: XOR<TaxCertCreateWithoutUserInput, TaxCertUncheckedCreateWithoutUserInput> | TaxCertCreateWithoutUserInput[] | TaxCertUncheckedCreateWithoutUserInput[]
    connectOrCreate?: TaxCertCreateOrConnectWithoutUserInput | TaxCertCreateOrConnectWithoutUserInput[]
    createMany?: TaxCertCreateManyUserInputEnvelope
    connect?: TaxCertWhereUniqueInput | TaxCertWhereUniqueInput[]
  }

  export type UserAddressCreateNestedManyWithoutUserInput = {
    create?: XOR<UserAddressCreateWithoutUserInput, UserAddressUncheckedCreateWithoutUserInput> | UserAddressCreateWithoutUserInput[] | UserAddressUncheckedCreateWithoutUserInput[]
    connectOrCreate?: UserAddressCreateOrConnectWithoutUserInput | UserAddressCreateOrConnectWithoutUserInput[]
    createMany?: UserAddressCreateManyUserInputEnvelope
    connect?: UserAddressWhereUniqueInput | UserAddressWhereUniqueInput[]
  }

  export type TaxCertUncheckedCreateNestedManyWithoutUserInput = {
    create?: XOR<TaxCertCreateWithoutUserInput, TaxCertUncheckedCreateWithoutUserInput> | TaxCertCreateWithoutUserInput[] | TaxCertUncheckedCreateWithoutUserInput[]
    connectOrCreate?: TaxCertCreateOrConnectWithoutUserInput | TaxCertCreateOrConnectWithoutUserInput[]
    createMany?: TaxCertCreateManyUserInputEnvelope
    connect?: TaxCertWhereUniqueInput | TaxCertWhereUniqueInput[]
  }

  export type UserAddressUncheckedCreateNestedManyWithoutUserInput = {
    create?: XOR<UserAddressCreateWithoutUserInput, UserAddressUncheckedCreateWithoutUserInput> | UserAddressCreateWithoutUserInput[] | UserAddressUncheckedCreateWithoutUserInput[]
    connectOrCreate?: UserAddressCreateOrConnectWithoutUserInput | UserAddressCreateOrConnectWithoutUserInput[]
    createMany?: UserAddressCreateManyUserInputEnvelope
    connect?: UserAddressWhereUniqueInput | UserAddressWhereUniqueInput[]
  }

  export type StringFieldUpdateOperationsInput = {
    set?: string
  }

  export type NullableStringFieldUpdateOperationsInput = {
    set?: string | null
  }

  export type TaxCertUpdateManyWithoutUserNestedInput = {
    create?: XOR<TaxCertCreateWithoutUserInput, TaxCertUncheckedCreateWithoutUserInput> | TaxCertCreateWithoutUserInput[] | TaxCertUncheckedCreateWithoutUserInput[]
    connectOrCreate?: TaxCertCreateOrConnectWithoutUserInput | TaxCertCreateOrConnectWithoutUserInput[]
    upsert?: TaxCertUpsertWithWhereUniqueWithoutUserInput | TaxCertUpsertWithWhereUniqueWithoutUserInput[]
    createMany?: TaxCertCreateManyUserInputEnvelope
    set?: TaxCertWhereUniqueInput | TaxCertWhereUniqueInput[]
    disconnect?: TaxCertWhereUniqueInput | TaxCertWhereUniqueInput[]
    delete?: TaxCertWhereUniqueInput | TaxCertWhereUniqueInput[]
    connect?: TaxCertWhereUniqueInput | TaxCertWhereUniqueInput[]
    update?: TaxCertUpdateWithWhereUniqueWithoutUserInput | TaxCertUpdateWithWhereUniqueWithoutUserInput[]
    updateMany?: TaxCertUpdateManyWithWhereWithoutUserInput | TaxCertUpdateManyWithWhereWithoutUserInput[]
    deleteMany?: TaxCertScalarWhereInput | TaxCertScalarWhereInput[]
  }

  export type UserAddressUpdateManyWithoutUserNestedInput = {
    create?: XOR<UserAddressCreateWithoutUserInput, UserAddressUncheckedCreateWithoutUserInput> | UserAddressCreateWithoutUserInput[] | UserAddressUncheckedCreateWithoutUserInput[]
    connectOrCreate?: UserAddressCreateOrConnectWithoutUserInput | UserAddressCreateOrConnectWithoutUserInput[]
    upsert?: UserAddressUpsertWithWhereUniqueWithoutUserInput | UserAddressUpsertWithWhereUniqueWithoutUserInput[]
    createMany?: UserAddressCreateManyUserInputEnvelope
    set?: UserAddressWhereUniqueInput | UserAddressWhereUniqueInput[]
    disconnect?: UserAddressWhereUniqueInput | UserAddressWhereUniqueInput[]
    delete?: UserAddressWhereUniqueInput | UserAddressWhereUniqueInput[]
    connect?: UserAddressWhereUniqueInput | UserAddressWhereUniqueInput[]
    update?: UserAddressUpdateWithWhereUniqueWithoutUserInput | UserAddressUpdateWithWhereUniqueWithoutUserInput[]
    updateMany?: UserAddressUpdateManyWithWhereWithoutUserInput | UserAddressUpdateManyWithWhereWithoutUserInput[]
    deleteMany?: UserAddressScalarWhereInput | UserAddressScalarWhereInput[]
  }

  export type TaxCertUncheckedUpdateManyWithoutUserNestedInput = {
    create?: XOR<TaxCertCreateWithoutUserInput, TaxCertUncheckedCreateWithoutUserInput> | TaxCertCreateWithoutUserInput[] | TaxCertUncheckedCreateWithoutUserInput[]
    connectOrCreate?: TaxCertCreateOrConnectWithoutUserInput | TaxCertCreateOrConnectWithoutUserInput[]
    upsert?: TaxCertUpsertWithWhereUniqueWithoutUserInput | TaxCertUpsertWithWhereUniqueWithoutUserInput[]
    createMany?: TaxCertCreateManyUserInputEnvelope
    set?: TaxCertWhereUniqueInput | TaxCertWhereUniqueInput[]
    disconnect?: TaxCertWhereUniqueInput | TaxCertWhereUniqueInput[]
    delete?: TaxCertWhereUniqueInput | TaxCertWhereUniqueInput[]
    connect?: TaxCertWhereUniqueInput | TaxCertWhereUniqueInput[]
    update?: TaxCertUpdateWithWhereUniqueWithoutUserInput | TaxCertUpdateWithWhereUniqueWithoutUserInput[]
    updateMany?: TaxCertUpdateManyWithWhereWithoutUserInput | TaxCertUpdateManyWithWhereWithoutUserInput[]
    deleteMany?: TaxCertScalarWhereInput | TaxCertScalarWhereInput[]
  }

  export type UserAddressUncheckedUpdateManyWithoutUserNestedInput = {
    create?: XOR<UserAddressCreateWithoutUserInput, UserAddressUncheckedCreateWithoutUserInput> | UserAddressCreateWithoutUserInput[] | UserAddressUncheckedCreateWithoutUserInput[]
    connectOrCreate?: UserAddressCreateOrConnectWithoutUserInput | UserAddressCreateOrConnectWithoutUserInput[]
    upsert?: UserAddressUpsertWithWhereUniqueWithoutUserInput | UserAddressUpsertWithWhereUniqueWithoutUserInput[]
    createMany?: UserAddressCreateManyUserInputEnvelope
    set?: UserAddressWhereUniqueInput | UserAddressWhereUniqueInput[]
    disconnect?: UserAddressWhereUniqueInput | UserAddressWhereUniqueInput[]
    delete?: UserAddressWhereUniqueInput | UserAddressWhereUniqueInput[]
    connect?: UserAddressWhereUniqueInput | UserAddressWhereUniqueInput[]
    update?: UserAddressUpdateWithWhereUniqueWithoutUserInput | UserAddressUpdateWithWhereUniqueWithoutUserInput[]
    updateMany?: UserAddressUpdateManyWithWhereWithoutUserInput | UserAddressUpdateManyWithWhereWithoutUserInput[]
    deleteMany?: UserAddressScalarWhereInput | UserAddressScalarWhereInput[]
  }

  export type UserCreateNestedOneWithoutTaxCertsInput = {
    create?: XOR<UserCreateWithoutTaxCertsInput, UserUncheckedCreateWithoutTaxCertsInput>
    connectOrCreate?: UserCreateOrConnectWithoutTaxCertsInput
    connect?: UserWhereUniqueInput
  }

  export type UserUpdateOneRequiredWithoutTaxCertsNestedInput = {
    create?: XOR<UserCreateWithoutTaxCertsInput, UserUncheckedCreateWithoutTaxCertsInput>
    connectOrCreate?: UserCreateOrConnectWithoutTaxCertsInput
    upsert?: UserUpsertWithoutTaxCertsInput
    connect?: UserWhereUniqueInput
    update?: XOR<XOR<UserUpdateToOneWithWhereWithoutTaxCertsInput, UserUpdateWithoutTaxCertsInput>, UserUncheckedUpdateWithoutTaxCertsInput>
  }

  export type IntFieldUpdateOperationsInput = {
    set?: number
    increment?: number
    decrement?: number
    multiply?: number
    divide?: number
  }

  export type UserAddressCreateNestedManyWithoutAddressInput = {
    create?: XOR<UserAddressCreateWithoutAddressInput, UserAddressUncheckedCreateWithoutAddressInput> | UserAddressCreateWithoutAddressInput[] | UserAddressUncheckedCreateWithoutAddressInput[]
    connectOrCreate?: UserAddressCreateOrConnectWithoutAddressInput | UserAddressCreateOrConnectWithoutAddressInput[]
    createMany?: UserAddressCreateManyAddressInputEnvelope
    connect?: UserAddressWhereUniqueInput | UserAddressWhereUniqueInput[]
  }

  export type UserAddressUncheckedCreateNestedManyWithoutAddressInput = {
    create?: XOR<UserAddressCreateWithoutAddressInput, UserAddressUncheckedCreateWithoutAddressInput> | UserAddressCreateWithoutAddressInput[] | UserAddressUncheckedCreateWithoutAddressInput[]
    connectOrCreate?: UserAddressCreateOrConnectWithoutAddressInput | UserAddressCreateOrConnectWithoutAddressInput[]
    createMany?: UserAddressCreateManyAddressInputEnvelope
    connect?: UserAddressWhereUniqueInput | UserAddressWhereUniqueInput[]
  }

  export type NullableFloatFieldUpdateOperationsInput = {
    set?: number | null
    increment?: number
    decrement?: number
    multiply?: number
    divide?: number
  }

  export type UserAddressUpdateManyWithoutAddressNestedInput = {
    create?: XOR<UserAddressCreateWithoutAddressInput, UserAddressUncheckedCreateWithoutAddressInput> | UserAddressCreateWithoutAddressInput[] | UserAddressUncheckedCreateWithoutAddressInput[]
    connectOrCreate?: UserAddressCreateOrConnectWithoutAddressInput | UserAddressCreateOrConnectWithoutAddressInput[]
    upsert?: UserAddressUpsertWithWhereUniqueWithoutAddressInput | UserAddressUpsertWithWhereUniqueWithoutAddressInput[]
    createMany?: UserAddressCreateManyAddressInputEnvelope
    set?: UserAddressWhereUniqueInput | UserAddressWhereUniqueInput[]
    disconnect?: UserAddressWhereUniqueInput | UserAddressWhereUniqueInput[]
    delete?: UserAddressWhereUniqueInput | UserAddressWhereUniqueInput[]
    connect?: UserAddressWhereUniqueInput | UserAddressWhereUniqueInput[]
    update?: UserAddressUpdateWithWhereUniqueWithoutAddressInput | UserAddressUpdateWithWhereUniqueWithoutAddressInput[]
    updateMany?: UserAddressUpdateManyWithWhereWithoutAddressInput | UserAddressUpdateManyWithWhereWithoutAddressInput[]
    deleteMany?: UserAddressScalarWhereInput | UserAddressScalarWhereInput[]
  }

  export type UserAddressUncheckedUpdateManyWithoutAddressNestedInput = {
    create?: XOR<UserAddressCreateWithoutAddressInput, UserAddressUncheckedCreateWithoutAddressInput> | UserAddressCreateWithoutAddressInput[] | UserAddressUncheckedCreateWithoutAddressInput[]
    connectOrCreate?: UserAddressCreateOrConnectWithoutAddressInput | UserAddressCreateOrConnectWithoutAddressInput[]
    upsert?: UserAddressUpsertWithWhereUniqueWithoutAddressInput | UserAddressUpsertWithWhereUniqueWithoutAddressInput[]
    createMany?: UserAddressCreateManyAddressInputEnvelope
    set?: UserAddressWhereUniqueInput | UserAddressWhereUniqueInput[]
    disconnect?: UserAddressWhereUniqueInput | UserAddressWhereUniqueInput[]
    delete?: UserAddressWhereUniqueInput | UserAddressWhereUniqueInput[]
    connect?: UserAddressWhereUniqueInput | UserAddressWhereUniqueInput[]
    update?: UserAddressUpdateWithWhereUniqueWithoutAddressInput | UserAddressUpdateWithWhereUniqueWithoutAddressInput[]
    updateMany?: UserAddressUpdateManyWithWhereWithoutAddressInput | UserAddressUpdateManyWithWhereWithoutAddressInput[]
    deleteMany?: UserAddressScalarWhereInput | UserAddressScalarWhereInput[]
  }

  export type UserCreateNestedOneWithoutUserAddressesInput = {
    create?: XOR<UserCreateWithoutUserAddressesInput, UserUncheckedCreateWithoutUserAddressesInput>
    connectOrCreate?: UserCreateOrConnectWithoutUserAddressesInput
    connect?: UserWhereUniqueInput
  }

  export type AddressCreateNestedOneWithoutUserAddressesInput = {
    create?: XOR<AddressCreateWithoutUserAddressesInput, AddressUncheckedCreateWithoutUserAddressesInput>
    connectOrCreate?: AddressCreateOrConnectWithoutUserAddressesInput
    connect?: AddressWhereUniqueInput
  }

  export type RealEstateCreateNestedManyWithoutUserAddressInput = {
    create?: XOR<RealEstateCreateWithoutUserAddressInput, RealEstateUncheckedCreateWithoutUserAddressInput> | RealEstateCreateWithoutUserAddressInput[] | RealEstateUncheckedCreateWithoutUserAddressInput[]
    connectOrCreate?: RealEstateCreateOrConnectWithoutUserAddressInput | RealEstateCreateOrConnectWithoutUserAddressInput[]
    createMany?: RealEstateCreateManyUserAddressInputEnvelope
    connect?: RealEstateWhereUniqueInput | RealEstateWhereUniqueInput[]
  }

  export type StepResultCreateNestedManyWithoutUserAddressInput = {
    create?: XOR<StepResultCreateWithoutUserAddressInput, StepResultUncheckedCreateWithoutUserAddressInput> | StepResultCreateWithoutUserAddressInput[] | StepResultUncheckedCreateWithoutUserAddressInput[]
    connectOrCreate?: StepResultCreateOrConnectWithoutUserAddressInput | StepResultCreateOrConnectWithoutUserAddressInput[]
    createMany?: StepResultCreateManyUserAddressInputEnvelope
    connect?: StepResultWhereUniqueInput | StepResultWhereUniqueInput[]
  }

  export type RealEstateUncheckedCreateNestedManyWithoutUserAddressInput = {
    create?: XOR<RealEstateCreateWithoutUserAddressInput, RealEstateUncheckedCreateWithoutUserAddressInput> | RealEstateCreateWithoutUserAddressInput[] | RealEstateUncheckedCreateWithoutUserAddressInput[]
    connectOrCreate?: RealEstateCreateOrConnectWithoutUserAddressInput | RealEstateCreateOrConnectWithoutUserAddressInput[]
    createMany?: RealEstateCreateManyUserAddressInputEnvelope
    connect?: RealEstateWhereUniqueInput | RealEstateWhereUniqueInput[]
  }

  export type StepResultUncheckedCreateNestedManyWithoutUserAddressInput = {
    create?: XOR<StepResultCreateWithoutUserAddressInput, StepResultUncheckedCreateWithoutUserAddressInput> | StepResultCreateWithoutUserAddressInput[] | StepResultUncheckedCreateWithoutUserAddressInput[]
    connectOrCreate?: StepResultCreateOrConnectWithoutUserAddressInput | StepResultCreateOrConnectWithoutUserAddressInput[]
    createMany?: StepResultCreateManyUserAddressInputEnvelope
    connect?: StepResultWhereUniqueInput | StepResultWhereUniqueInput[]
  }

  export type NullableBoolFieldUpdateOperationsInput = {
    set?: boolean | null
  }

  export type DateTimeFieldUpdateOperationsInput = {
    set?: Date | string
  }

  export type UserUpdateOneRequiredWithoutUserAddressesNestedInput = {
    create?: XOR<UserCreateWithoutUserAddressesInput, UserUncheckedCreateWithoutUserAddressesInput>
    connectOrCreate?: UserCreateOrConnectWithoutUserAddressesInput
    upsert?: UserUpsertWithoutUserAddressesInput
    connect?: UserWhereUniqueInput
    update?: XOR<XOR<UserUpdateToOneWithWhereWithoutUserAddressesInput, UserUpdateWithoutUserAddressesInput>, UserUncheckedUpdateWithoutUserAddressesInput>
  }

  export type AddressUpdateOneRequiredWithoutUserAddressesNestedInput = {
    create?: XOR<AddressCreateWithoutUserAddressesInput, AddressUncheckedCreateWithoutUserAddressesInput>
    connectOrCreate?: AddressCreateOrConnectWithoutUserAddressesInput
    upsert?: AddressUpsertWithoutUserAddressesInput
    connect?: AddressWhereUniqueInput
    update?: XOR<XOR<AddressUpdateToOneWithWhereWithoutUserAddressesInput, AddressUpdateWithoutUserAddressesInput>, AddressUncheckedUpdateWithoutUserAddressesInput>
  }

  export type RealEstateUpdateManyWithoutUserAddressNestedInput = {
    create?: XOR<RealEstateCreateWithoutUserAddressInput, RealEstateUncheckedCreateWithoutUserAddressInput> | RealEstateCreateWithoutUserAddressInput[] | RealEstateUncheckedCreateWithoutUserAddressInput[]
    connectOrCreate?: RealEstateCreateOrConnectWithoutUserAddressInput | RealEstateCreateOrConnectWithoutUserAddressInput[]
    upsert?: RealEstateUpsertWithWhereUniqueWithoutUserAddressInput | RealEstateUpsertWithWhereUniqueWithoutUserAddressInput[]
    createMany?: RealEstateCreateManyUserAddressInputEnvelope
    set?: RealEstateWhereUniqueInput | RealEstateWhereUniqueInput[]
    disconnect?: RealEstateWhereUniqueInput | RealEstateWhereUniqueInput[]
    delete?: RealEstateWhereUniqueInput | RealEstateWhereUniqueInput[]
    connect?: RealEstateWhereUniqueInput | RealEstateWhereUniqueInput[]
    update?: RealEstateUpdateWithWhereUniqueWithoutUserAddressInput | RealEstateUpdateWithWhereUniqueWithoutUserAddressInput[]
    updateMany?: RealEstateUpdateManyWithWhereWithoutUserAddressInput | RealEstateUpdateManyWithWhereWithoutUserAddressInput[]
    deleteMany?: RealEstateScalarWhereInput | RealEstateScalarWhereInput[]
  }

  export type StepResultUpdateManyWithoutUserAddressNestedInput = {
    create?: XOR<StepResultCreateWithoutUserAddressInput, StepResultUncheckedCreateWithoutUserAddressInput> | StepResultCreateWithoutUserAddressInput[] | StepResultUncheckedCreateWithoutUserAddressInput[]
    connectOrCreate?: StepResultCreateOrConnectWithoutUserAddressInput | StepResultCreateOrConnectWithoutUserAddressInput[]
    upsert?: StepResultUpsertWithWhereUniqueWithoutUserAddressInput | StepResultUpsertWithWhereUniqueWithoutUserAddressInput[]
    createMany?: StepResultCreateManyUserAddressInputEnvelope
    set?: StepResultWhereUniqueInput | StepResultWhereUniqueInput[]
    disconnect?: StepResultWhereUniqueInput | StepResultWhereUniqueInput[]
    delete?: StepResultWhereUniqueInput | StepResultWhereUniqueInput[]
    connect?: StepResultWhereUniqueInput | StepResultWhereUniqueInput[]
    update?: StepResultUpdateWithWhereUniqueWithoutUserAddressInput | StepResultUpdateWithWhereUniqueWithoutUserAddressInput[]
    updateMany?: StepResultUpdateManyWithWhereWithoutUserAddressInput | StepResultUpdateManyWithWhereWithoutUserAddressInput[]
    deleteMany?: StepResultScalarWhereInput | StepResultScalarWhereInput[]
  }

  export type RealEstateUncheckedUpdateManyWithoutUserAddressNestedInput = {
    create?: XOR<RealEstateCreateWithoutUserAddressInput, RealEstateUncheckedCreateWithoutUserAddressInput> | RealEstateCreateWithoutUserAddressInput[] | RealEstateUncheckedCreateWithoutUserAddressInput[]
    connectOrCreate?: RealEstateCreateOrConnectWithoutUserAddressInput | RealEstateCreateOrConnectWithoutUserAddressInput[]
    upsert?: RealEstateUpsertWithWhereUniqueWithoutUserAddressInput | RealEstateUpsertWithWhereUniqueWithoutUserAddressInput[]
    createMany?: RealEstateCreateManyUserAddressInputEnvelope
    set?: RealEstateWhereUniqueInput | RealEstateWhereUniqueInput[]
    disconnect?: RealEstateWhereUniqueInput | RealEstateWhereUniqueInput[]
    delete?: RealEstateWhereUniqueInput | RealEstateWhereUniqueInput[]
    connect?: RealEstateWhereUniqueInput | RealEstateWhereUniqueInput[]
    update?: RealEstateUpdateWithWhereUniqueWithoutUserAddressInput | RealEstateUpdateWithWhereUniqueWithoutUserAddressInput[]
    updateMany?: RealEstateUpdateManyWithWhereWithoutUserAddressInput | RealEstateUpdateManyWithWhereWithoutUserAddressInput[]
    deleteMany?: RealEstateScalarWhereInput | RealEstateScalarWhereInput[]
  }

  export type StepResultUncheckedUpdateManyWithoutUserAddressNestedInput = {
    create?: XOR<StepResultCreateWithoutUserAddressInput, StepResultUncheckedCreateWithoutUserAddressInput> | StepResultCreateWithoutUserAddressInput[] | StepResultUncheckedCreateWithoutUserAddressInput[]
    connectOrCreate?: StepResultCreateOrConnectWithoutUserAddressInput | StepResultCreateOrConnectWithoutUserAddressInput[]
    upsert?: StepResultUpsertWithWhereUniqueWithoutUserAddressInput | StepResultUpsertWithWhereUniqueWithoutUserAddressInput[]
    createMany?: StepResultCreateManyUserAddressInputEnvelope
    set?: StepResultWhereUniqueInput | StepResultWhereUniqueInput[]
    disconnect?: StepResultWhereUniqueInput | StepResultWhereUniqueInput[]
    delete?: StepResultWhereUniqueInput | StepResultWhereUniqueInput[]
    connect?: StepResultWhereUniqueInput | StepResultWhereUniqueInput[]
    update?: StepResultUpdateWithWhereUniqueWithoutUserAddressInput | StepResultUpdateWithWhereUniqueWithoutUserAddressInput[]
    updateMany?: StepResultUpdateManyWithWhereWithoutUserAddressInput | StepResultUpdateManyWithWhereWithoutUserAddressInput[]
    deleteMany?: StepResultScalarWhereInput | StepResultScalarWhereInput[]
  }

  export type UserAddressCreateNestedOneWithoutRealEstatesInput = {
    create?: XOR<UserAddressCreateWithoutRealEstatesInput, UserAddressUncheckedCreateWithoutRealEstatesInput>
    connectOrCreate?: UserAddressCreateOrConnectWithoutRealEstatesInput
    connect?: UserAddressWhereUniqueInput
  }

  export type UserAddressUpdateOneRequiredWithoutRealEstatesNestedInput = {
    create?: XOR<UserAddressCreateWithoutRealEstatesInput, UserAddressUncheckedCreateWithoutRealEstatesInput>
    connectOrCreate?: UserAddressCreateOrConnectWithoutRealEstatesInput
    upsert?: UserAddressUpsertWithoutRealEstatesInput
    connect?: UserAddressWhereUniqueInput
    update?: XOR<XOR<UserAddressUpdateToOneWithWhereWithoutRealEstatesInput, UserAddressUpdateWithoutRealEstatesInput>, UserAddressUncheckedUpdateWithoutRealEstatesInput>
  }

  export type StepResultCreateNestedManyWithoutStepInput = {
    create?: XOR<StepResultCreateWithoutStepInput, StepResultUncheckedCreateWithoutStepInput> | StepResultCreateWithoutStepInput[] | StepResultUncheckedCreateWithoutStepInput[]
    connectOrCreate?: StepResultCreateOrConnectWithoutStepInput | StepResultCreateOrConnectWithoutStepInput[]
    createMany?: StepResultCreateManyStepInputEnvelope
    connect?: StepResultWhereUniqueInput | StepResultWhereUniqueInput[]
  }

  export type StepResultUncheckedCreateNestedManyWithoutStepInput = {
    create?: XOR<StepResultCreateWithoutStepInput, StepResultUncheckedCreateWithoutStepInput> | StepResultCreateWithoutStepInput[] | StepResultUncheckedCreateWithoutStepInput[]
    connectOrCreate?: StepResultCreateOrConnectWithoutStepInput | StepResultCreateOrConnectWithoutStepInput[]
    createMany?: StepResultCreateManyStepInputEnvelope
    connect?: StepResultWhereUniqueInput | StepResultWhereUniqueInput[]
  }

  export type StepResultUpdateManyWithoutStepNestedInput = {
    create?: XOR<StepResultCreateWithoutStepInput, StepResultUncheckedCreateWithoutStepInput> | StepResultCreateWithoutStepInput[] | StepResultUncheckedCreateWithoutStepInput[]
    connectOrCreate?: StepResultCreateOrConnectWithoutStepInput | StepResultCreateOrConnectWithoutStepInput[]
    upsert?: StepResultUpsertWithWhereUniqueWithoutStepInput | StepResultUpsertWithWhereUniqueWithoutStepInput[]
    createMany?: StepResultCreateManyStepInputEnvelope
    set?: StepResultWhereUniqueInput | StepResultWhereUniqueInput[]
    disconnect?: StepResultWhereUniqueInput | StepResultWhereUniqueInput[]
    delete?: StepResultWhereUniqueInput | StepResultWhereUniqueInput[]
    connect?: StepResultWhereUniqueInput | StepResultWhereUniqueInput[]
    update?: StepResultUpdateWithWhereUniqueWithoutStepInput | StepResultUpdateWithWhereUniqueWithoutStepInput[]
    updateMany?: StepResultUpdateManyWithWhereWithoutStepInput | StepResultUpdateManyWithWhereWithoutStepInput[]
    deleteMany?: StepResultScalarWhereInput | StepResultScalarWhereInput[]
  }

  export type StepResultUncheckedUpdateManyWithoutStepNestedInput = {
    create?: XOR<StepResultCreateWithoutStepInput, StepResultUncheckedCreateWithoutStepInput> | StepResultCreateWithoutStepInput[] | StepResultUncheckedCreateWithoutStepInput[]
    connectOrCreate?: StepResultCreateOrConnectWithoutStepInput | StepResultCreateOrConnectWithoutStepInput[]
    upsert?: StepResultUpsertWithWhereUniqueWithoutStepInput | StepResultUpsertWithWhereUniqueWithoutStepInput[]
    createMany?: StepResultCreateManyStepInputEnvelope
    set?: StepResultWhereUniqueInput | StepResultWhereUniqueInput[]
    disconnect?: StepResultWhereUniqueInput | StepResultWhereUniqueInput[]
    delete?: StepResultWhereUniqueInput | StepResultWhereUniqueInput[]
    connect?: StepResultWhereUniqueInput | StepResultWhereUniqueInput[]
    update?: StepResultUpdateWithWhereUniqueWithoutStepInput | StepResultUpdateWithWhereUniqueWithoutStepInput[]
    updateMany?: StepResultUpdateManyWithWhereWithoutStepInput | StepResultUpdateManyWithWhereWithoutStepInput[]
    deleteMany?: StepResultScalarWhereInput | StepResultScalarWhereInput[]
  }

  export type UserAddressCreateNestedOneWithoutStepResultsInput = {
    create?: XOR<UserAddressCreateWithoutStepResultsInput, UserAddressUncheckedCreateWithoutStepResultsInput>
    connectOrCreate?: UserAddressCreateOrConnectWithoutStepResultsInput
    connect?: UserAddressWhereUniqueInput
  }

  export type StepCreateNestedOneWithoutStepResultsInput = {
    create?: XOR<StepCreateWithoutStepResultsInput, StepUncheckedCreateWithoutStepResultsInput>
    connectOrCreate?: StepCreateOrConnectWithoutStepResultsInput
    connect?: StepWhereUniqueInput
  }

  export type NullableIntFieldUpdateOperationsInput = {
    set?: number | null
    increment?: number
    decrement?: number
    multiply?: number
    divide?: number
  }

  export type UserAddressUpdateOneRequiredWithoutStepResultsNestedInput = {
    create?: XOR<UserAddressCreateWithoutStepResultsInput, UserAddressUncheckedCreateWithoutStepResultsInput>
    connectOrCreate?: UserAddressCreateOrConnectWithoutStepResultsInput
    upsert?: UserAddressUpsertWithoutStepResultsInput
    connect?: UserAddressWhereUniqueInput
    update?: XOR<XOR<UserAddressUpdateToOneWithWhereWithoutStepResultsInput, UserAddressUpdateWithoutStepResultsInput>, UserAddressUncheckedUpdateWithoutStepResultsInput>
  }

  export type StepUpdateOneRequiredWithoutStepResultsNestedInput = {
    create?: XOR<StepCreateWithoutStepResultsInput, StepUncheckedCreateWithoutStepResultsInput>
    connectOrCreate?: StepCreateOrConnectWithoutStepResultsInput
    upsert?: StepUpsertWithoutStepResultsInput
    connect?: StepWhereUniqueInput
    update?: XOR<XOR<StepUpdateToOneWithWhereWithoutStepResultsInput, StepUpdateWithoutStepResultsInput>, StepUncheckedUpdateWithoutStepResultsInput>
  }

  export type NestedUuidFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel>
    in?: string[] | ListStringFieldRefInput<$PrismaModel>
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel>
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    not?: NestedUuidFilter<$PrismaModel> | string
  }

  export type NestedStringNullableFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel> | null
    in?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    not?: NestedStringNullableFilter<$PrismaModel> | string | null
  }

  export type NestedUuidWithAggregatesFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel>
    in?: string[] | ListStringFieldRefInput<$PrismaModel>
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel>
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    not?: NestedUuidWithAggregatesFilter<$PrismaModel> | string
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedStringFilter<$PrismaModel>
    _max?: NestedStringFilter<$PrismaModel>
  }

  export type NestedIntFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel>
    in?: number[] | ListIntFieldRefInput<$PrismaModel>
    notIn?: number[] | ListIntFieldRefInput<$PrismaModel>
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntFilter<$PrismaModel> | number
  }

  export type NestedStringFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel>
    in?: string[] | ListStringFieldRefInput<$PrismaModel>
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel>
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    not?: NestedStringFilter<$PrismaModel> | string
  }

  export type NestedStringNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel> | null
    in?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    not?: NestedStringNullableWithAggregatesFilter<$PrismaModel> | string | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedStringNullableFilter<$PrismaModel>
    _max?: NestedStringNullableFilter<$PrismaModel>
  }

  export type NestedIntNullableFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel> | null
    in?: number[] | ListIntFieldRefInput<$PrismaModel> | null
    notIn?: number[] | ListIntFieldRefInput<$PrismaModel> | null
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntNullableFilter<$PrismaModel> | number | null
  }

  export type NestedIntWithAggregatesFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel>
    in?: number[] | ListIntFieldRefInput<$PrismaModel>
    notIn?: number[] | ListIntFieldRefInput<$PrismaModel>
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntWithAggregatesFilter<$PrismaModel> | number
    _count?: NestedIntFilter<$PrismaModel>
    _avg?: NestedFloatFilter<$PrismaModel>
    _sum?: NestedIntFilter<$PrismaModel>
    _min?: NestedIntFilter<$PrismaModel>
    _max?: NestedIntFilter<$PrismaModel>
  }

  export type NestedFloatFilter<$PrismaModel = never> = {
    equals?: number | FloatFieldRefInput<$PrismaModel>
    in?: number[] | ListFloatFieldRefInput<$PrismaModel>
    notIn?: number[] | ListFloatFieldRefInput<$PrismaModel>
    lt?: number | FloatFieldRefInput<$PrismaModel>
    lte?: number | FloatFieldRefInput<$PrismaModel>
    gt?: number | FloatFieldRefInput<$PrismaModel>
    gte?: number | FloatFieldRefInput<$PrismaModel>
    not?: NestedFloatFilter<$PrismaModel> | number
  }
  export type NestedJsonNullableFilter<$PrismaModel = never> =
    | PatchUndefined<
        Either<Required<NestedJsonNullableFilterBase<$PrismaModel>>, Exclude<keyof Required<NestedJsonNullableFilterBase<$PrismaModel>>, 'path'>>,
        Required<NestedJsonNullableFilterBase<$PrismaModel>>
      >
    | OptionalFlat<Omit<Required<NestedJsonNullableFilterBase<$PrismaModel>>, 'path'>>

  export type NestedJsonNullableFilterBase<$PrismaModel = never> = {
    equals?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | JsonNullValueFilter
    path?: string[]
    mode?: QueryMode | EnumQueryModeFieldRefInput<$PrismaModel>
    string_contains?: string | StringFieldRefInput<$PrismaModel>
    string_starts_with?: string | StringFieldRefInput<$PrismaModel>
    string_ends_with?: string | StringFieldRefInput<$PrismaModel>
    array_starts_with?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    array_ends_with?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    array_contains?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    lt?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    lte?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    gt?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    gte?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    not?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | JsonNullValueFilter
  }

  export type NestedFloatNullableFilter<$PrismaModel = never> = {
    equals?: number | FloatFieldRefInput<$PrismaModel> | null
    in?: number[] | ListFloatFieldRefInput<$PrismaModel> | null
    notIn?: number[] | ListFloatFieldRefInput<$PrismaModel> | null
    lt?: number | FloatFieldRefInput<$PrismaModel>
    lte?: number | FloatFieldRefInput<$PrismaModel>
    gt?: number | FloatFieldRefInput<$PrismaModel>
    gte?: number | FloatFieldRefInput<$PrismaModel>
    not?: NestedFloatNullableFilter<$PrismaModel> | number | null
  }

  export type NestedFloatNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: number | FloatFieldRefInput<$PrismaModel> | null
    in?: number[] | ListFloatFieldRefInput<$PrismaModel> | null
    notIn?: number[] | ListFloatFieldRefInput<$PrismaModel> | null
    lt?: number | FloatFieldRefInput<$PrismaModel>
    lte?: number | FloatFieldRefInput<$PrismaModel>
    gt?: number | FloatFieldRefInput<$PrismaModel>
    gte?: number | FloatFieldRefInput<$PrismaModel>
    not?: NestedFloatNullableWithAggregatesFilter<$PrismaModel> | number | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _avg?: NestedFloatNullableFilter<$PrismaModel>
    _sum?: NestedFloatNullableFilter<$PrismaModel>
    _min?: NestedFloatNullableFilter<$PrismaModel>
    _max?: NestedFloatNullableFilter<$PrismaModel>
  }

  export type NestedBoolNullableFilter<$PrismaModel = never> = {
    equals?: boolean | BooleanFieldRefInput<$PrismaModel> | null
    not?: NestedBoolNullableFilter<$PrismaModel> | boolean | null
  }

  export type NestedDateTimeFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeFilter<$PrismaModel> | Date | string
  }

  export type NestedBoolNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: boolean | BooleanFieldRefInput<$PrismaModel> | null
    not?: NestedBoolNullableWithAggregatesFilter<$PrismaModel> | boolean | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedBoolNullableFilter<$PrismaModel>
    _max?: NestedBoolNullableFilter<$PrismaModel>
  }

  export type NestedDateTimeWithAggregatesFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeWithAggregatesFilter<$PrismaModel> | Date | string
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedDateTimeFilter<$PrismaModel>
    _max?: NestedDateTimeFilter<$PrismaModel>
  }

  export type NestedIntNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel> | null
    in?: number[] | ListIntFieldRefInput<$PrismaModel> | null
    notIn?: number[] | ListIntFieldRefInput<$PrismaModel> | null
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntNullableWithAggregatesFilter<$PrismaModel> | number | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _avg?: NestedFloatNullableFilter<$PrismaModel>
    _sum?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedIntNullableFilter<$PrismaModel>
    _max?: NestedIntNullableFilter<$PrismaModel>
  }

  export type TaxCertCreateWithoutUserInput = {
    taxCertJson?: NullableJsonNullValueInput | InputJsonValue
  }

  export type TaxCertUncheckedCreateWithoutUserInput = {
    id?: number
    taxCertJson?: NullableJsonNullValueInput | InputJsonValue
  }

  export type TaxCertCreateOrConnectWithoutUserInput = {
    where: TaxCertWhereUniqueInput
    create: XOR<TaxCertCreateWithoutUserInput, TaxCertUncheckedCreateWithoutUserInput>
  }

  export type TaxCertCreateManyUserInputEnvelope = {
    data: TaxCertCreateManyUserInput | TaxCertCreateManyUserInput[]
    skipDuplicates?: boolean
  }

  export type UserAddressCreateWithoutUserInput = {
    isPrimary?: boolean | null
    createdAt?: Date | string
    nickname?: string | null
    address: AddressCreateNestedOneWithoutUserAddressesInput
    realEstates?: RealEstateCreateNestedManyWithoutUserAddressInput
    stepResults?: StepResultCreateNestedManyWithoutUserAddressInput
  }

  export type UserAddressUncheckedCreateWithoutUserInput = {
    id?: number
    addressId: number
    isPrimary?: boolean | null
    createdAt?: Date | string
    nickname?: string | null
    realEstates?: RealEstateUncheckedCreateNestedManyWithoutUserAddressInput
    stepResults?: StepResultUncheckedCreateNestedManyWithoutUserAddressInput
  }

  export type UserAddressCreateOrConnectWithoutUserInput = {
    where: UserAddressWhereUniqueInput
    create: XOR<UserAddressCreateWithoutUserInput, UserAddressUncheckedCreateWithoutUserInput>
  }

  export type UserAddressCreateManyUserInputEnvelope = {
    data: UserAddressCreateManyUserInput | UserAddressCreateManyUserInput[]
    skipDuplicates?: boolean
  }

  export type TaxCertUpsertWithWhereUniqueWithoutUserInput = {
    where: TaxCertWhereUniqueInput
    update: XOR<TaxCertUpdateWithoutUserInput, TaxCertUncheckedUpdateWithoutUserInput>
    create: XOR<TaxCertCreateWithoutUserInput, TaxCertUncheckedCreateWithoutUserInput>
  }

  export type TaxCertUpdateWithWhereUniqueWithoutUserInput = {
    where: TaxCertWhereUniqueInput
    data: XOR<TaxCertUpdateWithoutUserInput, TaxCertUncheckedUpdateWithoutUserInput>
  }

  export type TaxCertUpdateManyWithWhereWithoutUserInput = {
    where: TaxCertScalarWhereInput
    data: XOR<TaxCertUpdateManyMutationInput, TaxCertUncheckedUpdateManyWithoutUserInput>
  }

  export type TaxCertScalarWhereInput = {
    AND?: TaxCertScalarWhereInput | TaxCertScalarWhereInput[]
    OR?: TaxCertScalarWhereInput[]
    NOT?: TaxCertScalarWhereInput | TaxCertScalarWhereInput[]
    id?: IntFilter<"TaxCert"> | number
    userId?: UuidFilter<"TaxCert"> | string
    taxCertJson?: JsonNullableFilter<"TaxCert">
  }

  export type UserAddressUpsertWithWhereUniqueWithoutUserInput = {
    where: UserAddressWhereUniqueInput
    update: XOR<UserAddressUpdateWithoutUserInput, UserAddressUncheckedUpdateWithoutUserInput>
    create: XOR<UserAddressCreateWithoutUserInput, UserAddressUncheckedCreateWithoutUserInput>
  }

  export type UserAddressUpdateWithWhereUniqueWithoutUserInput = {
    where: UserAddressWhereUniqueInput
    data: XOR<UserAddressUpdateWithoutUserInput, UserAddressUncheckedUpdateWithoutUserInput>
  }

  export type UserAddressUpdateManyWithWhereWithoutUserInput = {
    where: UserAddressScalarWhereInput
    data: XOR<UserAddressUpdateManyMutationInput, UserAddressUncheckedUpdateManyWithoutUserInput>
  }

  export type UserAddressScalarWhereInput = {
    AND?: UserAddressScalarWhereInput | UserAddressScalarWhereInput[]
    OR?: UserAddressScalarWhereInput[]
    NOT?: UserAddressScalarWhereInput | UserAddressScalarWhereInput[]
    id?: IntFilter<"UserAddress"> | number
    userId?: UuidFilter<"UserAddress"> | string
    addressId?: IntFilter<"UserAddress"> | number
    isPrimary?: BoolNullableFilter<"UserAddress"> | boolean | null
    createdAt?: DateTimeFilter<"UserAddress"> | Date | string
    nickname?: StringNullableFilter<"UserAddress"> | string | null
  }

  export type UserCreateWithoutTaxCertsInput = {
    id?: string
    name?: string | null
    nickname?: string | null
    username?: string | null
    password?: string | null
    pinNumber?: string | null
    phoneNumber?: string | null
    userAddresses?: UserAddressCreateNestedManyWithoutUserInput
  }

  export type UserUncheckedCreateWithoutTaxCertsInput = {
    id?: string
    name?: string | null
    nickname?: string | null
    username?: string | null
    password?: string | null
    pinNumber?: string | null
    phoneNumber?: string | null
    userAddresses?: UserAddressUncheckedCreateNestedManyWithoutUserInput
  }

  export type UserCreateOrConnectWithoutTaxCertsInput = {
    where: UserWhereUniqueInput
    create: XOR<UserCreateWithoutTaxCertsInput, UserUncheckedCreateWithoutTaxCertsInput>
  }

  export type UserUpsertWithoutTaxCertsInput = {
    update: XOR<UserUpdateWithoutTaxCertsInput, UserUncheckedUpdateWithoutTaxCertsInput>
    create: XOR<UserCreateWithoutTaxCertsInput, UserUncheckedCreateWithoutTaxCertsInput>
    where?: UserWhereInput
  }

  export type UserUpdateToOneWithWhereWithoutTaxCertsInput = {
    where?: UserWhereInput
    data: XOR<UserUpdateWithoutTaxCertsInput, UserUncheckedUpdateWithoutTaxCertsInput>
  }

  export type UserUpdateWithoutTaxCertsInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: NullableStringFieldUpdateOperationsInput | string | null
    nickname?: NullableStringFieldUpdateOperationsInput | string | null
    username?: NullableStringFieldUpdateOperationsInput | string | null
    password?: NullableStringFieldUpdateOperationsInput | string | null
    pinNumber?: NullableStringFieldUpdateOperationsInput | string | null
    phoneNumber?: NullableStringFieldUpdateOperationsInput | string | null
    userAddresses?: UserAddressUpdateManyWithoutUserNestedInput
  }

  export type UserUncheckedUpdateWithoutTaxCertsInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: NullableStringFieldUpdateOperationsInput | string | null
    nickname?: NullableStringFieldUpdateOperationsInput | string | null
    username?: NullableStringFieldUpdateOperationsInput | string | null
    password?: NullableStringFieldUpdateOperationsInput | string | null
    pinNumber?: NullableStringFieldUpdateOperationsInput | string | null
    phoneNumber?: NullableStringFieldUpdateOperationsInput | string | null
    userAddresses?: UserAddressUncheckedUpdateManyWithoutUserNestedInput
  }

  export type UserAddressCreateWithoutAddressInput = {
    isPrimary?: boolean | null
    createdAt?: Date | string
    nickname?: string | null
    user: UserCreateNestedOneWithoutUserAddressesInput
    realEstates?: RealEstateCreateNestedManyWithoutUserAddressInput
    stepResults?: StepResultCreateNestedManyWithoutUserAddressInput
  }

  export type UserAddressUncheckedCreateWithoutAddressInput = {
    id?: number
    userId: string
    isPrimary?: boolean | null
    createdAt?: Date | string
    nickname?: string | null
    realEstates?: RealEstateUncheckedCreateNestedManyWithoutUserAddressInput
    stepResults?: StepResultUncheckedCreateNestedManyWithoutUserAddressInput
  }

  export type UserAddressCreateOrConnectWithoutAddressInput = {
    where: UserAddressWhereUniqueInput
    create: XOR<UserAddressCreateWithoutAddressInput, UserAddressUncheckedCreateWithoutAddressInput>
  }

  export type UserAddressCreateManyAddressInputEnvelope = {
    data: UserAddressCreateManyAddressInput | UserAddressCreateManyAddressInput[]
    skipDuplicates?: boolean
  }

  export type UserAddressUpsertWithWhereUniqueWithoutAddressInput = {
    where: UserAddressWhereUniqueInput
    update: XOR<UserAddressUpdateWithoutAddressInput, UserAddressUncheckedUpdateWithoutAddressInput>
    create: XOR<UserAddressCreateWithoutAddressInput, UserAddressUncheckedCreateWithoutAddressInput>
  }

  export type UserAddressUpdateWithWhereUniqueWithoutAddressInput = {
    where: UserAddressWhereUniqueInput
    data: XOR<UserAddressUpdateWithoutAddressInput, UserAddressUncheckedUpdateWithoutAddressInput>
  }

  export type UserAddressUpdateManyWithWhereWithoutAddressInput = {
    where: UserAddressScalarWhereInput
    data: XOR<UserAddressUpdateManyMutationInput, UserAddressUncheckedUpdateManyWithoutAddressInput>
  }

  export type UserCreateWithoutUserAddressesInput = {
    id?: string
    name?: string | null
    nickname?: string | null
    username?: string | null
    password?: string | null
    pinNumber?: string | null
    phoneNumber?: string | null
    taxCerts?: TaxCertCreateNestedManyWithoutUserInput
  }

  export type UserUncheckedCreateWithoutUserAddressesInput = {
    id?: string
    name?: string | null
    nickname?: string | null
    username?: string | null
    password?: string | null
    pinNumber?: string | null
    phoneNumber?: string | null
    taxCerts?: TaxCertUncheckedCreateNestedManyWithoutUserInput
  }

  export type UserCreateOrConnectWithoutUserAddressesInput = {
    where: UserWhereUniqueInput
    create: XOR<UserCreateWithoutUserAddressesInput, UserUncheckedCreateWithoutUserAddressesInput>
  }

  export type AddressCreateWithoutUserAddressesInput = {
    latitude?: number | null
    longitude?: number | null
    legalDistrictCode?: string | null
    dong?: string | null
    ho?: string | null
  }

  export type AddressUncheckedCreateWithoutUserAddressesInput = {
    id?: number
    latitude?: number | null
    longitude?: number | null
    legalDistrictCode?: string | null
    dong?: string | null
    ho?: string | null
  }

  export type AddressCreateOrConnectWithoutUserAddressesInput = {
    where: AddressWhereUniqueInput
    create: XOR<AddressCreateWithoutUserAddressesInput, AddressUncheckedCreateWithoutUserAddressesInput>
  }

  export type RealEstateCreateWithoutUserAddressInput = {
    realEstateJson?: NullableJsonNullValueInput | InputJsonValue
  }

  export type RealEstateUncheckedCreateWithoutUserAddressInput = {
    id?: number
    realEstateJson?: NullableJsonNullValueInput | InputJsonValue
  }

  export type RealEstateCreateOrConnectWithoutUserAddressInput = {
    where: RealEstateWhereUniqueInput
    create: XOR<RealEstateCreateWithoutUserAddressInput, RealEstateUncheckedCreateWithoutUserAddressInput>
  }

  export type RealEstateCreateManyUserAddressInputEnvelope = {
    data: RealEstateCreateManyUserAddressInput | RealEstateCreateManyUserAddressInput[]
    skipDuplicates?: boolean
  }

  export type StepResultCreateWithoutUserAddressInput = {
    mismatch?: number | null
    match?: number | null
    unchecked?: number | null
    createdAt?: Date | string
    step: StepCreateNestedOneWithoutStepResultsInput
  }

  export type StepResultUncheckedCreateWithoutUserAddressInput = {
    id?: number
    stepId: number
    mismatch?: number | null
    match?: number | null
    unchecked?: number | null
    createdAt?: Date | string
  }

  export type StepResultCreateOrConnectWithoutUserAddressInput = {
    where: StepResultWhereUniqueInput
    create: XOR<StepResultCreateWithoutUserAddressInput, StepResultUncheckedCreateWithoutUserAddressInput>
  }

  export type StepResultCreateManyUserAddressInputEnvelope = {
    data: StepResultCreateManyUserAddressInput | StepResultCreateManyUserAddressInput[]
    skipDuplicates?: boolean
  }

  export type UserUpsertWithoutUserAddressesInput = {
    update: XOR<UserUpdateWithoutUserAddressesInput, UserUncheckedUpdateWithoutUserAddressesInput>
    create: XOR<UserCreateWithoutUserAddressesInput, UserUncheckedCreateWithoutUserAddressesInput>
    where?: UserWhereInput
  }

  export type UserUpdateToOneWithWhereWithoutUserAddressesInput = {
    where?: UserWhereInput
    data: XOR<UserUpdateWithoutUserAddressesInput, UserUncheckedUpdateWithoutUserAddressesInput>
  }

  export type UserUpdateWithoutUserAddressesInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: NullableStringFieldUpdateOperationsInput | string | null
    nickname?: NullableStringFieldUpdateOperationsInput | string | null
    username?: NullableStringFieldUpdateOperationsInput | string | null
    password?: NullableStringFieldUpdateOperationsInput | string | null
    pinNumber?: NullableStringFieldUpdateOperationsInput | string | null
    phoneNumber?: NullableStringFieldUpdateOperationsInput | string | null
    taxCerts?: TaxCertUpdateManyWithoutUserNestedInput
  }

  export type UserUncheckedUpdateWithoutUserAddressesInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: NullableStringFieldUpdateOperationsInput | string | null
    nickname?: NullableStringFieldUpdateOperationsInput | string | null
    username?: NullableStringFieldUpdateOperationsInput | string | null
    password?: NullableStringFieldUpdateOperationsInput | string | null
    pinNumber?: NullableStringFieldUpdateOperationsInput | string | null
    phoneNumber?: NullableStringFieldUpdateOperationsInput | string | null
    taxCerts?: TaxCertUncheckedUpdateManyWithoutUserNestedInput
  }

  export type AddressUpsertWithoutUserAddressesInput = {
    update: XOR<AddressUpdateWithoutUserAddressesInput, AddressUncheckedUpdateWithoutUserAddressesInput>
    create: XOR<AddressCreateWithoutUserAddressesInput, AddressUncheckedCreateWithoutUserAddressesInput>
    where?: AddressWhereInput
  }

  export type AddressUpdateToOneWithWhereWithoutUserAddressesInput = {
    where?: AddressWhereInput
    data: XOR<AddressUpdateWithoutUserAddressesInput, AddressUncheckedUpdateWithoutUserAddressesInput>
  }

  export type AddressUpdateWithoutUserAddressesInput = {
    latitude?: NullableFloatFieldUpdateOperationsInput | number | null
    longitude?: NullableFloatFieldUpdateOperationsInput | number | null
    legalDistrictCode?: NullableStringFieldUpdateOperationsInput | string | null
    dong?: NullableStringFieldUpdateOperationsInput | string | null
    ho?: NullableStringFieldUpdateOperationsInput | string | null
  }

  export type AddressUncheckedUpdateWithoutUserAddressesInput = {
    id?: IntFieldUpdateOperationsInput | number
    latitude?: NullableFloatFieldUpdateOperationsInput | number | null
    longitude?: NullableFloatFieldUpdateOperationsInput | number | null
    legalDistrictCode?: NullableStringFieldUpdateOperationsInput | string | null
    dong?: NullableStringFieldUpdateOperationsInput | string | null
    ho?: NullableStringFieldUpdateOperationsInput | string | null
  }

  export type RealEstateUpsertWithWhereUniqueWithoutUserAddressInput = {
    where: RealEstateWhereUniqueInput
    update: XOR<RealEstateUpdateWithoutUserAddressInput, RealEstateUncheckedUpdateWithoutUserAddressInput>
    create: XOR<RealEstateCreateWithoutUserAddressInput, RealEstateUncheckedCreateWithoutUserAddressInput>
  }

  export type RealEstateUpdateWithWhereUniqueWithoutUserAddressInput = {
    where: RealEstateWhereUniqueInput
    data: XOR<RealEstateUpdateWithoutUserAddressInput, RealEstateUncheckedUpdateWithoutUserAddressInput>
  }

  export type RealEstateUpdateManyWithWhereWithoutUserAddressInput = {
    where: RealEstateScalarWhereInput
    data: XOR<RealEstateUpdateManyMutationInput, RealEstateUncheckedUpdateManyWithoutUserAddressInput>
  }

  export type RealEstateScalarWhereInput = {
    AND?: RealEstateScalarWhereInput | RealEstateScalarWhereInput[]
    OR?: RealEstateScalarWhereInput[]
    NOT?: RealEstateScalarWhereInput | RealEstateScalarWhereInput[]
    id?: IntFilter<"RealEstate"> | number
    userAddressId?: IntFilter<"RealEstate"> | number
    realEstateJson?: JsonNullableFilter<"RealEstate">
  }

  export type StepResultUpsertWithWhereUniqueWithoutUserAddressInput = {
    where: StepResultWhereUniqueInput
    update: XOR<StepResultUpdateWithoutUserAddressInput, StepResultUncheckedUpdateWithoutUserAddressInput>
    create: XOR<StepResultCreateWithoutUserAddressInput, StepResultUncheckedCreateWithoutUserAddressInput>
  }

  export type StepResultUpdateWithWhereUniqueWithoutUserAddressInput = {
    where: StepResultWhereUniqueInput
    data: XOR<StepResultUpdateWithoutUserAddressInput, StepResultUncheckedUpdateWithoutUserAddressInput>
  }

  export type StepResultUpdateManyWithWhereWithoutUserAddressInput = {
    where: StepResultScalarWhereInput
    data: XOR<StepResultUpdateManyMutationInput, StepResultUncheckedUpdateManyWithoutUserAddressInput>
  }

  export type StepResultScalarWhereInput = {
    AND?: StepResultScalarWhereInput | StepResultScalarWhereInput[]
    OR?: StepResultScalarWhereInput[]
    NOT?: StepResultScalarWhereInput | StepResultScalarWhereInput[]
    id?: IntFilter<"StepResult"> | number
    userAddressId?: IntFilter<"StepResult"> | number
    stepId?: IntFilter<"StepResult"> | number
    mismatch?: IntNullableFilter<"StepResult"> | number | null
    match?: IntNullableFilter<"StepResult"> | number | null
    unchecked?: IntNullableFilter<"StepResult"> | number | null
    createdAt?: DateTimeFilter<"StepResult"> | Date | string
  }

  export type UserAddressCreateWithoutRealEstatesInput = {
    isPrimary?: boolean | null
    createdAt?: Date | string
    nickname?: string | null
    user: UserCreateNestedOneWithoutUserAddressesInput
    address: AddressCreateNestedOneWithoutUserAddressesInput
    stepResults?: StepResultCreateNestedManyWithoutUserAddressInput
  }

  export type UserAddressUncheckedCreateWithoutRealEstatesInput = {
    id?: number
    userId: string
    addressId: number
    isPrimary?: boolean | null
    createdAt?: Date | string
    nickname?: string | null
    stepResults?: StepResultUncheckedCreateNestedManyWithoutUserAddressInput
  }

  export type UserAddressCreateOrConnectWithoutRealEstatesInput = {
    where: UserAddressWhereUniqueInput
    create: XOR<UserAddressCreateWithoutRealEstatesInput, UserAddressUncheckedCreateWithoutRealEstatesInput>
  }

  export type UserAddressUpsertWithoutRealEstatesInput = {
    update: XOR<UserAddressUpdateWithoutRealEstatesInput, UserAddressUncheckedUpdateWithoutRealEstatesInput>
    create: XOR<UserAddressCreateWithoutRealEstatesInput, UserAddressUncheckedCreateWithoutRealEstatesInput>
    where?: UserAddressWhereInput
  }

  export type UserAddressUpdateToOneWithWhereWithoutRealEstatesInput = {
    where?: UserAddressWhereInput
    data: XOR<UserAddressUpdateWithoutRealEstatesInput, UserAddressUncheckedUpdateWithoutRealEstatesInput>
  }

  export type UserAddressUpdateWithoutRealEstatesInput = {
    isPrimary?: NullableBoolFieldUpdateOperationsInput | boolean | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    nickname?: NullableStringFieldUpdateOperationsInput | string | null
    user?: UserUpdateOneRequiredWithoutUserAddressesNestedInput
    address?: AddressUpdateOneRequiredWithoutUserAddressesNestedInput
    stepResults?: StepResultUpdateManyWithoutUserAddressNestedInput
  }

  export type UserAddressUncheckedUpdateWithoutRealEstatesInput = {
    id?: IntFieldUpdateOperationsInput | number
    userId?: StringFieldUpdateOperationsInput | string
    addressId?: IntFieldUpdateOperationsInput | number
    isPrimary?: NullableBoolFieldUpdateOperationsInput | boolean | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    nickname?: NullableStringFieldUpdateOperationsInput | string | null
    stepResults?: StepResultUncheckedUpdateManyWithoutUserAddressNestedInput
  }

  export type StepResultCreateWithoutStepInput = {
    mismatch?: number | null
    match?: number | null
    unchecked?: number | null
    createdAt?: Date | string
    userAddress: UserAddressCreateNestedOneWithoutStepResultsInput
  }

  export type StepResultUncheckedCreateWithoutStepInput = {
    id?: number
    userAddressId: number
    mismatch?: number | null
    match?: number | null
    unchecked?: number | null
    createdAt?: Date | string
  }

  export type StepResultCreateOrConnectWithoutStepInput = {
    where: StepResultWhereUniqueInput
    create: XOR<StepResultCreateWithoutStepInput, StepResultUncheckedCreateWithoutStepInput>
  }

  export type StepResultCreateManyStepInputEnvelope = {
    data: StepResultCreateManyStepInput | StepResultCreateManyStepInput[]
    skipDuplicates?: boolean
  }

  export type StepResultUpsertWithWhereUniqueWithoutStepInput = {
    where: StepResultWhereUniqueInput
    update: XOR<StepResultUpdateWithoutStepInput, StepResultUncheckedUpdateWithoutStepInput>
    create: XOR<StepResultCreateWithoutStepInput, StepResultUncheckedCreateWithoutStepInput>
  }

  export type StepResultUpdateWithWhereUniqueWithoutStepInput = {
    where: StepResultWhereUniqueInput
    data: XOR<StepResultUpdateWithoutStepInput, StepResultUncheckedUpdateWithoutStepInput>
  }

  export type StepResultUpdateManyWithWhereWithoutStepInput = {
    where: StepResultScalarWhereInput
    data: XOR<StepResultUpdateManyMutationInput, StepResultUncheckedUpdateManyWithoutStepInput>
  }

  export type UserAddressCreateWithoutStepResultsInput = {
    isPrimary?: boolean | null
    createdAt?: Date | string
    nickname?: string | null
    user: UserCreateNestedOneWithoutUserAddressesInput
    address: AddressCreateNestedOneWithoutUserAddressesInput
    realEstates?: RealEstateCreateNestedManyWithoutUserAddressInput
  }

  export type UserAddressUncheckedCreateWithoutStepResultsInput = {
    id?: number
    userId: string
    addressId: number
    isPrimary?: boolean | null
    createdAt?: Date | string
    nickname?: string | null
    realEstates?: RealEstateUncheckedCreateNestedManyWithoutUserAddressInput
  }

  export type UserAddressCreateOrConnectWithoutStepResultsInput = {
    where: UserAddressWhereUniqueInput
    create: XOR<UserAddressCreateWithoutStepResultsInput, UserAddressUncheckedCreateWithoutStepResultsInput>
  }

  export type StepCreateWithoutStepResultsInput = {
    mainNum: number
    subNum: number
  }

  export type StepUncheckedCreateWithoutStepResultsInput = {
    id?: number
    mainNum: number
    subNum: number
  }

  export type StepCreateOrConnectWithoutStepResultsInput = {
    where: StepWhereUniqueInput
    create: XOR<StepCreateWithoutStepResultsInput, StepUncheckedCreateWithoutStepResultsInput>
  }

  export type UserAddressUpsertWithoutStepResultsInput = {
    update: XOR<UserAddressUpdateWithoutStepResultsInput, UserAddressUncheckedUpdateWithoutStepResultsInput>
    create: XOR<UserAddressCreateWithoutStepResultsInput, UserAddressUncheckedCreateWithoutStepResultsInput>
    where?: UserAddressWhereInput
  }

  export type UserAddressUpdateToOneWithWhereWithoutStepResultsInput = {
    where?: UserAddressWhereInput
    data: XOR<UserAddressUpdateWithoutStepResultsInput, UserAddressUncheckedUpdateWithoutStepResultsInput>
  }

  export type UserAddressUpdateWithoutStepResultsInput = {
    isPrimary?: NullableBoolFieldUpdateOperationsInput | boolean | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    nickname?: NullableStringFieldUpdateOperationsInput | string | null
    user?: UserUpdateOneRequiredWithoutUserAddressesNestedInput
    address?: AddressUpdateOneRequiredWithoutUserAddressesNestedInput
    realEstates?: RealEstateUpdateManyWithoutUserAddressNestedInput
  }

  export type UserAddressUncheckedUpdateWithoutStepResultsInput = {
    id?: IntFieldUpdateOperationsInput | number
    userId?: StringFieldUpdateOperationsInput | string
    addressId?: IntFieldUpdateOperationsInput | number
    isPrimary?: NullableBoolFieldUpdateOperationsInput | boolean | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    nickname?: NullableStringFieldUpdateOperationsInput | string | null
    realEstates?: RealEstateUncheckedUpdateManyWithoutUserAddressNestedInput
  }

  export type StepUpsertWithoutStepResultsInput = {
    update: XOR<StepUpdateWithoutStepResultsInput, StepUncheckedUpdateWithoutStepResultsInput>
    create: XOR<StepCreateWithoutStepResultsInput, StepUncheckedCreateWithoutStepResultsInput>
    where?: StepWhereInput
  }

  export type StepUpdateToOneWithWhereWithoutStepResultsInput = {
    where?: StepWhereInput
    data: XOR<StepUpdateWithoutStepResultsInput, StepUncheckedUpdateWithoutStepResultsInput>
  }

  export type StepUpdateWithoutStepResultsInput = {
    mainNum?: IntFieldUpdateOperationsInput | number
    subNum?: IntFieldUpdateOperationsInput | number
  }

  export type StepUncheckedUpdateWithoutStepResultsInput = {
    id?: IntFieldUpdateOperationsInput | number
    mainNum?: IntFieldUpdateOperationsInput | number
    subNum?: IntFieldUpdateOperationsInput | number
  }

  export type TaxCertCreateManyUserInput = {
    id?: number
    taxCertJson?: NullableJsonNullValueInput | InputJsonValue
  }

  export type UserAddressCreateManyUserInput = {
    id?: number
    addressId: number
    isPrimary?: boolean | null
    createdAt?: Date | string
    nickname?: string | null
  }

  export type TaxCertUpdateWithoutUserInput = {
    taxCertJson?: NullableJsonNullValueInput | InputJsonValue
  }

  export type TaxCertUncheckedUpdateWithoutUserInput = {
    id?: IntFieldUpdateOperationsInput | number
    taxCertJson?: NullableJsonNullValueInput | InputJsonValue
  }

  export type TaxCertUncheckedUpdateManyWithoutUserInput = {
    id?: IntFieldUpdateOperationsInput | number
    taxCertJson?: NullableJsonNullValueInput | InputJsonValue
  }

  export type UserAddressUpdateWithoutUserInput = {
    isPrimary?: NullableBoolFieldUpdateOperationsInput | boolean | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    nickname?: NullableStringFieldUpdateOperationsInput | string | null
    address?: AddressUpdateOneRequiredWithoutUserAddressesNestedInput
    realEstates?: RealEstateUpdateManyWithoutUserAddressNestedInput
    stepResults?: StepResultUpdateManyWithoutUserAddressNestedInput
  }

  export type UserAddressUncheckedUpdateWithoutUserInput = {
    id?: IntFieldUpdateOperationsInput | number
    addressId?: IntFieldUpdateOperationsInput | number
    isPrimary?: NullableBoolFieldUpdateOperationsInput | boolean | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    nickname?: NullableStringFieldUpdateOperationsInput | string | null
    realEstates?: RealEstateUncheckedUpdateManyWithoutUserAddressNestedInput
    stepResults?: StepResultUncheckedUpdateManyWithoutUserAddressNestedInput
  }

  export type UserAddressUncheckedUpdateManyWithoutUserInput = {
    id?: IntFieldUpdateOperationsInput | number
    addressId?: IntFieldUpdateOperationsInput | number
    isPrimary?: NullableBoolFieldUpdateOperationsInput | boolean | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    nickname?: NullableStringFieldUpdateOperationsInput | string | null
  }

  export type UserAddressCreateManyAddressInput = {
    id?: number
    userId: string
    isPrimary?: boolean | null
    createdAt?: Date | string
    nickname?: string | null
  }

  export type UserAddressUpdateWithoutAddressInput = {
    isPrimary?: NullableBoolFieldUpdateOperationsInput | boolean | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    nickname?: NullableStringFieldUpdateOperationsInput | string | null
    user?: UserUpdateOneRequiredWithoutUserAddressesNestedInput
    realEstates?: RealEstateUpdateManyWithoutUserAddressNestedInput
    stepResults?: StepResultUpdateManyWithoutUserAddressNestedInput
  }

  export type UserAddressUncheckedUpdateWithoutAddressInput = {
    id?: IntFieldUpdateOperationsInput | number
    userId?: StringFieldUpdateOperationsInput | string
    isPrimary?: NullableBoolFieldUpdateOperationsInput | boolean | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    nickname?: NullableStringFieldUpdateOperationsInput | string | null
    realEstates?: RealEstateUncheckedUpdateManyWithoutUserAddressNestedInput
    stepResults?: StepResultUncheckedUpdateManyWithoutUserAddressNestedInput
  }

  export type UserAddressUncheckedUpdateManyWithoutAddressInput = {
    id?: IntFieldUpdateOperationsInput | number
    userId?: StringFieldUpdateOperationsInput | string
    isPrimary?: NullableBoolFieldUpdateOperationsInput | boolean | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    nickname?: NullableStringFieldUpdateOperationsInput | string | null
  }

  export type RealEstateCreateManyUserAddressInput = {
    id?: number
    realEstateJson?: NullableJsonNullValueInput | InputJsonValue
  }

  export type StepResultCreateManyUserAddressInput = {
    id?: number
    stepId: number
    mismatch?: number | null
    match?: number | null
    unchecked?: number | null
    createdAt?: Date | string
  }

  export type RealEstateUpdateWithoutUserAddressInput = {
    realEstateJson?: NullableJsonNullValueInput | InputJsonValue
  }

  export type RealEstateUncheckedUpdateWithoutUserAddressInput = {
    id?: IntFieldUpdateOperationsInput | number
    realEstateJson?: NullableJsonNullValueInput | InputJsonValue
  }

  export type RealEstateUncheckedUpdateManyWithoutUserAddressInput = {
    id?: IntFieldUpdateOperationsInput | number
    realEstateJson?: NullableJsonNullValueInput | InputJsonValue
  }

  export type StepResultUpdateWithoutUserAddressInput = {
    mismatch?: NullableIntFieldUpdateOperationsInput | number | null
    match?: NullableIntFieldUpdateOperationsInput | number | null
    unchecked?: NullableIntFieldUpdateOperationsInput | number | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    step?: StepUpdateOneRequiredWithoutStepResultsNestedInput
  }

  export type StepResultUncheckedUpdateWithoutUserAddressInput = {
    id?: IntFieldUpdateOperationsInput | number
    stepId?: IntFieldUpdateOperationsInput | number
    mismatch?: NullableIntFieldUpdateOperationsInput | number | null
    match?: NullableIntFieldUpdateOperationsInput | number | null
    unchecked?: NullableIntFieldUpdateOperationsInput | number | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type StepResultUncheckedUpdateManyWithoutUserAddressInput = {
    id?: IntFieldUpdateOperationsInput | number
    stepId?: IntFieldUpdateOperationsInput | number
    mismatch?: NullableIntFieldUpdateOperationsInput | number | null
    match?: NullableIntFieldUpdateOperationsInput | number | null
    unchecked?: NullableIntFieldUpdateOperationsInput | number | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type StepResultCreateManyStepInput = {
    id?: number
    userAddressId: number
    mismatch?: number | null
    match?: number | null
    unchecked?: number | null
    createdAt?: Date | string
  }

  export type StepResultUpdateWithoutStepInput = {
    mismatch?: NullableIntFieldUpdateOperationsInput | number | null
    match?: NullableIntFieldUpdateOperationsInput | number | null
    unchecked?: NullableIntFieldUpdateOperationsInput | number | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    userAddress?: UserAddressUpdateOneRequiredWithoutStepResultsNestedInput
  }

  export type StepResultUncheckedUpdateWithoutStepInput = {
    id?: IntFieldUpdateOperationsInput | number
    userAddressId?: IntFieldUpdateOperationsInput | number
    mismatch?: NullableIntFieldUpdateOperationsInput | number | null
    match?: NullableIntFieldUpdateOperationsInput | number | null
    unchecked?: NullableIntFieldUpdateOperationsInput | number | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type StepResultUncheckedUpdateManyWithoutStepInput = {
    id?: IntFieldUpdateOperationsInput | number
    userAddressId?: IntFieldUpdateOperationsInput | number
    mismatch?: NullableIntFieldUpdateOperationsInput | number | null
    match?: NullableIntFieldUpdateOperationsInput | number | null
    unchecked?: NullableIntFieldUpdateOperationsInput | number | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }



  /**
   * Batch Payload for updateMany & deleteMany & createMany
   */

  export type BatchPayload = {
    count: number
  }

  /**
   * DMMF
   */
  export const dmmf: runtime.BaseDMMF
}