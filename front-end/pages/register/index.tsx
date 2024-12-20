import Header from "@/components/header";
import UserRegisterForm from "@/components/users/userRegisterForm";
import Head from "next/head";
import { useTranslation } from "next-i18next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";

const Register: React.FC = () => {
  const { t } = useTranslation();

  return (
    <>
      <Head>
        <title>{t("register.title")}</title>
      </Head>
      <Header />
      <main>
        <section className="p-6 min-h-screen flex flex-col items-center">
          <UserRegisterForm />
        </section>
      </main>
    </>
  );
};

export const getServerSideProps = async (context) => {
  const { locale } = context;
  return {
    props: {
      ...(await serverSideTranslations(locale ?? "en", ["common"])),
    },
  };
};

export default Register;
