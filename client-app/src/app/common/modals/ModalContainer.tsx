import React, {useContext} from 'react';
import {Modal} from "semantic-ui-react";
import {RootStoreContext} from "../../stores/rootStore";
import {observer} from "mobx-react-lite";


const ModalContainer = () => {
    const rootStore = useContext(RootStoreContext);
    const {modal: {open, body}, closeModal, openModal} = rootStore.modalStore;

    return (
        <Modal
            onClose={closeModal}
            onOpen={openModal}
            open={open}
            size='mini'
        >
            <Modal.Content>
                {body}
            </Modal.Content>
            {/*<Modal.Actions>*/}
            {/*    <Button color='black' onClick={closeModal}>*/}
            {/*        Nope*/}
            {/*    </Button>*/}
            {/*    <Button*/}
            {/*        content="Yep, that's me"*/}
            {/*        labelPosition='right'*/}
            {/*        icon='checkmark'*/}
            {/*        onClick={closeModal}*/}
            {/*        positive*/}
            {/*    />*/}
            {/*</Modal.Actions>*/}
        </Modal>
    )
};

export default observer(ModalContainer);
