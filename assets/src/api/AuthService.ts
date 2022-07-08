import { axios } from "src/api/axios";

const AuthService = { onAuth };

export default AuthService;

interface OnAuthRequest {
  id: string;
  invite_token?: string;
  default_event?: string;
  route?: string;
  email?: string;
}

// Empty response body expected
interface OnAuthResponse {}

async function onAuth(authParams: OnAuthRequest): Promise<OnAuthResponse> {
  try {
    const resp = await axios.post<OnAuthResponse>("/api/on_auth", {
      ...authParams,
    });

    return resp.data;
  } catch (err) {
    throw err;
  }
}
