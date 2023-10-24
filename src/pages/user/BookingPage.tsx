import { useState, useEffect } from 'react';
import dayjs from 'dayjs';
import { getCurrentUser, logOut } from '../../firebase/auth';
import { getAppointments, getFreeTimes, getWorks, updateAppointment } from '../../firebase/firestore';
import Page from '../../components/Page';
import {
    AppBar,
    Toolbar,
    Typography,
    Button,
    Stepper,
    Step,
    StepLabel,
    StepContent,
    Stack,
    List,
    ListItemText,
    ListItemButton,
    Card,
} from '@mui/material';
import { DateCalendar } from '@mui/x-date-pickers';
import { useNavigate } from 'react-router-dom';
import React from 'react';
import Work from '../../model/Work';
import WorkDisplay from '../../components/WorkDisplay';
import Appointment from '../../model/Appointment';
import FullCalendar from '@fullcalendar/react';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction';
import { getDayEnd, getDayStart } from '../../firebase/rtdb';

function BookingPage() {
    const navigate = useNavigate();
    const [activeStep, setActiveStep] = useState(0);
    const [works, setWorks] = useState<Work[]>([]);
    const [selectedWorkTitle, setSelectedWorkTitle] = useState('');
    const [selectedDate, setSelectedDate] = useState('');
    const [selectedTime, setSelectedTime] = useState('');
    const [dayStart, setDayStart] = useState('8:00');
    const [dayEnd, setDayEnd] = useState('16:00');
    const [appointments, setAppointments] = useState<Appointment[]>([]);
    const [disabledTimes, setDisabledTimes] = useState<{ start: string, end: string, display: string }[]>([]);

    useEffect(() => {
        getWorks(newWorks => { setWorks(newWorks); });
        getDayStart(newDayStart => { setDayStart(newDayStart); });
        getDayEnd(newDayEnd => { setDayEnd(newDayEnd); });
        getAppointments(newAppointments => { setAppointments(newAppointments); });
    }, []);

    useEffect(() => {
        //TODO: szabadnapok, heti limitek, szünetek
        setDisabledTimes([
            ...appointments.map(appointment => {
                return {
                    start: dayjs(`${appointment.date}T${appointment.startTime}`)
                        .subtract(30, 'minute')
                        .format('YYYY-MM-DDTHH:mm:ss'),
                    end: dayjs(`${appointment.date}T${appointment.startTime}`)
                        .add(30, 'minute')
                        .add(works.find(w => w.title === appointment.workTitle)?.durationMinutes ?? 0, 'minute')
                        .format('YYYY-MM-DDTHH:mm:ss'),
                    display: 'background',
                };
            }),
        ]);
    }, [appointments, works]);

    function NavigationButtons(props: any) {
        return <Stack direction='row' justifyContent='flex-end' spacing={2}>
            <Button
                onClick={() => {
                    if (props.onBackClick === undefined) {
                        setActiveStep(activeStep - 1);
                    }
                    else props.onBackClick();
                }}
            >
                {props.backLabel === undefined ? 'Vissza' : props.backLabel}
            </Button>
            <Button
                disabled={props.nextEnabled !== undefined && !!props.nextEnabled === false}
                variant="contained"
                onClick={() => {
                    if (props.onNextClick === undefined) {
                        setActiveStep(activeStep + 1);
                    }
                    else props.onNextClick();
                }}
            >
                {props.nextLabel === undefined ? 'Tovább' : props.nextLabel}
            </Button>
        </Stack>
    }

    return <Page
        header={
            <AppBar position='static'>
                <Toolbar>
                    <Typography sx={{ flexGrow: 1 }}>Fanni Logopédia</Typography>
                    <Button onClick={() => {
                        logOut();
                    }} color='inherit'>Kijelentkezés</Button>
                </Toolbar>
            </AppBar>
        }
    >
        <Typography variant='h5'>Időpont foglalás</Typography>

        <Stepper activeStep={activeStep} orientation='vertical'>
            <Step>
                <StepLabel>Foglalkozás: {selectedWorkTitle}</StepLabel>
                <StepContent>
                    <List>
                        {works.filter(work => !work.tags.includes(Work.TAG_HIDDEN)).map(work => <WorkDisplay
                            showTime
                            work={work}
                            selected={selectedWorkTitle === work.title}
                            onClick={() => {
                                setSelectedWorkTitle(work.title);
                            }}
                        />
                        )}
                    </List>
                    <NavigationButtons backLabel='Mégsem' onBackClick={() => navigate('/')} nextEnabled={selectedWorkTitle !== ''} />
                </StepContent>
            </Step>
            <Step>
                <StepLabel>Dátum is idő: {selectedDate} {selectedTime}</StepLabel>
                <StepContent>
                    <Card style={{ padding: 16 }}>
                        <FullCalendar
                            plugins={[timeGridPlugin, interactionPlugin]}
                            initialView='timeGridWeek'
                            allDaySlot={false}
                            headerToolbar={{
                                start: 'title',
                                end: 'prev,next',
                            }}
                            titleFormat={{
                                month: 'short',
                                day: 'numeric',
                            }}
                            weekends={false}
                            businessHours={{
                                startTime: dayStart,
                                endTime: dayEnd,
                            }}
                            validRange={{
                                start: dayjs().add(2, 'day').format('YYYY-MM-DD'),
                                end: dayjs().add(2, 'month').format('YYYY-MM-DD'),
                            }}
                            dateClick={event => {
                                const eventDate = event.dateStr.split('T')[0];
                                const startMins = dayjs(event.dateStr).hour() * 60 + dayjs(event.dateStr).minute();
                                const endMins = startMins + (works.find(w => w.title === selectedWorkTitle)?.durationMinutes ?? 0);

                                // Check work hours
                                const dayStartMins = dayjs(dayStart, 'HH:mm').hour() * 60 + dayjs(dayStart, 'HH:mm').minute();
                                const dayEndMins = dayjs(dayEnd, 'HH:mm').hour() * 60 + dayjs(dayEnd, 'HH:mm').minute();
                                if (startMins < dayStartMins || endMins > dayEndMins) return;

                                // Check if selected time is not overlapping with disabled times
                                let isDisabled = false;
                                disabledTimes.forEach(disabledTime => {
                                    const disabledTimeDate = disabledTime.start.split('T')[0];
                                    if (eventDate !== disabledTimeDate) return;
                                    const disabledStartMins = dayjs(disabledTime.start).hour() * 60 + dayjs(disabledTime.start).minute();
                                    const disabledEndMins = dayjs(disabledTime.end).hour() * 60 + dayjs(disabledTime.end).minute();
                                    if (startMins < disabledEndMins && endMins > disabledStartMins) isDisabled = true;
                                });
                                if (isDisabled) return;

                                // Select date and time
                                setSelectedDate(event.dateStr.split('T')[0]);
                                setSelectedTime(event.dateStr.split('T')[1].split('+')[0]);
                            }}
                            events={[
                                {
                                    start: selectedDate + 'T' + selectedTime,
                                    end: dayjs(selectedDate + 'T' + selectedTime).add(works.find(w => w.title === selectedWorkTitle)?.durationMinutes ?? 0, 'minute').format('YYYY-MM-DDTHH:mm:ss'),
                                },
                                ...disabledTimes,
                            ]}
                        />
                    </Card>
                    <NavigationButtons nextEnabled={selectedDate !== ''} />
                </StepContent>
            </Step>
            <Step>
                <StepLabel>Foglalás</StepLabel>
                <StepContent>
                    <Typography>Foglalkozás: {selectedWorkTitle}</Typography>
                    <Typography>Dátum: {selectedDate}</Typography>
                    <Typography>Idő: {selectedTime}</Typography>
                    <NavigationButtons
                        nextLabel='Foglalás'
                        onNextClick={() => {
                            const uid = getCurrentUser()?.uid;
                            if (uid === undefined) return;
                            const ap = new Appointment('', uid, selectedWorkTitle, selectedDate, selectedTime);
                            updateAppointment(ap, undefined, (isSuccesful) => {
                                if (isSuccesful) {
                                    alert('Sikeres foglalás!');
                                    navigate('/');
                                }
                                else {
                                    alert('Sikertelen foglalás!');
                                }
                            });
                        }}
                    />
                </StepContent>
            </Step>
        </Stepper>

    </Page>;
}

export default BookingPage;
