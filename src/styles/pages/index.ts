import styled from "styled-components";
import { LANDING_BACK } from "@styles/image";

export const Content = styled.div`
  background: url(${LANDING_BACK}) no-repeat center center fixed;
  -webkit-background-size: cover;
  -moz-background-size: cover;
  -o-background-size: cover;
  background-size: cover; ;
`;

export const MultiverseContent = styled.div`
  background-color: black;
  color: white;
  margin: 10px 0;
`;

export const MultiverseText = styled.div`
  border-style: solid;
  border-width: 4px 4px 4px 4px;
  border-color: #3b3838;
  background-color: #111111;
  color: #ffffff;
  font-size: 25px;
  font-weight: 600;
  display: inline-flex;
  font-size: 25px;
  padding: 16px 28px;
  line-height: 1.3333;
`;

export const WalletConnectTitle = styled.div`
  font-size: 32px;
`;

export const WalletConnectSubTitle = styled.div`
  font-size: 20px;
  padding: 10px 0;
`;

export const WalletButtons = styled.div``;
