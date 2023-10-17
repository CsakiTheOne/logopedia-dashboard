import React from 'react';
import RentalItem from '../model/RentalItem';
import { ListItemButton, ListItemText } from '@mui/material';

function ItemDisplay(props: any) {
    const item = props.item as RentalItem;

    return <ListItemButton
        selected={props.selected}
        onClick={props.onClick}
    >
        <ListItemText
            primary={`${item.name}`}
        />
    </ListItemButton>;
}

export default ItemDisplay;