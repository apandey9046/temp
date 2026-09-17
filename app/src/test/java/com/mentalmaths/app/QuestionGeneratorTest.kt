package com.mentalmaths.app

import com.mentalmaths.app.model.Difficulty
import com.mentalmaths.app.model.OperationType
import com.mentalmaths.app.service.QuestionGenerator
import org.junit.Assert.assertEquals
import org.junit.Assert.assertTrue
import org.junit.Test

class QuestionGeneratorTest {

    @Test
    fun testGenerateQuestionsCountAndOptions() {
        OperationType.entries.forEach { op ->
            Difficulty.entries.forEach { diff ->
                val questions = QuestionGenerator.generateQuestions(op, diff, 5)
                assertEquals(5, questions.size)
                questions.forEach { q ->
                    assertEquals(4, q.options.size)
                    assertTrue("Correct answer ${q.correctAnswer} must be in options ${q.options}", q.options.contains(q.correctAnswer))
                    assertEquals(4, q.options.toSet().size) // Ensure options are unique
                }
            }
        }
    }

    @Test
    fun testAdditionAccuracy() {
        val questions = QuestionGenerator.generateQuestions(OperationType.ADDITION, Difficulty.EASY, 10)
        questions.forEach { q ->
            val parts = q.expression.split(" + ")
            val a = parts[0].toInt()
            val b = parts[1].toInt()
            assertEquals(a + b, q.correctAnswer)
        }
    }

    @Test
    fun testMultiplicationAccuracy() {
        val questions = QuestionGenerator.generateQuestions(OperationType.MULTIPLICATION, Difficulty.EASY, 10)
        questions.forEach { q ->
            val parts = q.expression.split(" × ")
            val a = parts[0].toInt()
            val b = parts[1].toInt()
            assertEquals(a * b, q.correctAnswer)
        }
    }

    @Test
    fun testSquaresAccuracy() {
        val questions = QuestionGenerator.generateQuestions(OperationType.SQUARES, Difficulty.EASY, 10)
        questions.forEach { q ->
            val base = q.expression.replace("²", "").toInt()
            assertEquals(base * base, q.correctAnswer)
        }
    }
}
