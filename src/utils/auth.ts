import { useSelector } from "react-redux";
import { Role } from "../enum/user.enum";
import { RootState } from "../redux/store";

export const useIsAdmin = () => {
    const { user } = useSelector((state: RootState) => state.auth);
    return user?.role === Role.ADMIN;
};