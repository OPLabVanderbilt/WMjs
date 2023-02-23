import numpy as np
import json

np.random.seed(2023)
listLengths = np.array([3, 4, 5])
trialsPerLength = 1

# Generate operands
firstOperands = np.random.randint(1, 11, np.sum(listLengths * trialsPerLength))
secondOperands = np.random.choice(
    np.delete(np.arange(-9, 11), 10),
    size=np.sum(listLengths * trialsPerLength),
    replace=True,
)

# Get the answer for operands
answers = firstOperands + secondOperands

# Offset half of them to be wrong
wrongAnswers = answers.copy()
wrongAnswers[: np.sum(listLengths * trialsPerLength) // 2] += np.random.randint(
    1, 4, np.sum(listLengths * trialsPerLength) // 2
)


operations = []
for i in range(len(firstOperands)):
    # Check if second operand is negative
    if secondOperands[i] < 0:
        operations.append(
            str(firstOperands[i])
            + " - "
            + str(abs(secondOperands[i]))
            + " = "
            + str(wrongAnswers[i])
        )
    else:
        operations.append(
            str(firstOperands[i])
            + " + "
            + str(secondOperands[i])
            + " = "
            + str(wrongAnswers[i])
        )

# Shuffle
np.random.shuffle(operations)

# Create trials for each length
allLetters = [
    "b",
    "c",
    "d",
    "f",
    "g",
    "h",
    "j",
    "k",
    "l",
    "m",
    "n",
    "p",
    "q",
    "r",
    "s",
    "t",
    "v",
    "w",
    "x",
    "z",
]
trials = []
for trial in range(trialsPerLength):
    for length in listLengths:
        trials = trials + [
            {
                "TrialN": -1,
                "Load": int(length),
                "Operations": [operations.pop() for i in range(length)],
                "Letters": list(
                    np.random.choice(allLetters, size=length, replace=False)
                ),
            }
        ]


listLengths = np.array([4, 5, 6, 7, 8])
trialsPerLength = 3

# Generate operands
firstOperands = np.random.randint(1, 11, np.sum(listLengths * trialsPerLength))
secondOperands = np.random.choice(
    np.delete(np.arange(-9, 11), 10),
    size=np.sum(listLengths * trialsPerLength),
    replace=True,
)

# Get the answer for operands
answers = firstOperands + secondOperands

# Offset half of them to be wrong
wrongAnswers = answers.copy()
wrongAnswers[: np.sum(listLengths * trialsPerLength) // 2] += np.random.randint(
    1, 4, np.sum(listLengths * trialsPerLength) // 2
)

operations = []
for i in range(len(firstOperands)):
    # Check if second operand is negative
    if secondOperands[i] < 0:
        operations.append(
            str(firstOperands[i])
            + " - "
            + str(abs(secondOperands[i]))
            + " = "
            + str(wrongAnswers[i])
        )
    else:
        operations.append(
            str(firstOperands[i])
            + " + "
            + str(secondOperands[i])
            + " = "
            + str(wrongAnswers[i])
        )

# Shuffle
np.random.shuffle(operations)


counter = 1
for trial in range(trialsPerLength):
    for length in listLengths:
        trials = trials + [
            {
                "TrialN": counter,
                "Load": int(length),
                "Operations": [operations.pop() for i in range(length)],
                "Letters": list(
                    np.random.choice(allLetters, size=length, replace=False)
                ),
            }
        ]
        counter += 1

# Write to json
with open("trials.json", "w") as f:
    json.dump(trials, f, indent=4)

print(operations)
