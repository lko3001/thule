import { GetServerSidePropsContext } from "next";
import { getServerSession } from "next-auth/next";
import { authOptions } from "../api/auth/[...nextauth]";

export default function User() {
  return <h1>Not Found</h1>;
}

export async function getServerSideProps(context: GetServerSidePropsContext) {
  return { redirect: { destination: "/" } };
}
