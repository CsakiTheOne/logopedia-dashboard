import { useNavigate, useParams } from "react-router-dom";
import Page from "../../components/Page";
import Appointment from "../../model/Appointment";
import { useEffect, useState } from "react";
import { getAppointmentById, getUserEmail, deleteAppointment } from "../../firebase/firestore";
import { AppBar, Toolbar, Typography, Button, TextField } from "@mui/material";
import { logOut } from "../../firebase/auth";

function EditAppointmentPage(props: any) {
    const navigate = useNavigate();
    const { appointmentId } = useParams();
    const [appointment, setAppointment] = useState<Appointment | undefined>(undefined);
    const [email, setEmail] = useState('');

    useEffect(() => {
        getAppointmentById(appointmentId, newAppointment => {
            setAppointment(newAppointment);
        });
    }, [appointmentId])

    useEffect(() => {
        if (!appointment) return;
        getUserEmail(appointment.userId, newEmail => setEmail(newEmail));
    }, [appointment]);

    return <Page
        header={
            <AppBar position='static'>
                <Toolbar>
                    <Typography sx={{ flexGrow: 1 }}>Fanni Logopédia - Admin felület</Typography>
                    <Button onClick={() => {
                        logOut();
                    }} color='inherit'>Kijelentkezés</Button>
                </Toolbar>
            </AppBar>
        }
    >
        <Typography variant='h5'>Időpont részletei</Typography>
        {
            appointment && <>
                <TextField label="Foglalkozás" value={appointment.workTitle} />
                <TextField label="E-mail" value={email} />
                <TextField label="Dátum és idő" value={appointment.date + ' ' + appointment.startTime} />
                <Button
                    onClick={() => {
                        navigate('/admin');
                    }}
                    variant="contained"
                >
                    Vissza
                </Button>
                <Button
                    onClick={() => {
                        if (window.confirm('Biztosan törölni szeretnéd ezt az időpontot?')) {
                            deleteAppointment(appointmentId, () => {
                                navigate('/admin');
                            });
                        }
                    }}
                    variant="contained"
                    color="error">
                    Törlés
                </Button>
            </>
        }
    </Page>;
}

export default EditAppointmentPage;
