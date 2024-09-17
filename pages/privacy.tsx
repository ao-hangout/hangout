import fs from 'fs';
import path from 'path';
import { GetStaticProps } from 'next';
import { Container } from '@mui/material';

interface PrivacyProps {
    content: string;
}

const TermsOfService = ({ content }: PrivacyProps) => {
    return (
        <Container maxWidth="md" style={{ padding: '2rem' }}>
            <div dangerouslySetInnerHTML={{ __html: content }} />
        </Container>
    );
};

export const getStaticProps: GetStaticProps = async () => {
    const filePath = path.join(process.cwd(), 'pages', 'privacy.html');
    const content = fs.readFileSync(filePath, 'utf-8');
    return {
        props: {
            content,
        },
    };
};

export default TermsOfService;
