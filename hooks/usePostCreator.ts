import {useAppSelector} from "@/store";

export const usePostCreator = (creator: string | User | undefined): string => {
  const currentUser = useAppSelector((state) => state.user.user);

  // If creator is not defined, return 'User'
  if (!creator) return "User";

  // If creator is a User object, just use its username
  if (typeof creator !== "string") {
    return creator.username || "User";
  }

  // If creator is the logged-in user, just use their username from redux
  if (currentUser && creator === currentUser._id) {
    return currentUser.username || "User";
  }

  return "User";
};