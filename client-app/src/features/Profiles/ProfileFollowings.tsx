import { observer } from "mobx-react-lite";
import { Tab, Grid, Header, Card } from "semantic-ui-react";
import { useStore } from "../../app/stores/store";
import ProfileCard from "./profileCard";
import { useEffect } from "react";

export default observer(function ProfileFollowings(){
    const {profileStore} = useStore();
    const {profile, followings, loadFollowings, loadingFollowings} = profileStore;

    useEffect(() =>{
        loadFollowings('following');
    },[loadFollowings])

    return (
        <Tab.Pane loading={loadingFollowings}>
            <Grid>
                <Grid.Column width='16'>
                    <Header
                        floated='left'
                        icon='user'
                        content={`People following ${profile!.displayName}`}
                    />
                </Grid.Column>
                <Grid.Column width={16}>
                    <Card.Group itemsPerRow={4}>
                        {followings.map(profile => (
                            <ProfileCard key={profile.username} profile={profile} />
                        ))}
                    </Card.Group>
                </Grid.Column>
            </Grid>
        </Tab.Pane>
    )
})