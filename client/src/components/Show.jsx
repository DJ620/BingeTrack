import React from 'react';
import Card from 'react-bootstrap/Card';
import Container from 'react-bootstrap/esm/Container';
import { useNavigate } from 'react-router-dom';

const Show = ({ tvShow }) => {
    const navigate = useNavigate();

  return (
    <Card className='text-center my-3'>
    <Card.Header className="h3">{tvShow.show.name}</Card.Header>
    <span>
    <img src={tvShow.show.image?.medium} onClick={() => navigate(`/show/${tvShow.show.id}`)} style={{cursor: 'pointer'}} className="my-4"/>
            <Card.Text>
          <p dangerouslySetInnerHTML={{__html: tvShow.show.summary}} />
          </Card.Text>
    </span>
    </Card>
  )
}

export default Show;