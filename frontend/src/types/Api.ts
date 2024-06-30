/* eslint-disable */
/* tslint:disable */
/*
 * ---------------------------------------------------------------
 * ## THIS FILE WAS GENERATED VIA SWAGGER-TYPESCRIPT-API        ##
 * ##                                                           ##
 * ## AUTHOR: acacode                                           ##
 * ## SOURCE: https://github.com/acacode/swagger-typescript-api ##
 * ---------------------------------------------------------------
 */

export interface CreateUserDto {
  username: string;
  password: string;
}

export interface Club {
  id: string;
  name: string;
  matches: Match[];
  userClubs: UserClub[];
}

export interface Match {
  id: string;
  club: Club;
  confirmedUsers: User[];
  teamA: User[];
  teamB: User[];
  goalsTeamA: string[];
  goalsTeamB: string[];
  playerPositions: string[];
  date: string;
  location: string;
  ratings: PlayerRating[];
}

export interface PlayerRating {
  id: string;
  match: Match;
  reviewer: User;
  reviewee: User;
  rating: number;
}

export interface User {
  id: string;
  username: string;
  password: string;
  userClubs: UserClub[];
  givenRatings: PlayerRating[];
  receivedRatings: PlayerRating[];
  matches: Match[];
}

export interface UserClub {
  id: string;
  role: string;
  user: User;
  club: Club;
}

export interface CreateClubDto {
  name: string;
}

export interface UpdateClubDto {
  name?: string;
}

export interface CreateInviteLinkDto {
  clubName: string;
}

export interface InviteClubDto {
  clubName: string;
  inviteToken: string;
}

export interface CreateUserClubDto {
  userId: string;
  clubId: string;
  role: 'admin' | 'owner' | 'member';
}

export interface UpdateUserClubDto {
  userId?: string;
  clubId?: string;
  role?: 'admin' | 'owner' | 'member';
}

export interface CreateMatchDto {
  clubName: string;
  date: string;
  location: string;
}

export interface ConfirmParticipationDto {
  matchId: string;
  position: 'GK' | 'DEF' | 'MID' | 'FWD';
}

export interface RecordGoalDto {
  userId: string;
  team: 'A' | 'B';
}

export interface CreatePlayerRatingDto {
  matchId: string;
  revieweeId: string;
  /**
   * @min 1
   * @max 5
   */
  rating: number;
}

export type QueryParamsType = Record<string | number, any>;
export type ResponseFormat = keyof Omit<Body, 'body' | 'bodyUsed'>;

export interface FullRequestParams extends Omit<RequestInit, 'body'> {
  /** set parameter to `true` for call `securityWorker` for this request */
  secure?: boolean;
  /** request path */
  path: string;
  /** content type of request body */
  type?: ContentType;
  /** query params */
  query?: QueryParamsType;
  /** format of response (i.e. response.json() -> format: "json") */
  format?: ResponseFormat;
  /** request body */
  body?: unknown;
  /** base url */
  baseUrl?: string;
  /** request cancellation token */
  cancelToken?: CancelToken;
}

export type RequestParams = Omit<FullRequestParams, 'body' | 'method' | 'query' | 'path'>;

export interface ApiConfig<SecurityDataType = unknown> {
  baseUrl?: string;
  baseApiParams?: Omit<RequestParams, 'baseUrl' | 'cancelToken' | 'signal'>;
  securityWorker?: (securityData: SecurityDataType | null) => Promise<RequestParams | void> | RequestParams | void;
  customFetch?: typeof fetch;
}

export interface HttpResponse<D extends unknown, E extends unknown = unknown> extends Response {
  data: D;
  error: E;
}

type CancelToken = Symbol | string | number;

export enum ContentType {
  Json = 'application/json',
  FormData = 'multipart/form-data',
  UrlEncoded = 'application/x-www-form-urlencoded',
  Text = 'text/plain'
}

export class HttpClient<SecurityDataType = unknown> {
  public baseUrl: string = '';
  private securityData: SecurityDataType | null = null;
  private securityWorker?: ApiConfig<SecurityDataType>['securityWorker'];
  private abortControllers = new Map<CancelToken, AbortController>();
  private customFetch = (...fetchParams: Parameters<typeof fetch>) => fetch(...fetchParams);

  private baseApiParams: RequestParams = {
    credentials: 'same-origin',
    headers: {},
    redirect: 'follow',
    referrerPolicy: 'no-referrer'
  };

