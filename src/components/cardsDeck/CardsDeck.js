import React, { useEffect, useState } from "react";
import Card from "../card/Card";
import styled from "styled-components";
import { AnimatePresence, motion } from "framer-motion";

const SERVER = "http://localhost:5001";

const CardsDeck = () => {
  const [cards, setCards] = useState([]);
  const [selectedCard, setSelectedCard] = useState(null);
  const [isDeckDealt, setIsDeckDealt] = useState(false);

  const getCards = async (n = 3) => {
    try {
      const response = await fetch(`${SERVER}/api/cards?n=${n}`);
      if (!response.ok) {
        throw new Error("HTTP error " + response.status);
      }
      const data = await response.json();
      setCards(data);
    } catch (error) {
      console.error("Fetch failed:", error.message);
    }
  };

  useEffect(() => {
    getCards();
  }, []);

  useEffect(() => {
    const uniqueFontNames = [
      ...new Set(
        cards.filter((card) => !!card.fontName).map((card) => card.fontName)
      ),
    ];

    uniqueFontNames.forEach((fontName) => {
      const link = document.createElement("link");
      link.href = `https://fonts.googleapis.com/css?family=${fontName.replaceAll(
        " ",
        "+"
      )}&display=swap`;
      link.rel = "stylesheet";
      document.head.appendChild(link);
    });
  }, [cards]);

  return (
    <Container>
      <AnimatePresence>
        {!isDeckDealt && (
          <Button
            onClick={() => setIsDeckDealt((prevState) => !prevState)}
            key="deal-button"
            initial={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.1 }}
          >
            Deal my cards
          </Button>
        )}
      </AnimatePresence>
      {isDeckDealt && (
        <CardsWrapper
          variants={cardVariants}
          initial="hidden"
          animate="visible"
        >
          {cards.map((cardData, index) => (
            <Card
              id={cardData.id}
              key={cardData.id}
              cardIndex={index}
              imageUrl={cardData.url}
              fontSize={cardData.fontSize}
              title={cardData.title}
              fontName={cardData.fontName}
              fontColor={cardData.fontColor}
            />
          ))}
        </CardsWrapper>
      )}
    </Container>
  );
};

export default CardsDeck;

const cardVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.4,
    },
  },
};

const Container = styled.div`
  padding-top: 60px;
  min-height: 100vh;
  overflow: hidden;
`;

const CardsWrapper = styled(motion.div)`
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  align-items: center;
  gap: 40px;
`;

const Button = styled(motion.button)`
  margin: 0 auto;
  background-color: #c9e3f7;
  border: 2px solid #111;
  border-radius: 8px;
  color: #111;
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 1.4rem;
  height: 48px;
  padding: 0 25px;
  position: relative;
  cursor: pointer;

  &::before {
    background-color: #111;
    border-radius: 8px;
    content: "";
    display: block;
    height: 48px;
    left: 0;
    width: 100%;
    position: absolute;
    top: -2px;
    transform: translate(8px, 8px);
    transition: transform 0.2s ease-out;
    z-index: -1;
  }

  &:hover:before {
    transform: translate(0, 0);
  }
`;
