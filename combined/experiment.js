let chainLink = '' // Change this to link to another experiment/site at finish

var jsPsych = initJsPsych({
    on_finish: function () {
        if (!chainLink == '') {
            window.location = chainLink + "?id=" + sbjID + "&attn=" + attentionFails + "&src=" + source + '&study=' + study + '&time=' + Math.round(expTime)
        }
    }
})

jsPsych.randomization.setSeed(2023)

let study = jsPsych.data.getURLVariable('study')
if (study === undefined) {
    study = 'unknown'
}

// Make id
let sbjID = jsPsych.data.getURLVariable('id');
if (sbjID === undefined) {
    sbjID = jsPsych.randomization.randomID(10)
}

// Get attention check counter
let attentionFails = Number(jsPsych.data.getURLVariable('attn'))
if (isNaN(attentionFails)) {
    attentionFails = 0
}

// Get source of participant
let source = jsPsych.data.getURLVariable('src')
if (source === undefined) {
    source = 'unknown'
}

// Get time since start
let origTime = Number(jsPsych.data.getURLVariable('time'))
if (isNaN(origTime)) {
    origTime = 0
}
let expTime = origTime

jsPsych.data.addProperties({
    SbjID: sbjID,
    Study: study,
    Source: source,
    OrigTime: origTime,
    StartTime: Date.now()
})

// Timeline
var timeline = [];

timeline.push({
    type: jsPsychBrowserCheck,
    inclusion_function: (data) => {
        return !data.mobile
    },
    exclusion_message: (data) => {
        return `
            <p>You must use a desktop/laptop computer to participate in this
            experiment.</p>
            <p>Please restart the experiment on a desktop/laptop computer.</p>
        `;
    }
})

// Enter full screen
timeline.push({
    type: jsPsychFullscreen,
    fullscreen_mode: true
})


/*
Binding Verbal Numerical
*/
function make_binding_trials(trial) {
    let trials = []

    if (!trial.hasOwnProperty('Probe')) {
        trials.push({
            type: jsPsychHtmlKeyboardResponse,
            stimulus: `
                <p>In this set, you will be tested on every pair in the set.</p>
                <p>Press any keyboard button to start.</p>
            `,
            post_trial_gap: 1000
        });
    }
    // Presentation trials
    for (pair of trial.Pairs) {
        trials.push({
            type: jsPsychHtmlKeyboardResponse,
            stimulus: `<p>${pair[0]} -- ${pair[1]}</p>`,
            choices: 'NO_KEYS',
            trial_duration: 2000,
            post_trial_gap: 1000
        })
    }

    if (trial.hasOwnProperty('Probe')) {
        // Make choices
        let choices = trial.ProbeType == "Word" ?
            trial.Pairs.map(pair => pair[1]) : trial.Pairs.map(pair => pair[0])

        // Shuffle choices
        choices = jsPsych.randomization.shuffle(choices)

        // Response trial
        trials.push({
            type: jsPsychHtmlButtonResponse,
            stimulus: `<p>${trial.Probe}</p>`,
            choices: choices,
            post_trial_gap: 1000,
            data: {
                TestTrial: true,
                TrialN: trial.TrialN,
                ProbeType: trial.ProbeType,
                Probe: trial.Probe,
                Pairs: trial.Pairs,
                Choices: choices,
                CorrRes: choices.indexOf(trial.CorrRes)
            },
            on_finish: function (data) {
                data.Corr = data.CorrRes == data.response
                console.log(data)
            }
        })
    } else {
        allTestTrials = []
        initTrialN = trial.TrialN
        for (let i = 0; i < trial.Pairs.length; i++) {
            let allTestChoices = jsPsych.randomization.shuffle(trial.Foils[i].concat(trial.Pairs[i][1]))
            allTestTrials.push({
                type: jsPsychHtmlButtonResponse,
                stimulus: `<p>${trial.Pairs[i][0]}</p>`,
                choices: allTestChoices,
                post_trial_gap: 1000,
                data: {
                    TestTrial: true,
                    TrialN: NaN,
                    ProbeType: trial.ProbeType,
                    Probe: trial.Pairs[i][0],
                    Pairs: trial.Pairs,
                    Choices: allTestChoices,
                    CorrRes: allTestChoices.indexOf(trial.Pairs[i][1])
                },
                on_finish: function (data) {
                    data.Corr = data.CorrRes == data.response
                }
            })
        }
        allTestTrials = jsPsych.randomization.shuffle(allTestTrials)
        allTestTrials = allTestTrials.map((trial, i) => { trial.data.TrialN = initTrialN + i; return trial })
        trials = trials.concat(allTestTrials)
    }

    return trials
}

timeline.push({
    type: jsPsychHtmlKeyboardResponse,
    stimulus: `
        <p>You will presented sets of word-number pairings to remember.</p>
        <p>After all pairs of a set have been presented, you will be prompted 
        with either a word or a number.</p>
        <p>Click the button that was paired with the prompt in the set.</p>
        <p>Afterwards, you will be presented with new sets of word-number pairs
        and tested on that set.</p>
        <p>Press any button to start.</p>
    `,
    post_trial_gap: 1000
});

