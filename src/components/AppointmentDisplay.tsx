import { ListItemButton, ListItemText } from "@mui/material";
import Appointment from "../model/Appointment";
import { useEffect, useState } from "react";
import { getUserEmail } from "../firebase/firestore";

function AppointmentDisplay(props: any) {
    const appointment = props.appointment as Appointment;
    const [email, setEmail] = useState('');

    useEffect(() => {
        getUserEmail(appointment.userId, newEmail => setEmail(newEmail));
    }, [appointment]);

    return <ListItemButton
        selected={props.selected}
        onClick={props.onClick}
    >
        <ListItemText
            primary={`${appointment.workTitle}${props.showEmail ? ` - ${email}` : ''}`}
            secondary={`${appointment.date} ${appointment.startTime}`}
        />
    </ListItemButton>;
}

export default AppointmentDisplay;