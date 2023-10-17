import { useState } from 'react';
import { register, logIn, logInGoogle } from '../firebase/auth';
import {
    Button,
    TextField,
    Stack,
    Card,
    CardContent,
    Typography,
} from '@mui/material';

function LoginCard() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    return <Card>
        <CardContent>
            <Stack spacing={2}>
                <TextField variant='filled' label='E-mail' type='email' value={email} onChange={event => setEmail(event.target.value)} />
                <TextField variant='filled' label='Jelszó' type='password' value={password} onChange={event => setPassword(event.target.value)} />
                <Stack direction='row' justifyContent='flex-end' spacing={2}>
                    <Button variant='contained' sx={{ flexGrow: 1 }} onClick={() => {
                        register(email, password);
                    }}>
                        Regisztrálás
                    </Button>
                    <Button variant='contained' sx={{ flexGrow: 1 }} onClick={() => {
                        logIn(email, password);
                    }}>
                        Bejelentkezés
                    </Button>
                </Stack>
                <Button variant='contained' color='secondary' onClick={() => {
                    logInGoogle();
                }}>
                    Belépés Google fiókkal
                </Button>
            </Stack>
        </CardContent>
    </Card>
}

export default LoginCard;
