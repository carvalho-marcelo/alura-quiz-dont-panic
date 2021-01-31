import React, { useEffect, useState } from 'react';
import { Lottie } from '@crello/react-lottie';
import { useRouter } from 'next/router';
import { motion } from 'framer-motion';
import QuizBackground from '../../components/QuizBackground';
import Widget from '../../components/Widget';
import QuizLogo from '../../components/QuizLogo';
import Button from '../../components/Button';
import QuizContainer from '../../components/QuizContainer';
import AlternativesForm from '../../components/AlternativesForm';
import BackLinkArrow from '../../components/BackLinkArrow';

import catLoadingAnimation from './animations/cat-loading.json';
import rightAnimation from './animations/right-animation.json';
import wrongAnimation from './animations/wrong-animation.json';

function ResultWidget({ results }) {
    const router = useRouter();
    const { name } = router.query;

    const qntAcertos = results.reduce((somatoriaAtual, resultadoAtual) => {
        return resultadoAtual === true ? somatoriaAtual + 1 : somatoriaAtual;
    }, 0)

    return (
        <Widget
            as={motion.section}
            transition={{ delay: 0, duration: .8 }}
            variants={{
                show: { opacity: 1, scale: 1, x: '0' },
                hidden: { opacity: 0, scale: 0, x: '-100%' }
            }}
            initial="hidden"
            animate="show"
        >
            <Widget.Header>
                <h1>Resultado:</h1>
            </Widget.Header>

            <Widget.Content>
                <p>
                    {`Parabêns ${name}! Você acertou ${qntAcertos}
                    perguntas e marcou ${qntAcertos * 100} pontos`}
                </p>
                <ul>
                    {results.map((result, index) => (
                        <li key={`result__${index}`}>
                            <Widget.Topic style={{ display: 'flex', justifyContent: 'center', gap: '5%' }}>
                                {`#${String(index + 1).padStart(2, '0')} Questão: `}

                                {result === true
                                    ? <div>
                                        <Lottie
                                            width="28px"
                                            height="22px"
                                            className="lottie-container basic"
                                            config={{ animationData: rightAnimation, loop: false, autoplay: true }}
                                        />
                                    </div>
                                    : <div>
                                        <Lottie
                                            width="28px"
                                            height="22px"
                                            className="lottie-container basic"
                                            config={{ animationData: wrongAnimation, loop: false, autoplay: true }}
                                        />
                                    </div>
                                }
                            </Widget.Topic>
                        </li>
                    ))}
                </ul>
                <Button type="button" onClick={() => router.push('/')}>Voltar</Button>
            </Widget.Content>
        </Widget>
    );
}

function LoadingWidget() {
    return (
        <Widget
            as={motion.section}
            transition={{ delay: 0, duration: .5 }}
            variants={{
                show: { opacity: 1, scale: 1, x: '0' },
                hidden: { opacity: 0, scale: 0, x: '-100%' }
            }}
            initial="hidden"
            animate="show"
        >
            <Widget.Header>
                <h1>Carregando...</h1>
            </Widget.Header>

            <Widget.Content style={{ display: 'flex', justifyContent: 'center' }}>
                <Lottie
                    width="300px"
                    height="200px"
                    className="lottie-container basic"
                    config={{ animationData: catLoadingAnimation, loop: true, autoplay: true }}
                />
            </Widget.Content>
        </Widget>
    );
}

