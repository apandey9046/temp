package com.mentalmaths.app.ui.theme

import androidx.compose.foundation.isSystemInDarkTheme
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.darkColorScheme
import androidx.compose.material3.lightColorScheme
import androidx.compose.runtime.Composable

private val DarkColorScheme = darkColorScheme(
    primary = MonoWhite,
    onPrimary = MonoBlack,
    primaryContainer = MonoDarkGray,
    onPrimaryContainer = MonoWhite,
    secondary = MonoLightGray,
    onSecondary = MonoBlack,
    background = MonoBlack,
    onBackground = MonoWhite,
    surface = MonoDarkGray,
    onSurface = MonoWhite,
    surfaceVariant = MonoMediumDarkGray,
    onSurfaceVariant = MonoSubtleGray,
    outline = MonoBorderDark
)

private val LightColorScheme = lightColorScheme(
    primary = MonoBlack,
    onPrimary = MonoWhite,
    primaryContainer = MonoOffWhite,
    onPrimaryContainer = MonoBlack,
    secondary = MonoGray,
    onSecondary = MonoWhite,
    background = MonoWhite,
    onBackground = MonoBlack,
    surface = MonoOffWhite,
    onSurface = MonoBlack,
    surfaceVariant = MonoSubtleGray,
    onSurfaceVariant = MonoDarkGray,
    outline = MonoBorderLight
)

@Composable
fun MentalMathsTheme(
    darkTheme: Boolean = isSystemInDarkTheme(),
    content: @Composable () -> Unit
) {
    val colorScheme = if (darkTheme) DarkColorScheme else LightColorScheme

    MaterialTheme(
        colorScheme = colorScheme,
        typography = Typography,
        content = content
    )
}