// Add every trial
for (trial of bindingTrials) {
    for (slide of make_binding_trials(trial)) {
        timeline.push(slide)
    }
}

// End card
timeline.push({
    type: jsPsychHtmlKeyboardResponse,
    stimulus: `
        <p>You have finished this test, good job!</p>
        <p>Press any button to the next.</p>
    `,
});

/* 
oSpan
*/
function make_oSpan_trials(trial) {
    let trials = []

    // Add fixation cross
    trials.push({
        type: jsPsychHtmlKeyboardResponse,
        stimulus: `
            <p>+</p>
        `,
        choices: "NO_KEYS",
        trial_duration: 1500,
    })

    for (let i = 0; i < trial.Operations.length; i++) {
        trials.push({
            type: jsPsychHtmlButtonResponse,
            stimulus: `
                <p>${trial.Operations[i]}</p>
            `,
            choices: ['Correct', 'Incorrect'],
            trial_duration: 3000,
        })

        trials.push({
            type: jsPsychHtmlKeyboardResponse,
            stimulus: `
                <p>${trial.Letters[i].toUpperCase()}</p>
            `,
            choices: "NO_KEYS",
            trial_duration: 1000,
            post_trial_gap: 100,
        })
    }

    // Add response window
    trials.push({
        type: jsPsychSurveyText,
        questions: [
            {
                prompt: `
                    <p>Type the sequence of letters.</p>
                    <p>There were ${trial.Operations.length} letters in the sequence.</p>
                    <p>The order matters, if you can't remember a letter in the
                    sequence, just make your best guess for the letter in that
                    position</p>
                `,
                placeholder: `${'? '.repeat(trial.Operations.length)}`,
                required: true,
                name: "answer"
            }
        ],
        button_label: "Submit",
        data: {
            TestTrial: trial.TrialN != -1,
            TrialN: trial.TrialN,
            Load: trial.Load,
            Operations: trial.Operations,
            Letters: trial.Letters.join('')
        },
        on_finish: function (data) {
            let answer = data.response.answer
                .replace(' ', '')
                .replace('-', '')
                .replace('_', '')
                .toUpperCase()
            let nCor = 0
            for (let i = 0; i < trial.Letters.length; i++) {
                if (answer?.[i] == trial.Letters[i].toUpperCase()) {
                    nCor += 1
                }
            }
            data.Score = nCor / trial.Letters.length
        }
    })

    // Practice feedback
    if (trial.TrialN == -1) {
        trials.push({
            type: jsPsychHtmlKeyboardResponse,
            stimulus: function () {
                let data = jsPsych.data.get().last(1).values()[0]
                let score = data.Score
                let answer = data.response.answer
                    .replace(' ', '')
                    .replace('-', '')
                    .replace('_', '')
                    .toUpperCase()

                return `
                    <p>The correct answer was ${trial.Letters.join('').toUpperCase()}</p>
                    <p>You answered ${answer}</p>
                    <p>You got ${Math.round(score * 100)}% correct</p>
                `
            },
            choices: "NO_KEYS",
            trial_duration: 3000,
        })
    }


    return trials
}

timeline.push({
    type: jsPsychHtmlKeyboardResponse,
    stimulus: `
        <p>You will be presented an equation and you need to decide if it is correct.</p>
        <p>After each equation, a letter will be presented for you to remember.</p>
        <p>Remember the letters in order.</p>
        <p>After all equations and letters have been presented, you will be asked to type the letters in order.</p>
        <p>The exact sequence and order matters, so guess if you don't remember a letter in a position.</p>
        <p>Press any button to begin practice trials.</p>
    `,
    post_trial_gap: 1000
});

// Add every trial
let pracTrials = oSpanTrials.filter(x => x.TrialN == -1)
let testTrials = oSpanTrials.filter(x => x.TrialN != -1)

for (trial of pracTrials) {
    for (slide of make_oSpan_trials(trial)) {
        timeline.push(slide)
    }
}

timeline.push({
    type: jsPsychHtmlKeyboardResponse,
    stimulus: `
        <p>You have finished the practice trials.</p>
        <p>The real test will not give you feedback.</p>
        <p>Press any button to start the real test.</p>
    `,
    post_trial_gap: 1000
});

for (trial of testTrials) {
    for (slide of make_oSpan_trials(trial)) {
        timeline.push(slide)
    }
}

// Exit fullscreen
timeline.push({
    type: jsPsychFullscreen,
    fullscreen_mode: false
})

// End card
timeline.push({
    type: jsPsychHtmlKeyboardResponse,
    stimulus: `
        <p>You have finished this test, good job!</p>
        <p>Press any button to continue.</p>
    `,
});


// Run
jsPsych.run(timeline);