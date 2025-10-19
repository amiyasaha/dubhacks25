const MAX_CREDIT_SCORE = 100;
const SMOOTHING_FACTOR = 0.35;
const BASE_EXPECTATION = 0.60;
const MAX_EXPECTATION = 0.95;
const EXPECTATION_GROWTH_RATE = 1.5;
const MAX_SCORE_CHANGE = 6.0;
const GAIN_UP = 8.0;
const GAIN_DOWN = 10.0;
const NEGATIVE_TASK_PENALTY = 1.5;

function clamp(value, lowerBound, upperBound) {
  return Math.max(lowerBound, Math.min(upperBound, value));
}

function expectedCompletionRatio(currentScore) {
  const normalizedScore = currentScore / MAX_CREDIT_SCORE;
  return BASE_EXPECTATION + (MAX_EXPECTATION - BASE_EXPECTATION) * Math.pow(normalizedScore, EXPECTATION_GROWTH_RATE);
}

function performanceToScoreChange(performanceGap) {
  if (performanceGap >= 0) {
    return MAX_SCORE_CHANGE * (1 - Math.exp(-GAIN_UP * performanceGap));
  } else {
    return -MAX_SCORE_CHANGE * (1 - Math.exp(GAIN_DOWN * performanceGap));
  }
}

function updateCreditScore(currentScore, previousSmoothedRatio, numTasksCompleted, numNegativeTasks, numTotalTasks) {
  if (numTotalTasks <= 0) {
    return { newCreditScore: currentScore, newSmoothedRatio: previousSmoothedRatio };
  }

  let rawCompletionRatio = (numTasksCompleted - NEGATIVE_TASK_PENALTY * numNegativeTasks) / numTotalTasks;
  rawCompletionRatio = clamp(rawCompletionRatio, 0.0, 1.0);

  const smoothedRatio = SMOOTHING_FACTOR * rawCompletionRatio + (1 - SMOOTHING_FACTOR) * previousSmoothedRatio;

  const targetRatio = expectedCompletionRatio(currentScore);
  const performanceGap = smoothedRatio - targetRatio;
  const scoreChange = performanceToScoreChange(performanceGap);

  let newCreditScore = clamp(currentScore + scoreChange, 0, MAX_CREDIT_SCORE);
  newCreditScore = Math.round(newCreditScore);

  return { newCreditScore, newSmoothedRatio: smoothedRatio };
}

function calculateUpdatedCredit(currentScore, previousSmoothedRatio, numTasksCompleted, numNegativeTasks, numTotalTasks, minAmount, maxAmount) {
  const { newCreditScore, newSmoothedRatio } = updateCreditScore(
    currentScore,
    previousSmoothedRatio,
    numTasksCompleted,
    numNegativeTasks,
    numTotalTasks
  );

  const pointIncrease = Math.ceil((maxAmount - minAmount) / MAX_CREDIT_SCORE);
  const newAmount = minAmount + pointIncrease * (newCreditScore - currentScore);

  return {
    newCreditScore,
    newSmoothedRatio,
    newAmount
  };
}

// Example usage:
// const result = calculateUpdatedCredit(0, 0.6, 8, 1, 10, 10, 50);
// console.log(result);
