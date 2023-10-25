import React from 'react';
import RentalItem from '../model/RentalItem';
import { Button, Card, CardActions, CardContent, CardHeader, CardMedia, ListItemButton, ListItemText, Typography } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { deleteRentalItem, getUserEmail, updateRentalItem } from '../firebase/firestore';
import { getCurrentUser } from '../firebase/auth';

function ItemDisplay(props: any) {
    const navigate = useNavigate();
    const item = props.item as RentalItem;
    const adminView = props.adminView as boolean;

    return <Card>
        <CardHeader
            title={item.name}
        />
        <CardMedia
            style={{ maxHeight: 500 }}
            component='img'
            image={item.imageUrl}
            alt='Tárgy képe'
        />
        <CardContent>
            <Typography>
                {item.description}
            </Typography>
        </CardContent>
        <CardActions>
            {
                adminView ? <>
                    <Button
                        onClick={() => {
                            navigate(`/items/edit/${item.id}`);
                        }}
                    >
                        Szerkesztés
                    </Button>
                    <Button
                        color='error'
                        onClick={() => {
                            window.confirm('Biztosan törölni szeretnéd ezt a tárgyat?') &&
                                deleteRentalItem(item.id, () => {
                                    window.location.reload();
                                });
                        }}
                    >
                        Törlés
                    </Button>
                </> : <>
                    <Button
                        disabled={item.status !== 'available'}
                        onClick={() => {
                            if (!window.confirm('Biztosan kölcsönözni szeretnéd ezt a tárgyat?')) return;
                            getUserEmail(getCurrentUser()?.uid, email => {
                                updateRentalItem({ ...item, status: 'requested', currentHolderEmail: email }, item.id, isSuccessful => {
                                    alert(isSuccessful ? 'Sikeres kölcsönzés! Fanni email-ben megkeres a részletekkel.' : 'Sikertelen kölcsönzés. Próbáld újra később!');
                                    window.location.reload();
                                });
                            });
                        }}
                    >
                        Kölcsönzés
                    </Button>
                </>
            }
        </CardActions>
    </Card>;
}

export default ItemDisplay;