import React, { Component } from "react";
import styled from "styled-components";
import EurekaLogo from "./views/icons/EurekaLogo";
import { __THIRD } from "./helpers/colors";
import Icon from "./views/icons/Icon";

const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const RelativeContainer = styled.div`
  position: relative;
  margin-top: 30px;
`;

const Title = styled.h1`
  font-family: "Indie Flower", cursive;
  font-size: 38px;
  margin-right: 4px;
`;

const Absolute = styled.div`
  position: absolute;
  bottom: -30px;
  right: -50px;
  display: flex;
  align-items: center;
`;

const SubContainer = styled.div``;

class App extends Component {
  render() {
    return (
      <Container>
        <RelativeContainer>
          <EurekaLogo width={500} />
          <Absolute>
            <Title>PDF Parser</Title>
            <Icon icon={"uploadPDF"} width={38} height={38} color={__THIRD} />
          </Absolute>
        </RelativeContainer>
        <SubContainer>Let's start!</SubContainer>
      </Container>
    );
  }
}

export default App;
