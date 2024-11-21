import { UserContext } from "@/providers/user";
import { useContext } from "react";

export const useUser = () => useContext(UserContext);
