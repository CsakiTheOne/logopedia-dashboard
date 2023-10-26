import { IconButton, ListItem, ListItemButton, ListItemText } from "@mui/material";
import HelpIcon from '@mui/icons-material/Help';

function WorkDisplay(props: any) {
    return <ListItem
        key={props.work.id}
        secondaryAction={
            <IconButton
                edge='end'
                onClick={() => {
                    alert(props.work.description);
                }}
            >
                <HelpIcon />
            </IconButton>
        }>
        <ListItemButton
            selected={props.selected}
            onClick={props.onClick}
        >
            <ListItemText
                primary={props.work.title}
                secondary={`${props.work.durationMinutes > 0 && props.showTime ? props.work.durationMinutes + ' perc' : ''}`}
            />
        </ListItemButton>
    </ListItem>;
}

export default WorkDisplay;