import React from 'react';
import RentalItem from '../model/RentalItem';
import { Button, Card, CardActions, CardContent, CardHeader, CardMedia, ListItemButton, ListItemText, Typography } from '@mui/material';

function ItemDisplay(props: any) {
    const item = props.item as RentalItem;

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
            <Button
                disabled={['rented', 'unavailable'].includes(item.status)}
            >
                Kölcsönzés
            </Button>
        </CardActions>
    </Card>;
}

export default ItemDisplay;