import { useEffect, useState } from 'react';
import { getCurrentUser, logOut } from '../../firebase/auth';
import { getAbout, getDayStart, setAbout, setDayEnd, setDayStart } from '../../firebase/rtdb';
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
import { deleteAppointment, getAppointments, getAppointmentsByDate, getRentalItems, getWorks, updateAppointment } from '../../firebase/firestore';
import Work from '../../model/Work';
import WorkDisplay from '../../components/WorkDisplay';
import { useNavigate } from 'react-router-dom';
import { DateCalendar } from '@mui/x-date-pickers';
import dayjs from 'dayjs';
import Appointment from '../../model/Appointment';
import AppointmentDisplay from '../../components/AppointmentDisplay';
import FullCalendar from '@fullcalendar/react';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction';
import { app } from '../../firebase/firebase';
import RentalItem from '../../model/RentalItem';
import ItemDisplay from '../../components/ItemDisplay';

function AdminPage() {
    const navigate = useNavigate();
    const [aboutUs, setAboutUs] = useState('');
    const [works, setWorks] = useState<Work[]>([]);
    const [appointments, setAppointments] = useState<Appointment[]>([]);
    const [rentalItems, setRentalItems] = useState<RentalItem[]>([]);

    useEffect(() => {
        getAbout(about => setAboutUs(about));
        getWorks(newWorks => setWorks(newWorks));
        getAppointments(newAppointments => setAppointments(newAppointments));
        getRentalItems(newRentalItems => setRentalItems(newRentalItems));
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
        <Card style={{ padding: 16 }}>
            <FullCalendar
                plugins={[timeGridPlugin, interactionPlugin]}
                initialView='timeGridWeek'
                allDaySlot={false}
                headerToolbar={{
                    start: 'title',
                    end: 'today prev,next',
                }}
                titleFormat={{
                    month: 'short',
                    day: 'numeric',
                }}
                weekends={false}
                events={appointments.map(appointment => {
                    const work = works.find(w => w.title === appointment.workTitle);
                    return {
                        title: work?.title,
                        start: `${appointment.date} ${appointment.startTime}`,
                        end: dayjs(appointment.date).add(work?.durationMinutes ?? 0, 'minute').toDate(),
                    };
                })}
                eventClick={event => {
                    console.log(`Clicked event: ${event.event.title}`);
                    console.log({
                        date: dayjs(event.event.start).format('YYYY-MM-DD'),
                        time: dayjs(event.event.start).format('HH:mm'),
                    });
                    // Find appointment
                    console.log(appointments.map(a => a.date + ' ' + a.startTime));
                    const appointment = appointments.find(a =>
                        a.date === dayjs(event.event.start).format('YYYY-MM-DD') &&
                        (a.startTime === dayjs(event.event.start).format('HH:mm') || a.startTime === dayjs(event.event.start).format('HH:mm:ss'))
                    );
                    if (appointment === undefined) {
                        console.error('Appointment not found!');
                        return;
                    }
                    // If appointment owner is current user, delete it
                    if (appointment.userId === getCurrentUser()?.uid) {
                        if (window.confirm('Biztosan törölni szeretnéd ezt a szabadnapot?')) {
                            deleteAppointment(appointment.id, isSuccessful => {
                                if (!isSuccessful) {
                                    alert('Sikertelen törlés!');
                                }
                                getAppointments(newAppointments => setAppointments(newAppointments));
                            });
                        }
                        return;
                    }
                    // Edit appointment
                    navigate(`/appointments/edit/${appointment.id}`);
                }}
                dateClick={event => {
                    const uid = getCurrentUser()?.uid;
                    const selectedDate = dayjs(event.date).format('YYYY-MM-DD');
                    if (uid === undefined) return;
                    const ap = new Appointment('', uid, 'Szabadnap', selectedDate, '02:00');
                    updateAppointment(ap, undefined, (isSuccesful) => {
                        if (!isSuccesful) {
                            alert('Sikertelen foglalás!');
                        }
                        getAppointments(newAppointments => setAppointments(newAppointments));
                    });
                }}
            />
        </Card>
        <Typography variant='h5'>Foglalkozások</Typography>
        <List>
            <Stack spacing={2}>
                {
                    works.filter(work => !work.tags.includes(Work.TAG_HIDDEN)).map(work => <WorkDisplay
                        showTime
                        work={work}
                        selected={true}
                        onClick={() => {
                            navigate(`/works/edit/${work.title}`);
                        }}
                    />)
                }
                <WorkDisplay
                    work={new Work('Új foglalkozás')}
                    selected={true}
                    onClick={() => {
                        navigate(`/works/edit/Új foglalkozás`);
                    }}
                />
            </Stack>
        </List>
        <Typography variant='h5'>Kölcsönözhető tárgyak</Typography>
        <List>
            <Stack spacing={2}>
                {
                    rentalItems.map(item => <ItemDisplay
                        item={item}
                        adminView
                    />)
                }
                <Button
                    variant='contained'
                    onClick={() => {
                        navigate(`/items/edit/new`);
                    }}
                >
                    Új tárgy
                </Button>
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
                        marks={[{ value: 5, label: '5:00' }, { value: 12, label: '12:00' }]}
                        min={5}
                        max={12}
                        valueLabelDisplay='auto'
                        onChange={(event, value) => { setDayStart(`${value}:00`); }}
                    />
                </Box>
                <Typography>Munkaidő vége:</Typography>
                <Box style={{ marginInlineStart: 16, marginInlineEnd: 16 }}>
                    <Slider
                        marks={[{ value: 12, label: '12:00' }, { value: 22, label: '22:00' }]}
                        min={12}
                        max={22}
                        valueLabelDisplay='auto'
                        onChange={(event, value) => { setDayEnd(`${value}:00`); }}
                    />
                </Box>
            </CardContent>
        </Card>
    </Page>;
}

export default AdminPage;