  constructor(apiConfig: ApiConfig<SecurityDataType> = {}) {
    Object.assign(this, apiConfig);
  }

  public setSecurityData = (data: SecurityDataType | null) => {
    this.securityData = data;
  };

  protected encodeQueryParam(key: string, value: any) {
    const encodedKey = encodeURIComponent(key);
    return `${encodedKey}=${encodeURIComponent(typeof value === 'number' ? value : `${value}`)}`;
  }

  protected addQueryParam(query: QueryParamsType, key: string) {
    return this.encodeQueryParam(key, query[key]);
  }

  protected addArrayQueryParam(query: QueryParamsType, key: string) {
    const value = query[key];
    return value.map((v: any) => this.encodeQueryParam(key, v)).join('&');
  }

  protected toQueryString(rawQuery?: QueryParamsType): string {
    const query = rawQuery || {};
    const keys = Object.keys(query).filter((key) => 'undefined' !== typeof query[key]);
    return keys
      .map((key) => (Array.isArray(query[key]) ? this.addArrayQueryParam(query, key) : this.addQueryParam(query, key)))
      .join('&');
  }

  protected addQueryParams(rawQuery?: QueryParamsType): string {
    const queryString = this.toQueryString(rawQuery);
    return queryString ? `?${queryString}` : '';
  }

  private contentFormatters: Record<ContentType, (input: any) => any> = {
    [ContentType.Json]: (input: any) =>
      input !== null && (typeof input === 'object' || typeof input === 'string') ? JSON.stringify(input) : input,
    [ContentType.Text]: (input: any) => (input !== null && typeof input !== 'string' ? JSON.stringify(input) : input),
    [ContentType.FormData]: (input: any) =>
      Object.keys(input || {}).reduce((formData, key) => {
        const property = input[key];
        formData.append(
          key,
          property instanceof Blob
            ? property
            : typeof property === 'object' && property !== null
              ? JSON.stringify(property)
              : `${property}`
        );
        return formData;
      }, new FormData()),
    [ContentType.UrlEncoded]: (input: any) => this.toQueryString(input)
  };

  protected mergeRequestParams(params1: RequestParams, params2?: RequestParams): RequestParams {
    return {
      ...this.baseApiParams,
      ...params1,
      ...(params2 || {}),
      headers: {
        ...(this.baseApiParams.headers || {}),
        ...(params1.headers || {}),
        ...((params2 && params2.headers) || {})
      }
    };
  }

  protected createAbortSignal = (cancelToken: CancelToken): AbortSignal | undefined => {
    if (this.abortControllers.has(cancelToken)) {
      const abortController = this.abortControllers.get(cancelToken);
      if (abortController) {
        return abortController.signal;
      }
      return void 0;
    }

    const abortController = new AbortController();
    this.abortControllers.set(cancelToken, abortController);
    return abortController.signal;
  };

  public abortRequest = (cancelToken: CancelToken) => {
    const abortController = this.abortControllers.get(cancelToken);

    if (abortController) {
      abortController.abort();
      this.abortControllers.delete(cancelToken);
    }
  };

  public request = async <T = any, E = any>({
    body,
    secure,
    path,
    type,
    query,
    format,
    baseUrl,
    cancelToken,
    ...params
  }: FullRequestParams): Promise<HttpResponse<T, E>> => {
    const secureParams =
      ((typeof secure === 'boolean' ? secure : this.baseApiParams.secure) &&
        this.securityWorker &&
        (await this.securityWorker(this.securityData))) ||
      {};
    const requestParams = this.mergeRequestParams(params, secureParams);
    const queryString = query && this.toQueryString(query);
    const payloadFormatter = this.contentFormatters[type || ContentType.Json];
    const responseFormat = format || requestParams.format;

    return this.customFetch(`${baseUrl || this.baseUrl || ''}${path}${queryString ? `?${queryString}` : ''}`, {
      ...requestParams,
      headers: {
        ...(requestParams.headers || {}),
        ...(type && type !== ContentType.FormData ? { 'Content-Type': type } : {})
      },
      signal: (cancelToken ? this.createAbortSignal(cancelToken) : requestParams.signal) || null,
      body: typeof body === 'undefined' || body === null ? null : payloadFormatter(body)
    }).then(async (response) => {
      const r = response.clone() as HttpResponse<T, E>;
      r.data = null as unknown as T;
      r.error = null as unknown as E;

      const data = !responseFormat
        ? r
        : await response[responseFormat]()
            .then((data) => {
              if (r.ok) {
                r.data = data;
              } else {
                r.error = data;
              }
              return r;
            })
            .catch((e) => {
              r.error = e;
              return r;
            });

      if (cancelToken) {
        this.abortControllers.delete(cancelToken);
      }

      if (!response.ok) throw data;
      return data;
    });
  };
}

