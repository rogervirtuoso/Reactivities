import React from 'react';
import {Image, List, Popup} from 'semantic-ui-react';
import {IAttendee} from "../../../app/models/activity";

interface IProps {
    attendees: IAttendee[];
}

const styles = {
    borderColor: 'orange',
    borderWidth: 2
}

const ActivityListItemAttendees: React.FC<IProps> = ({attendees}) => {
    return (
        <List horizontal>
            {attendees.map(attendee => (
                <List.Item key={attendee.username}>
                    <Popup
                        header={attendee.displayName}
                        trigger={
                            <Image bordered style={attendee.following ? styles : null} size='mini' circular src={attendee.image || '/assets/user.png'}/>
                        }
                    />
                </List.Item>
            ))}
        </List>
    );
};

export default ActivityListItemAttendees;
