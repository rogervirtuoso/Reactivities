import React, {FC, useContext} from 'react';
import {Button, Container, Menu} from "semantic-ui-react";
import ActivityStore from '../../app/stores/activityStore'
import {observer} from "mobx-react-lite";


const Navbar: FC = () => {
    const activityStore = useContext(ActivityStore);
    return (
        <Menu fixed={"top"} inverted>
            <Container>
                <Menu.Item header>
                    <img src="/assets/logo.png" alt="logo" style={{marginRight: '10px'}}></img>
                    Reactivities
                </Menu.Item>
                <Menu.Item name='Activities'/>
                <Menu.Item>
                    <Button onClick={activityStore.openCreateForm} type="button" positive
                            content='Create Activity'></Button>
                </Menu.Item>
            </Container>
        </Menu>
    );
};

export default observer(Navbar)