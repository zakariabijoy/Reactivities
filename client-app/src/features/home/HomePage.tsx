import { Link } from "react-router-dom";
import { Container, Header, Segment, Image, Button } from "semantic-ui-react";
import { useStore } from "../../app/stores/store";
import { observer } from "mobx-react-lite";

export default observer(function HomePage(){
    const {userStore}  = useStore();

    return(
        <Segment inverted textAlign="center" vertical className="masthead">
            <Container text>
                <Header as='h1' inverted>
                    <Image size="massive" src='/assets/logo.png' alt='logo' style={{marginBottom: 12}}/>
                    Reactivities
                </Header>
                {userStore.isLoggedIn? (
                    <>
                        <Header as='h2' inverted content='Welcome to Reactivities'/>
                        <Button as={Link} to='/activities' size="huge" inverted>
                            Go to Activities!
                        </Button>
                    </>
                    
                ): (
                    <Button as={Link} to='/login' size="huge" inverted>
                        Login!
                    </Button>
                )}        
            </Container>
        </Segment>
    )
})