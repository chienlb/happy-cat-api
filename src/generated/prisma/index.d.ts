
/**
 * Client
**/

import * as runtime from './runtime/client.js';
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
 * Model Token
 * 
 */
export type Token = $Result.DefaultSelection<Prisma.$TokenPayload>
/**
 * Model Unit
 * 
 */
export type Unit = $Result.DefaultSelection<Prisma.$UnitPayload>

/**
 * Enums
 */
export namespace $Enums {
  export const UserStatus: {
  ACTIVE: 'ACTIVE',
  INACTIVE: 'INACTIVE',
  PENDING: 'PENDING',
  BLOCKED: 'BLOCKED',
  DELETED: 'DELETED'
};

export type UserStatus = (typeof UserStatus)[keyof typeof UserStatus]


export const UserTypeAccount: {
  EMAIL: 'EMAIL',
  GOOGLE: 'GOOGLE',
  FACEBOOK: 'FACEBOOK',
  OTHER: 'OTHER'
};

export type UserTypeAccount = (typeof UserTypeAccount)[keyof typeof UserTypeAccount]


export const UserGender: {
  MALE: 'MALE',
  FEMALE: 'FEMALE',
  OTHER: 'OTHER'
};

export type UserGender = (typeof UserGender)[keyof typeof UserGender]


export const UserLanguage: {
  VI: 'VI',
  EN: 'EN'
};

export type UserLanguage = (typeof UserLanguage)[keyof typeof UserLanguage]


export const UserTheme: {
  LIGHT: 'LIGHT',
  DARK: 'DARK'
};

export type UserTheme = (typeof UserTheme)[keyof typeof UserTheme]


export const UserFont: {
  DEFAULT: 'DEFAULT',
  SERIF: 'SERIF',
  SANS_SERIF: 'SANS_SERIF'
};

export type UserFont = (typeof UserFont)[keyof typeof UserFont]


export const UserCurrency: {
  VND: 'VND',
  USD: 'USD',
  EUR: 'EUR',
  JPY: 'JPY'
};

export type UserCurrency = (typeof UserCurrency)[keyof typeof UserCurrency]


export const PackageType: {
  FREE: 'FREE',
  STANDARD: 'STANDARD',
  PREMIUM: 'PREMIUM',
  VIP: 'VIP'
};

export type PackageType = (typeof PackageType)[keyof typeof PackageType]


export const UserRole: {
  ADMIN: 'ADMIN',
  TEACHER: 'TEACHER',
  STUDENT: 'STUDENT',
  PARENT: 'PARENT'
};

export type UserRole = (typeof UserRole)[keyof typeof UserRole]


export const UnitStatus: {
  ACTIVE: 'ACTIVE',
  INACTIVE: 'INACTIVE',
  DELETE: 'DELETE'
};

export type UnitStatus = (typeof UnitStatus)[keyof typeof UnitStatus]


export const UnitDifficulty: {
  EASY: 'EASY',
  MEDIUM: 'MEDIUM',
  HARD: 'HARD'
};

export type UnitDifficulty = (typeof UnitDifficulty)[keyof typeof UnitDifficulty]

}

export type UserStatus = $Enums.UserStatus

export const UserStatus: typeof $Enums.UserStatus

export type UserTypeAccount = $Enums.UserTypeAccount

export const UserTypeAccount: typeof $Enums.UserTypeAccount

export type UserGender = $Enums.UserGender

export const UserGender: typeof $Enums.UserGender

export type UserLanguage = $Enums.UserLanguage

export const UserLanguage: typeof $Enums.UserLanguage

export type UserTheme = $Enums.UserTheme

export const UserTheme: typeof $Enums.UserTheme

export type UserFont = $Enums.UserFont

export const UserFont: typeof $Enums.UserFont

export type UserCurrency = $Enums.UserCurrency

export const UserCurrency: typeof $Enums.UserCurrency

export type PackageType = $Enums.PackageType

export const PackageType: typeof $Enums.PackageType

export type UserRole = $Enums.UserRole

export const UserRole: typeof $Enums.UserRole

export type UnitStatus = $Enums.UnitStatus

export const UnitStatus: typeof $Enums.UnitStatus

export type UnitDifficulty = $Enums.UnitDifficulty

