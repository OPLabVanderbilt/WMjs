let chainLink = '' // Change this to link to another experiment/site at finish

var jsPsych = initJsPsych({
    on_finish: function () {
        if (!chainLink == '') {
            window.location = chainLink + "?id=" + sbjID + "&attn=" + attentionFails + "&src=" + source + '&study=' + study + '&time=' + Math.round(expTime)
        }
    }
})

jsPsych.randomization.setSeed(2022)

function make_trials(trial) {
    let trials = []
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

    return trials
}

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

timeline.push({
    type: jsPsychHtmlKeyboardResponse,
    stimulus: `
        <p>You will presented word-number pairings to remember.</p>
        <p>After all pairs have been presented, you will be prompted with either
        a word or a number.</p>
        <p>Click the button that corresponds to the prompt.</p>
        <p>Afterwards, you will be presented with new sets of word-number pairs
        and tested on that set.</p>
        <p>Press any buttton to start.</p>
    `,
    post_trial_gap: 1000
});

// Add every trial
for (trial of trials) {
    for (slide of make_trials(trial)) {
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
        <p>Press any buttton to continue.</p>
    `,
});

// Run
jsPsych.run(timeline);