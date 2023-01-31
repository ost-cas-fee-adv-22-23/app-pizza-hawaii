import { GetServerSideProps, InferGetStaticPropsType } from "next";
import { Header } from "../components/header";
import { Headline } from "@smartive-education/pizza-hawaii";
import User from "../data/user.json";

type PageProps = {};

export default function PageHome({}: PageProps): InferGetStaticPropsType<
  typeof getServerSideProps
> {
	const user = {
		...User,
		profileLink: `user/${User.id}`,
	};

  return (
    <>
      <Header user={user} />
      <Headline as="h1" level={1}>
        hoi
      </Headline>
    </>
  );
}
export const getServerSideProps: GetServerSideProps = async () => ({
  props: { posts: require("../data/posts.json") },
});
