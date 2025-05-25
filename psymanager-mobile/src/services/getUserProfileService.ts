import { fetcher } from "../utils/fetcher";
import { UserProfileDto } from "../types/userTypes";

export const getUserProfile = async (): Promise<UserProfileDto> => {
  return await fetcher("/api/users/me/profile");
};
