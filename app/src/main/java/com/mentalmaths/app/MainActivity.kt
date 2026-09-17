package com.mentalmaths.app

import android.os.Bundle
import androidx.activity.ComponentActivity
import androidx.activity.compose.setContent
import androidx.activity.viewModels
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.Surface
import androidx.compose.runtime.Composable
import androidx.compose.runtime.collectAsState
import androidx.compose.runtime.getValue
import androidx.compose.ui.Modifier
import com.mentalmaths.app.model.ScreenState
import com.mentalmaths.app.ui.screens.CategoryGridScreen
import com.mentalmaths.app.ui.screens.PracticeScreen
import com.mentalmaths.app.ui.screens.SummaryScreen
import com.mentalmaths.app.ui.theme.MentalMathsTheme
import com.mentalmaths.app.viewmodel.MentalMathsViewModel

class MainActivity : ComponentActivity() {

    private val viewModel: MentalMathsViewModel by viewModels()

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContent {
            MentalMathsTheme {
                Surface(
                    modifier = Modifier.fillMaxSize(),
                    color = MaterialTheme.colorScheme.background
                ) {
                    MentalMathsApp(viewModel)
                }
            }
        }
    }
}

@Composable
fun MentalMathsApp(viewModel: MentalMathsViewModel) {
    val uiState by viewModel.uiState.collectAsState()

    when (uiState.screenState) {
        ScreenState.CATEGORY_SELECTION -> {
            CategoryGridScreen(
                selectedOperation = uiState.selectedOperation,
                selectedDifficulty = uiState.selectedDifficulty,
                questionCount = uiState.questionCount,
                onOperationSelect = viewModel::selectOperation,
                onDifficultySelect = viewModel::selectDifficulty,
                onQuestionCountSelect = viewModel::setQuestionCount,
                onStartSession = viewModel::startPracticeSession
            )
        }
        ScreenState.PRACTICE -> {
            PracticeScreen(
                question = uiState.currentQuestion,
                currentIndex = uiState.currentQuestionIndex,
                totalQuestions = uiState.questions.size,
                sessionElapsedTimeMs = uiState.sessionElapsedTimeMs,
                currentQuestionTimeMs = uiState.currentQuestionTimeMs,
                onOptionSelected = viewModel::submitAnswer,
                onCancelSession = viewModel::resetToCategorySelection
            )
        }
        ScreenState.SUMMARY -> {
            SummaryScreen(
                summary = uiState.sessionSummary,
                onDone = viewModel::resetToCategorySelection
            )
        }
    }
}
