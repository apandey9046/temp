package com.mentalmaths.app.model

enum class OperationType(val displayName: String, val symbol: String, val description: String) {
    ADDITION("Addition", "+", "Speed addition of numbers"),
    SUBTRACTION("Subtraction", "−", "Subtractions & differences"),
    MULTIPLICATION("Multiplication", "×", "Times tables & products"),
    DIVISION("Division", "÷", "Integer division & quotients"),
    SQUARES("Squares", "x²", "Square of numbers 1-30"),
    SQUARE_ROOTS("Square Roots", "√x", "Perfect square roots"),
    PERCENTAGES("Percentages", "%", "Quick percentage calculations"),
    MIXED("Mixed Operations", "±×", "Random mix of all operations")
}

enum class Difficulty(val displayName: String) {
    EASY("Easy"),
    MEDIUM("Medium"),
    HARD("Hard")
}

data class Question(
    val id: String,
    val expression: String,
    val correctAnswer: Int,
    val options: List<Int>,
    val userSelectedAnswer: Int? = null,
    val timeTakenMs: Long = 0L,
    val operationType: OperationType
) {
    val isCorrect: Boolean
        get() = userSelectedAnswer == correctAnswer
}

data class SessionSummary(
    val totalQuestions: Int,
    val correctCount: Int,
    val totalTimeMs: Long,
    val averageTimePerQuestionMs: Long,
    val accuracyPercentage: Int,
    val questions: List<Question>,
    val operationType: OperationType,
    val difficulty: Difficulty,
    val timestamp: Long = System.currentTimeMillis()
)

enum class ScreenState {
    CATEGORY_SELECTION,
    PRACTICE,
    SUMMARY
}
