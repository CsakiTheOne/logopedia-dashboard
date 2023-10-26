import { useNavigate, useParams } from "react-router-dom";
import Page from "../../components/Page";
import { useEffect, useState } from "react";
import { getRentalItemById, updateRentalItem, deleteRentalItem } from "../../firebase/firestore";
import { AppBar, Toolbar, Typography, Button, TextField, Stack, Select, MenuItem, FormControl, InputLabel, Card, CardContent, CardMedia } from "@mui/material";
import { logOut } from "../../firebase/auth";
import RentalItem from "../../model/RentalItem";
import { uploadImage } from "../../firebase/storage";

function EditRentalItemPage(props: any) {
    const navigate = useNavigate();
    const { itemId } = useParams();
    const [item, setItem] = useState<RentalItem | undefined>(undefined);

    useEffect(() => {
        if (!itemId || itemId === '' || itemId === 'new') {
            setItem(new RentalItem('', 'Új tárgy', '', '', 'available'));
            return;
        }
        getRentalItemById(itemId, newItem => setItem(newItem));
    }, [itemId])

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
        <Typography variant='h5'>{item?.name}</Typography>

        <TextField
            variant='filled'
            label='Név'
            value={item?.name}
            onChange={event => {
                setItem({ ...item, name: event.target.value } as RentalItem);
            }}
        />
        <TextField
            variant='filled'
            label='Leírás'
            value={item?.description}
            onChange={event => {
                setItem({ ...item, description: event.target.value } as RentalItem);
            }}
        />
        <Card>
            <CardMedia
                component='img'
                height='200'
                image={item?.imageUrl}
            />
            <CardContent>
                <TextField
                    fullWidth
                    variant='filled'
                    label='Kép URL-je'
                    value={item?.imageUrl}
                    onChange={event => {
                        setItem({ ...item, imageUrl: event.target.value } as RentalItem);
                    }}
                />
                <Typography>Vagy kép feltöltése:</Typography>
                <input
                    type="file"
                    multiple={false}
                    accept="image/*"
                    onChange={event => {
                        uploadImage(event.target.files?.item(0), (url) => {
                            setItem({ ...item, imageUrl: url } as RentalItem);
                        });
                    }}
                />
            </CardContent>
        </Card>
        <FormControl fullWidth>
            <InputLabel id="status-label">Státusz</InputLabel>
            <Select
                labelId="status-label"
                label="Státusz"
                value={item?.status}
                onChange={event => {
                    setItem({ ...item, status: event.target.value } as RentalItem);
                }}
            >
                <MenuItem value='available'>Elérhető</MenuItem>
                <MenuItem value='unavailable'>Nem elérhető</MenuItem>
                <MenuItem value='rented'>Kölcsönözve</MenuItem>
                <MenuItem value='requested'>Kérelmezve</MenuItem>
            </Select>
        </FormControl>

        <TextField
            variant='filled'
            label='Email cím (akinél a tárgy van vagy aki kérte)'
            value={item?.currentHolderEmail}
            onChange={event => {
                setItem({ ...item, currentHolderEmail: event.target.value } as RentalItem);
            }}
        />

        <Stack direction='row' spacing={2}>
            <Button sx={{ flexGrow: 1 }} onClick={() => {
                navigate('/admin');
            }}>
                Vissza
            </Button>
            <Button variant='contained' sx={{ flexGrow: 1 }} onClick={() => {
                if (!item) {
                    alert('Nem sikerült menteni a tárgyat!');
                    return;
                }
                updateRentalItem(
                    item,
                    item.id,
                    isSuccesful => {
                        navigate('/admin');
                    }
                );
            }}>
                Mentés
            </Button>
        </Stack>
        <Button
            variant="contained"
            color='error'
            onClick={() => {
                deleteRentalItem(
                    item?.id,
                    isSuccesful => {
                        navigate('/admin');
                    }
                );
            }}>
            Törlés
        </Button>
    </Page>;
}

export default EditRentalItemPage;
