import { useEffect, useState } from 'react';
import { addOnAuthStateChangedListener, getCurrentUser, logOut, removeOnAuthStateChangedListener } from '../../firebase/auth';
import { getAbout } from '../../firebase/rtdb';
import Page from '../../components/Page';
import {
    AppBar,
    Toolbar,
    Typography,
    Button,
    List,
    Stack,
    Dialog,
    DialogContent,
    DialogTitle,
    DialogActions,
    Card,
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import { useNavigate } from 'react-router-dom';
import React from 'react';
import { User } from 'firebase/auth';
import LoginCard from '../../components/LoginCard';
import banner from '../../media/banner.png';
import WorkDisplay from '../../components/WorkDisplay';
import { deleteAppointment, getAppointmentsByUser, getWorks } from '../../firebase/firestore';
import Work from '../../model/Work';
import Appointment from '../../model/Appointment';
import AppointmentDisplay from '../../components/AppointmentDisplay';
import { deleteApp } from 'firebase/app';
import FullCalendar from '@fullcalendar/react';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction';
import dayjs from 'dayjs';

function MainPage() {
    const navigate = useNavigate();
    const [aboutUs, setAboutUs] = useState('');
    const [works, setWorks] = useState<Work[]>([]);
    const [appointments, setAppointments] = useState<Appointment[]>([]);
    const [isLoggedIn, setIsLoggedIn] = useState(false);

    const [selectedWork, setSelectedWork] = useState<Work | null>(null);

    useEffect(() => {
        getAbout(about => setAboutUs(about));
        getWorks(newWorks => setWorks(newWorks));

        setIsLoggedIn(!!getCurrentUser());

        const authStateChangedListener = (user: any) => {
            setIsLoggedIn(!!user)

        };

        addOnAuthStateChangedListener(authStateChangedListener);

        return () => {
            removeOnAuthStateChangedListener(authStateChangedListener);
        };
    }, []);

    useEffect(() => {
        if (!isLoggedIn) return;
        getAppointmentsByUser(getCurrentUser()?.uid, newAppointments => setAppointments(newAppointments));
    }, [isLoggedIn]);

    return <Page
        header={
            <>
                <AppBar position='static'>
                    <Toolbar>
                        <Typography sx={{ flexGrow: 1 }}>Fanni Logopédia</Typography>
                        {
                            isLoggedIn ?
                                <Button onClick={() => {
                                    logOut();
                                }} color='inherit'>
                                    Kijelentkezés
                                </Button> : <></>
                        }

                    </Toolbar>
                </AppBar>
                <img
                    style={{ width: '100%', maxHeight: 300, objectFit: 'cover' }}
                    src={banner}
                    alt='Fanni Logopédia'
                />
            </>
        }
    >
        {
            <Dialog open={selectedWork !== null} onClose={() => setSelectedWork(null)}>
                <DialogTitle>{selectedWork?.title}</DialogTitle>
                <DialogContent dangerouslySetInnerHTML={{ __html: selectedWork ? selectedWork.description.replace("\n", "<br/>") : '' }}></DialogContent>
                <DialogActions>
                    <Button onClick={() => setSelectedWork(null)} autoFocus>
                        Bezárás
                    </Button>
                </DialogActions>
            </Dialog>
        }
        {
            isLoggedIn ?
                <>
                    <Typography variant='h5'>Fejlesztő eszközök, játékok és könyvek</Typography>
                    <Button onClick={() => navigate('/rental')} variant='contained'>
                        Böngészés
                    </Button>
                    <Typography variant='h5'>Foglalkozásaim</Typography>
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
                                const appointment = appointments.find(a => a.date === dayjs(event.event.start).format('YYYY-MM-DD') && a.startTime === dayjs(event.event.start).format('HH:mm'));
                                if (appointment === undefined) return;
                                const ans = prompt('Le szeretnéd mondani ezt az időpontot? Ha igen, írd be, hogy "lemondás"');
                                if (ans === 'lemondás') {
                                    deleteAppointment(appointment.id, isSuccesful => {
                                        if (isSuccesful) {
                                            window.location.reload();
                                        }
                                        else {
                                            alert('Sikertelen lemondás! Próbáld újra később!');
                                        }
                                    });
                                }
                            }}
                        />
                    </Card>
                    <Button onClick={() => navigate('/booking')} variant='contained' startIcon={<AddIcon />}>
                        Új foglalkozás időpont kérése
                    </Button>
                </> :
                <>
                    <Typography variant='h5'>Rólam</Typography>
                    <Typography>{aboutUs}</Typography>
                    <Typography variant='h5'>Időpont foglaláshoz és eszköz kölcsönzéshez jelentkezz be!</Typography>
                    <LoginCard />
                    <Typography variant='h5'>Szolgáltatások</Typography>
                    <List>
                        <Stack spacing={2}>
                            {works.filter(work => !work.tags.includes(Work.TAG_HIDDEN)).map(work => <WorkDisplay
                                work={work}
                                selected={true}
                                onClick={() => { setSelectedWork(work); }}
                            />
                            )}
                        </Stack>
                    </List>
                </>

        }

    </Page>;
}

export default MainPage;
