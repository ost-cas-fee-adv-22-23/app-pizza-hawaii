import { GetServerSideProps, InferGetStaticPropsType } from "next";
import { Header } from "../components/header";
import { Headline } from "@smartive-education/pizza-hawaii";

type PageProps = {};

export default function PageHome({}: PageProps): InferGetStaticPropsType<
  typeof getServerSideProps
> {
  return (
    <>
      <Header title="Mumble">
        <span>Your custom network</span>
      </Header>
      <Headline as="h1" level={1} >hoi</Headline>
    </>
  );
}
export const getServerSideProps: GetServerSideProps = async () => ({
  props: { posts: require("../data/posts.json") },
});
