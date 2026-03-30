import React from "react";
import { useLocation } from "react-router-dom";

const POST_LOGIN_REDIRECT_KEY = "post-login-redirect";

type Props = {
    /** Where to come back after OAuth finishes (defaults to current path+search). */
    returnTo?: string;
};

const LoginMethods: React.FC<Props> = ({ returnTo }) => {
    const API_BASE_URL = process.env.REACT_APP_API_URL || "http://localhost:5000";
    const location = useLocation();

    const resolvedReturnTo = returnTo ?? `${location.pathname}${location.search}`;

    const rememberReturnTo = () => {
        try {
            localStorage.setItem(POST_LOGIN_REDIRECT_KEY, resolvedReturnTo);
        } catch {
            // ignore storage issues
        }
    };

    const handleGoogleLogin = () => {
        rememberReturnTo();
        window.location.href = `${API_BASE_URL}/auth/google`;
    };

    const handleFacebookLogin = () => {
        rememberReturnTo();
        window.location.href = `${API_BASE_URL}/auth/facebook`;
    };

    const loginMethods = [
        {
            name: "Google",
            icon: "/images/icons/socials/ic_google.svg",
            handle: handleGoogleLogin,
        },
        {
            name: "Facebook",
            icon: "/images/icons/socials/ic_facebook.svg",
            handle: handleFacebookLogin,
        }
    ];

    return (
        <div className="grid grid-cols-2 gap-3">
            {loginMethods.map((method) => (
                <button
                    key={method.name}
                    type="button"
                    onClick={method.handle}
                    className="flex h-[54px] w-full items-center justify-center gap-2 rounded-xl border border-[#25364d] bg-[rgba(15,23,42,0.78)] text-sm font-medium text-slate-300 transition hover:bg-[rgba(18,30,48,0.95)]"
                >
                    <img
                        src={method.icon}
                        alt={method.name}
                        className="h-5 w-5"
                    />
                    <span>{method.name}</span>
                </button>
            ))}
        </div>
    );
};

export default LoginMethods;
