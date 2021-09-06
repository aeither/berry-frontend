import "./CardPreview.scss";
import React, { useCallback, useEffect, useState } from "react";
import { CardImage } from "./CardImage";
import { Link } from "react-router-dom";
import PriceButton from "./PriceButton";
import { Text, Box } from "@chakra-ui/react";
function CardPreview(props) {
  const [rating, setRating] = useState(props.rating);
  const cardId = props.cardId;
  const propsRating = props.rating;

  const fetchRating = useCallback(async () => {
    return await props._near.contract.get_rating({
      card_id: cardId,
    });
  }, [props._near, cardId]);

  useEffect(() => {
    if (props.connected) {
      if (!propsRating) {
        fetchRating().then(setRating);
      } else {
        setRating(propsRating);
      }
    }
  }, [props.connected, propsRating, fetchRating]);

  return props.cardId ? (
    <Box
      m="2"
      w="200px"
      rounded="xl"
      background="white"
      p="4"
      _hover={{ transform: "translateY(-4px)", shadow: "lg" }}
    >
      <Link to={`/c/${cardId}`}>
        <CardImage
          className="card-img-top"
          cardId={cardId}
          cardReady={() => false}
        />
      </Link>
      <Text p="2" color="brand.900">
        #{cardId}
      </Text>
      <PriceButton {...props} cardId={cardId} price={rating} />
    </Box>
  ) : (
    <div className="card card-preview m-2">
      <div className="d-flex justify-content-center">
        <div className="spinner-grow" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    </div>
  );
}

export default CardPreview;
