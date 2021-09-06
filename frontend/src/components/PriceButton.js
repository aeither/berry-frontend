import React from "react";
import { fromNear } from "./BuyButton";
import { Link } from "react-router-dom";
import { multiplier } from "./common";
import { Button } from "@chakra-ui/react";

function PriceButton(props) {
  return (
    <Button
      w="100%"
      color="white"
      variant="solid"
      rounded="xl"
      fontSize="sm"
      bgGradient="linear(to-r, #FF0080, brand.100)"
      _hover={{ filter: "brightness(0.8)" }}
    >
      <Link to={`/c/${props.cardId}`} disabled={!props.signedIn}>
        {fromNear(props.price / multiplier()).toFixed(2)} NEAR
      </Link>
    </Button>
  );
}

export default PriceButton;
