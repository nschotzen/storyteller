import React, { useState } from "react";
import styled from "styled-components";
import { motion } from "framer-motion";

const Card = ({
  id,
  imageUrl,
  title,
  fontName,
  fontSize,
  cardIndex,
  fontColor,
  selected,
  selectCard,
  setSelectedCard,
}) => {
  const [isFlipped, setIsFlipped] = useState(false);
  // const [isDrawing, setIsDrawing] = useState(false);

  // const handleDraw = () => {
  //   setIsDrawing(true);
  //   setTimeout(() => setIsDrawing(false), 400); // Reset after 400ms
  // };
  // const handleFlip = () => {
  //   setIsFlipped(!isFlipped);
  // };
  // const handleSelect = () => {
  //   setSelectedCard(id);
  // };
  // const handleClick = (e) => {
  //   e.stopPropagation(); // prevent the flip action when clicking to select a card
  //   selectCard(id);
  // };

  function splitCamelCaseText(input) {
    return input.replace(/([A-Z])/g, " $1").replace(/^./, function (str) {
      return str.toUpperCase();
    });
  }

  console.log(cardIndex);
  return (
    <Wrapper
      variants={variants}
      // custom={cardIndex}
      $isFlipped={isFlipped}
      // onDoubleClick={handleClick} // double click to select a card
    >
      <CardContainer
        $isFlipped={isFlipped}
        onClick={() => setIsFlipped((prevState) => !prevState)}
      >
        <Front>
          <FrontContent>
            <p>This will be some awesome content</p>
          </FrontContent>
        </Front>
        <Back $bgImage={`url(http://localhost:5001${imageUrl})`}>
          <BackContent>
            <p
              style={{
                fontFamily: fontName,
                fontSize: fontSize,
              }}
            >
              {splitCamelCaseText(title)}
            </p>
          </BackContent>
        </Back>
      </CardContainer>
    </Wrapper>
  );
};

export default Card;

const variants = {
  hidden: { opacity: 0, y: 100 },
  visible: { opacity: 1, y: 0, transition: { type: "tween" } },
};

const frontAndBack = `position: absolute;
width: 100%;
height: 100%;
-webkit-backface-visibility: hidden;
backface-visibility: hidden;
border-radius: var(--border-radius);
`;

const Back = styled.div`
  ${frontAndBack}
  /* pointer-events: none; */
  background-repeat: no-repeat;
  background-position: center;
  background-size: cover;
  display: flex;
  justify-content: center;
  align-items: flex-end;
  transform: rotateY(180deg);
  position: relative;
  overflow: hidden;

  &::before {
    content: "";
    height: 100%;
    width: 100%;
    position: absolute;
    background: ${(props) => `${props.$bgImage}`};
    transition: transform 0.2s ease-in-out;
  }
`;

const CardContainer = styled.div`
  position: relative;
  width: 28vw;
  height: 42vw;
  max-width: 275px;
  max-height: 425px;
  min-height: 306px;
  min-width: 198px;
  border-radius: var(--border-radius);
  transition: transform 0.8s;
  transform-style: preserve-3d;
  box-shadow: rgba(0, 0, 0, 0.66) 0 30px 60px 0, inset #333 0 0 0 5px,
    inset rgba(255, 255, 255, 0.5) 0 0 0 6px;
  transform: ${(props) =>
    props.$isFlipped ? "rotateY(0deg)" : "rotateY(180deg)"};
  cursor: pointer;
`;

const Wrapper = styled(motion.div)`
  background-color: transparent;
  perspective: 1000px;

  &:hover {
    ${CardContainer} {
      transform: ${(props) =>
        props.$isFlipped
          ? "rotateZ(-2deg) rotateY(0deg)"
          : "rotateZ(-2deg) rotateY(180deg)"};
      ${Back}&::before {
        transform: scale(1.06);
      }
    }
  }
`;

const Front = styled.div`
  ${frontAndBack};
  background-color: #a3b8b8;
  padding: 12px;
`;

const BackContent = styled.div`
  padding: 8px;
  width: 90%;
  margin: 0 auto 12px;
  backdrop-filter: blur(10px);
  background-color: #00000066;
  border-radius: var(--border-radius);
  p {
    color: white;
    font-size: 1.2rem;
  }
`;

const FrontContent = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
`;
