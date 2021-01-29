import React, { useEffect, useState } from 'react';
import db from '../db.json';
import QuizBackground from '../src/components/QuizBackground';
import Widget from '../src/components/Widget';
import QuizLogo from '../src/components/QuizLogo';
import Button from '../src/components/Button';
import QuizContainer from '../src/components/QuizContainer';
import AlternativesForm from '../src/components/AlternativesForm';

function ResultWidget({ results }) {
    return (
        <Widget>
            <Widget.Header>
                Tela de Resultado:
            </Widget.Header>

            <Widget.Content>
                <p>
                    {`Você acertou
                    ${results.reduce((somatoriaAtual, resultadoAtual) => {
                        return resultadoAtual === true ? somatoriaAtual + 1 : somatoriaAtual;
                    }, 0)}
                    perguntas`}
                </p>
                <ul>
                    {results.map((result, index) => (
                        <li key={`result__${index}`}>
                            {`#${String(index + 1).padStart(2, '0')} Questão: ${result === true ? 'Acertou!' : 'Errou!'}`}
                        </li>
                    ))}
                </ul>
            </Widget.Content>
        </Widget>
    );
}

function LoadingWidget() {
    return (
        <Widget>
            <Widget.Header>
                Carregando...
            </Widget.Header>

            <Widget.Content>
                [Desafio do loading]
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
        <Widget>
            <Widget.Header>
                {/* <BackLinkArrow href="/" /> */}
                <h3>
                    {`Pergunta ${questionIndex + 1} de ${totalQuestion}`}
                </h3>
            </Widget.Header>

            <img
                alt="Descrição da imagem"
                style={{
                    width: '100%',
                    height: '150px',
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
                            onSubmit();
                            setIsQuestionSubmited(false);
                            setSelectedAlternative(undefined);
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
                                    onChange={() => setSelectedAlternative(alternativeIndex)}
                                    style={{ display: 'none' }}
                                />
                                {alternative}
                            </Widget.Topic>
                        );
                    })}

                    <Button type="submit" disabled={!hasAlternativeSelected}>
                        Confirmar
                    </Button>

                    {isQuestionSubmited && (isCorrect ? <p>Você acertou!</p> : <p>Você errou!</p>)}
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

export default function QuizPage() {
    const [screenState, setScreenState] = useState(screenStates.LOADING);
    const [results, setResults] = useState([]);
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const totalQuestion = db.questions.length - 8;
    const question = db.questions[currentQuestionIndex];

    function addResult(result) {
        setResults([
            ...results,
            result
        ]);
    }

    useEffect(() => {
        setTimeout(() => {
            setScreenState(screenStates.QUIZ);
        }, 1000);
    }, []);

    function handleSubmitQuiz() {
        const nextQuestion = currentQuestionIndex + 1;
        if (nextQuestion < totalQuestion) {
            setCurrentQuestionIndex(nextQuestion);
        } else {
            setScreenState(screenStates.RESULT);
        }
    }

    return (
        <QuizBackground backgroundImage={db.bg}>
            <QuizContainer>
                <QuizLogo />
                {screenState === screenStates.QUIZ && (
                    <QuestionWidget
                        question={question}
                        questionIndex={currentQuestionIndex}
                        totalQuestion={totalQuestion}
                        onSubmit={handleSubmitQuiz}
                        addResult={addResult}
                    />
                )}

                {screenState === screenStates.LOADING && <LoadingWidget />}

                {screenState === screenStates.RESULT && <ResultWidget results={results} />}
            </QuizContainer>
        </QuizBackground>
    );
}