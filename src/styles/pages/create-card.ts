import styled from "styled-components";
import { CREATE_CARD_BACK } from "@styles/image";

export const Content = styled.div`
  background: url(${CREATE_CARD_BACK}) no-repeat center center fixed;
  -webkit-background-size: contain;
  -moz-background-size: contain;
  -o-background-size: contain;
  background-size: contain; ;
`;

export const DropContent = styled.div`
  width: 100%;
  border: 1px dashed white;
  height: 100px;
  border-radius: 10px;
  padding: 5px;
`;
