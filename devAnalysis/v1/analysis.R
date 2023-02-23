library(tidyverse)
library(dplyr)
library(BayesFactor)
library(psych)
library(GGally)
setwd("/data/WMjs/devAnalysis/v1")

long2Matrix <- function(data, idCol, corrCol, trialNCol, standardize = FALSE) {
    # Create matrix
    taskMatrix <- matrix(
        -1, nrow(unique(data[idCol])),
        nrow(unique(data[trialNCol]))
    )
    taskMatrix <- data.frame(taskMatrix)
    sbjs <- data[idCol] |>
        unique() |>
        pull() |>
        sort() |>
        as.character()
    trials <- unique(data[trialNCol]) |> pull()
    row.names(taskMatrix) <- sbjs
    colnames(taskMatrix) <- trials

    for (trial in trials) {
        for (sbj in sbjs) {
            taskMatrix[sbj, trial] <- data[data[trialNCol] == trial &
                data[idCol] == sbj, corrCol]
        }
    }

    # Save raw matrix for later
    rawInfo <- taskMatrix

    # Add mean row
    taskMatrix <- rbind(taskMatrix, mean = apply(taskMatrix, 2, mean))

    # Add participant mean row
    taskMatrix <- cbind(taskMatrix, Sum = apply(taskMatrix, 1, sum))

    # Add correlation row
    totals <- taskMatrix[seq_len(nrow(taskMatrix) - 1), "Sum"]
    tmp <- c()
    for (col in seq_len(ncol(rawInfo))) {
        tmp <- c(tmp, cor(rawInfo[col], totals - rawInfo[col]))
    }
    taskMatrix["cor", ] <- c(tmp, 1)

    # Add variance row
    sbjs <- as.character(t(unique(data[idCol])))
    taskMatrix <- rbind(taskMatrix, var = apply(taskMatrix[sbjs, ], 2, var))

    return(taskMatrix)
}

corMatrix <- function(data, reliability, nullInterval = NULL, rscale = NULL) {
    dataNames <- names(data)
    nTasks <- ncol(data)
    outMat <- matrix(
        data = NA, nrow = nTasks, ncol = nTasks,
        dimnames = list(dataNames, dataNames)
    )

    # First pass
    for (i in 1:nTasks) {
        # Fill in reliability first
        outMat[i, i] <- round(reliability[i], digits = 2)

        # Filling in matrix
        for (j in (i + 1):nTasks) {
            if (j > nTasks || i == j) {
                next
            }
            # Calculate BF
            bf <- correlationBF(pull(data[, i]), pull(data[, j]),
                nullInterval = nullInterval,
                rscale = rscale
            )

            # Correlation with BFs
            if (length(bf) == 2) {
                rho <- summary(posterior(bf[2],
                    iterations = 10000,
                    progress = FALSE
                ))$statistics[1, 1]
                bf <- extractBF(bf[2])$bf
            } else {
                rho <- summary(posterior(bf,
                    iterations = 10000,
                    progress = FALSE
                ))$statistics[1, 1]
                bf <- extractBF(bf)$bf
            }

            outMat[j, i] <- paste0(
                round(rho, digits = 4), " (",
                round(bf, digits = 2), ")"
            )
            outMat[i, j] <- round(rho / sqrt(reliability[i] * reliability[j]),
                digits = 2
            )
        }
    }

    return(outMat)
}

disattCor <- function(rxy, rxx, ryy) {
    return(rxy / sqrt(rxx * ryy))
}

# Task hashes
nBackHash <- c("a112b6b2ec1c89f466739769d427f3bb")
bindingHash <- c("678bcfaa22c3d7a381324af54e912002")

# Load data
dataDir <- "./data/"
dataFiles <- list.files(dataDir)

nBackPath <- paste0(
    dataDir,
    dataFiles[grep("nback-digits", dataFiles)]
)
nBackData <- read_csv(nBackPath) |>
    filter(
        TestTrial, Source == "prolific",
        source_code_version %in% nBackHash
    ) |>
    select(
        SbjID, Study, Source, OrigTime, StartTime, rt, stimulus,
        response, TrialN, ChangeIdx, Digits, CorrRes, Corr
    )
nBackSummary <- nBackData |>
    group_by(SbjID) |>
    summarise(
        MeanPerf = mean(Corr)
    )
nBackMatrix <- long2Matrix(nBackData, "SbjID", "Corr", "TrialN")
tmp <- nBackMatrix[, seq_len(ncol(nBackMatrix) - 1)]
tmp <- tmp[, !is.na(tmp[c("cor"), ])]
tmp <- tmp[seq_len(nrow(tmp) - 3), ]
nBackRel <- splitHalf(tmp, check.keys = FALSE)$lambda2



bindingPath <- paste0(
    dataDir,
    dataFiles[grep("binding-verbalnumerical", dataFiles)]
)
bindingData <- read_csv(bindingPath) |>
    filter(TestTrial, Source == "prolific") |>
    select(
        SbjID, Study, Source, OrigTime, StartTime, rt, stimulus,
        response, TrialN, ProbeType, Probe, Pairs, Choices, CorrRes, Corr
    )
bindingSummary <- bindingData |>
    group_by(SbjID) |>
    summarise(
        MeanPerf = mean(Corr)
    )
bindingMatrix <- long2Matrix(bindingData, "SbjID", "Corr", "TrialN")
tmp <- bindingMatrix[, seq_len(ncol(bindingMatrix) - 1)]
tmp <- tmp[, !is.na(tmp[c("cor"), ])]
tmp <- tmp[seq_len(nrow(tmp) - 3), ]
bindingRel <- splitHalf(tmp, check.keys = FALSE)$lambda2

allSummary <- inner_join(nBackSummary, bindingSummary, by = "SbjID")
names(allSummary) <- c("SbjID", "nBack", "Binding")

ggpairs(allSummary, columns = 2:3)

# save data
write_csv(allSummary, "./output/allSummary.csv")
write_csv(nBackSummary, "./output/nBackSummary.csv")
write_csv(bindingSummary, "./output/bindingSummary.csv")
write_csv(nBackData, "./output/nBackData.csv")
write_csv(bindingData, "./output/bindingData.csv")
write.csv(nBackMatrix, "./output/nBackMatrix.csv")
write.csv(bindingMatrix, "./output/bindingMatrix.csv")
