import { Grid } from "semantic-ui-react";
import ProfileHeader from "./ProfileHeader";
import ProfileContent from "./ProfileContent";

export default function ProfilePage(){
    return (
       <Grid>
            <Grid.Column width={16}>
                <ProfileHeader/>
                <ProfileContent/>
            </Grid.Column>
       </Grid>
    )
}