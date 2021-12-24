import React from "react";
import { NextPage } from "next";
import { Button } from "react-bootstrap";
import { Content } from "@styles/pages/marketplace";

const CollectiblesInfoPage: NextPage = () => {
  return (
    <Content className="he-100 d-flex justify-center align-center">
      <div className="col-md-12">
        <div className="row">
          <div className="col-md-5">
            <div className="row">
              <div className="col-md-6 text-center">
                <Button>Exchange</Button>
              </div>
              <div className="col-md-6 text-center">
                <Button>Control Center</Button>
              </div>
            </div>
          </div>
          <div className="col-md-2"></div>
          <div className="col-md-5">
            <div className="row">
              <div className="col-md-6 text-center">
                <Button>Communications</Button>
              </div>
              <div className="col-md-6 text-center">
                <Button>Creator Lab</Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Content>
  );
};

export default CollectiblesInfoPage;
