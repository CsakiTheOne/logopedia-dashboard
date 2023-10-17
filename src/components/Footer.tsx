import { Container, Stack } from "@mui/material";
import { orange } from "@mui/material/colors";

function Footer() {
    return <div
        style={{
            marginTop: 16,
            padding: 32,
            backgroundColor: orange[200],
        }}
    >
        <Stack spacing={2} alignItems='center'>
            Támogatás: jockahun@gmail.com
        </Stack>
    </div>
}

export default Footer;
