let chainLink = '' // Change this to link to another experiment/site at finish

const load1Digits = [6, 3, 4]
const load2Digits = [3, 0, 8, 2, 7, 4, 0, 1, 9]
const load3Digits = [6, 5, 8, 1, 4, 1, 6, 2, 3, 5]
const load4Digits = [9, 8, 9, 1, 7, 6, 1, 2, 0, 3, 7, 4]

var jsPsych = initJsPsych({
    on_finish: function () {
        if (!chainLink == '') {
            window.location = chainLink + "?id=" + sbjID + "&attn=" + attentionFails + "&src=" + source + '&study=' + study + '&time=' + Math.round(expTime)
        }
    }
});

function make_html(digits) {
    let html = ''
    for (digit of digits) {
        html += `
            <div style="width:50px; height:50px; border-style:solid; line-height:15px; float: left; margin: 10px"><p style="">${digit}</p></div>
        `
    }
    return html
}

function make_trials(digits, load, trial_duration) {
    let trials = []

    // Make initial display
    displayed = digits.slice(0, load)
    trials.push({
        type: jsPsychHtmlKeyboardResponse,
        stimulus: make_html(displayed),
        choices: 'NO_KEYS',
        trial_duration: trial_duration,
        data: { TestTrial: false }
    })

    // Loop through remaining digits
    changeIdx = 0
    for (digit of digits.slice(load)) {
        // Save answer
        lastDigit = displayed[changeIdx]
        // Change digit at changeIndx
        displayed[changeIdx] = digit

        zerodDisplayed = displayed.map((digit, i) => i === changeIdx ? digit : '')

        trials.push({
            type: jsPsychHtmlKeyboardResponse,
            stimulus: make_html(zerodDisplayed),
            choices: ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9'],
            data: {
                TestTrial: true,
                ChangeIdx: changeIdx,
                Digits: displayed.join('-'),
                CorrRes: String(lastDigit),
                TrialN: NaN
            },
            on_finish: function (data) {
                data.Corr = jsPsych.pluginAPI.compareKeys(data.response, data.CorrRes)
                console.log(data)
            }
        })

        // Increment changeIdx unless we need to loop around
        if (changeIdx < load - 1) {
            changeIdx += 1
        } else {
            changeIdx = 0
        }
    }

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
        <p>You will see a box with a digit inside.</p>
        <p>The digit will change. When it does, type the digit that was there 
        before.</p>
        <p>Keep doing this every time a digit changes inside a box.</p>
        <p>When you make a response, a digit 
        will change.</p>
        <p>Later in the test, you will have to remember digits from multiple boxes</p>
        <p>Always respond about the digit that most recently changed.</p>
        <p>Press any button to practice.</p>
    `,
    post_trial_gap: 1000
});

timeline.push({
    type: jsPsychHtmlKeyboardResponse,
    stimulus: make_html([3]),
    choices: 'NO_KEYS',
    prompt: "Remember the digit inside the box.",
    trial_duration: 3500,
    data: { TestTrial: false }
})

timeline.push({
    type: jsPsychHtmlKeyboardResponse,
    stimulus: make_html([5]),
    choices: ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9'],
    prompt: "The digit changed. Type the digit that was there before.",
    data: { TestTrial: false }
})

timeline.push({
    type: jsPsychHtmlKeyboardResponse,
    stimulus: make_html([8]),
    choices: ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9'],
    prompt: "The digit changed again. Type the digit that was there before.",
    data: { TestTrial: false }
})

timeline.push({
    type: jsPsychHtmlKeyboardResponse,
    stimulus: `
        <p>The box started with a 3.</p>
        <p>When it changed into a 5, you should've typed 3.</p>
        <p>Then, when it changed into a 8, you should've typed 5.</p>
        <p>There can be multiple boxes that you will need to remember but only 
        will change at a time.</p>
        <p>Press any button to start.</p>
        `,
    post_trial_gap: 1000
});

// Add every trial
let trialCounter = 1
for (trial of make_trials(load1Digits, 1, 2500)) {
    if (trial.data.TestTrial === true) {
        trial.data.TrialN = trialCounter
        trialCounter += 1
    }
    timeline.push(trial)
}


timeline.push({
    type: jsPsychHtmlKeyboardResponse,
    stimulus: `
        <p>Now remember two digits.</p>
        <p>With multiple digits, the boxes that haven't recently changed will hide their digit.</p>
        <p>Remember that you should type the digit that was in the box that was just changed,
        the correct answer is the digit that was there before it changed.</p>
        <p>Press any button to continue.</p>
    `,
    post_trial_gap: 1000
});

for (trial of make_trials(load2Digits, 2, 2900)) {
    if (trial.data.TestTrial === true) {
        trial.data.TrialN = trialCounter
        trialCounter += 1
    }
    timeline.push(trial)
}

timeline.push({
    type: jsPsychHtmlKeyboardResponse,
    stimulus: `
        <p>Now remember three digits.</p>
        <p>With multiple digits, the boxes that haven't recently changed will hide their digit.</p>
        <p>Remember that you should type the digit that was in the box that was just changed,
        the correct answer is the digit that was there before it changed.</p>
        <p>Press any button to continue.</p>
    `,
    post_trial_gap: 1000
});

for (trial of make_trials(load3Digits, 3, 3100)) {
    if (trial.data.TestTrial === true) {
        trial.data.TrialN = trialCounter
        trialCounter += 1
    }
    timeline.push(trial)
}

timeline.push({
    type: jsPsychHtmlKeyboardResponse,
    stimulus: `
        <p>Now remember four digits.</p>
        <p>With multiple digits, the boxes that haven't recently changed will hide their digit.</p>
        <p>Remember that you should type the digit that was in the box that was just changed,
        the correct answer is the digit that was there before it changed.</p>
        <p>Press any button to continue.</p>
        `,
    post_trial_gap: 1000
});

for (trial of make_trials(load4Digits, 4, 3500)) {
    if (trial.data.TestTrial === true) {
        trial.data.TrialN = trialCounter
        trialCounter += 1
    }
    timeline.push(trial)
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