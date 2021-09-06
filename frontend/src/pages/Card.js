import React from "react";
import { useParams } from "react-router";
import Card from "../components/Card";

function CardPage(props) {
  const { cardId } = useParams();

  return <Card {...props} cardId={parseInt(cardId)} />;
}

export default CardPage;
