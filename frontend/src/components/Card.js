import React, { useCallback, useEffect, useState } from "react";
import { BuyButton, fromNear } from "./BuyButton";
import { CardImage, preloadCard } from "./CardImage";
import TimeAgo from "timeago-react";
import { Link } from "react-router-dom";
import PriceButton from "./PriceButton";
import Tilt from "react-parallax-tilt";
import {
  Heading,
  Box,
  Center,
  Button,
  VStack,
  SimpleGrid,
  HStack,
  Text,
} from "@chakra-ui/react";

const mapCardInfo = (c) => {
  return c
    ? {
        ownerId: c.owner_id,
        purchasePrice: fromNear(c.purchase_price),
        purchaseTime: new Date(parseFloat(c.purchase_time) / 1e6),
        volume: fromNear(c.volume),
        artDaoProfit: fromNear(c.art_dao_profit),
        numTrades: c.num_trades,
      }
    : {
        ownerId: null,
        purchasePrice: 0,
        purchaseTime: null,
        volume: 0,
        artDaoProfit: 0,
        numTrades: 0,
      };
};

function Card(props) {
  const [cardInfo, setCardInfo] = useState(null);
  const cardId = props.cardId;
  const refreshTime = props.refreshTime;
  const hidden = props.hidden;

  const fetchInfo = useCallback(async () => {
    const rating = await props._near.contract.get_rating({
      card_id: cardId,
    });
    const cardInfo = mapCardInfo(
      await props._near.contract.get_card_info({
        card_id: cardId,
      })
    );
    cardInfo.refreshTime = refreshTime;
    cardInfo.rating = rating;
    return cardInfo;
  }, [props._near, cardId, refreshTime]);

  useEffect(() => {
    if (props.connected && !hidden) {
      preloadCard(cardId);
      fetchInfo().then(setCardInfo);
    }
  }, [props.connected, fetchInfo, cardId, hidden]);

  return cardInfo ? (
    <HStack w="100%" justify="space-around" py="4">
      <Tilt tiltReverse glareEnable scale="1.1" >
        <CardImage cardId={cardId} cardReady={() => false} />
      </Tilt>
      <VStack
        align="start"
        color="brand.100"
        p="4"
        rounded="xl"
        background="white"
      >
        <Heading fontWeight="300" size="lg" color="brand.100">
          #{cardId}
        </Heading>
        {cardInfo.ownerId ? (
          <div>
            <Text>
              Owned by{" "}
              {cardInfo.ownerId === props.signedAccountId ? (
                "you"
              ) : (
                <Link to={`/a/${cardInfo.ownerId}`}>@{cardInfo.ownerId}</Link>
              )}
              <br />
              Purchased <TimeAgo datetime={cardInfo.purchaseTime} /> for{" "}
              {cardInfo.purchasePrice.toFixed(2)} NEAR
              <br />
            </Text>
            <Text>
              Total card volume {cardInfo.volume.toFixed(2)} NEAR
              <br />
              Art DAO got {cardInfo.artDaoProfit.toFixed(2)} NEAR
              <br />
            </Text>
          </div>
        ) : (
          <div>
            <p>Not owned by anyone.</p>
          </div>
        )}
        {cardInfo.ownerId === props.signedAccountId ? (
          <PriceButton {...props} cardId={cardId} price={cardInfo.rating} />
        ) : (
          <BuyButton
            {...props}
            cardId={cardId}
            price={cardInfo.rating}
            ownerId={cardInfo.ownerId}
          />
        )}
      </VStack>
    </HStack>
  ) : (
    <div className="card m-2">
      <div className="d-flex justify-content-center">
        <div className="spinner-grow" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    </div>
  );
}

export default Card;
