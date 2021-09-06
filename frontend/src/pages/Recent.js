import React, { useEffect, useState } from "react";
import uuid from "react-uuid";
import CardPreview from "../components/CardPreview";
import InfiniteScroll from "react-infinite-scroller";
import { SimpleGrid, Heading } from "@chakra-ui/react";
const FetchLimit = 100;

function RecentPage(props) {
  const [feed, setFeed] = useState([]);
  const [hasMore, setHasMore] = useState(false);
  const [gkey] = useState(uuid());

  const fetchMore = async () => {
    const f = [...feed];
    const offset = f.length;
    const fetched = await props._near.contract.get_recent_cards({
      offset,
      limit: FetchLimit,
    });
    f.push(...fetched);
    if (fetched.length === 0) {
      setHasMore(false);
    }
    setFeed(f);
  };

  useEffect(() => {
    if (props.connected) {
      setHasMore(true);
    }
  }, [props.connected]);

  const seen = {};

  const cards = feed
    .filter(([rating, cardId]) => {
      if (cardId in seen) {
        return false;
      }
      seen[cardId] = true;
      return true;
    })
    .map(([rating, cardId]) => {
      const key = `${gkey}-${cardId}`;
      return (
        <CardPreview {...props} key={key} cardId={cardId} rating={rating} />
      );
    });

  const loader = (
    <div className="d-flex justify-content-center" key={`${gkey}-loader`}>
      <div className="spinner-grow" role="status">
        <span className="visually-hidden">Loading...</span>
      </div>
    </div>
  );

  return (
    <div>
      <Heading size="3xl" fontWeight="normal">
        Recent
      </Heading>
      <InfiniteScroll
        pageStart={0}
        loadMore={fetchMore}
        hasMore={hasMore}
        loader={loader}
      >
        <SimpleGrid columns={4} spacing={10}>
          {cards}
        </SimpleGrid>
      </InfiniteScroll>
    </div>
  );
}

export default RecentPage;
