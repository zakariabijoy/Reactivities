import { observer } from "mobx-react-lite";
import { List, Image, Popup, PopupContent } from "semantic-ui-react";
import { Profile } from "../../../app/models/profile";
import { Link } from "react-router-dom";
import ProfileCard from "../../Profiles/profileCard";

interface  Props{
    attendees: Profile[]
}

export default observer (function ActivityListItemAttendee({attendees}:Props){
    const style ={
        borderColor:'orange',
        borderWidth: 2
    }
    
    return(
    <List horizontal>
        {attendees.map(attendee => (
            <Popup 
                hoverable 
                key={attendee.username} 
                trigger={
                    <List.Item key={attendee.username} as={Link} to={`/profiles/${attendee.username}`}>
                        <Image
                         size="mini" 
                         circular 
                         src={ attendee.image || '/assets/user.png'}
                         style={attendee.following ? style : null}
                         />
                    </List.Item>
                }
            >
                <PopupContent>
                    <ProfileCard profile={attendee}/>
                </PopupContent>
                
            </Popup>
            
        ))}
    </List>
    )
})