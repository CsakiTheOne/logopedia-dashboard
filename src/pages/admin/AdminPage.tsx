import { useEffect, useState } from 'react';
import { logOut } from '../../firebase/auth';
import { getAbout, setAbout } from '../../firebase/rtdb';
import Page from '../../components/Page';
import {
    AppBar,
    Toolbar,
    Typography,
    Button,
    TextField,
    Slider,
    Card,
    CardContent,
    Box,
    List,
    Stack,
} from '@mui/material';
import React from 'react';
import { getAppointmentsByDate, getWorks } from '../../firebase/firestore';
import Work from '../../model/Work';
import WorkDisplay from '../../components/WorkDisplay';
import { useNavigate } from 'react-router-dom';
import { DateCalendar } from '@mui/x-date-pickers';
import dayjs from 'dayjs';
import Appointment from '../../model/Appointment';
import AppointmentDisplay from '../../components/AppointmentDisplay';

function AdminPage() {
    const navigate = useNavigate();
    const [aboutUs, setAboutUs] = useState('');
    const [works, setWorks] = useState<Work[]>([]);
    const [appointmentsToday, setAppointmentsToday] = useState<Appointment[]>([]);

    useEffect(() => {
        getAbout(about => setAboutUs(about));
        getWorks(newWorks => setWorks(newWorks));
    }, []);

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
        <Typography variant='h5'>Időpontok</Typography>
        <DateCalendar
            views={['day']}
            minDate={dayjs().add(1, 'day')}
            maxDate={dayjs().add(2, 'month')}
            onChange={event => {
                const date = event?.format('YYYY-MM-DD');
                if (date === undefined) return;
                getAppointmentsByDate(date, newAppointments => setAppointmentsToday(newAppointments));
            }}
        />
        <List>
            <Stack spacing={2}>
                {appointmentsToday.map(appointment => <AppointmentDisplay
                    appointment={appointment}
                    showEmail={true}
                    onClick={() => {
                        //TODO: something with appointments
                    }}
                />)}
            </Stack>
        </List>
        <Typography variant='h5'>Foglalkozások</Typography>
        <List>
            <Stack spacing={2}>
                {works.map(work => <WorkDisplay
                    showTime
                    work={work}
                    selected={true}
                    onClick={() => {
                        navigate(`/works/edit/${work.title}`);
                    }}
                />
                )}
                <WorkDisplay
                    work={new Work('Új foglalkozás')}
                    selected={true}
                    onClick={() => {
                        navigate(`/works/edit/Új foglalkozás`);
                    }}
                />
            </Stack>
        </List>
        <Typography variant='h5'>Beállítások</Typography>
        <Typography variant='h6'>Rólam</Typography>
        <TextField
            variant='filled'
            label='Bemutatkozás és alapinfók'
            value={aboutUs}
            onChange={event => {
                setAboutUs(event.target.value);
                setAbout(event.target.value);
            }}
            multiline
            minRows={3}
        />
        <Typography variant='h6'>Munkaidő</Typography>
        <Card>
            <CardContent>
                <Typography>Munkaidő kezdete:</Typography>
                <Box style={{ marginInlineStart: 16, marginInlineEnd: 16 }}>
                    <Slider
                        marks={[{ value: 6, label: '6:00' }, { value: 10, label: '10:00' }]}
                        min={6}
                        max={10}
                        valueLabelDisplay='auto'
                    />
                </Box>
                <Typography>Munkaidő vége:</Typography>
                <Box style={{ marginInlineStart: 16, marginInlineEnd: 16 }}>
                    <Slider
                        marks={[{ value: 14, label: '14:00' }, { value: 20, label: '20:00' }]}
                        min={14}
                        max={20}
                        valueLabelDisplay='auto'
                    />
                </Box>
            </CardContent>
        </Card>
    </Page>;
}

export default AdminPage;
