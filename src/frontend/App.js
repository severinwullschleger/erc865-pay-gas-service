import React, { Component } from "react";
import styled from "styled-components";
import Transfer from "./views/Transfer.jsx";

const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
`;
class App extends Component {
  render() {
    return (
      <Container>
        <Transfer/>
      </Container>
    );
  }
}

export default App;
