import { ListItem, List, VStack, Box, Heading } from "@chakra-ui/layout";
import React, { useCallback, useEffect, useState } from "react";
import { fromNear } from "../components/BuyButton";

function StatsPage(props) {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchStats = useCallback(async () => {
    const [t, numAccounts] = await Promise.all([
      props._near.contract.get_trade_data(),
      props._near.contract.get_num_accounts(),
    ]);
    return {
      numAccounts,
      numPurchases: t.num_purchases,
      numUniqueCardsBought: t.num_unique_cards_bought,
      nearVolume: fromNear(t.near_volume),
      appCommission: fromNear(t.app_owner_profit),
      artDaoProfit: fromNear(t.art_dao_profit),
      appOwnerId: t.app_owner_id,
      artDaoId: t.art_dao_id,
      totalVotes: t.total_votes,
    };
  }, [props._near]);

  useEffect(() => {
    if (props.connected) {
      fetchStats().then((stats) => {
        setStats(stats);
        setLoading(false);
      });
    }
  }, [props.connected, fetchStats]);

  return (
    <div className="container">
      <div className="row">
        {loading ? (
          <div className="col">
            <div className="d-flex justify-content-center">
              <div className="spinner-grow" role="status">
                <span className="visually-hidden">Loading...</span>
              </div>
            </div>
          </div>
        ) : (
          <Box rounded="xl" background="white" p="4" w="auto">
            <VStack color="brand.900" align="start">
              <Heading fontWeight="300" size="lg" color="brand.100">
                Stats{" "}
              </Heading>
              <List spacing={3}>
                <ListItem>Num accounts: {stats.numAccounts}</ListItem>
                <ListItem>Total votes: {stats.totalVotes}</ListItem>
                <ListItem>Total purchases: {stats.numPurchases}</ListItem>
                <ListItem>
                  Total unique purchases: {stats.numUniqueCardsBought}
                </ListItem>
                <ListItem>
                  Total volume: {stats.nearVolume.toFixed(2)} NEAR
                </ListItem>
                <ListItem>
                  Total Art DAO profit: {stats.artDaoProfit.toFixed(2)} NEAR
                </ListItem>
                <ListItem>
                  Art DAO account ID:{" "}
                  <a
                    href={`https://explorer.near.org/accounts/${stats.artDaoId}`}
                  >
                    @{stats.artDaoId}
                  </a>
                </ListItem>
                <ListItem>
                  Total App commission: {stats.appCommission.toFixed(2)} NEAR
                </ListItem>
              </List>
            </VStack>
          </Box>
        )}
      </div>
    </div>
  );
}

export default StatsPage;
