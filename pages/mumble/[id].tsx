import { GetServerSideProps, InferGetServerSidePropsType } from "next";

type Props = {
  mumble: {
    id: string;
  };
};

export default function MumblePage({
  mumble,
}: Props): InferGetServerSidePropsType<typeof getServerSideProps> {
  return (
    <>
      <h1>{mumble.id}</h1>
    </>
  );
}

export const getServerSideProps: GetServerSideProps = async ({
  query: { id },
}) => {
  return {
    props: {
      mumble: { id },
    },
  };
};
