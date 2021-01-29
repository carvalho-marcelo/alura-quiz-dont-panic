import React, { useState } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';

import db from '../db.json';
import QuizBackground from '../src/components/QuizBackground';
import Widget from '../src/components/Widget';
import Footer from '../src/components/Footer';
import GitHubCorner from '../src/components/GitHubCorner';
import QuizLogo from '../src/components/QuizLogo';
import Input from '../src/components/Input';
import Button from '../src/components/Button';
import QuizContainer from '../src/components/QuizContainer';

function WidgetHome({ router }) {
    const [name, setName] = useState('');

    return (
        <>
            <Widget>
                <Widget.Header>
                    <h1>O Guia do Mochileiro das Galáxias</h1>
                </Widget.Header>
                <Widget.Content>
                    <form onSubmit={(event) => {
                        event.preventDefault();
                        router.push(`/quiz?name=${name}`);
                    }}>

                        <Input
                            name="nomeUsuario"
                            value={name}
                            placeholder="Qual o seu nome?"
                            onChange={(event) => setName(event.target.value)}
                        />

                        <Button type="submit" disabled={name.length === 0}>
                            {`Jogar ${name}`}
                        </Button>
                    </form>
                </Widget.Content>
            </Widget>

            <Widget>
                <Widget.Header>
                    <h1>Quizes da Galera</h1>
                </Widget.Header>
                <Widget.Content>
                    <p>Muita coisa sendo testada aqui dentro varias coisas blablabla blablabla</p>
                </Widget.Content>
            </Widget>
        </>
    );
}

export default function Home() {
    const router = useRouter();

    return (
        <QuizBackground backgroundImage={db.bg}>
            <Head>
                <title>O Guia do Mochileiro das Galáxias Quiz</title>
            </Head>
            <QuizContainer>
                <QuizLogo />

                <WidgetHome router={router} />
                
                <Footer />
            </QuizContainer>
            <GitHubCorner projectUrl="https://github.com/carvalho-marcelo/alura-quiz" />
        </QuizBackground>
    );
}