export const UnitDifficulty: typeof $Enums.UnitDifficulty

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
 * Read more in our [docs](https://pris.ly/d/client).
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
   * Read more in our [docs](https://pris.ly/d/client).
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
   * Executes a prepared raw query and returns the number of affected rows.
   * @example
   * ```
   * const result = await prisma.$executeRaw`UPDATE User SET cool = ${true} WHERE email = ${'user@email.com'};`
   * ```
   *
   * Read more in our [docs](https://pris.ly/d/raw-queries).
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
   * Read more in our [docs](https://pris.ly/d/raw-queries).
   */
  $executeRawUnsafe<T = unknown>(query: string, ...values: any[]): Prisma.PrismaPromise<number>;

  /**
   * Performs a prepared raw query and returns the `SELECT` data.
   * @example
   * ```
   * const result = await prisma.$queryRaw`SELECT * FROM User WHERE id = ${1} OR email = ${'user@email.com'};`
   * ```
   *
   * Read more in our [docs](https://pris.ly/d/raw-queries).
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
   * Read more in our [docs](https://pris.ly/d/raw-queries).
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
   * `prisma.token`: Exposes CRUD operations for the **Token** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more Tokens
    * const tokens = await prisma.token.findMany()
    * ```
    */
  get token(): Prisma.TokenDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.unit`: Exposes CRUD operations for the **Unit** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more Units
    * const units = await prisma.unit.findMany()
    * ```
    */
  get unit(): Prisma.UnitDelegate<ExtArgs, ClientOptions>;
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
  * Extensions
  */
  export import Extension = $Extensions.UserArgs
  export import getExtensionContext = runtime.Extensions.getExtensionContext
  export import Args = $Public.Args
  export import Payload = $Public.Payload
  export import Result = $Public.Result
  export import Exact = $Public.Exact

  /**
   * Prisma Client JS version: 7.3.0
   * Query Engine version: 9d6ad21cbbceab97458517b147a6a09ff43aa735
   */
  export type PrismaVersion = {
    client: string
    engine: string
  }

  export const prismaVersion: PrismaVersion

  /**
   * Utility Types
   */


  export import Bytes = runtime.Bytes
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
    Token: 'Token',
    Unit: 'Unit'
  };

  export type ModelName = (typeof ModelName)[keyof typeof ModelName]



  interface TypeMapCb<ClientOptions = {}> extends $Utils.Fn<{extArgs: $Extensions.InternalArgs }, $Utils.Record<string, any>> {
    returns: Prisma.TypeMap<this['params']['extArgs'], ClientOptions extends { omit: infer OmitOptions } ? OmitOptions : {}>
  }

  export type TypeMap<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> = {
    globalOmitOptions: {
      omit: GlobalOmitOptions
    }
    meta: {
      modelProps: "user" | "token" | "unit"
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
      Token: {
        payload: Prisma.$TokenPayload<ExtArgs>
        fields: Prisma.TokenFieldRefs
        operations: {
          findUnique: {
            args: Prisma.TokenFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TokenPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.TokenFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TokenPayload>
          }
          findFirst: {
            args: Prisma.TokenFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TokenPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.TokenFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TokenPayload>
          }
          findMany: {
            args: Prisma.TokenFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TokenPayload>[]
          }
          create: {
            args: Prisma.TokenCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TokenPayload>
          }
          createMany: {
            args: Prisma.TokenCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.TokenCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TokenPayload>[]
          }
          delete: {
            args: Prisma.TokenDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TokenPayload>
          }
          update: {
            args: Prisma.TokenUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TokenPayload>
          }
          deleteMany: {
            args: Prisma.TokenDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.TokenUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.TokenUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TokenPayload>[]
          }
          upsert: {
            args: Prisma.TokenUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TokenPayload>
          }
          aggregate: {
            args: Prisma.TokenAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateToken>
          }
          groupBy: {
            args: Prisma.TokenGroupByArgs<ExtArgs>
            result: $Utils.Optional<TokenGroupByOutputType>[]
          }
          count: {
            args: Prisma.TokenCountArgs<ExtArgs>
            result: $Utils.Optional<TokenCountAggregateOutputType> | number
          }
        }
      }
      Unit: {
        payload: Prisma.$UnitPayload<ExtArgs>
        fields: Prisma.UnitFieldRefs
        operations: {
          findUnique: {
            args: Prisma.UnitFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UnitPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.UnitFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UnitPayload>
          }
          findFirst: {
            args: Prisma.UnitFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UnitPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.UnitFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UnitPayload>
          }
          findMany: {
            args: Prisma.UnitFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UnitPayload>[]
          }
          create: {
            args: Prisma.UnitCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UnitPayload>
          }
          createMany: {
            args: Prisma.UnitCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.UnitCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UnitPayload>[]
          }
          delete: {
            args: Prisma.UnitDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UnitPayload>
          }
          update: {
            args: Prisma.UnitUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UnitPayload>
          }
          deleteMany: {
            args: Prisma.UnitDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.UnitUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.UnitUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UnitPayload>[]
          }
          upsert: {
            args: Prisma.UnitUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UnitPayload>
          }
          aggregate: {
            args: Prisma.UnitAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateUnit>
          }
          groupBy: {
            args: Prisma.UnitGroupByArgs<ExtArgs>
            result: $Utils.Optional<UnitGroupByOutputType>[]
          }
          count: {
            args: Prisma.UnitCountArgs<ExtArgs>
            result: $Utils.Optional<UnitCountAggregateOutputType> | number
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
     * Read more in our [docs](https://pris.ly/d/logging).
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
     * Instance of a Driver Adapter, e.g., like one provided by `@prisma/adapter-planetscale`
     */
    adapter?: runtime.SqlDriverAdapterFactory
    /**
     * Prisma Accelerate URL allowing the client to connect through Accelerate instead of a direct database.
     */
    accelerateUrl?: string
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
    /**
     * SQL commenter plugins that add metadata to SQL queries as comments.
     * Comments follow the sqlcommenter format: https://google.github.io/sqlcommenter/
     * 
     * @example
     * ```
     * const prisma = new PrismaClient({
     *   adapter,
     *   comments: [
     *     traceContext(),
     *     queryInsights(),
     *   ],
     * })
     * ```
     */
    comments?: runtime.SqlCommenterPlugin[]
  }
  export type GlobalOmitConfig = {
    user?: UserOmit
    token?: TokenOmit
    unit?: UnitOmit
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
    token: number
  }

  export type UserCountOutputTypeSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    token?: boolean | UserCountOutputTypeCountTokenArgs
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
  export type UserCountOutputTypeCountTokenArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: TokenWhereInput
  }


  /**
   * Models
   */

  /**
   * Model User
   */

  export type AggregateUser = {
    _count: UserCountAggregateOutputType | null
    _avg: UserAvgAggregateOutputType | null
    _sum: UserSumAggregateOutputType | null
    _min: UserMinAggregateOutputType | null
    _max: UserMaxAggregateOutputType | null
  }

  export type UserAvgAggregateOutputType = {
    exp: number | null
    streakDays: number | null
    progressLevel: number | null
    totalLessonsCompleted: number | null
  }

  export type UserSumAggregateOutputType = {
    exp: number | null
    streakDays: number | null
    progressLevel: number | null
    totalLessonsCompleted: number | null
  }

  export type UserMinAggregateOutputType = {
    id: string | null
    fullname: string | null
    username: string | null
    email: string | null
    password: string | null
    birthDate: Date | null
    role: $Enums.UserRole | null
    slug: string | null
    avatar: string | null
    cover: string | null
    phone: string | null
    gender: $Enums.UserGender | null
    language: $Enums.UserLanguage | null
    province: string | null
    parentId: string | null
    teacherId: string | null
    typeAccount: $Enums.UserTypeAccount | null
    googleId: string | null
    facebookId: string | null
    accountPackage: $Enums.PackageType | null
    isVerify: boolean | null
    codeVerify: string | null
    tokenVerify: string | null
    refCode: string | null
    invitedById: string | null
    exp: number | null
    streakDays: number | null
    progressLevel: number | null
    totalLessonsCompleted: number | null
    theme: $Enums.UserTheme | null
    currency: $Enums.UserCurrency | null
    enableNotifications: boolean | null
    enableNotificationEmails: boolean | null
    status: $Enums.UserStatus | null
    lastLoginAt: Date | null
    createdById: string | null
    updatedById: string | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type UserMaxAggregateOutputType = {
    id: string | null
    fullname: string | null
    username: string | null
    email: string | null
    password: string | null
    birthDate: Date | null
    role: $Enums.UserRole | null
    slug: string | null
    avatar: string | null
    cover: string | null
    phone: string | null
    gender: $Enums.UserGender | null
    language: $Enums.UserLanguage | null
    province: string | null
    parentId: string | null
    teacherId: string | null
    typeAccount: $Enums.UserTypeAccount | null
    googleId: string | null
    facebookId: string | null
    accountPackage: $Enums.PackageType | null
    isVerify: boolean | null
    codeVerify: string | null
    tokenVerify: string | null
    refCode: string | null
    invitedById: string | null
    exp: number | null
    streakDays: number | null
    progressLevel: number | null
    totalLessonsCompleted: number | null
    theme: $Enums.UserTheme | null
    currency: $Enums.UserCurrency | null
    enableNotifications: boolean | null
    enableNotificationEmails: boolean | null
    status: $Enums.UserStatus | null
    lastLoginAt: Date | null
    createdById: string | null
    updatedById: string | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type UserCountAggregateOutputType = {
    id: number
    fullname: number
    username: number
    email: number
    password: number
    birthDate: number
    role: number
    slug: number
    avatar: number
    cover: number
    phone: number
    gender: number
    language: number
    province: number
    parentId: number
    teacherId: number
    typeAccount: number
    googleId: number
    facebookId: number
    accountPackage: number
    isVerify: number
    codeVerify: number
    tokenVerify: number
    refCode: number
    invitedById: number
    exp: number
    streakDays: number
    progressLevel: number
    totalLessonsCompleted: number
    theme: number
    currency: number
    enableNotifications: number
    enableNotificationEmails: number
    status: number
    lastLoginAt: number
    createdById: number
    updatedById: number
    createdAt: number
    updatedAt: number
    _all: number
  }


  export type UserAvgAggregateInputType = {
    exp?: true
    streakDays?: true
    progressLevel?: true
    totalLessonsCompleted?: true
  }

  export type UserSumAggregateInputType = {
    exp?: true
    streakDays?: true
    progressLevel?: true
    totalLessonsCompleted?: true
  }

  export type UserMinAggregateInputType = {
    id?: true
    fullname?: true
    username?: true
    email?: true
    password?: true
    birthDate?: true
    role?: true
    slug?: true
    avatar?: true
    cover?: true
    phone?: true
    gender?: true
    language?: true
    province?: true
    parentId?: true
    teacherId?: true
    typeAccount?: true
    googleId?: true
    facebookId?: true
    accountPackage?: true
    isVerify?: true
    codeVerify?: true
    tokenVerify?: true
    refCode?: true
    invitedById?: true
    exp?: true
    streakDays?: true
    progressLevel?: true
    totalLessonsCompleted?: true
    theme?: true
    currency?: true
    enableNotifications?: true
    enableNotificationEmails?: true
    status?: true
    lastLoginAt?: true
    createdById?: true
    updatedById?: true
    createdAt?: true
    updatedAt?: true
  }

  export type UserMaxAggregateInputType = {
    id?: true
    fullname?: true
    username?: true
    email?: true
    password?: true
    birthDate?: true
    role?: true
    slug?: true
    avatar?: true
    cover?: true
    phone?: true
    gender?: true
    language?: true
    province?: true
    parentId?: true
    teacherId?: true
    typeAccount?: true
    googleId?: true
    facebookId?: true
    accountPackage?: true
    isVerify?: true
    codeVerify?: true
    tokenVerify?: true
    refCode?: true
    invitedById?: true
    exp?: true
    streakDays?: true
    progressLevel?: true
    totalLessonsCompleted?: true
    theme?: true
    currency?: true
    enableNotifications?: true
    enableNotificationEmails?: true
    status?: true
    lastLoginAt?: true
    createdById?: true
    updatedById?: true
    createdAt?: true
    updatedAt?: true
  }

  export type UserCountAggregateInputType = {
    id?: true
    fullname?: true
    username?: true
    email?: true
    password?: true
    birthDate?: true
    role?: true
    slug?: true
    avatar?: true
    cover?: true
    phone?: true
    gender?: true
    language?: true
    province?: true
    parentId?: true
    teacherId?: true
    typeAccount?: true
    googleId?: true
    facebookId?: true
    accountPackage?: true
    isVerify?: true
    codeVerify?: true
    tokenVerify?: true
    refCode?: true
    invitedById?: true
    exp?: true
    streakDays?: true
    progressLevel?: true
    totalLessonsCompleted?: true
    theme?: true
    currency?: true
    enableNotifications?: true
    enableNotificationEmails?: true
    status?: true
    lastLoginAt?: true
    createdById?: true
    updatedById?: true
    createdAt?: true
    updatedAt?: true
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
     * Select which fields to average
    **/
    _avg?: UserAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: UserSumAggregateInputType
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
    _avg?: UserAvgAggregateInputType
    _sum?: UserSumAggregateInputType
    _min?: UserMinAggregateInputType
    _max?: UserMaxAggregateInputType
  }

  export type UserGroupByOutputType = {
    id: string
    fullname: string
    username: string
    email: string
    password: string
    birthDate: Date | null
    role: $Enums.UserRole
    slug: string
    avatar: string | null
    cover: string | null
    phone: string
    gender: $Enums.UserGender
    language: $Enums.UserLanguage | null
    province: string | null
    parentId: string | null
    teacherId: string | null
    typeAccount: $Enums.UserTypeAccount
    googleId: string | null
    facebookId: string | null
    accountPackage: $Enums.PackageType
    isVerify: boolean
    codeVerify: string | null
    tokenVerify: string | null
    refCode: string | null
    invitedById: string | null
    exp: number | null
    streakDays: number | null
    progressLevel: number | null
    totalLessonsCompleted: number | null
    theme: $Enums.UserTheme | null
    currency: $Enums.UserCurrency | null
    enableNotifications: boolean | null
    enableNotificationEmails: boolean | null
    status: $Enums.UserStatus
    lastLoginAt: Date | null
    createdById: string | null
    updatedById: string | null
    createdAt: Date
    updatedAt: Date
    _count: UserCountAggregateOutputType | null
    _avg: UserAvgAggregateOutputType | null
    _sum: UserSumAggregateOutputType | null
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
    fullname?: boolean
    username?: boolean
    email?: boolean
    password?: boolean
    birthDate?: boolean
    role?: boolean
    slug?: boolean
    avatar?: boolean
    cover?: boolean
    phone?: boolean
    gender?: boolean
    language?: boolean
    province?: boolean
    parentId?: boolean
    teacherId?: boolean
    typeAccount?: boolean
    googleId?: boolean
    facebookId?: boolean
    accountPackage?: boolean
    isVerify?: boolean
    codeVerify?: boolean
    tokenVerify?: boolean
    refCode?: boolean
    invitedById?: boolean
    exp?: boolean
    streakDays?: boolean
    progressLevel?: boolean
    totalLessonsCompleted?: boolean
    theme?: boolean
    currency?: boolean
    enableNotifications?: boolean
    enableNotificationEmails?: boolean
    status?: boolean
    lastLoginAt?: boolean
    createdById?: boolean
    updatedById?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    token?: boolean | User$tokenArgs<ExtArgs>
    _count?: boolean | UserCountOutputTypeDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["user"]>

  export type UserSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    fullname?: boolean
    username?: boolean
    email?: boolean
    password?: boolean
    birthDate?: boolean
    role?: boolean
    slug?: boolean
    avatar?: boolean
    cover?: boolean
    phone?: boolean
    gender?: boolean
    language?: boolean
    province?: boolean
    parentId?: boolean
    teacherId?: boolean
    typeAccount?: boolean
    googleId?: boolean
    facebookId?: boolean
    accountPackage?: boolean
    isVerify?: boolean
    codeVerify?: boolean
    tokenVerify?: boolean
    refCode?: boolean
    invitedById?: boolean
    exp?: boolean
    streakDays?: boolean
    progressLevel?: boolean
    totalLessonsCompleted?: boolean
    theme?: boolean
    currency?: boolean
    enableNotifications?: boolean
    enableNotificationEmails?: boolean
    status?: boolean
    lastLoginAt?: boolean
    createdById?: boolean
    updatedById?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }, ExtArgs["result"]["user"]>

  export type UserSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    fullname?: boolean
    username?: boolean
    email?: boolean
    password?: boolean
    birthDate?: boolean
    role?: boolean
    slug?: boolean
    avatar?: boolean
    cover?: boolean
    phone?: boolean
    gender?: boolean
    language?: boolean
    province?: boolean
    parentId?: boolean
    teacherId?: boolean
    typeAccount?: boolean
    googleId?: boolean
    facebookId?: boolean
    accountPackage?: boolean
    isVerify?: boolean
    codeVerify?: boolean
    tokenVerify?: boolean
    refCode?: boolean
    invitedById?: boolean
    exp?: boolean
    streakDays?: boolean
    progressLevel?: boolean
    totalLessonsCompleted?: boolean
    theme?: boolean
    currency?: boolean
    enableNotifications?: boolean
    enableNotificationEmails?: boolean
    status?: boolean
    lastLoginAt?: boolean
    createdById?: boolean
    updatedById?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }, ExtArgs["result"]["user"]>

  export type UserSelectScalar = {
    id?: boolean
    fullname?: boolean
    username?: boolean
    email?: boolean
    password?: boolean
    birthDate?: boolean
    role?: boolean
    slug?: boolean
    avatar?: boolean
    cover?: boolean
    phone?: boolean
    gender?: boolean
    language?: boolean
    province?: boolean
    parentId?: boolean
    teacherId?: boolean
    typeAccount?: boolean
    googleId?: boolean
    facebookId?: boolean
    accountPackage?: boolean
    isVerify?: boolean
    codeVerify?: boolean
    tokenVerify?: boolean
    refCode?: boolean
    invitedById?: boolean
    exp?: boolean
    streakDays?: boolean
    progressLevel?: boolean
    totalLessonsCompleted?: boolean
    theme?: boolean
    currency?: boolean
    enableNotifications?: boolean
    enableNotificationEmails?: boolean
    status?: boolean
    lastLoginAt?: boolean
    createdById?: boolean
    updatedById?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }

  export type UserOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "fullname" | "username" | "email" | "password" | "birthDate" | "role" | "slug" | "avatar" | "cover" | "phone" | "gender" | "language" | "province" | "parentId" | "teacherId" | "typeAccount" | "googleId" | "facebookId" | "accountPackage" | "isVerify" | "codeVerify" | "tokenVerify" | "refCode" | "invitedById" | "exp" | "streakDays" | "progressLevel" | "totalLessonsCompleted" | "theme" | "currency" | "enableNotifications" | "enableNotificationEmails" | "status" | "lastLoginAt" | "createdById" | "updatedById" | "createdAt" | "updatedAt", ExtArgs["result"]["user"]>
  export type UserInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    token?: boolean | User$tokenArgs<ExtArgs>
    _count?: boolean | UserCountOutputTypeDefaultArgs<ExtArgs>
  }
  export type UserIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {}
  export type UserIncludeUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {}

  export type $UserPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "User"
    objects: {
      token: Prisma.$TokenPayload<ExtArgs>[]
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      fullname: string
      username: string
      email: string
      password: string
      birthDate: Date | null
      role: $Enums.UserRole
      slug: string
      avatar: string | null
      cover: string | null
      phone: string
      gender: $Enums.UserGender
      language: $Enums.UserLanguage | null
      province: string | null
      parentId: string | null
      teacherId: string | null
      typeAccount: $Enums.UserTypeAccount
      googleId: string | null
      facebookId: string | null
      accountPackage: $Enums.PackageType
      isVerify: boolean
      codeVerify: string | null
      tokenVerify: string | null
      refCode: string | null
      invitedById: string | null
      exp: number | null
      streakDays: number | null
      progressLevel: number | null
      totalLessonsCompleted: number | null
      theme: $Enums.UserTheme | null
      currency: $Enums.UserCurrency | null
      enableNotifications: boolean | null
      enableNotificationEmails: boolean | null
      status: $Enums.UserStatus
      lastLoginAt: Date | null
      createdById: string | null
      updatedById: string | null
      createdAt: Date
      updatedAt: Date
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
    token<T extends User$tokenArgs<ExtArgs> = {}>(args?: Subset<T, User$tokenArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$TokenPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
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
    readonly fullname: FieldRef<"User", 'String'>
    readonly username: FieldRef<"User", 'String'>
    readonly email: FieldRef<"User", 'String'>
    readonly password: FieldRef<"User", 'String'>
    readonly birthDate: FieldRef<"User", 'DateTime'>
    readonly role: FieldRef<"User", 'UserRole'>
    readonly slug: FieldRef<"User", 'String'>
    readonly avatar: FieldRef<"User", 'String'>
    readonly cover: FieldRef<"User", 'String'>
    readonly phone: FieldRef<"User", 'String'>
    readonly gender: FieldRef<"User", 'UserGender'>
    readonly language: FieldRef<"User", 'UserLanguage'>
    readonly province: FieldRef<"User", 'String'>
    readonly parentId: FieldRef<"User", 'String'>
    readonly teacherId: FieldRef<"User", 'String'>
    readonly typeAccount: FieldRef<"User", 'UserTypeAccount'>
    readonly googleId: FieldRef<"User", 'String'>
    readonly facebookId: FieldRef<"User", 'String'>
    readonly accountPackage: FieldRef<"User", 'PackageType'>
    readonly isVerify: FieldRef<"User", 'Boolean'>
    readonly codeVerify: FieldRef<"User", 'String'>
    readonly tokenVerify: FieldRef<"User", 'String'>
    readonly refCode: FieldRef<"User", 'String'>
    readonly invitedById: FieldRef<"User", 'String'>
    readonly exp: FieldRef<"User", 'Int'>
    readonly streakDays: FieldRef<"User", 'Int'>
    readonly progressLevel: FieldRef<"User", 'Int'>
    readonly totalLessonsCompleted: FieldRef<"User", 'Int'>
    readonly theme: FieldRef<"User", 'UserTheme'>
    readonly currency: FieldRef<"User", 'UserCurrency'>
    readonly enableNotifications: FieldRef<"User", 'Boolean'>
    readonly enableNotificationEmails: FieldRef<"User", 'Boolean'>
    readonly status: FieldRef<"User", 'UserStatus'>
    readonly lastLoginAt: FieldRef<"User", 'DateTime'>
    readonly createdById: FieldRef<"User", 'String'>
    readonly updatedById: FieldRef<"User", 'String'>
    readonly createdAt: FieldRef<"User", 'DateTime'>
    readonly updatedAt: FieldRef<"User", 'DateTime'>
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
    data: XOR<UserCreateInput, UserUncheckedCreateInput>
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
   * User.token
   */
  export type User$tokenArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Token
     */
    select?: TokenSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Token
     */
    omit?: TokenOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TokenInclude<ExtArgs> | null
    where?: TokenWhereInput
    orderBy?: TokenOrderByWithRelationInput | TokenOrderByWithRelationInput[]
    cursor?: TokenWhereUniqueInput
    take?: number
    skip?: number
    distinct?: TokenScalarFieldEnum | TokenScalarFieldEnum[]
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
   * Model Token
   */

  export type AggregateToken = {
    _count: TokenCountAggregateOutputType | null
    _min: TokenMinAggregateOutputType | null
    _max: TokenMaxAggregateOutputType | null
  }

  export type TokenMinAggregateOutputType = {
    id: string | null
    userId: string | null
    token: string | null
    deviceId: string | null
    isDeleted: boolean | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type TokenMaxAggregateOutputType = {
    id: string | null
    userId: string | null
    token: string | null
    deviceId: string | null
    isDeleted: boolean | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type TokenCountAggregateOutputType = {
    id: number
    userId: number
    token: number
    deviceId: number
    isDeleted: number
    createdAt: number
    updatedAt: number
    _all: number
  }


  export type TokenMinAggregateInputType = {
    id?: true
    userId?: true
    token?: true
    deviceId?: true
    isDeleted?: true
    createdAt?: true
    updatedAt?: true
  }

  export type TokenMaxAggregateInputType = {
    id?: true
    userId?: true
    token?: true
    deviceId?: true
    isDeleted?: true
    createdAt?: true
    updatedAt?: true
  }

  export type TokenCountAggregateInputType = {
    id?: true
    userId?: true
    token?: true
    deviceId?: true
    isDeleted?: true
    createdAt?: true
    updatedAt?: true
    _all?: true
  }

  export type TokenAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Token to aggregate.
     */
    where?: TokenWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Tokens to fetch.
     */
    orderBy?: TokenOrderByWithRelationInput | TokenOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: TokenWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Tokens from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Tokens.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned Tokens
    **/
    _count?: true | TokenCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: TokenMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: TokenMaxAggregateInputType
  }

  export type GetTokenAggregateType<T extends TokenAggregateArgs> = {
        [P in keyof T & keyof AggregateToken]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateToken[P]>
      : GetScalarType<T[P], AggregateToken[P]>
  }




  export type TokenGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: TokenWhereInput
    orderBy?: TokenOrderByWithAggregationInput | TokenOrderByWithAggregationInput[]
    by: TokenScalarFieldEnum[] | TokenScalarFieldEnum
    having?: TokenScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: TokenCountAggregateInputType | true
    _min?: TokenMinAggregateInputType
    _max?: TokenMaxAggregateInputType
  }

  export type TokenGroupByOutputType = {
    id: string
    userId: string
    token: string
    deviceId: string
    isDeleted: boolean
    createdAt: Date
    updatedAt: Date
    _count: TokenCountAggregateOutputType | null
    _min: TokenMinAggregateOutputType | null
    _max: TokenMaxAggregateOutputType | null
  }

  type GetTokenGroupByPayload<T extends TokenGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<TokenGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof TokenGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], TokenGroupByOutputType[P]>
            : GetScalarType<T[P], TokenGroupByOutputType[P]>
        }
      >
    >


  export type TokenSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    userId?: boolean
    token?: boolean
    deviceId?: boolean
    isDeleted?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    user?: boolean | UserDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["token"]>

  export type TokenSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    userId?: boolean
    token?: boolean
    deviceId?: boolean
    isDeleted?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    user?: boolean | UserDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["token"]>

  export type TokenSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    userId?: boolean
    token?: boolean
    deviceId?: boolean
    isDeleted?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    user?: boolean | UserDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["token"]>

  export type TokenSelectScalar = {
    id?: boolean
    userId?: boolean
    token?: boolean
    deviceId?: boolean
    isDeleted?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }

  export type TokenOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "userId" | "token" | "deviceId" | "isDeleted" | "createdAt" | "updatedAt", ExtArgs["result"]["token"]>
  export type TokenInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    user?: boolean | UserDefaultArgs<ExtArgs>
  }
  export type TokenIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    user?: boolean | UserDefaultArgs<ExtArgs>
  }
  export type TokenIncludeUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    user?: boolean | UserDefaultArgs<ExtArgs>
  }

  export type $TokenPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "Token"
    objects: {
      user: Prisma.$UserPayload<ExtArgs>
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      userId: string
      token: string
      deviceId: string
      isDeleted: boolean
      createdAt: Date
      updatedAt: Date
    }, ExtArgs["result"]["token"]>
    composites: {}
  }

  type TokenGetPayload<S extends boolean | null | undefined | TokenDefaultArgs> = $Result.GetResult<Prisma.$TokenPayload, S>

  type TokenCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<TokenFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: TokenCountAggregateInputType | true
    }

  export interface TokenDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['Token'], meta: { name: 'Token' } }
    /**
     * Find zero or one Token that matches the filter.
     * @param {TokenFindUniqueArgs} args - Arguments to find a Token
     * @example
     * // Get one Token
     * const token = await prisma.token.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends TokenFindUniqueArgs>(args: SelectSubset<T, TokenFindUniqueArgs<ExtArgs>>): Prisma__TokenClient<$Result.GetResult<Prisma.$TokenPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one Token that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {TokenFindUniqueOrThrowArgs} args - Arguments to find a Token
     * @example
     * // Get one Token
     * const token = await prisma.token.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends TokenFindUniqueOrThrowArgs>(args: SelectSubset<T, TokenFindUniqueOrThrowArgs<ExtArgs>>): Prisma__TokenClient<$Result.GetResult<Prisma.$TokenPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Token that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {TokenFindFirstArgs} args - Arguments to find a Token
     * @example
     * // Get one Token
     * const token = await prisma.token.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends TokenFindFirstArgs>(args?: SelectSubset<T, TokenFindFirstArgs<ExtArgs>>): Prisma__TokenClient<$Result.GetResult<Prisma.$TokenPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Token that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {TokenFindFirstOrThrowArgs} args - Arguments to find a Token
     * @example
     * // Get one Token
     * const token = await prisma.token.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends TokenFindFirstOrThrowArgs>(args?: SelectSubset<T, TokenFindFirstOrThrowArgs<ExtArgs>>): Prisma__TokenClient<$Result.GetResult<Prisma.$TokenPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more Tokens that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {TokenFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all Tokens
     * const tokens = await prisma.token.findMany()
     * 
     * // Get first 10 Tokens
     * const tokens = await prisma.token.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const tokenWithIdOnly = await prisma.token.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends TokenFindManyArgs>(args?: SelectSubset<T, TokenFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$TokenPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a Token.
     * @param {TokenCreateArgs} args - Arguments to create a Token.
     * @example
     * // Create one Token
     * const Token = await prisma.token.create({
     *   data: {
     *     // ... data to create a Token
     *   }
     * })
     * 
     */
    create<T extends TokenCreateArgs>(args: SelectSubset<T, TokenCreateArgs<ExtArgs>>): Prisma__TokenClient<$Result.GetResult<Prisma.$TokenPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many Tokens.
     * @param {TokenCreateManyArgs} args - Arguments to create many Tokens.
     * @example
     * // Create many Tokens
     * const token = await prisma.token.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends TokenCreateManyArgs>(args?: SelectSubset<T, TokenCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many Tokens and returns the data saved in the database.
     * @param {TokenCreateManyAndReturnArgs} args - Arguments to create many Tokens.
     * @example
     * // Create many Tokens
     * const token = await prisma.token.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many Tokens and only return the `id`
     * const tokenWithIdOnly = await prisma.token.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends TokenCreateManyAndReturnArgs>(args?: SelectSubset<T, TokenCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$TokenPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a Token.
     * @param {TokenDeleteArgs} args - Arguments to delete one Token.
     * @example
     * // Delete one Token
     * const Token = await prisma.token.delete({
     *   where: {
     *     // ... filter to delete one Token
     *   }
     * })
     * 
     */
    delete<T extends TokenDeleteArgs>(args: SelectSubset<T, TokenDeleteArgs<ExtArgs>>): Prisma__TokenClient<$Result.GetResult<Prisma.$TokenPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one Token.
     * @param {TokenUpdateArgs} args - Arguments to update one Token.
     * @example
     * // Update one Token
     * const token = await prisma.token.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends TokenUpdateArgs>(args: SelectSubset<T, TokenUpdateArgs<ExtArgs>>): Prisma__TokenClient<$Result.GetResult<Prisma.$TokenPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more Tokens.
     * @param {TokenDeleteManyArgs} args - Arguments to filter Tokens to delete.
     * @example
     * // Delete a few Tokens
     * const { count } = await prisma.token.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends TokenDeleteManyArgs>(args?: SelectSubset<T, TokenDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Tokens.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {TokenUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many Tokens
     * const token = await prisma.token.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends TokenUpdateManyArgs>(args: SelectSubset<T, TokenUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Tokens and returns the data updated in the database.
     * @param {TokenUpdateManyAndReturnArgs} args - Arguments to update many Tokens.
     * @example
     * // Update many Tokens
     * const token = await prisma.token.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more Tokens and only return the `id`
     * const tokenWithIdOnly = await prisma.token.updateManyAndReturn({
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
    updateManyAndReturn<T extends TokenUpdateManyAndReturnArgs>(args: SelectSubset<T, TokenUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$TokenPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one Token.
     * @param {TokenUpsertArgs} args - Arguments to update or create a Token.
     * @example
     * // Update or create a Token
     * const token = await prisma.token.upsert({
     *   create: {
     *     // ... data to create a Token
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the Token we want to update
     *   }
     * })
     */
    upsert<T extends TokenUpsertArgs>(args: SelectSubset<T, TokenUpsertArgs<ExtArgs>>): Prisma__TokenClient<$Result.GetResult<Prisma.$TokenPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of Tokens.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {TokenCountArgs} args - Arguments to filter Tokens to count.
     * @example
     * // Count the number of Tokens
     * const count = await prisma.token.count({
     *   where: {
     *     // ... the filter for the Tokens we want to count
     *   }
     * })
    **/
    count<T extends TokenCountArgs>(
      args?: Subset<T, TokenCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], TokenCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a Token.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {TokenAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
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
    aggregate<T extends TokenAggregateArgs>(args: Subset<T, TokenAggregateArgs>): Prisma.PrismaPromise<GetTokenAggregateType<T>>

    /**
     * Group by Token.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {TokenGroupByArgs} args - Group by arguments.
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
      T extends TokenGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: TokenGroupByArgs['orderBy'] }
        : { orderBy?: TokenGroupByArgs['orderBy'] },
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
    >(args: SubsetIntersection<T, TokenGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetTokenGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the Token model
   */
  readonly fields: TokenFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for Token.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__TokenClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
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
   * Fields of the Token model
   */
  interface TokenFieldRefs {
    readonly id: FieldRef<"Token", 'String'>
    readonly userId: FieldRef<"Token", 'String'>
    readonly token: FieldRef<"Token", 'String'>
    readonly deviceId: FieldRef<"Token", 'String'>
    readonly isDeleted: FieldRef<"Token", 'Boolean'>
    readonly createdAt: FieldRef<"Token", 'DateTime'>
    readonly updatedAt: FieldRef<"Token", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * Token findUnique
   */
  export type TokenFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Token
     */
    select?: TokenSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Token
     */
    omit?: TokenOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TokenInclude<ExtArgs> | null
    /**
     * Filter, which Token to fetch.
     */
    where: TokenWhereUniqueInput
  }

  /**
   * Token findUniqueOrThrow
   */
  export type TokenFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Token
     */
    select?: TokenSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Token
     */
    omit?: TokenOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TokenInclude<ExtArgs> | null
    /**
     * Filter, which Token to fetch.
     */
    where: TokenWhereUniqueInput
  }

  /**
   * Token findFirst
   */
  export type TokenFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Token
     */
    select?: TokenSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Token
     */
    omit?: TokenOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TokenInclude<ExtArgs> | null
    /**
     * Filter, which Token to fetch.
     */
    where?: TokenWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Tokens to fetch.
     */
    orderBy?: TokenOrderByWithRelationInput | TokenOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Tokens.
     */
    cursor?: TokenWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Tokens from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Tokens.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Tokens.
     */
    distinct?: TokenScalarFieldEnum | TokenScalarFieldEnum[]
  }

  /**
   * Token findFirstOrThrow
   */
  export type TokenFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Token
     */
    select?: TokenSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Token
     */
    omit?: TokenOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TokenInclude<ExtArgs> | null
    /**
     * Filter, which Token to fetch.
     */
    where?: TokenWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Tokens to fetch.
     */
    orderBy?: TokenOrderByWithRelationInput | TokenOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Tokens.
     */
    cursor?: TokenWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Tokens from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Tokens.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Tokens.
     */
    distinct?: TokenScalarFieldEnum | TokenScalarFieldEnum[]
  }

  /**
   * Token findMany
   */
  export type TokenFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Token
     */
    select?: TokenSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Token
     */
    omit?: TokenOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TokenInclude<ExtArgs> | null
    /**
     * Filter, which Tokens to fetch.
     */
    where?: TokenWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Tokens to fetch.
     */
    orderBy?: TokenOrderByWithRelationInput | TokenOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing Tokens.
     */
    cursor?: TokenWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Tokens from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Tokens.
     */
    skip?: number
    distinct?: TokenScalarFieldEnum | TokenScalarFieldEnum[]
  }

  /**
   * Token create
   */
  export type TokenCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Token
     */
    select?: TokenSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Token
     */
    omit?: TokenOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TokenInclude<ExtArgs> | null
    /**
     * The data needed to create a Token.
     */
    data: XOR<TokenCreateInput, TokenUncheckedCreateInput>
  }

  /**
   * Token createMany
   */
  export type TokenCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many Tokens.
     */
    data: TokenCreateManyInput | TokenCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * Token createManyAndReturn
   */
  export type TokenCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Token
     */
    select?: TokenSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the Token
     */
    omit?: TokenOmit<ExtArgs> | null
    /**
     * The data used to create many Tokens.
     */
    data: TokenCreateManyInput | TokenCreateManyInput[]
    skipDuplicates?: boolean
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TokenIncludeCreateManyAndReturn<ExtArgs> | null
  }

  /**
   * Token update
   */
  export type TokenUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Token
     */
    select?: TokenSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Token
     */
    omit?: TokenOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TokenInclude<ExtArgs> | null
    /**
     * The data needed to update a Token.
     */
    data: XOR<TokenUpdateInput, TokenUncheckedUpdateInput>
    /**
     * Choose, which Token to update.
     */
    where: TokenWhereUniqueInput
  }

  /**
   * Token updateMany
   */
  export type TokenUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update Tokens.
     */
    data: XOR<TokenUpdateManyMutationInput, TokenUncheckedUpdateManyInput>
    /**
     * Filter which Tokens to update
     */
    where?: TokenWhereInput
    /**
     * Limit how many Tokens to update.
     */
    limit?: number
  }

  /**
   * Token updateManyAndReturn
   */
  export type TokenUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Token
     */
    select?: TokenSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the Token
     */
    omit?: TokenOmit<ExtArgs> | null
    /**
     * The data used to update Tokens.
     */
    data: XOR<TokenUpdateManyMutationInput, TokenUncheckedUpdateManyInput>
    /**
     * Filter which Tokens to update
     */
    where?: TokenWhereInput
    /**
     * Limit how many Tokens to update.
     */
    limit?: number
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TokenIncludeUpdateManyAndReturn<ExtArgs> | null
  }

  /**
   * Token upsert
   */
  export type TokenUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Token
     */
    select?: TokenSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Token
     */
    omit?: TokenOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TokenInclude<ExtArgs> | null
    /**
     * The filter to search for the Token to update in case it exists.
     */
    where: TokenWhereUniqueInput
    /**
     * In case the Token found by the `where` argument doesn't exist, create a new Token with this data.
     */
    create: XOR<TokenCreateInput, TokenUncheckedCreateInput>
    /**
     * In case the Token was found with the provided `where` argument, update it with this data.
     */
    update: XOR<TokenUpdateInput, TokenUncheckedUpdateInput>
  }

  /**
   * Token delete
   */
  export type TokenDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Token
     */
    select?: TokenSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Token
     */
    omit?: TokenOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TokenInclude<ExtArgs> | null
    /**
     * Filter which Token to delete.
     */
    where: TokenWhereUniqueInput
  }

  /**
   * Token deleteMany
   */
  export type TokenDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Tokens to delete
     */
    where?: TokenWhereInput
    /**
     * Limit how many Tokens to delete.
     */
    limit?: number
  }

  /**
   * Token without action
   */
  export type TokenDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Token
     */
    select?: TokenSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Token
     */
    omit?: TokenOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TokenInclude<ExtArgs> | null
  }


  /**
   * Model Unit
   */

  export type AggregateUnit = {
    _count: UnitCountAggregateOutputType | null
    _avg: UnitAvgAggregateOutputType | null
    _sum: UnitSumAggregateOutputType | null
    _min: UnitMinAggregateOutputType | null
    _max: UnitMaxAggregateOutputType | null
  }

  export type UnitAvgAggregateOutputType = {
    orderIndex: number | null
    totalLessons: number | null
    estimatedDuration: number | null
  }

  export type UnitSumAggregateOutputType = {
    orderIndex: number | null
    totalLessons: number | null
    estimatedDuration: number | null
  }

  export type UnitMinAggregateOutputType = {
    id: string | null
    name: string | null
    description: string | null
    topic: string | null
    slug: string | null
    difficulty: $Enums.UnitDifficulty | null
    orderIndex: number | null
    totalLessons: number | null
    estimatedDuration: number | null
    thumbnail: string | null
    banner: string | null
    isActive: $Enums.UnitStatus | null
    createdById: string | null
    updatedById: string | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type UnitMaxAggregateOutputType = {
    id: string | null
    name: string | null
    description: string | null
    topic: string | null
    slug: string | null
    difficulty: $Enums.UnitDifficulty | null
    orderIndex: number | null
    totalLessons: number | null
    estimatedDuration: number | null
    thumbnail: string | null
    banner: string | null
    isActive: $Enums.UnitStatus | null
    createdById: string | null
    updatedById: string | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type UnitCountAggregateOutputType = {
    id: number
    name: number
    description: number
    topic: number
    slug: number
    difficulty: number
    orderIndex: number
    totalLessons: number
    objectives: number
    materials: number
    prerequisites: number
    estimatedDuration: number
    thumbnail: number
    banner: number
    tags: number
    isActive: number
    createdById: number
    updatedById: number
    createdAt: number
    updatedAt: number
    _all: number
  }


  export type UnitAvgAggregateInputType = {
    orderIndex?: true
    totalLessons?: true
    estimatedDuration?: true
  }

  export type UnitSumAggregateInputType = {
    orderIndex?: true
    totalLessons?: true
    estimatedDuration?: true
  }

  export type UnitMinAggregateInputType = {
    id?: true
    name?: true
    description?: true
    topic?: true
    slug?: true
    difficulty?: true
    orderIndex?: true
    totalLessons?: true
    estimatedDuration?: true
    thumbnail?: true
    banner?: true
    isActive?: true
    createdById?: true
    updatedById?: true
    createdAt?: true
    updatedAt?: true
  }

  export type UnitMaxAggregateInputType = {
    id?: true
    name?: true
    description?: true
    topic?: true
    slug?: true
    difficulty?: true
    orderIndex?: true
    totalLessons?: true
    estimatedDuration?: true
    thumbnail?: true
    banner?: true
    isActive?: true
    createdById?: true
    updatedById?: true
    createdAt?: true
    updatedAt?: true
  }

  export type UnitCountAggregateInputType = {
    id?: true
    name?: true
    description?: true
    topic?: true
    slug?: true
    difficulty?: true
    orderIndex?: true
    totalLessons?: true
    objectives?: true
    materials?: true
    prerequisites?: true
    estimatedDuration?: true
    thumbnail?: true
    banner?: true
    tags?: true
    isActive?: true
    createdById?: true
    updatedById?: true
    createdAt?: true
    updatedAt?: true
    _all?: true
  }

  export type UnitAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Unit to aggregate.
     */
    where?: UnitWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Units to fetch.
     */
    orderBy?: UnitOrderByWithRelationInput | UnitOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: UnitWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Units from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Units.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned Units
    **/
    _count?: true | UnitCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: UnitAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: UnitSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: UnitMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: UnitMaxAggregateInputType
  }

  export type GetUnitAggregateType<T extends UnitAggregateArgs> = {
        [P in keyof T & keyof AggregateUnit]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateUnit[P]>
      : GetScalarType<T[P], AggregateUnit[P]>
  }




  export type UnitGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: UnitWhereInput
    orderBy?: UnitOrderByWithAggregationInput | UnitOrderByWithAggregationInput[]
    by: UnitScalarFieldEnum[] | UnitScalarFieldEnum
    having?: UnitScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: UnitCountAggregateInputType | true
    _avg?: UnitAvgAggregateInputType
    _sum?: UnitSumAggregateInputType
    _min?: UnitMinAggregateInputType
    _max?: UnitMaxAggregateInputType
  }

  export type UnitGroupByOutputType = {
    id: string
    name: string
    description: string | null
    topic: string
    slug: string
    difficulty: $Enums.UnitDifficulty
    orderIndex: number
    totalLessons: number
    objectives: string[]
    materials: JsonValue | null
    prerequisites: string[]
    estimatedDuration: number | null
    thumbnail: string | null
    banner: string | null
    tags: string[]
    isActive: $Enums.UnitStatus
    createdById: string
    updatedById: string
    createdAt: Date
    updatedAt: Date
    _count: UnitCountAggregateOutputType | null
    _avg: UnitAvgAggregateOutputType | null
    _sum: UnitSumAggregateOutputType | null
    _min: UnitMinAggregateOutputType | null
    _max: UnitMaxAggregateOutputType | null
  }

  type GetUnitGroupByPayload<T extends UnitGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<UnitGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof UnitGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], UnitGroupByOutputType[P]>
            : GetScalarType<T[P], UnitGroupByOutputType[P]>
        }
      >
    >


  export type UnitSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    name?: boolean
    description?: boolean
    topic?: boolean
    slug?: boolean
    difficulty?: boolean
    orderIndex?: boolean
    totalLessons?: boolean
    objectives?: boolean
    materials?: boolean
    prerequisites?: boolean
    estimatedDuration?: boolean
    thumbnail?: boolean
    banner?: boolean
    tags?: boolean
    isActive?: boolean
    createdById?: boolean
    updatedById?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }, ExtArgs["result"]["unit"]>

  export type UnitSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    name?: boolean
    description?: boolean
    topic?: boolean
    slug?: boolean
    difficulty?: boolean
    orderIndex?: boolean
    totalLessons?: boolean
    objectives?: boolean
    materials?: boolean
    prerequisites?: boolean
    estimatedDuration?: boolean
    thumbnail?: boolean
    banner?: boolean
    tags?: boolean
    isActive?: boolean
    createdById?: boolean
    updatedById?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }, ExtArgs["result"]["unit"]>

  export type UnitSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    name?: boolean
    description?: boolean
    topic?: boolean
    slug?: boolean
    difficulty?: boolean
    orderIndex?: boolean
    totalLessons?: boolean
    objectives?: boolean
    materials?: boolean
    prerequisites?: boolean
    estimatedDuration?: boolean
    thumbnail?: boolean
    banner?: boolean
    tags?: boolean
    isActive?: boolean
    createdById?: boolean
    updatedById?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }, ExtArgs["result"]["unit"]>

  export type UnitSelectScalar = {
    id?: boolean
    name?: boolean
    description?: boolean
    topic?: boolean
    slug?: boolean
    difficulty?: boolean
    orderIndex?: boolean
    totalLessons?: boolean
    objectives?: boolean
    materials?: boolean
    prerequisites?: boolean
    estimatedDuration?: boolean
    thumbnail?: boolean
    banner?: boolean
    tags?: boolean
    isActive?: boolean
    createdById?: boolean
    updatedById?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }

  export type UnitOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "name" | "description" | "topic" | "slug" | "difficulty" | "orderIndex" | "totalLessons" | "objectives" | "materials" | "prerequisites" | "estimatedDuration" | "thumbnail" | "banner" | "tags" | "isActive" | "createdById" | "updatedById" | "createdAt" | "updatedAt", ExtArgs["result"]["unit"]>

  export type $UnitPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "Unit"
    objects: {}
    scalars: $Extensions.GetPayloadResult<{
      id: string
      name: string
      description: string | null
      topic: string
      slug: string
      difficulty: $Enums.UnitDifficulty
      orderIndex: number
      totalLessons: number
      objectives: string[]
      materials: Prisma.JsonValue | null
      prerequisites: string[]
      estimatedDuration: number | null
      thumbnail: string | null
      banner: string | null
      tags: string[]
      isActive: $Enums.UnitStatus
      createdById: string
      updatedById: string
      createdAt: Date
      updatedAt: Date
    }, ExtArgs["result"]["unit"]>
    composites: {}
  }

  type UnitGetPayload<S extends boolean | null | undefined | UnitDefaultArgs> = $Result.GetResult<Prisma.$UnitPayload, S>

  type UnitCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<UnitFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: UnitCountAggregateInputType | true
    }

  export interface UnitDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['Unit'], meta: { name: 'Unit' } }
    /**
     * Find zero or one Unit that matches the filter.
     * @param {UnitFindUniqueArgs} args - Arguments to find a Unit
     * @example
     * // Get one Unit
     * const unit = await prisma.unit.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends UnitFindUniqueArgs>(args: SelectSubset<T, UnitFindUniqueArgs<ExtArgs>>): Prisma__UnitClient<$Result.GetResult<Prisma.$UnitPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one Unit that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {UnitFindUniqueOrThrowArgs} args - Arguments to find a Unit
     * @example
     * // Get one Unit
     * const unit = await prisma.unit.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends UnitFindUniqueOrThrowArgs>(args: SelectSubset<T, UnitFindUniqueOrThrowArgs<ExtArgs>>): Prisma__UnitClient<$Result.GetResult<Prisma.$UnitPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Unit that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UnitFindFirstArgs} args - Arguments to find a Unit
     * @example
     * // Get one Unit
     * const unit = await prisma.unit.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends UnitFindFirstArgs>(args?: SelectSubset<T, UnitFindFirstArgs<ExtArgs>>): Prisma__UnitClient<$Result.GetResult<Prisma.$UnitPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Unit that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UnitFindFirstOrThrowArgs} args - Arguments to find a Unit
     * @example
     * // Get one Unit
     * const unit = await prisma.unit.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends UnitFindFirstOrThrowArgs>(args?: SelectSubset<T, UnitFindFirstOrThrowArgs<ExtArgs>>): Prisma__UnitClient<$Result.GetResult<Prisma.$UnitPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more Units that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UnitFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all Units
     * const units = await prisma.unit.findMany()
     * 
     * // Get first 10 Units
     * const units = await prisma.unit.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const unitWithIdOnly = await prisma.unit.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends UnitFindManyArgs>(args?: SelectSubset<T, UnitFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$UnitPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a Unit.
     * @param {UnitCreateArgs} args - Arguments to create a Unit.
     * @example
     * // Create one Unit
     * const Unit = await prisma.unit.create({
     *   data: {
     *     // ... data to create a Unit
     *   }
     * })
     * 
     */
    create<T extends UnitCreateArgs>(args: SelectSubset<T, UnitCreateArgs<ExtArgs>>): Prisma__UnitClient<$Result.GetResult<Prisma.$UnitPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many Units.
     * @param {UnitCreateManyArgs} args - Arguments to create many Units.
     * @example
     * // Create many Units
     * const unit = await prisma.unit.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends UnitCreateManyArgs>(args?: SelectSubset<T, UnitCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many Units and returns the data saved in the database.
     * @param {UnitCreateManyAndReturnArgs} args - Arguments to create many Units.
     * @example
     * // Create many Units
     * const unit = await prisma.unit.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many Units and only return the `id`
     * const unitWithIdOnly = await prisma.unit.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends UnitCreateManyAndReturnArgs>(args?: SelectSubset<T, UnitCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$UnitPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a Unit.
     * @param {UnitDeleteArgs} args - Arguments to delete one Unit.
     * @example
     * // Delete one Unit
     * const Unit = await prisma.unit.delete({
     *   where: {
     *     // ... filter to delete one Unit
     *   }
     * })
     * 
     */
    delete<T extends UnitDeleteArgs>(args: SelectSubset<T, UnitDeleteArgs<ExtArgs>>): Prisma__UnitClient<$Result.GetResult<Prisma.$UnitPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one Unit.
     * @param {UnitUpdateArgs} args - Arguments to update one Unit.
     * @example
     * // Update one Unit
     * const unit = await prisma.unit.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends UnitUpdateArgs>(args: SelectSubset<T, UnitUpdateArgs<ExtArgs>>): Prisma__UnitClient<$Result.GetResult<Prisma.$UnitPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more Units.
     * @param {UnitDeleteManyArgs} args - Arguments to filter Units to delete.
     * @example
     * // Delete a few Units
     * const { count } = await prisma.unit.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends UnitDeleteManyArgs>(args?: SelectSubset<T, UnitDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Units.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UnitUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many Units
     * const unit = await prisma.unit.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends UnitUpdateManyArgs>(args: SelectSubset<T, UnitUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Units and returns the data updated in the database.
     * @param {UnitUpdateManyAndReturnArgs} args - Arguments to update many Units.
     * @example
     * // Update many Units
     * const unit = await prisma.unit.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more Units and only return the `id`
     * const unitWithIdOnly = await prisma.unit.updateManyAndReturn({
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
    updateManyAndReturn<T extends UnitUpdateManyAndReturnArgs>(args: SelectSubset<T, UnitUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$UnitPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one Unit.
     * @param {UnitUpsertArgs} args - Arguments to update or create a Unit.
     * @example
     * // Update or create a Unit
     * const unit = await prisma.unit.upsert({
     *   create: {
     *     // ... data to create a Unit
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the Unit we want to update
     *   }
     * })
     */
    upsert<T extends UnitUpsertArgs>(args: SelectSubset<T, UnitUpsertArgs<ExtArgs>>): Prisma__UnitClient<$Result.GetResult<Prisma.$UnitPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of Units.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UnitCountArgs} args - Arguments to filter Units to count.
     * @example
     * // Count the number of Units
     * const count = await prisma.unit.count({
     *   where: {
     *     // ... the filter for the Units we want to count
     *   }
     * })
    **/
    count<T extends UnitCountArgs>(
      args?: Subset<T, UnitCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], UnitCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a Unit.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UnitAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
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
    aggregate<T extends UnitAggregateArgs>(args: Subset<T, UnitAggregateArgs>): Prisma.PrismaPromise<GetUnitAggregateType<T>>

    /**
     * Group by Unit.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UnitGroupByArgs} args - Group by arguments.
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
      T extends UnitGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: UnitGroupByArgs['orderBy'] }
        : { orderBy?: UnitGroupByArgs['orderBy'] },
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
    >(args: SubsetIntersection<T, UnitGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetUnitGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the Unit model
   */
  readonly fields: UnitFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for Unit.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__UnitClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
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
   * Fields of the Unit model
   */
  interface UnitFieldRefs {
    readonly id: FieldRef<"Unit", 'String'>
    readonly name: FieldRef<"Unit", 'String'>
    readonly description: FieldRef<"Unit", 'String'>
    readonly topic: FieldRef<"Unit", 'String'>
    readonly slug: FieldRef<"Unit", 'String'>
    readonly difficulty: FieldRef<"Unit", 'UnitDifficulty'>
    readonly orderIndex: FieldRef<"Unit", 'Int'>
    readonly totalLessons: FieldRef<"Unit", 'Int'>
    readonly objectives: FieldRef<"Unit", 'String[]'>
    readonly materials: FieldRef<"Unit", 'Json'>
    readonly prerequisites: FieldRef<"Unit", 'String[]'>
    readonly estimatedDuration: FieldRef<"Unit", 'Int'>
    readonly thumbnail: FieldRef<"Unit", 'String'>
    readonly banner: FieldRef<"Unit", 'String'>
    readonly tags: FieldRef<"Unit", 'String[]'>
    readonly isActive: FieldRef<"Unit", 'UnitStatus'>
    readonly createdById: FieldRef<"Unit", 'String'>
    readonly updatedById: FieldRef<"Unit", 'String'>
    readonly createdAt: FieldRef<"Unit", 'DateTime'>
    readonly updatedAt: FieldRef<"Unit", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * Unit findUnique
   */
  export type UnitFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Unit
     */
    select?: UnitSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Unit
     */
    omit?: UnitOmit<ExtArgs> | null
    /**
     * Filter, which Unit to fetch.
     */
    where: UnitWhereUniqueInput
  }

  /**
   * Unit findUniqueOrThrow
   */
  export type UnitFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Unit
     */
    select?: UnitSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Unit
     */
    omit?: UnitOmit<ExtArgs> | null
    /**
     * Filter, which Unit to fetch.
     */
    where: UnitWhereUniqueInput
  }

  /**
   * Unit findFirst
   */
  export type UnitFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Unit
     */
    select?: UnitSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Unit
     */
    omit?: UnitOmit<ExtArgs> | null
    /**
     * Filter, which Unit to fetch.
     */
    where?: UnitWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Units to fetch.
     */
    orderBy?: UnitOrderByWithRelationInput | UnitOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Units.
     */
    cursor?: UnitWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Units from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Units.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Units.
     */
    distinct?: UnitScalarFieldEnum | UnitScalarFieldEnum[]
  }

  /**
   * Unit findFirstOrThrow
   */
  export type UnitFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Unit
     */
    select?: UnitSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Unit
     */
    omit?: UnitOmit<ExtArgs> | null
    /**
     * Filter, which Unit to fetch.
     */
    where?: UnitWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Units to fetch.
     */
    orderBy?: UnitOrderByWithRelationInput | UnitOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Units.
     */
    cursor?: UnitWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Units from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Units.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Units.
     */
    distinct?: UnitScalarFieldEnum | UnitScalarFieldEnum[]
  }

  /**
   * Unit findMany
   */
  export type UnitFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Unit
     */
    select?: UnitSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Unit
     */
    omit?: UnitOmit<ExtArgs> | null
    /**
     * Filter, which Units to fetch.
     */
    where?: UnitWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Units to fetch.
     */
    orderBy?: UnitOrderByWithRelationInput | UnitOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing Units.
     */
    cursor?: UnitWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Units from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Units.
     */
    skip?: number
    distinct?: UnitScalarFieldEnum | UnitScalarFieldEnum[]
  }

  /**
   * Unit create
   */
  export type UnitCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Unit
     */
    select?: UnitSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Unit
     */
    omit?: UnitOmit<ExtArgs> | null
    /**
     * The data needed to create a Unit.
     */
    data: XOR<UnitCreateInput, UnitUncheckedCreateInput>
  }

  /**
   * Unit createMany
   */
  export type UnitCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many Units.
     */
    data: UnitCreateManyInput | UnitCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * Unit createManyAndReturn
   */
  export type UnitCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Unit
     */
    select?: UnitSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the Unit
     */
    omit?: UnitOmit<ExtArgs> | null
    /**
     * The data used to create many Units.
     */
    data: UnitCreateManyInput | UnitCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * Unit update
   */
  export type UnitUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Unit
     */
    select?: UnitSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Unit
     */
    omit?: UnitOmit<ExtArgs> | null
    /**
     * The data needed to update a Unit.
     */
    data: XOR<UnitUpdateInput, UnitUncheckedUpdateInput>
    /**
     * Choose, which Unit to update.
     */
    where: UnitWhereUniqueInput
  }

  /**
   * Unit updateMany
   */
  export type UnitUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update Units.
     */
    data: XOR<UnitUpdateManyMutationInput, UnitUncheckedUpdateManyInput>
    /**
     * Filter which Units to update
     */
    where?: UnitWhereInput
    /**
     * Limit how many Units to update.
     */
    limit?: number
  }

  /**
   * Unit updateManyAndReturn
   */
  export type UnitUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Unit
     */
    select?: UnitSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the Unit
     */
    omit?: UnitOmit<ExtArgs> | null
    /**
     * The data used to update Units.
     */
    data: XOR<UnitUpdateManyMutationInput, UnitUncheckedUpdateManyInput>
    /**
     * Filter which Units to update
     */
    where?: UnitWhereInput
    /**
     * Limit how many Units to update.
     */
    limit?: number
  }

  /**
   * Unit upsert
   */
  export type UnitUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Unit
     */
    select?: UnitSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Unit
     */
    omit?: UnitOmit<ExtArgs> | null
    /**
     * The filter to search for the Unit to update in case it exists.
     */
    where: UnitWhereUniqueInput
    /**
     * In case the Unit found by the `where` argument doesn't exist, create a new Unit with this data.
     */
    create: XOR<UnitCreateInput, UnitUncheckedCreateInput>
    /**
     * In case the Unit was found with the provided `where` argument, update it with this data.
     */
    update: XOR<UnitUpdateInput, UnitUncheckedUpdateInput>
  }

  /**
   * Unit delete
   */
  export type UnitDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Unit
     */
    select?: UnitSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Unit
     */
    omit?: UnitOmit<ExtArgs> | null
    /**
     * Filter which Unit to delete.
     */
    where: UnitWhereUniqueInput
  }

  /**
   * Unit deleteMany
   */
  export type UnitDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Units to delete
     */
    where?: UnitWhereInput
    /**
     * Limit how many Units to delete.
     */
    limit?: number
  }

  /**
   * Unit without action
   */
  export type UnitDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Unit
     */
    select?: UnitSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Unit
     */
    omit?: UnitOmit<ExtArgs> | null
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
    fullname: 'fullname',
    username: 'username',
    email: 'email',
    password: 'password',
    birthDate: 'birthDate',
    role: 'role',
    slug: 'slug',
    avatar: 'avatar',
    cover: 'cover',
    phone: 'phone',
    gender: 'gender',
    language: 'language',
    province: 'province',
    parentId: 'parentId',
    teacherId: 'teacherId',
    typeAccount: 'typeAccount',
    googleId: 'googleId',
    facebookId: 'facebookId',
    accountPackage: 'accountPackage',
    isVerify: 'isVerify',
    codeVerify: 'codeVerify',
    tokenVerify: 'tokenVerify',
    refCode: 'refCode',
    invitedById: 'invitedById',
    exp: 'exp',
    streakDays: 'streakDays',
    progressLevel: 'progressLevel',
    totalLessonsCompleted: 'totalLessonsCompleted',
    theme: 'theme',
    currency: 'currency',
    enableNotifications: 'enableNotifications',
    enableNotificationEmails: 'enableNotificationEmails',
    status: 'status',
    lastLoginAt: 'lastLoginAt',
    createdById: 'createdById',
    updatedById: 'updatedById',
    createdAt: 'createdAt',
    updatedAt: 'updatedAt'
  };

  export type UserScalarFieldEnum = (typeof UserScalarFieldEnum)[keyof typeof UserScalarFieldEnum]


  export const TokenScalarFieldEnum: {
    id: 'id',
    userId: 'userId',
    token: 'token',
    deviceId: 'deviceId',
    isDeleted: 'isDeleted',
    createdAt: 'createdAt',
    updatedAt: 'updatedAt'
  };

  export type TokenScalarFieldEnum = (typeof TokenScalarFieldEnum)[keyof typeof TokenScalarFieldEnum]


  export const UnitScalarFieldEnum: {
    id: 'id',
    name: 'name',
    description: 'description',
    topic: 'topic',
    slug: 'slug',
    difficulty: 'difficulty',
    orderIndex: 'orderIndex',
    totalLessons: 'totalLessons',
    objectives: 'objectives',
    materials: 'materials',
    prerequisites: 'prerequisites',
    estimatedDuration: 'estimatedDuration',
    thumbnail: 'thumbnail',
    banner: 'banner',
    tags: 'tags',
    isActive: 'isActive',
    createdById: 'createdById',
    updatedById: 'updatedById',
    createdAt: 'createdAt',
    updatedAt: 'updatedAt'
  };

  export type UnitScalarFieldEnum = (typeof UnitScalarFieldEnum)[keyof typeof UnitScalarFieldEnum]


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
   * Reference to a field of type 'DateTime'
   */
  export type DateTimeFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'DateTime'>
    


  /**
   * Reference to a field of type 'DateTime[]'
   */
  export type ListDateTimeFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'DateTime[]'>
    


  /**
   * Reference to a field of type 'UserRole'
   */
  export type EnumUserRoleFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'UserRole'>
    


  /**
   * Reference to a field of type 'UserRole[]'
   */
  export type ListEnumUserRoleFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'UserRole[]'>
    


  /**
   * Reference to a field of type 'UserGender'
   */
  export type EnumUserGenderFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'UserGender'>
    


  /**
   * Reference to a field of type 'UserGender[]'
   */
  export type ListEnumUserGenderFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'UserGender[]'>
    


  /**
   * Reference to a field of type 'UserLanguage'
   */
  export type EnumUserLanguageFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'UserLanguage'>
    


  /**
   * Reference to a field of type 'UserLanguage[]'
   */
  export type ListEnumUserLanguageFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'UserLanguage[]'>
    


  /**
   * Reference to a field of type 'UserTypeAccount'
   */
  export type EnumUserTypeAccountFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'UserTypeAccount'>
    


  /**
   * Reference to a field of type 'UserTypeAccount[]'
   */
  export type ListEnumUserTypeAccountFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'UserTypeAccount[]'>
    


  /**
   * Reference to a field of type 'PackageType'
   */
  export type EnumPackageTypeFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'PackageType'>
    


  /**
   * Reference to a field of type 'PackageType[]'
   */
  export type ListEnumPackageTypeFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'PackageType[]'>
    


  /**
   * Reference to a field of type 'Boolean'
   */
  export type BooleanFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Boolean'>
    


  /**
   * Reference to a field of type 'Int'
   */
  export type IntFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Int'>
    


  /**
   * Reference to a field of type 'Int[]'
   */
  export type ListIntFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Int[]'>
    


  /**
   * Reference to a field of type 'UserTheme'
   */
  export type EnumUserThemeFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'UserTheme'>
    


  /**
   * Reference to a field of type 'UserTheme[]'
   */
  export type ListEnumUserThemeFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'UserTheme[]'>
    


  /**
   * Reference to a field of type 'UserCurrency'
   */
  export type EnumUserCurrencyFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'UserCurrency'>
    


  /**
   * Reference to a field of type 'UserCurrency[]'
   */
  export type ListEnumUserCurrencyFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'UserCurrency[]'>
    


  /**
   * Reference to a field of type 'UserStatus'
   */
  export type EnumUserStatusFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'UserStatus'>
    


  /**
   * Reference to a field of type 'UserStatus[]'
   */
  export type ListEnumUserStatusFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'UserStatus[]'>
    


  /**
   * Reference to a field of type 'UnitDifficulty'
   */
  export type EnumUnitDifficultyFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'UnitDifficulty'>
    


  /**
   * Reference to a field of type 'UnitDifficulty[]'
   */
  export type ListEnumUnitDifficultyFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'UnitDifficulty[]'>
    


  /**
   * Reference to a field of type 'Json'
   */
  export type JsonFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Json'>
    


  /**
   * Reference to a field of type 'QueryMode'
   */
  export type EnumQueryModeFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'QueryMode'>
    


  /**
   * Reference to a field of type 'UnitStatus'
   */
  export type EnumUnitStatusFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'UnitStatus'>
    


  /**
   * Reference to a field of type 'UnitStatus[]'
   */
  export type ListEnumUnitStatusFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'UnitStatus[]'>
    


  /**
   * Reference to a field of type 'Float'
   */
  export type FloatFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Float'>
    


  /**
   * Reference to a field of type 'Float[]'
   */
  export type ListFloatFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Float[]'>
    
  /**
   * Deep Input Types
   */


  export type UserWhereInput = {
    AND?: UserWhereInput | UserWhereInput[]
    OR?: UserWhereInput[]
    NOT?: UserWhereInput | UserWhereInput[]
    id?: StringFilter<"User"> | string
    fullname?: StringFilter<"User"> | string
    username?: StringFilter<"User"> | string
    email?: StringFilter<"User"> | string
    password?: StringFilter<"User"> | string
    birthDate?: DateTimeNullableFilter<"User"> | Date | string | null
    role?: EnumUserRoleFilter<"User"> | $Enums.UserRole
    slug?: StringFilter<"User"> | string
    avatar?: StringNullableFilter<"User"> | string | null
    cover?: StringNullableFilter<"User"> | string | null
    phone?: StringFilter<"User"> | string
    gender?: EnumUserGenderFilter<"User"> | $Enums.UserGender
    language?: EnumUserLanguageNullableFilter<"User"> | $Enums.UserLanguage | null
    province?: StringNullableFilter<"User"> | string | null
    parentId?: StringNullableFilter<"User"> | string | null
    teacherId?: StringNullableFilter<"User"> | string | null
    typeAccount?: EnumUserTypeAccountFilter<"User"> | $Enums.UserTypeAccount
    googleId?: StringNullableFilter<"User"> | string | null
    facebookId?: StringNullableFilter<"User"> | string | null
    accountPackage?: EnumPackageTypeFilter<"User"> | $Enums.PackageType
    isVerify?: BoolFilter<"User"> | boolean
    codeVerify?: StringNullableFilter<"User"> | string | null
    tokenVerify?: StringNullableFilter<"User"> | string | null
    refCode?: StringNullableFilter<"User"> | string | null
    invitedById?: StringNullableFilter<"User"> | string | null
    exp?: IntNullableFilter<"User"> | number | null
    streakDays?: IntNullableFilter<"User"> | number | null
    progressLevel?: IntNullableFilter<"User"> | number | null
    totalLessonsCompleted?: IntNullableFilter<"User"> | number | null
    theme?: EnumUserThemeNullableFilter<"User"> | $Enums.UserTheme | null
    currency?: EnumUserCurrencyNullableFilter<"User"> | $Enums.UserCurrency | null
    enableNotifications?: BoolNullableFilter<"User"> | boolean | null
    enableNotificationEmails?: BoolNullableFilter<"User"> | boolean | null
    status?: EnumUserStatusFilter<"User"> | $Enums.UserStatus
    lastLoginAt?: DateTimeNullableFilter<"User"> | Date | string | null
    createdById?: StringNullableFilter<"User"> | string | null
    updatedById?: StringNullableFilter<"User"> | string | null
    createdAt?: DateTimeFilter<"User"> | Date | string
    updatedAt?: DateTimeFilter<"User"> | Date | string
    token?: TokenListRelationFilter
  }

  export type UserOrderByWithRelationInput = {
    id?: SortOrder
    fullname?: SortOrder
    username?: SortOrder
    email?: SortOrder
    password?: SortOrder
    birthDate?: SortOrderInput | SortOrder
    role?: SortOrder
    slug?: SortOrder
    avatar?: SortOrderInput | SortOrder
    cover?: SortOrderInput | SortOrder
    phone?: SortOrder
    gender?: SortOrder
    language?: SortOrderInput | SortOrder
    province?: SortOrderInput | SortOrder
    parentId?: SortOrderInput | SortOrder
    teacherId?: SortOrderInput | SortOrder
    typeAccount?: SortOrder
    googleId?: SortOrderInput | SortOrder
    facebookId?: SortOrderInput | SortOrder
    accountPackage?: SortOrder
    isVerify?: SortOrder
    codeVerify?: SortOrderInput | SortOrder
    tokenVerify?: SortOrderInput | SortOrder
    refCode?: SortOrderInput | SortOrder
    invitedById?: SortOrderInput | SortOrder
    exp?: SortOrderInput | SortOrder
    streakDays?: SortOrderInput | SortOrder
    progressLevel?: SortOrderInput | SortOrder
    totalLessonsCompleted?: SortOrderInput | SortOrder
    theme?: SortOrderInput | SortOrder
    currency?: SortOrderInput | SortOrder
    enableNotifications?: SortOrderInput | SortOrder
    enableNotificationEmails?: SortOrderInput | SortOrder
    status?: SortOrder
    lastLoginAt?: SortOrderInput | SortOrder
    createdById?: SortOrderInput | SortOrder
    updatedById?: SortOrderInput | SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    token?: TokenOrderByRelationAggregateInput
  }

  export type UserWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    username?: string
    email?: string
    slug?: string
    googleId?: string
    facebookId?: string
    refCode?: string
    AND?: UserWhereInput | UserWhereInput[]
    OR?: UserWhereInput[]
    NOT?: UserWhereInput | UserWhereInput[]
    fullname?: StringFilter<"User"> | string
    password?: StringFilter<"User"> | string
    birthDate?: DateTimeNullableFilter<"User"> | Date | string | null
    role?: EnumUserRoleFilter<"User"> | $Enums.UserRole
    avatar?: StringNullableFilter<"User"> | string | null
    cover?: StringNullableFilter<"User"> | string | null
    phone?: StringFilter<"User"> | string
    gender?: EnumUserGenderFilter<"User"> | $Enums.UserGender
    language?: EnumUserLanguageNullableFilter<"User"> | $Enums.UserLanguage | null
    province?: StringNullableFilter<"User"> | string | null
    parentId?: StringNullableFilter<"User"> | string | null
    teacherId?: StringNullableFilter<"User"> | string | null
    typeAccount?: EnumUserTypeAccountFilter<"User"> | $Enums.UserTypeAccount
    accountPackage?: EnumPackageTypeFilter<"User"> | $Enums.PackageType
    isVerify?: BoolFilter<"User"> | boolean
    codeVerify?: StringNullableFilter<"User"> | string | null
    tokenVerify?: StringNullableFilter<"User"> | string | null
    invitedById?: StringNullableFilter<"User"> | string | null
    exp?: IntNullableFilter<"User"> | number | null
    streakDays?: IntNullableFilter<"User"> | number | null
    progressLevel?: IntNullableFilter<"User"> | number | null
    totalLessonsCompleted?: IntNullableFilter<"User"> | number | null
    theme?: EnumUserThemeNullableFilter<"User"> | $Enums.UserTheme | null
    currency?: EnumUserCurrencyNullableFilter<"User"> | $Enums.UserCurrency | null
    enableNotifications?: BoolNullableFilter<"User"> | boolean | null
    enableNotificationEmails?: BoolNullableFilter<"User"> | boolean | null
    status?: EnumUserStatusFilter<"User"> | $Enums.UserStatus
    lastLoginAt?: DateTimeNullableFilter<"User"> | Date | string | null
    createdById?: StringNullableFilter<"User"> | string | null
    updatedById?: StringNullableFilter<"User"> | string | null
    createdAt?: DateTimeFilter<"User"> | Date | string
    updatedAt?: DateTimeFilter<"User"> | Date | string
    token?: TokenListRelationFilter
  }, "id" | "username" | "email" | "slug" | "googleId" | "facebookId" | "refCode">

  export type UserOrderByWithAggregationInput = {
    id?: SortOrder
    fullname?: SortOrder
    username?: SortOrder
    email?: SortOrder
    password?: SortOrder
    birthDate?: SortOrderInput | SortOrder
    role?: SortOrder
    slug?: SortOrder
    avatar?: SortOrderInput | SortOrder
    cover?: SortOrderInput | SortOrder
    phone?: SortOrder
    gender?: SortOrder
    language?: SortOrderInput | SortOrder
    province?: SortOrderInput | SortOrder
    parentId?: SortOrderInput | SortOrder
    teacherId?: SortOrderInput | SortOrder
    typeAccount?: SortOrder
    googleId?: SortOrderInput | SortOrder
    facebookId?: SortOrderInput | SortOrder
    accountPackage?: SortOrder
    isVerify?: SortOrder
    codeVerify?: SortOrderInput | SortOrder
    tokenVerify?: SortOrderInput | SortOrder
    refCode?: SortOrderInput | SortOrder
    invitedById?: SortOrderInput | SortOrder
    exp?: SortOrderInput | SortOrder
    streakDays?: SortOrderInput | SortOrder
    progressLevel?: SortOrderInput | SortOrder
    totalLessonsCompleted?: SortOrderInput | SortOrder
    theme?: SortOrderInput | SortOrder
    currency?: SortOrderInput | SortOrder
    enableNotifications?: SortOrderInput | SortOrder
    enableNotificationEmails?: SortOrderInput | SortOrder
    status?: SortOrder
    lastLoginAt?: SortOrderInput | SortOrder
    createdById?: SortOrderInput | SortOrder
    updatedById?: SortOrderInput | SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    _count?: UserCountOrderByAggregateInput
    _avg?: UserAvgOrderByAggregateInput
    _max?: UserMaxOrderByAggregateInput
    _min?: UserMinOrderByAggregateInput
    _sum?: UserSumOrderByAggregateInput
  }

  export type UserScalarWhereWithAggregatesInput = {
    AND?: UserScalarWhereWithAggregatesInput | UserScalarWhereWithAggregatesInput[]
    OR?: UserScalarWhereWithAggregatesInput[]
    NOT?: UserScalarWhereWithAggregatesInput | UserScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"User"> | string
    fullname?: StringWithAggregatesFilter<"User"> | string
    username?: StringWithAggregatesFilter<"User"> | string
    email?: StringWithAggregatesFilter<"User"> | string
    password?: StringWithAggregatesFilter<"User"> | string
    birthDate?: DateTimeNullableWithAggregatesFilter<"User"> | Date | string | null
    role?: EnumUserRoleWithAggregatesFilter<"User"> | $Enums.UserRole
    slug?: StringWithAggregatesFilter<"User"> | string
    avatar?: StringNullableWithAggregatesFilter<"User"> | string | null
    cover?: StringNullableWithAggregatesFilter<"User"> | string | null
    phone?: StringWithAggregatesFilter<"User"> | string
    gender?: EnumUserGenderWithAggregatesFilter<"User"> | $Enums.UserGender
    language?: EnumUserLanguageNullableWithAggregatesFilter<"User"> | $Enums.UserLanguage | null
    province?: StringNullableWithAggregatesFilter<"User"> | string | null
    parentId?: StringNullableWithAggregatesFilter<"User"> | string | null
    teacherId?: StringNullableWithAggregatesFilter<"User"> | string | null
    typeAccount?: EnumUserTypeAccountWithAggregatesFilter<"User"> | $Enums.UserTypeAccount
    googleId?: StringNullableWithAggregatesFilter<"User"> | string | null
    facebookId?: StringNullableWithAggregatesFilter<"User"> | string | null
    accountPackage?: EnumPackageTypeWithAggregatesFilter<"User"> | $Enums.PackageType
    isVerify?: BoolWithAggregatesFilter<"User"> | boolean
    codeVerify?: StringNullableWithAggregatesFilter<"User"> | string | null
    tokenVerify?: StringNullableWithAggregatesFilter<"User"> | string | null
    refCode?: StringNullableWithAggregatesFilter<"User"> | string | null
    invitedById?: StringNullableWithAggregatesFilter<"User"> | string | null
    exp?: IntNullableWithAggregatesFilter<"User"> | number | null
    streakDays?: IntNullableWithAggregatesFilter<"User"> | number | null
    progressLevel?: IntNullableWithAggregatesFilter<"User"> | number | null
    totalLessonsCompleted?: IntNullableWithAggregatesFilter<"User"> | number | null
    theme?: EnumUserThemeNullableWithAggregatesFilter<"User"> | $Enums.UserTheme | null
    currency?: EnumUserCurrencyNullableWithAggregatesFilter<"User"> | $Enums.UserCurrency | null
    enableNotifications?: BoolNullableWithAggregatesFilter<"User"> | boolean | null
    enableNotificationEmails?: BoolNullableWithAggregatesFilter<"User"> | boolean | null
    status?: EnumUserStatusWithAggregatesFilter<"User"> | $Enums.UserStatus
    lastLoginAt?: DateTimeNullableWithAggregatesFilter<"User"> | Date | string | null
    createdById?: StringNullableWithAggregatesFilter<"User"> | string | null
    updatedById?: StringNullableWithAggregatesFilter<"User"> | string | null
    createdAt?: DateTimeWithAggregatesFilter<"User"> | Date | string
    updatedAt?: DateTimeWithAggregatesFilter<"User"> | Date | string
  }

  export type TokenWhereInput = {
    AND?: TokenWhereInput | TokenWhereInput[]
    OR?: TokenWhereInput[]
    NOT?: TokenWhereInput | TokenWhereInput[]
    id?: StringFilter<"Token"> | string
    userId?: StringFilter<"Token"> | string
    token?: StringFilter<"Token"> | string
    deviceId?: StringFilter<"Token"> | string
    isDeleted?: BoolFilter<"Token"> | boolean
    createdAt?: DateTimeFilter<"Token"> | Date | string
    updatedAt?: DateTimeFilter<"Token"> | Date | string
    user?: XOR<UserScalarRelationFilter, UserWhereInput>
  }

  export type TokenOrderByWithRelationInput = {
    id?: SortOrder
    userId?: SortOrder
    token?: SortOrder
    deviceId?: SortOrder
    isDeleted?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    user?: UserOrderByWithRelationInput
  }

  export type TokenWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    AND?: TokenWhereInput | TokenWhereInput[]
    OR?: TokenWhereInput[]
    NOT?: TokenWhereInput | TokenWhereInput[]
    userId?: StringFilter<"Token"> | string
    token?: StringFilter<"Token"> | string
    deviceId?: StringFilter<"Token"> | string
    isDeleted?: BoolFilter<"Token"> | boolean
    createdAt?: DateTimeFilter<"Token"> | Date | string
    updatedAt?: DateTimeFilter<"Token"> | Date | string
    user?: XOR<UserScalarRelationFilter, UserWhereInput>
  }, "id">

  export type TokenOrderByWithAggregationInput = {
    id?: SortOrder
    userId?: SortOrder
    token?: SortOrder
    deviceId?: SortOrder
    isDeleted?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    _count?: TokenCountOrderByAggregateInput
    _max?: TokenMaxOrderByAggregateInput
    _min?: TokenMinOrderByAggregateInput
  }

  export type TokenScalarWhereWithAggregatesInput = {
    AND?: TokenScalarWhereWithAggregatesInput | TokenScalarWhereWithAggregatesInput[]
    OR?: TokenScalarWhereWithAggregatesInput[]
    NOT?: TokenScalarWhereWithAggregatesInput | TokenScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"Token"> | string
    userId?: StringWithAggregatesFilter<"Token"> | string
    token?: StringWithAggregatesFilter<"Token"> | string
    deviceId?: StringWithAggregatesFilter<"Token"> | string
    isDeleted?: BoolWithAggregatesFilter<"Token"> | boolean
    createdAt?: DateTimeWithAggregatesFilter<"Token"> | Date | string
    updatedAt?: DateTimeWithAggregatesFilter<"Token"> | Date | string
  }

  export type UnitWhereInput = {
    AND?: UnitWhereInput | UnitWhereInput[]
    OR?: UnitWhereInput[]
    NOT?: UnitWhereInput | UnitWhereInput[]
    id?: StringFilter<"Unit"> | string
    name?: StringFilter<"Unit"> | string
    description?: StringNullableFilter<"Unit"> | string | null
    topic?: StringFilter<"Unit"> | string
    slug?: StringFilter<"Unit"> | string
    difficulty?: EnumUnitDifficultyFilter<"Unit"> | $Enums.UnitDifficulty
    orderIndex?: IntFilter<"Unit"> | number
    totalLessons?: IntFilter<"Unit"> | number
    objectives?: StringNullableListFilter<"Unit">
    materials?: JsonNullableFilter<"Unit">
    prerequisites?: StringNullableListFilter<"Unit">
    estimatedDuration?: IntNullableFilter<"Unit"> | number | null
    thumbnail?: StringNullableFilter<"Unit"> | string | null
    banner?: StringNullableFilter<"Unit"> | string | null
    tags?: StringNullableListFilter<"Unit">
    isActive?: EnumUnitStatusFilter<"Unit"> | $Enums.UnitStatus
    createdById?: StringFilter<"Unit"> | string
    updatedById?: StringFilter<"Unit"> | string
    createdAt?: DateTimeFilter<"Unit"> | Date | string
    updatedAt?: DateTimeFilter<"Unit"> | Date | string
  }

  export type UnitOrderByWithRelationInput = {
    id?: SortOrder
    name?: SortOrder
    description?: SortOrderInput | SortOrder
    topic?: SortOrder
    slug?: SortOrder
    difficulty?: SortOrder
    orderIndex?: SortOrder
    totalLessons?: SortOrder
    objectives?: SortOrder
    materials?: SortOrderInput | SortOrder
    prerequisites?: SortOrder
    estimatedDuration?: SortOrderInput | SortOrder
    thumbnail?: SortOrderInput | SortOrder
    banner?: SortOrderInput | SortOrder
    tags?: SortOrder
    isActive?: SortOrder
    createdById?: SortOrder
    updatedById?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type UnitWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    slug?: string
    AND?: UnitWhereInput | UnitWhereInput[]
    OR?: UnitWhereInput[]
    NOT?: UnitWhereInput | UnitWhereInput[]
    name?: StringFilter<"Unit"> | string
    description?: StringNullableFilter<"Unit"> | string | null
    topic?: StringFilter<"Unit"> | string
    difficulty?: EnumUnitDifficultyFilter<"Unit"> | $Enums.UnitDifficulty
    orderIndex?: IntFilter<"Unit"> | number
    totalLessons?: IntFilter<"Unit"> | number
    objectives?: StringNullableListFilter<"Unit">
    materials?: JsonNullableFilter<"Unit">
    prerequisites?: StringNullableListFilter<"Unit">
    estimatedDuration?: IntNullableFilter<"Unit"> | number | null
    thumbnail?: StringNullableFilter<"Unit"> | string | null
    banner?: StringNullableFilter<"Unit"> | string | null
    tags?: StringNullableListFilter<"Unit">
    isActive?: EnumUnitStatusFilter<"Unit"> | $Enums.UnitStatus
    createdById?: StringFilter<"Unit"> | string
    updatedById?: StringFilter<"Unit"> | string
    createdAt?: DateTimeFilter<"Unit"> | Date | string
    updatedAt?: DateTimeFilter<"Unit"> | Date | string
  }, "id" | "slug">

  export type UnitOrderByWithAggregationInput = {
    id?: SortOrder
    name?: SortOrder
    description?: SortOrderInput | SortOrder
    topic?: SortOrder
    slug?: SortOrder
    difficulty?: SortOrder
    orderIndex?: SortOrder
    totalLessons?: SortOrder
    objectives?: SortOrder
    materials?: SortOrderInput | SortOrder
    prerequisites?: SortOrder
    estimatedDuration?: SortOrderInput | SortOrder
    thumbnail?: SortOrderInput | SortOrder
    banner?: SortOrderInput | SortOrder
    tags?: SortOrder
    isActive?: SortOrder
    createdById?: SortOrder
    updatedById?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    _count?: UnitCountOrderByAggregateInput
    _avg?: UnitAvgOrderByAggregateInput
    _max?: UnitMaxOrderByAggregateInput
    _min?: UnitMinOrderByAggregateInput
    _sum?: UnitSumOrderByAggregateInput
  }

  export type UnitScalarWhereWithAggregatesInput = {
    AND?: UnitScalarWhereWithAggregatesInput | UnitScalarWhereWithAggregatesInput[]
    OR?: UnitScalarWhereWithAggregatesInput[]
    NOT?: UnitScalarWhereWithAggregatesInput | UnitScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"Unit"> | string
    name?: StringWithAggregatesFilter<"Unit"> | string
    description?: StringNullableWithAggregatesFilter<"Unit"> | string | null
    topic?: StringWithAggregatesFilter<"Unit"> | string
    slug?: StringWithAggregatesFilter<"Unit"> | string
    difficulty?: EnumUnitDifficultyWithAggregatesFilter<"Unit"> | $Enums.UnitDifficulty
    orderIndex?: IntWithAggregatesFilter<"Unit"> | number
    totalLessons?: IntWithAggregatesFilter<"Unit"> | number
    objectives?: StringNullableListFilter<"Unit">
    materials?: JsonNullableWithAggregatesFilter<"Unit">
    prerequisites?: StringNullableListFilter<"Unit">
    estimatedDuration?: IntNullableWithAggregatesFilter<"Unit"> | number | null
    thumbnail?: StringNullableWithAggregatesFilter<"Unit"> | string | null
    banner?: StringNullableWithAggregatesFilter<"Unit"> | string | null
    tags?: StringNullableListFilter<"Unit">
    isActive?: EnumUnitStatusWithAggregatesFilter<"Unit"> | $Enums.UnitStatus
    createdById?: StringWithAggregatesFilter<"Unit"> | string
    updatedById?: StringWithAggregatesFilter<"Unit"> | string
    createdAt?: DateTimeWithAggregatesFilter<"Unit"> | Date | string
    updatedAt?: DateTimeWithAggregatesFilter<"Unit"> | Date | string
  }

  export type UserCreateInput = {
    id?: string
    fullname: string
    username: string
    email: string
    password: string
    birthDate?: Date | string | null
    role: $Enums.UserRole
    slug: string
    avatar?: string | null
    cover?: string | null
    phone: string
    gender: $Enums.UserGender
    language?: $Enums.UserLanguage | null
    province?: string | null
    parentId?: string | null
    teacherId?: string | null
    typeAccount: $Enums.UserTypeAccount
    googleId?: string | null
    facebookId?: string | null
    accountPackage: $Enums.PackageType
    isVerify?: boolean
    codeVerify?: string | null
    tokenVerify?: string | null
    refCode?: string | null
    invitedById?: string | null
    exp?: number | null
    streakDays?: number | null
    progressLevel?: number | null
    totalLessonsCompleted?: number | null
    theme?: $Enums.UserTheme | null
    currency?: $Enums.UserCurrency | null
    enableNotifications?: boolean | null
    enableNotificationEmails?: boolean | null
    status?: $Enums.UserStatus
    lastLoginAt?: Date | string | null
    createdById?: string | null
    updatedById?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    token?: TokenCreateNestedManyWithoutUserInput
  }

  export type UserUncheckedCreateInput = {
    id?: string
    fullname: string
    username: string
    email: string
    password: string
    birthDate?: Date | string | null
    role: $Enums.UserRole
    slug: string
    avatar?: string | null
    cover?: string | null
    phone: string
    gender: $Enums.UserGender
    language?: $Enums.UserLanguage | null
    province?: string | null
    parentId?: string | null
    teacherId?: string | null
    typeAccount: $Enums.UserTypeAccount
    googleId?: string | null
    facebookId?: string | null
    accountPackage: $Enums.PackageType
    isVerify?: boolean
    codeVerify?: string | null
    tokenVerify?: string | null
    refCode?: string | null
    invitedById?: string | null
    exp?: number | null
    streakDays?: number | null
    progressLevel?: number | null
    totalLessonsCompleted?: number | null
    theme?: $Enums.UserTheme | null
    currency?: $Enums.UserCurrency | null
    enableNotifications?: boolean | null
    enableNotificationEmails?: boolean | null
    status?: $Enums.UserStatus
    lastLoginAt?: Date | string | null
    createdById?: string | null
    updatedById?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    token?: TokenUncheckedCreateNestedManyWithoutUserInput
  }

  export type UserUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    fullname?: StringFieldUpdateOperationsInput | string
    username?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    password?: StringFieldUpdateOperationsInput | string
    birthDate?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    role?: EnumUserRoleFieldUpdateOperationsInput | $Enums.UserRole
    slug?: StringFieldUpdateOperationsInput | string
    avatar?: NullableStringFieldUpdateOperationsInput | string | null
    cover?: NullableStringFieldUpdateOperationsInput | string | null
    phone?: StringFieldUpdateOperationsInput | string
    gender?: EnumUserGenderFieldUpdateOperationsInput | $Enums.UserGender
    language?: NullableEnumUserLanguageFieldUpdateOperationsInput | $Enums.UserLanguage | null
    province?: NullableStringFieldUpdateOperationsInput | string | null
    parentId?: NullableStringFieldUpdateOperationsInput | string | null
    teacherId?: NullableStringFieldUpdateOperationsInput | string | null
    typeAccount?: EnumUserTypeAccountFieldUpdateOperationsInput | $Enums.UserTypeAccount
    googleId?: NullableStringFieldUpdateOperationsInput | string | null
    facebookId?: NullableStringFieldUpdateOperationsInput | string | null
    accountPackage?: EnumPackageTypeFieldUpdateOperationsInput | $Enums.PackageType
    isVerify?: BoolFieldUpdateOperationsInput | boolean
    codeVerify?: NullableStringFieldUpdateOperationsInput | string | null
    tokenVerify?: NullableStringFieldUpdateOperationsInput | string | null
    refCode?: NullableStringFieldUpdateOperationsInput | string | null
    invitedById?: NullableStringFieldUpdateOperationsInput | string | null
    exp?: NullableIntFieldUpdateOperationsInput | number | null
    streakDays?: NullableIntFieldUpdateOperationsInput | number | null
    progressLevel?: NullableIntFieldUpdateOperationsInput | number | null
    totalLessonsCompleted?: NullableIntFieldUpdateOperationsInput | number | null
    theme?: NullableEnumUserThemeFieldUpdateOperationsInput | $Enums.UserTheme | null
    currency?: NullableEnumUserCurrencyFieldUpdateOperationsInput | $Enums.UserCurrency | null
    enableNotifications?: NullableBoolFieldUpdateOperationsInput | boolean | null
    enableNotificationEmails?: NullableBoolFieldUpdateOperationsInput | boolean | null
    status?: EnumUserStatusFieldUpdateOperationsInput | $Enums.UserStatus
    lastLoginAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    createdById?: NullableStringFieldUpdateOperationsInput | string | null
    updatedById?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    token?: TokenUpdateManyWithoutUserNestedInput
  }

  export type UserUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    fullname?: StringFieldUpdateOperationsInput | string
    username?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    password?: StringFieldUpdateOperationsInput | string
    birthDate?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    role?: EnumUserRoleFieldUpdateOperationsInput | $Enums.UserRole
    slug?: StringFieldUpdateOperationsInput | string
    avatar?: NullableStringFieldUpdateOperationsInput | string | null
    cover?: NullableStringFieldUpdateOperationsInput | string | null
    phone?: StringFieldUpdateOperationsInput | string
    gender?: EnumUserGenderFieldUpdateOperationsInput | $Enums.UserGender
    language?: NullableEnumUserLanguageFieldUpdateOperationsInput | $Enums.UserLanguage | null
    province?: NullableStringFieldUpdateOperationsInput | string | null
    parentId?: NullableStringFieldUpdateOperationsInput | string | null
    teacherId?: NullableStringFieldUpdateOperationsInput | string | null
    typeAccount?: EnumUserTypeAccountFieldUpdateOperationsInput | $Enums.UserTypeAccount
    googleId?: NullableStringFieldUpdateOperationsInput | string | null
    facebookId?: NullableStringFieldUpdateOperationsInput | string | null
    accountPackage?: EnumPackageTypeFieldUpdateOperationsInput | $Enums.PackageType
    isVerify?: BoolFieldUpdateOperationsInput | boolean
    codeVerify?: NullableStringFieldUpdateOperationsInput | string | null
    tokenVerify?: NullableStringFieldUpdateOperationsInput | string | null
    refCode?: NullableStringFieldUpdateOperationsInput | string | null
    invitedById?: NullableStringFieldUpdateOperationsInput | string | null
    exp?: NullableIntFieldUpdateOperationsInput | number | null
    streakDays?: NullableIntFieldUpdateOperationsInput | number | null
    progressLevel?: NullableIntFieldUpdateOperationsInput | number | null
    totalLessonsCompleted?: NullableIntFieldUpdateOperationsInput | number | null
    theme?: NullableEnumUserThemeFieldUpdateOperationsInput | $Enums.UserTheme | null
    currency?: NullableEnumUserCurrencyFieldUpdateOperationsInput | $Enums.UserCurrency | null
    enableNotifications?: NullableBoolFieldUpdateOperationsInput | boolean | null
    enableNotificationEmails?: NullableBoolFieldUpdateOperationsInput | boolean | null
    status?: EnumUserStatusFieldUpdateOperationsInput | $Enums.UserStatus
    lastLoginAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    createdById?: NullableStringFieldUpdateOperationsInput | string | null
    updatedById?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    token?: TokenUncheckedUpdateManyWithoutUserNestedInput
  }

  export type UserCreateManyInput = {
    id?: string
    fullname: string
    username: string
    email: string
    password: string
    birthDate?: Date | string | null
    role: $Enums.UserRole
    slug: string
    avatar?: string | null
    cover?: string | null
    phone: string
    gender: $Enums.UserGender
    language?: $Enums.UserLanguage | null
    province?: string | null
    parentId?: string | null
    teacherId?: string | null
    typeAccount: $Enums.UserTypeAccount
    googleId?: string | null
    facebookId?: string | null
    accountPackage: $Enums.PackageType
    isVerify?: boolean
    codeVerify?: string | null
    tokenVerify?: string | null
    refCode?: string | null
    invitedById?: string | null
    exp?: number | null
    streakDays?: number | null
    progressLevel?: number | null
    totalLessonsCompleted?: number | null
    theme?: $Enums.UserTheme | null
    currency?: $Enums.UserCurrency | null
    enableNotifications?: boolean | null
    enableNotificationEmails?: boolean | null
    status?: $Enums.UserStatus
    lastLoginAt?: Date | string | null
    createdById?: string | null
    updatedById?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type UserUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    fullname?: StringFieldUpdateOperationsInput | string
    username?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    password?: StringFieldUpdateOperationsInput | string
    birthDate?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    role?: EnumUserRoleFieldUpdateOperationsInput | $Enums.UserRole
    slug?: StringFieldUpdateOperationsInput | string
    avatar?: NullableStringFieldUpdateOperationsInput | string | null
    cover?: NullableStringFieldUpdateOperationsInput | string | null
    phone?: StringFieldUpdateOperationsInput | string
    gender?: EnumUserGenderFieldUpdateOperationsInput | $Enums.UserGender
    language?: NullableEnumUserLanguageFieldUpdateOperationsInput | $Enums.UserLanguage | null
    province?: NullableStringFieldUpdateOperationsInput | string | null
    parentId?: NullableStringFieldUpdateOperationsInput | string | null
    teacherId?: NullableStringFieldUpdateOperationsInput | string | null
    typeAccount?: EnumUserTypeAccountFieldUpdateOperationsInput | $Enums.UserTypeAccount
    googleId?: NullableStringFieldUpdateOperationsInput | string | null
    facebookId?: NullableStringFieldUpdateOperationsInput | string | null
    accountPackage?: EnumPackageTypeFieldUpdateOperationsInput | $Enums.PackageType
    isVerify?: BoolFieldUpdateOperationsInput | boolean
    codeVerify?: NullableStringFieldUpdateOperationsInput | string | null
    tokenVerify?: NullableStringFieldUpdateOperationsInput | string | null
    refCode?: NullableStringFieldUpdateOperationsInput | string | null
    invitedById?: NullableStringFieldUpdateOperationsInput | string | null
    exp?: NullableIntFieldUpdateOperationsInput | number | null
    streakDays?: NullableIntFieldUpdateOperationsInput | number | null
    progressLevel?: NullableIntFieldUpdateOperationsInput | number | null
    totalLessonsCompleted?: NullableIntFieldUpdateOperationsInput | number | null
    theme?: NullableEnumUserThemeFieldUpdateOperationsInput | $Enums.UserTheme | null
    currency?: NullableEnumUserCurrencyFieldUpdateOperationsInput | $Enums.UserCurrency | null
    enableNotifications?: NullableBoolFieldUpdateOperationsInput | boolean | null
    enableNotificationEmails?: NullableBoolFieldUpdateOperationsInput | boolean | null
    status?: EnumUserStatusFieldUpdateOperationsInput | $Enums.UserStatus
    lastLoginAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    createdById?: NullableStringFieldUpdateOperationsInput | string | null
    updatedById?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type UserUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    fullname?: StringFieldUpdateOperationsInput | string
    username?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    password?: StringFieldUpdateOperationsInput | string
    birthDate?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    role?: EnumUserRoleFieldUpdateOperationsInput | $Enums.UserRole
    slug?: StringFieldUpdateOperationsInput | string
    avatar?: NullableStringFieldUpdateOperationsInput | string | null
    cover?: NullableStringFieldUpdateOperationsInput | string | null
    phone?: StringFieldUpdateOperationsInput | string
    gender?: EnumUserGenderFieldUpdateOperationsInput | $Enums.UserGender
    language?: NullableEnumUserLanguageFieldUpdateOperationsInput | $Enums.UserLanguage | null
    province?: NullableStringFieldUpdateOperationsInput | string | null
    parentId?: NullableStringFieldUpdateOperationsInput | string | null
    teacherId?: NullableStringFieldUpdateOperationsInput | string | null
    typeAccount?: EnumUserTypeAccountFieldUpdateOperationsInput | $Enums.UserTypeAccount
    googleId?: NullableStringFieldUpdateOperationsInput | string | null
    facebookId?: NullableStringFieldUpdateOperationsInput | string | null
    accountPackage?: EnumPackageTypeFieldUpdateOperationsInput | $Enums.PackageType
    isVerify?: BoolFieldUpdateOperationsInput | boolean
    codeVerify?: NullableStringFieldUpdateOperationsInput | string | null
    tokenVerify?: NullableStringFieldUpdateOperationsInput | string | null
    refCode?: NullableStringFieldUpdateOperationsInput | string | null
    invitedById?: NullableStringFieldUpdateOperationsInput | string | null
    exp?: NullableIntFieldUpdateOperationsInput | number | null
    streakDays?: NullableIntFieldUpdateOperationsInput | number | null
    progressLevel?: NullableIntFieldUpdateOperationsInput | number | null
    totalLessonsCompleted?: NullableIntFieldUpdateOperationsInput | number | null
    theme?: NullableEnumUserThemeFieldUpdateOperationsInput | $Enums.UserTheme | null
    currency?: NullableEnumUserCurrencyFieldUpdateOperationsInput | $Enums.UserCurrency | null
    enableNotifications?: NullableBoolFieldUpdateOperationsInput | boolean | null
    enableNotificationEmails?: NullableBoolFieldUpdateOperationsInput | boolean | null
    status?: EnumUserStatusFieldUpdateOperationsInput | $Enums.UserStatus
    lastLoginAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    createdById?: NullableStringFieldUpdateOperationsInput | string | null
    updatedById?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type TokenCreateInput = {
    id?: string
    token: string
    deviceId: string
    isDeleted?: boolean
    createdAt?: Date | string
    updatedAt?: Date | string
    user: UserCreateNestedOneWithoutTokenInput
  }

  export type TokenUncheckedCreateInput = {
    id?: string
    userId: string
    token: string
    deviceId: string
    isDeleted?: boolean
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type TokenUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    token?: StringFieldUpdateOperationsInput | string
    deviceId?: StringFieldUpdateOperationsInput | string
    isDeleted?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    user?: UserUpdateOneRequiredWithoutTokenNestedInput
  }

  export type TokenUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    userId?: StringFieldUpdateOperationsInput | string
    token?: StringFieldUpdateOperationsInput | string
    deviceId?: StringFieldUpdateOperationsInput | string
    isDeleted?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type TokenCreateManyInput = {
    id?: string
    userId: string
    token: string
    deviceId: string
    isDeleted?: boolean
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type TokenUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    token?: StringFieldUpdateOperationsInput | string
    deviceId?: StringFieldUpdateOperationsInput | string
    isDeleted?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type TokenUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    userId?: StringFieldUpdateOperationsInput | string
    token?: StringFieldUpdateOperationsInput | string
    deviceId?: StringFieldUpdateOperationsInput | string
    isDeleted?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type UnitCreateInput = {
    id?: string
    name: string
    description?: string | null
    topic: string
    slug: string
    difficulty?: $Enums.UnitDifficulty
    orderIndex?: number
    totalLessons: number
    objectives?: UnitCreateobjectivesInput | string[]
    materials?: NullableJsonNullValueInput | InputJsonValue
    prerequisites?: UnitCreateprerequisitesInput | string[]
    estimatedDuration?: number | null
    thumbnail?: string | null
    banner?: string | null
    tags?: UnitCreatetagsInput | string[]
    isActive?: $Enums.UnitStatus
    createdById: string
    updatedById: string
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type UnitUncheckedCreateInput = {
    id?: string
    name: string
    description?: string | null
    topic: string
    slug: string
    difficulty?: $Enums.UnitDifficulty
    orderIndex?: number
    totalLessons: number
    objectives?: UnitCreateobjectivesInput | string[]
    materials?: NullableJsonNullValueInput | InputJsonValue
    prerequisites?: UnitCreateprerequisitesInput | string[]
    estimatedDuration?: number | null
    thumbnail?: string | null
    banner?: string | null
    tags?: UnitCreatetagsInput | string[]
    isActive?: $Enums.UnitStatus
    createdById: string
    updatedById: string
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type UnitUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    description?: NullableStringFieldUpdateOperationsInput | string | null
    topic?: StringFieldUpdateOperationsInput | string
    slug?: StringFieldUpdateOperationsInput | string
    difficulty?: EnumUnitDifficultyFieldUpdateOperationsInput | $Enums.UnitDifficulty
    orderIndex?: IntFieldUpdateOperationsInput | number
    totalLessons?: IntFieldUpdateOperationsInput | number
    objectives?: UnitUpdateobjectivesInput | string[]
    materials?: NullableJsonNullValueInput | InputJsonValue
    prerequisites?: UnitUpdateprerequisitesInput | string[]
    estimatedDuration?: NullableIntFieldUpdateOperationsInput | number | null
    thumbnail?: NullableStringFieldUpdateOperationsInput | string | null
    banner?: NullableStringFieldUpdateOperationsInput | string | null
    tags?: UnitUpdatetagsInput | string[]
    isActive?: EnumUnitStatusFieldUpdateOperationsInput | $Enums.UnitStatus
    createdById?: StringFieldUpdateOperationsInput | string
    updatedById?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type UnitUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    description?: NullableStringFieldUpdateOperationsInput | string | null
    topic?: StringFieldUpdateOperationsInput | string
    slug?: StringFieldUpdateOperationsInput | string
    difficulty?: EnumUnitDifficultyFieldUpdateOperationsInput | $Enums.UnitDifficulty
    orderIndex?: IntFieldUpdateOperationsInput | number
    totalLessons?: IntFieldUpdateOperationsInput | number
    objectives?: UnitUpdateobjectivesInput | string[]
    materials?: NullableJsonNullValueInput | InputJsonValue
    prerequisites?: UnitUpdateprerequisitesInput | string[]
    estimatedDuration?: NullableIntFieldUpdateOperationsInput | number | null
    thumbnail?: NullableStringFieldUpdateOperationsInput | string | null
    banner?: NullableStringFieldUpdateOperationsInput | string | null
    tags?: UnitUpdatetagsInput | string[]
    isActive?: EnumUnitStatusFieldUpdateOperationsInput | $Enums.UnitStatus
    createdById?: StringFieldUpdateOperationsInput | string
    updatedById?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type UnitCreateManyInput = {
    id?: string
    name: string
    description?: string | null
    topic: string
    slug: string
    difficulty?: $Enums.UnitDifficulty
    orderIndex?: number
    totalLessons: number
    objectives?: UnitCreateobjectivesInput | string[]
    materials?: NullableJsonNullValueInput | InputJsonValue
    prerequisites?: UnitCreateprerequisitesInput | string[]
    estimatedDuration?: number | null
    thumbnail?: string | null
    banner?: string | null
    tags?: UnitCreatetagsInput | string[]
    isActive?: $Enums.UnitStatus
    createdById: string
    updatedById: string
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type UnitUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    description?: NullableStringFieldUpdateOperationsInput | string | null
    topic?: StringFieldUpdateOperationsInput | string
    slug?: StringFieldUpdateOperationsInput | string
    difficulty?: EnumUnitDifficultyFieldUpdateOperationsInput | $Enums.UnitDifficulty
    orderIndex?: IntFieldUpdateOperationsInput | number
    totalLessons?: IntFieldUpdateOperationsInput | number
    objectives?: UnitUpdateobjectivesInput | string[]
    materials?: NullableJsonNullValueInput | InputJsonValue
    prerequisites?: UnitUpdateprerequisitesInput | string[]
    estimatedDuration?: NullableIntFieldUpdateOperationsInput | number | null
    thumbnail?: NullableStringFieldUpdateOperationsInput | string | null
    banner?: NullableStringFieldUpdateOperationsInput | string | null
    tags?: UnitUpdatetagsInput | string[]
    isActive?: EnumUnitStatusFieldUpdateOperationsInput | $Enums.UnitStatus
    createdById?: StringFieldUpdateOperationsInput | string
    updatedById?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type UnitUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    description?: NullableStringFieldUpdateOperationsInput | string | null
    topic?: StringFieldUpdateOperationsInput | string
    slug?: StringFieldUpdateOperationsInput | string
    difficulty?: EnumUnitDifficultyFieldUpdateOperationsInput | $Enums.UnitDifficulty
    orderIndex?: IntFieldUpdateOperationsInput | number
    totalLessons?: IntFieldUpdateOperationsInput | number
    objectives?: UnitUpdateobjectivesInput | string[]
    materials?: NullableJsonNullValueInput | InputJsonValue
    prerequisites?: UnitUpdateprerequisitesInput | string[]
    estimatedDuration?: NullableIntFieldUpdateOperationsInput | number | null
    thumbnail?: NullableStringFieldUpdateOperationsInput | string | null
    banner?: NullableStringFieldUpdateOperationsInput | string | null
    tags?: UnitUpdatetagsInput | string[]
    isActive?: EnumUnitStatusFieldUpdateOperationsInput | $Enums.UnitStatus
    createdById?: StringFieldUpdateOperationsInput | string
    updatedById?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type StringFilter<$PrismaModel = never> = {
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
    mode?: QueryMode
    not?: NestedStringFilter<$PrismaModel> | string
  }

  export type DateTimeNullableFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel> | null
    in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel> | null
    notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel> | null
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeNullableFilter<$PrismaModel> | Date | string | null
  }

  export type EnumUserRoleFilter<$PrismaModel = never> = {
    equals?: $Enums.UserRole | EnumUserRoleFieldRefInput<$PrismaModel>
    in?: $Enums.UserRole[] | ListEnumUserRoleFieldRefInput<$PrismaModel>
    notIn?: $Enums.UserRole[] | ListEnumUserRoleFieldRefInput<$PrismaModel>
    not?: NestedEnumUserRoleFilter<$PrismaModel> | $Enums.UserRole
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

  export type EnumUserGenderFilter<$PrismaModel = never> = {
    equals?: $Enums.UserGender | EnumUserGenderFieldRefInput<$PrismaModel>
    in?: $Enums.UserGender[] | ListEnumUserGenderFieldRefInput<$PrismaModel>
    notIn?: $Enums.UserGender[] | ListEnumUserGenderFieldRefInput<$PrismaModel>
    not?: NestedEnumUserGenderFilter<$PrismaModel> | $Enums.UserGender
  }

  export type EnumUserLanguageNullableFilter<$PrismaModel = never> = {
    equals?: $Enums.UserLanguage | EnumUserLanguageFieldRefInput<$PrismaModel> | null
    in?: $Enums.UserLanguage[] | ListEnumUserLanguageFieldRefInput<$PrismaModel> | null
    notIn?: $Enums.UserLanguage[] | ListEnumUserLanguageFieldRefInput<$PrismaModel> | null
    not?: NestedEnumUserLanguageNullableFilter<$PrismaModel> | $Enums.UserLanguage | null
  }

  export type EnumUserTypeAccountFilter<$PrismaModel = never> = {
    equals?: $Enums.UserTypeAccount | EnumUserTypeAccountFieldRefInput<$PrismaModel>
    in?: $Enums.UserTypeAccount[] | ListEnumUserTypeAccountFieldRefInput<$PrismaModel>
    notIn?: $Enums.UserTypeAccount[] | ListEnumUserTypeAccountFieldRefInput<$PrismaModel>
    not?: NestedEnumUserTypeAccountFilter<$PrismaModel> | $Enums.UserTypeAccount
  }

  export type EnumPackageTypeFilter<$PrismaModel = never> = {
    equals?: $Enums.PackageType | EnumPackageTypeFieldRefInput<$PrismaModel>
    in?: $Enums.PackageType[] | ListEnumPackageTypeFieldRefInput<$PrismaModel>
    notIn?: $Enums.PackageType[] | ListEnumPackageTypeFieldRefInput<$PrismaModel>
    not?: NestedEnumPackageTypeFilter<$PrismaModel> | $Enums.PackageType
  }

  export type BoolFilter<$PrismaModel = never> = {
    equals?: boolean | BooleanFieldRefInput<$PrismaModel>
    not?: NestedBoolFilter<$PrismaModel> | boolean
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

  export type EnumUserThemeNullableFilter<$PrismaModel = never> = {
    equals?: $Enums.UserTheme | EnumUserThemeFieldRefInput<$PrismaModel> | null
    in?: $Enums.UserTheme[] | ListEnumUserThemeFieldRefInput<$PrismaModel> | null
    notIn?: $Enums.UserTheme[] | ListEnumUserThemeFieldRefInput<$PrismaModel> | null
    not?: NestedEnumUserThemeNullableFilter<$PrismaModel> | $Enums.UserTheme | null
  }

  export type EnumUserCurrencyNullableFilter<$PrismaModel = never> = {
    equals?: $Enums.UserCurrency | EnumUserCurrencyFieldRefInput<$PrismaModel> | null
    in?: $Enums.UserCurrency[] | ListEnumUserCurrencyFieldRefInput<$PrismaModel> | null
    notIn?: $Enums.UserCurrency[] | ListEnumUserCurrencyFieldRefInput<$PrismaModel> | null
    not?: NestedEnumUserCurrencyNullableFilter<$PrismaModel> | $Enums.UserCurrency | null
  }

  export type BoolNullableFilter<$PrismaModel = never> = {
    equals?: boolean | BooleanFieldRefInput<$PrismaModel> | null
    not?: NestedBoolNullableFilter<$PrismaModel> | boolean | null
  }

  export type EnumUserStatusFilter<$PrismaModel = never> = {
    equals?: $Enums.UserStatus | EnumUserStatusFieldRefInput<$PrismaModel>
    in?: $Enums.UserStatus[] | ListEnumUserStatusFieldRefInput<$PrismaModel>
    notIn?: $Enums.UserStatus[] | ListEnumUserStatusFieldRefInput<$PrismaModel>
    not?: NestedEnumUserStatusFilter<$PrismaModel> | $Enums.UserStatus
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

  export type TokenListRelationFilter = {
    every?: TokenWhereInput
    some?: TokenWhereInput
    none?: TokenWhereInput
  }

  export type SortOrderInput = {
    sort: SortOrder
    nulls?: NullsOrder
  }

  export type TokenOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type UserCountOrderByAggregateInput = {
    id?: SortOrder
    fullname?: SortOrder
    username?: SortOrder
    email?: SortOrder
    password?: SortOrder
    birthDate?: SortOrder
    role?: SortOrder
    slug?: SortOrder
    avatar?: SortOrder
    cover?: SortOrder
    phone?: SortOrder
    gender?: SortOrder
    language?: SortOrder
    province?: SortOrder
    parentId?: SortOrder
    teacherId?: SortOrder
    typeAccount?: SortOrder
    googleId?: SortOrder
    facebookId?: SortOrder
    accountPackage?: SortOrder
    isVerify?: SortOrder
    codeVerify?: SortOrder
    tokenVerify?: SortOrder
    refCode?: SortOrder
    invitedById?: SortOrder
    exp?: SortOrder
    streakDays?: SortOrder
    progressLevel?: SortOrder
    totalLessonsCompleted?: SortOrder
    theme?: SortOrder
    currency?: SortOrder
    enableNotifications?: SortOrder
    enableNotificationEmails?: SortOrder
    status?: SortOrder
    lastLoginAt?: SortOrder
    createdById?: SortOrder
    updatedById?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type UserAvgOrderByAggregateInput = {
    exp?: SortOrder
    streakDays?: SortOrder
    progressLevel?: SortOrder
    totalLessonsCompleted?: SortOrder
  }

  export type UserMaxOrderByAggregateInput = {
    id?: SortOrder
    fullname?: SortOrder
    username?: SortOrder
    email?: SortOrder
    password?: SortOrder
    birthDate?: SortOrder
    role?: SortOrder
    slug?: SortOrder
    avatar?: SortOrder
    cover?: SortOrder
    phone?: SortOrder
    gender?: SortOrder
    language?: SortOrder
    province?: SortOrder
    parentId?: SortOrder
    teacherId?: SortOrder
    typeAccount?: SortOrder
    googleId?: SortOrder
    facebookId?: SortOrder
    accountPackage?: SortOrder
    isVerify?: SortOrder
    codeVerify?: SortOrder
    tokenVerify?: SortOrder
    refCode?: SortOrder
    invitedById?: SortOrder
    exp?: SortOrder
    streakDays?: SortOrder
    progressLevel?: SortOrder
    totalLessonsCompleted?: SortOrder
    theme?: SortOrder
    currency?: SortOrder
    enableNotifications?: SortOrder
    enableNotificationEmails?: SortOrder
    status?: SortOrder
    lastLoginAt?: SortOrder
    createdById?: SortOrder
    updatedById?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type UserMinOrderByAggregateInput = {
    id?: SortOrder
    fullname?: SortOrder
    username?: SortOrder
    email?: SortOrder
    password?: SortOrder
    birthDate?: SortOrder
    role?: SortOrder
    slug?: SortOrder
    avatar?: SortOrder
    cover?: SortOrder
    phone?: SortOrder
    gender?: SortOrder
    language?: SortOrder
    province?: SortOrder
    parentId?: SortOrder
    teacherId?: SortOrder
    typeAccount?: SortOrder
    googleId?: SortOrder
    facebookId?: SortOrder
    accountPackage?: SortOrder
    isVerify?: SortOrder
    codeVerify?: SortOrder
    tokenVerify?: SortOrder
    refCode?: SortOrder
    invitedById?: SortOrder
    exp?: SortOrder
    streakDays?: SortOrder
    progressLevel?: SortOrder
    totalLessonsCompleted?: SortOrder
    theme?: SortOrder
    currency?: SortOrder
    enableNotifications?: SortOrder
    enableNotificationEmails?: SortOrder
    status?: SortOrder
    lastLoginAt?: SortOrder
    createdById?: SortOrder
    updatedById?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type UserSumOrderByAggregateInput = {
    exp?: SortOrder
    streakDays?: SortOrder
    progressLevel?: SortOrder
    totalLessonsCompleted?: SortOrder
  }

  export type StringWithAggregatesFilter<$PrismaModel = never> = {
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
    mode?: QueryMode
    not?: NestedStringWithAggregatesFilter<$PrismaModel> | string
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedStringFilter<$PrismaModel>
    _max?: NestedStringFilter<$PrismaModel>
  }

  export type DateTimeNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel> | null
    in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel> | null
    notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel> | null
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeNullableWithAggregatesFilter<$PrismaModel> | Date | string | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedDateTimeNullableFilter<$PrismaModel>
    _max?: NestedDateTimeNullableFilter<$PrismaModel>
  }

  export type EnumUserRoleWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.UserRole | EnumUserRoleFieldRefInput<$PrismaModel>
    in?: $Enums.UserRole[] | ListEnumUserRoleFieldRefInput<$PrismaModel>
    notIn?: $Enums.UserRole[] | ListEnumUserRoleFieldRefInput<$PrismaModel>
    not?: NestedEnumUserRoleWithAggregatesFilter<$PrismaModel> | $Enums.UserRole
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedEnumUserRoleFilter<$PrismaModel>
    _max?: NestedEnumUserRoleFilter<$PrismaModel>
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

  export type EnumUserGenderWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.UserGender | EnumUserGenderFieldRefInput<$PrismaModel>
    in?: $Enums.UserGender[] | ListEnumUserGenderFieldRefInput<$PrismaModel>
    notIn?: $Enums.UserGender[] | ListEnumUserGenderFieldRefInput<$PrismaModel>
    not?: NestedEnumUserGenderWithAggregatesFilter<$PrismaModel> | $Enums.UserGender
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedEnumUserGenderFilter<$PrismaModel>
    _max?: NestedEnumUserGenderFilter<$PrismaModel>
  }

  export type EnumUserLanguageNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.UserLanguage | EnumUserLanguageFieldRefInput<$PrismaModel> | null
    in?: $Enums.UserLanguage[] | ListEnumUserLanguageFieldRefInput<$PrismaModel> | null
    notIn?: $Enums.UserLanguage[] | ListEnumUserLanguageFieldRefInput<$PrismaModel> | null
    not?: NestedEnumUserLanguageNullableWithAggregatesFilter<$PrismaModel> | $Enums.UserLanguage | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedEnumUserLanguageNullableFilter<$PrismaModel>
    _max?: NestedEnumUserLanguageNullableFilter<$PrismaModel>
  }

  export type EnumUserTypeAccountWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.UserTypeAccount | EnumUserTypeAccountFieldRefInput<$PrismaModel>
    in?: $Enums.UserTypeAccount[] | ListEnumUserTypeAccountFieldRefInput<$PrismaModel>
    notIn?: $Enums.UserTypeAccount[] | ListEnumUserTypeAccountFieldRefInput<$PrismaModel>
    not?: NestedEnumUserTypeAccountWithAggregatesFilter<$PrismaModel> | $Enums.UserTypeAccount
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedEnumUserTypeAccountFilter<$PrismaModel>
    _max?: NestedEnumUserTypeAccountFilter<$PrismaModel>
  }

  export type EnumPackageTypeWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.PackageType | EnumPackageTypeFieldRefInput<$PrismaModel>
    in?: $Enums.PackageType[] | ListEnumPackageTypeFieldRefInput<$PrismaModel>
    notIn?: $Enums.PackageType[] | ListEnumPackageTypeFieldRefInput<$PrismaModel>
    not?: NestedEnumPackageTypeWithAggregatesFilter<$PrismaModel> | $Enums.PackageType
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedEnumPackageTypeFilter<$PrismaModel>
    _max?: NestedEnumPackageTypeFilter<$PrismaModel>
  }

  export type BoolWithAggregatesFilter<$PrismaModel = never> = {
    equals?: boolean | BooleanFieldRefInput<$PrismaModel>
    not?: NestedBoolWithAggregatesFilter<$PrismaModel> | boolean
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedBoolFilter<$PrismaModel>
    _max?: NestedBoolFilter<$PrismaModel>
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

  export type EnumUserThemeNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.UserTheme | EnumUserThemeFieldRefInput<$PrismaModel> | null
    in?: $Enums.UserTheme[] | ListEnumUserThemeFieldRefInput<$PrismaModel> | null
    notIn?: $Enums.UserTheme[] | ListEnumUserThemeFieldRefInput<$PrismaModel> | null
    not?: NestedEnumUserThemeNullableWithAggregatesFilter<$PrismaModel> | $Enums.UserTheme | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedEnumUserThemeNullableFilter<$PrismaModel>
    _max?: NestedEnumUserThemeNullableFilter<$PrismaModel>
  }

  export type EnumUserCurrencyNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.UserCurrency | EnumUserCurrencyFieldRefInput<$PrismaModel> | null
    in?: $Enums.UserCurrency[] | ListEnumUserCurrencyFieldRefInput<$PrismaModel> | null
    notIn?: $Enums.UserCurrency[] | ListEnumUserCurrencyFieldRefInput<$PrismaModel> | null
    not?: NestedEnumUserCurrencyNullableWithAggregatesFilter<$PrismaModel> | $Enums.UserCurrency | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedEnumUserCurrencyNullableFilter<$PrismaModel>
    _max?: NestedEnumUserCurrencyNullableFilter<$PrismaModel>
  }

  export type BoolNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: boolean | BooleanFieldRefInput<$PrismaModel> | null
    not?: NestedBoolNullableWithAggregatesFilter<$PrismaModel> | boolean | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedBoolNullableFilter<$PrismaModel>
    _max?: NestedBoolNullableFilter<$PrismaModel>
  }

  export type EnumUserStatusWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.UserStatus | EnumUserStatusFieldRefInput<$PrismaModel>
    in?: $Enums.UserStatus[] | ListEnumUserStatusFieldRefInput<$PrismaModel>
    notIn?: $Enums.UserStatus[] | ListEnumUserStatusFieldRefInput<$PrismaModel>
    not?: NestedEnumUserStatusWithAggregatesFilter<$PrismaModel> | $Enums.UserStatus
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedEnumUserStatusFilter<$PrismaModel>
    _max?: NestedEnumUserStatusFilter<$PrismaModel>
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

  export type UserScalarRelationFilter = {
    is?: UserWhereInput
    isNot?: UserWhereInput
  }

  export type TokenCountOrderByAggregateInput = {
    id?: SortOrder
    userId?: SortOrder
    token?: SortOrder
    deviceId?: SortOrder
    isDeleted?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type TokenMaxOrderByAggregateInput = {
    id?: SortOrder
    userId?: SortOrder
    token?: SortOrder
    deviceId?: SortOrder
    isDeleted?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type TokenMinOrderByAggregateInput = {
    id?: SortOrder
    userId?: SortOrder
    token?: SortOrder
    deviceId?: SortOrder
    isDeleted?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type EnumUnitDifficultyFilter<$PrismaModel = never> = {
    equals?: $Enums.UnitDifficulty | EnumUnitDifficultyFieldRefInput<$PrismaModel>
    in?: $Enums.UnitDifficulty[] | ListEnumUnitDifficultyFieldRefInput<$PrismaModel>
    notIn?: $Enums.UnitDifficulty[] | ListEnumUnitDifficultyFieldRefInput<$PrismaModel>
    not?: NestedEnumUnitDifficultyFilter<$PrismaModel> | $Enums.UnitDifficulty
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

  export type StringNullableListFilter<$PrismaModel = never> = {
    equals?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    has?: string | StringFieldRefInput<$PrismaModel> | null
    hasEvery?: string[] | ListStringFieldRefInput<$PrismaModel>
    hasSome?: string[] | ListStringFieldRefInput<$PrismaModel>
    isEmpty?: boolean
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

  export type EnumUnitStatusFilter<$PrismaModel = never> = {
    equals?: $Enums.UnitStatus | EnumUnitStatusFieldRefInput<$PrismaModel>
    in?: $Enums.UnitStatus[] | ListEnumUnitStatusFieldRefInput<$PrismaModel>
    notIn?: $Enums.UnitStatus[] | ListEnumUnitStatusFieldRefInput<$PrismaModel>
    not?: NestedEnumUnitStatusFilter<$PrismaModel> | $Enums.UnitStatus
  }

  export type UnitCountOrderByAggregateInput = {
    id?: SortOrder
    name?: SortOrder
    description?: SortOrder
    topic?: SortOrder
    slug?: SortOrder
    difficulty?: SortOrder
    orderIndex?: SortOrder
    totalLessons?: SortOrder
    objectives?: SortOrder
    materials?: SortOrder
    prerequisites?: SortOrder
    estimatedDuration?: SortOrder
    thumbnail?: SortOrder
    banner?: SortOrder
    tags?: SortOrder
    isActive?: SortOrder
    createdById?: SortOrder
    updatedById?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type UnitAvgOrderByAggregateInput = {
    orderIndex?: SortOrder
    totalLessons?: SortOrder
    estimatedDuration?: SortOrder
  }

  export type UnitMaxOrderByAggregateInput = {
    id?: SortOrder
    name?: SortOrder
    description?: SortOrder
    topic?: SortOrder
    slug?: SortOrder
    difficulty?: SortOrder
    orderIndex?: SortOrder
    totalLessons?: SortOrder
    estimatedDuration?: SortOrder
    thumbnail?: SortOrder
    banner?: SortOrder
    isActive?: SortOrder
    createdById?: SortOrder
    updatedById?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type UnitMinOrderByAggregateInput = {
    id?: SortOrder
    name?: SortOrder
    description?: SortOrder
    topic?: SortOrder
    slug?: SortOrder
    difficulty?: SortOrder
    orderIndex?: SortOrder
    totalLessons?: SortOrder
    estimatedDuration?: SortOrder
    thumbnail?: SortOrder
    banner?: SortOrder
    isActive?: SortOrder
    createdById?: SortOrder
    updatedById?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type UnitSumOrderByAggregateInput = {
    orderIndex?: SortOrder
    totalLessons?: SortOrder
    estimatedDuration?: SortOrder
  }

  export type EnumUnitDifficultyWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.UnitDifficulty | EnumUnitDifficultyFieldRefInput<$PrismaModel>
    in?: $Enums.UnitDifficulty[] | ListEnumUnitDifficultyFieldRefInput<$PrismaModel>
    notIn?: $Enums.UnitDifficulty[] | ListEnumUnitDifficultyFieldRefInput<$PrismaModel>
    not?: NestedEnumUnitDifficultyWithAggregatesFilter<$PrismaModel> | $Enums.UnitDifficulty
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedEnumUnitDifficultyFilter<$PrismaModel>
    _max?: NestedEnumUnitDifficultyFilter<$PrismaModel>
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

  export type EnumUnitStatusWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.UnitStatus | EnumUnitStatusFieldRefInput<$PrismaModel>
    in?: $Enums.UnitStatus[] | ListEnumUnitStatusFieldRefInput<$PrismaModel>
    notIn?: $Enums.UnitStatus[] | ListEnumUnitStatusFieldRefInput<$PrismaModel>
    not?: NestedEnumUnitStatusWithAggregatesFilter<$PrismaModel> | $Enums.UnitStatus
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedEnumUnitStatusFilter<$PrismaModel>
    _max?: NestedEnumUnitStatusFilter<$PrismaModel>
  }

  export type TokenCreateNestedManyWithoutUserInput = {
    create?: XOR<TokenCreateWithoutUserInput, TokenUncheckedCreateWithoutUserInput> | TokenCreateWithoutUserInput[] | TokenUncheckedCreateWithoutUserInput[]
    connectOrCreate?: TokenCreateOrConnectWithoutUserInput | TokenCreateOrConnectWithoutUserInput[]
    createMany?: TokenCreateManyUserInputEnvelope
    connect?: TokenWhereUniqueInput | TokenWhereUniqueInput[]
  }

  export type TokenUncheckedCreateNestedManyWithoutUserInput = {
    create?: XOR<TokenCreateWithoutUserInput, TokenUncheckedCreateWithoutUserInput> | TokenCreateWithoutUserInput[] | TokenUncheckedCreateWithoutUserInput[]
    connectOrCreate?: TokenCreateOrConnectWithoutUserInput | TokenCreateOrConnectWithoutUserInput[]
    createMany?: TokenCreateManyUserInputEnvelope
    connect?: TokenWhereUniqueInput | TokenWhereUniqueInput[]
  }

  export type StringFieldUpdateOperationsInput = {
    set?: string
  }

  export type NullableDateTimeFieldUpdateOperationsInput = {
    set?: Date | string | null
  }

  export type EnumUserRoleFieldUpdateOperationsInput = {
    set?: $Enums.UserRole
  }

  export type NullableStringFieldUpdateOperationsInput = {
    set?: string | null
  }

  export type EnumUserGenderFieldUpdateOperationsInput = {
    set?: $Enums.UserGender
  }

  export type NullableEnumUserLanguageFieldUpdateOperationsInput = {
    set?: $Enums.UserLanguage | null
  }

  export type EnumUserTypeAccountFieldUpdateOperationsInput = {
    set?: $Enums.UserTypeAccount
  }

  export type EnumPackageTypeFieldUpdateOperationsInput = {
    set?: $Enums.PackageType
  }

  export type BoolFieldUpdateOperationsInput = {
    set?: boolean
  }

  export type NullableIntFieldUpdateOperationsInput = {
    set?: number | null
    increment?: number
    decrement?: number
    multiply?: number
    divide?: number
  }

  export type NullableEnumUserThemeFieldUpdateOperationsInput = {
    set?: $Enums.UserTheme | null
  }

  export type NullableEnumUserCurrencyFieldUpdateOperationsInput = {
    set?: $Enums.UserCurrency | null
  }

  export type NullableBoolFieldUpdateOperationsInput = {
    set?: boolean | null
  }

  export type EnumUserStatusFieldUpdateOperationsInput = {
    set?: $Enums.UserStatus
  }

  export type DateTimeFieldUpdateOperationsInput = {
    set?: Date | string
  }

  export type TokenUpdateManyWithoutUserNestedInput = {
    create?: XOR<TokenCreateWithoutUserInput, TokenUncheckedCreateWithoutUserInput> | TokenCreateWithoutUserInput[] | TokenUncheckedCreateWithoutUserInput[]
    connectOrCreate?: TokenCreateOrConnectWithoutUserInput | TokenCreateOrConnectWithoutUserInput[]
    upsert?: TokenUpsertWithWhereUniqueWithoutUserInput | TokenUpsertWithWhereUniqueWithoutUserInput[]
    createMany?: TokenCreateManyUserInputEnvelope
    set?: TokenWhereUniqueInput | TokenWhereUniqueInput[]
    disconnect?: TokenWhereUniqueInput | TokenWhereUniqueInput[]
    delete?: TokenWhereUniqueInput | TokenWhereUniqueInput[]
    connect?: TokenWhereUniqueInput | TokenWhereUniqueInput[]
    update?: TokenUpdateWithWhereUniqueWithoutUserInput | TokenUpdateWithWhereUniqueWithoutUserInput[]
    updateMany?: TokenUpdateManyWithWhereWithoutUserInput | TokenUpdateManyWithWhereWithoutUserInput[]
    deleteMany?: TokenScalarWhereInput | TokenScalarWhereInput[]
  }

  export type TokenUncheckedUpdateManyWithoutUserNestedInput = {
    create?: XOR<TokenCreateWithoutUserInput, TokenUncheckedCreateWithoutUserInput> | TokenCreateWithoutUserInput[] | TokenUncheckedCreateWithoutUserInput[]
    connectOrCreate?: TokenCreateOrConnectWithoutUserInput | TokenCreateOrConnectWithoutUserInput[]
    upsert?: TokenUpsertWithWhereUniqueWithoutUserInput | TokenUpsertWithWhereUniqueWithoutUserInput[]
    createMany?: TokenCreateManyUserInputEnvelope
    set?: TokenWhereUniqueInput | TokenWhereUniqueInput[]
    disconnect?: TokenWhereUniqueInput | TokenWhereUniqueInput[]
    delete?: TokenWhereUniqueInput | TokenWhereUniqueInput[]
    connect?: TokenWhereUniqueInput | TokenWhereUniqueInput[]
    update?: TokenUpdateWithWhereUniqueWithoutUserInput | TokenUpdateWithWhereUniqueWithoutUserInput[]
    updateMany?: TokenUpdateManyWithWhereWithoutUserInput | TokenUpdateManyWithWhereWithoutUserInput[]
    deleteMany?: TokenScalarWhereInput | TokenScalarWhereInput[]
  }

  export type UserCreateNestedOneWithoutTokenInput = {
    create?: XOR<UserCreateWithoutTokenInput, UserUncheckedCreateWithoutTokenInput>
    connectOrCreate?: UserCreateOrConnectWithoutTokenInput
    connect?: UserWhereUniqueInput
  }

  export type UserUpdateOneRequiredWithoutTokenNestedInput = {
    create?: XOR<UserCreateWithoutTokenInput, UserUncheckedCreateWithoutTokenInput>
    connectOrCreate?: UserCreateOrConnectWithoutTokenInput
    upsert?: UserUpsertWithoutTokenInput
    connect?: UserWhereUniqueInput
    update?: XOR<XOR<UserUpdateToOneWithWhereWithoutTokenInput, UserUpdateWithoutTokenInput>, UserUncheckedUpdateWithoutTokenInput>
  }

  export type UnitCreateobjectivesInput = {
    set: string[]
  }

  export type UnitCreateprerequisitesInput = {
    set: string[]
  }

  export type UnitCreatetagsInput = {
    set: string[]
  }

  export type EnumUnitDifficultyFieldUpdateOperationsInput = {
    set?: $Enums.UnitDifficulty
  }

  export type IntFieldUpdateOperationsInput = {
    set?: number
    increment?: number
    decrement?: number
    multiply?: number
    divide?: number
  }

  export type UnitUpdateobjectivesInput = {
    set?: string[]
    push?: string | string[]
  }

  export type UnitUpdateprerequisitesInput = {
    set?: string[]
    push?: string | string[]
  }

  export type UnitUpdatetagsInput = {
    set?: string[]
    push?: string | string[]
  }

  export type EnumUnitStatusFieldUpdateOperationsInput = {
    set?: $Enums.UnitStatus
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

  export type NestedDateTimeNullableFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel> | null
    in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel> | null
    notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel> | null
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeNullableFilter<$PrismaModel> | Date | string | null
  }

  export type NestedEnumUserRoleFilter<$PrismaModel = never> = {
    equals?: $Enums.UserRole | EnumUserRoleFieldRefInput<$PrismaModel>
    in?: $Enums.UserRole[] | ListEnumUserRoleFieldRefInput<$PrismaModel>
    notIn?: $Enums.UserRole[] | ListEnumUserRoleFieldRefInput<$PrismaModel>
    not?: NestedEnumUserRoleFilter<$PrismaModel> | $Enums.UserRole
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

  export type NestedEnumUserGenderFilter<$PrismaModel = never> = {
    equals?: $Enums.UserGender | EnumUserGenderFieldRefInput<$PrismaModel>
    in?: $Enums.UserGender[] | ListEnumUserGenderFieldRefInput<$PrismaModel>
    notIn?: $Enums.UserGender[] | ListEnumUserGenderFieldRefInput<$PrismaModel>
    not?: NestedEnumUserGenderFilter<$PrismaModel> | $Enums.UserGender
  }

  export type NestedEnumUserLanguageNullableFilter<$PrismaModel = never> = {
    equals?: $Enums.UserLanguage | EnumUserLanguageFieldRefInput<$PrismaModel> | null
    in?: $Enums.UserLanguage[] | ListEnumUserLanguageFieldRefInput<$PrismaModel> | null
    notIn?: $Enums.UserLanguage[] | ListEnumUserLanguageFieldRefInput<$PrismaModel> | null
    not?: NestedEnumUserLanguageNullableFilter<$PrismaModel> | $Enums.UserLanguage | null
  }

  export type NestedEnumUserTypeAccountFilter<$PrismaModel = never> = {
    equals?: $Enums.UserTypeAccount | EnumUserTypeAccountFieldRefInput<$PrismaModel>
    in?: $Enums.UserTypeAccount[] | ListEnumUserTypeAccountFieldRefInput<$PrismaModel>
    notIn?: $Enums.UserTypeAccount[] | ListEnumUserTypeAccountFieldRefInput<$PrismaModel>
    not?: NestedEnumUserTypeAccountFilter<$PrismaModel> | $Enums.UserTypeAccount
  }

  export type NestedEnumPackageTypeFilter<$PrismaModel = never> = {
    equals?: $Enums.PackageType | EnumPackageTypeFieldRefInput<$PrismaModel>
    in?: $Enums.PackageType[] | ListEnumPackageTypeFieldRefInput<$PrismaModel>
    notIn?: $Enums.PackageType[] | ListEnumPackageTypeFieldRefInput<$PrismaModel>
    not?: NestedEnumPackageTypeFilter<$PrismaModel> | $Enums.PackageType
  }

  export type NestedBoolFilter<$PrismaModel = never> = {
    equals?: boolean | BooleanFieldRefInput<$PrismaModel>
    not?: NestedBoolFilter<$PrismaModel> | boolean
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

  export type NestedEnumUserThemeNullableFilter<$PrismaModel = never> = {
    equals?: $Enums.UserTheme | EnumUserThemeFieldRefInput<$PrismaModel> | null
    in?: $Enums.UserTheme[] | ListEnumUserThemeFieldRefInput<$PrismaModel> | null
    notIn?: $Enums.UserTheme[] | ListEnumUserThemeFieldRefInput<$PrismaModel> | null
    not?: NestedEnumUserThemeNullableFilter<$PrismaModel> | $Enums.UserTheme | null
  }

  export type NestedEnumUserCurrencyNullableFilter<$PrismaModel = never> = {
    equals?: $Enums.UserCurrency | EnumUserCurrencyFieldRefInput<$PrismaModel> | null
    in?: $Enums.UserCurrency[] | ListEnumUserCurrencyFieldRefInput<$PrismaModel> | null
    notIn?: $Enums.UserCurrency[] | ListEnumUserCurrencyFieldRefInput<$PrismaModel> | null
    not?: NestedEnumUserCurrencyNullableFilter<$PrismaModel> | $Enums.UserCurrency | null
  }

  export type NestedBoolNullableFilter<$PrismaModel = never> = {
    equals?: boolean | BooleanFieldRefInput<$PrismaModel> | null
    not?: NestedBoolNullableFilter<$PrismaModel> | boolean | null
  }

  export type NestedEnumUserStatusFilter<$PrismaModel = never> = {
    equals?: $Enums.UserStatus | EnumUserStatusFieldRefInput<$PrismaModel>
    in?: $Enums.UserStatus[] | ListEnumUserStatusFieldRefInput<$PrismaModel>
    notIn?: $Enums.UserStatus[] | ListEnumUserStatusFieldRefInput<$PrismaModel>
    not?: NestedEnumUserStatusFilter<$PrismaModel> | $Enums.UserStatus
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

  export type NestedStringWithAggregatesFilter<$PrismaModel = never> = {
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
    not?: NestedStringWithAggregatesFilter<$PrismaModel> | string
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

  export type NestedDateTimeNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel> | null
    in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel> | null
    notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel> | null
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeNullableWithAggregatesFilter<$PrismaModel> | Date | string | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedDateTimeNullableFilter<$PrismaModel>
    _max?: NestedDateTimeNullableFilter<$PrismaModel>
  }

  export type NestedEnumUserRoleWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.UserRole | EnumUserRoleFieldRefInput<$PrismaModel>
    in?: $Enums.UserRole[] | ListEnumUserRoleFieldRefInput<$PrismaModel>
    notIn?: $Enums.UserRole[] | ListEnumUserRoleFieldRefInput<$PrismaModel>
    not?: NestedEnumUserRoleWithAggregatesFilter<$PrismaModel> | $Enums.UserRole
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedEnumUserRoleFilter<$PrismaModel>
    _max?: NestedEnumUserRoleFilter<$PrismaModel>
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

  export type NestedEnumUserGenderWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.UserGender | EnumUserGenderFieldRefInput<$PrismaModel>
    in?: $Enums.UserGender[] | ListEnumUserGenderFieldRefInput<$PrismaModel>
    notIn?: $Enums.UserGender[] | ListEnumUserGenderFieldRefInput<$PrismaModel>
    not?: NestedEnumUserGenderWithAggregatesFilter<$PrismaModel> | $Enums.UserGender
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedEnumUserGenderFilter<$PrismaModel>
    _max?: NestedEnumUserGenderFilter<$PrismaModel>
  }

  export type NestedEnumUserLanguageNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.UserLanguage | EnumUserLanguageFieldRefInput<$PrismaModel> | null
    in?: $Enums.UserLanguage[] | ListEnumUserLanguageFieldRefInput<$PrismaModel> | null
    notIn?: $Enums.UserLanguage[] | ListEnumUserLanguageFieldRefInput<$PrismaModel> | null
    not?: NestedEnumUserLanguageNullableWithAggregatesFilter<$PrismaModel> | $Enums.UserLanguage | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedEnumUserLanguageNullableFilter<$PrismaModel>
    _max?: NestedEnumUserLanguageNullableFilter<$PrismaModel>
  }

  export type NestedEnumUserTypeAccountWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.UserTypeAccount | EnumUserTypeAccountFieldRefInput<$PrismaModel>
    in?: $Enums.UserTypeAccount[] | ListEnumUserTypeAccountFieldRefInput<$PrismaModel>
    notIn?: $Enums.UserTypeAccount[] | ListEnumUserTypeAccountFieldRefInput<$PrismaModel>
    not?: NestedEnumUserTypeAccountWithAggregatesFilter<$PrismaModel> | $Enums.UserTypeAccount
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedEnumUserTypeAccountFilter<$PrismaModel>
    _max?: NestedEnumUserTypeAccountFilter<$PrismaModel>
  }

  export type NestedEnumPackageTypeWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.PackageType | EnumPackageTypeFieldRefInput<$PrismaModel>
    in?: $Enums.PackageType[] | ListEnumPackageTypeFieldRefInput<$PrismaModel>
    notIn?: $Enums.PackageType[] | ListEnumPackageTypeFieldRefInput<$PrismaModel>
    not?: NestedEnumPackageTypeWithAggregatesFilter<$PrismaModel> | $Enums.PackageType
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedEnumPackageTypeFilter<$PrismaModel>
    _max?: NestedEnumPackageTypeFilter<$PrismaModel>
  }

  export type NestedBoolWithAggregatesFilter<$PrismaModel = never> = {
    equals?: boolean | BooleanFieldRefInput<$PrismaModel>
    not?: NestedBoolWithAggregatesFilter<$PrismaModel> | boolean
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedBoolFilter<$PrismaModel>
    _max?: NestedBoolFilter<$PrismaModel>
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

  export type NestedEnumUserThemeNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.UserTheme | EnumUserThemeFieldRefInput<$PrismaModel> | null
    in?: $Enums.UserTheme[] | ListEnumUserThemeFieldRefInput<$PrismaModel> | null
    notIn?: $Enums.UserTheme[] | ListEnumUserThemeFieldRefInput<$PrismaModel> | null
    not?: NestedEnumUserThemeNullableWithAggregatesFilter<$PrismaModel> | $Enums.UserTheme | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedEnumUserThemeNullableFilter<$PrismaModel>
    _max?: NestedEnumUserThemeNullableFilter<$PrismaModel>
  }

  export type NestedEnumUserCurrencyNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.UserCurrency | EnumUserCurrencyFieldRefInput<$PrismaModel> | null
    in?: $Enums.UserCurrency[] | ListEnumUserCurrencyFieldRefInput<$PrismaModel> | null
    notIn?: $Enums.UserCurrency[] | ListEnumUserCurrencyFieldRefInput<$PrismaModel> | null
    not?: NestedEnumUserCurrencyNullableWithAggregatesFilter<$PrismaModel> | $Enums.UserCurrency | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedEnumUserCurrencyNullableFilter<$PrismaModel>
    _max?: NestedEnumUserCurrencyNullableFilter<$PrismaModel>
  }

  export type NestedBoolNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: boolean | BooleanFieldRefInput<$PrismaModel> | null
    not?: NestedBoolNullableWithAggregatesFilter<$PrismaModel> | boolean | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedBoolNullableFilter<$PrismaModel>
    _max?: NestedBoolNullableFilter<$PrismaModel>
  }

  export type NestedEnumUserStatusWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.UserStatus | EnumUserStatusFieldRefInput<$PrismaModel>
    in?: $Enums.UserStatus[] | ListEnumUserStatusFieldRefInput<$PrismaModel>
    notIn?: $Enums.UserStatus[] | ListEnumUserStatusFieldRefInput<$PrismaModel>
    not?: NestedEnumUserStatusWithAggregatesFilter<$PrismaModel> | $Enums.UserStatus
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedEnumUserStatusFilter<$PrismaModel>
    _max?: NestedEnumUserStatusFilter<$PrismaModel>
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

  export type NestedEnumUnitDifficultyFilter<$PrismaModel = never> = {
    equals?: $Enums.UnitDifficulty | EnumUnitDifficultyFieldRefInput<$PrismaModel>
    in?: $Enums.UnitDifficulty[] | ListEnumUnitDifficultyFieldRefInput<$PrismaModel>
    notIn?: $Enums.UnitDifficulty[] | ListEnumUnitDifficultyFieldRefInput<$PrismaModel>
    not?: NestedEnumUnitDifficultyFilter<$PrismaModel> | $Enums.UnitDifficulty
  }

  export type NestedEnumUnitStatusFilter<$PrismaModel = never> = {
    equals?: $Enums.UnitStatus | EnumUnitStatusFieldRefInput<$PrismaModel>
    in?: $Enums.UnitStatus[] | ListEnumUnitStatusFieldRefInput<$PrismaModel>
    notIn?: $Enums.UnitStatus[] | ListEnumUnitStatusFieldRefInput<$PrismaModel>
    not?: NestedEnumUnitStatusFilter<$PrismaModel> | $Enums.UnitStatus
  }

  export type NestedEnumUnitDifficultyWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.UnitDifficulty | EnumUnitDifficultyFieldRefInput<$PrismaModel>
    in?: $Enums.UnitDifficulty[] | ListEnumUnitDifficultyFieldRefInput<$PrismaModel>
    notIn?: $Enums.UnitDifficulty[] | ListEnumUnitDifficultyFieldRefInput<$PrismaModel>
    not?: NestedEnumUnitDifficultyWithAggregatesFilter<$PrismaModel> | $Enums.UnitDifficulty
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedEnumUnitDifficultyFilter<$PrismaModel>
    _max?: NestedEnumUnitDifficultyFilter<$PrismaModel>
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

  export type NestedEnumUnitStatusWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.UnitStatus | EnumUnitStatusFieldRefInput<$PrismaModel>
    in?: $Enums.UnitStatus[] | ListEnumUnitStatusFieldRefInput<$PrismaModel>
    notIn?: $Enums.UnitStatus[] | ListEnumUnitStatusFieldRefInput<$PrismaModel>
    not?: NestedEnumUnitStatusWithAggregatesFilter<$PrismaModel> | $Enums.UnitStatus
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedEnumUnitStatusFilter<$PrismaModel>
    _max?: NestedEnumUnitStatusFilter<$PrismaModel>
  }

  export type TokenCreateWithoutUserInput = {
    id?: string
    token: string
    deviceId: string
    isDeleted?: boolean
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type TokenUncheckedCreateWithoutUserInput = {
    id?: string
    token: string
    deviceId: string
    isDeleted?: boolean
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type TokenCreateOrConnectWithoutUserInput = {
    where: TokenWhereUniqueInput
    create: XOR<TokenCreateWithoutUserInput, TokenUncheckedCreateWithoutUserInput>
  }

  export type TokenCreateManyUserInputEnvelope = {
    data: TokenCreateManyUserInput | TokenCreateManyUserInput[]
    skipDuplicates?: boolean
  }

  export type TokenUpsertWithWhereUniqueWithoutUserInput = {
    where: TokenWhereUniqueInput
    update: XOR<TokenUpdateWithoutUserInput, TokenUncheckedUpdateWithoutUserInput>
    create: XOR<TokenCreateWithoutUserInput, TokenUncheckedCreateWithoutUserInput>
  }

  export type TokenUpdateWithWhereUniqueWithoutUserInput = {
    where: TokenWhereUniqueInput
    data: XOR<TokenUpdateWithoutUserInput, TokenUncheckedUpdateWithoutUserInput>
  }

  export type TokenUpdateManyWithWhereWithoutUserInput = {
    where: TokenScalarWhereInput
    data: XOR<TokenUpdateManyMutationInput, TokenUncheckedUpdateManyWithoutUserInput>
  }

  export type TokenScalarWhereInput = {
    AND?: TokenScalarWhereInput | TokenScalarWhereInput[]
    OR?: TokenScalarWhereInput[]
    NOT?: TokenScalarWhereInput | TokenScalarWhereInput[]
    id?: StringFilter<"Token"> | string
    userId?: StringFilter<"Token"> | string
    token?: StringFilter<"Token"> | string
    deviceId?: StringFilter<"Token"> | string
    isDeleted?: BoolFilter<"Token"> | boolean
    createdAt?: DateTimeFilter<"Token"> | Date | string
    updatedAt?: DateTimeFilter<"Token"> | Date | string
  }

  export type UserCreateWithoutTokenInput = {
    id?: string
    fullname: string
    username: string
    email: string
    password: string
    birthDate?: Date | string | null
    role: $Enums.UserRole
    slug: string
    avatar?: string | null
    cover?: string | null
    phone: string
    gender: $Enums.UserGender
    language?: $Enums.UserLanguage | null
    province?: string | null
    parentId?: string | null
    teacherId?: string | null
    typeAccount: $Enums.UserTypeAccount
    googleId?: string | null
    facebookId?: string | null
    accountPackage: $Enums.PackageType
    isVerify?: boolean
    codeVerify?: string | null
    tokenVerify?: string | null
    refCode?: string | null
    invitedById?: string | null
    exp?: number | null
    streakDays?: number | null
    progressLevel?: number | null
    totalLessonsCompleted?: number | null
    theme?: $Enums.UserTheme | null
    currency?: $Enums.UserCurrency | null
    enableNotifications?: boolean | null
    enableNotificationEmails?: boolean | null
    status?: $Enums.UserStatus
    lastLoginAt?: Date | string | null
    createdById?: string | null
    updatedById?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type UserUncheckedCreateWithoutTokenInput = {
    id?: string
    fullname: string
    username: string
    email: string
    password: string
    birthDate?: Date | string | null
    role: $Enums.UserRole
    slug: string
    avatar?: string | null
    cover?: string | null
    phone: string
    gender: $Enums.UserGender
    language?: $Enums.UserLanguage | null
    province?: string | null
    parentId?: string | null
    teacherId?: string | null
    typeAccount: $Enums.UserTypeAccount
    googleId?: string | null
    facebookId?: string | null
    accountPackage: $Enums.PackageType
    isVerify?: boolean
    codeVerify?: string | null
    tokenVerify?: string | null
    refCode?: string | null
    invitedById?: string | null
    exp?: number | null
    streakDays?: number | null
    progressLevel?: number | null
    totalLessonsCompleted?: number | null
    theme?: $Enums.UserTheme | null
    currency?: $Enums.UserCurrency | null
    enableNotifications?: boolean | null
    enableNotificationEmails?: boolean | null
    status?: $Enums.UserStatus
    lastLoginAt?: Date | string | null
    createdById?: string | null
    updatedById?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type UserCreateOrConnectWithoutTokenInput = {
    where: UserWhereUniqueInput
    create: XOR<UserCreateWithoutTokenInput, UserUncheckedCreateWithoutTokenInput>
  }

  export type UserUpsertWithoutTokenInput = {
    update: XOR<UserUpdateWithoutTokenInput, UserUncheckedUpdateWithoutTokenInput>
    create: XOR<UserCreateWithoutTokenInput, UserUncheckedCreateWithoutTokenInput>
    where?: UserWhereInput
  }

  export type UserUpdateToOneWithWhereWithoutTokenInput = {
    where?: UserWhereInput
    data: XOR<UserUpdateWithoutTokenInput, UserUncheckedUpdateWithoutTokenInput>
  }

  export type UserUpdateWithoutTokenInput = {
    id?: StringFieldUpdateOperationsInput | string
    fullname?: StringFieldUpdateOperationsInput | string
    username?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    password?: StringFieldUpdateOperationsInput | string
    birthDate?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    role?: EnumUserRoleFieldUpdateOperationsInput | $Enums.UserRole
    slug?: StringFieldUpdateOperationsInput | string
    avatar?: NullableStringFieldUpdateOperationsInput | string | null
    cover?: NullableStringFieldUpdateOperationsInput | string | null
    phone?: StringFieldUpdateOperationsInput | string
    gender?: EnumUserGenderFieldUpdateOperationsInput | $Enums.UserGender
    language?: NullableEnumUserLanguageFieldUpdateOperationsInput | $Enums.UserLanguage | null
    province?: NullableStringFieldUpdateOperationsInput | string | null
    parentId?: NullableStringFieldUpdateOperationsInput | string | null
    teacherId?: NullableStringFieldUpdateOperationsInput | string | null
    typeAccount?: EnumUserTypeAccountFieldUpdateOperationsInput | $Enums.UserTypeAccount
    googleId?: NullableStringFieldUpdateOperationsInput | string | null
    facebookId?: NullableStringFieldUpdateOperationsInput | string | null
    accountPackage?: EnumPackageTypeFieldUpdateOperationsInput | $Enums.PackageType
    isVerify?: BoolFieldUpdateOperationsInput | boolean
    codeVerify?: NullableStringFieldUpdateOperationsInput | string | null
    tokenVerify?: NullableStringFieldUpdateOperationsInput | string | null
    refCode?: NullableStringFieldUpdateOperationsInput | string | null
    invitedById?: NullableStringFieldUpdateOperationsInput | string | null
    exp?: NullableIntFieldUpdateOperationsInput | number | null
    streakDays?: NullableIntFieldUpdateOperationsInput | number | null
    progressLevel?: NullableIntFieldUpdateOperationsInput | number | null
    totalLessonsCompleted?: NullableIntFieldUpdateOperationsInput | number | null
    theme?: NullableEnumUserThemeFieldUpdateOperationsInput | $Enums.UserTheme | null
    currency?: NullableEnumUserCurrencyFieldUpdateOperationsInput | $Enums.UserCurrency | null
    enableNotifications?: NullableBoolFieldUpdateOperationsInput | boolean | null
    enableNotificationEmails?: NullableBoolFieldUpdateOperationsInput | boolean | null
    status?: EnumUserStatusFieldUpdateOperationsInput | $Enums.UserStatus
    lastLoginAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    createdById?: NullableStringFieldUpdateOperationsInput | string | null
    updatedById?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type UserUncheckedUpdateWithoutTokenInput = {
    id?: StringFieldUpdateOperationsInput | string
    fullname?: StringFieldUpdateOperationsInput | string
    username?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    password?: StringFieldUpdateOperationsInput | string
    birthDate?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    role?: EnumUserRoleFieldUpdateOperationsInput | $Enums.UserRole
    slug?: StringFieldUpdateOperationsInput | string
    avatar?: NullableStringFieldUpdateOperationsInput | string | null
    cover?: NullableStringFieldUpdateOperationsInput | string | null
    phone?: StringFieldUpdateOperationsInput | string
    gender?: EnumUserGenderFieldUpdateOperationsInput | $Enums.UserGender
    language?: NullableEnumUserLanguageFieldUpdateOperationsInput | $Enums.UserLanguage | null
    province?: NullableStringFieldUpdateOperationsInput | string | null
    parentId?: NullableStringFieldUpdateOperationsInput | string | null
    teacherId?: NullableStringFieldUpdateOperationsInput | string | null
    typeAccount?: EnumUserTypeAccountFieldUpdateOperationsInput | $Enums.UserTypeAccount
    googleId?: NullableStringFieldUpdateOperationsInput | string | null
    facebookId?: NullableStringFieldUpdateOperationsInput | string | null
    accountPackage?: EnumPackageTypeFieldUpdateOperationsInput | $Enums.PackageType
    isVerify?: BoolFieldUpdateOperationsInput | boolean
    codeVerify?: NullableStringFieldUpdateOperationsInput | string | null
    tokenVerify?: NullableStringFieldUpdateOperationsInput | string | null
    refCode?: NullableStringFieldUpdateOperationsInput | string | null
    invitedById?: NullableStringFieldUpdateOperationsInput | string | null
    exp?: NullableIntFieldUpdateOperationsInput | number | null
    streakDays?: NullableIntFieldUpdateOperationsInput | number | null
    progressLevel?: NullableIntFieldUpdateOperationsInput | number | null
    totalLessonsCompleted?: NullableIntFieldUpdateOperationsInput | number | null
    theme?: NullableEnumUserThemeFieldUpdateOperationsInput | $Enums.UserTheme | null
    currency?: NullableEnumUserCurrencyFieldUpdateOperationsInput | $Enums.UserCurrency | null
    enableNotifications?: NullableBoolFieldUpdateOperationsInput | boolean | null
    enableNotificationEmails?: NullableBoolFieldUpdateOperationsInput | boolean | null
    status?: EnumUserStatusFieldUpdateOperationsInput | $Enums.UserStatus
    lastLoginAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    createdById?: NullableStringFieldUpdateOperationsInput | string | null
    updatedById?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type TokenCreateManyUserInput = {
    id?: string
    token: string
    deviceId: string
    isDeleted?: boolean
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type TokenUpdateWithoutUserInput = {
    id?: StringFieldUpdateOperationsInput | string
    token?: StringFieldUpdateOperationsInput | string
    deviceId?: StringFieldUpdateOperationsInput | string
    isDeleted?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type TokenUncheckedUpdateWithoutUserInput = {
    id?: StringFieldUpdateOperationsInput | string
    token?: StringFieldUpdateOperationsInput | string
    deviceId?: StringFieldUpdateOperationsInput | string
    isDeleted?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type TokenUncheckedUpdateManyWithoutUserInput = {
    id?: StringFieldUpdateOperationsInput | string
    token?: StringFieldUpdateOperationsInput | string
    deviceId?: StringFieldUpdateOperationsInput | string
    isDeleted?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
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