import PlayersList, { ALL_CLUBS_QUERY, ALL_COUNTRIES_QUERY } from "../components/playersList";
import { initializeApollo } from "../lib/apolloClient";
import Link from "next/link";

const IndexPage = () => {
  return (
    <div>
      <h1 style={{ textAlign: "center" }}>
        EPL Player Directory <Link href="/table">(EPL Table)</Link>
      </h1>
      <PlayersList />
    </div>
  )
};

export async function getStaticProps() {
  const apolloClient = initializeApollo();

  await apolloClient.query({
    query: ALL_COUNTRIES_QUERY,
  });

  await apolloClient.query({
    query: ALL_CLUBS_QUERY,
  });

  return {
    props: {
      initialApolloState: apolloClient.cache.extract(),
    },
    revalidate: 1,
  };
}

export default IndexPage;