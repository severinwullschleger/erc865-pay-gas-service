import React, {Component} from 'react';
import styled from 'styled-components';
import {Redirect, BrowserRouter, Switch, Route} from 'react-router-dom';
import NavPill from '../views/design-components/NavPill.js';
import {NavPillRoutes} from './NavPillRoutes.js';
import Transfer from "../views/Transfer.jsx";

const Parent = styled.div`
  display: flex;
  flex-direction: column;
`;

const NavPills = styled.div`
  display: flex;
  margin-bottom: 10px;
  justify-content: center;
`;

const Container = styled.div``;

const CardContainer = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  margin-top: 2em;
`;

export class Router extends Component {
  constructor() {
    super();
    this.state = {};
  }

  componentDidMount() {
  }

  render() {
    return (
      <Parent>
        <BrowserRouter>
          <Switch>
            <Container>
              <NavPills>
                {NavPillRoutes.map((item, index) => {
                  return (
                    <NavPill
                      name={item.name}
                      base={this.props.base}
                      key={index}
                      path={item.path}
                      icon={item.icon}
                      material={item.material}
                      width={22}
                    />
                  );
                })}
              </NavPills>
              <CardContainer>
                <Route
                  exact
                  path={`${this.props.base}/transfer`}
                  render={() => (
                    <Transfer base={`${this.props.base}/transfer`}/>
                  )}
                />

                <Route
                  exact
                  path={`${this.props.base}/transferAndCall`}
                  render={() => (
                    <Transfer base={`${this.props.base}/transferAndCall`}/>
                  )}
                />

                <Route
                  exact
                  path={`${this.props.base}`}
                  render={() => {
                    return <Redirect to={`${this.props.base}/transfer`}/>;
                  }}
                />
              </CardContainer>
            </Container>
          </Switch>
        </BrowserRouter>
      </Parent>
    );
  }
}
