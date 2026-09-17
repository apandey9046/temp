package com.mentalmaths.app.viewmodel

import androidx.lifecycle.ViewModel
import androidx.lifecycle.viewModelScope
import com.mentalmaths.app.model.Difficulty
import com.mentalmaths.app.model.OperationType
import com.mentalmaths.app.model.Question
import com.mentalmaths.app.model.ScreenState
import com.mentalmaths.app.model.SessionSummary
import com.mentalmaths.app.service.QuestionGenerator
import kotlinx.coroutines.Job
import kotlinx.coroutines.delay
import kotlinx.coroutines.flow.MutableStateFlow
import kotlinx.coroutines.flow.StateFlow
import kotlinx.coroutines.flow.asStateFlow
import kotlinx.coroutines.launch

data class PracticeUiState(
    val screenState: ScreenState = ScreenState.CATEGORY_SELECTION,
    val selectedOperation: OperationType = OperationType.ADDITION,
    val selectedDifficulty: Difficulty = Difficulty.EASY,
    val questionCount: Int = 10,
    val questions: List<Question> = emptyList(),
    val currentQuestionIndex: Int = 0,
    val sessionElapsedTimeMs: Long = 0L,
    val currentQuestionTimeMs: Long = 0L,
    val sessionSummary: SessionSummary? = null,
    val history: List<SessionSummary> = emptyList()
) {
    val currentQuestion: Question?
        get() = questions.getOrNull(currentQuestionIndex)
}

class MentalMathsViewModel : ViewModel() {

    private val _uiState = MutableStateFlow(PracticeUiState())
    val uiState: StateFlow<PracticeUiState> = _uiState.asStateFlow()

    private var timerJob: Job? = null
    private var questionStartTimeMs: Long = 0L
    private var sessionStartTimeMs: Long = 0L

    fun selectOperation(operationType: OperationType) {
        _uiState.value = _uiState.value.copy(selectedOperation = operationType)
    }

    fun selectDifficulty(difficulty: Difficulty) {
        _uiState.value = _uiState.value.copy(selectedDifficulty = difficulty)
    }

    fun setQuestionCount(count: Int) {
        _uiState.value = _uiState.value.copy(questionCount = count)
    }

    fun startPracticeSession() {
        val currentState = _uiState.value
        val newQuestions = QuestionGenerator.generateQuestions(
            operationType = currentState.selectedOperation,
            difficulty = currentState.selectedDifficulty,
            count = currentState.questionCount
        )

        _uiState.value = currentState.copy(
            screenState = ScreenState.PRACTICE,
            questions = newQuestions,
            currentQuestionIndex = 0,
            sessionElapsedTimeMs = 0L,
            currentQuestionTimeMs = 0L,
            sessionSummary = null
        )

        sessionStartTimeMs = System.currentTimeMillis()
        questionStartTimeMs = System.currentTimeMillis()
        startTimer()
    }

    private fun startTimer() {
        timerJob?.cancel()
        timerJob = viewModelScope.launch {
            while (true) {
                delay(100L)
                val now = System.currentTimeMillis()
                val sessionElapsed = now - sessionStartTimeMs
                val questionElapsed = now - questionStartTimeMs
                _uiState.value = _uiState.value.copy(
                    sessionElapsedTimeMs = sessionElapsed,
                    currentQuestionTimeMs = questionElapsed
                )
            }
        }
    }

    fun submitAnswer(selectedAnswer: Int) {
        val currentState = _uiState.value
        val currentIndex = currentState.currentQuestionIndex
        val currentQ = currentState.questions.getOrNull(currentIndex) ?: return
        val timeSpentOnQ = System.currentTimeMillis() - questionStartTimeMs

        val updatedQuestion = currentQ.copy(
            userSelectedAnswer = selectedAnswer,
            timeTakenMs = timeSpentOnQ
        )

        val updatedQuestions = currentState.questions.toMutableList()
        updatedQuestions[currentIndex] = updatedQuestion

        if (currentIndex + 1 < currentState.questions.size) {
            questionStartTimeMs = System.currentTimeMillis()
            _uiState.value = currentState.copy(
                questions = updatedQuestions,
                currentQuestionIndex = currentIndex + 1,
                currentQuestionTimeMs = 0L
            )
        } else {
            // Quiz completed
            timerJob?.cancel()
            val totalTime = System.currentTimeMillis() - sessionStartTimeMs
            val correctCount = updatedQuestions.count { it.isCorrect }
            val accuracy = if (updatedQuestions.isNotEmpty()) (correctCount * 100) / updatedQuestions.size else 0
            val avgTime = if (updatedQuestions.isNotEmpty()) totalTime / updatedQuestions.size else 0L

            val summary = SessionSummary(
                totalQuestions = updatedQuestions.size,
                correctCount = correctCount,
                totalTimeMs = totalTime,
                averageTimePerQuestionMs = avgTime,
                accuracyPercentage = accuracy,
                questions = updatedQuestions,
                operationType = currentState.selectedOperation,
                difficulty = currentState.selectedDifficulty
            )

            val updatedHistory = listOf(summary) + currentState.history

            _uiState.value = currentState.copy(
                screenState = ScreenState.SUMMARY,
                questions = updatedQuestions,
                sessionSummary = summary,
                history = updatedHistory
            )
        }
    }

    fun resetToCategorySelection() {
        timerJob?.cancel()
        _uiState.value = _uiState.value.copy(
            screenState = ScreenState.CATEGORY_SELECTION,
            questions = emptyList(),
            currentQuestionIndex = 0,
            sessionSummary = null
        )
    }

    override fun onCleared() {
        super.onCleared()
        timerJob?.cancel()
    }
}
