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
import { deleteWork, getWorks, updateWork } from '../../firebase/firestore';
import Work from '../../model/Work';
import WorkDisplay from '../../components/WorkDisplay';
import { useNavigate, useParams } from 'react-router-dom';

function EditWorkPage(props: any) {
    const navigate = useNavigate();
    const { workTitle } = useParams();
    const [title, setTitle] = useState(workTitle ? workTitle : '');
    const [desc, setDesc] = useState('');
    const [durationMinuteText, setDurationMinutesText] = useState('');

    useEffect(() => {
        getWorks(works => {
            const work = works.find(w => w.title === workTitle);
            if (work) {
                setTitle(work.title);
                setDesc(work.description);
                setDurationMinutesText(work.durationMinutes.toString());
            }
        });
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
        <Typography variant='h5'>{title}</Typography>

        <TextField
            variant='filled'
            label='Cím'
            value={title}
            onChange={event => {
                setTitle(event.target.value);
            }}
        />

        <TextField
            variant='filled'
            label='Leírás'
            value={desc}
            onChange={event => {
                setDesc(event.target.value);
            }}
            multiline
            minRows={3}
        />

        <TextField
            variant='filled'
            label='Foglalkozás ideje (perc)'
            type='number'
            value={durationMinuteText}
            onChange={event => {
                setDurationMinutesText(event.target.value);
            }}
        />

        <Stack direction='row' spacing={2}>
            <Button sx={{ flexGrow: 1 }} onClick={() => {
                navigate('/admin');
            }}>
                Vissza
            </Button>
            <Button variant='contained' sx={{ flexGrow: 1 }} onClick={() => {
                updateWork(
                    new Work(title, desc, Number.parseInt(durationMinuteText)),
                    workTitle,
                    isSuccesful => {
                        navigate('/admin');
                    }
                );
            }}>
                Mentés
            </Button>
        </Stack>
        <Button color='error' onClick={() => {
            deleteWork(
                workTitle,
                isSuccesful => {
                    navigate('/admin');
                }
            );
        }}>
            Törlés
        </Button>
    </Page>;
}

export default EditWorkPage;