/**
 * @title Soccer Matches
 * @version 1.0
 * @contact
 *
 * The Soccer Matches API
 */
export class Api<SecurityDataType extends unknown> extends HttpClient<SecurityDataType> {
  /**
   * No description
   *
   * @name AppControllerGetHello
   * @request GET:/
   * @secure
   */
  appControllerGetHello = (params: RequestParams = {}) =>
    this.request<string, any>({
      path: `/`,
      method: 'GET',
      secure: true,
      format: 'json',
      ...params
    });

  auth = {
    /**
     * No description
     *
     * @name AuthControllerLogin
     * @request POST:/auth/login
     * @secure
     */
    authControllerLogin: (data: CreateUserDto, params: RequestParams = {}) =>
      this.request<void, any>({
        path: `/auth/login`,
        method: 'POST',
        body: data,
        secure: true,
        type: ContentType.Json,
        ...params
      }),

    /**
     * No description
     *
     * @name AuthControllerRegister
     * @request POST:/auth/register
     * @secure
     */
    authControllerRegister: (data: CreateUserDto, params: RequestParams = {}) =>
      this.request<void, any>({
        path: `/auth/register`,
        method: 'POST',
        body: data,
        secure: true,
        type: ContentType.Json,
        ...params
      }),

    /**
     * No description
     *
     * @name AuthControllerProfile
     * @request GET:/auth/profile
     * @secure
     */
    authControllerProfile: (params: RequestParams = {}) =>
      this.request<string, any>({
        path: `/auth/profile`,
        method: 'GET',
        secure: true,
        format: 'json',
        ...params
      })
  };
  users = {
    /**
     * No description
     *
     * @name UserControllerGetMe
     * @request GET:/users/me
     * @secure
     */
    userControllerGetMe: (params: RequestParams = {}) =>
      this.request<User, any>({
        path: `/users/me`,
        method: 'GET',
        secure: true,
        format: 'json',
        ...params
      }),

    /**
     * No description
     *
     * @name UserControllerGetUser
     * @request GET:/users/{username}
     * @secure
     */
    userControllerGetUser: (username: string, params: RequestParams = {}) =>
      this.request<User, any>({
        path: `/users/${username}`,
        method: 'GET',
        secure: true,
        format: 'json',
        ...params
      })
  };
  clubs = {
    /**
     * No description
     *
     * @name ClubsControllerCreate
     * @request POST:/clubs
     * @secure
     */
    clubsControllerCreate: (data: CreateClubDto, params: RequestParams = {}) =>
      this.request<Club, any>({
        path: `/clubs`,
        method: 'POST',
        body: data,
        secure: true,
        type: ContentType.Json,
        format: 'json',
        ...params
      }),

    /**
     * No description
     *
     * @name ClubsControllerFindAll
     * @request GET:/clubs
     * @secure
     */
    clubsControllerFindAll: (params: RequestParams = {}) =>
      this.request<Club[], any>({
        path: `/clubs`,
        method: 'GET',
        secure: true,
        format: 'json',
        ...params
      }),

    /**
     * No description
     *
     * @name ClubsControllerFindOne
     * @request GET:/clubs/{name}
     * @secure
     */
    clubsControllerFindOne: (name: string, params: RequestParams = {}) =>
      this.request<Club, any>({
        path: `/clubs/${name}`,
        method: 'GET',
        secure: true,
        format: 'json',
        ...params
      }),

    /**
     * No description
     *
     * @name ClubsControllerUpdate
     * @request PATCH:/clubs/{name}
     * @secure
     */
    clubsControllerUpdate: (name: string, data: UpdateClubDto, params: RequestParams = {}) =>
      this.request<void, any>({
        path: `/clubs/${name}`,
        method: 'PATCH',
        body: data,
        secure: true,
        type: ContentType.Json,
        ...params
      }),

    /**
     * No description
     *
     * @name ClubsControllerRemove
     * @request DELETE:/clubs/{name}
     * @secure
     */
    clubsControllerRemove: (name: string, params: RequestParams = {}) =>
      this.request<void, any>({
        path: `/clubs/${name}`,
        method: 'DELETE',
        secure: true,
        ...params
      }),

    /**
     * No description
     *
     * @name ClubsControllerFindClubsByUser
     * @request GET:/clubs/user/me
     * @secure
     */
    clubsControllerFindClubsByUser: (params: RequestParams = {}) =>
      this.request<Club[], any>({
        path: `/clubs/user/me`,
        method: 'GET',
        secure: true,
        format: 'json',
        ...params
      }),

    /**
     * No description
     *
     * @name ClubsControllerIsUserAdmin
     * @request GET:/clubs/{name}/is-admin
     * @secure
     */
    clubsControllerIsUserAdmin: (name: string, params: RequestParams = {}) =>
      this.request<boolean, any>({
        path: `/clubs/${name}/is-admin`,
        method: 'GET',
        secure: true,
        format: 'json',
        ...params
      }),

    /**
     * No description
     *
     * @name ClubsControllerGenerateInviteLink
     * @request POST:/clubs/invite
     * @secure
     */
    clubsControllerGenerateInviteLink: (data: CreateInviteLinkDto, params: RequestParams = {}) =>
      this.request<void, any>({
        path: `/clubs/invite`,
        method: 'POST',
        body: data,
        secure: true,
        type: ContentType.Json,
        ...params
      }),

    /**
     * No description
     *
     * @name ClubsControllerJoinClub
     * @request POST:/clubs/join
     * @secure
     */
    clubsControllerJoinClub: (data: InviteClubDto, params: RequestParams = {}) =>
      this.request<UserClub, any>({
        path: `/clubs/join`,
        method: 'POST',
        body: data,
        secure: true,
        type: ContentType.Json,
        format: 'json',
        ...params
      }),

    /**
     * No description
     *
     * @name ClubsControllerFindMostActiveUsers
     * @request GET:/clubs/{name}/users/most-active
     * @secure
     */
    clubsControllerFindMostActiveUsers: (name: string, params: RequestParams = {}) =>
      this.request<void, any>({
        path: `/clubs/${name}/users/most-active`,
        method: 'GET',
        secure: true,
        ...params
      }),

    /**
     * No description
     *
     * @name ClubsControllerFindRankings
     * @request GET:/clubs/{name}/users/most-ranked
     * @secure
     */
    clubsControllerFindRankings: (name: string, params: RequestParams = {}) =>
      this.request<void, any>({
        path: `/clubs/${name}/users/most-ranked`,
        method: 'GET',
        secure: true,
        ...params
      })
  };
  userClub = {
    /**
     * No description
     *
     * @name UserClubControllerCreate
     * @request POST:/user-club
     * @secure
     */
    userClubControllerCreate: (data: CreateUserClubDto, params: RequestParams = {}) =>
      this.request<UserClub, any>({
        path: `/user-club`,
        method: 'POST',
        body: data,
        secure: true,
        type: ContentType.Json,
        format: 'json',
        ...params
      }),

    /**
     * No description
     *
     * @name UserClubControllerFindAll
     * @request GET:/user-club
     * @secure
     */
    userClubControllerFindAll: (params: RequestParams = {}) =>
      this.request<UserClub[], any>({
        path: `/user-club`,
        method: 'GET',
        secure: true,
        format: 'json',
        ...params
      }),

    /**
     * No description
     *
     * @name UserClubControllerFindOne
     * @request GET:/user-club/{id}
     * @secure
     */
    userClubControllerFindOne: (id: string, params: RequestParams = {}) =>
      this.request<UserClub, any>({
        path: `/user-club/${id}`,
        method: 'GET',
        secure: true,
        format: 'json',
        ...params
      }),

    /**
     * No description
     *
     * @name UserClubControllerUpdate
     * @request PATCH:/user-club/{id}
     * @secure
     */
    userClubControllerUpdate: (id: string, data: UpdateUserClubDto, params: RequestParams = {}) =>
      this.request<UserClub, any>({
        path: `/user-club/${id}`,
        method: 'PATCH',
        body: data,
        secure: true,
        type: ContentType.Json,
        format: 'json',
        ...params
      }),

    /**
     * No description
     *
     * @name UserClubControllerRemove
     * @request DELETE:/user-club/{id}
     * @secure
     */
    userClubControllerRemove: (id: string, params: RequestParams = {}) =>
      this.request<void, any>({
        path: `/user-club/${id}`,
        method: 'DELETE',
        secure: true,
        ...params
      }),

    /**
     * No description
     *
     * @name UserClubControllerGetUsersWithRolesForClubByName
     * @request GET:/user-club/club/{clubName}/users
     * @secure
     */
    userClubControllerGetUsersWithRolesForClubByName: (clubName: string, params: RequestParams = {}) =>
      this.request<UserClub[], any>({
        path: `/user-club/club/${clubName}/users`,
        method: 'GET',
        secure: true,
        format: 'json',
        ...params
      })
  };
  matches = {
    /**
     * No description
     *
     * @name MatchControllerCreate
     * @request POST:/matches
     * @secure
     */
    matchControllerCreate: (data: CreateMatchDto, params: RequestParams = {}) =>
      this.request<Match, any>({
        path: `/matches`,
        method: 'POST',
        body: data,
        secure: true,
        type: ContentType.Json,
        format: 'json',
        ...params
      }),

    /**
     * No description
     *
     * @name MatchControllerConfirmParticipation
     * @request POST:/matches/{id}/confirm
     * @secure
     */
    matchControllerConfirmParticipation: (id: string, data: ConfirmParticipationDto, params: RequestParams = {}) =>
      this.request<Match, any>({
        path: `/matches/${id}/confirm`,
        method: 'POST',
        body: data,
        secure: true,
        type: ContentType.Json,
        format: 'json',
        ...params
      }),

    /**
     * No description
     *
     * @name MatchControllerDivideTeams
     * @request POST:/matches/{id}/divide-teams
     * @secure
     */
    matchControllerDivideTeams: (id: string, params: RequestParams = {}) =>
      this.request<Match, any>({
        path: `/matches/${id}/divide-teams`,
        method: 'POST',
        secure: true,
        format: 'json',
        ...params
      }),

    /**
     * No description
     *
     * @name MatchControllerRecordGoal
     * @request POST:/matches/{id}/record-goal
     * @secure
     */
    matchControllerRecordGoal: (id: string, data: RecordGoalDto, params: RequestParams = {}) =>
      this.request<Match, any>({
        path: `/matches/${id}/record-goal`,
        method: 'POST',
        body: data,
        secure: true,
        type: ContentType.Json,
        format: 'json',
        ...params
      }),

    /**
     * No description
     *
     * @name MatchControllerFindOne
     * @request GET:/matches/{id}
     * @secure
     */
    matchControllerFindOne: (id: string, params: RequestParams = {}) =>
      this.request<Match, any>({
        path: `/matches/${id}`,
        method: 'GET',
        secure: true,
        format: 'json',
        ...params
      }),

    /**
     * No description
     *
     * @name MatchControllerFindUpcomingMatchesForUser
     * @request GET:/matches/user/me/upcoming
     * @secure
     */
    matchControllerFindUpcomingMatchesForUser: (params: RequestParams = {}) =>
      this.request<Match[], any>({
        path: `/matches/user/me/upcoming`,
        method: 'GET',
        secure: true,
        format: 'json',
        ...params
      }),

    /**
     * No description
     *
     * @name MatchControllerFindPastMatchesForUser
     * @request GET:/matches/user/me/past
     * @secure
     */
    matchControllerFindPastMatchesForUser: (params: RequestParams = {}) =>
      this.request<Match[], any>({
        path: `/matches/user/me/past`,
        method: 'GET',
        secure: true,
        format: 'json',
        ...params
      }),

    /**
     * No description
     *
     * @name MatchControllerFindUpcomingMatchesForClub
     * @request GET:/matches/club/{clubName}/upcoming
     * @secure
     */
    matchControllerFindUpcomingMatchesForClub: (clubName: string, params: RequestParams = {}) =>
      this.request<Match[], any>({
        path: `/matches/club/${clubName}/upcoming`,
        method: 'GET',
        secure: true,
        format: 'json',
        ...params
      })
  };
  playerRatings = {
    /**
     * No description
     *
     * @name PlayerRatingsControllerCreate
     * @request POST:/player-ratings
     * @secure
     */
    playerRatingsControllerCreate: (data: CreatePlayerRatingDto, params: RequestParams = {}) =>
      this.request<PlayerRating, any>({
        path: `/player-ratings`,
        method: 'POST',
        body: data,
        secure: true,
        type: ContentType.Json,
        format: 'json',
        ...params
      })
  };
}
