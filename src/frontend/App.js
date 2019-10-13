import React, { Component } from "react";
import styled from "styled-components";
import {Router} from "./routers/Router.js";
import {ToastContainer} from "react-toastify";

const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const Row = styled.div`
  display: flex;
  flex-direction: row;
  margin: 25px 0;
`;

const RowCentered = styled(Row)`
  align-items: center;    //vertical  alignment
`;

const TitleRow = styled(RowCentered)`
`;

const Title = styled.h1`
  font-family: monospace;
  font-size: 38px;
`;

class App extends Component {
  render() {
    return (
      <Container>
        <TitleRow>
          <Title>ERC-865 pay gas service</Title>
        </TitleRow>
        <Router
          base={""}/>
        <ToastContainer />
      </Container>
    );
  }
}

export default App;
