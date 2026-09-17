package com.mentalmaths.app.service

import com.mentalmaths.app.model.Difficulty
import com.mentalmaths.app.model.OperationType
import com.mentalmaths.app.model.Question
import java.util.UUID
import kotlin.math.abs
import kotlin.math.max
import kotlin.math.min
import kotlin.random.Random

object QuestionGenerator {

    fun generateQuestions(
        operationType: OperationType,
        difficulty: Difficulty,
        count: Int
    ): List<Question> {
        return List(count) {
            val targetOp = if (operationType == OperationType.MIXED) {
                val nonMixedOps = OperationType.entries.filter { it != OperationType.MIXED }
                nonMixedOps.random()
            } else {
                operationType
            }
            generateSingleQuestion(targetOp, difficulty)
        }
    }

    private fun generateSingleQuestion(operationType: OperationType, difficulty: Difficulty): Question {
        return when (operationType) {
            OperationType.ADDITION -> generateAddition(difficulty)
            OperationType.SUBTRACTION -> generateSubtraction(difficulty)
            OperationType.MULTIPLICATION -> generateMultiplication(difficulty)
            OperationType.DIVISION -> generateDivision(difficulty)
            OperationType.SQUARES -> generateSquares(difficulty)
            OperationType.SQUARE_ROOTS -> generateSquareRoots(difficulty)
            OperationType.PERCENTAGES -> generatePercentages(difficulty)
            OperationType.MIXED -> generateAddition(difficulty) // Fallback
        }
    }

    private fun generateAddition(difficulty: Difficulty): Question {
        val (minVal, maxVal) = when (difficulty) {
            Difficulty.EASY -> 2 to 30
            Difficulty.MEDIUM -> 20 to 150
            Difficulty.HARD -> 100 to 999
        }
        val a = Random.nextInt(minVal, maxVal)
        val b = Random.nextInt(minVal, maxVal)
        val answer = a + b
        val options = generateDistractors(answer, difficulty)
        return Question(
            id = UUID.randomUUID().toString(),
            expression = "$a + $b",
            correctAnswer = answer,
            options = options,
            operationType = OperationType.ADDITION
        )
    }

    private fun generateSubtraction(difficulty: Difficulty): Question {
        val (minVal, maxVal) = when (difficulty) {
            Difficulty.EASY -> 5 to 40
            Difficulty.MEDIUM -> 30 to 200
            Difficulty.HARD -> 150 to 999
        }
        val a = Random.nextInt(minVal, maxVal)
        val b = Random.nextInt(minVal, a) // ensure positive answer
        val answer = a - b
        val options = generateDistractors(answer, difficulty)
        return Question(
            id = UUID.randomUUID().toString(),
            expression = "$a − $b",
            correctAnswer = answer,
            options = options,
            operationType = OperationType.SUBTRACTION
        )
    }

    private fun generateMultiplication(difficulty: Difficulty): Question {
        val (aRange, bRange) = when (difficulty) {
            Difficulty.EASY -> (2..12) to (2..10)
            Difficulty.MEDIUM -> (6..20) to (4..15)
            Difficulty.HARD -> (12..40) to (11..30)
        }
        val a = Random.nextInt(aRange.first, aRange.last + 1)
        val b = Random.nextInt(bRange.first, bRange.last + 1)
        val answer = a * b
        val options = generateDistractors(answer, difficulty)
        return Question(
            id = UUID.randomUUID().toString(),
            expression = "$a × $b",
            correctAnswer = answer,
            options = options,
            operationType = OperationType.MULTIPLICATION
        )
    }

    private fun generateDivision(difficulty: Difficulty): Question {
        val (divisorRange, quotientRange) = when (difficulty) {
            Difficulty.EASY -> (2..10) to (2..12)
            Difficulty.MEDIUM -> (3..15) to (6..20)
            Difficulty.HARD -> (7..25) to (12..35)
        }
        val b = Random.nextInt(divisorRange.first, divisorRange.last + 1)
        val answer = Random.nextInt(quotientRange.first, quotientRange.last + 1)
        val a = b * answer
        val options = generateDistractors(answer, difficulty)
        return Question(
            id = UUID.randomUUID().toString(),
            expression = "$a ÷ $b",
            correctAnswer = answer,
            options = options,
            operationType = OperationType.DIVISION
        )
    }

    private fun generateSquares(difficulty: Difficulty): Question {
        val range = when (difficulty) {
            Difficulty.EASY -> 2..12
            Difficulty.MEDIUM -> 11..25
            Difficulty.HARD -> 20..40
        }
        val base = Random.nextInt(range.first, range.last + 1)
        val answer = base * base
        val options = generateDistractors(answer, difficulty)
        return Question(
            id = UUID.randomUUID().toString(),
            expression = "$base²",
            correctAnswer = answer,
            options = options,
            operationType = OperationType.SQUARES
        )
    }

    private fun generateSquareRoots(difficulty: Difficulty): Question {
        val range = when (difficulty) {
            Difficulty.EASY -> 2..12
            Difficulty.MEDIUM -> 11..25
            Difficulty.HARD -> 20..35
        }
        val answer = Random.nextInt(range.first, range.last + 1)
        val squared = answer * answer
        val options = generateDistractors(answer, difficulty)
        return Question(
            id = UUID.randomUUID().toString(),
            expression = "√$squared",
            correctAnswer = answer,
            options = options,
            operationType = OperationType.SQUARE_ROOTS
        )
    }

    private fun generatePercentages(difficulty: Difficulty): Question {
        val percentageList = when (difficulty) {
            Difficulty.EASY -> listOf(10, 20, 25, 50, 100)
            Difficulty.MEDIUM -> listOf(5, 15, 30, 40, 60, 75)
            Difficulty.HARD -> listOf(12, 18, 35, 45, 65, 85)
        }
        val p = percentageList.random()
        val multiplier = Random.nextInt(1, 20)
        // Ensure whole integer answers
        val base = if (p == 25 || p == 75) multiplier * 4 else multiplier * 10
        val answer = (base * p) / 100
        val options = generateDistractors(answer, difficulty)
        return Question(
            id = UUID.randomUUID().toString(),
            expression = "$p% of $base",
            correctAnswer = answer,
            options = options,
            operationType = OperationType.PERCENTAGES
        )
    }

    private fun generateDistractors(correctAnswer: Int, difficulty: Difficulty): List<Int> {
        val optionsSet = mutableSetOf(correctAnswer)
        val variance = when {
            abs(correctAnswer) <= 15 -> 5
            abs(correctAnswer) <= 100 -> 15
            else -> 40
        }

        val offsets = listOf(-10, -5, -2, -1, 1, 2, 5, 10, -15, 15, -20, 20).shuffled()
        for (offset in offsets) {
            if (optionsSet.size >= 4) break
            val candidate = correctAnswer + offset
            if (candidate >= 0 && candidate != correctAnswer) {
                optionsSet.add(candidate)
            }
        }

        var counter = 1
        while (optionsSet.size < 4) {
            val candidate = max(0, correctAnswer + if (counter % 2 == 0) counter else -counter)
            optionsSet.add(candidate)
            counter++
        }

        return optionsSet.toList().shuffled()
    }
}
