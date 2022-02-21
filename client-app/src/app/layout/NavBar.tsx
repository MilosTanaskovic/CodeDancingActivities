import React from 'react'
import { NavLink } from 'react-router-dom';
import { Button, Container, Menu } from 'semantic-ui-react'

export default function NavBar() {

    return (
        <Menu inverted fixed='top' >
            <Container>
                <Menu.Item as={NavLink} to='/' exact header>
                    <img src="/assets/logo.png" alt="codedancing logo" style={{marginRight: 10}}/>
                    CodeDancing Activities
                </Menu.Item>
                <Menu.Item as={NavLink} to='/activities' name='CodeDancing Activities' />
                <Menu.Item>
                    <Button as={NavLink} to='/createActivity' positive content='Create Activity' />
                </Menu.Item>
            </Container>
        </Menu>
    )
}
