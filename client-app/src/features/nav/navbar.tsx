import React, {FC, useContext} from 'react';
import {Button, Container, Dropdown, Image, Menu} from "semantic-ui-react";
import {observer} from "mobx-react-lite";
import {Link, NavLink} from "react-router-dom";
import {RootStoreContext} from "../../app/stores/rootStore";


const Navbar: FC = () => {
    const rootStore = useContext(RootStoreContext);
    const {isLoggedIn, user, logout} = rootStore.userStore;
    return (
        <Menu fixed={"top"} inverted>
            <Container>
                <Menu.Item header as={NavLink} exact to='/'>
                    <img src="/assets/logo.png" alt="logo" style={{marginRight: '10px'}}></img>
                    Reactivities
                </Menu.Item>
                <Menu.Item name='Activities' as={NavLink} to='/activities'/>
                <Menu.Item>
                    <Button onClick={rootStore.activityStore.openCreateForm} type="button" positive as={NavLink}
                            to='/createActivity'
                            content='Create Activity'></Button>
                </Menu.Item>
                {user &&
                <Menu.Item position='right'>
                    <Image avatar spaced='right' src={user.image || '/assets/user.png'}/>
                    <Dropdown pointing='top left' text={user.displayName}>
                        <Dropdown.Menu>
                            <Dropdown.Item
                                as={Link}
                                to={`/profile/username`}
                                text='My profile'
                                icon='user'/>
                            <Dropdown.Item text='Logout' icon='power' onClick={logout}/>
                        </Dropdown.Menu>
                    </Dropdown>
                </Menu.Item>
                }
            </Container>
        </Menu>
    );
};

export default observer(Navbar)