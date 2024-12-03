import Header from "@/components/header";
import UserLoginForm from "@/components/users/userLoginFrom";
import Head from "next/head";
import { useRouter } from "next/router";
import { useEffect } from "react";
import { useTranslation } from "next-i18next";
import { serverSideTranslations} from 'next-i18next/serverSideTranslations'

const Login: React.FC = () => {
    const { t } = useTranslation();
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
                <title>{t('login.title')}</title>
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

export const getServerSideProps = async (context) => {
    const {locale} = context;
    return{
        props: {
            ...(await serverSideTranslations(locale ?? "en", ["common"])),
        },
    };
};

export default Login;
