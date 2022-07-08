interface User {
  id: string;
  email: string;
  name: string;
  headline: string;
  picture: string;
  type: string;
  social_links: Array<string>;
  local: string;
  organization_id: string;
  organization_type: string;
  socket_token: string;
  testing?: boolean;
}

interface UserAdminPreview {
  id: string;
  email: string;
  name: string;
  headline: string;
  picture: string;
  is_admin: boolean;
}
