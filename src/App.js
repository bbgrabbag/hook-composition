import React from 'react';


const transformer = transformRule => {
    return initialState => {
        return value => {
            const [state, setState] = React.useState(initialState);

            return {
                value: transformRule(state, value),
                setState,
                state
            }

        }
    }
}

const peduce = (...funcs) => initialValue => {
    return funcs.reduce((output, f) => {
        const { value, setState } = f(output.value);
        return {
            value,
            setters: [...output.setters, setState]
        }
    }, { value: initialValue, setters: [] })
}


export const App = () => {

    const output = peduce(
        transformer((state, value) => {
            return state.isPlural ? value.lastIndexOf('s') === value.length ? value.slice(-1) : value : value + 's'
        })({ isPlural: false }),

        transformer((state, value) => {
            return state.isLowerCase ? value.toLowerCase() : value.toUpperCase()
        })({ isLowerCase: false }),

        transformer((state, value) => {
            return value + Array.from(Array(state.howExcited)).map(() => '!').join('')
        })({ howExcited: 0 }),

    )("I'm so excited");

    const handlePlural = () => {
        output.setters[0](prevState => ({ isPlural: !prevState.isPlural }))
    }

    const handleToggleCase = () => {
        output.setters[1](prevState => ({ isLowerCase: !prevState.isLowerCase }))
    }

    const handleExcitement = () => {
        output.setters[2](prevState => ({ howExcited: prevState.howExcited + 1 }))
    }

    return (
        <div>
            <div>{output.value}</div>
            <button onClick={handleToggleCase}>Toggle Case</button>
            <button onClick={handlePlural}>Toggle Plural</button>
            <button onClick={handleExcitement}>Get Excited!</button>
        </div >
    )
}