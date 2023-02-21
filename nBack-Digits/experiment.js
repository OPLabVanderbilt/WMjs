let chainLink = '' // Change this to link to another experiment/site at finish

const load1Digits = [6, 3, 4]
const load2Digits = [3, 0, 8, 2, 7, 4, 0]
const load3Digits = [6, 5, 8, 1, 4, 1, 6, 2]

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
            trial_duration: trial_duration,
            data: {
                TestTrial: true,
                ChangeIdx: changeIdx,
                Digits: displayed.join('-'),
                CorrRes: String(lastDigit)
            },
            on_finish: function (data) {
                data.Corr = jsPsych.pluginAPI.compareKeys(data.response, data.CorrRes)
                console.log(data.Corr)
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
        <p>The digit will change. When it does, type the digit that was there before.</p>
        <p>Keep doing this every time a digit changes inside a box.</p>
        <p>When you make a response or you take too long, another box's digit will change.</p>
        <p>Press any buttton to continue.</p>
    `,
    post_trial_gap: 1000
});

// Add every trial
for (trial of make_trials(load1Digits, 1, 2500)) {
    timeline.push(trial)
}

timeline.push({
    type: jsPsychHtmlKeyboardResponse,
    stimulus: `
        <p>Now remember two digits.</p>
        <p>Press any buttton to continue.</p>
    `,
    post_trial_gap: 1000
});

for (trial of make_trials(load2Digits, 2, 2900)) {
    timeline.push(trial)
}

timeline.push({
    type: jsPsychHtmlKeyboardResponse,
    stimulus: `
        <p>Now remember three digits.</p>
        <p>Press any buttton to continue.</p>
    `,
    post_trial_gap: 1000
});

for (trial of make_trials(load3Digits, 3, 3100)) {
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
        <p>Press any buttton to continue.</p>
    `,
});

// Run
jsPsych.run(timeline);