import React from 'react';
import { Container, Navbar } from "react-bootstrap";

const Footer = () => {
  return (
    <Container>
      <Navbar expand={true} fixed="bottom" className="bg-body-tertiary">
        <Container className="justify-content-center">
          <Navbar.Brand>
          Powered by{" "}
            <a href="https://tvmaze.com" target="_blank">
              <img
                src="https://static.tvmaze.com/images/tvm-header-logo.png"
                style={{ maxHeight: "30px", marginLeft: "5px" }}
              />
            </a>
          </Navbar.Brand>
        </Container>
      </Navbar>
    </Container>
  )
}

export default Footer;