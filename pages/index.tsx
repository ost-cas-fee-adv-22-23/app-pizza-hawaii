import { GetServerSideProps, InferGetStaticPropsType } from "next";
import { Header } from "../components/header";

type PageProps = {};

export default function PageHome({}: PageProps): InferGetStaticPropsType<
  typeof getServerSideProps
> {
  return (
    <>
      <Header title="Mumble">
        <span>Your custom network</span>
      </Header>
    </>
  );
}
export const getServerSideProps: GetServerSideProps = async () => ({
  props: { posts: require("../data/posts.json") },
});
