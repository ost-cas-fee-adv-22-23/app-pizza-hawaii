import { GetServerSideProps, InferGetServerSidePropsType } from "next";

type Props = {
  profile: {
    alias: string;
  };
};

export default function ProfilePage({
  profile,
}: Props): InferGetServerSidePropsType<typeof getServerSideProps> {
  return (
    <>
      <h1>{profile.alias}</h1>
    </>
  );
}

export const getServerSideProps: GetServerSideProps = async ({
  query: { alias },
}) => {
  return {
    props: {
      profile: { alias },
    },
  };
};
