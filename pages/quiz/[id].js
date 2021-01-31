import React from 'react';
import { ThemeProvider } from 'styled-components'
import QuizScreen from '../../src/screens/Quiz'

export default function QuizDaGaleraPage({ dbExterno }) {
    return (
        <ThemeProvider theme={dbExterno.theme}>
            <QuizScreen
                questions={dbExterno.questions}
                bg={dbExterno.bg}
            />
        </ThemeProvider>
    );
}

export async function getServerSideProps(context) {
    const [projectName, githubUser] = context.query.id.split('___');

    const dbExterno = await fetch(`https://${projectName}.${githubUser}.vercel.app/api/db`)
        .then((respostaDoServer) => {
            if (respostaDoServer.ok) {
                return respostaDoServer.json();
            }
            throw new Error('Deu ruim!');
        })
        .then((respostaConvertidaObjeto) => {
            return respostaConvertidaObjeto;
        })
        .catch((err) => {
            console.error(err);
        });

    return {
        props: {
            dbExterno
        }
    };
}
