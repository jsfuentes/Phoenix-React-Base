type PresenceById = Record<string, UserPresenceInfo>;

interface UserStatusState extends Omit<Partial<User>, "socket_token"> {
  status: UserStatusStatus;
}

interface UserPresenceInfo extends UserStatusState {
  //   is_admin: boolean;
  online_at: string;
  phx_ref: string;
  phx_ref_prev: string;
}

type UserStatusStatus = "online" | "active";
