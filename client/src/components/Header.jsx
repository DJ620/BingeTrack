import React from 'react';
import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import { Link } from 'react-router-dom';
import {LinkContainer} from 'react-router-bootstrap';

const Header = () => {

  return (
    <Navbar expand='lg' className='bg-body-tertiary'>
        <Container>
        <LinkContainer to='/'><Navbar.Brand href="/">TV Tracker</Navbar.Brand></LinkContainer>
            <Navbar.Toggle aria-controls='basic-navbar-nav' />
            <Navbar.Collapse id="basic-navbar-nav">
                <Nav className='me-auto'>
                    <LinkContainer to='/'><Nav.Link>Library</Nav.Link></LinkContainer>
                    <LinkContainer to='/search'><Nav.Link>Search</Nav.Link></LinkContainer>
                </Nav>
                <Navbar.Text>Powered by <a href="https://tvmaze.com" target="_blank"><img src="https://static.tvmaze.com/images/tvm-header-logo.png" style={{maxHeight: '30px', marginLeft: '5px'}} /></a></Navbar.Text>
            </Navbar.Collapse>
        </Container>
    </Navbar>
  )
}

export default Header;