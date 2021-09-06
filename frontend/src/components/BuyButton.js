import React from "react";
import { multiplier } from "./common";
import Big from "big.js";
import { Button, Text, List, ListItem } from "@chakra-ui/react";

const fromNear = (s) => parseFloat(s) / 1e24;

function BuyButton(props) {
  const price = fromNear((props.price / multiplier()) * 1.0001);

  async function buyCard(e) {
    e.preventDefault();
    await props._near.contract.buy_card(
      { card_id: props.cardId },
      "200000000000000",
      Big((props.price / multiplier()) * 1.0001).toFixed(0)
    );
  }

  const appCommission = price / 100;
  let artDaoProfit = price / 100;
  let ownerPrice = price - appCommission - artDaoProfit;
  if (!props.ownerId) {
    artDaoProfit += ownerPrice;
    ownerPrice = 0;
  }

  const newPrice = price * 1.2;

  return (
    <>
      <Button
        color="white"
        variant="solid"
        rounded="xl"
        fontSize="sm"
        bgGradient="linear(to-r, #FF0080, brand.100)"
        _hover={{ filter: "brightness(0.8)" }}
        onClick={(e) => buyCard(e)}
      >
        Buy for {price.toFixed(2)} NEAR
      </Button>
      <Text color="gray.600">
        Price breakdown:
        <List>
          {props.ownerId && (
            <ListItem>
              Owner @{props.ownerId} will get {ownerPrice.toFixed(2)} NEAR
            </ListItem>
          )}
          <ListItem>Art DAO will get {artDaoProfit.toFixed(2)} NEAR</ListItem>
          <ListItem>
            1% App commission is {appCommission.toFixed(2)} NEAR
          </ListItem>
        </List>
        <p>The new price will be {newPrice.toFixed(2)} NEAR</p>
      </Text>
    </>
  );
}

export { fromNear, BuyButton };
