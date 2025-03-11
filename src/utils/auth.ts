import { useState, useEffect } from "react";
import { Role } from "../enum/user.enum";
import { RootState, useSelector } from "../redux/store";

export const useIsAdmin = () => {
    const { user } = useSelector((state: RootState) => state.auth);
    return user?.role === Role.ADMIN;
};