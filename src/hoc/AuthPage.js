import React, { useEffect, useState } from "react";
import Cookies from "js-cookie";
import { useRouter } from "next/router";
import axiosInstance from "@/config/axiosInstance";
import { CircularProgress } from "@mui/material";

const AuthPage = (WrappedComponent) => {
    return function WithAuthComponent(props) {
        const [loading, setLoading] = useState(true);
        const router = useRouter();

        useEffect(() => {
            if (router.isReady) {
                const fetchData = async () => {
                    const path = router.asPath
                    const accessToken = Cookies.get("token");
                    if (!accessToken) {
                        router.push(`/admin/login?redirect=${path}`);
                        return;
                    }
                    try {
                        await axiosInstance.get("/check");
                        setLoading(false);
                    } catch (error) {
                        router.push(`/admin/login?redirect=${path}`);
                    }
                };
                fetchData();
            }
        }, [router]);
        if (loading) {
            return <div className="flex h-screen w-screens items-center justify-center">
                <CircularProgress />
            </div>;
        }

        return <WrappedComponent {...props} />;
    };
};

export default AuthPage;
