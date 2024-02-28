import React from 'react';
import { Button, Modal } from 'react-bootstrap';
import api from '../utils/api';
import token from '../utils/token';
import { useDispatch } from "react-redux";
import { addLibrary } from '../store/slices/showLibrary';

const EpisodeModal = ({ showModal, closeModal, episodeIds, handleWatchEpisode }) => {
    const dispatch = useDispatch();
    const handleClose = () => {
        closeModal();
        handleWatchEpisode();
    };

    const watchEpisodeAndPrevious = () => {
        api
            .watchSeason({
                episodeIds,
                userId: token.getId()
            }).then(res => {
                dispatch(addLibrary(res.data.showLibrary));
                closeModal();
            })
    }

  return (
    <Modal show={showModal} onHide={closeModal} backdrop="static" size="sm" centered>
        <Modal.Body className="text-center">Mark previous episodes as watched?</Modal.Body>
        <Modal.Footer className="justify-content-center">
            <Button variant='primary' onClick={() => watchEpisodeAndPrevious()}>
                Yes
            </Button>
            <Button variant="secondary" onClick={handleClose}>
                No
            </Button>
        </Modal.Footer>
    </Modal>
  )
}

export default EpisodeModal;