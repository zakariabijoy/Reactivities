import { observer } from "mobx-react-lite";
import { Card, Header, Tab, Image, Grid, Button } from "semantic-ui-react";
import { Profile } from "../../app/models/profile";
import { useStore } from "../../app/stores/store";
import { useState } from "react";
import PhotoUploadWidget from "../../app/common/imageUpload/PhotoUploadWidget";

interface Props{
    profile: Profile;
}

export default observer(function ProfilePhotos({profile}:Props){
    const {profileStore : {isCurrentUser}} = useStore();
    const [addPhotoMode, setPhotoMode ] = useState(false);

    return(
        <Tab.Pane>
            <Grid>
                <Grid.Column width={16}>
                    <Header floated='left' icon='image' content='Photos'/>
                    {isCurrentUser && (
                        <Button 
                            floated="right" 
                            basic 
                            content={addPhotoMode ? 'Cancel' : 'Add Photo'}
                            onClick={() => setPhotoMode(!addPhotoMode)}
                        />
                    )}
                </Grid.Column>
                <Grid.Column width={16}>
                    {addPhotoMode ? (
                        <PhotoUploadWidget/>
                    ) : (
                        <Card.Group itemsPerRow={5}>
                            {profile.photos?.map((photo) => (
                                <Card key={photo.id}>
                                    <Image src={photo.url || '/assets/user.png'}/>
                                </Card>
                            ))}
                        </Card.Group>
                    )}
                </Grid.Column>
            </Grid>
        </Tab.Pane>
    )
})