function QuestionWidget({ question, totalQuestion, questionIndex, onSubmit, addResult }) {
    const [selectedAlternative, setSelectedAlternative] = useState(undefined);
    const [isQuestionSubmited, setIsQuestionSubmited] = useState(false);
    const questionId = `question__${questionIndex}`;
    const isCorrect = selectedAlternative === question.answer;
    const hasAlternativeSelected = selectedAlternative !== undefined;

    return (
        <Widget
            as={motion.section}
            transition={{ stiffness: 260, damping: 10, delay: 0, duration: .6 }}
            variants={{
                show: { opacity: 1, rotate: 0, scale: 1, x: '0' },
                hidden: { opacity: 0, scale: 1, x: '250%' }
            }}
            initial="hidden"
            animate="show"
        >
            <Widget.Header>
                <BackLinkArrow href="/" />
                <h3>
                    {`Pergunta ${questionIndex + 1} de ${totalQuestion}`}
                </h3>
            </Widget.Header>

            <img
                alt="Descrição da imagem"
                style={{
                    width: '100%',
                    height: '100%',
                    objectFit: 'cover',
                }}
                src={question.image}
            />

            <Widget.Content>
                <h2>{question.title}</h2>
                <p>{question.description}</p>

                <AlternativesForm
                    onSubmit={(event) => {
                        event.preventDefault();
                        setIsQuestionSubmited(true);
                        setTimeout(() => {
                            addResult(isCorrect);
                            setIsQuestionSubmited(false);
                            setSelectedAlternative(undefined);
                            onSubmit();
                        }, 3000);
                    }}
                >
                    {question.alternatives.map((alternative, alternativeIndex) => {
                        const alternativeId = `alternative__${alternativeIndex}`;
                        const isSelected = selectedAlternative === alternativeIndex;
                        return (
                            <Widget.Topic
                                as="label"
                                key={alternativeId}
                                htmlFor={alternativeId}
                                data-selected={isSelected}
                                data-status={isQuestionSubmited && (isCorrect ? 'SUCCESS' : 'ERROR')}
                            >
                                <input
                                    id={alternativeId}
                                    type="radio"
                                    name={questionId}
                                    onClick={() => setSelectedAlternative(alternativeIndex)}
                                    style={{ display: 'none' }}
                                    disabled={isQuestionSubmited}
                                />
                                {alternative}
                            </Widget.Topic>
                        );
                    })}

                    <Button type="submit" disabled={!hasAlternativeSelected}>
                        Confirmar
                    </Button>

                    {isQuestionSubmited &&
                        (isCorrect
                            ? <div style={{ display: 'flex', justifyContent: 'center', paddingTop: '30px' }}>
                                <Lottie
                                    width="50px"
                                    height="50px"
                                    className="lottie-container basic"
                                    config={{ animationData: rightAnimation, loop: true, autoplay: true }}
                                />
                            </div>
                            : <div style={{ display: 'flex', justifyContent: 'center', paddingTop: '30px' }}>
                                <Lottie
                                    width="50px"
                                    height="50px"
                                    className="lottie-container basic"
                                    config={{ animationData: wrongAnimation, loop: true, autoplay: true }}
                                />
                            </div>
                        )
                    }
                </AlternativesForm>
            </Widget.Content>
        </Widget>
    );
}

const screenStates = {
    QUIZ: 'QUIZ',
    RESULT: 'RESULT',
    LOADING: 'LOADING'
};

export default function QuizPage({ questions, bg }) {
    const [screenState, setScreenState] = useState(screenStates.LOADING);
    const [results, setResults] = useState([]);
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const totalQuestion = questions.length;
    const question = questions[currentQuestionIndex];

    function addResult(result) {
        setResults([
            ...results,
            result
        ]);
    }

    useEffect(() => {
        setTimeout(() => {
            setScreenState(screenStates.QUIZ);
        }, 3000);
    }, []);

    function handleSubmitQuestion() {
        const nextQuestion = currentQuestionIndex + 1;
        if (nextQuestion < totalQuestion) {
            setCurrentQuestionIndex(nextQuestion);
            setScreenState('');
            setScreenState(screenStates.QUIZ);
        } else {
            setScreenState(screenStates.RESULT);
        }
    }

    return (
        <QuizBackground backgroundImage={bg}>
            <QuizContainer>
                <QuizLogo />
                {screenState === screenStates.QUIZ && (
                    <QuestionWidget
                        question={question}
                        questionIndex={currentQuestionIndex}
                        totalQuestion={totalQuestion}
                        onSubmit={handleSubmitQuestion}
                        addResult={addResult}
                    />
                )}
                {screenState === screenStates.LOADING && <LoadingWidget />}
                {screenState === screenStates.RESULT && <ResultWidget results={results} />}
            </QuizContainer>
        </QuizBackground>
    );
}