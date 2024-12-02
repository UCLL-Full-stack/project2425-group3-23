import Header from "@/components/header";
import UserLoginForm from "@/components/users/userLoginFrom";
import Head from "next/head";
import { useRouter } from "next/router";
import { useEffect } from "react";

const Login: React.FC = () => {
    const router = useRouter();

    useEffect(() => {
        const token = localStorage.getItem("token");
        if (token) {
            router.push("/");
        }
    }, [router]);

    return (
        <>
            <Head>
                <title>User Login</title>
            </Head>
            <Header />
            <main>
                <section className="p-6 min-h-screen flex flex-col items-center">
                    <UserLoginForm />
                </section>
            </main>
        </>
    );
};

export default Login;
