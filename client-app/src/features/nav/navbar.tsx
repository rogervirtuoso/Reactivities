import React, {FC} from 'react';
import {Button, Container, Menu} from "semantic-ui-react";

interface IProps{
    openCreateForm: () => void;
}

const Navbar:FC<IProps> = ({openCreateForm}) => {
    return (
        <Menu fixed={"top"} inverted>
            <Container>
                <Menu.Item header>
                    <img src="/assets/logo.png" alt="logo" style={{marginRight: '10px'}}></img>
                    Reactivities
                </Menu.Item>
                <Menu.Item name='Activities'/>
                <Menu.Item>
                    <Button onClick={openCreateForm} type="button" positive content='Create Activity'></Button>
                </Menu.Item>
            </Container>
        </Menu>
    );
};

export default Navbar