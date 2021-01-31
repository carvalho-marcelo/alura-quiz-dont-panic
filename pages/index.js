import React, { useState } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import { motion } from 'framer-motion';

import db from '../db.json';
import QuizBackground from '../src/components/QuizBackground';
import Widget from '../src/components/Widget';
import Footer from '../src/components/Footer';
import GitHubCorner from '../src/components/GitHubCorner';
import QuizLogo from '../src/components/QuizLogo';
import Input from '../src/components/Input';
import Button from '../src/components/Button';
import QuizContainer from '../src/components/QuizContainer';
import Link from '../src/components/Link';

function WidgetHome({ router }) {
    const [name, setName] = useState('');
    const isNameEmpty = name.length === 0;

    return (
        <>
            <Widget
                as={motion.section}
                transition={{ stiffness: 260, damping: 10, delay: 0, duration: 1 }}
                variants={{
                    show: { opacity: 1, rotate: 360, scale: 1, x: '0' },
                    hidden: { opacity: 0, scale: 0, x: '-100%' }
                }}
                initial="hidden"
                animate="show"
            >
                <Widget.Header>
                    <h1>O Guia do Mochileiro das Galáxias</h1>
                </Widget.Header>
                <Widget.Content>
                    <p>Você acha que consegue acertar tudo nesse quiz? Eu duvido!</p>
                    <form onSubmit={(event) => {
                        event.preventDefault();
                        router.push(`/quiz?name=${name}`);
                    }}>

                        <Input
                            name="nomeUsuario"
                            value={name}
                            placeholder="Ei, digita seu nome aqui para jogar"
                            onChange={(event) => setName(event.target.value)}
                        />

                        <Button type="submit" disabled={isNameEmpty}>
                            {`Bora Jogar ${name}`}
                        </Button>
                    </form>
                </Widget.Content>
            </Widget>

            <Widget
                as={motion.section}
                transition={{ stiffness: 260, damping: 10, delay: 0.5, duration: 1 }}
                variants={{
                    show: { opacity: 1, rotate: 360, scale: 1, x: '0' },
                    hidden: { opacity: 0, scale: 0, x: '-100%' }
                }}
                initial="hidden"
                animate="show"
            >
                <Widget.Content>
                    <h1>Quizzes da Galera</h1>
                    <p>Da uma olhada nos outros quizzes ai!</p>
                    <ul>
                        {db.external.map((linkExterno) => {
                            // const [projectName, githubUser] = linkExterno
                            //     .replace(/\//g, '')
                            //     .replace('.vercel.app', '')
                            //     .replace('https:', '')
                            //     .split('.');
                            const [projectName, githubUser] = new URL(linkExterno).host.split('.');

                            return (
                                <li key={linkExterno}>
                                    <Widget.Topic
                                        as={Link}
                                        href={`/quiz/${projectName}___${githubUser}`}
                                        style={isNameEmpty ? { pointerEvents: "none", backgroundColor: "#979797" } : null}
                                    >
                                        {`${githubUser}/${projectName}`}
                                    </Widget.Topic>
                                </li>
                            );
                        })}
                    </ul>
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
                {/* Primary Meta Tags */}
                <title>O Guia do Mochileiro das Galáxias Quiz</title>
                <meta name="title" content="O Guia do Mochileiro das Galáxias Quiz" />
                <meta name="description" content="Quiz do guia do mochileiro das galáxias" />

                {/* Open Graph / Facebook */}
                <meta property="og:type" content="website" />
                <meta property="og:url" content="https://alura-quiz.carvalho-marcelo.vercel.app/" />
                <meta property="og:title" content="O Guia do Mochileiro das Galáxias Quiz" />
                <meta property="og:description" content="Quiz do guia do mochileiro das galáxias" />
                <meta property="og:image" content={db.bg} />

                {/* Twitter */}
                <meta property="twitter:card" content="summary_large_image" />
                <meta property="twitter:url" content="https://alura-quiz.carvalho-marcelo.vercel.app/" />
                <meta property="twitter:title" content="O Guia do Mochileiro das Galáxias Quiz" />
                <meta property="twitter:description" content="Quiz do guia do mochileiro das galáxias" />
                <meta property="twitter:image" content={db.bg} />
            </Head>
            <QuizContainer>
                <QuizLogo />

                <WidgetHome router={router} />

                <Footer
                    as={motion.footer}
                    transition={{ delay: 1, duration: 0.5 }}
                    variants={{
                        show: { opacity: 1, scale: 1 },
                        hidden: { opacity: 0, scale: 0 }
                    }}
                    initial="hidden"
                    animate="show"
                />
            </QuizContainer>
            <GitHubCorner projectUrl="https://github.com/carvalho-marcelo/alura-quiz" />
        </QuizBackground>
    );
}
