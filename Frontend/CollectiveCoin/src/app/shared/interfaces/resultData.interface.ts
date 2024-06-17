interface resultData {
  status: string;
  resetToken?: string;
  messege: string;
  data?: data;
  token?: string;
  refreshToken?: string;
}

interface data {
  user: user;
}

interface user {
  role: string;
  name: string;
  email: string;
  photo: string;
  isEarning: boolean;
  priority: number;
}
export default resultData;
