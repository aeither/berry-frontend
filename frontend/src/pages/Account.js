import React, { useCallback, useEffect, useState } from "react";
import { useParams } from "react-router";
import CardPreview from "../components/CardPreview";
import uuid from "react-uuid";
import {
  SimpleGrid,
  Heading,
  Box,
  VStack,
  List,
  ListItem,
} from "@chakra-ui/react";

function AccountPage(props) {
  const { accountId } = useParams();
  const [account, setAccount] = useState(null);
  const [loading, setLoading] = useState(true);
  const [cardIds, setCardsIds] = useState([]);
  const [gkey] = useState(uuid());

  const fetchCards = useCallback(async () => {
    const account = await props._near.getAccount(accountId);
    if (!account) {
      return;
    }
    setAccount(account);
    return await account.fetchCards();
  }, [props._near, accountId]);

  useEffect(() => {
    if (props.connected) {
      fetchCards().then((cardIds) => {
        cardIds.sort((a, b) => b[1] - a[1]);
        setCardsIds(cardIds);
        setLoading(false);
      });
    }
  }, [props.connected, fetchCards]);

  const cards = cardIds.map(([cardId, rating]) => {
    const key = `${gkey}-${cardId}`;
    return <CardPreview {...props} key={key} cardId={cardId} rating={rating} />;
  });

  return (
    <div>
      {loading ? (
        <div className="col">
          <div className="d-flex justify-content-center">
            <div className="spinner-grow" role="status">
              <span className="visually-hidden">Loading...</span>
            </div>
          </div>
        </div>
      ) : (
        <div>
          <Heading size="3xl" fontWeight="normal">
            {accountId === props.signedAccountId
              ? "Your cards"
              : `Cards owned by @${accountId}`}
          </Heading>
          <SimpleGrid columns={4} spacing={10}>
            {cards}
          </SimpleGrid>
        </div>
      )}
      {!account ? (
        <div className="col col-12 col-lg-8 col-xl-6">
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
              <ListItem>Num cards: {account.numCards}</ListItem>
              <ListItem>
                Purchase volume: {account.purchaseVolume.toFixed(2)} NEAR
              </ListItem>
              <ListItem>Num purchases: {account.numPurchases}</ListItem>
              <ListItem>
                Sale profit: {account.saleProfit.toFixed(2)} NEAR
              </ListItem>
              <ListItem>Num sales: {account.numSales}</ListItem>
              <ListItem>Num votes: {account.numVotes}</ListItem>
            </List>
          </VStack>
        </Box>
      )}
    </div>
  );
}

export default AccountPage;
