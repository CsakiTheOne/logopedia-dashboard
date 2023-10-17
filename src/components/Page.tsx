import { Container, Stack } from '@mui/material';
import React from 'react';
import Footer from './Footer';

function Page(props: any) {
    return <div>
        {props.header}
        <Container style={{paddingTop: 16}} maxWidth='sm'>
            <Stack spacing={2}>
                {props.children}
            </Stack>
        </Container>
        <Footer />
    </div>;
}

export default Page;
