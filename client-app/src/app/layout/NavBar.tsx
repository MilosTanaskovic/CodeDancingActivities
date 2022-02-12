import React from 'react'
import { Button, Container, Menu } from 'semantic-ui-react'

interface Props {
    openForm: () => void;
}

export default function NavBar({openForm}: Props) {
    return (
        <Menu inverted fixed='top' >
            <Container>
                <Menu.Item header>
                    <img src="/assets/logo.png" alt="codedancing logo" style={{marginRight: 10}}/>
                    CodeDancing Activities
                </Menu.Item>
                <Menu.Item name='CodeDancing Activities' />
                <Menu.Item>
                    <Button positive content='Create Activity' onClick={openForm}/>
                </Menu.Item>
            </Container>
        </Menu>
    )
}
