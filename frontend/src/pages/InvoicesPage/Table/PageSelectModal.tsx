import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import { Form } from "react-bootstrap";
import { useState } from "react";

interface PageSelectModalProps {
    showModal: boolean,
    setPage: (page: number) => void,
    onCloseModal: () => void
}

const PageSelectModal: React.FC<PageSelectModalProps> = ({ showModal, setPage, onCloseModal }) => {
    const [pickedPage, setPickedPage] = useState(1);
    
    const saveChanges = () => {
        setPage(pickedPage);
        onCloseModal();
    }

	return (
		<Modal show={showModal} onHide={onCloseModal}>
				<Modal.Header closeButton>
					<Modal.Title>Izberite stran</Modal.Title>
				</Modal.Header>
				<Modal.Body>
                <Form.Control type="number" placeholder="1" min="1" max="10" value={pickedPage} onChange={(e) => setPickedPage(Number(e.target.value))} />
				</Modal.Body>
				<Modal.Footer>
					<Button variant="secondary" onClick={onCloseModal}>Close</Button>
					<Button variant="primary" onClick={saveChanges}>Go To Page</Button>
				</Modal.Footer>
		</Modal>
	);
};

export default PageSelectModal;
